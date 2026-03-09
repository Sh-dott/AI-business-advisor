// Environment configuration and validation
require('dotenv').config();

// Required environment variables (for production)
const requiredEnvVars = [
  'JWT_SECRET'
];

// Check required environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn(
    'Warning: Missing environment variables: ' + missingEnvVars.join(', ')
  );
}

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Database (Optional - we use Word document export instead)
  MONGODB_URI: process.env.MONGODB_URI || null,
  DB_NAME: 'ai_business_advisor',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key-change-in-production',
  JWT_EXPIRATION: '7d',

  // OpenRouter (Primary AI provider)
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
  OPENROUTER_API_URL: 'https://openrouter.ai/api/v1',
  OPENROUTER_MODEL: 'meta-llama/llama-3.1-8b-instruct:free',
  OPENROUTER_MAX_TOKENS: 4000,

  // Groq API (Fallback AI provider)
  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_API_URL: 'https://api.groq.com/openai/v1',
  GROQ_MODEL: 'llama-3.1-8b-instant',
  GROQ_MAX_TOKENS: 4000,

  // Streaming
  STREAM_CHUNK_SIZE: 1024,
  STREAM_TIMEOUT: 30000,

  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: 100,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
