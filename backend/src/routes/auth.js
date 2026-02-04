import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase, dbPrepare } from '../database/db.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, nombre } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    await getDatabase();

    // Check if user exists
    const existingUser = dbPrepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const result = dbPrepare(
      'INSERT INTO users (email, password_hash, nombre) VALUES (?, ?, ?)'
    ).run(email, password_hash, nombre || null);

    // Generate token
    const token = generateToken(result.lastInsertRowid);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: result.lastInsertRowid,
        email,
        nombre
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    await getDatabase();

    // Find user
    const user = dbPrepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: req.user
  });
});

// PUT /api/auth/update - Update user profile
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    const userId = req.user.id;

    await getDatabase();

    // If updating email, check if it's already taken by another user
    if (email) {
      const existingUser = dbPrepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, userId);
      if (existingUser) {
        return res.status(400).json({ error: 'El email ya está en uso por otro usuario' });
      }
    }

    // Build update query dynamically
    let query = 'UPDATE users SET ';
    const params = [];

    if (nombre) {
      query += 'nombre = ?, ';
      params.push(nombre);
    }
    if (email) {
      query += 'email = ?, ';
      params.push(email);
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
      }
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      query += 'password_hash = ?, ';
      params.push(password_hash);
    }

    // Remove trailing comma and space
    query = query.slice(0, -2);
    query += ' WHERE id = ?';
    params.push(userId);

    dbPrepare(query).run(...params);

    // Fetch updated user to return
    const updatedUser = dbPrepare('SELECT id, email, nombre FROM users WHERE id = ?').get(userId);

    res.json({
      message: 'Perfil actualizado correctamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
});

export default router;
