# Despliegue en Cloudflare - Plan de Tareas

## Relevant Files

- `frontend/vite.config.js` - Configuración de Vite, agregar variable de entorno API
- `frontend/.env.production` - **[NEW]** Variables de producción
- `backend/src/worker.js` - **[NEW]** Entry point para Cloudflare Workers
- `backend/src/routes/*.js` - Rutas a adaptar de Express a Hono
- `backend/wrangler.toml` - Configuración de Workers existente
- `backend/package.json` - Agregar dependencias de Hono y Wrangler
- `database/schema.sql` - Schema para migrar a D1

### Notes

- El backend actual usa **Express.js** que NO es compatible con Workers
- Se debe reescribir usando **Hono** (framework ligero para Workers)
- La base de datos D1 ya está configurada con ID: `99169367-d104-48ad-ab07-612185e7bb8d`
- El frontend se despliega en Cloudflare Pages (build estático)

## Instructions for Completing Tasks

**IMPORTANT:** Check off tasks by changing `- [ ]` to `- [x]` after completing each one.

## Tasks

- [x] 1.0 Configurar Wrangler y verificar cuenta
  - [x] 1.1 Verificar que Wrangler está instalado (`npx wrangler --version`)
  - [x] 1.2 Autenticarse con Cloudflare (`npx wrangler login`)
  - [x] 1.3 Verificar que la base D1 existe (`npx wrangler d1 list`)
  - [x] 1.4 Si no existe, crear la base de datos D1

- [x] 2.0 Preparar Frontend para Producción
  - [x] 2.1 Crear archivo `.env.production` con URL de API
  - [x] 2.2 Actualizar `vite.config.js` para usar variables de entorno
  - [x] 2.3 Actualizar componentes para usar `import.meta.env.VITE_API_URL`
  - [x] 2.4 Ejecutar build de producción (`npm run build`)
  - [x] 2.5 Desplegar en Cloudflare Pages (https://kivo-frontend.pages.dev)

- [x] 3.0 Migrar Backend a Cloudflare Workers
  - [x] 3.1 Instalar Hono y dependencias (`npm install hono`)
  - [x] 3.2 Crear `worker.js` con configuración de Hono
  - [x] 3.3 Adaptar rutas de auth (login, register)
  - [x] 3.4 Adaptar rutas de materias (CRUD)
  - [x] 3.5 Adaptar rutas de apuntes (CRUD)
  - [x] 3.6 Adaptar rutas de calendario (CRUD)
  - [x] 3.7 Actualizar middleware de autenticación para D1

- [x] 4.0 Configurar Base de Datos D1
  - [x] 4.1 Ejecutar schema.sql en D1 (`npx wrangler d1 execute`)
  - [x] 4.2 Verificar que las tablas se crearon correctamente
  - [x] 4.3 Crear usuario admin de prueba (Registro inicial vía API)

- [x] 5.0 Desplegar y Verificar
  - [x] 5.1 Desplegar Worker (`npx wrangler deploy`)
  - [x] 5.2 Actualizar URL de API en frontend (`https://kivo-api.adriana-chiluiza.workers.dev`)
  - [x] 5.3 Redesplegar frontend con nueva URL
  - [x] 5.4 Probar login y funcionalidades (Admin creado)
  - [x] 5.5 Verificar CORS funciona correctamente
