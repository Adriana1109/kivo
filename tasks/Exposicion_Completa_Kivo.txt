# Guía Maestra de Exposición: Proyecto Kivo

> **Documento Unificado para el Equipo**
> Este archivo contiene tanto el guion de la presentación dividido por roles como la información técnica detallada que debe decir cada integrante.

---

## 👥 Resumen de Roles (4 Integrantes)

| Integrante | Rol | Tema Principal | Tiempo Aprox. |
| :--- | :--- | :--- | :--- |
| **Speaker 1** | Líder / Intro | Problema, Solución y Visión General | 2-3 min |
| **Speaker 2** | Frontend | Arquitectura General, React/Vite y UX | 3-4 min |
| **Speaker 3** | Backend | Lógica, Seguridad (JWT) y Base de Datos | 4-5 min |
| **Speaker 4** | Demo / Cierre | Demostración en vivo, IA y Conclusiones | 3-4 min |

---

# 🎤 Guion Detallado por Speaker

## 🗣️ Speaker 1: Introducción y Contexto

**Objetivo:** Captar la atención y vender la idea.

1.  **Saludo y Equipo:**
    *   *"Buenos días/tardes. Nosotros somos el equipo detrás de **Kivo**, la plataforma de estudio personalizada."*
    *   Presenta a los integrantes rápidamente.

2.  **El Problema:**
    *   *"Detectamos que los estudiantes pierden mucho tiempo organizando qué estudiar, perdiendo el foco entre múltiples archivos y fechas."*

3.  **La Solución (Kivo):**
    *   *"Kivo centraliza todo: calendario, materias, apuntes y asistencia inteligente en un solo lugar. No es solo una agenda, es un compañero de estudio."*

4.  **Resumen del Stack (El "Qué"):**
    *   *"Para construir esto, elegimos un stack moderno y escalable:"*
    *   **Frontend:** React con Vite (Rápido y modular).
    *   **Backend:** Node.js (Flexible y potente).
    *   **IA:** Meta Llama 3.1 (Corriendo con Cloudflare).

> **👉 Paso a Speaker 2:** *"Ahora mi compañero [Nombre] les explicará la arquitectura que hace esto posible."*

---

## 🗣️ Speaker 2: Arquitectura y Frontend

**Objetivo:** Explicar cómo está construido el sistema a nivel macro.

1.  **Arquitectura Cliente-Servidor:**
    *   *"El sistema está totalmente desacoplado. Tenemos el **Frontend** separado del **Backend**, comunicándose vía API REST. Esto nos permite actualizar la interfaz sin romper el servidor y viceversa."*

2.  **Capa de Presentación (Frontend):**
    *   **React + Vite:** *"Usamos Vite porque ofrece un entorno de desarrollo instantáneo, mucho más rápido que las herramientas tradicionales. React nos permite crear componentes reutilizables como las tarjetas de materias o el calendario."*
    *   **TailwindCSS:** *"Para el diseño, usamos Tailwind. Nos permitió crear una interfaz limpia y responsiva (adaptable a móviles) sin escribir hojas de estilo gigantescas y difíciles de mantener."*

3.  **Experiencia de Usuario (UX):**
    *   *"El Dashboard es el corazón. Diseñamos la UI para que el estudiante vea su progreso de un vistazo. Todo es asíncrono; la página no se recarga completamente al navegar, dando una sensación de aplicación nativa fluida."*

> **👉 Paso a Speaker 3:** *"Pero una buena interfaz necesita lógica sólida detrás. [Nombre] les hablará del Backend y los Datos."*

---

## 🗣️ Speaker 3: Backend, Seguridad y Datos

**Objetivo:** La parte técnica "dura". Muestra seguridad y estructura.

1.  **Capa de Negocio (Backend):**
    *   **Node.js & Express/Hono:** *"En el servidor manejamos la lógica. Usamos Express para desarrollo local, pero el código está listo para desplegarse como Serverless Functions (Hono) en la nube, lo que reduce costos y mejora la escalabilidad."*
    *   **Seguridad y Autenticación:** *"La seguridad es prioridad. No guardamos contraseñas en texto plano; las hasheamos con **Bcrypt**. Además, usamos **JWT (JSON Web Tokens)** para manejar las sesiones. Cada vez que el usuario hace una petición, envía su token para validar quién es."*
    *   *(Opcional: Mostrar Diagrama de Secuencia del Registro si es posible)*.

2.  **Capa de Datos (Base de Datos):**
    *   **Esquema Relacional:** *"Nuestra base de datos pone al **Usuario** en el centro."*
        *   Un Usuario tiene muchas **Materias**.
        *   Una Materia tiene un **Syllabus** (Unidades y Temas).
        *   Los **Apuntes** y **Sesiones de Estudio** se vinculan a esas materias.
    *   **Tecnología:** *"Usamos SQLite por su eficiencia y portabilidad, ideal para este tipo de aplicaciones ágiles, pero compatible con bases SQL más grandes como PostgreSQL."*

> **👉 Paso a Speaker 4:** *"Con la teoría clara, [Nombre] les mostrará Kivo en acción."*

---

## 🗣️ Speaker 4: Demostración y Cierre

**Objetivo:** Demostrar funcionamiento y mirar al futuro.

1.  **Live Demo (Demostración en Vivo):**
    *   *Acción:* Abre la app.
    *   **Flujo:** Registro rápido -> Ver el Dashboard vacío -> Crear una materia ("Cálculo") -> Subir un apunte -> **(Punto Clave)** Abrir el Chatbot y preguntarle algo sobre la materia.
    *   *"Como ven, el 'Panda Coach' usa la IA de Meta Llama 3.1 para responder en contexto de la materia que acabamos de crear."*

2.  **Lecciones Aprendidas:**
    *   *"El mayor reto fue integrar la IA para que respondiera rápido y conectar correctamente el calendario en tiempo real con React."*

3.  **Futuro del Proyecto:**
    *   *"A futuro planeamos: modo offline para estudiar sin internet y una app móvil nativa."*

4.  **Cierre:**
    *   *"Kivo no es solo un proyecto académico, es una base sólida para una startup EdTech. Muchas gracias, ¿tienen alguna pregunta?"*

---
