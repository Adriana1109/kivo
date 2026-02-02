## Relevant Files

- `server/models/user.js` - Contiene el modelo de usuario y autenticación.
- `server/models/subject.js` - Modelos para `Subject`, `Syllabus` y relaciones.
- `server/models/studySession.js` - Modelo para registrar sesiones de estudio.
- `server/models/note.js` - Modelo para apuntes y metadatos de archivos.
- `server/routes/subjects.js` - Endpoints para CRUD de materias y syllabus.
- `server/routes/sessions.js` - Endpoints para registrar y listar sesiones de estudio.
- `server/routes/notes.js` - Endpoints para subir/descargar/apagar apuntes.
- `server/services/chatbot.js` - Lógica para el chatbot limitado al contexto (syllabus + notes).
- `client/src/pages/Dashboard.jsx` - Dashboard principal con resumen semanal.
- `client/src/pages/Subject.jsx` - Vista de materia (syllabus, apuntes, chatbot).
- `client/src/components/Calendar.jsx` - Componente calendario para planificar sesiones.
- `client/src/components/Chatbot.jsx` - Interfaz del chatbot por materia.
- `client/src/services/api.js` - Cliente HTTP para consumir APIs del servidor.
- `README.md` - Instrucciones de desarrollo y despliegue.
- `docker-compose.yml` - (opcional) configuración para entorno local con DB y almacenamiento.

### Notes

- Unit tests deben colocarse junto a los archivos que prueban (ej: `Subject.test.js`).
- Usa `npx jest [ruta/al/test]` para ejecutar tests; sin path corre todos los tests.

## Instructions for Completing Tasks

**IMPORTANT:** A medida que completes cada sub-tarea, marca la casilla correspondiente cambiando `- [ ]` a `- [x]` en este archivo.

## Tasks

- [ ] 0.0 Setup inicial del proyecto
  - [ ] 0.1 Inicializar repositorio Git (git init, .gitignore)
  - [ ] 0.2 Crear estructura de carpetas (server/, client/, docs/)
  - [ ] 0.3 Inicializar backend (Node.js, package.json con dependencias base)
  - [ ] 0.4 Inicializar frontend (React, Vite o Create React App)
  - [ ] 0.5 Crear archivo `.env.example` con variables necesarias (DB_URL, OLLAMA_HOST, JWT_SECRET, etc.)
  - [ ] 0.6 Crear docker-compose.yml con PostgreSQL y Ollama
  - [ ] 0.7 Checkout a rama feature (git checkout -b feature/study-platform)

- [ ] 1.0 Definir modelo de datos
  - [ ] 1.1 Diseñar schema para tabla `users` (id, email, password_hash, created_at)
  - [ ] 1.2 Diseñar schema para tabla `subjects` (id, userId, name, description, created_at)
  - [ ] 1.3 Diseñar schema para tabla `syllabus_units` (id, subjectId, unitName, order)
  - [ ] 1.4 Diseñar schema para tabla `syllabus_topics` (id, unitId, topicName, isViewed, order)
  - [ ] 1.5 Diseñar schema para tabla `study_sessions` (id, userId, subjectId, topicId, date, durationMinutes)
  - [ ] 1.6 Diseñar schema para tabla `notes` (id, subjectId, title, content, fileType, filePath, uploaded_at)
  - [ ] 1.7 Crear migraciones en el backend (Knex.js o Sequelize)
  - [ ] 1.8 Crear modelos ORM correspondientes (models/)

- [ ] 2.0 Implementar autenticación (login/signup)
  - [ ] 2.1 Instalar bcryptjs y jsonwebtoken en backend
  - [ ] 2.2 Crear endpoint POST `/auth/register` (email, password, validaciones)
  - [ ] 2.3 Crear endpoint POST `/auth/login` (email, password, retorna JWT)
  - [ ] 2.4 Crear middleware de autenticación (verificar JWT en headers)
  - [ ] 2.5 Proteger rutas privadas con middleware de auth
  - [ ] 2.6 Crear página Login/Register en frontend (React)
  - [ ] 2.7 Implementar almacenamiento de token en localStorage (frontend)
  - [ ] 2.8 Crear servicio API client (axios + interceptores para JWT)

- [ ] 3.0 Implementar APIs backend (materias, syllabus, sesiones)
  - [ ] 3.1 Crear endpoint GET `/subjects` (lista mis materias)
  - [ ] 3.2 Crear endpoint POST `/subjects` (crear materia)
  - [ ] 3.3 Crear endpoint GET `/subjects/:id` (detalles de materia + syllabus)
  - [ ] 3.4 Crear endpoint PUT `/subjects/:id` (editar materia)
  - [ ] 3.5 Crear endpoint DELETE `/subjects/:id` (eliminar materia)
  - [ ] 3.6 Crear endpoint POST `/subjects/:id/syllabus/units` (agregar unidad)
  - [ ] 3.7 Crear endpoint POST `/subjects/:id/syllabus/units/:unitId/topics` (agregar tema)
  - [ ] 3.8 Crear endpoint PUT `/topics/:topicId/mark-viewed` (marcar tema como visto)
  - [ ] 3.9 Crear endpoint POST `/study-sessions` (registrar sesión de estudio)
  - [ ] 3.10 Crear endpoint GET `/study-sessions` (listar sesiones de usuario)
  - [ ] 3.11 Crear endpoint GET `/subjects/:id/stats` (horas totales, % temas vistos)

