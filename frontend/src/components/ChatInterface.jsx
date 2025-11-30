// ChatInterface Component - Multi-turn chat with AI
import React, { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';

function ChatInterface({ chatHistory = [], onSendMessage, isLoading }) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setMessage('');

    try {
      await onSendMessage(userMessage);
      // Focus back on input for next message
      inputRef.current?.focus();
    } catch (error) {
      console.error('Send message error:', error);
      setMessage(userMessage); // Restore message on error
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>Ask Follow-up Questions</h3>
        <p>Refine your analysis by asking specific questions about your business needs</p>
      </div>

      <div className="chat-messages">
        {chatHistory.length === 0 ? (
          <div className="chat-empty">
            <p>Start the conversation by asking about your business challenges, technology needs, or specific solutions.</p>
            <div className="suggested-questions">
              <p className="suggestions-label">Suggested questions:</p>
              <ul>
                <li>"What tools would help us manage inventory better?"</li>
                <li>"How can we improve our customer experience?"</li>
                <li>"What's the best CRM for our business size?"</li>
                <li>"How should we approach digital transformation?"</li>
              </ul>
            </div>
          </div>
        ) : (
          chatHistory.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role}`}>
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                {msg.timestamp && (
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="chat-message assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={isLoading}
            maxLength={500}
            className="chat-input"
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="send-btn"
          >
            {isLoading ? (
              <span className="spinner-small"></span>
            ) : (
              '✉️ Send'
            )}
          </button>
        </div>
        <div className="char-count-chat">
          {message.length}/500 characters
        </div>
      </form>
    </div>
  );
}

export default ChatInterface;
