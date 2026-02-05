# 🎓 Guía Especializada: Speaker 3 (Backend Engineer)

> **Tu Rol:** Eres el arquitecto del sistema. Tu trabajo es demostrar que Kivo no es solo una "cara bonita", sino que tiene lógica robusta, segura y escalable detrás.

---

## 🏗️ 1. Arquitectura del Backend (Tu introducción)

*"En el backend, nuestro objetivo fue crear un sistema desacoplado y listo para la nube. Utilizamos **Node.js** como entorno de ejecución por su eficiencia en I/O (Entrada/Salida)."*

*   **Punto Clave (Doble Entorno):** Tienes que presumir esto, es un nivel avanzado.
    *   *"Implementamos un **Pattern Adapter** para el servidor:"*
    *   **Entorno Local:** Usamos **Express** con **SQLite local** (vía `sql.js`). Esto nos permite desarrollar rápido en nuestras máquinas sin internet.
    *   **Producción:** El código está diseñado para desplegarse en **Cloudflare Workers** usando el framework **Hono**.
    *   *¿Qué es Hono?* *"Hono no es un lenguaje, es un framework. Si Express es una camioneta pesada, Hono es un Fórmula 1: pesa menos de 14kb y arranca instantáneamente, lo que es vital para una arquitectura Serverless."*

## 🔒 2. Seguridad y Autenticación (Core Logic)

*"La seguridad no es un 'feature' extra, es la base."*

*   **(Muestra el diagrama de secuencia aquí si puedes)**
*   **JWT (JSON Web Tokens):** *"No usamos sesiones de servidor tradicionales que consumen memoria. Implementamos autenticación **Stateless** con JWT. Cada petición del usuario viene firmada, lo que nos permite escalar horizontalmente sin problemas."*
*   **Hash de Contraseñas:** *"Jamás guardamos contraseñas limpias. Usamos **Bcrypt** con un 'salt' de 10 rondas. Incluso si un atacante accede a la base de datos, no podrá leer las claves de los usuarios."*
*   **Middleware:** *"Escribimos un middleware personalizado (`src/middleware/auth.js`) que intercepta cada petición protegida, decodifica el token y valida al usuario antes de que llegue al controlador."*

## 💾 3. Base de Datos (Estructura de Datos)

*"Para la persistencia, diseñamos un modelo relacional normalizado centrado en el usuario."*

*   **Abstracción de Datos:** *"Creamos una capa de abstracción en `src/database/db.js`. Esto es crucial porque nos permite cambiar el motor de base de datos (de SQLite archivo a Cloudflare D1) sin tocar ni una línea de la lógica de negocio."*
*   **Relaciones Clave:**
    *   `Users` **1:N** `Materias` (Un usuario tiene N materias).
    *   `Materias` **1:1** `Syllabus` (Cada materia tiene su estructura).
    *   `Materias` **1:N** `Apuntes` (Organización jerárquica).
*   **Integridad:** *"Usamos **Foreign Keys** con `ON DELETE CASCADE`. Si un usuario decide borrar su cuenta o una materia, el sistema limpia automáticamente todos los apuntes, eventos y chats asociados, evitando datos huérfanos."*

---

## 🗣️ Guion Sugerido (Minuto a Minuto)

**(Inicio - Toma la palabra de Speaker 2)**

*"Gracias [Nombre Speaker 2]. Como vieron, el frontend es impresionante, pero para que sea funcional necesita un cerebro lógico robusto. Yo les hablaré de lo que ocurre 'bajo el capó' en nuestro Backend."*

**(Sobre la Tecnología - 1 min)**
*"Decidimos no irnos por lo fácil. Construimos una API RESTful que es agnóstica a la plataforma. Localmente desarrollamos con **Express** para velocidad, pero todo nuestro código está optimizado para **Cloudflare Workers** usando **Hono** como framework. Esto significa que Kivo no corre en un servidor central lento al otro lado del mundo, sino que se ejecuta en el 'Edge', lo más cerca posible del usuario."*

**(Sobre la Seguridad - 1.5 min)**
*"En seguridad, aplicamos el principio de 'Trust No One' (No confiar en nadie). implementamos un sistema de autenticación **Stateless** con **JWT**.
Cuando se registran (como vieron en el diagrama), la contraseña pasa por un proceso de hashing con **Bcrypt**. No guardamos '123456', guardamos un hash criptográfico irreversible.
Además, cada ruta privada está protegida por un Middleware que verifica la firma digital del token en milisegundos."*

