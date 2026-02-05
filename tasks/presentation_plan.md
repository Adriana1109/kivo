# Guía de Exposición: Proyecto Kivo

Esta guía divide el contenido del informe en 4 partes equitativas para la exposición.

## Estructura del Equipo

*   **Speaker 1:** Introducción y Visión General (El "Qué" y el "Por qué").
*   **Speaker 2:** Arquitectura y Tecnología (El "Cómo" - Nivel Macro).
*   **Speaker 3:** Backend, Base de Datos y Flujos (El "Cómo" - Nivel Micro/Técnico).
*   **Speaker 4:** Demostración Funcional y Conclusiones (La Prueba y el Futuro).

---

## Guion Detallado por Integrante

### Speaker 1: Introducción y Contexto
**Tiempo estimado:** 2-3 minutos
**Responsabilidad:** Abrir la presentación y captar la atención.

1.  **Saludo y Presentación del Equipo:** Mencionar nombre del proyecto "Kivo" y los integrantes.
2.  **El Problema:** Explicar brevemente la necesidad de una plataforma de estudio personalizada (organización, falta de seguimiento).
3.  **La Solución (Kivo):** Resumen ejecutivo. "Kivo es una plataforma integral que combina gestión de materias, calendario y un asistente de IA".
4.  **Resumen del Stack (Alto Nivel):** "Para lograr esto, utilizamos tecnologías modernas: React en el frontend, Node.js en el backend e Inteligencia Artificial con Meta Llama 3.1 corriendo en Cloudflare".

> **Frase de paso:** "Ahora [Speaker 2] les explicará cómo construimos esta solución robusta."

---

### Speaker 2: Arquitectura y Frontend
**Tiempo estimado:** 3-4 minutos
**Responsabilidad:** Explicar la ingeniería de software y la capa visual.

1.  **Arquitectura del Sistema:** Explicar la separación Cliente-Servidor (Sección 2 del informe).
    *   *Puntos clave:* Desacoplamiento, Escalabilidad, Comunicación API REST.
2.  **Capa de Presentación (Frontend):**
    *   **React + Vite:** Por qué se eligieron (Velocidad, Componentización).
    *   **TailwindCSS:** Diseño moderno y responsivo.
    *   **Experiencia de Usuario:** Mencionar cómo el Dashboard integra todo visualmente.

> **Frase de paso:** "Pero una cara bonita necesita un cerebro potente, [Speaker 3] detallará nuestra lógica y datos."

---

### Speaker 3: Backend, Datos y Seguridad
**Tiempo estimado:** 4-5 minutos
**Responsabilidad:** Profundizar en la parte técnica "dura" y el diagrama de flujo.

1.  **Capa de Negocio (Backend):**
    *   Uso de **Express/Hono**: Diferencia entre desarrollo local y producción (Cloudflare).
    *   **Seguridad:** Explicar el flujo de **Registro de Usuario** (Diagrama de Secuencia). Hash de contraseñas y JWT.
2.  **Capa de Datos y ER (Diagrama):**
    *   Explicar el **Modelo Entidad-Relación** brevemente.
    *   "Todo gira en torno al usuario, que tiene materias, y estas materias tienen syllabus y apuntes".
    *   Mencionar la base de datos SQLite/D1.

> **Frase de paso:** "Con la teoría clara, [Speaker 4] les mostrará el sistema en acción y cerrará la exposición."

---

### Speaker 4: Demostración, IA y Conclusiones
**Tiempo estimado:** 3-4 minutos
**Responsabilidad:** Demostrar que funciona y cerrar con broche de oro.

1.  **Demostración (Live Demo o Screenshots):**
    *   Mostrar flujo rápido: Login -> Dashboard -> Ver Materia.
    *   **Highlight:** Mostrar el **Chatbot con IA** ("Panda Coach"). Explicar brevemente cómo se conecta con Cloudflare Workers AI (Llama 3.1).
2.  **Lecciones Aprendidas:** Qué fue lo más difícil (ej. conectar la IA o desplegar en Cloudflare).
3.  **Futuras Mejoras:** Modo offline o apps móviles.
4.  **Cierre:** Agradecimiento y preguntas.

---

## Tips para la exposición
*   **Speaker 3:** Usa el diagrama de secuencia generado en el informe visualmente mientras hablas.
*   **Speaker 4:** Si la demo falla, ten capturas de pantalla listas como respaldo.
*   **Todos:** Ensayen las transiciones ("Le paso la palabra a...") para que se vea fluido.
