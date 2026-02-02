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

- [ ] 1.0 Configurar Wrangler y verificar cuenta
  - [ ] 1.1 Verificar que Wrangler está instalado (`npx wrangler --version`)
  - [ ] 1.2 Autenticarse con Cloudflare (`npx wrangler login`)
  - [ ] 1.3 Verificar que la base D1 existe (`npx wrangler d1 list`)
  - [ ] 1.4 Si no existe, crear la base de datos D1

- [ ] 2.0 Preparar Frontend para Producción
  - [ ] 2.1 Crear archivo `.env.production` con URL de API
  - [ ] 2.2 Actualizar `vite.config.js` para usar variables de entorno
  - [ ] 2.3 Actualizar componentes para usar `import.meta.env.VITE_API_URL`
  - [ ] 2.4 Ejecutar build de producción (`npm run build`)
  - [ ] 2.5 Desplegar en Cloudflare Pages

- [ ] 3.0 Migrar Backend a Cloudflare Workers
  - [ ] 3.1 Instalar Hono y dependencias (`npm install hono`)
  - [ ] 3.2 Crear `worker.js` con configuración de Hono
  - [ ] 3.3 Adaptar rutas de auth (login, register)
  - [ ] 3.4 Adaptar rutas de materias (CRUD)
  - [ ] 3.5 Adaptar rutas de apuntes (CRUD)
  - [ ] 3.6 Adaptar rutas de calendario (CRUD)
  - [ ] 3.7 Actualizar middleware de autenticación para D1

- [ ] 4.0 Configurar Base de Datos D1
  - [ ] 4.1 Ejecutar schema.sql en D1 (`npx wrangler d1 execute`)
  - [ ] 4.2 Verificar que las tablas se crearon correctamente
  - [ ] 4.3 Crear usuario admin de prueba

- [ ] 5.0 Desplegar y Verificar
  - [ ] 5.1 Desplegar Worker (`npx wrangler deploy`)
  - [ ] 5.2 Actualizar URL de API en frontend
  - [ ] 5.3 Redesplegar frontend con nueva URL
  - [ ] 5.4 Probar login y funcionalidades
  - [ ] 5.5 Verificar CORS funciona correctamente
