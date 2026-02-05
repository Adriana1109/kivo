import { useNavigate } from "react-router-dom";
import './Menu.css';
import { materias as materiasService, apuntes as apuntesService, calendario as calendarioService, agenda as agendaService } from "../services/api";
import { useState, useEffect } from "react";
import { User, Bell, BookOpen, FileText, Calendar, CheckCircle, Clock, ClipboardList, Plus, Book, CalendarPlus, Zap, Play, X } from "lucide-react";

const hora = new Date().getHours();

const frasesHorario = {
  mañana: [
    "Buenos días. Hoy es un buen día para avanzar.",
    "Arranquemos fuerte. Tu futuro te está mirando.",
    "Un café, un plan y vamos con todo.",
    "Cada mañana es una nueva oportunidad. Aprovéchala.",
    "El éxito empieza con el primer paso del día.",
    "Hoy tienes 24 horas para hacer algo increíble.",
    "La disciplina de hoy es el éxito de mañana.",
    "Despierta con determinación, duerme con satisfacción.",
    "Tu único límite eres tú mismo. ¡A por ello!",
    "Hoy es el día perfecto para aprender algo nuevo."
  ],
  tarde: [
    "Buen trabajo hasta ahora. Sigamos firmes.",
    "Vas bien. No aflojes ahora.",
    "Este bloque puede marcar la diferencia.",
    "La mitad del camino ya está hecho. ¡Sigue!",
    "El esfuerzo de ahora valdrá la pena después.",
    "Mantén el ritmo. Los resultados están cerca.",
    "Tu constancia es tu superpoder.",
    "Cada hora de estudio te acerca a tu meta.",
    "No pares ahora, estás creando tu futuro.",
    "La tarde es perfecta para consolidar lo aprendido."
  ],
  noche: [
    "Último empujón del día.",
    "Pequeños avances también cuentan.",
    "Estudia inteligente, descansa mejor.",
    "Lo que siembras hoy, lo cosecharás mañana.",
    "Un poco más y habrás dado lo mejor de ti.",
    "El descanso es parte del éxito. No lo olvides.",
    "Cierra el día con una pequeña victoria.",
    "Mañana será más fácil gracias a lo que hiciste hoy.",
    "Tu esfuerzo nocturno vale oro.",
    "Prepara tu mente: mañana será un gran día."
  ]
};

let periodo = "mañana";
if (hora >= 12 && hora < 18) periodo = "tarde";
if (hora >= 18) periodo = "noche";

const mensajeHorario =
  frasesHorario[periodo][
  Math.floor(Math.random() * frasesHorario[periodo].length)
  ];


