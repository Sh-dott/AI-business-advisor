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
      // Prepare data to send to AI API
      const aiRequestData = {
        businessName: allAnswers.description ? allAnswers.description.substring(0, 50) : 'Your Business',
        businessType: allAnswers.business || 'General Business',
        challenges: allAnswers.challenge ? [allAnswers.challenge] : [],
        budget: allAnswers.budget || 'medium',
        teamSize: allAnswers.team_size || 'small',
        techLevel: allAnswers.tech_level || 'basic',
        description: allAnswers.description || 'Business needs technology solutions'
      };

      console.log('🤖 Sending to AI API:', aiRequestData);

      // Call the AI analysis API endpoint
      const aiResponse = await fetch(`${API_URL}/ai-analysis/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aiRequestData)
      });

      if (!aiResponse.ok) {
        throw new Error(`API error: ${aiResponse.status} ${aiResponse.statusText}`);
      }

      const aiData = await aiResponse.json();

      console.log('✅ AI Response:', aiData);

      // Prepare user analysis data
      const userAnalysis = {
        businessName: aiRequestData.businessName,
        businessType: aiRequestData.businessType,
        mainChallenge: aiRequestData.challenges.join(', ') || 'Growth and efficiency',
        techLevel: aiRequestData.techLevel,
        budget: aiRequestData.budget,
        timeline: '3-6 months',
        teamSize: aiRequestData.teamSize,
        additionalContext: aiRequestData.description
      };

      // Store AI recommendations
      const resultsToSet = {
        recommendations: aiData.recommendations || [],
        userAnalysis,
        analysis: aiData.analysis,
        hasAIAnalysis: true,
        apiAvailable: true
      };

      console.log('📊 Results being set:', resultsToSet);

      setAnalysisResults(resultsToSet);
    } catch (err) {
      console.error('AI Analysis error:', err);
      setAnalyzeError(`Failed to get recommendations: ${err.message}`);

      // Fallback to local analysis if API fails
      try {
        const localResults = analyzeAnswers(allAnswers);
        setAnalysisResults({
          recommendations: localResults,
          userAnalysis: {
            businessName: allAnswers.description ? allAnswers.description.substring(0, 50) : 'Your Business',
            businessType: allAnswers.business || 'General Business',
            mainChallenge: allAnswers.challenge || 'Growth and efficiency',
            techLevel: allAnswers.tech_level || 'basic',
            budget: allAnswers.budget || 'medium',
            timeline: '3-6 months',
            teamSize: allAnswers.team_size || 'small'
          },
          hasAIAnalysis: false,
          apiAvailable: false
        });
      } catch (fallbackErr) {
        setAnalyzeError('Could not generate recommendations');
      }
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
  // Extract recommendations and userAnalysis from results object
  let recommendations = [];
  let userAnalysis = {};

  if (results) {
    console.log('📋 ResultsView received:', results);

    // Get recommendations array directly
    recommendations = results.recommendations || [];

    // Extract userAnalysis from results object
    userAnalysis = results.userAnalysis || {};

    console.log('✅ Extracted recommendations:', recommendations);
    console.log('✅ Extracted userAnalysis:', userAnalysis);

    // Debug: Check each recommendation for React elements
    if (recommendations && Array.isArray(recommendations)) {
      recommendations.forEach((rec, idx) => {
        console.log(`📦 Recommendation ${idx}:`, rec);
        if (rec) {
          Object.keys(rec).forEach(key => {
            const val = rec[key];
            if (val && typeof val === 'object' && val.$$typeof) {
              console.error(`❌ FOUND REACT ELEMENT at rec[${idx}].${key}:`, val);
            }
          });
        }
      });
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
          {results.hasAIAnalysis && (
            <p style={{ color: '#4CAF50', fontSize: 14, marginTop: 8 }}>
              ✨ המלצות אלו מופקות על ידי AI בעזרת OpenAI - ניתוח דינמי ומתאים לעסקך
            </p>
          )}
          {results.apiAvailable === false && !results.hasAIAnalysis && (
            <p style={{ color: '#ff9800', fontSize: 14, marginTop: 8 }}>
              💡 המלצות אלו הם בהתאם לניתוח מקומי. לקבלת ניתוח מפורט עם OpenAI, נא לבדוק את חיבור השרת.
            </p>
          )}
          {results.analysis && (
            <p style={{ color: '#666', fontSize: 13, marginTop: 12, fontStyle: 'italic' }}>
              {results.analysis}
            </p>
          )}
        </div>

        <div className="results-grid">
          {recommendations && recommendations.length > 0 ? (
            recommendations.map((rec, idx) => {
              // Skip if not a valid recommendation object
              if (!rec || !rec.name || !rec.category) {
                return null;
              }
              return (
                <div key={idx} className="recommendation-card fade-in-up">
                  <div className="rec-header">
                    <div>
                      <div className="rec-title">{rec.name}</div>
                      <div className="rec-category">{rec.category}</div>
                    </div>
                    <div className="priority-badge">{rec.priority}</div>
                  </div>

                  <p className="rec-description">{String(rec.description || '')}</p>

                  {rec.factors && Array.isArray(rec.factors) && (
                    <ul className="factors">
                      {rec.factors.map((f, i) => {
                        if (typeof f !== 'string') {
                          console.warn(`⚠️ Non-string factor at index ${i}:`, f);
                          return null;
                        }
                        return <li key={i}>{f}</li>;
                      })}
                    </ul>
                  )}

                  {rec.steps && Array.isArray(rec.steps) && (
                    <div className="step-list">
                      <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: 12 }}>
                        📋 תוכנית יישום:
                      </div>
                      {rec.steps.map((step, i) => {
                        if (typeof step !== 'string') {
                          console.warn(`⚠️ Non-string step at index ${i}:`, step);
                          return null;
                        }
                        return (
                          <div key={i} className="step-item">
                            <div className="step-number">{i + 1}</div>
                            <div className="step-content">
                              <p>{step}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="rec-meta">
                    {rec.pricing && (
                      <div className="meta-item">
                        <span>💰</span>
                        <span>{rec.pricing}</span>
                      </div>
                    )}
                    {rec.setup && (
                      <div className="meta-item">
                        <span>⏱️</span>
                        <span>{rec.setup}</span>
                      </div>
                    )}
                    {rec.complexity && (
                      <div className="meta-item" style={{ gridColumn: '1 / -1' }}>
                        <span>📊</span>
                        <span>מורכבות: {rec.complexity}</span>
                      </div>
                    )}
                  </div>

                  {rec.link && (
                    <a href={rec.link} target="_blank" rel="noopener noreferrer" className="rec-link">
                      בקר באתר ➜
                    </a>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>אין מלצות זמינות. אנא נסה שוב עם תשובות שונות.</p>
            </div>
          )}
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
