const express = require('express');
const router = express.Router();
const documentGenerator = require('../services/document-generator');

/**
 * Sanitize filename - strip non-ASCII characters for HTTP headers
 */
function safeFileName(name) {
  return (name || '').replace(/[^\x20-\x7E]/g, '').replace(/[/\\?%*:|"<>]/g, '').trim() || 'Report';
}

/**
 * Normalize recommendation data from AI API format to document generator format
 * Maps security recommendation fields to expected document generator fields
 */
function normalizeRecommendation(rec) {
  if (!rec) return null;

  return {
    name: rec.name || '',
    category: rec.category || '',
    description: rec.description || '',
    priority: rec.priority || 'Medium',
    why: rec.why || '',
    steps: Array.isArray(rec.steps) ? rec.steps : [],
    pitfalls: Array.isArray(rec.pitfalls) ? rec.pitfalls : [],
    toolCategories: Array.isArray(rec.toolCategories) ? rec.toolCategories : [],
    estimatedEffort: rec.estimatedEffort || '',
    estimatedCost: rec.estimatedCost || '',
    totalScore: rec.totalScore || 0,
    scores: rec.scores || {}
  };
}

/**
 * POST /api/export/program
 * Generates a customized Word document security protection program
 *
 * Body:
 * {
 *   userAnalysis: {
 *     businessName: string,
 *     industry: string,
 *     threatExposure: string,
 *     currentControls: string,
 *     securityBudget: string,
 *     teamSize: string,
 *     techMaturity: string,
 *     diagnosis: { riskLevel, summary, keyFindings, industryContext },
 *     threatModel: { topThreats, attackSurface },
 *     roadmap: { days30, days60, days90 },
 *     kpis: [{ metric, baseline, target30, target90 }],
 *     incidentResponse: { title, steps, contacts }
 *   },
 *   recommendations: [{ name, category, priority, description, why, steps, pitfalls, ... }]
 * }
 *
 * Returns: Word document download
 */
router.post('/program', async (req, res) => {
  try {
    const { userAnalysis, recommendations, documentType = 'standard', language = 'en' } = req.body;

    // Validate required fields
    if (!userAnalysis || !recommendations || recommendations.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields: userAnalysis and recommendations array'
      });
    }

    // Normalize recommendations to expected format
    const normalizedRecommendations = recommendations
      .map(normalizeRecommendation)
      .filter(rec => rec && rec.name);

    if (normalizedRecommendations.length === 0) {
      return res.status(400).json({
        error: 'No valid recommendations provided'
      });
    }

    // Generate the document with specified document type and language
    const doc = await documentGenerator.generateBusinessProgram(
      userAnalysis,
      normalizedRecommendations,
      documentType,
      language
    );

    // Convert to buffer
    const buffer = await documentGenerator.getDocumentBuffer(doc);

    // Send as downloadable file
    const safeName = safeFileName(userAnalysis.businessName);
    const fileName = `Security_Protection_Program_${safeName}_${Date.now()}.docx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);
  } catch (error) {
    console.error('Document generation error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Failed to generate document',
      message: error.message
    });
  }
});

/**
 * POST /api/export/summary
 * Generates a quick summary document (shorter version)
 */
router.post('/summary', async (req, res) => {
  try {
    const { userAnalysis, recommendations, language = 'en' } = req.body;

    if (!userAnalysis || !recommendations) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    // Normalize recommendations to expected format
    const normalizedRecommendations = recommendations
      .slice(0, 4)
      .map(normalizeRecommendation)
      .filter(rec => rec && rec.name);

    if (normalizedRecommendations.length === 0) {
      return res.status(400).json({
        error: 'No valid recommendations provided'
      });
    }

    // Generate shorter version with language support
    const doc = await documentGenerator.generateBusinessProgram(
      userAnalysis,
      normalizedRecommendations,
      'summary',
      language
    );

    const buffer = await documentGenerator.getDocumentBuffer(doc);
    const safeName = safeFileName(userAnalysis.businessName);
    const fileName = `Security_Summary_${safeName}_${Date.now()}.docx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);
  } catch (error) {
    console.error('Summary generation error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Failed to generate summary',
      message: error.message
    });
  }
});

/**
 * GET /api/export/status
 * Check if export service is available
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Export service is operational',
    features: {
      securityProgram: 'Full customized anti-phishing protection program (Word document)',
      quickSummary: 'Quick summary with top security controls',
      formats: ['DOCX']
    }
  });
});

module.exports = router;
