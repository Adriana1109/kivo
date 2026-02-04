import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { GraduationCap, BookOpen, FileText, X, Plus } from 'lucide-react';
import { materias as materiasService } from "../services/api";
import './Materias.css';

// Genera un ID temporal si es necesario
const genId = () => crypto.randomUUID();

export default function Materias() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Input para crear un NUEVO semestre visualmente
  const [nuevoSemestreNombre, setNuevoSemestreNombre] = useState('');

  // Cargar materias al inicio
  useEffect(() => {
    cargarMaterias();
  }, []);

  const cargarMaterias = async () => {
    try {
      const data = await materiasService.list();
      setMaterias(data);
    } catch (error) {
      console.error("Error cargando materias:", error);
    } finally {
      setLoading(false);
    }
  };

  // Agrupar materias por semestre
  const semestresAgrupados = useMemo(() => {
    const grupos = {};

    // Primero, agrupar las existentes
    materias.forEach(m => {
      const sem = m.semestre || 'Sin Semestre';
      if (!grupos[sem]) {
        grupos[sem] = [];
      }
      grupos[sem].push(m);
    });

    // Convertir a array [{ nombre: 'Semestre 1', materias: [...] }]
    return Object.keys(grupos).sort().map(nombre => ({
      nombre,
      materias: grupos[nombre]
    }));
  }, [materias]);

  // Estado local para "semestres temporales"
  const [semestresTemporales, setSemestresTemporales] = useState([]);

  const addSemestreVisual = (e) => {
    if (e.key !== 'Enter' || !nuevoSemestreNombre.trim()) return;
    if (semestresAgrupados.find(s => s.nombre === nuevoSemestreNombre)) {
      alert("Ese semestre ya existe");
      return;
    }
    setSemestresTemporales([...semestresTemporales, nuevoSemestreNombre]);
    setNuevoSemestreNombre('');
  };

  // Combinar semestres reales vs temporales
  const todosLosSemestres = useMemo(() => {
    const reales = semestresAgrupados.map(s => s.nombre);
    const unicos = new Set([...reales, ...semestresTemporales]);
    return Array.from(unicos).sort().map(nombre => ({
      nombre,
      materias: semestresAgrupados.find(s => s.nombre === nombre)?.materias || []
    }));
  }, [semestresAgrupados, semestresTemporales]);


  const crearMateriaEnSemestre = async (nombreMateria, nombreSemestre) => {
    if (!nombreMateria.trim()) return;

    try {
      const colores = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      const colorRandom = colores[Math.floor(Math.random() * colores.length)];

      await materiasService.create({
        nombre: nombreMateria,
        semestre: nombreSemestre,
        color: colorRandom,
        descripcion: ''
      });

      setSemestresTemporales(prev => prev.filter(t => t !== nombreSemestre));
      cargarMaterias();
    } catch (error) {
      console.error(error);
      alert("Error al crear materia");
    }
  };

  const deleteMateria = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      await materiasService.delete(id);
      cargarMaterias();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar materia");
    }
  };

  const updateMateria = async (id, data) => {
    try {
      await materiasService.update(id, data);
      cargarMaterias();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar materia");
    }
  };

  // Calcular progreso global
  const progreso = Math.round((materias.length * 5) % 100);

  return (
    <main className="dashboard">
      <header className="hero">
        <h1><GraduationCap size={36} style={{ marginBottom: '-6px', marginRight: '10px' }} /> Organiza tu carrera</h1>
        <p>Planifica, avanza y domina cada materia</p>
      </header>

      <h2 className="titulo"><BookOpen size={28} style={{ marginBottom: '-6px', marginRight: '10px' }} /> Gestión Académica</h2>

      {/* INPUT PARA AGREGAR SEMESTRE */}
      <input
        className="input-line"
        placeholder="Nuevo semestre (ej: 1er Semestre) + Enter"
        value={nuevoSemestreNombre}
        onChange={e => setNuevoSemestreNombre(e.target.value)}
        onKeyDown={addSemestreVisual}
      />

      <div className="materias-layout">
        <section>
          {loading && <p>Cargando...</p>}

          {!loading && todosLosSemestres.length === 0 && (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
              No hay semestres. Añade uno arriba.
            </p>
          )}

          {todosLosSemestres.map(sem => (
            <BloqueSemestre
              key={sem.nombre}
              nombre={sem.nombre}
              materias={sem.materias}
              onAddMateria={(nombreMateria) => crearMateriaEnSemestre(nombreMateria, sem.nombre)}
              onDeleteMateria={deleteMateria}
              onUpdateMateria={updateMateria}
            />
          ))}
        </section>
      </div>
    </main>
  );
}

