// Analysis Routes - AI Diagnosis and Chat
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const aiService = require('../services/ai-service');
const Analysis = require('../models/Analysis');
const ChatMessage = require('../models/ChatMessage');

// @route   POST /api/analyze/initial
// @desc    Get initial AI diagnosis for business description
// @access  Private
router.post('/initial', protect, async (req, res, next) => {
  try {
    const { description, businessType, apiProvider = 'claude' } = req.body;

    // Validate input
    if (!description || description.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a detailed business description (at least 10 characters)'
      });
    }

    // Create analysis record
    let analysis = await Analysis.create({
      userId: req.user._id,
      initialDescription: description,
      apiProvider,
      status: 'in_progress',
      metadata: {
        businessType
      }
    });

    // Get AI diagnosis
    const diagnosisResult = await aiService.performDiagnosis(
      description,
      apiProvider
    );

    // Update analysis with diagnosis
    analysis.aiDiagnosis = diagnosisResult.rawDiagnosis;
    analysis.identifiedProblems = diagnosisResult.diagnosis.identifiedProblems;
    analysis.solutionCategories = diagnosisResult.diagnosis.solutionCategories;
    analysis.status = 'completed';

    await analysis.save();

    // Return result with streaming effect
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      analysisId: analysis._id,
      diagnosis: diagnosisResult.diagnosis,
      rawDiagnosis: diagnosisResult.rawDiagnosis,
      provider: diagnosisResult.provider,
      message: 'Initial diagnosis complete. Ready for follow-up questions.'
    });
  } catch (error) {
    console.error('Initial Analysis Error:', error);
    next(error);
  }
});

// @route   POST /api/analyze/refine
// @desc    Add follow-up question and get refined analysis
// @access  Private
router.post('/refine', protect, async (req, res, next) => {
  try {
    const { analysisId, message, apiProvider } = req.body;

    // Validate input
    if (!analysisId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide analysisId and message'
      });
    }

    // Get existing analysis
    const analysis = await Analysis.findById(analysisId);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    // Verify ownership
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this analysis'
      });
    }

    // Build chat history for context
    const chatHistory = analysis.chatHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add user message
    chatHistory.push({
      role: 'user',
      content: message
    });

    // Get refined analysis
    const refinementResult = await aiService.refineAnalysis(
      chatHistory,
      apiProvider || analysis.apiProvider
    );

    // Save user message
    await ChatMessage.create({
      analysisId: analysis._id,
      userId: req.user._id,
      role: 'user',
      content: message,
      metadata: {
        model: 'user-input',
        provider: 'client'
      }
    });

    // Save assistant response
    await ChatMessage.create({
      analysisId: analysis._id,
      userId: req.user._id,
      role: 'assistant',
      content: refinementResult.content,
      metadata: {
        model: refinementResult.model,
        provider: refinementResult.provider,
        tokensUsed: refinementResult.usage?.output_tokens || 0
      }
    });

    // Update analysis chat history
    analysis.chatHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    analysis.chatHistory.push({
      role: 'assistant',
      content: refinementResult.content,
      timestamp: new Date()
    });

    await analysis.save();

    res.json({
      success: true,
      analysisId: analysis._id,
      response: refinementResult.content,
      provider: refinementResult.provider,
      chatHistory: analysis.chatHistory
    });
  } catch (error) {
    console.error('Refine Analysis Error:', error);
    next(error);
  }
});

// @route   GET /api/analyze/:id
// @desc    Get specific analysis
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id)
      .populate('userId', 'name email');

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    // Verify ownership
    if (analysis.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this analysis'
      });
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/analyze
// @desc    Get all user analyses
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    const { limit = 10, skip = 0 } = req.query;

    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('_id initialDescription identifiedProblems createdAt');

    const total = await Analysis.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
      analyses
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/analyze/:id
// @desc    Delete an analysis
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      });
    }

    // Verify ownership
    if (analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this analysis'
      });
    }

    // Delete associated messages
    await ChatMessage.deleteMany({ analysisId: analysis._id });

    // Delete analysis
    await Analysis.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
