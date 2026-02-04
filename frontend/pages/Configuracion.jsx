import { useState, useEffect } from "react";
import { Bell, Mail, Smartphone } from "lucide-react";
import "./Configuracion.css";


function Configuracion() {
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  
const [canales, setCanales] = useState({
  app: true,
  email: false,
  push: false,
});

const [frecuencia, setFrecuencia] = useState("inmediato");
const [notificacionesEspecificas, setNotificacionesEspecificas] = useState({
  tareas: true,
  eventos: true,
  recordatorios: false,
});

const toggleCanal = (canal) => {
  setCanales((prev) => ({ ...prev, [canal]: !prev[canal] }));
};

const toggleNotificacion = (tipo) => {
  setNotificacionesEspecificas((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
};

const guardarConfiguracionNotificaciones = () => {
  const config = {
    canales,
    frecuencia,
    notificacionesEspecificas,
  };
  localStorage.setItem("configNotificaciones", JSON.stringify(config));
  setMostrarNotificaciones(false);
  alert("Configuración de notificaciones guardada ✅");
};


  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "dark";
});

useEffect(() => {
  if (darkMode) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}, [darkMode]);

  const [showEditProfile, setShowEditProfile] = useState(false);


  return (
    <div className="config-container">

      <div className="config-header">
        <h2>Configuración</h2>
        <p>Personaliza tu experiencia en Kivo</p>


        {showEditProfile && (
  <div className="modal">
    <div className="modal-content">
      <h3>Editar Perfil</h3>
      
      <label>
        Nombre:
        <input type="text" placeholder="Tu nombre" />
      </label>

      <label>
        Correo:
        <input type="email" placeholder="correo@ejemplo.com" />
      </label>

      <label>
        Contraseña:
        <input type="password" placeholder="Nueva contraseña" />
      </label>

      <div className="modal-actions">
        <button 
          className="config-btn"
          onClick={() => setShowEditProfile(false)}
        >
          Guardar Cambios
        </button>
        <button 
          className="config-btn"
          onClick={() => setShowEditProfile(false)}
          style={{backgroundColor: "#ccc", color: "#000"}}
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

      </div>

      <div className="config-grid">

        {/* PERFIL */}
        <div className="config-card">
          <h3>Cuenta</h3>
          <p>Datos personales y sesión</p>

          <button className="config-btn"
            onClick={() => setShowEditProfile(true)}
          >
            Editar Perfil
          </button>
        </div>

        {/* MODO ESTUDIO */}
        <div className="config-card">
          <h3>Modo Estudio</h3>
          <p>Pomodoro y concentración</p>

          <button className="config-btn">
            Configurar Pomodoro
          </button>
        </div>

        {/* NOTIFICACIONES */}
        <div className="config-card">
          <h3>Notificaciones</h3>
          <p>Alertas académicas</p>

        <button className="config-btn" onClick={() => setMostrarNotificaciones(true)}>
          Administrar avisos
        </button>
        </div>

        {/* APARIENCIA */}
          <div className="config-card">

            <h3>Apariencia</h3>
            <p>Tema visual del sistema</p>

            <div className="theme-toggle">

              <span>{darkMode ? "Modo Oscuro" : "Modo Claro"}</span>

              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider"></span>
              </label>

            </div>

          </div>


      </div>
{mostrarNotificaciones && (
  <div className="modal-overlay" onClick={() => setMostrarNotificaciones(false)}>
    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Administrar notificaciones</h3>
        <button onClick={() => setMostrarNotificaciones(false)}>✕</button>
      </div>

      <div className="modal-body">
        <h4>Canales de notificación</h4>
        <label>
          <input type="checkbox" checked={canales.app} onChange={() => toggleCanal("app")} />
          Dentro de la app
        </label>
        <label>
          <input type="checkbox" checked={canales.email} onChange={() => toggleCanal("email")} />
          Correo electrónico
        </label>
        <label>
          <input type="checkbox" checked={canales.push} onChange={() => toggleCanal("push")} />
          Push notifications
        </label>

        <h4>Frecuencia de recordatorios</h4>
        <select value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)} className="modal-input">
          <option value="inmediato">Inmediato</option>
          <option value="diario">Resumen diario</option>
          <option value="semanal">Resumen semanal</option>
        </select>

        <h4>Notificaciones específicas</h4>
        <label>
          <input type="checkbox" checked={notificacionesEspecificas.tareas} onChange={() => toggleNotificacion("tareas")} />
          Tareas pendientes
        </label>
        <label>
          <input type="checkbox" checked={notificacionesEspecificas.eventos} onChange={() => toggleNotificacion("eventos")} />
          Eventos
        </label>
        <label>
          <input type="checkbox" checked={notificacionesEspecificas.recordatorios} onChange={() => toggleNotificacion("recordatorios")} />
          Recordatorios
        </label>
      </div>

      <div className="modal-actions">
        <button className="config-btn" onClick={guardarConfiguracionNotificaciones}>Guardar</button>
        <button className="config-btn" onClick={() => setMostrarNotificaciones(false)} style={{backgroundColor: "#ccc", color: "#000"}}>Cancelar</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Configuracion;
