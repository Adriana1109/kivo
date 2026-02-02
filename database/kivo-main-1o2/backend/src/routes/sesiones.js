import express from 'express';
import { getDatabase, dbPrepare } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// GET /api/sesiones - Get study sessions with optional filters
router.get('/', async (req, res) => {
  try {
    await getDatabase();
    const { materia_id, limit } = req.query;
    
    let query = `
      SELECT s.*, m.nombre as materia_nombre, m.color as materia_color,
             t.nombre as tema_nombre
      FROM sesiones_estudio s
      JOIN materias m ON s.materia_id = m.id
      LEFT JOIN syllabus_temas t ON s.tema_id = t.id
      WHERE s.user_id = ?
    `;
    
    if (materia_id) {
      query += ` AND s.materia_id = ${parseInt(materia_id)}`;
    }
    
    query += ' ORDER BY s.fecha DESC, s.created_at DESC';
    
    if (limit) {
      query += ` LIMIT ${parseInt(limit)}`;
    }
    
    const sesiones = dbPrepare(query).all(req.user.id);
    res.json(sesiones);
  } catch (error) {
    console.error('Get sesiones error:', error);
    res.status(500).json({ error: 'Error al obtener sesiones' });
  }
});

// GET /api/sesiones/stats - Get study statistics
router.get('/stats', async (req, res) => {
  try {
    await getDatabase();
    const { periodo } = req.query;
    
    let dateFilter = '';
    if (periodo === 'semana') {
      dateFilter = "AND fecha >= date('now', '-7 days')";
    } else if (periodo === 'mes') {
      dateFilter = "AND fecha >= date('now', '-30 days')";
    }
    
    // Total hours by materia
    const porMateria = dbPrepare(`
      SELECT m.id, m.nombre, m.color, 
             COALESCE(SUM(s.duracion_minutos), 0) as minutos_totales,
             COUNT(s.id) as total_sesiones
      FROM materias m
      LEFT JOIN sesiones_estudio s ON m.id = s.materia_id ${dateFilter}
      WHERE m.user_id = ?
      GROUP BY m.id
      ORDER BY minutos_totales DESC
    `).all(req.user.id);
    
    // Total overall
    const totales = dbPrepare(`
      SELECT COALESCE(SUM(duracion_minutos), 0) as minutos_totales, COUNT(*) as total_sesiones
      FROM sesiones_estudio
      WHERE user_id = ? ${dateFilter}
    `).get(req.user.id);
    
    // Sessions per day (last 7 days)
    const porDia = dbPrepare(`
      SELECT fecha, SUM(duracion_minutos) as minutos
      FROM sesiones_estudio
      WHERE user_id = ? AND fecha >= date('now', '-7 days')
      GROUP BY fecha
      ORDER BY fecha
    `).all(req.user.id);
    
    res.json({
      porMateria,
      totales: {
        horas: Math.round((totales?.minutos_totales || 0) / 60 * 10) / 10,
        minutos: totales?.minutos_totales || 0,
        sesiones: totales?.total_sesiones || 0
      },
      porDia
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// POST /api/sesiones - Create study session
router.post('/', async (req, res) => {
  try {
    const { materia_id, tema_id, fecha, duracion_minutos, notas } = req.body;
    
    if (!materia_id || !fecha || !duracion_minutos) {
      return res.status(400).json({ error: 'Materia, fecha y duración son requeridos' });
    }
    
    await getDatabase();
    
    // Verify materia belongs to user
    const materia = dbPrepare('SELECT id FROM materias WHERE id = ? AND user_id = ?')
      .get(materia_id, req.user.id);
    if (!materia) {
      return res.status(404).json({ error: 'Materia no encontrada' });
    }
    
    const result = dbPrepare(`
      INSERT INTO sesiones_estudio (user_id, materia_id, tema_id, fecha, duracion_minutos, notas)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.user.id, materia_id, tema_id || null, fecha, duracion_minutos, notas || null);
    
    const sesion = dbPrepare(`
      SELECT s.*, m.nombre as materia_nombre
      FROM sesiones_estudio s
      JOIN materias m ON s.materia_id = m.id
      WHERE s.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json(sesion);
  } catch (error) {
    console.error('Create sesion error:', error);
    res.status(500).json({ error: 'Error al crear sesión' });
  }
});

// DELETE /api/sesiones/:id - Delete session
router.delete('/:id', async (req, res) => {
  try {
    await getDatabase();
    const result = dbPrepare('DELETE FROM sesiones_estudio WHERE id = ? AND user_id = ?')
      .run(req.params.id, req.user.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Sesión no encontrada' });
    }
    
    res.json({ message: 'Sesión eliminada' });
  } catch (error) {
    console.error('Delete sesion error:', error);
    res.status(500).json({ error: 'Error al eliminar sesión' });
  }
});

export default router;
