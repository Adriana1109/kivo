# Mejoras del Calendario - Plan de Implementación

## Relevant Files

- `frontend/pages/Calendario.jsx` - Componente principal del calendario, contiene toda la lógica y estilos inline
- `frontend/pages/Calendario.css` - **[NUEVO]** Estilos separados para el componente Calendario
- `frontend/pages/Menu.css` - CSS compartido actual, revisar qué estilos mover
- `backend/src/routes/calendario.js` - API del calendario, agregar endpoint para materias

### Notes

- El archivo actual tiene 554 líneas con estilos inline y lógica mezclada
- Se debe mantener compatibilidad con FullCalendar y sus plugins
- Las notificaciones del navegador requieren permisos del usuario

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [ ] 0.0 Crear rama de feature
  - [ ] 0.1 Crear y cambiar a nueva rama `git checkout -b feature/calendario-mejoras`

- [x] 1.0 Separar CSS del JSX
  - [x] 1.1 Crear archivo `Calendario.css` en `/frontend/pages/`
  - [x] 1.2 Mover todos los estilos inline del componente al nuevo CSS
  - [x] 1.3 Reemplazar objetos `style={{}}` por clases CSS
  - [x] 1.4 Importar el nuevo CSS en `Calendario.jsx`
  - [x] 1.5 Verificar que la UI se vea igual después de la separación

- [x] 2.0 Corregir bugs existentes
  - [x] 2.1 Arreglar `token` no definido en función `moverEvento()` (línea 221)
  - [x] 2.2 Corregir mensaje de notificación para usar valor dinámico de `minutosAntes`
  - [x] 2.3 Probar drag & drop de eventos funciona correctamente

- [x] 3.0 Agregar hora de inicio y fin a eventos
  - [x] 3.1 Modificar formulario modal para incluir inputs de hora
  - [x] 3.2 Actualizar función `guardarEvento()` para enviar hora
  - [x] 3.3 Configurar FullCalendar para mostrar eventos con hora (no solo allDay)
  - [x] 3.4 Actualizar historial para mostrar hora de eventos

- [x] 4.0 Vincular eventos con materias
  - [x] 4.1 Agregar endpoint GET `/api/materias` para obtener lista de materias del usuario
  - [x] 4.2 Agregar select de materias en el formulario modal
  - [x] 4.3 Guardar `materia_id` al crear/editar evento
  - [x] 4.4 Mostrar nombre de materia en el historial
  - [x] 4.5 Permitir filtrar eventos por materia

- [ ] 5.0 Mejorar diseño visual del modal y calendario
  - [ ] 5.1 Rediseñar modal con estilos modernos (glassmorphism, sombras suaves)
  - [ ] 5.2 Agregar animaciones de entrada/salida al modal
  - [ ] 5.3 Mejorar estilos del historial/tabla
  - [ ] 5.4 Agregar indicadores visuales de eventos próximos
  - [ ] 5.5 Verificar responsive en móviles

- [ ] 6.0 Testing y verificación final
  - [ ] 6.1 Probar crear, editar y eliminar eventos
  - [ ] 6.2 Probar filtros por tipo, mes y materia
  - [ ] 6.3 Probar notificaciones del navegador
  - [ ] 6.4 Probar drag & drop de eventos
  - [ ] 6.5 Verificar que no hay errores en consola
