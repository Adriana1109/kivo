import express from 'express';
import { getDatabase, dbPrepare } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);

// GET /api/agenda - Get agenda items from last 24 hours
router.get('/', async (req, res) => {
    try {
        await getDatabase();

        // Get items from last 24 hours only
        const items = dbPrepare(`
      SELECT * FROM agenda_rapida 
      WHERE user_id = ? 
        AND created_at > datetime('now', '-24 hours')
      ORDER BY created_at DESC
    `).all(req.user.id);

        res.json(items);
    } catch (error) {
        console.error('Get agenda error:', error);
        res.status(500).json({ error: 'Error al obtener agenda' });
    }
});

// POST /api/agenda - Create agenda item
router.post('/', async (req, res) => {
    try {
        const { texto } = req.body;

        if (!texto || !texto.trim()) {
            return res.status(400).json({ error: 'El texto es requerido' });
        }

        await getDatabase();

        const result = dbPrepare(`
      INSERT INTO agenda_rapida (user_id, texto)
      VALUES (?, ?)
    `).run(req.user.id, texto.trim());

        const item = {
            id: result.lastInsertRowid,
            user_id: req.user.id,
            texto: texto.trim(),
            created_at: new Date().toISOString()
        };

        res.status(201).json(item);
    } catch (error) {
        console.error('Create agenda error:', error);
        res.status(500).json({ error: 'Error al crear item de agenda' });
    }
});

// DELETE /api/agenda/:id - Delete agenda item
router.delete('/:id', async (req, res) => {
    try {
        await getDatabase();
        const id = parseInt(req.params.id, 10);

        const result = dbPrepare('DELETE FROM agenda_rapida WHERE id = ? AND user_id = ?')
            .run(id, req.user.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Item no encontrado' });
        }

        res.json({ message: 'Item eliminado' });
    } catch (error) {
        console.error('Delete agenda error:', error);
        res.status(500).json({ error: 'Error al eliminar item' });
    }
});

export default router;
