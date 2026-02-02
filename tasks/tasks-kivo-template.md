## Relevant Files

- `frontend/design-system.css` - Sistema de diseño global con variables CSS, botones, paneles glass (CONSERVAR)
- `frontend/App.css` - Estilos base del contenedor principal (CONSERVAR)
- `frontend/components/Layout.jsx` - Layout principal con header y sidebar (MODIFICAR)
- `frontend/components/Layout.css` - Estilos del layout (CONSERVAR)
- `frontend/components/Sidebar.jsx` - Barra lateral de navegación (MODIFICAR/SIMPLIFICAR)
- `frontend/components/Sidebar.css` - Estilos de la sidebar (CONSERVAR)
- `frontend/components/LoadingSpinner.jsx` - Componente spinner de carga (CONSERVAR)
- `frontend/components/LoadingSpinner.css` - Estilos del spinner (CONSERVAR)
- `frontend/components/Toast.jsx` - Componente de notificaciones toast (CONSERVAR)
- `frontend/components/Toast.css` - Estilos de toast (CONSERVAR)
- `frontend/components/ConfirmModal.jsx` - Modal de confirmación reutilizable (CONSERVAR)
- `frontend/components/ConfirmModal.css` - Estilos del modal (CONSERVAR)
- `frontend/components/EmptyState.jsx` - Componente para estados vacíos (CONSERVAR)
- `frontend/components/EmptyState.css` - Estilos de empty state (CONSERVAR)
- `frontend/components/icons/HamburgerIcon.jsx` - Icono hamburguesa SVG (CONSERVAR)
- `frontend/pages/Menu.jsx` - Convertir a página Home simple (MODIFICAR)
- `frontend/pages/Menu.css` - Estilos del menú/home (CONSERVAR)
- `frontend/config.js` - Configuración de API (LIMPIAR)
- `frontend/routes.jsx` - Configuración de rutas (SIMPLIFICAR)
- `frontend/main.jsx` - Entry point de React (CONSERVAR)
- `frontend/index.html` - HTML principal (MODIFICAR metadata)
- `frontend/vite.config.js` - Configuración de Vite (CONSERVAR)
- `frontend/package.json` - Dependencias del frontend (CONSERVAR)
- `README.md` - Documentación del proyecto (REESCRIBIR)
- `.gitignore` - Archivos a ignorar por Git (CONSERVAR)

### Notes

- Este proyecto es un template vacío para la Plataforma de Estudio Personalizada (Kivo)
- Se conservan todos los estilos CSS del proyecto anterior
- Se eliminan: autenticación, backend, servicios API, hooks específicos, páginas específicas
- Se conservan componentes reutilizables: Toast, LoadingSpinner, ConfirmModal, EmptyState

## Instructions for Completing Tasks

**IMPORTANT:** A medida que completes cada tarea, marca la casilla correspondiente cambiando `- [ ]` a `- [x]`.

Ejemplo:

- `- [ ] 1.1 Leer archivo` → `- [x] 1.1 Leer archivo` (después de completar)

Actualiza el archivo después de completar cada sub-tarea.

## Tasks

- [ ] 0.0 Crear feature branch y preparar template vacío

  - [ ] 0.1 Verificar que el repositorio 'kivo' está creado en GitHub
  - [ ] 0.2 Eliminar carpeta `.git` existente si la hay
  - [ ] 0.3 Inicializar nuevo repositorio Git (`git init`)
  - [ ] 0.4 Crear rama feature (`git checkout -b feature/template-setup`)

- [ ] 1.0 Setup inicial del proyecto (estructura de carpetas, dependencias base)

  - [ ] 1.1 Verificar que `frontend/package.json` tiene las dependencias necesarias (react, react-dom, react-router-dom, vite)
  - [ ] 1.2 Ejecutar `npm install` en frontend para verificar que funciona
  - [ ] 1.3 Verificar que `npm run dev` inicia el servidor de desarrollo sin errores

