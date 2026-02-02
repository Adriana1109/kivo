# Mejoras de Apuntes - Plan de Implementación

## Relevant Files

- `frontend/pages/Apuntes.jsx` - Componente principal, tiene estilos inline y no usa la API
- `frontend/pages/Apuntes.css` - **[NUEVO]** Estilos separados del componente
- `frontend/pages/Menu.css` - CSS compartido (importado actualmente)
- `backend/src/routes/apuntes.js` - API REST completa (GET, POST, PUT, DELETE)
- `backend/src/routes/materias.js` - API para obtener materias del usuario

### Notes

- El componente actual NO usa la API del backend - guarda apuntes solo en estado local
- La API del backend espera `materia_id` (referencia a materias), no texto libre
- El backend tiene soporte para archivos PDF pero no está implementado completamente
- Hay que integrar con el selector de materias existente

## Análisis de Problemas Actuales

### 🐛 Bugs / Problemas Críticos
1. **No persiste datos** - Los apuntes se pierden al recargar (solo useState)
2. **No usa la API** - El backend tiene CRUD completo pero no se usa
3. **Materia como texto libre** - Debería ser un select vinculado a materias existentes

### 🎨 Problemas de Estilo
1. Todos los estilos están inline (`style={{}}`)
2. Inputs con `width: 97%` (debería ser 100% con box-sizing)
3. Sin feedback visual al guardar
4. Sin estados de carga

### ⚡ Funcionalidades Faltantes
1. Editar apuntes existentes
2. Eliminar apuntes
3. Buscar/filtrar apuntes
4. Subida real de PDFs al servidor
5. Ordenar por fecha/materia

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, check it off by changing `- [ ]` to `- [x]`.

## Tasks

- [x] 1.0 Separar CSS del JSX
  - [x] 1.1 Crear archivo `Apuntes.css` en `/frontend/pages/`
  - [x] 1.2 Mover todos los estilos inline a clases CSS
  - [x] 1.3 Aplicar box-sizing correcto a inputs y textareas
  - [x] 1.4 Importar el nuevo CSS en `Apuntes.jsx`
  - [x] 1.5 Verificar que la UI se vea correctamente

- [x] 2.0 Integrar con API del Backend
  - [x] 2.1 Cargar materias del usuario al iniciar (GET /api/materias)
  - [x] 2.2 Reemplazar input de materia por select de materias
  - [x] 2.3 Cargar apuntes existentes al iniciar (GET /api/apuntes)
  - [x] 2.4 Guardar apuntes en backend (POST /api/apuntes)
  - [x] 2.5 Mostrar estado de carga mientras se obtienen datos

- [x] 3.0 Agregar funcionalidad de editar y eliminar
  - [x] 3.1 Agregar botón de editar a cada apunte
  - [x] 3.2 Implementar modo edición reutilizando formulario
  - [x] 3.3 Actualizar apunte en backend (PUT /api/apuntes/:id)
  - [x] 3.4 Agregar botón de eliminar con confirmación
  - [x] 3.5 Eliminar apunte en backend (DELETE /api/apuntes/:id)

- [x] 4.0 Agregar filtros y búsqueda
  - [x] 4.1 Agregar input de búsqueda por texto
  - [x] 4.2 Agregar filtro por materia (dropdown)
  - [x] 4.3 Implementar lógica de filtrado en frontend
  - [x] 4.4 Mostrar contador de apuntes filtrados

- [x] 5.0 Mejorar diseño visual
  - [x] 5.1 Diseñar cards de apuntes con mejor estilo
  - [x] 5.2 Agregar animaciones de entrada
  - [x] 5.3 Agregar feedback visual al guardar/eliminar (toast)
  - [x] 5.4 Mejorar responsive para móviles
  - [x] 5.5 Agregar EmptyState cuando no hay apuntes

- [ ] 6.0 Testing y verificación
  - [ ] 6.1 Probar crear, editar y eliminar apuntes
  - [ ] 6.2 Probar filtros funcionan correctamente
  - [ ] 6.3 Verificar que datos persisten al recargar
  - [ ] 6.4 Verificar no hay errores en consola
