import { useState, useEffect } from 'react';
import './Menu.css';
import '../components/Chatbot.css';
import { materias } from '../services/api';
import ChatbotComponent from '../components/Chatbot';

/**
 * Chatbot Page
 * Allows selecting a subject and chatting with the AI context
 */
function Chatbot() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const data = await materias.list();
      setSubjects(data);
      if (data.length > 0) {
        // Automatically select the first one or none
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard">
      <div className="dashboard-content" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem', height: 'calc(100vh - 100px)' }}>

        {/* Sidebar: Subject Selection */}
        <div className="sidebar-panel" style={{ width: '300px', padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Materia:</h3>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
            Selecciona una materia para chatear con sus apuntes y syllabus.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
            {loading ? (
              <p style={{ color: '#6b7280' }}>Cargando materias...</p>
            ) : subjects.length === 0 ? (
              <p style={{ color: '#6b7280' }}>No tienes materias registradas.</p>
            ) : (
              subjects.map(subject => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className={`btn-secondary ${selectedSubject?.id === subject.id ? 'active' : ''}`}
                  style={{
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    borderColor: selectedSubject?.id === subject.id ? '#4f46e5' : '#e5e7eb',
                    background: selectedSubject?.id === subject.id ? '#eff6ff' : 'white',
                    color: selectedSubject?.id === subject.id ? '#1e40af' : '#374151',
                    padding: '10px',
                    borderRadius: '8px',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    transition: 'all 0.2s',
                    boxShadow: selectedSubject?.id === subject.id ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
                  }}
                >
                  <span style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: subject.color || '#ccc',
                    marginRight: '10px',
                    flexShrink: 0
                  }}></span>
                  {subject.nombre}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-panel" style={{ flex: 1 }}>
          {selectedSubject ? (
            <>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '1rem', color: '#1f2937', fontSize: '1.25rem' }}>
                  Chat: <span style={{ color: '#4f46e5' }}>{selectedSubject.nombre}</span>
                </h2>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#6b7280' }}>
                  Pregunta sobre el syllabus o tus apuntes de esta materia.
                </p>
              </div>

              {/* Resetting the Chatbot component when subject changes by using key */}
              <div style={{ flex: 1, position: 'relative' }}>
                <ChatbotComponent key={selectedSubject.id} subjectId={selectedSubject.id} />
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5, color: '#9ca3af' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👈</div>
              <h3 style={{ color: '#4b5563' }}>Selecciona una materia para comenzar</h3>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

export default Chatbot;
