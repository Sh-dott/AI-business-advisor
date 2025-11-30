// AdvancedAdvisor - Main Component for AI-Powered Business Advisory
import React, { useState, useEffect } from 'react';
import useAnalysis from '../hooks/useAnalysis';
import './AdvancedAdvisor.css';

// Component imports (will create these next)
const InitialInput = React.lazy(() => import('./InitialInput'));
const DiagnosisDisplay = React.lazy(() => import('./DiagnosisDisplay'));
const ChatInterface = React.lazy(() => import('./ChatInterface'));
const RecommendationGrid = React.lazy(() => import('./RecommendationCards'));
const HistorySidebar = React.lazy(() => import('./AnalysisHistory'));

function AdvancedAdvisor() {
  const {
    analysis,
    loading,
    error,
    histories,
    performAnalysis,
    refineAnalysis,
    loadAnalysis,
    loadHistories,
    resetAnalysis
  } = useAnalysis();

  const [currentStep, setCurrentStep] = useState('input'); // input, diagnosis, chat, recommendations
  const [apiProvider, setApiProvider] = useState('claude');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load user's analysis history on mount
    loadHistories();
  }, []);

  const handleInitialInput = async (description, businessType) => {
    setCurrentStep('analyzing');
    try {
      await performAnalysis(description, businessType, apiProvider);
      setCurrentStep('diagnosis');
    } catch (err) {
      console.error('Analysis error:', err);
      setCurrentStep('input');
    }
  };

  const handleChatMessage = async (message) => {
    if (!analysis) return;
    try {
      await refineAnalysis(analysis.id, message, apiProvider);
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  const handleLoadAnalysis = async (id) => {
    try {
      await loadAnalysis(id);
      setCurrentStep('diagnosis');
      setShowHistory(false);
    } catch (err) {
      console.error('Load error:', err);
    }
  };

  const handleNewAnalysis = () => {
    resetAnalysis();
    setCurrentStep('input');
  };

  return (
    <div className="advanced-advisor">
      {/* Header */}
      <div className="advisor-header">
        <div className="header-content">
          <h1 className="advisor-title">Business Tech Advisor</h1>
          <p className="advisor-subtitle">AI-Powered Technology Recommendations</p>
        </div>

        {/* Header Controls */}
        <div className="header-controls">
          <div className="api-provider-toggle">
            <label>AI Provider:</label>
            <select
              value={apiProvider}
              onChange={(e) => setApiProvider(e.target.value)}
              disabled={loading}
            >
              <option value="claude">Claude (Anthropic)</option>
              <option value="openai">GPT-4 (OpenAI)</option>
            </select>
          </div>

          <button
            className="history-btn"
            onClick={() => setShowHistory(!showHistory)}
            title="View past analyses"
          >
            📋 History ({histories.length})
          </button>

          {analysis && (
            <button
              className="new-analysis-btn"
              onClick={handleNewAnalysis}
            >
              ➕ New Analysis
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="advisor-layout">
        {/* History Sidebar */}
        {showHistory && (
          <React.Suspense fallback={<div>Loading...</div>}>
            <HistorySidebar
              histories={histories}
              onSelect={handleLoadAnalysis}
              onClose={() => setShowHistory(false)}
            />
          </React.Suspense>
        )}

        {/* Main Content */}
        <div className="advisor-main">
          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
              <button onClick={() => handleNewAnalysis()}>Start Over</button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>
                {currentStep === 'analyzing' && 'Analyzing your business...'}
                {currentStep === 'chat' && 'Processing your message...'}
              </p>
            </div>
          )}

          {/* Input Phase */}
          {currentStep === 'input' && !loading && (
            <React.Suspense fallback={<div>Loading...</div>}>
              <InitialInput onSubmit={handleInitialInput} />
            </React.Suspense>
          )}

          {/* Diagnosis Phase */}
          {(currentStep === 'diagnosis' || currentStep === 'chat') && analysis && !loading && (
            <>
              <React.Suspense fallback={<div>Loading...</div>}>
                <DiagnosisDisplay diagnosis={analysis.diagnosis} />
              </React.Suspense>

              {/* Chat Interface */}
              <React.Suspense fallback={<div>Loading...</div>}>
                <ChatInterface
                  chatHistory={analysis.chatHistory}
                  onSendMessage={handleChatMessage}
                  isLoading={loading}
                />
              </React.Suspense>

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <React.Suspense fallback={<div>Loading...</div>}>
                  <RecommendationGrid recommendations={analysis.recommendations} />
                </React.Suspense>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdvancedAdvisor;
