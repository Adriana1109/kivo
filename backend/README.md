# Kivo Backend

Este directorio contiene el código del backend de la plataforma Kivo.

## ⚠️ AVISO IMPORTANTE: Backend Dual

Actualmente existen dos backends en este proyecto:

### 1. Cloudflare Worker (Producción y Desarrollo Principal)
*   **Archivo Principal**: `src/worker.js`
*   **Base de Datos**: Cloudflare D1 (SQLite en el borde)
*   **Comando**: `npx wrangler dev --remote` (o local)
*   **Estado**: ✅ ACTIVO y RECOMENDADO. Contiene todas las funcionalidades (Chatbot, Calendario, Sesiones, etc.).

### 2. Express Server (Legacy / Pruebas Localhost)
*   **Archivo Principal**: `src/index.js`
*   **Base de Datos**: `kivo.db` (SQLite archivo local manejado por `src/database/db.js`)
*   **Comando**: `npm run dev`
*   **Estado**: ⚠️ SOLO PARA PRUEBAS. Puede no tener las últimas actualizaciones paridadas con Cloudflare. Se mantiene por compatibilidad.

## Comandos

### Iniciar Cloudflare (Recomendado)
```bash
npx wrangler dev
```

### Iniciar servidor Legacy
```bash
npm run dev
```
