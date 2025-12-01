import React, { useState, useEffect } from 'react';
import { questions } from './data/questions';
import { technologies } from './data/technologies';
import { analyzeAnswers } from './utils/analysis';
import ExportProgram from './components/ExportProgram';
import './index.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function BusinessTechAdvisor() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analysisResults, setAnalysisResults] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);

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

  const handleNext = async () => {
    const q = questions[currentStep];

    if (q.type === 'textarea') {
      setAnswers(prev => ({
        ...prev,
        [q.id]: textInput
      }));
    }

    if (currentStep === questions.length - 1) {
      // Get all answers including current textarea
      const allAnswers = q.type === 'textarea'
        ? { ...answers, [q.id]: textInput }
        : answers;

      // Try to use backend API for AI-powered analysis
      await performAIAnalysis(allAnswers);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const performAIAnalysis = async (allAnswers) => {
    setIsAnalyzing(true);
    setAnalyzeError(null);

    try {
      // Get local recommendations first (these are used for display and export)
      const localResults = analyzeAnswers(allAnswers);

      // Prepare user analysis data with proper field names for backend
      const userAnalysis = {
        businessName: allAnswers.businessName || 'Your Business',
        businessType: allAnswers.industry || 'General Business',  // Map: industry -> businessType
        mainChallenge: allAnswers.challenges || 'Growth and efficiency',  // Map: challenges -> mainChallenge
        techLevel: allAnswers.size || 'Small team',  // Map: size -> techLevel
        budget: allAnswers.budget || 'Medium',
        timeline: allAnswers.timeline || '3-6 months',
        teamSize: allAnswers.size,
        additionalContext: allAnswers.additionalContext || ''
      };

      // Check if backend API is available
      let apiAvailable = false;
      try {
        const healthResponse = await fetch(`${API_URL.replace('/api', '')}/health`, {
          method: 'GET',
          timeout: 5000
        });
        apiAvailable = healthResponse.ok;
      } catch (healthErr) {
        console.error('Backend health check failed:', healthErr);
        apiAvailable = false;
      }

      // Display local analysis results with user analysis attached for export
      setAnalysisResults({
        ...localResults,
        userAnalysis,
        hasAIAnalysis: false,
        apiAvailable: apiAvailable
      });
    } catch (err) {
      console.error('AI Analysis error:', err);
      // Fallback to local analysis if API fails
      const localResults = analyzeAnswers(allAnswers);
      setAnalysisResults({
        ...localResults,
        userAnalysis: {
          businessName: allAnswers.businessName || 'Your Business',
          businessType: allAnswers.industry || 'General Business',
          mainChallenge: allAnswers.challenges || 'Growth and efficiency',
          techLevel: allAnswers.size || 'Small team',
          budget: allAnswers.budget || 'Medium',
          timeline: allAnswers.timeline || '3-6 months',
          teamSize: allAnswers.size
        },
        apiAvailable: false
      });
    } finally {
      setIsAnalyzing(false);
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
    setAnalyzeError(null);
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
              <button className="btn-secondary" onClick={handlePrevious} disabled={isAnalyzing}>
                ← חזור
              </button>
            )}
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={(!isAnswered && q.type === 'multiple') || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <span style={{ marginRight: 8 }}>🔄</span>
                  מנתח...
                </>
              ) : currentStep === questions.length - 1 ? 'קבל המלצות ➜' : 'הבא ➜'}
            </button>
          </div>
          {analyzeError && (
            <div style={{ marginTop: 16, padding: 12, backgroundColor: '#fff3cd', borderRadius: 8, color: '#856404' }}>
              ⚠️ {analyzeError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultsView({ results, onReset }) {
  // Extract recommendations - results now contains spread array + userAnalysis object
  let recommendations = [];
  let userAnalysis = {};

  if (results) {
    // Extract userAnalysis from results object
    userAnalysis = results.userAnalysis || {};

    // Get all recommendations (they are spread into results as indices)
    // Filter to get only the recommendation objects (have 'name' property)
    if (Array.isArray(results)) {
      recommendations = results;
    } else {
      // If results is an object, extract array items by filtering
      // Look for numeric indices (0, 1, 2, 3...) which contain recommendation objects
      recommendations = Object.keys(results)
        .filter(key => /^\d+$/.test(key)) // Only numeric keys
        .map(key => results[key])
        .filter(item => item && typeof item === 'object');
    }
  }

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
          {results.apiAvailable === false && (
            <p style={{ color: '#ff9800', fontSize: 14, marginTop: 8 }}>
              💡 המלצות אלו הם בהתאם לניתוח מקומי. לקבלת ניתוח מפורט עם OpenAI, נא לבדוק את חיבור השרת.
            </p>
          )}
        </div>

        <div className="results-grid">
          {recommendations.map((rec, idx) => (
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

        {/* Export Program Component */}
        {Object.keys(userAnalysis).length > 0 && recommendations.length > 0 && (
          <div style={{ margin: '60px 0', padding: '40px 0', borderTop: '1px solid #eee' }}>
            <ExportProgram userAnalysis={userAnalysis} recommendations={recommendations} />
          </div>
        )}

        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <button className="btn-primary" onClick={onReset} style={{ fontSize: 16, padding: '14px 32px' }}>
            🔄 תן לי לנסות שוב
          </button>
        </div>
      </div>
    </div>
  );
}

export default BusinessTechAdvisor;
