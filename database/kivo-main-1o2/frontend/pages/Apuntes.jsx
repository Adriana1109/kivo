import './Menu.css';

/**
 * Apuntes - Notes Management
 * Subir y gestionar apuntes (PDF, texto)
 */
function Apuntes() {
  return (
    <main className="dashboard">
      <div className="dashboard-collage" style={{ gridTemplateColumns: '1fr' }}>
        <div className="dash-card" style={{ gridColumn: 'span 1' }}>
          <h3>📝 Apuntes</h3>
          <p className="estado-label" style={{ marginTop: '1rem' }}>
            Sube y gestiona tus materiales de estudio.
          </p>
          
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f1f5f9', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Funcionalidades pendientes:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#6b7280' }}>
              <li>Subir archivos PDF</li>
              <li>Editor de texto integrado</li>
              <li>Organizar por materia</li>
              <li>Vista previa de documentos</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Apuntes;
