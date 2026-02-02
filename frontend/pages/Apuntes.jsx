import { useState, useEffect } from 'react';
import './Apuntes.css';

import { materias as materiasService, apuntes as apuntesService } from "../services/api";

/**
 * Componente Apuntes
 * Gestión de apuntes/notas por materia
 */
function Apuntes() {
  // Estados principales
  const [apuntes, setApuntes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados del formulario
  const [modoEdicion, setModoEdicion] = useState(false);
  const [apunteEditando, setApunteEditando] = useState(null);
  const [materiaId, setMateriaId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  // Estados de filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroMateria, setFiltroMateria] = useState('todos');

  // =============================
  // CARGAR DATOS
  // =============================
  const cargarMaterias = async () => {
    try {
      const data = await materiasService.list();
      setMaterias(data);
      if (data.length > 0 && !materiaId) {
        setMateriaId(data[0].id);
      }
    } catch (error) {
      console.error('Error cargando materias:', error);
    }
  };

  const cargarApuntes = async () => {
    try {
      const data = await apuntesService.list(filtroMateria !== 'todos' ? filtroMateria : null);
      setApuntes(data);
    } catch (error) {
      console.error('Error cargando apuntes:', error);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // CRUD OPERACIONES
  // =============================
  const guardarApunte = async () => {
    if (!materiaId || !titulo.trim()) {
      alert('Debes seleccionar una materia y escribir un título');
      return;
    }

    setSaving(true);

    try {
      const body = {
        materia_id: parseInt(materiaId),
        titulo: titulo.trim(),
        contenido: contenido.trim(),
      };

      if (modoEdicion) {
        await apuntesService.update(apunteEditando.id, body);
      } else {
        await apuntesService.create(body);
      }

      limpiarFormulario();
      cargarApuntes();
    } catch (error) {
      console.error('Error guardando apunte:', error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const eliminarApunte = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este apunte?')) return;

    try {
      await apuntesService.delete(id);
      cargarApuntes();
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar apunte');
    }
  };

  const editarApunte = (apunte) => {
    setApunteEditando(apunte);
    setMateriaId(apunte.materia_id);
    setTitulo(apunte.titulo);
    setContenido(apunte.contenido || '');
    setModoEdicion(true);
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limpiarFormulario = () => {
    setModoEdicion(false);
    setApunteEditando(null);
    setTitulo('');
    setContenido('');
    if (materias.length > 0) {
      setMateriaId(materias[0].id);
    }
  };

  // =============================
  // HELPERS
  // =============================
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const apuntesFiltrados = apuntes.filter(apunte => {
    const coincideBusqueda = busqueda === '' ||
      apunte.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (apunte.contenido && apunte.contenido.toLowerCase().includes(busqueda.toLowerCase()));

    return coincideBusqueda;
  });

  // =============================
  // EFFECTS
  // =============================
  useEffect(() => {
    cargarMaterias();
  }, []);

  useEffect(() => {
    cargarApuntes();
  }, [filtroMateria]);

  // =============================
  // RENDER
  // =============================
  if (loading) {
    return (
      <main className="dashboard">
        <div className="dash-card">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando apuntes...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <div className="dash-card apuntes-container">
        {/* Header */}
        <div className="apuntes-header">
          <h2>Apuntes</h2>
          <span className="apuntes-count">{apuntes.length} apuntes</span>
        </div>

        {/* Formulario */}
        <div className="apunte-form">
          <h3>{modoEdicion ? 'Editar apunte' : 'Nuevo apunte'}</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Materia</label>
              <select
                value={materiaId}
                onChange={(e) => setMateriaId(e.target.value)}
                className="form-select"
              >
                {materias.length === 0 ? (
                  <option value="">No hay materias</option>
                ) : (
                  materias.map(m => (
                    <option key={m.id} value={m.id}>{m.nombre}</option>
                  ))
                )}
              </select>
            </div>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título del apunte"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contenido</label>
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Escribe tu apunte aquí..."
              className="form-textarea"
            />
          </div>

          <div className="form-actions">
            <button
              className="btn-primary"
              onClick={guardarApunte}
              disabled={saving || materias.length === 0}
            >
              {saving ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Guardar')}
            </button>
            {modoEdicion && (
              <button className="btn-secondary" onClick={limpiarFormulario}>
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="apuntes-filtros">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar apuntes..."
            className="search-input"
          />
          <select
            value={filtroMateria}
            onChange={(e) => setFiltroMateria(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todas las materias</option>
            {materias.map(m => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>

        {/* Lista de apuntes */}
        <div className="apuntes-list">
          {apuntesFiltrados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <h3>No hay apuntes</h3>
              <p>
                {busqueda
                  ? 'No se encontraron apuntes con ese texto'
                  : 'Crea tu primer apunte para comenzar'}
              </p>
            </div>
          ) : (
            apuntesFiltrados.map(apunte => (
              <div key={apunte.id} className="apunte-card">
                <div className="apunte-header">
                  <h4 className="apunte-titulo">{apunte.titulo}</h4>
                  <span
                    className="apunte-materia"
                    style={{
                      backgroundColor: apunte.materia_color ? `${apunte.materia_color}20` : '#dbeafe',
                      color: apunte.materia_color || '#1d4ed8'
                    }}
                  >
                    {apunte.materia_nombre}
                  </span>
                </div>

                {apunte.contenido && (
                  <p className="apunte-contenido">{apunte.contenido}</p>
                )}

                <div className="apunte-footer">
                  <span className="apunte-fecha">
                    📅 {formatearFecha(apunte.updated_at || apunte.created_at)}
                  </span>
                  <div className="apunte-actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => editarApunte(apunte)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => eliminarApunte(apunte.id)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default Apuntes;