- [ ] 2.0 Limpiar proyecto existente (eliminar código del proyecto anterior)

  - [ ] 2.1 Eliminar carpeta `backend/` completa (no se usará Cloudflare Workers)
  - [ ] 2.2 Eliminar `frontend/services/api.js` (servicio API específico)
  - [ ] 2.3 Eliminar `frontend/hooks/useAuth.jsx` (autenticación)
  - [ ] 2.4 Eliminar `frontend/hooks/useWeeklyCheck.js` (hook específico)
  - [ ] 2.5 Eliminar `frontend/utils/excelExport.js` (utilidad específica)
  - [ ] 2.6 Eliminar `frontend/utils/weeklyCheckUtils.js` (utilidad específica)
  - [ ] 2.7 Eliminar `frontend/components/ProtectedRoute.jsx` (autenticación)
  - [ ] 2.8 Eliminar `frontend/components/ExportButton.jsx` (depende de excelExport)
  - [ ] 2.9 Eliminar `frontend/components/RegistroRapidoModal.jsx` (específico)
  - [ ] 2.10 Eliminar `frontend/components/ReparacionesTable.jsx` (específico)
  - [ ] 2.11 Eliminar `frontend/components/WeeklyCheckTable.jsx` (específico)
  - [ ] 2.12 Eliminar `frontend/pages/Login.jsx` y `Login.css` (autenticación)
  - [ ] 2.13 Eliminar `frontend/pages/WeeklyCheck.jsx` y `WeeklyCheck.css` (específico)
  - [ ] 2.14 Eliminar `frontend/pages/Reparaciones.jsx` y `Reparaciones.css` (específico)
  - [ ] 2.15 Eliminar `frontend/pages/ReparacionesPendientes.jsx` (específico)
  - [ ] 2.16 Eliminar carpeta `frontend/pages/admin/` completa (específico)
  - [ ] 2.17 Eliminar carpeta `frontend/pages/control/` completa (específico)
  - [ ] 2.18 Limpiar `frontend/config.js` (dejar API_URL vacío como placeholder)
  - [ ] 2.19 Eliminar carpeta `rules/` (reglas del proyecto anterior)
  - [ ] 2.20 Eliminar carpeta `tasks/` (tareas del proyecto anterior - después de copiar este archivo)

- [ ] 3.0 Configurar componentes reutilizables del template

  - [ ] 3.1 Modificar `frontend/components/Layout.jsx` (cambiar branding a "Kivo", remover auth)
  - [ ] 3.2 Simplificar `frontend/components/Sidebar.jsx` (dejar solo enlace a Home, remover rutas específicas)
  - [ ] 3.3 Verificar que `LoadingSpinner.jsx` funciona sin dependencias externas
  - [ ] 3.4 Verificar que `Toast.jsx` funciona sin dependencias externas
  - [ ] 3.5 Verificar que `ConfirmModal.jsx` funciona sin dependencias externas
  - [ ] 3.6 Verificar que `EmptyState.jsx` funciona sin dependencias externas

- [ ] 4.0 Crear página Home con mensaje de bienvenida

  - [ ] 4.1 Modificar `frontend/pages/Menu.jsx` para mostrar bienvenida "Kivo" simple
  - [ ] 4.2 Remover lógica de API y estados específicos del menú anterior
  - [ ] 4.3 Conservar estilos de `Menu.css` aplicados al nuevo componente
  - [ ] 4.4 Simplificar `frontend/routes.jsx` (solo ruta `/` → Home)
  - [ ] 4.5 Modificar `frontend/App.jsx` (remover AuthProvider, mantener ErrorBoundary)
  - [ ] 4.6 Actualizar `frontend/index.html` (título "Kivo", remover preconnect, actualizar meta)

- [ ] 5.0 Configurar Git y subir a repositorio 'kivo'

  - [ ] 5.1 Actualizar `.gitignore` si es necesario
  - [ ] 5.2 Hacer commit inicial (`git add . && git commit -m "Initial template setup"`)
  - [ ] 5.3 Agregar remote de GitHub (`git remote add origin https://github.com/[username]/kivo.git`)
  - [ ] 5.4 Push a rama main (`git branch -M main && git push -u origin main`)

- [ ] 6.0 Actualizar documentación (README, limpiar archivos antiguos)
  - [ ] 6.1 Eliminar `PRD.md` del proyecto anterior
  - [ ] 6.2 Eliminar `README_DEPLOY.md` del proyecto anterior
  - [ ] 6.3 Eliminar `REFACTORING.md` del proyecto anterior
  - [ ] 6.4 Eliminar `TASKS.md` del proyecto anterior
  - [ ] 6.5 Reescribir `README.md` con información de Kivo (setup, estructura, etc.)
  - [ ] 6.6 Verificar que el proyecto compila sin errores (`npm run build`)
  - [ ] 6.7 Hacer commit final y push

---

**Documento generado para guiar la creación del template Kivo.**
