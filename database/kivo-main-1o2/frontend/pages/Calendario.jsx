import './Menu.css';

/**
 * Calendario Dinámico - Dynamic Calendar
 * Planificación y registro de sesiones de estudio
 */
function Calendario() {
  return (
    <main className="dashboard">
      <div className="dashboard-collage" style={{ gridTemplateColumns: '1fr' }}>
        <div className="dash-card" style={{ gridColumn: 'span 1' }}>
          <h3>📅 Calendario Dinámico</h3>
          <p className="estado-label" style={{ marginTop: '1rem' }}>
            Planifica y registra tus sesiones de estudio.
          </p>
          
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f1f5f9', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Funcionalidades pendientes:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#6b7280' }}>
              <li>Ver calendario tipo Google Calendar</li>
              <li>Registrar sesiones de estudio</li>
              <li>Planificar sesiones futuras</li>
              <li>Ver historial de estudio</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Calendario;
