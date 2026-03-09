// AI Service for Claude and OpenAI Integration - Security Advisory
const { getAIClient } = require('../config/ai-providers');

const DIAGNOSIS_SYSTEM_PROMPT = `You are an expert cybersecurity advisor specializing in anti-phishing, social engineering defense, and SMB security. You help small and medium businesses protect against phishing, smishing, vishing, Business Email Compromise (BEC), WhatsApp scams, and invoice/vendor fraud.

RULES:
1. Be specific and actionable. Reference actual security gaps mentioned by the user.
2. Prioritize controls that deliver the most risk reduction per dollar and effort.
3. For Israeli businesses, consider: heavy WhatsApp/SMS usage, Hebrew language phishing, local payment customs, Privacy Protection Act requirements.
4. Do NOT make legal claims or guarantee compliance.
5. Do NOT request secrets, passwords, API keys, or sensitive credentials.
6. Always recommend consulting a qualified security professional for complex environments.

When analyzing a business security profile, you MUST:
1. Identify 3-5 specific security gaps and risk factors
2. Understand the threat landscape for their industry
3. Assess the current security maturity level
4. Recommend 2-3 security control categories that directly address identified risks
5. Suggest implementation priority and quick wins`;

const REFINEMENT_SYSTEM_PROMPT = `You are continuing a security analysis conversation with a business user. Keep the conversation focused and helpful.

Guidelines:
1. Reference their specific security situation and threat exposure
2. Ask clarifying questions when needed
3. Build on previous analysis - don't repeat it
4. Provide specific, actionable security recommendations
5. Be concise and conversational
6. Do NOT request passwords, secrets, or sensitive credentials
7. Encourage professional security help for complex environments`;

class AIService {
  constructor() {
    this.diagnosisPrompt = DIAGNOSIS_SYSTEM_PROMPT;
    this.refinementPrompt = REFINEMENT_SYSTEM_PROMPT;
  }

  /**
   * Perform initial AI diagnosis of security posture
   * Automatically handles provider fallback
   */
  async performDiagnosis(securityDescription, apiProvider = 'claude') {
    try {
      const client = getAIClient(apiProvider);

      const userMessage = `Please analyze this business security profile and identify key vulnerabilities and recommended security controls:\n\n${securityDescription}`;

      const response = await client.analyzeWithStreaming(
        this.diagnosisPrompt,
        userMessage
      );

      // Parse the response to extract structured data
      const parsedData = this.parseDiagnosis(response.content);

      return {
        success: true,
        rawDiagnosis: response.content,
        diagnosis: parsedData,
        provider: response.provider,
        model: response.model,
        usage: response.usage
      };
    } catch (error) {
      console.error(`${apiProvider} provider failed:`, error.message);

      // If OpenAI failed and it was primary provider, try Claude fallback
      if (apiProvider === 'openai' && !error.message.includes('quota')) {
        console.log('Attempting fallback to Claude...');
        try {
          return await this.performDiagnosis(securityDescription, 'claude');
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
  parseDiagnosis(content) {
    try {
      // Extract identified security gaps
      const gapsMatch = content.match(/(?:gaps?|vulnerabilit|risk|weakness)(?:es|ies)?:(.+?)(?=categor|control|recommendation|$)/is);
      const gaps = gapsMatch
        ? gapsMatch[1]
          .split('\n')
          .filter(line => line.trim())
          .map(line => line.replace(/^[-*]\s*/, '').trim())
          .filter(line => line.length > 0)
        : [];

      // Extract recommended control categories
      const categoriesMatch = content.match(/(?:categor(?:ies?|y)|control|recommendation)s?:(.+?)(?=implementation?:|priority?:|$)/is);
      const categories = categoriesMatch
        ? categoriesMatch[1]
          .split('\n')
          .filter(line => line.trim())
          .map(line => line.replace(/^[-*]\s*/, '').trim())
          .filter(line => line.length > 0)
        : [];

      return {
        identifiedGaps: gaps,
        controlCategories: categories,
        rawAnalysis: content
      };
    } catch (error) {
      console.error('Parse Error:', error);
      return {
        identifiedGaps: [],
        controlCategories: [],
        rawAnalysis: content
      };
    }
  }

  /**
   * Generate implementation guide for a security control
   */
  async generateImplementationGuide(
    controlName,
    securityProfile,
    identifiedGaps,
    apiProvider = 'claude'
  ) {
    try {
      const client = getAIClient(apiProvider);

      const prompt = `Based on this security context:
Business Profile: ${securityProfile}
Identified Gaps: ${identifiedGaps.join(', ')}

Generate a concise implementation guide for the security control "${controlName}" that:
1. Explains why this control addresses their specific risks
2. Lists 4-5 actionable implementation steps
3. Identifies quick wins (first 30 days)
4. Mentions common pitfalls to avoid
Keep it practical and specific to their situation. Do NOT request secrets or credentials.`;

      const response = await client.analyzeWithStreaming(
        'You are a cybersecurity implementation specialist helping SMBs.',
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
