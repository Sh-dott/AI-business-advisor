import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import '../styles/analyzing-cycle.css';

/**
 * AnalyzingCycle
 * Dynamic interactive analyzing cycle with multiple stages
 * Shows progress through AI analysis with animated stages
 */
const AnalyzingCycle = () => {
  const { t } = useLanguage();
  const [stage, setStage] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

  // Analyzing stages with descriptions
  const stages = [
    {
      icon: '🔍',
      title: t('analyzing.stage1_title'),
      description: t('analyzing.stage1_desc'),
      color: '#00d4ff'
    },
    {
      icon: '🧠',
      title: t('analyzing.stage2_title'),
      description: t('analyzing.stage2_desc'),
      color: '#00d4ff'
    },
    {
      icon: '🤖',
      title: t('analyzing.stage3_title'),
      description: t('analyzing.stage3_desc'),
      color: '#00d4ff'
    },
    {
      icon: '⚡',
      title: t('analyzing.stage4_title'),
      description: t('analyzing.stage4_desc'),
      color: '#00d4ff'
    },
    {
      icon: '✨',
      title: t('analyzing.stage5_title'),
      description: t('analyzing.stage5_desc'),
      color: '#00d4ff'
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

        {/* Smooth progress animation */}
        <div className="smooth-progress-container">
          <div className="smooth-progress-bar">
            <div className="smooth-progress-fill"></div>
          </div>
        </div>

        {/* Status messages */}
        <div className="status-messages">
          <p className="analyzing-status">
            <span className="typing-animation">{t('analyzing.please_wait')}</span>
          </p>
          <p className="cycle-counter">
            {t('analyzing.performing_analysis')} {cycleCount + 1}
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
