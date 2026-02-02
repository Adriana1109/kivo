import './EmptyState.css';

/**
 * Componente para mostrar estados vacíos
 * @param {string} icon - Emoji o icono a mostrar
 * @param {string} title - Título principal
 * @param {string} description - Descripción/hint
 * @param {React.ReactNode} action - Componente de acción opcional (botón)
 */
function EmptyState({ icon = '📋', title, description, action }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">{icon}</span>
      {title && <p className="empty-state-title">{title}</p>}
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}

export default EmptyState;
