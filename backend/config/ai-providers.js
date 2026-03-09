// AI Provider Configuration (Groq-based, OpenAI-compatible)
const axios = require('axios');
const config = require('./environment');

// Groq Client (OpenAI-compatible API)
class GroqClient {
  constructor() {
    this.apiKey = config.GROQ_API_KEY;
    this.baseURL = config.GROQ_API_URL;
    this.model = config.GROQ_MODEL;
    this.maxTokens = config.GROQ_MAX_TOKENS;

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'content-type': 'application/json'
      }
    });
  }

  async analyzeWithStreaming(systemPrompt, userMessage) {
    try {
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      });

      return {
        content: response.data.choices[0].message.content,
        usage: response.data.usage,
        model: this.model,
        provider: 'groq'
      };
    } catch (error) {
      console.error('Groq API Error:', error.response?.data || error.message);
      throw new Error(`Groq API Error: ${error.message}`);
    }
  }

  async analyzeWithStreamingIterative(messages, systemPrompt) {
    try {
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ]
      });

      return {
        content: response.data.choices[0].message.content,
        usage: response.data.usage,
        model: this.model,
        provider: 'groq'
      };
    } catch (error) {
      console.error('Groq API Error:', error.response?.data || error.message);
      throw new Error(`Groq API Error: ${error.message}`);
    }
  }
}

// Factory to get appropriate client (all routes go through Groq now)
function getAIClient(provider = 'groq') {
  return new GroqClient();
}

module.exports = {
  GroqClient,
  getAIClient
};
