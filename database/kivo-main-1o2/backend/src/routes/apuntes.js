import express from 'express';
import { getDatabase, dbPrepare } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// GET /api/apuntes - Get all notes for current user
router.get('/', async (req, res) => {
  try {
    await getDatabase();
    const { materia_id } = req.query;
    
    let query = `
      SELECT a.*, m.nombre as materia_nombre, m.color as materia_color
      FROM apuntes a
      JOIN materias m ON a.materia_id = m.id
      WHERE a.user_id = ?
    `;
    
    if (materia_id) {
      query += ` AND a.materia_id = ${parseInt(materia_id)}`;
    }
    
    query += ' ORDER BY a.updated_at DESC';
    
    const apuntes = dbPrepare(query).all(req.user.id);
    res.json(apuntes);
  } catch (error) {
    console.error('Get apuntes error:', error);
    res.status(500).json({ error: 'Error al obtener apuntes' });
  }
});

// GET /api/apuntes/:id - Get single note
router.get('/:id', async (req, res) => {
  try {
    await getDatabase();
    const apunte = dbPrepare(`
      SELECT a.*, m.nombre as materia_nombre
      FROM apuntes a
      JOIN materias m ON a.materia_id = m.id
      WHERE a.id = ? AND a.user_id = ?
    `).get(req.params.id, req.user.id);
    
    if (!apunte) {
      return res.status(404).json({ error: 'Apunte no encontrado' });
    }
    
    res.json(apunte);
  } catch (error) {
    console.error('Get apunte error:', error);
    res.status(500).json({ error: 'Error al obtener apunte' });
  }
});

// POST /api/apuntes - Create new note
router.post('/', async (req, res) => {
  try {
    const { materia_id, titulo, contenido, tipo } = req.body;
    
    if (!materia_id || !titulo) {
      return res.status(400).json({ error: 'Materia y título son requeridos' });
    }
    
    await getDatabase();
    
    // Verify materia belongs to user
    const materia = dbPrepare('SELECT id FROM materias WHERE id = ? AND user_id = ?')
      .get(materia_id, req.user.id);
    if (!materia) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }
    
    const result = dbPrepare(`
      INSERT INTO apuntes (user_id, materia_id, titulo, contenido, tipo)
      VALUES (?, ?, ?, ?, ?)
    `).run(req.user.id, materia_id, titulo, contenido || '', tipo || 'texto');
    
    const apunte = dbPrepare('SELECT * FROM apuntes WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(apunte);
  } catch (error) {
    console.error('Create apunte error:', error);
    res.status(500).json({ error: 'Error al crear apunte' });
  }
});

// PUT /api/apuntes/:id - Update note
router.put('/:id', async (req, res) => {
  try {
    const { titulo, contenido } = req.body;
    await getDatabase();
    
    const existing = dbPrepare('SELECT id FROM apuntes WHERE id = ? AND user_id = ?')
      .get(req.params.id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Apunte no encontrado' });
    }
    
    dbPrepare(`
      UPDATE apuntes SET titulo = ?, contenido = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(titulo, contenido, req.params.id);
    
    const apunte = dbPrepare('SELECT * FROM apuntes WHERE id = ?').get(req.params.id);
    res.json(apunte);
  } catch (error) {
    console.error('Update apunte error:', error);
    res.status(500).json({ error: 'Error al actualizar apunte' });
  }
});

// DELETE /api/apuntes/:id - Delete note
router.delete('/:id', async (req, res) => {
  try {
    await getDatabase();
    const result = dbPrepare('DELETE FROM apuntes WHERE id = ? AND user_id = ?')
      .run(req.params.id, req.user.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Apunte no encontrado' });
    }
    
    res.json({ message: 'Apunte eliminado' });
  } catch (error) {
    console.error('Delete apunte error:', error);
    res.status(500).json({ error: 'Error al eliminar apunte' });
  }
});

export default router;
