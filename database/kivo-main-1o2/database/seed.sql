-- ============================================
-- KIVO - Datos de ejemplo (Seed Data)
-- Para desarrollo y testing
-- ============================================
-- Usuario admin (password: "admin")
-- Hash generado con bcrypt para "admin"
INSERT
    OR IGNORE INTO users (id, email, password_hash, nombre)
VALUES (
        1,
        'admin@kivo.app',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.mfVA.xZ/UEiAqJZN5K',
        'Administrador'
    );
-- Materias de ejemplo para admin
INSERT
    OR IGNORE INTO materias (id, user_id, nombre, descripcion, color)
VALUES (
        1,
        1,
        'Cálculo I',
        'Introducción al cálculo diferencial e integral',
        '#3b82f6'
    ),
    (
        2,
        1,
        'Programación',
        'Fundamentos de programación en Python',
        '#10b981'
    ),
    (
        3,
        1,
        'Física I',
        'Mecánica clásica y termodinámica',
        '#f59e0b'
    );
-- Unidades del syllabus para Cálculo I
INSERT
    OR IGNORE INTO syllabus_unidades (id, materia_id, nombre, orden)
VALUES (1, 1, 'Unidad 1: Límites', 1),
    (2, 1, 'Unidad 2: Derivadas', 2),
    (3, 1, 'Unidad 3: Aplicaciones de Derivadas', 3),
    (4, 1, 'Unidad 4: Integrales', 4);
-- Temas para Unidad 1 de Cálculo
INSERT
    OR IGNORE INTO syllabus_temas (id, unidad_id, nombre, descripcion, orden)
VALUES (
        1,
        1,
        'Introducción a límites',
        'Concepto intuitivo y formal de límite',
        1
    ),
    (
        2,
        1,
        'Propiedades de límites',
        'Suma, resta, producto y cociente de límites',
        2
    ),
    (
        3,
        1,
        'Límites infinitos',
        'Comportamiento asintótico',
        3
    ),
    (
        4,
        1,
        'Continuidad',
        'Definición y tipos de discontinuidad',
        4
    );
-- Temas para Unidad 2 de Cálculo
INSERT
    OR IGNORE INTO syllabus_temas (id, unidad_id, nombre, descripcion, orden)
VALUES (
        5,
        2,
        'Definición de derivada',
        'Límite del cociente de diferencias',
        1
    ),
    (
        6,
        2,
        'Reglas de derivación',
        'Potencia, suma, producto, cociente',
        2
    ),
    (
        7,
        2,
        'Regla de la cadena',
        'Derivada de funciones compuestas',
        3
    ),
    (
        8,
        2,
        'Derivadas implícitas',
        'Derivación de ecuaciones implícitas',
        4
    );
-- Unidades para Programación
INSERT
    OR IGNORE INTO syllabus_unidades (id, materia_id, nombre, orden)
VALUES (5, 2, 'Semana 1: Introducción', 1),
    (6, 2, 'Semana 2: Variables y tipos', 2),
    (7, 2, 'Semana 3: Control de flujo', 3),
    (8, 2, 'Semana 4: Funciones', 4);
-- Apunte de ejemplo
INSERT
    OR IGNORE INTO apuntes (id, user_id, materia_id, titulo, contenido, tipo)
VALUES (
        1,
        1,
        1,
        'Resumen de Límites',
        '# Límites

Un límite describe el comportamiento de una función cuando x se acerca a un valor.

## Definición formal
lim(x→a) f(x) = L

Significa que f(x) puede acercarse tanto como queramos a L, siempre que x esté suficientemente cerca de a.',
        'texto'
    );