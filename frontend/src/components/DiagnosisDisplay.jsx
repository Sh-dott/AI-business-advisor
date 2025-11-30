// DiagnosisDisplay Component - Shows AI diagnosis results
import React, { useState } from 'react';
import './DiagnosisDisplay.css';

function DiagnosisDisplay({ diagnosis }) {
  const [expandedSection, setExpandedSection] = useState('problems');

  if (!diagnosis) {
    return <div className="diagnosis-empty">Loading diagnosis...</div>;
  }

  const {
    identifiedProblems = [],
    solutionCategories = [],
    summary = ''
  } = diagnosis;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="diagnosis-display">
      <div className="diagnosis-header">
        <h2>AI Diagnosis Results</h2>
        <p>Based on your business description, we identified the following areas for improvement</p>
      </div>

      <div className="diagnosis-grid">
        {/* Identified Problems Section */}
        <div
          className={`diagnosis-section ${expandedSection === 'problems' ? 'expanded' : ''}`}
          onClick={() => toggleSection('problems')}
        >
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">⚠️</span>
              <h3>Identified Problems</h3>
              <span className="problem-count">{identifiedProblems.length}</span>
            </div>
            <span className="expand-icon">{expandedSection === 'problems' ? '−' : '+'}</span>
          </div>

          {expandedSection === 'problems' && (
            <div className="section-content">
              {identifiedProblems.length > 0 ? (
                <ul className="problems-list">
                  {identifiedProblems.map((problem, idx) => (
                    <li key={idx} className="problem-item">
                      <span className="problem-marker">{idx + 1}</span>
                      <div className="problem-text">
                        <strong>{problem.title || problem}</strong>
                        {problem.description && (
                          <p>{problem.description}</p>
                        )}
                        {problem.impact && (
                          <span className="problem-impact">Impact: {problem.impact}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">No specific problems identified</p>
              )}
            </div>
          )}
        </div>

        {/* Solution Categories Section */}
        <div
          className={`diagnosis-section ${expandedSection === 'solutions' ? 'expanded' : ''}`}
          onClick={() => toggleSection('solutions')}
        >
          <div className="section-header">
            <div className="section-title">
              <span className="section-icon">💡</span>
              <h3>Solution Categories</h3>
              <span className="solution-count">{solutionCategories.length}</span>
            </div>
            <span className="expand-icon">{expandedSection === 'solutions' ? '−' : '+'}</span>
          </div>

          {expandedSection === 'solutions' && (
            <div className="section-content">
              {solutionCategories.length > 0 ? (
                <div className="solutions-grid">
                  {solutionCategories.map((category, idx) => (
                    <div key={idx} className="solution-card">
                      <h4>{category.name || category}</h4>
                      {category.description && (
                        <p>{category.description}</p>
                      )}
                      {category.priority && (
                        <span className={`priority priority-${category.priority.toLowerCase()}`}>
                          {category.priority} Priority
                        </span>
                      )}
                      {category.estimatedImpact && (
                        <div className="impact-bar">
                          <span>Impact:</span>
                          <div className="bar">
                            <div
                              className="fill"
                              style={{ width: `${category.estimatedImpact}%` }}
                            ></div>
                          </div>
                          <span>{category.estimatedImpact}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No solution categories identified</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary Section */}
      {summary && (
        <div className="diagnosis-summary">
          <h3>Summary</h3>
          <p>{summary}</p>
        </div>
      )}

      <div className="diagnosis-footer">
        <p className="footer-note">
          💬 Ask follow-up questions below to refine these recommendations or explore specific areas in more detail.
        </p>
      </div>
    </div>
  );
}

export default DiagnosisDisplay;
