import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import bcrypt from 'bcryptjs';

const app = new Hono();

// Middleware CORS
app.use('/*', cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
}));

// JWT Secret helper
const getJwtSecret = (c) => c.env.JWT_SECRET || 'your-secret-key-safe-for-dev';

// Root Route
app.get('/', (c) => c.json({
    message: 'Welcome to Kivo API 🚀',
    endpoints: {
        health: '/api/health',
        auth: '/api/auth'
    },
    status: 'running'
}));

// Health Check
app.get('/api/health', (c) => c.json({ status: 'ok', platform: 'Cloudflare Workers 🚀' }));

// ==========================================
// AUTH UTILS
// ==========================================
// WebCrypto implementation for bcrypt/hash if needed or keep existing
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

const verifyPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

// ==========================================
// PUBLIC ROUTES
// ==========================================
app.post('/api/auth/register', async (c) => {
    try {
        const { email, password, nombre } = await c.req.json();

        if (!email || !password || password.length < 6) {
            return c.json({ error: 'Datos inválidos' }, 400);
        }

        const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
        if (existing) {
            return c.json({ error: 'El email ya está registrado' }, 400);
        }

        const password_hash = await hashPassword(password);

        const result = await c.env.DB.prepare(
            'INSERT INTO users (email, password_hash, nombre) VALUES (?, ?, ?)'
        ).bind(email, password_hash, nombre || null).run();

        if (!result.success) {
            throw new Error('Error insertando usuario');
        }

        const token = await sign({
            userId: result.meta.last_row_id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
        }, getJwtSecret(c), 'HS256');

        return c.json({
            message: 'Usuario registrado exitosamente',
            token,
            user: { id: result.meta.last_row_id, email, nombre }
        }, 201);
    } catch (e) {
        console.error(e);
        return c.json({ error: 'Error al registrar usuario', details: e.message, stack: e.stack }, 500);
    }
});

app.post('/api/auth/login', async (c) => {
    try {
        const { email, password } = await c.req.json();

        const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
        if (!user) return c.json({ error: 'Credenciales inválidas' }, 401);

        const isMatch = await verifyPassword(password, user.password_hash);
        if (!isMatch) return c.json({ error: 'Credenciales inválidas' }, 401);

        const { sign } = await import('hono/jwt');
        const token = await sign({
            userId: user.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
        }, getJwtSecret(c), 'HS256');

        return c.json({
            message: 'Login exitoso',
            token,
            user: { id: user.id, email: user.email, nombre: user.nombre }
        });
    } catch (e) {
        console.error(e);
        return c.json({ error: 'Error al iniciar sesión', details: e.message, stack: e.stack }, 500);
    }
});

// ==========================================
// PROTECTED ROUTES
// ==========================================
const protectedRoutes = new Hono();

// Auth Middleware
protectedRoutes.use('/*', async (c, next) => {
    const jwtMiddleware = jwt({ secret: getJwtSecret(c), alg: 'HS256' });
    return jwtMiddleware(c, next);
});

// ERROR HANDLER for Protected Routes
protectedRoutes.onError((err, c) => {
    console.error('Protected Route Error:', err);
    return c.json({
        error: 'Internal Server Error',
        details: err.message,
        stack: err.stack
    }, 500);
});

// Helper to get User ID safely
const getUserId = (c) => {
    const payload = c.get('jwtPayload');
    if (!payload || !payload.userId) {
        throw new Error('User ID not found in token payload');
    }
    return payload.userId;
};

// --- AUTH ---
protectedRoutes.get('/auth/me', async (c) => {
    const userId = getUserId(c);
    const user = await c.env.DB.prepare('SELECT id, email, nombre FROM users WHERE id = ?').bind(userId).first();
    return c.json({ user });
});

// --- MATERIAS ---
protectedRoutes.get('/materias', async (c) => {
    const userId = getUserId(c);
    const { results } = await c.env.DB.prepare(`
    SELECT m.*, 
      (SELECT COUNT(*) FROM syllabus_unidades WHERE materia_id = m.id) as total_unidades
    FROM materias m
    WHERE m.user_id = ?
    ORDER BY m.created_at DESC
  `).bind(userId).all();
    return c.json(results);
});

