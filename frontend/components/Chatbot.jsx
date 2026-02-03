import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { chatbot } from '../services/api';

function Chatbot({ subjectId }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
                // Show welcome message only if no history
                setMessages([
                    { role: 'ai', content: '¡Hola! Soy tu asistente académico. Pregúntame sobre el syllabus o tus apuntes.' }
                ]);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            setMessages([
                { role: 'ai', content: '¡Hola! Soy tu asistente académico. Pregúntame sobre el syllabus o tus apuntes.' }
            ]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleClearHistory = async () => {
        if (window.confirm('¿Estás seguro de que quieres borrar el historial de chat?')) {
            try {
                await chatbot.clearHistory(subjectId);
                setMessages([
                    { role: 'ai', content: '¡Hola! Soy tu asistente académico. Pregúntame sobre el syllabus o tus apuntes.' }
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
            setMessages(prev => [...prev, { role: 'error', content: 'Lo siento, hubo un error al procesar tu pregunta. Intenta de nuevo.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-window">
                <div className="chatbot-header">
                    <h3>Asistente Académico</h3>
                    {messages.length > 1 && (
                        <button
                            onClick={handleClearHistory}
                            className="clear-history-btn"
                            title="Borrar historial"
                        >
                            🗑️
                        </button>
                    )}
                </div>

                <div className="chatbot-messages">
                    {loadingHistory ? (
                        <div className="loading-history">Cargando historial...</div>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="message ai typing-indicator">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chatbot-input-area" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="chatbot-input"
                        placeholder="Escribe tu pregunta..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading || loadingHistory}
                    />
                    <button
                        type="submit"
                        className="chatbot-send-btn"
                        disabled={isLoading || loadingHistory || !inputValue.trim()}
                    >
                        ➤
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chatbot;
