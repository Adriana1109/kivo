import './LoadingSpinner.css';

/**
 * Componente de spinner de carga
 * @param {string} size - Tamaño: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} text - Texto opcional a mostrar
 */
function LoadingSpinner({ size = 'md', text }) {
  return (
    <div className={`loading-spinner-container ${size}`}>
      <div className="loading-spinner"></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}

export default LoadingSpinner;
