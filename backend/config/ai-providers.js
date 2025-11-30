// AI Provider Configuration (Claude & OpenAI)
const axios = require('axios');
const config = require('./environment');

// Claude API Client
class ClaudeClient {
  constructor() {
    this.apiKey = config.CLAUDE_API_KEY;
    this.baseURL = config.CLAUDE_API_URL;
    this.model = config.CLAUDE_MODEL;
    this.maxTokens = config.CLAUDE_MAX_TOKENS;

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });
  }

  async analyzeWithStreaming(systemPrompt, userMessage) {
    try {
      const response = await this.client.post('/messages', {
        model: this.model,
        max_tokens: this.maxTokens,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      return {
        content: response.data.content[0].text,
        usage: response.data.usage,
        model: this.model,
        provider: 'claude'
      };
    } catch (error) {
      console.error('Claude API Error:', error.response?.data || error.message);
      throw new Error(`Claude API Error: ${error.message}`);
    }
  }

  async analyzeWithStreamingIterative(messages, systemPrompt) {
    try {
      const response = await this.client.post('/messages', {
        model: this.model,
        max_tokens: this.maxTokens,
        system: systemPrompt,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      return {
        content: response.data.content[0].text,
        usage: response.data.usage,
        model: this.model,
        provider: 'claude'
      };
    } catch (error) {
      console.error('Claude API Error:', error.response?.data || error.message);
      throw new Error(`Claude API Error: ${error.message}`);
    }
  }
}

// OpenAI API Client
class OpenAIClient {
  constructor() {
    this.apiKey = config.OPENAI_API_KEY;
    this.baseURL = config.OPENAI_API_URL;
    this.model = config.OPENAI_MODEL;
    this.maxTokens = config.OPENAI_MAX_TOKENS;

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
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ]
      });

      return {
        content: response.data.choices[0].message.content,
        usage: response.data.usage,
        model: this.model,
        provider: 'openai'
      };
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }

  async analyzeWithStreamingIterative(messages, systemPrompt) {
    try {
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
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
        provider: 'openai'
      };
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }
}

// Factory to get appropriate client
function getAIClient(provider = 'claude') {
  if (provider === 'openai') {
    return new OpenAIClient();
  }
  return new ClaudeClient();
}

module.exports = {
  ClaudeClient,
  OpenAIClient,
  getAIClient
};
