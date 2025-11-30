import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';
import { technologies } from './data/technologies';
import { analyzeAnswers } from './utils/analysis';
import './index.css';

function BusinessTechAdvisor() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analysisResults, setAnalysisResults] = useState(null);
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    // Load saved answers from localStorage
    const saved = localStorage.getItem('techAdvisorAnswers');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAnswers(parsed);
    }
  }, []);

  useEffect(() => {
    // Save answers to localStorage
    localStorage.setItem('techAdvisorAnswers', JSON.stringify(answers));
  }, [answers]);

  const handleSelectAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleNext = () => {
    const q = questions[currentStep];

    if (q.type === 'textarea') {
      setAnswers(prev => ({
        ...prev,
        [q.id]: textInput
      }));
    }

    if (currentStep === questions.length - 1) {
      // Run analysis
      const results = analyzeAnswers(answers);
      setAnalysisResults(results);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setAnalysisResults(null);
    setTextInput('');
    localStorage.removeItem('techAdvisorAnswers');
  };

  if (analysisResults) {
    return <ResultsView results={analysisResults} onReset={handleReset} />;
  }

  const q = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const isAnswered = answers[q.id];

  return (
    <div className="advisor-container">
      <div className="bg-container">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          {/* Background SVG patterns - same as original */}
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#1e3a5f', stopOpacity: 0.05 }} />
              <stop offset="100%" style={{ stopColor: '#00d4ff', stopOpacity: 0.05 }} />
            </linearGradient>
          </defs>
          <rect width="1200" height="800" fill="url(#grad1)" />
          <g stroke="#00d4ff" strokeWidth="1.5" fill="none" opacity="0.15">
            <path d="M 100,100 L 150,70 L 200,100 L 200,160 L 150,190 L 100,160 Z"/>
            <path d="M 220,150 L 270,120 L 320,150 L 320,210 L 270,240 L 220,210 Z"/>
          </g>
        </svg>
      </div>

      <div className="container">
        <div className="header">
          <h1 className="logo">Business Tech Advisor</h1>
          <p className="tagline">✨ מחפש את הכלי הנכון לעסקך? תן לנו לעזור לך!</p>
        </div>

        <div className="card fade-in-up">
          <div className="progress-section">
            <div className="progress-text">שלב {currentStep + 1} מתוך {questions.length}</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <h2>{q.text}</h2>
          <p className="subtitle">{q.subtitle}</p>

          <div className="options-section">
            {q.type === 'multiple' && (
              <div className="options">
                {q.options.map(opt => (
                  <div
                    key={opt.value}
                    className={`option ${answers[q.id] === opt.value ? 'selected' : ''}`}
                    onClick={() => handleSelectAnswer(q.id, opt.value)}
                  >
                    <div className="option-title">{opt.label}</div>
                    <div className="option-desc">{opt.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {q.type === 'textarea' && (
              <div className="textarea-section">
                <textarea
                  className="textarea-input"
                  placeholder={q.placeholder}
                  value={textInput}
                  onChange={handleTextChange}
                />
              </div>
            )}
          </div>

          <div className="button-group">
            {currentStep > 0 && (
              <button className="btn-secondary" onClick={handlePrevious}>
                ← חזור
              </button>
            )}
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!isAnswered && q.type === 'multiple'}
            >
              {currentStep === questions.length - 1 ? 'קבל המלצות ➜' : 'הבא ➜'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsView({ results, onReset }) {
  return (
    <div className="advisor-container">
      <div className="bg-container">
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#1e3a5f', stopOpacity: 0.05 }} />
              <stop offset="100%" style={{ stopColor: '#00d4ff', stopOpacity: 0.05 }} />
            </linearGradient>
          </defs>
          <rect width="1200" height="800" fill="url(#grad1)" />
        </svg>
      </div>

      <div className="container">
        <div className="results-header fade-in-up">
          <h1>🎯 המלצות טכנולוגיות עבורך</h1>
          <p className="subtitle">בהתאם לתשובותיך, הנה 4 הפתרונות הטובים ביותר להעלאת העסק שלך</p>
        </div>

        <div className="results-grid">
          {results.map((rec, idx) => (
            <div key={idx} className="recommendation-card fade-in-up">
              <div className="rec-header">
                <div>
                  <div className="rec-title">{rec.name}</div>
                  <div className="rec-category">{rec.category}</div>
                </div>
                <div className="priority-badge">{rec.priority}</div>
              </div>

              <p className="rec-description">{rec.description}</p>

              <ul className="factors">
                {rec.factors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <div className="step-list">
                <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: 12 }}>
                  📋 תוכנית יישום:
                </div>
                {rec.steps.map((step, i) => (
                  <div key={i} className="step-item">
                    <div className="step-number">{i + 1}</div>
                    <div className="step-content">
                      <p>{step}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rec-meta">
                <div className="meta-item">
                  <span>💰</span>
                  <span>{rec.pricing}</span>
                </div>
                <div className="meta-item">
                  <span>⏱️</span>
                  <span>{rec.setup}</span>
                </div>
                <div className="meta-item" style={{ gridColumn: '1 / -1' }}>
                  <span>📊</span>
                  <span>מורכבות: {rec.complexity}</span>
                </div>
              </div>

              <a href={rec.link} target="_blank" rel="noopener noreferrer" className="rec-link">
                בקר באתר ➜
              </a>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', margin: '60px 0' }}>
          <button className="btn-primary" onClick={onReset} style={{ fontSize: 16, padding: '14px 32px' }}>
            🔄 תן לי לנסות שוב
          </button>
        </div>
      </div>
    </div>
  );
}

export default BusinessTechAdvisor;
