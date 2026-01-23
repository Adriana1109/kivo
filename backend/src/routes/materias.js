import express from 'express';
import { getDatabase, dbPrepare } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/materias - Get all materias for current user
router.get('/', async (req, res) => {
  try {
    await getDatabase();
    const materias = dbPrepare(`
      SELECT m.*, 
        (SELECT COUNT(*) FROM syllabus_unidades WHERE materia_id = m.id) as total_unidades,
        (SELECT COUNT(*) FROM syllabus_temas st 
         JOIN syllabus_unidades su ON st.unidad_id = su.id 
         WHERE su.materia_id = m.id) as total_temas,
        (SELECT COUNT(*) FROM syllabus_temas st 
         JOIN syllabus_unidades su ON st.unidad_id = su.id 
         WHERE su.materia_id = m.id AND st.visto = 1) as temas_vistos
      FROM materias m
      WHERE m.user_id = ?
      ORDER BY m.created_at DESC
    `).all(req.user.id);
    
    res.json(materias);
  } catch (error) {
    console.error('Get materias error:', error);
    res.status(500).json({ error: 'Error al obtener materias' });
  }
});

// GET /api/materias/:id - Get materia with syllabus
router.get('/:id', async (req, res) => {
  try {
    await getDatabase();
    const materia = dbPrepare(`
      SELECT * FROM materias WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.id);
    
    if (!materia) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }
    
    // Get syllabus with units and topics
    const unidades = dbPrepare(`
      SELECT * FROM syllabus_unidades WHERE materia_id = ? ORDER BY orden
    `).all(materia.id);
    
    // Get topics for each unit
    for (const unidad of unidades) {
      unidad.temas = dbPrepare(`
        SELECT * FROM syllabus_temas WHERE unidad_id = ? ORDER BY orden
      `).all(unidad.id);
    }
    
    materia.syllabus = unidades;
    
    res.json(materia);
  } catch (error) {
    console.error('Get materia error:', error);
    res.status(500).json({ error: 'Error al obtener materia' });
  }
});

// POST /api/materias - Create new materia
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, color } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }
    
    await getDatabase();
    const result = dbPrepare(`
      INSERT INTO materias (user_id, nombre, descripcion, color) VALUES (?, ?, ?, ?)
    `).run(req.user.id, nombre, descripcion || null, color || '#3b82f6');
    
    const materia = dbPrepare('SELECT * FROM materias WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(materia);
  } catch (error) {
    console.error('Create materia error:', error);
    res.status(500).json({ error: 'Error al crear materia' });
  }
});

// PUT /api/materias/:id - Update materia
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion, color } = req.body;
    await getDatabase();
    
    // Check ownership
    const existing = dbPrepare('SELECT id FROM materias WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }
    
    dbPrepare(`
      UPDATE materias SET nombre = ?, descripcion = ?, color = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(nombre, descripcion, color, req.params.id);
    
    const materia = dbPrepare('SELECT * FROM materias WHERE id = ?').get(req.params.id);
    res.json(materia);
  } catch (error) {
    console.error('Update materia error:', error);
    res.status(500).json({ error: 'Error al actualizar materia' });
  }
});

// DELETE /api/materias/:id - Delete materia
router.delete('/:id', async (req, res) => {
  try {
    await getDatabase();
    
    const result = dbPrepare('DELETE FROM materias WHERE id = ? AND user_id = ?')
      .run(req.params.id, req.user.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }
    
    res.json({ message: 'Materia eliminada' });
  } catch (error) {
    console.error('Delete materia error:', error);
    res.status(500).json({ error: 'Error al eliminar materia' });
  }
});

// POST /api/materias/:id/unidades - Add unit to syllabus
router.post('/:id/unidades', async (req, res) => {
  try {
    const { nombre, orden } = req.body;
    await getDatabase();
    
    // Check ownership
    const materia = dbPrepare('SELECT id FROM materias WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
    if (!materia) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }
    
    // Get max orden if not provided
    let finalOrden = orden;
    if (finalOrden === undefined) {
      const maxOrden = dbPrepare('SELECT MAX(orden) as max FROM syllabus_unidades WHERE materia_id = ?')
        .get(req.params.id);
      finalOrden = (maxOrden?.max || 0) + 1;
    }
    
    const result = dbPrepare(`
      INSERT INTO syllabus_unidades (materia_id, nombre, orden) VALUES (?, ?, ?)
    `).run(req.params.id, nombre, finalOrden);
    
    const unidad = dbPrepare('SELECT * FROM syllabus_unidades WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(unidad);
  } catch (error) {
    console.error('Add unidad error:', error);
    res.status(500).json({ error: 'Error al agregar unidad' });
  }
});

// POST /api/materias/:id/unidades/:unidadId/temas - Add topic to unit
router.post('/:id/unidades/:unidadId/temas', async (req, res) => {
  try {
    const { nombre, descripcion, orden } = req.body;
    await getDatabase();
    
    // Check ownership through materia
    const unidad = dbPrepare(`
      SELECT su.id FROM syllabus_unidades su
      JOIN materias m ON su.materia_id = m.id
      WHERE su.id = ? AND m.user_id = ?
    `).get(req.params.unidadId, req.user.id);
    
    if (!unidad) {
      return res.status(404).json({ error: 'Unidad no encontrada' });
    }
    
    // Get max orden if not provided
    let finalOrden = orden;
    if (finalOrden === undefined) {
      const maxOrden = dbPrepare('SELECT MAX(orden) as max FROM syllabus_temas WHERE unidad_id = ?')
        .get(req.params.unidadId);
      finalOrden = (maxOrden?.max || 0) + 1;
    }
    
    const result = dbPrepare(`
      INSERT INTO syllabus_temas (unidad_id, nombre, descripcion, orden) VALUES (?, ?, ?, ?)
    `).run(req.params.unidadId, nombre, descripcion, finalOrden);
    
    const tema = dbPrepare('SELECT * FROM syllabus_temas WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(tema);
  } catch (error) {
    console.error('Add tema error:', error);
    res.status(500).json({ error: 'Error al agregar tema' });
  }
});

// PATCH /api/materias/temas/:temaId/toggle - Toggle topic as viewed
router.patch('/temas/:temaId/toggle', async (req, res) => {
  try {
    await getDatabase();
    
    // Check ownership through materia
    const tema = dbPrepare(`
      SELECT st.* FROM syllabus_temas st
      JOIN syllabus_unidades su ON st.unidad_id = su.id
      JOIN materias m ON su.materia_id = m.id
      WHERE st.id = ? AND m.user_id = ?
    `).get(req.params.temaId, req.user.id);
    
    if (!tema) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }
    
    const newVisto = tema.visto ? 0 : 1;
    const fechaVisto = newVisto ? new Date().toISOString() : null;
    
    dbPrepare(`
      UPDATE syllabus_temas SET visto = ?, fecha_visto = ? WHERE id = ?
    `).run(newVisto, fechaVisto, req.params.temaId);
    
    const updated = dbPrepare('SELECT * FROM syllabus_temas WHERE id = ?').get(req.params.temaId);
    res.json(updated);
  } catch (error) {
    console.error('Toggle tema error:', error);
    res.status(500).json({ error: 'Error al actualizar tema' });
  }
});

export default router;
