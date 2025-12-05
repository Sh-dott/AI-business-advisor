const express = require('express');
const router = express.Router();
const documentGenerator = require('../services/document-generator');

/**
 * Normalize recommendation data from AI API format to document generator format
 * Maps AI response fields to expected document generator fields
 */
function normalizeRecommendation(rec) {
  if (!rec) return null;

  return {
    // Core fields
    name: rec.name || '',
    category: rec.category || '',
    description: rec.description || rec.why || '',
    priority: rec.priority || 'Medium',
    pricing: rec.pricing || '',

    // Map AI 'benefits' to 'factors' for document generator
    factors: Array.isArray(rec.benefits) ? rec.benefits :
             Array.isArray(rec.matchingFactors) ? rec.matchingFactors : [],

    // Map 'setup' to 'setup' (already matches)
    setup: rec.setup || rec.setupTime || 'Quick',

    // Handle complexity
    complexity: rec.complexity || 'Moderate',

    // Link/website mapping
    link: rec.link || rec.website || '',
    website: rec.link || rec.website || '',

    // Keep original fields as fallback
    ...rec
  };
}

/**
 * POST /api/export/program
 * Generates a customized Word document business program
 *
 * Body:
 * {
 *   userAnalysis: {
 *     businessName: string,
 *     businessType: string,
 *     mainChallenge: string,
 *     techLevel: string,
 *     budget: string,
 *     timeline: string,
 *     teamSize: string
 *   },
 *   recommendations: [{
 *     name: string,
 *     priority: string,
 *     description: string,
 *     benefits: string[] (or matchingFactors),
 *     setup: string (or setupTime),
 *     pricing: string,
 *     link: string (or website)
 *   }]
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
      .filter(rec => rec && rec.name); // Filter out invalid entries

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
    const fileName = `Business_Program_${userAnalysis.businessName || 'Program'}_${Date.now()}.docx`;

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
      .slice(0, 4) // Top 4 recommendations only
      .map(normalizeRecommendation)
      .filter(rec => rec && rec.name); // Filter out invalid entries

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
    const fileName = `Business_Summary_${userAnalysis.businessName || 'Summary'}_${Date.now()}.docx`;

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
      businessProgram: 'Full customized business transformation program (Word document)',
      quickSummary: 'Quick summary with top recommendations',
      formats: ['DOCX']
    }
  });
});

module.exports = router;
