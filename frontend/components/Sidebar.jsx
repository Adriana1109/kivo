import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import HamburgerIcon from './icons/HamburgerIcon';
import './Sidebar.css';

// Exportamos el estado y toggle para que otros componentes puedan usarlo
export function useSidebarState() {
  const [isOpen, setIsOpen] = useState(() => window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return { isOpen, setIsOpen, toggleSidebar };
}

function Sidebar({ isOpen, toggleSidebar }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  // Cerrar sidebar en móvil al navegar
  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 768) {
      toggleSidebar();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay para cerrar sidebar en mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => window.innerWidth <= 768 && toggleSidebar()}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        {/* Logo con botón toggle al lado */}
        <div className="sidebar-logo">
          <button 
            className="sidebar-toggle-inside"
            onClick={toggleSidebar}
            aria-label="Cerrar menú"
          >
            <HamburgerIcon />
          </button>
          <img src="/kivosit.webp" alt="Kivo" className="sidebar-logo-img" />
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Home - Dashboard con Estadísticas */}
          <NavLink
            to="/"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebarOnMobile}
            end
          >
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path d="M14.172 7.878 8 2.52 1.828 7.878l-.656-.756 6.5-5.641h.656l6.5 5.641-.656.756Z"></path>
              <path fillRule="evenodd" d="M4 8.101V13h2.125V9.759l.5-.5h2.75l.5.5V13H12V8.101h1V13.5l-.5.5h-9l-.5-.5V8.101h1ZM8.875 13h-1.75v-2.741h1.75V13Z"></path>
            </svg>
            <span>Home</span>
          </NavLink>

          {/* Gestión de Materias */}
          <NavLink
            to="/materias"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebarOnMobile}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span>Materias</span>
          </NavLink>

          {/* Calendario Dinámico */}
          <NavLink
            to="/calendario"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebarOnMobile}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Calendario</span>
          </NavLink>

          {/* Apuntes */}
          <NavLink
            to="/apuntes"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebarOnMobile}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <span>Apuntes</span>
          </NavLink>

          {/* Chatbot */}
          <NavLink
            to="/chatbot"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebarOnMobile}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Chatbot</span>
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {isAuthenticated ? (
            <>
              {user && (
                <div className="sidebar-user">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>{user.nombre || user.email}</span>
                </div>
              )}
              <button className="sidebar-logout" onClick={handleLogout}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </>
          ) : (
            <NavLink to="/login" className="sidebar-login" onClick={closeSidebarOnMobile}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Iniciar Sesión</span>
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