protectedRoutes.post('/materias', async (c) => {
    const userId = getUserId(c);
    const { nombre, descripcion, color, semestre, syllabus } = await c.req.json();

    const result = await c.env.DB.prepare(
        'INSERT INTO materias (user_id, nombre, descripcion, color, semestre, syllabus) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(userId, nombre, descripcion || null, color || '#3b82f6', semestre || null, syllabus || null).run();

    const materia = await c.env.DB.prepare('SELECT * FROM materias WHERE id = ?').bind(result.meta.last_row_id).first();
    return c.json(materia, 201);
});

protectedRoutes.put('/materias/:id', async (c) => {
    const userId = getUserId(c);
    const id = c.req.param('id');
    const { nombre, descripcion, color, semestre, syllabus } = await c.req.json();

    // Dynamically build update query
    let query = 'UPDATE materias SET ';
    const params = [];
    const updates = [];

    if (nombre !== undefined) { updates.push('nombre = ?'); params.push(nombre); }
    if (descripcion !== undefined) { updates.push('descripcion = ?'); params.push(descripcion); }
    if (color !== undefined) { updates.push('color = ?'); params.push(color); }
    if (semestre !== undefined) { updates.push('semestre = ?'); params.push(semestre); }
    if (syllabus !== undefined) { updates.push('syllabus = ?'); params.push(syllabus); }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    if (updates.length > 1) { // >1 because updated_at is always there
        query += updates.join(', ') + ' WHERE id = ? AND user_id = ?';
        params.push(id, userId);

        const result = await c.env.DB.prepare(query).bind(...params).run();

        if (result.meta.changes === 0) return c.json({ error: 'Materia no encontrada' }, 404);
    }

    const materia = await c.env.DB.prepare('SELECT * FROM materias WHERE id = ?').bind(id).first();
    return c.json(materia);
});

protectedRoutes.delete('/materias/:id', async (c) => {
    const userId = getUserId(c);
    const id = c.req.param('id');

    const result = await c.env.DB.prepare('DELETE FROM materias WHERE id = ? AND user_id = ?').bind(id, userId).run();

    if (result.meta.changes === 0) return c.json({ error: 'Materia no encontrada' }, 404);
    return c.json({ message: 'Materia eliminada' });
});

// --- APUNTES ---
protectedRoutes.get('/apuntes', async (c) => {
    const userId = getUserId(c);
    const materia_id = c.req.query('materia_id');

    let query = `
    SELECT a.*, m.nombre as materia_nombre, m.color as materia_color
    FROM apuntes a
    JOIN materias m ON a.materia_id = m.id
    WHERE a.user_id = ?
  `;

    const params = [userId];

    if (materia_id) {
        query += ` AND a.materia_id = ?`;
        params.push(parseInt(materia_id));
    }

    query += ' ORDER BY a.updated_at DESC';

    const { results } = await c.env.DB.prepare(query).bind(...params).all();
    return c.json(results);
});

protectedRoutes.post('/apuntes', async (c) => {
    const userId = getUserId(c);
    const { materia_id, titulo, contenido } = await c.req.json();

    // Verify materia
    const materia = await c.env.DB.prepare('SELECT id FROM materias WHERE id = ? AND user_id = ?').bind(materia_id, userId).first();
    if (!materia) return c.json({ error: 'Materia no encontrada' }, 404);

    const result = await c.env.DB.prepare(
        'INSERT INTO apuntes (user_id, materia_id, titulo, contenido, tipo) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, materia_id, titulo, contenido || '', 'texto').run();

    const apunte = await c.env.DB.prepare('SELECT * FROM apuntes WHERE id = ?').bind(result.meta.last_row_id).first();
    return c.json(apunte, 201);
});

protectedRoutes.put('/apuntes/:id', async (c) => {
    const userId = getUserId(c);
    const id = c.req.param('id');
    const { titulo, contenido } = await c.req.json();

    await c.env.DB.prepare(
        'UPDATE apuntes SET titulo = ?, contenido = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?'
    ).bind(titulo, contenido, id, userId).run();

    const apunte = await c.env.DB.prepare('SELECT * FROM apuntes WHERE id = ?').bind(id).first();
    if (!apunte) return c.json({ error: 'Apunte no encontrado' }, 404);
    return c.json(apunte);
});

protectedRoutes.delete('/apuntes/:id', async (c) => {
    const userId = getUserId(c);
    const id = c.req.param('id');

    const result = await c.env.DB.prepare('DELETE FROM apuntes WHERE id = ? AND user_id = ?').bind(id, userId).run();
    if (result.meta.changes === 0) return c.json({ error: 'Apunte no encontrado' }, 404);
    return c.json({ message: 'Apunte eliminado' });
});

// --- CALENDARIO ---
protectedRoutes.get('/calendario', async (c) => {
    const userId = getUserId(c);
    const tipo = c.req.query('tipo');

    let query = `
    SELECT e.*, m.nombre as materia_nombre, m.color as materia_color
    FROM eventos_calendario e
    LEFT JOIN materias m ON e.materia_id = m.id
    WHERE e.user_id = ?
  `;

    const params = [userId];
    if (tipo) {
        query += ` AND e.tipo = ?`;
        params.push(tipo);
    }

    query += ' ORDER BY e.fecha_inicio';

    const { results } = await c.env.DB.prepare(query).bind(...params).all();
    return c.json(results);
});

protectedRoutes.post('/calendario', async (c) => {
    const userId = getUserId(c);
    const { materia_id, titulo, descripcion, fecha_inicio, fecha_fin, tipo } = await c.req.json();

    const result = await c.env.DB.prepare(
        `INSERT INTO eventos_calendario (user_id, materia_id, titulo, descripcion, fecha_inicio, fecha_fin, tipo)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(userId, materia_id || null, titulo, descripcion || null, fecha_inicio, fecha_fin || null, tipo || 'estudio').run();

    const evento = await c.env.DB.prepare('SELECT * FROM eventos_calendario WHERE id = ?').bind(result.meta.last_row_id).first();

    if (!evento) {
        // Fallback if select fails
        return c.json({
            id: result.meta.last_row_id,
            user_id: userId,
            materia_id: materia_id || null,
            titulo,
            descripcion: descripcion || null,
            fecha_inicio,
            fecha_fin: fecha_fin || null,
            tipo: tipo || 'estudio',
            completado: 0
        }, 201);
    }

    return c.json(evento, 201);
});

protectedRoutes.put('/calendario/:id', async (c) => {
    const userId = getUserId(c);
    const id = c.req.param('id');
    const { titulo, descripcion, fecha_inicio, fecha_fin, tipo, completado } = await c.req.json();

    await c.env.DB.prepare(`
    UPDATE eventos_calendario 
    SET titulo = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, tipo = ?, completado = ?
    WHERE id = ? AND user_id = ?
  `).bind(titulo, descripcion, fecha_inicio, fecha_fin, tipo, completado ? 1 : 0, id, userId).run();

    const evento = await c.env.DB.prepare('SELECT * FROM eventos_calendario WHERE id = ?').bind(id).first();
    if (!evento) return c.json({ error: 'Evento no encontrado' }, 404);
    return c.json(evento);
});

protectedRoutes.patch('/calendario/:id/toggle', async (c) => {
    const userId = getUserId(c);
    const id = c.req.param('id');

    const evento = await c.env.DB.prepare('SELECT * FROM eventos_calendario WHERE id = ? AND user_id = ?').bind(id, userId).first();
    if (!evento) return c.json({ error: 'Evento no encontrado' }, 404);

    const nuevoEstado = evento.completado ? 0 : 1;

    await c.env.DB.prepare('UPDATE eventos_calendario SET completado = ? WHERE id = ?').bind(nuevoEstado, id).run();

    return c.json({ ...evento, completado: nuevoEstado });
});

protectedRoutes.delete('/calendario/:id', async (c) => {
    const userId = getUserId(c);
    const id = c.req.param('id');

    const result = await c.env.DB.prepare('DELETE FROM eventos_calendario WHERE id = ? AND user_id = ?').bind(id, userId).run();
    if (result.meta.changes === 0) return c.json({ error: 'Evento no encontrado' }, 404);
    return c.json({ message: 'Evento eliminado' });
});

// Mount protected routes
app.route('/api', protectedRoutes);

export default app;
