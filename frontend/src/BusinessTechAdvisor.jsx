import React, { useState, useEffect } from 'react';
import { getTranslatedQuestions } from './data/questionsTranslated';
import { technologies } from './data/technologies';
import { analyzeAnswers } from './utils/analysis';
import ExportProgram from './components/ExportProgram';
import RecommendationList from './components/RecommendationList';
import AnalyzingCycle from './components/AnalyzingCycle';
import { useLanguage } from './hooks/useLanguage';
import './index.css';
import LanguageSwitcher from './components/LanguageSwitcher';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function BusinessTechAdvisor() {
  const { t, language, dir } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [analysisResults, setAnalysisResults] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);
  const questions = getTranslatedQuestions(t);

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

  // Show analyzing cycle overlay when analyzing
  if (isAnalyzing) {
    return <AnalyzingCycle />;
  }

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
      console.error('Error response:', err.response?.data || err.message);
      setAnalyzeError(t('errors.api_error', { error: err.message }));
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
    return <ResultsView results={analysisResults} onReset={handleReset} t={t} dir={dir} />;
  }

  const q = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const isAnswered = answers[q.id];

  return (
    <div className="advisor-container" dir={dir}>
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
          <h1 className="logo">{t('header.title')}</h1>
          <p className="tagline">{t('header.tagline')}</p>
          <div style={{ position: 'absolute', top: '20px', [dir === 'rtl' ? 'left' : 'right']: '20px' }}>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="card fade-in-up">
          <div className="progress-section">
            <div className="progress-text">{t('quiz.progress', { current: currentStep + 1, total: questions.length })}</div>
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
                {t('buttons.previous')}
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
                  {t('quiz.analyzing')}
                </>
              ) : currentStep === questions.length - 1 ? t('quiz.get_recommendations') : t('buttons.next')}
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

function ResultsView({ results, onReset, t, dir }) {
  try {
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

    // Debug: Check each recommendation for React elements (deep check)
    if (recommendations && Array.isArray(recommendations)) {
      recommendations.forEach((rec, idx) => {
        console.log(`📦 Recommendation ${idx}:`, rec);
        if (rec) {
          Object.keys(rec).forEach(key => {
            const val = rec[key];
            // Check direct values
            if (val && typeof val === 'object' && val.$$typeof) {
              console.error(`❌ FOUND REACT ELEMENT at rec[${idx}].${key}:`, val);
            }
            // Check array items
            if (Array.isArray(val)) {
              val.forEach((item, itemIdx) => {
                if (item && typeof item === 'object' && item.$$typeof) {
                  console.error(`❌ FOUND REACT ELEMENT in array at rec[${idx}].${key}[${itemIdx}]:`, item);
                }
              });
            }
          });
        }
      });
    }
  }

  return (
    <div className="advisor-container" dir={dir}>
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
          <h1>{t('results.title')}</h1>
          <p className="subtitle">{t('results.subtitle')}</p>
          {results.hasAIAnalysis && (
            <p style={{ color: '#4CAF50', fontSize: 14, marginTop: 8 }}>
              {t('results.ai_analysis')}
            </p>
          )}
          {results.apiAvailable === false && !results.hasAIAnalysis && (
            <p style={{ color: '#ff9800', fontSize: 14, marginTop: 8 }}>
              {t('results.local_analysis')}
            </p>
          )}
          {results.analysis && (
            <p style={{ color: '#666', fontSize: 13, marginTop: 12, fontStyle: 'italic' }}>
              {String(results.analysis)}
            </p>
          )}
        </div>

        {/* Interactive Timeline Display */}
        <RecommendationList recommendations={recommendations} />

        {/* Export Program Component */}
        {Object.keys(userAnalysis).length > 0 && recommendations.length > 0 && (
          <div style={{ margin: '60px 0', padding: '40px 0', borderTop: '1px solid #eee' }}>
            <ExportProgram userAnalysis={userAnalysis} recommendations={recommendations} />
          </div>
        )}

        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <button className="btn-primary" onClick={onReset} style={{ fontSize: 16, padding: '14px 32px' }}>
            {t('results.try_again')}
          </button>
        </div>
      </div>
    </div>
    );
  } catch (err) {
    console.error('❌ RESULTS VIEW ERROR:', err);
    console.error('Error message:', err.message);
    console.error('Stack:', err.stack);
    return (
      <div style={{ padding: '40px', backgroundColor: '#ffebee', color: '#c62828', fontFamily: 'sans-serif' }}>
        <h2>❌ Error Loading Results</h2>
        <p><strong>Error:</strong> {err.message}</p>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', overflowX: 'auto', fontSize: '12px' }}>
          {err.stack}
        </pre>
        <button onClick={onReset} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Try Again
        </button>
      </div>
    );
  }
}

export default BusinessTechAdvisor;
