// AI Service for Claude and OpenAI Integration
const { getAIClient } = require('../config/ai-providers');

const DIAGNOSIS_SYSTEM_PROMPT = `You are an expert business technology advisor with deep knowledge of SaaS tools, platforms, and solutions.

When analyzing a business description, you MUST:
1. Identify 3-5 specific, real business problems/pain points (not generic ones)
2. Understand the business model, size, and industry
3. Assess the current technology maturity level
4. Recommend 2-3 solution categories that directly address identified problems
5. Suggest implementation priority and quick wins

IMPORTANT: Be specific and actionable. Reference actual pain points mentioned by the user.`;

const REFINEMENT_SYSTEM_PROMPT = `You are continuing an analysis with a business user. Keep the conversation focused and helpful.

Guidelines:
1. Reference their specific business situation
2. Ask clarifying questions when needed
3. Build on previous analysis - don't repeat it
4. Provide specific, actionable recommendations
5. Be concise and conversational`;

class AIService {
  constructor() {
    this.diagnosisPrompt = DIAGNOSIS_SYSTEM_PROMPT;
    this.refinementPrompt = REFINEMENT_SYSTEM_PROMPT;
  }

  /**
   * Perform initial AI diagnosis of business
   * Automatically handles provider fallback
   */
  async performDiagnosis(businessDescription, apiProvider = 'claude') {
    try {
      const client = getAIClient(apiProvider);

      const userMessage = `Please analyze this business and identify key challenges and technology solutions:\n\n${businessDescription}`;

      const response = await client.analyzeWithStreaming(
        this.diagnosisPrompt,
        userMessage
      );

      // Parse the response to extract structured data
      const parsedData = this.parseDisgnosis(response.content);

      return {
        success: true,
        rawDiagnosis: response.content,
        diagnosis: parsedData,
        provider: response.provider,
        model: response.model,
        usage: response.usage
      };
    } catch (error) {
      console.error(`❌ ${apiProvider} provider failed:`, error.message);

      // If OpenAI failed and it was primary provider, try Claude fallback
      if (apiProvider === 'openai' && !error.message.includes('quota')) {
        console.log('⚠️  Attempting fallback to Claude...');
        try {
          return await this.performDiagnosis(businessDescription, 'claude');
        } catch (fallbackError) {
          console.error('Claude fallback also failed:', fallbackError.message);
          throw new Error(`AI Service Error: Both providers failed. ${error.message}`);
        }
      }

      throw new Error(`AI Service Error: ${error.message}`);
    }
  }

  /**
   * Continue multi-turn conversation for refinement
   */
  async refineAnalysis(chatHistory, apiProvider = 'claude') {
    try {
      const client = getAIClient(apiProvider);

      const response = await client.analyzeWithStreamingIterative(
        chatHistory,
        this.refinementPrompt
      );

      return {
        success: true,
        content: response.content,
        provider: response.provider,
        model: response.model,
        usage: response.usage
      };
    } catch (error) {
      console.error('AI Refinement Error:', error);
      throw new Error(`AI Service Error: ${error.message}`);
    }
  }

  /**
   * Parse AI diagnosis response into structured format
   */
  parseDisgnosis(content) {
    try {
      // Extract identified problems
      const problemsMatch = content.match(/problems?:(.+?)(?=categories?:|$)/is);
      const problems = problemsMatch
        ? problemsMatch[1]
          .split('\n')
          .filter(line => line.trim())
          .map(line => line.replace(/^[-*]\s*/, '').trim())
          .filter(line => line.length > 0)
        : [];

      // Extract solution categories
      const categoriesMatch = content.match(/categor(?:ies?|y):(.+?)(?=implementation?:|priority?:|$)/is);
      const categories = categoriesMatch
        ? categoriesMatch[1]
          .split('\n')
          .filter(line => line.trim())
          .map(line => line.replace(/^[-*]\s*/, '').trim())
          .filter(line => line.length > 0)
        : [];

      return {
        identifiedProblems: problems,
        solutionCategories: categories,
        rawAnalysis: content
      };
    } catch (error) {
      console.error('Parse Error:', error);
      return {
        identifiedProblems: [],
        solutionCategories: [],
        rawAnalysis: content
      };
    }
  }

  /**
   * Generate implementation guide for a technology
   */
  async generateImplementationGuide(
    technology,
    businessDescription,
    identifiedProblems,
    apiProvider = 'claude'
  ) {
    try {
      const client = getAIClient(apiProvider);

      const prompt = `Based on this business context:
Business: ${businessDescription}
Challenges: ${identifiedProblems.join(', ')}

Generate a concise implementation guide for ${technology} that:
1. Explains why this tool solves their specific problems
2. Lists 4-5 actionable implementation steps
3. Identifies quick wins (first 30 days)
4. Mentions potential integrations with other tools
Keep it practical and specific to their situation.`;

      const response = await client.analyzeWithStreaming(
        'You are a technology implementation specialist.',
        prompt
      );

      return {
        success: true,
        guide: response.content,
        provider: response.provider
      };
    } catch (error) {
      console.error('Guide Generation Error:', error);
      throw new Error(`Guide Generation Error: ${error.message}`);
    }
  }
}

module.exports = new AIService();
