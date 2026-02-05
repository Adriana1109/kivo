import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { chatbot } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { Send, Trash2, Bot, User } from 'lucide-react';

function Chatbot({ subjectId }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat history on mount
    useEffect(() => {
        loadHistory();
    }, [subjectId]);

    const loadHistory = async () => {
        try {
            setLoadingHistory(true);
            const history = await chatbot.getHistory(subjectId);

            if (history && history.length > 0) {
                // Map database format to component format
                const formattedMessages = history.map(msg => ({
                    role: msg.rol === 'user' ? 'user' : 'ai',
                    content: msg.mensaje
                }));
                setMessages(formattedMessages);
            } else {
                setMessages([
                    { role: 'ai', content: '¡Hola! Soy Kivo, tu asistente académico. 🐼\n\nPuedes preguntarme sobre el **syllabus** de la materia o sobre tus **apuntes**. Estoy aquí para ayudarte a estudiar.' }
                ]);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            setMessages([
                { role: 'ai', content: '¡Hola! Soy Kivo. Hubo un error cargando el historial, pero estoy listo para ayudarte.' }
            ]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleClearHistory = async () => {
        if (window.confirm('¿Estás seguro de que quieres borrar el historial de chat de esta materia?')) {
            try {
                await chatbot.clearHistory(subjectId);
                setMessages([
                    { role: 'ai', content: 'Historial borrado. ¡Empecemos de nuevo! 🚀' }
                ]);
            } catch (error) {
                console.error('Error clearing history:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue('');

        // Add User Message
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Call API
            const response = await chatbot.ask(subjectId, userMessage);

            // Add AI Response
            setMessages(prev => [...prev, { role: 'ai', content: response.answer }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'error', content: 'Lo siento, hubo un error al procesar tu pregunta. Por favor intenta de nuevo.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-window">
                <div className="chatbot-header-component">
                    <div className="header-info">
                        <div className="panda-avatar-small">🐼</div>
                        <div>
                            <h4>Kivo AI</h4>
                            <span className="status-dot"></span> <span className="status-text">En línea</span>
                        </div>
                    </div>
                    {messages.length > 1 && (
                        <button
                            onClick={handleClearHistory}
                            className="clear-history-btn"
                            title="Borrar historial"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>

                <div className="chatbot-messages" ref={messagesContainerRef}>
                    {loadingHistory ? (
                        <div className="loading-history">
                            <div className="typing-dot"></div>
                            <p>Recuperando memoria...</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`message-row ${msg.role}`}>
                                {msg.role === 'ai' && (
                                    <div className="avatar-icon ai-avatar">🐼</div>
                                )}

                                <div className={`message-bubble ${msg.role}`}>
                                    {msg.role === 'ai' ? (
                                        <ReactMarkdown
                                            components={{
                                                // Custom renderers to ensure styling matches
                                                p: ({ node, ...props }) => <p style={{ margin: '0 0 10px 0' }} {...props} />,
                                                ul: ({ node, ...props }) => <ul style={{ paddingLeft: '20px', margin: '0 0 10px 0' }} {...props} />,
                                                li: ({ node, ...props }) => <li style={{ marginBottom: '5px' }} {...props} />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    ) : (
                                        <p>{msg.content}</p>
                                    )}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="avatar-icon user-avatar"><User size={20} /></div>
                                )}
                            </div>
                        ))
                    )}

                    {isLoading && (
                        <div className="message-row ai">
                            <div className="avatar-icon ai-avatar">🐼</div>
                            <div className="message-bubble ai typing-indicator">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                </div>

                <form className="chatbot-input-area" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="chatbot-input"
                        placeholder="Pregunta sobre tu materia..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading || loadingHistory}
                    />
                    <button
                        type="submit"
                        className="chatbot-send-btn"
                        disabled={isLoading || loadingHistory || !inputValue.trim()}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chatbot;
