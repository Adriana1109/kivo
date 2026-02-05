import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bell, User, Settings, Timer, X, Palette } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ToastContainer, useToast } from "../components/Toast";
import "./Configuracion.css";


function Configuracion() {
  const { user, updateUser } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  // -- NOTIFICACIONES --
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  // Cargar config inicial del localStorage
  const [canales, setCanales] = useState(() => {
    const saved = localStorage.getItem("configNotificaciones");
    return saved ? JSON.parse(saved).canales : { app: true, email: false, push: false };
  });

  const [frecuencia, setFrecuencia] = useState(() => {
    const saved = localStorage.getItem("configNotificaciones");
    return saved ? JSON.parse(saved).frecuencia : "inmediato";
  });

  const [notificacionesEspecificas, setNotificacionesEspecificas] = useState(() => {
    const saved = localStorage.getItem("configNotificaciones");
    return saved ? JSON.parse(saved).notificacionesEspecificas : { tareas: true, eventos: true, recordatorios: false };
  });

  const toggleCanal = (canal) => {
    setCanales((prev) => ({ ...prev, [canal]: !prev[canal] }));
  };

  const toggleNotificacion = (tipo) => {
    setNotificacionesEspecificas((prev) => ({ ...prev, [tipo]: !prev[tipo] }));
  };

  const guardarConfiguracionNotificaciones = () => {
    const config = { canales, frecuencia, notificacionesEspecificas };
    localStorage.setItem("configNotificaciones", JSON.stringify(config));
    setMostrarNotificaciones(false);
    showToast("Configuración de notificaciones guardada", "success");
  };

  // -- APARIENCIA --
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

  // -- PERFIL --
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: ""
  });

  // Cargar datos del usuario al abrir modal
  useEffect(() => {
    if (showEditProfile && user) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        password: "" // No mostramos la contraseña actual
      });
    }
  }, [showEditProfile, user]);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      await updateUser(formData);
      setShowEditProfile(false);
      showToast("Perfil actualizado correctamente", "success");
    } catch (error) {
      showToast(error.message || "Error al actualizar perfil", "error");
    }
  };

  // -- POMODORO (Modo Estudio) --
  const [mostrarPomodoro, setMostrarPomodoro] = useState(false);
  const [pomodoroConfig, setPomodoroConfig] = useState(() => {
    const saved = localStorage.getItem("configPomodoro");
    return saved ? JSON.parse(saved) : {
      focusTime: 25,
      shortBreak: 5,
      longBreak: 15,
      autoStartBreaks: false,
      longBreakInterval: 4
    };
  });

  const handlePomodoroChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPomodoroConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value) || 0
    }));
  };

  const guardarPomodoro = () => {
    localStorage.setItem("configPomodoro", JSON.stringify(pomodoroConfig));
    setMostrarPomodoro(false);
    showToast("Configuración de Pomodoro guardada", "success");
  };

  return (
    <main className="dashboard">
      <div className="content-container">

        <div className="config-header-main">
          <h1><Settings size={32} /> Configuración</h1>
          <p>Personaliza tu experiencia en Kivo</p>
        </div>

        <div className="config-grid">
          {/* PERFIL */}
          <div className="dash-card config-card">
            <div className="card-icon-wrapper blue">
              <User size={24} />
            </div>
            <h3>Cuenta</h3>
            <p>Datos personales y sesión ({user?.nombre || "Usuario"})</p>
            <button className="config-btn primary" onClick={() => setShowEditProfile(true)}>
              Editar Perfil
            </button>
          </div>

          {/* MODO ESTUDIO */}
          <div className="dash-card config-card">
            <div className="card-icon-wrapper orange">
              <Timer size={24} />
            </div>
            <h3>Modo Estudio</h3>
            <p>Pomodoro y concentración</p>
            <button className="config-btn primary" onClick={() => setMostrarPomodoro(true)}>
              Configurar Pomodoro
            </button>
          </div>

          {/* NOTIFICACIONES */}
          <div className="dash-card config-card">
            <div className="card-icon-wrapper purple">
              <Bell size={24} />
            </div>
            <h3>Notificaciones</h3>
            <p>Alertas académicas</p>
            <button className="config-btn primary" onClick={() => setMostrarNotificaciones(true)}>
              Administrar avisos
            </button>
          </div>

          {/* APARIENCIA */}
          <div className="dash-card config-card">
            <div className="card-icon-wrapper green">
              <Palette size={24} />
            </div>
            <span className="part-badge coming-soon">PRÓXIMAMENTE</span>
            <h3>Apariencia</h3>
            <p>Tema visual del sistema</p>
            <div className="theme-toggle-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{darkMode ? "Modo Oscuro" : "Modo Claro"}</span>
              </div>
              <label className="switch" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() =>  setDarkMode(prev => !prev)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* MODAL POMODORO CONFIG */}
      {mostrarPomodoro && createPortal(
        <div className="conf-modal-overlay" onClick={() => setMostrarPomodoro(false)}>
          <div className="conf-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Configurar Pomodoro</h3>
              <button onClick={() => setMostrarPomodoro(false)}><X size={20} /></button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <label>
                  Focus (min)
                  <input
                    type="number"
                    name="focusTime"
                    min="1" max="120"
                    value={pomodoroConfig.focusTime}
                    onChange={handlePomodoroChange}
                    className="modal-input"
                  />
                </label>
                <label>
                  Descanso corto (min)
                  <input
                    type="number"
                    name="shortBreak"
                    min="1" max="30"
                    value={pomodoroConfig.shortBreak}
                    onChange={handlePomodoroChange}
                    className="modal-input"
                  />
                </label>
                <label>
                  Descanso largo (min)
                  <input
                    type="number"
                    name="longBreak"
                    min="1" max="60"
                    value={pomodoroConfig.longBreak}
                    onChange={handlePomodoroChange}
                    className="modal-input"
                  />
                </label>
                <label>
                  Intervalo (sesiones)
                  <input
                    type="number"
                    name="longBreakInterval"
                    min="1" max="10"
                    value={pomodoroConfig.longBreakInterval}
                    onChange={handlePomodoroChange}
                    className="modal-input"
                  />
                </label>
              </div>

              <div style={{ marginTop: '10px' }}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="autoStartBreaks"
                    checked={pomodoroConfig.autoStartBreaks}
                    onChange={handlePomodoroChange}
                  />
                  Iniciar descansos automáticamente
                </label>
              </div>
            </div>

            <div className="modal-actions">
              <button className="config-btn primary" onClick={guardarPomodoro}>Guardar</button>
              <button className="config-btn secondary" onClick={() => setMostrarPomodoro(false)}>Cancelar</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL EDITAR PERFIL */}
      {showEditProfile && createPortal(
        <div className="conf-modal-overlay" onClick={() => setShowEditProfile(false)}>
          <div className="conf-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Perfil</h3>
              <button onClick={() => setShowEditProfile(false)}><X size={20} /></button>
            </div>

            <div className="modal-body">
              <label>
                Nombre
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleProfileChange}
                  placeholder="Tu nombre"
                  className="modal-input"
                />
              </label>
              <label>
                Correo
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleProfileChange}
                  placeholder="correo@ejemplo.com"
                  className="modal-input"
                />
              </label>
              <label>
                Contraseña
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleProfileChange}
                  placeholder="Nueva contraseña (opcional)"
                  className="modal-input"
                />
              </label>
            </div>

            <div className="modal-actions">
              <button className="config-btn primary" onClick={handleSaveProfile}>
                Guardar Cambios
              </button>
              <button className="config-btn secondary" onClick={() => setShowEditProfile(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL NOTIFICACIONES */}
      {mostrarNotificaciones && createPortal(
        <div className="conf-modal-overlay" onClick={() => setMostrarNotificaciones(false)}>
          <div className="conf-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Administrar notificaciones</h3>
              <button onClick={() => setMostrarNotificaciones(false)}><X size={20} /></button>
            </div>

            <div className="modal-body">
              <h4>Canales de notificación</h4>
              <label className="checkbox-label">
                <input type="checkbox" checked={canales.app} onChange={() => toggleCanal("app")} />
                Dentro de la app
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={canales.email} onChange={() => toggleCanal("email")} />
                Correo electrónico
              </label>
              <label className="checkbox-label">
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
              <label className="checkbox-label">
                <input type="checkbox" checked={notificacionesEspecificas.tareas} onChange={() => toggleNotificacion("tareas")} />
                Tareas pendientes
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={notificacionesEspecificas.eventos} onChange={() => toggleNotificacion("eventos")} />
                Eventos
              </label>
              <label className="checkbox-label">
                <input type="checkbox" checked={notificacionesEspecificas.recordatorios} onChange={() => toggleNotificacion("recordatorios")} />
                Recordatorios
              </label>
            </div>

            <div className="modal-actions">
              <button className="config-btn primary" onClick={guardarConfiguracionNotificaciones}>Guardar</button>
              <button className="config-btn secondary" onClick={() => setMostrarNotificaciones(false)}>Cancelar</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}

export default Configuracion;
