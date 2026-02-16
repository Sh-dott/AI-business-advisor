import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShoppingCart, Briefcase, UtensilsCrossed, Heart, User, Factory, GraduationCap, HeartHandshake, Landmark, Monitor, Mail, Receipt, Smartphone, Phone, UserX, KeyRound, Lock, Building2, Ban, Shield, MailX, Fingerprint, BookOpen, UserCog, CircleDollarSign, Coins, Wallet, BadgeDollarSign, TrendingUp, Users, Users2, Building, Laptop, Server } from 'lucide-react';
import { getTranslatedQuestions } from './data/questionsTranslated';
import ExportProgram from './components/ExportProgram';
import RecommendationList from './components/RecommendationList';
import AnalyzingCycle from './components/AnalyzingCycle';
import { useLanguage } from './hooks/useLanguage';
import './index.css';
import LanguageSwitcher from './components/LanguageSwitcher';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ICON_MAP = {
  ShoppingCart, Briefcase, UtensilsCrossed, Heart, User, Factory, GraduationCap,
  HeartHandshake, Landmark, Monitor, Mail, Receipt, Smartphone, Phone, UserX,
  KeyRound, Lock, Building2, Ban, Shield, MailX, Fingerprint, BookOpen, UserCog,
  CircleDollarSign, Coins, Wallet, BadgeDollarSign, TrendingUp, Users, Users2,
  Building, Laptop, Server
};

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
    const saved = localStorage.getItem('techAdvisorAnswers');
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('techAdvisorAnswers');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('techAdvisorAnswers', JSON.stringify(answers));
  }, [answers]);

  if (isAnalyzing) {
    return <AnalyzingCycle />;
  }

  const handleSelectAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleNext = async () => {
    const q = questions[currentStep];

    if (q.type === 'textarea') {
      setAnswers(prev => ({ ...prev, [q.id]: textInput }));
    }

    if (currentStep === questions.length - 1) {
      const allAnswers = q.type === 'textarea'
        ? { ...answers, [q.id]: textInput }
        : answers;
      await performAIAnalysis(allAnswers, language);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const performAIAnalysis = async (allAnswers, currentLanguage = 'en') => {
    setIsAnalyzing(true);
    setAnalyzeError(null);

    try {
      const aiRequestData = {
        businessName: allAnswers.description ? allAnswers.description.substring(0, 50) : 'Your Business',
        industry: allAnswers.industry || 'General',
        threatExposure: allAnswers.threat_exposure ? [allAnswers.threat_exposure] : ['phishing_emails'],
        currentControls: allAnswers.current_controls ? [allAnswers.current_controls] : ['none'],
        securityBudget: allAnswers.security_budget || 'low',
        teamSize: allAnswers.team_size || 'small',
        techMaturity: allAnswers.tech_maturity || 'basic',
        description: allAnswers.description || 'Business needs anti-phishing protection',
        language: currentLanguage
      };

      const aiResponse = await fetch(`${API_URL}/ai-analysis/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiRequestData)
      });

      if (!aiResponse.ok) {
        throw new Error(`API error: ${aiResponse.status} ${aiResponse.statusText}`);
      }

      const aiData = await aiResponse.json();

      const userAnalysis = {
        businessName: aiRequestData.businessName,
        industry: aiRequestData.industry,
        threatExposure: Array.isArray(aiRequestData.threatExposure) ? aiRequestData.threatExposure.join(', ') : aiRequestData.threatExposure,
        currentControls: Array.isArray(aiRequestData.currentControls) ? aiRequestData.currentControls.join(', ') : aiRequestData.currentControls,
        securityBudget: aiRequestData.securityBudget,
        teamSize: aiRequestData.teamSize,
        techMaturity: aiRequestData.techMaturity,
        additionalContext: aiRequestData.description,
        diagnosis: aiData.diagnosis || null,
        threatModel: aiData.threatModel || null,
        roadmap: aiData.roadmap || null,
        kpis: aiData.kpis || [],
        incidentResponse: aiData.incidentResponse || null
      };

      setAnalysisResults({
        recommendations: aiData.recommendations || [],
        userAnalysis,
        diagnosis: aiData.diagnosis || null,
        threatModel: aiData.threatModel || null,
        roadmap: aiData.roadmap || null,
        kpis: aiData.kpis || [],
        incidentResponse: aiData.incidentResponse || null,
        analysis: aiData.analysis,
        hasAIAnalysis: true,
        apiAvailable: true
      });
    } catch (err) {
      console.error('AI Analysis error:', err);
      setAnalyzeError(t('errors.api_error', { error: err.message }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
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
  const isAnswered = answers[q.id];

  return (
    <div className="advisor-container" dir={dir}>
      {/* Animated background */}
      <div className="bg-container">
        <div className="bg-grid" />
        <div className="bg-glow" />
        <div className="bg-scanline" />
      </div>

      {/* Language switcher */}
      <div className="language-switcher-container">
        <LanguageSwitcher />
      </div>

      <div className="container">
        {/* Hero header */}
        <div className="header">
          <h1 className="logo">
            <span className="logo-accent">{t('header.title')}</span>
            <ShieldCheck className="logo-icon" size={36} />
          </h1>
          <p className="tagline">{t('header.tagline')}</p>
        </div>

        {/* Step indicator */}
        <div className="steps-indicator">
          {questions.map((_, idx) => (
            <React.Fragment key={idx}>
              <div className={`step-dot ${idx < currentStep ? 'completed' : idx === currentStep ? 'active' : 'pending'}`}>
                {idx < currentStep ? '\u2713' : idx + 1}
              </div>
              {idx < questions.length - 1 && (
                <div className={`step-line ${idx < currentStep ? 'completed' : 'pending'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Quiz card */}
        <div className="card fade-in-up" key={currentStep}>
          <h2>{q.text}</h2>
          <p className="subtitle">{q.subtitle}</p>

          <div className="options-section">
            {q.type === 'multiple' && (
              <div className="options">
                {q.options.map(opt => {
                  const IconComponent = opt.icon ? ICON_MAP[opt.icon] : null;
                  return (
                    <div
                      key={opt.value}
                      className={`option ${answers[q.id] === opt.value ? 'selected' : ''}`}
                      onClick={() => handleSelectAnswer(q.id, opt.value)}
                    >
                      {IconComponent && <IconComponent className="option-icon" size={20} />}
                      <div className="option-text">
                        <div className="option-title">{opt.label}</div>
                        <div className="option-desc">{opt.desc}</div>
                      </div>
                    </div>
                  );
                })}
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
              {currentStep === questions.length - 1 ? t('quiz.get_recommendations') : t('buttons.next')}
            </button>
          </div>

          {analyzeError && (
            <div className="error-box">
              {analyzeError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultsView({ results, onReset, t, dir }) {
  try {
    const recommendations = results.recommendations || [];
    const userAnalysis = results.userAnalysis || {};
    const diagnosis = results.diagnosis;

    return (
      <div className="advisor-container" dir={dir}>
        {/* Background */}
        <div className="bg-container">
          <div className="bg-grid" />
          <div className="bg-glow" />
        </div>

        <div className="container">
          {/* Results header */}
          <div className="results-header fade-in-up">
            <h1 className="logo">
              <span className="logo-accent">{t('results.title')}</span>
              <ShieldCheck className="logo-icon" size={36} />
            </h1>
            <p className="subtitle" style={{ marginBottom: 0 }}>{t('results.subtitle')}</p>
            {results.hasAIAnalysis && (
              <div className="ai-badge">
                <span className="pulse-dot" />
                {t('results.ai_analysis')}
              </div>
            )}
          </div>

          {/* Risk Dashboard */}
          {diagnosis && (
            <div className="risk-dashboard">
              <div className="risk-header">
                <h2>{t('results.risk_level')}</h2>
                <span className={`risk-badge ${diagnosis.riskLevel || 'medium'}`}>
                  {t(`results.risk_${diagnosis.riskLevel}`) || diagnosis.riskLevel}
                </span>
              </div>
              {diagnosis.summary && (
                <p className="risk-summary">{diagnosis.summary}</p>
              )}
              {diagnosis.keyFindings && diagnosis.keyFindings.length > 0 && (
                <ul className="risk-findings">
                  {diagnosis.keyFindings.map((finding, idx) => (
                    <li key={idx}>{finding}</li>
                  ))}
                </ul>
              )}
              {diagnosis.industryContext && (
                <p className="risk-context">{diagnosis.industryContext}</p>
              )}
            </div>
          )}

          {/* Analysis summary */}
          {results.analysis && (
            <p className="analysis-text">{String(results.analysis)}</p>
          )}

          {/* Security Recommendations */}
          <RecommendationList recommendations={recommendations} />

          {/* Export section */}
          {Object.keys(userAnalysis).length > 0 && recommendations.length > 0 && (
            <div className="export-divider">
              <ExportProgram userAnalysis={userAnalysis} recommendations={recommendations} />
            </div>
          )}

          {/* Reset */}
          <div className="reset-section">
            <button className="btn-primary" onClick={onReset} style={{ fontSize: 16, padding: '14px 32px' }}>
              {t('results.try_again')}
            </button>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error('ResultsView error:', err);
    return (
      <div style={{ padding: 40, background: '#0d1321', color: '#fca5a5', fontFamily: 'sans-serif', minHeight: '100vh' }}>
        <h2>Error Loading Results</h2>
        <p>{err.message}</p>
        <button onClick={onReset} style={{ padding: '10px 20px', cursor: 'pointer', marginTop: 16 }}>
          Try Again
        </button>
      </div>
    );
  }
}

export default BusinessTechAdvisor;