- [ ] 4.0 Implementar UI frontend (Dashboard, Calendar, Subject pages)
  - [ ] 4.1 Crear componente Dashboard.jsx (resumen semanal, próximas sesiones)
  - [ ] 4.2 Crear componente SubjectsList.jsx (lista de materias con CRUD básico)
  - [ ] 4.3 Crear página SubjectDetail.jsx (ver/editar syllabus, ver apuntes)
  - [ ] 4.4 Crear componente SyllabusEditor.jsx (agregar unidades y temas jerárquicos)
  - [ ] 4.5 Crear componente Calendar.jsx (vista tipo Google Calendar con sesiones de estudio)
  - [ ] 4.6 Crear componente StudySessionForm.jsx (registrar sesión con materia, duración, tema)
  - [ ] 4.7 Crear componente StatsPanel.jsx (mostrar horas y % progreso por materia)
  - [ ] 4.8 Configurar React Router para navegación entre páginas
  - [ ] 4.9 Crear layout general (header con logout, sidebar con navegación)
  - [ ] 4.10 Estilar componentes con Tailwind CSS o Material-UI

- [ ] 5.0 Subida y almacenamiento de apuntes
  - [ ] 5.1 Instalar multer en backend para manejo de archivos
  - [ ] 5.2 Crear endpoint POST `/subjects/:id/notes/upload` (subir PDF o archivo de texto)
  - [ ] 5.3 Guardar archivos en carpeta local `./uploads/` (MVP)
  - [ ] 5.4 Guardar metadata en DB (nombre, tipo, ruta)
  - [ ] 5.5 Crear endpoint GET `/notes/:id/download` (descargar archivo)
  - [ ] 5.6 Crear endpoint DELETE `/notes/:id` (eliminar apunte)
  - [ ] 5.7 Crear endpoint GET `/subjects/:id/notes` (listar apuntes de materia)
  - [ ] 5.8 Crear componente NotesUploader.jsx (drag & drop para subir archivos)
  - [ ] 5.9 Crear componente NotesList.jsx (listar, previsualizar, descargar apuntes)
  - [ ] 5.10 Implementar PDF preview básico (React PDF Viewer)

- [ ] 6.0 Integración de Ollama (chatbot local)
  - [ ] 6.1 Instalar Ollama y descargar modelo llama2 (local en dev)
  - [ ] 6.2 Crear servicio `/server/services/ollama.js` (conexión a Ollama API)
  - [ ] 6.3 Diseñar prompt: "Eres un asistente académico. Responde SOLO basándote en: [syllabus]\n[apuntes]. Si la pregunta está fuera de este contenido, rechaza educadamente."
  - [ ] 6.4 Crear endpoint POST `/subjects/:id/chatbot/ask` (enviar pregunta, retorna respuesta IA)
  - [ ] 6.5 Procesar syllabus + apuntes como contexto para el prompt
  - [ ] 6.6 Crear componente Chatbot.jsx (interfaz de chat por materia)
  - [ ] 6.7 Agregar Chatbot a la página SubjectDetail
  - [ ] 6.8 Implementar historial de chat simple (solo sesión actual)
  - [ ] 6.9 Mostrar indicador "Offline" si Ollama no está disponible

- [ ] 7.0 Análisis y recomendaciones
  - [ ] 7.1 Crear función `calculateStats()` (horas totales, % temas vistos)
  - [ ] 7.2 Crear función `generateRecommendations()` (reglas simples de recomendación)
  - [ ] 7.3 Crear endpoint GET `/recommendations` (retorna lista de recomendaciones)
  - [ ] 7.4 Agregar lógica: "Has estudiado poco [materia] esta semana" (horas < umbral)
  - [ ] 7.5 Agregar lógica: "Tema [X] no se ha revisado en [N] días"
  - [ ] 7.6 Crear componente RecommendationsPanel.jsx (mostrar recomendaciones)
  - [ ] 7.7 Agregar panel en Dashboard

- [ ] 8.0 Tests y documentación
  - [ ] 8.1 Escribir unit tests para modelos (models.test.js)
  - [ ] 8.2 Escribir integration tests para API endpoints (api.test.js)
  - [ ] 8.3 Escribir tests para funciones de Ollama (mocks)
  - [ ] 8.4 Escribir tests unitarios para componentes React (React Testing Library)
  - [ ] 8.5 Crear archivo README.md con instrucciones de instalación
  - [ ] 8.6 Documentar variables de entorno (.env.example)
  - [ ] 8.7 Documentar estructura de carpetas (backend y frontend)
  - [ ] 8.8 Documentar endpoints API (OpenAPI/Swagger opcional)
  - [ ] 8.9 Ejecutar todos los tests y verificar coverage mínimo (70%)
  - [ ] 8.10 Commit final y crear pull request

---

He generado las tareas de alto nivel basadas en el PRD. ¿Listo para que genere los sub-tasks detallados para cada tarea? Responde con "Go" para proceder.