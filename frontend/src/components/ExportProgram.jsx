import React, { useState } from 'react';
import { Download, FileText, Loader } from 'lucide-react';
import '../styles/ExportProgram.css';

/**
 * ExportProgram Component
 * Allows users to download their personalized business transformation program
 * as a formatted Word document
 */
const ExportProgram = ({ userAnalysis, recommendations }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDownloadProgram = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/export/program`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userAnalysis,
            recommendations
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate document');
      }

      // Create blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Business_Transformation_Program_${userAnalysis.businessName || 'Program'}_${new Date().getTime()}.docx`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message || 'Failed to download document');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/export/summary`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userAnalysis,
            recommendations: recommendations.slice(0, 4)
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Business_Summary_${userAnalysis.businessName || 'Summary'}_${new Date().getTime()}.docx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message || 'Failed to download summary');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="export-program-container">
      <div className="export-header">
        <FileText className="export-icon" size={32} />
        <h2>Download Your Business Program</h2>
        <p>Get a complete, customized business transformation guide as a Word document</p>
      </div>

      <div className="export-options">
        <div className="export-option full-program">
          <div className="option-content">
            <h3>📚 Full Business Program</h3>
            <p>Complete transformation roadmap including:</p>
            <ul>
              <li>Executive summary of your business situation</li>
              <li>Detailed diagnosis and findings</li>
              <li>All 4 recommended technologies</li>
              <li>Implementation phases and timeline</li>
              <li>Success metrics and KPIs</li>
              <li>Actionable 90-day plan</li>
              <li>Resources and change management strategies</li>
            </ul>
            <p className="program-info">Perfect for sharing with your team and leadership</p>
          </div>
          <button
            onClick={handleDownloadProgram}
            disabled={isLoading}
            className="btn-download full"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="spinner" />
                Generating...
              </>
            ) : (
              <>
                <Download size={18} />
                Download Full Program
              </>
            )}
          </button>
        </div>

        <div className="export-option quick-summary">
          <div className="option-content">
            <h3>⚡ Quick Summary</h3>
            <p>Executive summary including:</p>
            <ul>
              <li>Your business profile and challenges</li>
              <li>Top 4 technology recommendations</li>
              <li>Why each tool was selected</li>
              <li>Quick implementation steps</li>
              <li>Resource links</li>
            </ul>
            <p className="program-info">Perfect for a quick overview and decision making</p>
          </div>
          <button
            onClick={handleDownloadSummary}
            disabled={isLoading}
            className="btn-download summary"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="spinner" />
                Generating...
              </>
            ) : (
              <>
                <Download size={18} />
                Download Summary
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="export-error">
          <p>❌ {error}</p>
        </div>
      )}

      {success && (
        <div className="export-success">
          <p>✓ Document downloaded successfully!</p>
        </div>
      )}

      <div className="export-tips">
        <h4>💡 Tips for Using Your Document:</h4>
        <ul>
          <li>Share with your team to align on technology strategy</li>
          <li>Use the implementation roadmap for project planning</li>
          <li>Track success metrics to measure impact</li>
          <li>Review and adjust plan as you learn more</li>
          <li>Keep the document as reference throughout implementation</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportProgram;
