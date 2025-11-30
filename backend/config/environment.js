// Environment configuration and validation
require('dotenv').config();

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLAUDE_API_KEY',
  'OPENAI_API_KEY'
];

// Check required environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
    'Please create a .env file with all required variables.'
  );
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

module.exports = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Database
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: 'ai_business_advisor',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: '7d',

  // Claude API
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
  CLAUDE_API_URL: 'https://api.anthropic.com/v1',
  CLAUDE_MODEL: 'claude-3-5-sonnet-20241022',
  CLAUDE_MAX_TOKENS: 2048,

  // OpenAI API
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_API_URL: 'https://api.openai.com/v1',
  OPENAI_MODEL: 'gpt-4o-mini',  // Changed from gpt-4-turbo - available and cost-effective
  OPENAI_MAX_TOKENS: 2048,

  // Streaming
  STREAM_CHUNK_SIZE: 1024,
  STREAM_TIMEOUT: 30000,

  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
