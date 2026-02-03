import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { chatbot } from '../services/api';

function Chatbot({ subjectId }) {
    // Removed isOpen state as it is now always visible in the embedded page
    const [messages, setMessages] = useState([
        { role: 'ai', content: '¡Hola! Soy tu asistente académico. Pregúntame sobre el syllabus o tus apuntes.' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            {/* Main Window */}
            {/* Removed dynamic class open/close logic */}
            <div className="chatbot-window">
                <div className="chatbot-header">
                    <h3>Asistente Académico</h3>
                    {/* Removed close button since it's embedded */}
                </div>

                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.role}`}>
                            {msg.content}
                        </div>
                    ))}
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
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="chatbot-send-btn"
                        disabled={isLoading || !inputValue.trim()}
                    >
                        ➤
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chatbot;
