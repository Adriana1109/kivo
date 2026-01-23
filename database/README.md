# Kivo Database

Este directorio contiene los archivos de la base de datos SQLite.

## Archivos

- `schema.sql` - Esquema de la base de datos con todas las tablas
- `seed.sql` - Datos de ejemplo para desarrollo

## Tablas

| Tabla                | Descripción                     |
| -------------------- | ------------------------------- |
| `users`              | Usuarios (autenticación)        |
| `materias`           | Materias del usuario            |
| `syllabus_unidades`  | Unidades del syllabus           |
| `syllabus_temas`     | Temas dentro de cada unidad     |
| `sesiones_estudio`   | Registro de sesiones de estudio |
| `apuntes`            | Apuntes y materiales            |
| `chat_historial`     | Historial del chatbot           |
| `eventos_calendario` | Eventos planificados            |

## Crear la base de datos

```bash
# Crear la base de datos con el esquema
sqlite3 kivo.db < schema.sql

# Cargar datos de ejemplo (opcional)
sqlite3 kivo.db < seed.sql
```

## Usuario de prueba

- Email: `demo@kivo.app`
- Password: `test123`

## Diagrama de relaciones

```
users
  │
  ├── materias (1:N)
  │     │
  │     ├── syllabus_unidades (1:N)
  │     │     └── syllabus_temas (1:N)
  │     │
  │     ├── apuntes (1:N)
  │     │
  │     └── chat_historial (1:N)
  │
  ├── sesiones_estudio (1:N)
  │     └── → materia_id, tema_id
  │
  └── eventos_calendario (1:N)
        └── → materia_id (opcional)
```
