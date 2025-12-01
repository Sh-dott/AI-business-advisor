const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * POST /api/ai-analysis/recommend
 * Analyzes user business needs and generates AI-powered technology recommendations
 *
 * Body:
 * {
 *   businessName: string,
 *   businessType: string (e.g., 'retail', 'services', 'restaurant'),
 *   challenges: string[] (user's main challenges),
 *   budget: string (e.g., 'free', 'low', 'medium', 'high'),
 *   teamSize: string (e.g., 'solo', 'small', 'medium', 'large'),
 *   techLevel: string (e.g., 'no_tech', 'basic', 'intermediate', 'advanced'),
 *   description: string (user's detailed business description)
 * }
 *
 * Returns: {
 *   recommendations: [
 *     {
 *       name: string,
 *       category: string,
 *       description: string (why it's recommended),
 *       why: string (detailed explanation),
 *       pricing: string,
 *       setup: string,
 *       link: string,
 *       benefits: string[],
 *       steps: string[],
 *       priority: string
 *     }
 *   ],
 *   analysis: string (overall business analysis)
 * }
 */
router.post('/recommend', async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      challenges,
      budget,
      teamSize,
      techLevel,
      description
    } = req.body;

    // Validate required fields
    if (!businessType || !description) {
      return res.status(400).json({
        error: 'Missing required fields: businessType and description'
      });
    }

    // Build the prompt for OpenAI
    const challengesList = Array.isArray(challenges)
      ? challenges.join(', ')
      : String(challenges || 'general growth');

    const prompt = `You are an expert business technology consultant. Analyze this business and recommend 4 specific technologies they should implement.

BUSINESS PROFILE:
- Business Name: ${businessName || 'Not specified'}
- Type: ${businessType}
- Main Challenges: ${challengesList}
- Team Size: ${teamSize}
- Tech Comfort Level: ${techLevel}
- Monthly Budget: ${budget}
- Detailed Description: ${description}

TASK: Provide 4 technology recommendations that directly address their challenges and fit their budget/team size.

For each recommendation, respond EXACTLY in this JSON format (return only valid JSON):
{
  "recommendations": [
    {
      "name": "Technology Name",
      "category": "Category (e.g., CRM, Marketing, Payments)",
      "description": "One-line summary of what it does",
      "why": "2-3 sentences explaining why this specific tool solves their problem",
      "pricing": "Estimated monthly cost or model",
      "setup": "Time to set up (e.g., '1-2 hours')",
      "link": "https://www.technology-website.com",
      "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
      "steps": ["Step 1 to implement", "Step 2 to implement", "Step 3 to implement"],
      "priority": "High/Medium/Low"
    }
  ],
  "analysis": "2-3 sentence overall analysis of their business needs and technology strategy"
}

Make recommendations that are:
1. Realistic and proven solutions
2. Suitable for their budget and team size
3. Directly addressing their stated challenges
4. Popular and well-supported tools
5. Complementary (not redundant)`;

    // Call OpenAI API
    const message = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract the response text from OpenAI format
    const responseText = message.choices[0].message.content;

    // Try to parse as JSON
    let analysisResult;
    try {
      // Find JSON in the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      analysisResult = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error('Failed to parse OpenAI response:', responseText);
      return res.status(500).json({
        error: 'Failed to parse AI recommendations',
        details: parseErr.message
      });
    }

    // Validate the response structure
    if (!analysisResult.recommendations || !Array.isArray(analysisResult.recommendations)) {
      return res.status(500).json({
        error: 'Invalid AI response structure',
        details: 'Missing recommendations array'
      });
    }

    // Return the AI-generated recommendations
    res.json({
      success: true,
      recommendations: analysisResult.recommendations,
      analysis: analysisResult.analysis || 'Analysis completed',
      source: 'ai'
    });

  } catch (error) {
    console.error('AI Analysis error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      type: error.type,
      status: error.status
    });
    res.status(500).json({
      error: 'Failed to generate recommendations',
      message: error.message,
      details: error.code || error.type
    });
  }
});

module.exports = router;