function Home() {
  const navigate = useNavigate();
  const [materias, setMaterias] = useState([]);
  const [apuntes, setApuntes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const tareas = eventos.filter(e => e.tipo === "tarea");
  const [agenda, setAgenda] = useState([]);
  const [nuevoItem, setNuevoItem] = useState("");
  // Estados para la sesión de estudio 
  const [mostrarModalEstudio, setMostrarModalEstudio] = useState(false);
  const [materiaEstudio, setMateriaEstudio] = useState("");
  const [tiempoEstudio, setTiempoEstudio] = useState(25); // default 25 minutos
  const [ultimaSesion, setUltimaSesion] = useState(null);
  const [temporizador, setTemporizador] = useState(0); // segundos restantes
  const [sesionActiva, setSesionActiva] = useState(false);



  //SESION DE ESTUDIO
  const abrirModalEstudio = () => {
    setMateriaEstudio(materias[0]?.id || "");
    setTiempoEstudio(25);
    setMostrarModalEstudio(true);
  };

  const cerrarModalEstudio = () => {
    setMostrarModalEstudio(false);
  };

  const iniciarSesionEstudio = () => {
    if (!materiaEstudio) return;

    const duracionSegundos = tiempoEstudio * 60;
    const inicio = new Date().getTime(); // timestamp en ms

    setTemporizador(duracionSegundos);
    setSesionActiva(true);
    setMostrarModalEstudio(false);

    const nuevaSesion = {
      materia: materias.find(m => m.id === materiaEstudio)?.nombre || "Sin materia",
      tiempo: tiempoEstudio,
      inicio,      // guardamos la hora exacta de inicio
      duracion: duracionSegundos
    };

    localStorage.setItem("ultimaSesionEstudio", JSON.stringify(nuevaSesion));
    setUltimaSesion(nuevaSesion);
  };

  //AGENDA
  const agregarAgenda = async () => {
    if (!nuevoItem.trim()) return;
    try {
      const data = await agendaService.create(nuevoItem.trim());
      // Refresh list
      const updatedList = await agendaService.list();
      setAgenda(updatedList);
      setNuevoItem("");
    } catch (error) {
      console.error("Error agregando item:", error);
    }
  };

  const eliminarAgenda = async (id) => {
    try {
      await agendaService.delete(id);
      // Refresh list
      const updatedList = await agendaService.list();
      setAgenda(updatedList);
    } catch (error) {
      console.error("Error eliminando item:", error);
    }
  };

  // Materias
  useEffect(() => {
    const cargarMaterias = async () => {
      try {
        const data = await materiasService.list();
        setMaterias(data);
      } catch (error) {
        console.error("Error cargando materias:", error);
      }
    };

    cargarMaterias();
  }, []);

  // Apuntes
  useEffect(() => {
    const cargarApuntes = async () => {
      try {
        const data = await apuntesService.list();
        setApuntes(data);
      } catch (error) {
        console.error("Error cargando apuntes:", error);
      }
    };

    cargarApuntes();
  }, []);

  // Calendario / Eventos
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const data = await calendarioService.list();
        setEventos(data);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      }
    };

    cargarEventos();
  }, []);

  //Agenda
  useEffect(() => {
    const cargarAgenda = async () => {
      try {
        const data = await agendaService.list();
        setAgenda(data);
      } catch (error) {
        console.error("Error cargando agenda:", error);
      }
    };
    cargarAgenda();
  }, []);

  //Sesion Estudio
  useEffect(() => {
    const sesionGuardada = localStorage.getItem("ultimaSesionEstudio");
    if (sesionGuardada) {
      setUltimaSesion(JSON.parse(sesionGuardada));
    }
  }, []);

  //Temporizador
  useEffect(() => {
    if (!sesionActiva) return;

    const interval = setInterval(() => {
      setTemporizador(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setSesionActiva(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sesionActiva]);

  useEffect(() => {
    const sesionGuardada = localStorage.getItem("ultimaSesionEstudio");
    if (sesionGuardada) {
      const sesion = JSON.parse(sesionGuardada);
      const ahora = new Date().getTime();
      const tiempoPasado = Math.floor((ahora - sesion.inicio) / 1000);
      const tiempoRestante = sesion.duracion - tiempoPasado;

      if (tiempoRestante > 0) {
        setTemporizador(tiempoRestante);
        setSesionActiva(true);
      } else {
        setTemporizador(0);
        setSesionActiva(false);
      }

      setUltimaSesion(sesion);
    }
  }, []);

  return (
    <main className="dashboard">
      <div className="dashboard-collage">

        {/* HEADER SUPERIOR */}
        <div className="home-header">

          {/* Avatar / Panda Coach */}
          <div className="panda-coach">

            <div className="panda-text">
              <p>{mensajeHorario}</p>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="notification-icon">
            <Bell size={24} />
          </div>
        </div>

        {/* TARJETAS */}
        <div className="summary-cards-grid">

          <div className="summary-card">
            <BookOpen size={32} color="#3b82f6" />
            <h4>Materias</h4>
            <p className="summary-value">
              {materias.filter(m => m.activa !== 0).length} activas
            </p>
          </div>

          <div className="summary-card">
            <FileText size={32} color="#f59e0b" />
            <h4>Último Apunte</h4>
            <p className="summary-value">
              {apuntes.length > 0 ? apuntes[apuntes.length - 1].titulo : "Ninguno"}
            </p>
          </div>

          <div className="summary-card">
            <Calendar size={32} color="#8b5cf6" />
            <h4>Eventos</h4>
            <p className="summary-value">
              {eventos.length > 0 ? eventos[0].titulo : "No hay eventos"}
            </p>
          </div>

          <div className="summary-card">
            <CheckCircle size={32} color="#22c55e" />
            <h4>Tareas</h4>
            <p className="summary-value">
              {tareas.length > 0 ? tareas.length + " pendientes" : "No hay tareas"}
            </p>
          </div>

        </div>


        {mostrarModalEstudio && (
          <div className="modal-overlay" onClick={cerrarModalEstudio}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Iniciar sesión de estudio</h3>
                <button onClick={cerrarModalEstudio}><X size={20} /></button>
              </div>

              <div className="modal-body">
                <label>Materia a estudiar:</label>
                <select
                  value={materiaEstudio}
                  onChange={(e) => setMateriaEstudio(e.target.value)}
                  className="modal-input"
                >
                  {materias.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>

                <label>Tiempo de estudio (minutos):</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  step="5"
                  value={tiempoEstudio}
                  onChange={(e) => setTiempoEstudio(parseInt(e.target.value))}
                  className="modal-input"
                />
              </div>

              <div className="modal-actions">
                <button className="btn-guardar" onClick={iniciarSesionEstudio}>Iniciar</button>
                <button className="btn-cancelar" onClick={cerrarModalEstudio}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* BLOQUE CENTRAL */}
        <div className="home-body">

          {/* Estudio rápido */}
          <div className="study-box">
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Clock size={24} color="#ef4444" />
              Estudio rápido
            </h3>
            <button className="start-study" onClick={abrirModalEstudio}>
              <Play size={16} /> Iniciar sesión de estudio
            </button>

            <div className="study-info">
              <p> Hoy: {ultimaSesion ? `${Math.floor(ultimaSesion.tiempo / 60)}h ${ultimaSesion.tiempo % 60}min` : "0h 0min"} </p>
              <p> Última sesión: {ultimaSesion ? ultimaSesion.materia : "Ninguna"} </p>
              {sesionActiva && (
                <p> Tiempo restante: {Math.floor(temporizador / 60)}:{(temporizador % 60).toString().padStart(2, "0")} min </p>
              )}
            </div>
          </div>


          {/* AGENDA RAPIDA */}
          <div className="agenda-box modern-agenda">
            <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ClipboardList size={24} color="#3b82f6" />
              Agenda rápida
            </h3>

            {/* Lista de items */}
            <ul className="agenda-list">
              {agenda.length === 0 && (
                <li className="agenda-empty">Escribe algo para empezar...</li>
              )}
              {agenda.map((item) => (
                <li key={item.id} className="agenda-item">
                  <span>• {item.texto}</span>
                  <button
                    className="agenda-delete"
                    onClick={() => eliminarAgenda(item.id)}
                    title="Eliminar"
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>

            {/* Input para agregar nuevo item */}
            <div className="agenda-input-container">
              <input
                type="text"
                placeholder="Escribe algo..."
                value={nuevoItem}
                onChange={(e) => setNuevoItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && agregarAgenda()}
                className="agenda-input"
              />
              <button className="agenda-add-btn" onClick={agregarAgenda}>
                Agregar
              </button>
            </div>
          </div>

        </div>

        {/* ACCIONES RÁPIDAS */}
        <div className="quick-actions-grid">
          <div className="quick-card" onClick={() => navigate("/apuntes")}>
            <Plus size={40} color="#3b82f6" />
            <p className="quick-text">Nuevo Apunte</p>
          </div>

          <div className="quick-card" onClick={() => navigate("/materias")}>
            <Book size={40} color="#8b5cf6" />
            <p className="quick-text">Nueva Materia</p>
          </div>

          <div className="quick-card" onClick={() => navigate("/calendario")}>
            <CalendarPlus size={40} color="#22c55e" />
            <p className="quick-text">Nuevo Evento</p>
          </div>

          <div className="quick-card" onClick={() => navigate("/focus")}>
            <Zap size={40} color="#f59e0b" />
            <p className="quick-text">Modo Focus</p>
          </div>
        </div>


      </div>
    </main>
  );
}
export default Home;
