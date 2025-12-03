import React from 'react';

/**
 * TimelineControls
 * Navigation buttons and counter for timeline
 * Shows previous/next buttons and current position
 */
const TimelineControls = ({ currentIndex, totalItems, onPrevious, onNext }) => {
  return (
    <div className="timeline-controls">
      <button
        className="timeline-control-btn"
        onClick={onPrevious}
        disabled={currentIndex === 0}
        aria-label="Previous recommendation"
      >
        ←
      </button>

      <div className="timeline-counter">
        {currentIndex + 1} / {totalItems}
      </div>

      <button
        className="timeline-control-btn"
        onClick={onNext}
        disabled={currentIndex === totalItems - 1}
        aria-label="Next recommendation"
      >
        →
      </button>
    </div>
  );
};

export default TimelineControls;
