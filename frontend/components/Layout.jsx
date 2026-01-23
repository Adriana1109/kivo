import { Outlet } from "react-router-dom";
import Sidebar, { useSidebarState } from "./Sidebar";
import HamburgerIcon from "./icons/HamburgerIcon";
import "./Layout.css";

/**
 * Layout universal que contiene el sidebar y header.
 * Template base para el proyecto Kivo.
 */
function Layout({ children }) {
  const { isOpen: sidebarOpen, toggleSidebar } = useSidebarState();

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${sidebarOpen ? "" : "sidebar-closed"}`}>
        {/* Header universal */}
        <header className="main-header">
          {/* Botón hamburguesa cuando sidebar está cerrado */}
          {!sidebarOpen && (
            <button
              className="header-toggle-btn"
              onClick={toggleSidebar}
              aria-label="Abrir menú"
            >
              <HamburgerIcon />
            </button>
          )}

          <div className="header-brand">
            <h1 className="header-title">Kivo</h1>
            <span className="header-subtitle">Plataforma de Estudio</span>
          </div>

          <div className="header-actions">
            {/* Espacio para acciones futuras */}
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="page-content">{children ? children : <Outlet />}</main>
      </div>
    </div>
  );
}

export default Layout;
