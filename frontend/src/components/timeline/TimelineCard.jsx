import React from 'react';

/**
 * TimelineCard
 * Expandable card displaying full recommendation details
 * Shows/hides detailed information on toggle
 */
const TimelineCard = ({ index, recommendation, isActive, isExpanded, onToggle }) => {
  const {
    name = '',
    category = '',
    description = '',
    why = '',
    priority = 'Medium',
    benefits = [],
    matchingFactors = [],
    setup = '',
    setupTime = '',
    complexity = '',
    pricing = '',
    link = '',
    website = ''
  } = recommendation || {};

  // Use fallback values for various field names
  const displayDescription = description || why || '';
  const factors = Array.isArray(benefits) ? benefits : Array.isArray(matchingFactors) ? matchingFactors : [];
  const setupValue = setup || setupTime || '';
  const linkUrl = link || website || '';

  return (
    <div
      className={`timeline-card ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}
      role="region"
      aria-label={`${name} details`}
    >
      {/* Card Header */}
      <div className="timeline-card-header">
        <div className="timeline-card-title">
          <div>
            <div>{name}</div>
            <div className="timeline-card-category">{category}</div>
          </div>
          <div className="priority-badge" style={{
            backgroundColor: priority.toLowerCase() === 'high' ? '#ef4444' :
                           priority.toLowerCase() === 'medium' ? '#d97706' :
                           '#10b981'
          }}>
            {priority}
          </div>
        </div>
      </div>

      {/* Card Content (Collapsible) */}
      <div className="timeline-card-content">
        {displayDescription && (
          <div className="timeline-card-description">
            {displayDescription}
          </div>
        )}

        {factors && factors.length > 0 && (
          <div>
            <h4 style={{
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--color-text-primary)',
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.3px'
            }}>
              Key Benefits
            </h4>
            <ul className="timeline-card-factors">
              {factors.map((factor, idx) => (
                <li key={idx}>{factor}</li>
              ))}
            </ul>
          </div>
        )}

        {(setupValue || complexity) && (
          <div className="timeline-card-meta">
            {setupValue && (
              <div className="timeline-card-meta-item">
                <span className="timeline-card-meta-label">Setup Time</span>
                <span className="timeline-card-meta-value">{setupValue}</span>
              </div>
            )}
            {complexity && (
              <div className="timeline-card-meta-item">
                <span className="timeline-card-meta-label">Complexity</span>
                <span className="timeline-card-meta-value">{complexity}</span>
              </div>
            )}
          </div>
        )}

        {pricing && (
          <div style={{
            padding: '12px',
            backgroundColor: 'var(--color-background-secondary)',
            borderRadius: '10px',
            marginBottom: '16px'
          }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--color-text-light)',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              marginBottom: '4px'
            }}>
              Pricing
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--color-text-primary)'
            }}>
              {pricing}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="timeline-card-footer">
        <button
          className="timeline-card-toggle"
          onClick={onToggle}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
        {linkUrl && (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="timeline-card-link"
          >
            Learn More →
          </a>
        )}
      </div>
    </div>
  );
};

export default TimelineCard;
