# Kivo - Plataforma de Estudio Personalizada

Plataforma de estudio personalizada con IA para estudiantes universitarios. Organiza materias, planifica sesiones de estudio y aprende de forma eficiente con un chatbot académico.

## 🚀 Características Planificadas

- 📚 **Gestión de Materias**: Crea materias con syllabus estructurado
- 📅 **Calendario Dinámico**: Planifica y registra sesiones de estudio
- 📝 **Apuntes**: Sube y gestiona tus materiales (PDF, texto)
- 🤖 **Chatbot IA**: Asistente académico con Ollama (LLaMA2)
- 📊 **Estadísticas**: Seguimiento de progreso y recomendaciones

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn

## 🛠️ Instalación

```bash
# Clonar repositorio
git clone https://github.com/Nandofernando28/kivo.git
cd kivo

# Instalar dependencias del frontend
cd frontend
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📁 Estructura del Proyecto

```
kivo/
├── frontend/
│   ├── components/       # Componentes reutilizables
│   │   ├── Layout.jsx    # Layout principal
│   │   ├── Sidebar.jsx   # Navegación lateral
│   │   ├── Toast.jsx     # Notificaciones
│   │   ├── LoadingSpinner.jsx
│   │   ├── ConfirmModal.jsx
│   │   └── EmptyState.jsx
│   ├── pages/           # Páginas de la aplicación
│   │   └── Home.jsx     # Página principal
│   ├── design-system.css # Variables CSS globales
│   ├── App.jsx          # Componente raíz
│   ├── routes.jsx       # Configuración de rutas
│   └── main.jsx         # Entry point
└── README.md
```

## 🎨 Sistema de Diseño

El proyecto incluye un sistema de diseño con:

- Variables CSS globales (`design-system.css`)
- Estilos de botones (primario, secundario, success, danger)
- Paneles con efecto glass
- Colores de estado (verde, amarillo, rojo)
- Soporte responsive

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📖 Documentación

Ver el PRD completo en `tasks/prd.md` para detalles sobre:

- Requerimientos funcionales
- User stories
- Consideraciones técnicas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a tu branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo desarrollo.
