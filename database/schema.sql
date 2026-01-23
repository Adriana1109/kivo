-- ============================================
-- KIVO - Plataforma de Estudio Personalizada
-- SQLite Database Schema
-- ============================================
-- ============================================
-- TABLA: users (Usuarios)
-- Autenticación y datos básicos del usuario
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    nombre TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- ============================================
-- TABLA: materias (Subjects)
-- Materias del usuario con descripción
-- ============================================
CREATE TABLE IF NOT EXISTS materias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    color TEXT DEFAULT '#3b82f6',
    -- Color para identificar la materia
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
-- ============================================
-- TABLA: syllabus_unidades (Syllabus Units)
-- Unidades/semanas del syllabus de una materia
-- ============================================
CREATE TABLE IF NOT EXISTS syllabus_unidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    materia_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    -- Ej: "Semana 1", "Unidad 1"
    orden INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);
-- ============================================
-- TABLA: syllabus_temas (Syllabus Topics)
-- Temas dentro de cada unidad del syllabus
-- ============================================
CREATE TABLE IF NOT EXISTS syllabus_temas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unidad_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    visto INTEGER DEFAULT 0,
    -- 0 = no visto, 1 = visto
    orden INTEGER DEFAULT 0,
    fecha_visto DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (unidad_id) REFERENCES syllabus_unidades(id) ON DELETE CASCADE
);
-- ============================================
-- TABLA: sesiones_estudio (Study Sessions)
-- Registro de sesiones de estudio del usuario
-- ============================================
CREATE TABLE IF NOT EXISTS sesiones_estudio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    materia_id INTEGER NOT NULL,
    tema_id INTEGER,
    -- Opcional: tema específico estudiado
    fecha DATE NOT NULL,
    duracion_minutos INTEGER NOT NULL,
    notas TEXT,
    -- Notas sobre la sesión
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE,
    FOREIGN KEY (tema_id) REFERENCES syllabus_temas(id) ON DELETE
    SET NULL
);
-- ============================================
-- TABLA: apuntes (Notes)
-- Apuntes y materiales de estudio
-- ============================================
CREATE TABLE IF NOT EXISTS apuntes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    materia_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    contenido TEXT,
    -- Contenido de texto
    tipo TEXT DEFAULT 'texto',
    -- 'texto' o 'pdf'
    archivo_path TEXT,
    -- Ruta al archivo si es PDF
    archivo_nombre TEXT,
    -- Nombre original del archivo
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);
-- ============================================
-- TABLA: chat_historial (Chat History)
-- Historial de conversaciones con el chatbot
-- ============================================
CREATE TABLE IF NOT EXISTS chat_historial (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    materia_id INTEGER NOT NULL,
    rol TEXT NOT NULL,
    -- 'user' o 'assistant'
    mensaje TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE CASCADE
);
-- ============================================
-- TABLA: eventos_calendario (Calendar Events)
-- Eventos planificados en el calendario
-- ============================================
CREATE TABLE IF NOT EXISTS eventos_calendario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    materia_id INTEGER,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME,
    tipo TEXT DEFAULT 'estudio',
    -- 'estudio', 'examen', 'tarea', 'otro'
    completado INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (materia_id) REFERENCES materias(id) ON DELETE
    SET NULL
);
-- ============================================
-- ÍNDICES para optimizar consultas frecuentes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_materias_user ON materias(user_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_unidades_materia ON syllabus_unidades(materia_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_temas_unidad ON syllabus_temas(unidad_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_user ON sesiones_estudio(user_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_materia ON sesiones_estudio(materia_id);
CREATE INDEX IF NOT EXISTS idx_sesiones_fecha ON sesiones_estudio(fecha);
CREATE INDEX IF NOT EXISTS idx_apuntes_user ON apuntes(user_id);
CREATE INDEX IF NOT EXISTS idx_apuntes_materia ON apuntes(materia_id);
CREATE INDEX IF NOT EXISTS idx_chat_user_materia ON chat_historial(user_id, materia_id);
CREATE INDEX IF NOT EXISTS idx_eventos_user ON eventos_calendario(user_id);
CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON eventos_calendario(fecha_inicio);