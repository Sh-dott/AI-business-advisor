/**
 * Quick test script to verify OpenAI API is working
 * Run: node test-openai.js
 */

require('dotenv').config();
const { OpenAIClient } = require('./config/ai-providers');

async function testOpenAIIntegration() {
  console.log('\n🧪 Testing OpenAI API Integration...\n');
  console.log('Configuration:');
  console.log(`  Model: gpt-4-turbo`);
  console.log(`  Max Tokens: 2048`);
  console.log(`  API Key: ${process.env.OPENAI_API_KEY?.substring(0, 20)}...`);
  console.log('');

  try {
    const client = new OpenAIClient();

    // Test 1: Simple business analysis
    console.log('📋 Test 1: Business Analysis\n');
    const systemPrompt = `You are an expert business technology consultant.
Analyze the user's business challenge and provide insights on what technology solutions would help.
Be concise but insightful.`;

    const userMessage = `I run a small retail clothing store and my main challenge is
managing customer relationships and repeat purchases. We currently use spreadsheets.`;

    console.log('📤 Sending request to OpenAI GPT-4...\n');
    const result = await client.analyzeWithStreaming(systemPrompt, userMessage);

    console.log('✅ Response received:\n');
    console.log(result.content);
    console.log('\n---\n');

    // Test 2: Technology scoring
    console.log('📋 Test 2: Technology Evaluation\n');
    const scoringPrompt = `You are a technology scoring expert.
Rate how well each technology matches the user's needs on a scale of 1-10.
Be specific about why each score was given.`;

    const scoringMessage = `User's challenge: Managing customer relationships and repeat purchases in a small retail store
Technologies to evaluate:
1. HubSpot (CRM platform)
2. Shopify (E-commerce platform)
3. Mailchimp (Email marketing)
4. Square (Payment processing)`;

    console.log('📤 Sending technology evaluation request...\n');
    const scoringResult = await client.analyzeWithStreaming(scoringPrompt, scoringMessage);

    console.log('✅ Technology Scores:\n');
    console.log(scoringResult.content);
    console.log('\n---\n');

    // Summary
    console.log('✅ SUCCESS!\n');
    console.log('Summary:');
    console.log(`  Provider: ${result.provider}`);
    console.log(`  Model: ${result.model}`);
    console.log(`  Tokens Used: ${result.usage.total_tokens}`);
    console.log(`  Input Tokens: ${result.usage.prompt_tokens}`);
    console.log(`  Output Tokens: ${result.usage.completion_tokens}`);
    console.log('\n🎉 OpenAI API is working correctly!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR:\n');
    console.error(error.message);
    console.error('\nPossible issues:');
    console.error('  1. OpenAI API key is invalid or expired');
    console.error('  2. API key does not have permission to use GPT-4');
    console.error('  3. Network connection issue');
    console.error('  4. API quota exceeded\n');
    process.exit(1);
  }
}

// Run test
testOpenAIIntegration();