function BloqueSemestre({ nombre, materias, onAddMateria, onDeleteMateria, onUpdateMateria }) {
  const [nuevaMateria, setNuevaMateria] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onAddMateria(nuevaMateria);
      setNuevaMateria('');
    }
  };

  return (
    <div className="bloque">
      <h3>{nombre}</h3>

      {/* Input para agregar materia A ESTE semestre */}
      <input
        className="input-line small"
        placeholder="Nueva materia + Enter"
        value={nuevaMateria}
        onChange={e => setNuevaMateria(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {materias.map(m => (
        <MateriaCard
          key={m.id}
          materia={m}
          onDelete={() => onDeleteMateria(m.id, m.nombre)}
          onUpdate={(data) => onUpdateMateria(m.id, data)}
        />
      ))}

      {materias.length === 0 && (
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', fontStyle: 'italic' }}>
          Sin materias aun
        </p>
      )}
    </div>
  );
}

function MateriaCard({ materia, onDelete, onUpdate }) {
  const [showSyllabus, setShowSyllabus] = useState(false);

  // Optimistic UI: Estado local para cambio inmediato
  const [optimisticActive, setOptimisticActive] = useState(
    materia.activa !== undefined ? Boolean(materia.activa) : true
  );

  // Sincronizar si la DB manda un cambio real (ej: al recargar)
  useEffect(() => {
    setOptimisticActive(materia.activa !== undefined ? Boolean(materia.activa) : true);
  }, [materia.activa]);

  const handleToggleActive = (e) => {
    e.stopPropagation();
    const newState = !optimisticActive;
    setOptimisticActive(newState); // ¡Cambio visual instantáneo!
    onUpdate({ activa: newState ? 1 : 0 }); // La petición va por detrás
  };

  const isActive = optimisticActive;

  return (
    <div className={`materia-card ${!isActive ? 'inactiva' : ''}`} style={{ border: `2px solid ${materia.color || '#3b82f6'}` }}>
      <div className="materia-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h5 style={{ opacity: isActive ? 1 : 0.6 }}>{materia.nombre}</h5>
          {/* Toggle Switch */}
          <label className="switch-toggle" title={isActive ? "Materia Activa" : "Materia Inactiva"}>
            <input type="checkbox" checked={isActive} onChange={handleToggleActive} />
            <span className="slider-round"></span>
          </label>
        </div>
        <span className="x" onClick={onDelete} style={{ display: 'flex', alignItems: 'center' }}><X size={16} /></span>
      </div>

      {/* Syllabus Section - Solo visible si activa o si el usuario quiere verla */}
      <div className={`syllabus-section ${!isActive ? 'faded' : ''}`} style={{ marginTop: '10px' }}>
        <button
          onClick={() => setShowSyllabus(true)}
          style={{
            background: 'none',
            border: `1px dashed ${isActive ? '#6366f1' : '#9ca3af'}`,
            color: isActive ? '#6366f1' : '#9ca3af',
            cursor: 'pointer',
            fontSize: '0.8rem',
            padding: '4px 8px',
            borderRadius: '6px',
            marginTop: '5px'
          }}
        >
          {materia.syllabus ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} /> Ver/Editar Syllabus
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={14} /> Agg Syllabus
            </span>
          )}
        </button>

        {showSyllabus && (
          <SyllabusModal
            materia={materia}
            onClose={() => setShowSyllabus(false)}
            onSave={(text) => {
              onUpdate({ syllabus: text });
              setShowSyllabus(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

function SyllabusModal({ materia, onClose, onSave }) {
  const [text, setText] = useState(materia.syllabus || '');
  const textareaRef = React.useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content syllabus-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Syllabus: {materia.nombre}</h3>
        </div>

        <div className="modal-body">
          <textarea
            ref={textareaRef}
            className="syllabus-textarea"
            placeholder="Pega aquí el temario, unidades, bibliografía..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={1}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-save" onClick={() => onSave(text)}>Guardar Syllabus</button>
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>,
    document.body
  );
}