**(Sobre los Datos - 1.5 min)**
*"Y finalmente, los datos. Diseñamos un esquema relacional en **SQLite** (compatible con D1).
La arquitectura gira entorno a la entidad `Usuario`. Usamos integridad referencial estricta en cascada.
Por ejemplo, nuestro archivo `db.js` actúa como una capa de seguridad extra, usan 'Prepared Statements' para prevenir ataques de **Inyección SQL**. Así garantizamos que los apuntes y el historial de chat de cada estudiante sean privados e inviolables."*

**(Cierre - Pase a Speaker 4)**
*"Habiendo asegurado la lógica y los datos, ahora [Nombre Speaker 4] les mostrará cómo todo esto se une en la demostración en vivo."*

---

## 💡 Tips Pro para Speaker 3

1.  **Menciona "Inyección SQL":** A los profesores les encanta escuchar que te preocupaste por prevenir eso (usando `dbPrepare` en tu código).
2.  **Edge Computing:** Es un término de moda (Buzzword) pero real en tu proyecto. Úsalo para sonar vanguardista.
3.  **Desacoplamiento:** Recalca que si mañana quieren cambiar el Frontend a una App Móvil, tu Backend sigue sirviendo igual porque es una API pura.

---

## 🧠 Glosario Técnico (Cheat Sheet)

Aquí tienes la explicación detallada de los términos "raros" para que puedas defenderte si te preguntan.

### 1. Backend / Arquitectura
*   **Edge Computing (Computación en el Borde):** A diferencia de un servidor tradicional (ej. AWS en Virginia), nuestro código corre en la red global de Cloudflare. Se ejecuta en el servidor físicamente más cercano al usuario (ej. Bogotá, Santiago, Lima), reduciendo la latencia (ping) al mínimo.
*   **Pattern Adapter:** Un patrón de diseño que usamos para que el mismo código (Lógica de Negocio) funcione en dos lugares diferentes. Nosotros implementamos adaptadores manuales (`worker.js` para Cloudflare y `index.js` para Local) que "traducen" las peticiones para que la lógica central no tenga que preocuparse por dónde está corriendo.
*   **API RESTful:** Una forma estándar de comunicación. El frontend pide recursos (GET /materias) o envía datos (POST /materias) usando el protocolo HTTP. Es "Stateless" (ver abajo).

### 2. Seguridad
*   **Stateless vs Stateful:**
    *   **Stateful (Tradicional):** El servidor guarda una "sesión" en memoria RAM por cada usuario conectado. Si hay 1 millón de usuarios, el servidor explota.
    *   **Stateless (Kivo):** El servidor NO guarda nada. El usuario trae su propio pase VIP (el Token JWT) en cada petición. El servidor solo verifica la firma del pase. Esto permite tener millones de usuarios sin gastar memoria.
*   **JWT (JSON Web Token):** Es ese "pase VIP". Un string largo encriptado que contiene el ID del usuario (`ey...`). Si alguien lo altera, la firma se rompe y el servidor lo rechaza.
*   **Hashing (Bcrypt):**
    *   **Encriptar:** Se puede reversar (si tienes la llave).
    *   **Hashear:** NO se puede reversar (es unidireccional). Convertimos la contraseña "gatito123" en una sopa de letras ilegible. Si hackean la base de datos, no pueden saber cuál era la contraseña original. `Salt` es agregarle basura aleatoria antes de hashear para que dos contraseñas iguales ("1234") tengan hash diferentes.
*   **Middleware:** Es como un portero de discoteca. Es una función que se para *antes* de la ruta final. El portero (Middleware) revisa si tienes el Token (Pase VIP). Si no, te saca (401 Unauthorized) antes de que entres a la fiesta (Controlador).

### 3. Base de Datos
*   **Inyección SQL:** Es un truco donde un hacker escribe código SQL en un formulario (ej. usuario: `' OR 1=1 --`) para borrar tu base de datos o entrar sin contraseña.
*   **Prepared Statements (Sentencias Preparadas):** La vacuna contra la Inyección SQL. Funciona separando la **instrucción** de los **datos**.
    1.  Mandamos el molde: `SELECT * FROM users WHERE email = ?`. La base de datos lo congela.
    2.  Mandamos el dato: `"usuario malicioso"`.
    Como viajan por carriles separados, la base de datos sabe que el dato es solo texto y nunca lo ejecutará como código.
*   **Integridad Referencial en Cascada:** Una regla estricta. "Si borras a la mamá, borra a los hijos". Si borras una `Materia`, la base de datos automáticamente borra sus `Apuntes` y `Sesiones`. Evita basura en la base de datos.
