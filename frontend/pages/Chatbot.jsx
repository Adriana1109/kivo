import { useState, useEffect } from 'react';
import './Menu.css';
import './Chatbot.css'; // New Styles
import { materias } from '../services/api';
import ChatbotComponent from '../components/Chatbot';
import { MessageCircle, Book, ArrowLeft } from 'lucide-react';

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
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard chatbot-main">
      <div className="chatbot-page">

        {/* Sidebar: Subject Selection */}
        <aside className="sidebar-panel">
          <div className="sidebar-header">
            <h3><Book size={20} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Materias</h3>
            <p>Selecciona una materia para consultar.</p>
          </div>

          <div className="subjects-list">
            {loading ? (
              <div className="loading-spinner" />
            ) : subjects.length === 0 ? (
              <p>No tienes materias registradas.</p>
            ) : (
              subjects.filter(s => s.activa !== 0).map(subject => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject)}
                  className={`subject-btn ${selectedSubject?.id === subject.id ? 'active' : ''}`}
                >
                  <span
                    className="subject-dot"
                    style={{ backgroundColor: subject.color || '#ccc' }}
                  ></span>
                  {subject.nombre}
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <section className="chat-panel-container">
          {selectedSubject ? (
            <>
              <div className="chat-selected-header">
                <h2>
                  <MessageCircle size={28} color="#4f46e5" />
                  Chat: <span className="highlight-subject">{selectedSubject.nombre}</span>
                </h2>
                <p>Pregunta sobre el syllabus o tus apuntes de esta materia.</p>
              </div>

              <div className="chat-component-wrapper">
                <ChatbotComponent key={selectedSubject.id} subjectId={selectedSubject.id} />
              </div>
            </>
          ) : (
            <div className="empty-chat-state">
              <div className="empty-icon">🐼</div>
              <h3>Selecciona una materia para comenzar</h3>
              <p>El Panda Coach está listo para ayudarte con tus dudas.</p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default Chatbot;
