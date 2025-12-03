import React, { useState, useEffect } from 'react';
import '../styles/analyzing-cycle.css';

/**
 * AnalyzingCycle
 * Dynamic interactive analyzing cycle with multiple stages
 * Shows progress through AI analysis with animated stages
 */
const AnalyzingCycle = () => {
  const [stage, setStage] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  // Analyzing stages with descriptions
  const stages = [
    {
      icon: '🔍',
      title: 'סורק תשובות',
      description: 'ניתוח התשובות שלך...',
      color: '#d97706'
    },
    {
      icon: '🧠',
      title: 'עיבוד נתונים',
      description: 'מעבדים את המידע...',
      color: '#d97706'
    },
    {
      icon: '🤖',
      title: 'בדיקת AI',
      description: 'בדיקת בינה מלאכותית...',
      color: '#d97706'
    },
    {
      icon: '⚡',
      title: 'יצירת המלצות',
      description: 'יוצרים המלצות מותאמות...',
      color: '#d97706'
    },
    {
      icon: '✨',
      title: 'ביצוע אופטימיזציה',
      description: 'מייטבים את התוצאות...',
      color: '#d97706'
    }
  ];

  // Cycle through stages continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prevStage) => {
        const nextStage = (prevStage + 1) % stages.length;
        if (nextStage === 0) {
          setCycleCount((prev) => prev + 1);
        }
        return nextStage;
      });
    }, 1200); // Each stage lasts 1.2 seconds

    return () => clearInterval(interval);
  }, [stages.length]);

  const currentStage = stages[stage];

  return (
    <div className="analyzing-container">
      <div className="analyzing-cycle-wrapper">
        {/* Main cycle visualization */}
        <div className="cycle-circle">
          {/* Rotating background rings */}
          <div className="rotating-ring ring-1"></div>
          <div className="rotating-ring ring-2"></div>
          <div className="rotating-ring ring-3"></div>

          {/* Center content */}
          <div className="cycle-content">
            <div className="stage-icon" style={{ color: currentStage.color }}>
              {currentStage.icon}
            </div>
            <div className="stage-info">
              <h3 className="stage-title">{currentStage.title}</h3>
              <p className="stage-description">{currentStage.description}</p>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="stage-indicators">
          {stages.map((_, idx) => (
            <div
              key={idx}
              className={`indicator-dot ${idx === stage ? 'active' : ''} ${
                idx < stage ? 'completed' : ''
              }`}
              style={{
                animation:
                  idx === stage ? `pulse 1s ease-in-out infinite` : 'none'
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((stage + 1) / stages.length) * 100}%`
              }}
            ></div>
          </div>
          <p className="progress-text">
            {stage + 1} מתוך {stages.length} שלבים
          </p>
        </div>

        {/* Status messages */}
        <div className="status-messages">
          <p className="analyzing-status">
            <span className="typing-animation">עם אנא, המתן בזמן שאנחנו מנתחים את נתוניך</span>
          </p>
          <p className="cycle-counter">
            ביצוע ניתוח... {cycleCount + 1}
          </p>
        </div>
      </div>

      {/* Floating particles */}
      <div className="particles-container">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              '--delay': `${i * 0.2}s`,
              '--duration': `${3 + i * 0.5}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AnalyzingCycle;
