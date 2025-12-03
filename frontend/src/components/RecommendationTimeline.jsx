import React, { useState, useRef, useEffect } from 'react';
import TimelinePoint from './timeline/TimelinePoint';
import TimelineCard from './timeline/TimelineCard';
import TimelineControls from './timeline/TimelineControls';
import '../styles/timeline.css';

/**
 * RecommendationTimeline
 * Displays recommendations in an interactive horizontal timeline
 * with expandable cards and intelligent scrolling
 */
const RecommendationTimeline = ({ recommendations = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndices, setExpandedIndices] = useState(new Set([0]));
  const timelineWrapperRef = useRef(null);
  const timelineTrackRef = useRef(null);

  // Scroll to active card on index change
  useEffect(() => {
    if (timelineWrapperRef.current && timelineTrackRef.current) {
      const activeCard = timelineTrackRef.current.children[activeIndex];
      if (activeCard) {
        // Scroll to center the active card
        const scrollLeft =
          activeCard.offsetLeft -
          timelineWrapperRef.current.clientWidth / 2 +
          activeCard.clientWidth / 2;

        timelineWrapperRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeIndex]);

  const handlePointClick = (index) => {
    setActiveIndex(index);
  };

  const handleCardToggle = (index) => {
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

  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < recommendations.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="timeline-container">
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            No recommendations available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <div className="timeline-wrapper" ref={timelineWrapperRef}>
        <div className="timeline-track" ref={timelineTrackRef}>
          {recommendations.map((rec, index) => (
            <React.Fragment key={index}>
              <TimelinePoint
                index={index}
                recommendation={rec}
                isActive={activeIndex === index}
                onClick={() => handlePointClick(index)}
              />
              <TimelineCard
                index={index}
                recommendation={rec}
                isActive={activeIndex === index}
                isExpanded={expandedIndices.has(index)}
                onToggle={() => handleCardToggle(index)}
              />
            </React.Fragment>
          ))}
        </div>
      </div>

      <TimelineControls
        currentIndex={activeIndex}
        totalItems={recommendations.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
};

export default RecommendationTimeline;
