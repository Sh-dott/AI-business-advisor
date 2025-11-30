// AnalysisHistory Sidebar Component - View past analyses
import React, { useState } from 'react';
import './AnalysisHistory.css';

function AnalysisHistory({ histories = [], onSelect, onClose }) {
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = histories.filter(h =>
    (h.initialDescription && h.initialDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (h._id && h._id.toString().includes(searchTerm))
  );

  const handleSelect = (analysis) => {
    setSelectedId(analysis._id);
    onSelect(analysis._id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="analysis-history-sidebar">
      <div className="sidebar-header">
        <h2>Analysis History</h2>
        <button className="close-btn" onClick={onClose} title="Close sidebar">
          ✕
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search analyses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="history-search"
        />
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="history-list">
        {filtered.length > 0 ? (
          filtered.map((analysis) => (
            <div
              key={analysis._id}
              className={`history-item ${selectedId === analysis._id ? 'selected' : ''}`}
              onClick={() => handleSelect(analysis)}
            >
              <div className="history-item-content">
                <p className="history-description">
                  {analysis.initialDescription?.substring(0, 60)}
                  {analysis.initialDescription?.length > 60 ? '...' : ''}
                </p>
                <span className="history-date">{formatDate(analysis.createdAt)}</span>
              </div>

              {analysis.identifiedProblems && analysis.identifiedProblems.length > 0 && (
                <span className="history-badge" title="Number of identified problems">
                  {analysis.identifiedProblems.length} issues
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="empty-history">
            {histories.length === 0 ? (
              <p>No analyses yet. Start by describing your business.</p>
            ) : (
              <p>No results matching "{searchTerm}"</p>
            )}
          </div>
        )}
      </div>

      <div className="sidebar-footer">
        <p className="footer-info">
          {histories.length > 0
            ? `${histories.length} total analyses`
            : 'Create your first analysis'}
        </p>
      </div>
    </div>
  );
}

export default AnalysisHistory;
