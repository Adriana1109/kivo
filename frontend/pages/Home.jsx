import './Menu.css';

/**
 * Página Home - Bienvenida a Kivo
 * Plataforma de Estudio Personalizada
 */
function Home() {
  return (
    <main className="dashboard">
      <div className="dashboard-collage">
        {/* Bienvenida */}
        <div className="dash-card estado-general" style={{ gridColumn: 'span 2' }}>
          <h3>Bienvenido a Kivo</h3>
          <p className="estado-label" style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
            Tu plataforma de estudio personalizada con IA
          </p>
          <div style={{ marginTop: '2rem', opacity: 0.7 }}>
            <p>🎯 Organiza tus materias y syllabus</p>
            <p>📚 Sube y gestiona tus apuntes</p>
            <p>📅 Planifica tus sesiones de estudio</p>
            <p>🤖 Pregunta a tu asistente académico</p>
          </div>
        </div>

        {/* Card de próximos pasos */}
        <div className="dash-card mantenimientos-proximos">
          <h3>Próximos Pasos</h3>
          <ul className="proximos-list" style={{ textAlign: 'left' }}>
            <li className="proximo-item">
              <div className="proximo-info">
                <span className="proximo-nombre">Implementar autenticación</span>
                <span className="proximo-maquina">Login/Register</span>
              </div>
            </li>
            <li className="proximo-item">
              <div className="proximo-info">
                <span className="proximo-nombre">Crear gestión de materias</span>
                <span className="proximo-maquina">CRUD + Syllabus</span>
              </div>
            </li>
            <li className="proximo-item">
              <div className="proximo-info">
                <span className="proximo-nombre">Configurar Ollama</span>
                <span className="proximo-maquina">Chatbot IA</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default Home;
