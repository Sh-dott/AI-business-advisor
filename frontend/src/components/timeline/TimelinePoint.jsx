import React from 'react';

/**
 * TimelinePoint
 * Individual anchor point in the timeline
 * Size and styling based on recommendation priority
 */
const TimelinePoint = ({ index, recommendation, isActive, onClick }) => {
  // Determine priority level for styling
  const priority = (recommendation?.priority || 'Medium').toLowerCase();
  const priorityClass = `priority-${priority}`;

  // Extract short title for display
  const shortTitle = recommendation?.name || recommendation?.title || `Item ${index + 1}`;
  const displayTitle = shortTitle.substring(0, 12) + (shortTitle.length > 12 ? '...' : '');

  return (
    <div
      className={`timeline-point ${priorityClass} ${isActive ? 'active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Timeline item: ${shortTitle}`}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="timeline-point-dot" />
      <div className="timeline-point-label">{displayTitle}</div>
    </div>
  );
};

export default TimelinePoint;
