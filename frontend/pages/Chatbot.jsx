import './Menu.css';

/**
 * Chatbot Académico - AI Academic Assistant
 * Chatbot con Ollama limitado al syllabus y apuntes
 */
function Chatbot() {
  return (
    <main className="dashboard">
      <div className="dashboard-collage" style={{ gridTemplateColumns: '1fr' }}>
        <div className="dash-card" style={{ gridColumn: 'span 1' }}>
          <h3>🤖 Chatbot Académico</h3>
          <p className="estado-label" style={{ marginTop: '1rem' }}>
            Tu asistente de estudio con IA (powered by Ollama).
          </p>
          
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f1f5f9', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Funcionalidades pendientes:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#6b7280' }}>
              <li>Integración con Ollama (LLaMA2)</li>
              <li>Respuestas basadas en syllabus y apuntes</li>
              <li>Chat por materia</li>
              <li>Historial de conversaciones</li>
            </ul>
          </div>
          
          {/* Placeholder para el chat */}
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: '#e0e7ff', 
            borderRadius: '12px',
            border: '2px dashed #6366f1',
            textAlign: 'center',
            color: '#4f46e5'
          }}>
            <p style={{ margin: 0 }}>💬 Interfaz de chat próximamente...</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Chatbot;
