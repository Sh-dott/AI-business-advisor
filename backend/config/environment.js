// Environment configuration and validation
require('dotenv').config();

// Required environment variables (for production)
// Note: MONGODB_URI is optional (we use Word document export instead of database)
const requiredEnvVars = [
  'JWT_SECRET',
  'OPENAI_API_KEY'
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

  // Claude API (Optional - can use as fallback)
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY || 'sk-placeholder',
  CLAUDE_API_URL: 'https://api.anthropic.com/v1',
  CLAUDE_MODEL: 'claude-3-5-sonnet-20241022',
  CLAUDE_MAX_TOKENS: 2048,

  // OpenAI API (Primary AI provider)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'sk-placeholder',
  OPENAI_API_URL: 'https://api.openai.com/v1',
  OPENAI_MODEL: 'gpt-4o-mini',
  OPENAI_MAX_TOKENS: 2048,

  // Streaming
  STREAM_CHUNK_SIZE: 1024,
  STREAM_TIMEOUT: 30000,

  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: 100,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
