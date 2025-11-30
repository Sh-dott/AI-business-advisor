// RecommendationCards Component - Display technology recommendations
import React, { useState } from 'react';
import './RecommendationCards.css';

function RecommendationCards({ recommendations = [] }) {
  const [expandedId, setExpandedId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Get unique categories
  const categories = ['all', ...new Set(recommendations.map(r => r.category))];

  // Filter recommendations
  const filtered = filterCategory === 'all'
    ? recommendations
    : recommendations.filter(r => r.category === filterCategory);

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getRoleScore = (rec) => {
    // Combine AI score and base score
    const aiScore = (rec.aiScore || 0) * 0.7;
    const baseScore = (rec.baseScore || 0) * 0.3;
    return Math.round(aiScore + baseScore);
  };

  const getScoreColor = (score) => {
    if (score >= 85) return '#10b981'; // green
    if (score >= 70) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  if (recommendations.length === 0) {
    return (
      <div className="recommendations-container">
        <div className="empty-state">
          <p>No recommendations yet. Continue the conversation to discover solutions tailored to your business.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h2>Recommended Technologies</h2>
        <p>Tools and solutions matched to your business needs</p>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <span className="filter-label">Filter by:</span>
        <div className="filter-buttons">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
        <span className="result-count">{filtered.length} results</span>
      </div>

      {/* Recommendations Grid */}
      <div className="recommendations-grid">
        {filtered.map((rec, idx) => {
          const score = getRoleScore(rec);
          const isExpanded = expandedId === rec._id || expandedId === idx;

          return (
            <div
              key={rec._id || idx}
              className={`recommendation-card ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleExpanded(rec._id || idx)}
            >
              <div className="card-header">
                <div className="card-title">
                  <h3>{rec.name}</h3>
                  <span className="category-badge">{rec.category}</span>
                </div>
                <div className="card-score">
                  <svg className="score-circle" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={getScoreColor(score)}
                      strokeWidth="8"
                      strokeDasharray={`${(score / 100) * 282.7} 282.7`}
                      strokeLinecap="round"
                      style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                    <text x="50" y="50" textAnchor="middle" dy="0.3em" fontSize="24" fontWeight="bold" fill={getScoreColor(score)}>
                      {score}
                    </text>
                  </svg>
                  <span className="score-label">Match</span>
                </div>
              </div>

              <div className="card-main">
                <p className="description">{rec.description}</p>

                {rec.matchReason && (
                  <div className="match-reason">
                    <strong>Why for you:</strong>
                    <p>{rec.matchReason}</p>
                  </div>
                )}

                {isExpanded && (
                  <div className="card-details">
                    {rec.features && rec.features.length > 0 && (
                      <div className="detail-section">
                        <h4>Key Features</h4>
                        <ul>
                          {rec.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {rec.pricing && (
                      <div className="detail-section">
                        <h4>Pricing Model</h4>
                        <p className="pricing-badge">{rec.pricing}</p>
                      </div>
                    )}

                    {rec.complexity && (
                      <div className="detail-section">
                        <h4>Implementation Complexity</h4>
                        <div className="complexity-bar">
                          <div className="bar">
                            <div
                              className="fill"
                              style={{ width: `${(rec.complexity / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span>{rec.complexity}/10</span>
                        </div>
                      </div>
                    )}

                    {rec.setupTimeHours && (
                      <div className="detail-section">
                        <h4>Estimated Setup Time</h4>
                        <p>{rec.setupTimeHours} hours</p>
                      </div>
                    )}

                    {rec.implementationPlan && (
                      <div className="detail-section">
                        <h4>Implementation Plan</h4>
                        <p>{rec.implementationPlan}</p>
                      </div>
                    )}

                    {rec.link && (
                      <div className="detail-section">
                        <a href={rec.link} target="_blank" rel="noopener noreferrer" className="learn-more-link">
                          Learn More →
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="card-footer">
                <span className="expand-indicator">
                  {isExpanded ? '−' : '+'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>No recommendations in this category. Try a different filter or ask more questions.</p>
        </div>
      )}
    </div>
  );
}

export default RecommendationCards;
