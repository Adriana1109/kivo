import express from 'express';
import { getDatabase, dbPrepare } from '../database/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { generateResponse } from '../services/ai-service.js';

const router = express.Router();

router.use(authenticateToken);

// POST /api/chat/:subjectId/ask
router.post('/:subjectId/ask', async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'La pregunta es requerida' });
        }

        await getDatabase();

        // 1. Verify ownership and get Subject details
        const materia = dbPrepare('SELECT * FROM materias WHERE id = ? AND user_id = ?')
            .get(subjectId, req.user.id);

        if (!materia) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }

        // 2. Fetch Syllabus (Units + Topics)
        const unidades = dbPrepare(`
      SELECT u.nombre as unidad, t.nombre as tema, t.descripcion 
      FROM syllabus_unidades u
      LEFT JOIN syllabus_temas t ON u.id = t.unidad_id
      WHERE u.materia_id = ?
      ORDER BY u.orden, t.orden
    `).all(subjectId);

        // Format Syllabus Context
        let syllabusContext = "SYLLABUS:\n";
        let currentUnit = null;
        unidades.forEach(row => {
            if (row.unidad !== currentUnit) {
                syllabusContext += `\nUnidad: ${row.unidad}\n`;
                currentUnit = row.unidad;
            }
            if (row.tema) {
                syllabusContext += `- ${row.tema}: ${row.descripcion || ''}\n`;
            }
        });

        // 3. Fetch Notes (Apuntes) content
        // Assuming 'apuntes' table has 'contenido_texto' or similar. 
        // If it's a PDF file path, we might only be able to use the Title for now unless we implement OCR/Text Extraction.
        // Let's assume for MVP we fetch Title and Description/Text if available.
        const apuntes = dbPrepare('SELECT titulo, descripcion, contenido FROM apuntes WHERE materia_id = ?')
            .all(subjectId);

        let notesContext = "\nAPUNTES (Tus notas):\n";
        if (apuntes.length === 0) {
            notesContext += "No hay apuntes registrados para esta materia.\n";
        } else {
            apuntes.forEach(note => {
                notesContext += `\nTitulo: ${note.titulo}\n`;
                if (note.contenido) notesContext += `Contenido: ${note.contenido}\n`;
                if (note.descripcion) notesContext += `Descripcion: ${note.descripcion}\n`;
            });
        }

        const fullContext = `
      Materia: ${materia.nombre}
      Descripcion: ${materia.descripcion}
      
      ${syllabusContext}
      
      ${notesContext}
    `;

        // 4. Generate AI Response
        const aiResponse = await generateResponse(fullContext, question);

        res.json({ answer: aiResponse });

    } catch (error) {
        console.error('Chatbot API error:', error);
        res.status(500).json({ error: 'Error al procesar tu pregunta con la IA.' });
    }
});

export default router;
