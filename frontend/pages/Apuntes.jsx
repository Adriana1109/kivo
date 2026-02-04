import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, BookOpen, Clock, FileText, X, Edit2, Trash2, Calendar } from 'lucide-react';
import { materias as materiasService, apuntes as apuntesService } from "../services/api";
import './Apuntes.css';

export default function Apuntes() {
  const [apuntes, setApuntes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // Estados para Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingApunte, setEditingApunte] = useState(null); // Si no es null, es modo edición
  const [viewingApunte, setViewingApunte] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [materiasData, apuntesData] = await Promise.all([
        materiasService.list(),
        apuntesService.list()
      ]);
      setMaterias(materiasData);
      setApuntes(apuntesData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingApunte) {
        await apuntesService.update(editingApunte.id, data);
      } else {
        await apuntesService.create(data);
      }
      cargarDatos(); // Recargar para tener datos frescos
      setShowCreateModal(false);
      setEditingApunte(null);
    } catch (error) {
      alert("Error al guardar: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar apunte?")) return;
    try {
      await apuntesService.delete(id);
      cargarDatos();
      if (viewingApunte?.id === id) setViewingApunte(null); // Cerrar visor si se borra
    } catch (error) {
      console.error(error);
    }
  };

  // --- AGRUPACIÓN ---
  const apuntesFiltrados = useMemo(() => {
    return apuntes.filter(a =>
      a.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (a.contenido && a.contenido.toLowerCase().includes(busqueda.toLowerCase()))
    );
  }, [apuntes, busqueda]);

  const estructura = useMemo(() => {
    const grupos = {};

    // 1. Agrupar por Semestre
    apuntesFiltrados.forEach(apunte => {
      const semestre = apunte.semestre || 'Otros / Sin Semestre';

      if (!grupos[semestre]) grupos[semestre] = {};

      const materiaNombre = apunte.materia_nombre || 'Sin Materia';

      if (!grupos[semestre][materiaNombre]) {
        grupos[semestre][materiaNombre] = {
          materiaColor: apunte.materia_color,
          apuntes: []
        };
      }

      grupos[semestre][materiaNombre].apuntes.push(apunte);
    });

    // 2. Convertir a Array ordenado
    return Object.keys(grupos).sort().map(semestre => ({
      nombreSemestre: semestre,
      materias: Object.keys(grupos[semestre]).map(materia => ({
        nombreMateria: materia,
        ...grupos[semestre][materia]
      }))
    }));

  }, [apuntesFiltrados]);

  return (
    <main className="dashboard">
      <div className="apuntes-page">
        {/* Header */}
        <header className="apuntes-header-main">
          <div>
            <h1><FileText size={32} /> Mis Apuntes</h1>
            <p>Gestiona y revisa tus notas por materia</p>
          </div>
          <button className="btn-new-apunte" onClick={() => { setEditingApunte(null); setShowCreateModal(true); }}>
            <Plus size={20} /> Nuevo Apunte
          </button>
        </header>

        {/* Buscador */}
        <div className="search-bar-container">
          <Search className="search-icon" size={20} />
          <input
            placeholder="Buscar en tus apuntes..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-state">Cargando apuntes...</div>
        ) : (
          <div className="apuntes-grid-layout">
            {apuntesFiltrados.length === 0 && (
              <div className="empty-state">
                <p>No se encontraron apuntes</p>
              </div>
            )}

            {estructura.map(sem => (
              <div key={sem.nombreSemestre} className="semestre-section">
                <h2 className="semestre-title">{sem.nombreSemestre}</h2>

                <div className="materias-grid">
                  {sem.materias.map(mat => (
                    <div key={mat.nombreMateria} className="materia-column">
                      <div className="materia-badge" style={{ borderColor: mat.materiaColor, color: mat.materiaColor }}>
                        <BookOpen size={14} /> {mat.nombreMateria}
                      </div>

                      <div className="apuntes-stack">
                        {mat.apuntes.map(apunte => (
                          <div
                            key={apunte.id}
                            className="apunte-mini-card"
                            onClick={() => setViewingApunte(apunte)}
                          >
                            <h4>{apunte.titulo}</h4>
                            <div className="mini-card-footer">
                              <span><Clock size={12} /> {new Date(apunte.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODALES */}
      {(showCreateModal || editingApunte) && (
        <ApunteFormModal
          isOpen={true}
          onClose={() => { setShowCreateModal(false); setEditingApunte(null); }}
          onSave={handleSave}
          materias={materias}
          apunte={editingApunte}
        />
      )}

      {viewingApunte && (
        <ApunteViewModal
          apunte={viewingApunte}
          onClose={() => setViewingApunte(null)}
          onEdit={() => {
            setViewingApunte(null); // Cerrar visor
            setEditingApunte(viewingApunte); // Abrir editor
          }}
          onDelete={() => handleDelete(viewingApunte.id)}
        />
      )}
    </main>
  );
}

// --- SUBCOMPONENTES (MODALES) ---

function ApunteFormModal({ isOpen, onClose, onSave, materias, apunte }) {
  const [titulo, setTitulo] = useState(apunte?.titulo || '');
  const [contenido, setContenido] = useState(apunte?.contenido || '');
  const [materiaId, setMateriaId] = useState(apunte?.materia_id || (materias[0]?.id || ''));
  const textareaRef = React.useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [contenido, isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content apunte-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{apunte ? 'Editar Apunte' : 'Nuevo Apunte'}</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="modal-body">
          <label>Materia</label>
          <select value={materiaId} onChange={e => setMateriaId(e.target.value)}>
            {materias.filter(m => m.activa !== 0).map(m => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>

          <label>Título</label>
          <input
            placeholder="Ej: Resumen Introducción..."
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />

          <label>Contenido</label>
          <textarea
            ref={textareaRef}
            placeholder="Escribe tus notas aquí..."
            value={contenido}
            onChange={e => setContenido(e.target.value)}
            rows={1}
            style={{ minHeight: '150px', overflow: 'hidden', resize: 'none' }}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-primary" onClick={() => onSave({ titulo, contenido, materia_id: materiaId })}>
            Guardar Apunte
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ApunteViewModal({ apunte, onClose, onEdit, onDelete }) {
  if (!apunte) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content apunte-view-modal" onClick={e => e.stopPropagation()}>
        <div className="view-header">
          <div className="meta-info">
            <span className="materia-tag" style={{ color: apunte.materia_color, borderColor: apunte.materia_color }}>
              {apunte.materia_nombre}
            </span>
            <span className="date-tag">
              <Calendar size={14} /> {new Date(apunte.updated_at || apunte.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="actions">
            <button onClick={onEdit} title="Editar"><Edit2 size={18} /></button>
            <button onClick={onDelete} title="Eliminar" style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
            <button onClick={onClose}><X size={24} /></button>
          </div>
        </div>

        <h1 className="view-title">{apunte.titulo}</h1>

        <div className="view-content">
          {apunte.contenido ? (
            <p>{apunte.contenido}</p>
          ) : (
            <p style={{ fontStyle: 'italic', color: '#9ca3af' }}>Sin contenido</p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
