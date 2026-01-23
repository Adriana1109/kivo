Excelente, con tus respuestas ya puedo generar el **PRD completo**.
A continuación te presento el documento en **Markdown**, pensado para un **MVP avanzado**, claro y accionable para un **junior developer**.

---

## 📄 Product Requirements Document (PRD)

**Archivo:** `/tasks/prd-study-platform.md`
**Producto:** Plataforma de Estudio Personalizada con IA
**Estado:** Definición inicial (MVP)

---

# PRD – Plataforma de Estudio Personalizada

## 1. Introducción / Overview

Esta plataforma de estudio está diseñada para **estudiantes universitarios** que desean organizar, planificar y optimizar su estudio en un solo lugar.
El producto permite crear materias con su syllabus, registrar horas de estudio y temas vistos, gestionar un calendario dinámico, subir apuntes y utilizar un **chatbot inteligente** que responde exclusivamente en base al contenido académico definido por el usuario.

El objetivo principal es **mejorar la organización, el seguimiento del progreso y la eficiencia del estudio**, usando automatización e inteligencia artificial.

---

## 2. Objetivos (Goals)

* Centralizar toda la información académica del estudiante en una sola plataforma.
* Permitir el seguimiento detallado del progreso por materia.
* Facilitar la planificación del estudio mediante un calendario dinámico.
* Ayudar al estudiante a resolver dudas usando un chatbot limitado al syllabus y apuntes.
* Incrementar la constancia y eficiencia del estudio mediante métricas y recomendaciones.

---

## 3. User Stories

0. **Como estudiante**, quiero registrarme y acceder a mi cuenta para usar la plataforma de forma segura.
1. **Como estudiante**, quiero crear mis materias con su syllabus para tener claro qué temas debo estudiar.
2. **Como estudiante**, quiero registrar las horas que estudio y los temas vistos para medir mi progreso.
3. **Como estudiante**, quiero ver mi planificación en un calendario para organizar mejor mi tiempo.
4. **Como estudiante**, quiero subir mis apuntes (PDF o texto) para tener todo mi material en un solo lugar.
5. **Como estudiante**, quiero hacer preguntas a un chatbot que solo use mi syllabus y apuntes, para evitar información irrelevante.
6. **Como estudiante**, quiero ver estadísticas y recomendaciones para mejorar mi forma de estudiar.

---

## 4. Requerimientos Funcionales

### 4.1 Gestión de Materias

1. El sistema debe permitir crear, editar y eliminar materias.
2. Cada materia debe tener:

   * Nombre
   * Descripción
   * Syllabus estructurado en **unidades** (semanas o módulos), cada unidad con **temas**
3. El sistema debe permitir marcar temas del syllabus como "vistos".
4. La estructura del syllabus es jerárquica: Unidad → Temas (ej: "Semana 1" → ["Introducción", "Definiciones"]).

### 4.2 Registro de Estudio

4. El sistema debe permitir registrar sesiones de estudio con:

   * Materia
   * Fecha
   * Duración (horas/minutos)
   * Tema(s) estudiado(s)
5. El sistema debe acumular las horas totales por materia.

### 4.3 Calendario Dinámico

6. El sistema debe mostrar un calendario con:

   * Sesiones de estudio registradas
   * Materias planificadas
7. El sistema debe permitir añadir sesiones futuras (planificación).
8. El calendario debe actualizarse automáticamente al registrar una sesión.

### 4.4 Apuntes y Materiales

9. El sistema debe permitir subir apuntes en formato:

   * PDF
   * Texto (editor integrado o archivo)
10. Los apuntes deben estar asociados a una materia.
11. El sistema debe permitir visualizar y eliminar apuntes.

### 4.5 Chatbot Académico

12. El sistema debe incluir un chatbot por materia.
13. El chatbot **solo puede responder usando**:

* El syllabus de la materia
* Los apuntes subidos por el usuario

14. El chatbot debe rechazar o aclarar preguntas fuera de ese contenido.
15. El chatbot debe responder en lenguaje claro y orientado al estudio.

### 4.6 Análisis y Recomendaciones

16. El sistema debe mostrar estadísticas por materia:

* Horas totales estudiadas
* Progreso del syllabus (% de temas vistos)

17. El sistema debe generar recomendaciones automáticas, por ejemplo:

* “Has estudiado poco esta materia esta semana”
* “Este tema lleva mucho tiempo sin revisarse”

---

## 5. No Objetivos (Out of Scope)

* No es una plataforma para clases en vivo.
* No incluye interacción entre estudiantes (foros, chat entre usuarios).
* No reemplaza plataformas oficiales de universidades.
* No genera contenido académico externo al syllabus/apuntes.

---

## 6. Consideraciones de Diseño (UI/UX)

* Interfaz simple y enfocada en productividad.
* Dashboard principal con:

  * Resumen semanal
  * Próximas sesiones
  * Progreso por materia
* Navegación clara por materias.
* Vista de calendario tipo Google Calendar.
* Chatbot accesible desde cada materia.

---

## 7. Consideraciones Técnicas

* Autenticación de usuarios (email/password, JWT tokens).
* **IA local con Ollama (LLaMA2)**: Chatbot sin dependencias de API externa, offline.
* Base de datos para:

  * Usuarios
  * Materias
  * Syllabus
  * Sesiones de estudio
  * Apuntes
* Almacenamiento de archivos para PDFs.
* Uso de IA con contexto limitado (syllabus + apuntes).
* Control estricto del contexto del chatbot (no conocimiento externo).
* Arquitectura preparada para escalar recomendaciones.

---

## 8. Métricas de Éxito (Success Metrics)

* El usuario puede crear materias y registrar estudio sin errores (funcionalidad básica).
* Al menos el 70% de los usuarios usa el calendario semanalmente.
* Uso activo del chatbot en al menos una materia.
* Registro constante de horas de estudio durante la semana.
* Retención de usuarios después de 2 semanas.

---

## 9. Preguntas Abiertas

* ¿Habrá modo offline en el futuro?
* ¿Se permitirá exportar estadísticas o datos?
* ¿Se incluirán notificaciones push o por email?
* ¿Habrá distintos niveles de profundidad en el syllabus?

---

Si quieres, en el próximo paso puedo ayudarte a:

* 🔹 Dividir esto en **features para un MVP**
* 🔹 Crear **user flows**
* 🔹 Diseñar el **modelo de datos**
* 🔹 Convertir el PRD en **tasks para desarrollo (backend / frontend)**
