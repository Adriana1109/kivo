import './Menu.css';

/**
 * Gestión de Materias - Subjects Management
 * CRUD de materias con syllabus estructurado
 */
function Materias() {
  return (
    <main className="dashboard">
      <div className="dashboard-collage" style={{ gridTemplateColumns: '1fr' }}>
        <div className="dash-card" style={{ gridColumn: 'span 1' }}>
          <h3>📚 Gestión de Materias</h3>
          <p className="estado-label" style={{ marginTop: '1rem' }}>
            Aquí podrás crear y gestionar tus materias con su syllabus estructurado.
          </p>
          
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f1f5f9', borderRadius: '12px' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>Funcionalidades pendientes:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#6b7280' }}>
              <li>Crear nueva materia</li>
              <li>Agregar unidades y temas al syllabus</li>
              <li>Marcar temas como vistos</li>
              <li>Ver progreso por materia</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Materias;
