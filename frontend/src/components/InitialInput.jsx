// InitialInput Component - User's business description entry
import React, { useState } from 'react';
import './InitialInput.css';

function InitialInput({ onSubmit }) {
  const [description, setDescription] = useState('');
  const [businessType, setBusinessType] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const businessTypes = [
    { value: 'general', label: 'General Business' },
    { value: 'saas', label: 'SaaS / Software' },
    { value: 'ecommerce', label: 'E-Commerce' },
    { value: 'retail', label: 'Retail / Brick & Mortar' },
    { value: 'agency', label: 'Agency / Services' },
    { value: 'nonprofit', label: 'Nonprofit' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (description.trim().length < 10) {
      alert('Please provide at least 10 characters describing your business');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(description, businessType);
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to analyze. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="initial-input-container">
      <div className="input-card">
        <div className="input-header">
          <h2>Tell Us About Your Business</h2>
          <p>Describe your business challenges, goals, or technology needs</p>
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <div className="form-group">
            <label htmlFor="businessType">Business Type</label>
            <select
              id="businessType"
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              disabled={isSubmitting}
            >
              {businessTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Business Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`For example: I manage a retail clothing store with 3 locations. We struggle with inventory management across stores and want to improve our online presence. We're losing customers to larger competitors who have better websites.`}
              rows={8}
              disabled={isSubmitting}
              maxLength={2000}
            />
            <div className="char-count">
              {description.length}/2000 characters
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || description.trim().length < 10}
            className="submit-btn"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-small"></span>
                Analyzing...
              </>
            ) : (
              <>🔍 Analyze My Business</>
            )}
          </button>
        </form>

        <div className="example-section">
          <h3>What We Analyze</h3>
          <ul>
            <li>🎯 Core business challenges and pain points</li>
            <li>📊 Technology gaps and inefficiencies</li>
            <li>🚀 Growth opportunities and bottlenecks</li>
            <li>💡 Tailored technology recommendations</li>
            <li>📋 Implementation guidance for each solution</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default InitialInput;
