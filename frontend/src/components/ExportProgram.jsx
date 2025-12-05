import React, { useState } from 'react';
import { Download, FileText, Loader } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import '../styles/ExportProgram.css';

/**
 * ExportProgram Component
 * Allows users to download their personalized business transformation program
 * as a formatted Word document
 */
const ExportProgram = ({ userAnalysis, recommendations }) => {
  const { t, language } = useLanguage();
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
            recommendations,
            language
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
            recommendations: recommendations.slice(0, 4),
            language
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
        <h2>{t('export.title')}</h2>
        <p>{t('export.subtitle')}</p>
      </div>

      <div className="export-options">
        <div className="export-option full-program">
          <div className="option-content">
            <h3>{t('export.full_program')}</h3>
            <p>{t('export.full_program_desc')}</p>
            <ul>
              <li>{t('export.full_program_feature_1')}</li>
              <li>{t('export.full_program_feature_2')}</li>
              <li>{t('export.full_program_feature_3')}</li>
              <li>{t('export.full_program_feature_4')}</li>
              <li>{t('export.full_program_feature_5')}</li>
              <li>{t('export.full_program_feature_6')}</li>
              <li>{t('export.full_program_feature_7')}</li>
            </ul>
            <p className="program-info">{t('export.full_program_info')}</p>
          </div>
          <button
            onClick={handleDownloadProgram}
            disabled={isLoading}
            className="btn-download full"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="spinner" />
                {t('export.generating')}
              </>
            ) : (
              <>
                <Download size={18} />
                {t('export.full_program_button')}
              </>
            )}
          </button>
        </div>

        <div className="export-option quick-summary">
          <div className="option-content">
            <h3>{t('export.quick_summary')}</h3>
            <p>{t('export.quick_summary_desc')}</p>
            <ul>
              <li>{t('export.quick_summary_feature_1')}</li>
              <li>{t('export.quick_summary_feature_2')}</li>
              <li>{t('export.quick_summary_feature_3')}</li>
              <li>{t('export.quick_summary_feature_4')}</li>
              <li>{t('export.quick_summary_feature_5')}</li>
            </ul>
            <p className="program-info">{t('export.quick_summary_info')}</p>
          </div>
          <button
            onClick={handleDownloadSummary}
            disabled={isLoading}
            className="btn-download summary"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="spinner" />
                {t('export.generating')}
              </>
            ) : (
              <>
                <Download size={18} />
                {t('export.quick_summary_button')}
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
          <p>✓ {t('export.success')}</p>
        </div>
      )}

      <div className="export-tips">
        <h4>💡 {t('export.tips_title')}</h4>
        <ul>
          <li>{t('export.tips_1')}</li>
          <li>{t('export.tips_2')}</li>
          <li>{t('export.tips_3')}</li>
          <li>{t('export.tips_4')}</li>
          <li>{t('export.tips_5')}</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportProgram;
