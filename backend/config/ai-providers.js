// AI Provider Configuration - Hybrid: OpenRouter (primary) + Groq (fallback)
const axios = require('axios');
const config = require('./environment');

class OpenRouterClient {
  constructor() {
    this.apiKey = config.OPENROUTER_API_KEY;
    this.baseURL = config.OPENROUTER_API_URL;
    this.model = config.OPENROUTER_MODEL;
    this.maxTokens = config.OPENROUTER_MAX_TOKENS;

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'content-type': 'application/json'
      }
    });
  }

  async analyzeWithStreaming(systemPrompt, userMessage) {
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
      provider: 'openrouter'
    };
  }

  async analyzeWithStreamingIterative(messages, systemPrompt) {
    const response = await this.client.post('/chat/completions', {
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({ role: msg.role, content: msg.content }))
      ]
    });

    return {
      content: response.data.choices[0].message.content,
      usage: response.data.usage,
      model: this.model,
      provider: 'openrouter'
    };
  }
}

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
  }

  async analyzeWithStreamingIterative(messages, systemPrompt) {
    const response = await this.client.post('/chat/completions', {
      model: this.model,
      max_tokens: this.maxTokens,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({ role: msg.role, content: msg.content }))
      ]
    });

    return {
      content: response.data.choices[0].message.content,
      usage: response.data.usage,
      model: this.model,
      provider: 'groq'
    };
  }
}

// Factory: OpenRouter primary, Groq fallback
function getAIClient() {
  if (config.OPENROUTER_API_KEY) {
    return new OpenRouterClient();
  }
  return new GroqClient();
}

module.exports = {
  OpenRouterClient,
  GroqClient,
  getAIClient
};
