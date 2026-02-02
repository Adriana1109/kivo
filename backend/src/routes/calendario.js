import express from 'express';
import { getDatabase, dbPrepare } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// GET /api/calendario - Get calendar events
router.get('/', async (req, res) => {
  try {
    await getDatabase();
    const { tipo } = req.query;
    
    let query = `
      SELECT e.*, m.nombre as materia_nombre, m.color as materia_color
      FROM eventos_calendario e
      LEFT JOIN materias m ON e.materia_id = m.id
      WHERE e.user_id = ?
    `;
    
    if (tipo) {
      query += ` AND e.tipo = '${tipo}'`;
    }
    
    query += ' ORDER BY e.fecha_inicio';
    
    const eventos = dbPrepare(query).all(req.user.id);
    res.json(eventos);
  } catch (error) {
    console.error('Get eventos error:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// POST /api/calendario - Create event
router.post('/', async (req, res) => {
  try {
    const { materia_id, titulo, descripcion, fecha_inicio, fecha_fin, tipo } = req.body;
    
    if (!titulo || !fecha_inicio) {
      return res.status(400).json({ error: 'Título y fecha de inicio son requeridos' });
    }
    
    await getDatabase();
    
    // If materia_id provided, verify ownership
    if (materia_id) {
      const materia = dbPrepare('SELECT id FROM materias WHERE id = ? AND user_id = ?')
        .get(materia_id, req.user.id);
      if (!materia) {
        return res.status(404).json({ error: 'Materia no encontrada' });
      }
    }
    
    const result = dbPrepare(`
      INSERT INTO eventos_calendario (user_id, materia_id, titulo, descripcion, fecha_inicio, fecha_fin, tipo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, materia_id || null, titulo, descripcion || null, fecha_inicio, fecha_fin || null, tipo || 'estudio');
    
    const evento = dbPrepare(`
      SELECT e.*, m.nombre as materia_nombre
      FROM eventos_calendario e
      LEFT JOIN materias m ON e.materia_id = m.id
      WHERE e.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json(evento);
  } catch (error) {
    console.error('Create evento error:', error);
    res.status(500).json({ error: 'Error al crear evento' });
  }
});

// PUT /api/calendario/:id - Update event
router.put('/:id', async (req, res) => {
  try {
    const { titulo, descripcion, fecha_inicio, fecha_fin, tipo, completado } = req.body;
    await getDatabase();
    
    const existing = dbPrepare('SELECT id FROM eventos_calendario WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    dbPrepare(`
      UPDATE eventos_calendario 
      SET titulo = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, tipo = ?, completado = ?
      WHERE id = ?
    `).run(titulo, descripcion, fecha_inicio, fecha_fin, tipo, completado ? 1 : 0, req.params.id);
    
    const evento = dbPrepare('SELECT * FROM eventos_calendario WHERE id = ?').get(req.params.id);
    res.json(evento);
  } catch (error) {
    console.error('Update evento error:', error);
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
});

// PATCH /api/calendario/:id/toggle - Toggle event completed
router.patch('/:id/toggle', async (req, res) => {
  try {
    await getDatabase();
    
    const evento = dbPrepare('SELECT * FROM eventos_calendario WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    const nuevoCompletado = evento.completado ? 0 : 1;
    dbPrepare('UPDATE eventos_calendario SET completado = ? WHERE id = ?')
      .run(nuevoCompletado, req.params.id);
    
    const updated = dbPrepare('SELECT * FROM eventos_calendario WHERE id = ?').get(req.params.id);
    res.json(updated);
  } catch (error) {
    console.error('Toggle evento error:', error);
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
});

// DELETE /api/calendario/:id - Delete event
router.delete('/:id', async (req, res) => {
  try {
    await getDatabase();
    const result = dbPrepare('DELETE FROM eventos_calendario WHERE id = ? AND user_id = ?')
      .run(req.params.id, req.user.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    
    res.json({ message: 'Evento eliminado' });
  } catch (error) {
    console.error('Delete evento error:', error);
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
});

export default router;
