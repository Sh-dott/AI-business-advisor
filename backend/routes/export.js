const express = require('express');
const router = express.Router();
const documentGenerator = require('../services/document-generator');

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
 *     matchingFactors: string[],
 *     implementationDetails: { complexity, setupTime },
 *     pricing: string,
 *     website: string
 *   }]
 * }
 *
 * Returns: Word document download
 */
router.post('/program', async (req, res) => {
  try {
    const { userAnalysis, recommendations } = req.body;

    // Validate required fields
    if (!userAnalysis || !recommendations || recommendations.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields: userAnalysis and recommendations array'
      });
    }

    // Generate the document
    const doc = await documentGenerator.generateBusinessProgram(
      userAnalysis,
      recommendations
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
    const { userAnalysis, recommendations } = req.body;

    if (!userAnalysis || !recommendations) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    // Generate shorter version (just recommendations and quick action plan)
    const doc = await documentGenerator.generateBusinessProgram(
      userAnalysis,
      recommendations.slice(0, 4) // Top 4 recommendations only
    );

    const buffer = await documentGenerator.getDocumentBuffer(doc);
    const fileName = `Business_Summary_${userAnalysis.businessName || 'Summary'}_${Date.now()}.docx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', buffer.length);

    res.send(buffer);
  } catch (error) {
    console.error('Summary generation error:', error);
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
