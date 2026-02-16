import React, { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { lookupProduct, getFaviconUrl } from '../data/securityProducts';
import '../styles/recommendation-list.css';

/**
 * RecommendationList
 * Displays security recommendations in a vertical list with expand/collapse functionality
 * Shows category, priority, why-this-matters, implementation steps, pitfalls, and tool categories
 */
const CATEGORY_LABELS = {
  email_security: 'category_email_security',
  identity_access: 'category_identity_access',
  awareness_training: 'category_awareness_training',
  process_ir: 'category_process_ir'
};

const RecommendationList = ({ recommendations = [] }) => {
  const [expandedIndices, setExpandedIndices] = useState(new Set([0]));
  const { t, language } = useLanguage();
  const dir = language === 'he' ? 'rtl' : 'ltr';

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

  const getPriorityClass = (priority) => {
    if (!priority) return 'priority-1';
    const p = priority.toLowerCase();
    if (p === 'critical') return 'priority-0';
    if (p === 'high') return 'priority-1';
    return 'priority-2';
  };

  const getCategoryLabel = (category) => {
    const key = CATEGORY_LABELS[category];
    return key ? t(`results.${key}`) : category;
  };

  return (
    <div className="recommendation-list-container">
      <div className="recommendation-list">
        {recommendations.map((rec, index) => {
          const isExpanded = expandedIndices.has(index);
          const name = rec.name || rec.title || 'Recommendation';
          const category = rec.category || '';
          const description = rec.description || '';
          const priority = rec.priority || 'Medium';
          const why = rec.why || '';
          const steps = Array.isArray(rec.steps) ? rec.steps : [];
          const pitfalls = Array.isArray(rec.pitfalls) ? rec.pitfalls : [];
          const toolCategories = Array.isArray(rec.toolCategories) ? rec.toolCategories : [];
          const estimatedEffort = rec.estimatedEffort || '';
          const estimatedCost = rec.estimatedCost || '';

          return (
            <div key={index} className={`list-item ${isExpanded ? 'expanded' : ''}`}>
              {/* Header / Collapsed view */}
              <div className="list-item-header" onClick={() => handleToggle(index)}>
                <div className="item-rank">{index + 1}</div>

                <div className="item-title-section">
                  <h3 className="item-title">{name}</h3>
                  <p className="item-category">{getCategoryLabel(category)}</p>
                </div>

                <div className="item-priority">
                  <span className={`priority-badge ${getPriorityClass(priority)}`}>
                    {priority}
                  </span>
                </div>

                <button
                  className={`expand-button ${isExpanded ? 'expanded' : ''}`}
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  onClick={() => handleToggle(index)}
                >
                  <span className="arrow">&#x25BC;</span>
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

                  {/* Why This Matters */}
                  {why && (
                    <div className="content-section">
                      <h4 className="section-title">{t('results.why_this_matters')}</h4>
                      <p className="section-text" style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>{why}</p>
                    </div>
                  )}

                  {/* Implementation Steps */}
                  {steps.length > 0 && (
                    <div className="content-section">
                      <h4 className="section-title">{t('results.implementation_steps')}</h4>
                      <ol className="steps-list">
                        {steps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Common Pitfalls */}
                  {pitfalls.length > 0 && (
                    <div className="content-section">
                      <h4 className="section-title">{t('results.common_pitfalls')}</h4>
                      <ul className="pitfalls-list">
                        {pitfalls.map((pitfall, idx) => (
                          <li key={idx}>{pitfall}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tool Categories */}
                  {toolCategories.length > 0 && (
                    <div className="content-section">
                      <h4 className="section-title">{t('results.tool_categories')}</h4>
                      <div className="tool-cards-grid">
                        {toolCategories.map((tool, idx) => {
                          const product = lookupProduct(tool);
                          if (product) {
                            return (
                              <a
                                key={idx}
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="tool-card"
                              >
                                <img
                                  src={getFaviconUrl(product.domain)}
                                  alt=""
                                  className="tool-card-icon"
                                  loading="lazy"
                                />
                                <span className="tool-card-name">{product.name}</span>
                                <span className="tool-card-arrow">&#x2197;</span>
                              </a>
                            );
                          }
                          return (
                            <span key={idx} className="tool-chip">{tool}</span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Meta Information - Effort, Cost */}
                  <div className="meta-grid">
                    {estimatedEffort && (
                      <div className="meta-item">
                        <span className="meta-label">{t('results.setup_time')}</span>
                        <span className="meta-value">{estimatedEffort}</span>
                      </div>
                    )}
                    {estimatedCost && (
                      <div className="meta-item">
                        <span className="meta-label">{t('results.pricing')}</span>
                        <span className="meta-value">{estimatedCost}</span>
                      </div>
                    )}
                  </div>
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
