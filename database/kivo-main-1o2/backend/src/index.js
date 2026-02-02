import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/db.js';

// Routes
import authRoutes from './routes/auth.js';
import materiasRoutes from './routes/materias.js';
import apuntesRoutes from './routes/apuntes.js';
import sesionesRoutes from './routes/sesiones.js';
import calendarioRoutes from './routes/calendario.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Kivo API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/materias', materiasRoutes);
app.use('/api/apuntes', apuntesRoutes);
app.use('/api/sesiones', sesionesRoutes);
app.use('/api/calendario', calendarioRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Kivo API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
