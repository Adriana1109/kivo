import React, { useState, useEffect, useMemo } from 'react';
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
        <h1>🎓 Organiza tu carrera</h1>
        <p>Planifica, avanza y domina cada materia</p>
      </header>

      <h2 className="titulo">📘 Gestión Académica</h2>

      {/* INPUT PARA AGREGAR SEMESTRE */}
      <input
        className="input-line"
        placeholder="Nuevo semestre (ej: Semestre 1) + Enter"
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
  const [syllabusText, setSyllabusText] = useState(materia.syllabus || '');

  // Update text if prop changes from DB refresh
  useEffect(() => {
    setSyllabusText(materia.syllabus || '');
  }, [materia.syllabus]);

  const handleSaveSyllabus = () => {
    onUpdate({ syllabus: syllabusText });
    setShowSyllabus(false);
  };

  return (
    <div className="materia-card" style={{ border: `2px solid ${materia.color || '#3b82f6'}` }}>
      <div className="materia-header">
        <h5>{materia.nombre}</h5>
        <span className="x" onClick={onDelete}>✕</span>
      </div>

      {/* Syllabus Section */}
      <div className="syllabus-section" style={{ marginTop: '10px' }}>
        {!showSyllabus && (
          <button
            onClick={() => setShowSyllabus(true)}
            style={{
              background: 'none',
              border: '1px dashed #6366f1',
              color: '#6366f1',
              cursor: 'pointer',
              fontSize: '0.8rem',
              padding: '4px 8px',
              borderRadius: '6px',
              marginTop: '5px'
            }}
          >
            {materia.syllabus ? '📄 Ver/Editar Syllabus' : '+ Agg Syllabus'}
          </button>
        )}

        {showSyllabus && (
          <div className="syllabus-editor" style={{ marginTop: '8px', animation: 'fadeIn 0.2s' }}>
            <textarea
              className="comentario" // Reuse styles
              rows="5"
              placeholder="Pega aquí el temario o syllabus..."
              value={syllabusText}
              onChange={(e) => setSyllabusText(e.target.value)}
              style={{
                width: '100%',
                fontSize: '0.9rem',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                marginBottom: '8px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleSaveSyllabus}
                style={{
                  background: '#22c55e',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}
              >
                Guardar
              </button>
              <button
                onClick={() => setShowSyllabus(false)}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
