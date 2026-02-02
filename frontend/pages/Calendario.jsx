import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { materias as materiasService, calendario as calendarioService } from "../services/api";

import "./Calendario.css";

/**
 * Calendario de Estudio
 * Planificación y registro de sesiones de estudio
 */
function Calendario() {
  // Estados principales
  const [eventos, setEventos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [materias, setMaterias] = useState([]);

  // Estados del formulario
  const [mostrarForm, setMostrarForm] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  // Campos del formulario
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("estudio");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horaInicio, setHoraInicio] = useState("09:00");
  const [horaFin, setHoraFin] = useState("10:00");
  const [materiaId, setMateriaId] = useState("");
  const [minutosAntes, setMinutosAntes] = useState(30);

  // Filtros
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroMes, setFiltroMes] = useState("todos");



  // Colores por tipo de evento
  const coloresPorTipo = {
    estudio: "#3b82f6",
    tarea: "#ec4899",
    examen: "#ef4444",
    trabajo: "#f59e0b",
    reunion: "#8b5cf6",
    otro: "#6b7280"
  };

  // =============================
  // NOTIFICACIONES
  // =============================
  const pedirPermisoNotificacion = async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    const permiso = await Notification.requestPermission();
    return permiso === "granted";
  };

  const programarNotificacion = (evento, minutos) => {
    if (Notification.permission !== "granted") return;

    const fechaInicio = new Date(evento.start);
    const ahora = new Date();
    const tiempoRestante = fechaInicio.getTime() - ahora.getTime() - minutos * 60 * 1000;

    if (tiempoRestante > 0) {
      setTimeout(() => {
        new Notification("Recordatorio de evento", {
          body: `Tu evento "${evento.title}" empieza en ${minutos} minutos`,
          icon: "/icono.png"
        });
      }, tiempoRestante);
    }
  };

  // =============================
  // CARGAR DATOS
  // =============================
  const cargarMaterias = async () => {
    try {
      const data = await materiasService.list();
      setMaterias(data);
    } catch (error) {
      console.error("Error cargando materias:", error);
    }
  };

  const cargarEventos = async () => {
    try {
      const data = await calendarioService.list({
        tipo: filtroTipo !== "todos" ? filtroTipo : null
      });

      setHistorial(data);

      const eventosFormateados = data.map(e => {
        const color = e.completado ? "#22c55e" : coloresPorTipo[e.tipo] || "#3b82f6";

        const evento = {
          id: String(e.id),
          title: e.titulo,
          start: e.fecha_inicio,
          end: e.fecha_fin || e.fecha_inicio,
          backgroundColor: color,
          borderColor: color,
          textColor: "#ffffff",
          allDay: !e.fecha_inicio.includes("T")
        };

        if (!e.completado) {
          programarNotificacion(evento, minutosAntes);
        }

        return evento;
      });

      setEventos(eventosFormateados);
    } catch (error) {
      console.error("Error cargando calendario:", error);
    }
  };

  // =============================
  // CRUD EVENTOS
  // =============================
  const guardarEvento = async () => {
    if (!titulo.trim()) {
      alert("El título es requerido");
      return;
    }

    try {
      const fechaCompleta = `${fechaSeleccionada}T${horaInicio}:00`;
      const fechaFinCompleta = `${fechaSeleccionada}T${horaFin}:00`;

      const body = {
        titulo,
        fecha_inicio: fechaCompleta,
        fecha_fin: fechaFinCompleta,
        tipo,
        materia_id: materiaId || null
      };

      if (modoEdicion) {
        await calendarioService.update(eventoSeleccionado.id, body);
      } else {
        await calendarioService.create(body);
      }

      cerrarFormulario();
      cargarEventos();
    } catch (error) {
      console.error("Error guardando evento:", error);
      alert("Error al guardar: " + error.message);
    }
  };

  const eliminarEvento = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este evento?")) return;

    try {
      await calendarioService.delete(id);
      cerrarFormulario();
      cargarEventos();
    } catch (error) {
      console.error("Error eliminando:", error);
      alert("Error al eliminar evento");
    }
  };

  const toggleCompletado = async (id) => {
    if (!id) return;

    try {
      await calendarioService.toggle(id);
      cargarEventos();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const moverEvento = async (info) => {
    try {
      const eventoId = info.event.id;

      const body = {
        fecha_inicio: info.event.start.toISOString(),
        fecha_fin: info.event.end ? info.event.end.toISOString() : null
      };

      await calendarioService.update(eventoId, body);
    } catch (error) {
      console.error("Error moviendo evento:", error);
      info.revert();
    }
  };

  // =============================
  // HELPERS
  // =============================
  const cerrarFormulario = () => {
    setMostrarForm(false);
    setModoEdicion(false);
    setEventoSeleccionado(null);
    setTitulo("");
    setTipo("estudio");
    setHoraInicio("09:00");
    setHoraFin("10:00");
    setMateriaId("");
  };

  const abrirFormularioNuevo = (fecha) => {
    setFechaSeleccionada(fecha);
    setTitulo("");
    setTipo("estudio");
    setHoraInicio("09:00");
    setHoraFin("10:00");
    setMateriaId("");
    setModoEdicion(false);
    setMostrarForm(true);
  };

  const abrirFormularioEdicion = (evento) => {
    const e = historial.find(h => h.id === parseInt(evento.id));
    if (!e) return;

    setEventoSeleccionado(e);
    setTitulo(e.titulo);
    setTipo(e.tipo);
    setMateriaId(e.materia_id || "");

    // Extraer fecha y hora
    const fecha = e.fecha_inicio.split("T")[0];
    const hora = e.fecha_inicio.includes("T")
      ? e.fecha_inicio.split("T")[1].substring(0, 5)
      : "09:00";

    setFechaSeleccionada(fecha);
    setHoraInicio(hora);
    setHoraFin(e.fecha_fin?.split("T")[1]?.substring(0, 5) || "10:00");

    setModoEdicion(true);
    setMostrarForm(true);
  };

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const historialFiltrado = historial.filter(e => {
    if (filtroMes === "todos") return true;
    const mesEvento = new Date(e.fecha_inicio).getMonth() + 1;
    return mesEvento === parseInt(filtroMes, 10);
  });

  // =============================
  // EFFECTS
  // =============================
  useEffect(() => {
    pedirPermisoNotificacion();
    cargarMaterias();
  }, []);

  useEffect(() => {
    cargarEventos();
  }, [filtroTipo]);

  // =============================
  // RENDER
  // =============================
  return (
    <main className="dashboard">
      <div className="dash-card">
        <h3>📅 Calendario de Estudio</h3>
        <p className="estado-label">
          Planifica, arrastra y registra tus sesiones de estudio.
        </p>

        <div className="calendario-container">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="es"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay"
            }}
            events={eventos}
            editable={true}
            selectable={true}
            height="auto"
            eventDrop={moverEvento}
            eventResize={moverEvento}
            dateClick={(info) => abrirFormularioNuevo(info.dateStr)}
            eventClick={(info) => abrirFormularioEdicion(info.event)}
          />
        </div>

        {/* Modal de evento con Portal */}
        {mostrarForm && createPortal(
          <div className="modal-overlay" onClick={cerrarFormulario}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{modoEdicion ? "Editar evento" : "Nuevo evento"}</h3>
                <button onClick={cerrarFormulario}>✕</button>
              </div>

              <p className="modal-fecha">📆 {fechaSeleccionada}</p>

              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título del evento"
                className="modal-input"
                autoFocus
              />

              <div className="hora-container">
                <div className="hora-field">
                  <label>Hora inicio</label>
                  <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                  />
                </div>
                <div className="hora-field">
                  <label>Hora fin</label>
                  <input
                    type="time"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                  />
                </div>
              </div>

              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="modal-input"
              >
                <option value="estudio">📚 Estudio</option>
                <option value="tarea">📝 Tarea</option>
                <option value="examen">📋 Examen</option>
                <option value="trabajo">💼 Trabajo</option>
                <option value="reunion">👥 Reunión</option>
                <option value="otro">📌 Otro</option>
              </select>

              {materias.length > 0 && (
                <select
                  value={materiaId}
                  onChange={(e) => setMateriaId(e.target.value)}
                  className="modal-input"
                >
                  <option value="">Sin materia</option>
                  {materias.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))}
                </select>
              )}

              <div className="recordatorio-field">
                <label>Recordatorio:</label>
                <input
                  type="number"
                  min="0"
                  value={minutosAntes}
                  onChange={(e) => setMinutosAntes(parseInt(e.target.value, 10))}
                />
                <span style={{ color: "#6b7280", fontSize: "0.9rem" }}>min antes</span>
              </div>

              <div className="modal-actions">
                <button className="btn-guardar" onClick={guardarEvento}>
                  {modoEdicion ? "Actualizar" : "Guardar"}
                </button>
                {modoEdicion && (
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarEvento(eventoSeleccionado.id)}
                  >
                    Eliminar
                  </button>
                )}
                <button className="btn-cancelar" onClick={cerrarFormulario}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Filtros */}
        <div className="filtros-container">
          <div className="filtro-group">
            <label>Filtrar por tipo:</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="filtro-select"
            >
              <option value="todos">Todos</option>
              <option value="estudio">Estudio</option>
              <option value="tarea">Tarea</option>
              <option value="examen">Examen</option>
              <option value="trabajo">Trabajo</option>
              <option value="reunion">Reunión</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="filtro-group">
            <label>Filtrar por mes:</label>
            <select
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="filtro-select"
            >
              <option value="todos">Todos</option>
              <option value="01">Enero</option>
              <option value="02">Febrero</option>
              <option value="03">Marzo</option>
              <option value="04">Abril</option>
              <option value="05">Mayo</option>
              <option value="06">Junio</option>
              <option value="07">Julio</option>
              <option value="08">Agosto</option>
              <option value="09">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>
        </div>

        {/* Historial */}
        <div className="historial-section">
          <h3>📋 Historial de eventos</h3>

          <table className="historial-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Fecha</th>
                <th>Tipo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historialFiltrado.map(e => (
                <tr key={e.id}>
                  <td>{e.titulo}</td>
                  <td>{formatearFecha(e.fecha_inicio)}</td>
                  <td>
                    <span className={`tipo-badge ${e.tipo}`}>
                      {e.tipo}
                    </span>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={e.completado}
                      onChange={() => toggleCompletado(e.id)}
                    />
                  </td>
                </tr>
              ))}
              {historialFiltrado.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "#9ca3af" }}>
                    No hay eventos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default Calendario;
