import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import '../styles/recommendation-list.css';

/**
 * RecommendationList
 * Displays recommendations in a vertical list with expand/collapse functionality
 * Simple, clean, and accessible list view instead of timeline
 */
const RecommendationList = ({ recommendations = [] }) => {
  const [expandedIndices, setExpandedIndices] = useState(new Set([0]));
  const { t } = useLanguage();

  const handleToggle = (index) => {
    setExpandedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (recommendations.length === 0) {
    return (
      <div className="recommendation-list-container">
        <div className="empty-state">
          <p>{t('errors.server_error')}</p>
        </div>
      </div>
    );
  }

  const getPriorityLabel = (index) => {
    if (index === 0) return t('results.high_priority');
    if (index === 1) return t('results.medium_priority');
    return t('results.low_priority');
  };

  const getComplexityLabel = (complexity) => {
    if (typeof complexity === 'number') {
      if (complexity <= 3) return t('results.easy');
      if (complexity <= 6) return t('results.moderate');
      return t('results.complex');
    }
    return complexity;
  };

  return (
    <div className="recommendation-list-container">
      <div className="recommendation-list">
        {recommendations.map((rec, index) => {
          const isExpanded = expandedIndices.has(index);
          const name = rec.name || rec.title || 'Recommendation';
          const category = rec.category || 'Technology';
          const description = rec.description || '';
          const benefits = rec.benefits || [];
          const setupTime = rec.setup_time || rec.setupTime || 'Variable';
          const complexity = rec.complexity || rec.complexity_score || 'Moderate';
          const pricing = rec.pricing || rec.pricing_description || t('results.free');
          const link = rec.link || '#';

          return (
            <div key={index} className={`list-item ${isExpanded ? 'expanded' : ''}`}>
              {/* Header / Collapsed view */}
              <div className="list-item-header" onClick={() => handleToggle(index)}>
                <div className="item-rank">{index + 1}</div>

                <div className="item-title-section">
                  <h3 className="item-title">{name}</h3>
                  <p className="item-category">{category}</p>
                </div>

                <div className="item-priority">
                  <span className={`priority-badge priority-${index}`}>
                    {getPriorityLabel(index)}
                  </span>
                </div>

                <button
                  className={`expand-button ${isExpanded ? 'expanded' : ''}`}
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  onClick={() => handleToggle(index)}
                >
                  <span className="arrow">▼</span>
                </button>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="list-item-content">
                  {/* Description */}
                  {description && (
                    <div className="content-section">
                      <p className="section-text">{description}</p>
                    </div>
                  )}

                  {/* Benefits */}
                  {Array.isArray(benefits) && benefits.length > 0 && (
                    <div className="content-section">
                      <h4 className="section-title">✓ {t('results.benefits')}</h4>
                      <ul className="benefits-list">
                        {benefits.map((benefit, idx) => (
                          <li key={idx}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Meta Information - Setup, Complexity, Pricing */}
                  <div className="meta-grid">
                    <div className="meta-item">
                      <span className="meta-label">⏱️ {t('results.setup_time')}</span>
                      <span className="meta-value">{setupTime}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">⚙️ {t('results.complexity')}</span>
                      <span className="meta-value">{getComplexityLabel(complexity)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">💰 {t('results.pricing')}</span>
                      <span className="meta-value">{pricing}</span>
                    </div>
                  </div>

                  {/* Learn More Link */}
                  {link && link !== '#' && (
                    <div className="learn-more-section">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="learn-more-button"
                      >
                        {t('results.learn_more')} →
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendationList;
