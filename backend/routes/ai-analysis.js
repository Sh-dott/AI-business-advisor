const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Lazy-initialize clients: OpenRouter primary, Groq fallback
let openrouterClient;
let groqClient;

function getOpenRouterClient() {
  if (!openrouterClient && process.env.OPENROUTER_API_KEY) {
    openrouterClient = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1'
    });
  }
  return openrouterClient;
}

function getGroqClient() {
  if (!groqClient && process.env.GROQ_API_KEY) {
    groqClient = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1'
    });
  }
  return groqClient;
}

// Rate limiter: 1 request per IP every 20 seconds
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 20 * 1000; // 20 seconds

function rateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  const lastRequest = rateLimitMap.get(ip);

  if (lastRequest && (now - lastRequest) < RATE_LIMIT_WINDOW) {
    const waitSeconds = Math.ceil((RATE_LIMIT_WINDOW - (now - lastRequest)) / 1000);
    return res.status(429).json({
      error: `Please wait ${waitSeconds} seconds before requesting another analysis.`
    });
  }

  rateLimitMap.set(ip, now);
  next();
}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamp] of rateLimitMap) {
    if (now - timestamp > RATE_LIMIT_WINDOW * 3) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Scoring weights (10 criteria, 155 total points)
const SCORING_WEIGHTS = {
  threatMatch: 30,
  gapSeverity: 25,
  industryFit: 20,
  budgetFit: 15,
  teamFit: 12,
  simplicity: 12,
  timeToValue: 10,
  regulatoryFit: 10,
  attackSurfaceReduction: 10,
  forceMultiplier: 11
};

/**
 * Compute weighted score for a recommendation
 */
function computeScore(scores) {
  if (!scores || typeof scores !== 'object') return 0;
  let total = 0;
  for (const [key, weight] of Object.entries(SCORING_WEIGHTS)) {
    const score = typeof scores[key] === 'number' ? scores[key] : 0;
    total += weight * Math.min(1, Math.max(0, score));
  }
  return Math.round(total * 10) / 10;
}

/**
 * Sanitize a value to ensure it's a primitive type safe for React rendering
 */
function sanitizeValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'object' && item !== null) return item;
      return sanitizeValue(item);
    }).filter(item => item !== '' && item !== null && item !== undefined);
  }
  if (typeof value === 'object') return value;
  return String(value).trim();
}

// Security-focused system prompt
const SECURITY_SYSTEM_PROMPT = `You are an expert cybersecurity advisor specializing in anti-phishing, social engineering defense, and SMB security. You help small and medium businesses protect against phishing, smishing, vishing, Business Email Compromise (BEC), WhatsApp scams, and invoice/vendor fraud.

RULES:
1. Produce ONLY valid JSON matching the schema described in the user message.
2. All text must be in the language specified by the "language" field. If "he", write all user-facing text in Hebrew. If "en", write in English. If "ru", write in Russian.
3. CRITICAL: Recommend SPECIFIC, REAL products and services by name. NOT generic advice. Examples:
   - Instead of "use an email security gateway" → "Deploy Proofpoint Essentials or Avanan (by Check Point) for email filtering"
   - Instead of "implement MFA" → "Enable Microsoft Authenticator or Google Authenticator on all accounts, starting with email and banking"
   - Instead of "train employees" → "Subscribe to KnowBe4 or Cofense PhishMe for monthly phishing simulations"
   - Instead of "create an incident response plan" → "Use the CISA Incident Response Playbook template and assign [role] as first responder"
4. In "toolCategories" field, list SPECIFIC product/vendor names the business should evaluate (e.g., "Proofpoint Essentials", "KnowBe4", "Duo Security", "Abnormal Security").
5. In "steps", provide concrete actions with specific tools: "Go to admin.microsoft.com → Security → Threat policies → Enable Safe Links and Safe Attachments".
6. Do NOT make legal claims or guarantee compliance. Recommend consulting a security professional for complex environments.
7. Your recommendations must be realistic for an SMB with limited security expertise.
8. Prioritize controls that deliver the most risk reduction per dollar and effort.
9. For Israeli businesses (language "he"), consider: heavy WhatsApp/SMS usage, Hebrew language phishing, local payment customs (bank transfers, checks), Privacy Protection Act, and recommend Israeli/international vendors available in Israel (e.g., Check Point Harmony, Perception Point, Ironscales).
10. Each of the 4 recommendations MUST come from a DIFFERENT category: (a) email_security, (b) identity_access, (c) awareness_training, (d) process_ir.
11. Include an incident response mini-playbook with concrete first-60-minute steps.
12. All recommendations must be actionable by a non-technical business owner.`;

/**
 * POST /api/ai-analysis/recommend
 * Analyzes user security profile and generates AI-powered anti-phishing recommendations
 */
router.post('/recommend', rateLimiter, async (req, res) => {
  try {
    // Validate at least one API key is present
    if (!process.env.OPENROUTER_API_KEY && !process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: 'AI API not configured',
        message: 'No AI provider API key configured',
        details: 'Please configure OPENROUTER_API_KEY or GROQ_API_KEY'
      });
    }

    const {
      businessName,
      industry,
      threatExposure,
      currentControls,
      securityBudget,
      teamSize,
      techMaturity,
      description,
      language = 'en'
    } = req.body;

    // Validate required fields
    if (!industry || !description) {
      return res.status(400).json({
        error: 'Missing required fields: industry and description'
      });
    }

    // Build threat list
    const threatList = Array.isArray(threatExposure)
      ? threatExposure.join(', ')
      : String(threatExposure || 'phishing_emails');

    const controlsList = Array.isArray(currentControls)
      ? currentControls.join(', ')
      : String(currentControls || 'none');

    // Build the user prompt
    const userPrompt = `Analyze this business security profile and generate anti-phishing protection recommendations.

BUSINESS SECURITY PROFILE:
- Business Name: ${businessName || 'Not specified'}
- Industry: ${industry}
- Primary Threat Concerns: ${threatList}
- Current Security Controls: ${controlsList}
- Monthly Security Budget: ${securityBudget || 'not specified'}
- Team Size (people with email/system access): ${teamSize || 'not specified'}
- Tech Maturity: ${techMaturity || 'basic'}
- Additional Context: ${description}
- Language: ${language}

TASK: Return ONLY valid JSON (no markdown, no commentary). Keep all text CONCISE - max 1-2 short sentences per field. All text in the specified language.

{"diagnosis":{"riskLevel":"critical|high|medium|low","summary":"1-2 sentences","keyFindings":["f1","f2","f3"],"industryContext":"1 sentence"},"recommendations":[{"name":"short name","category":"email_security|identity_access|awareness_training|process_ir","priority":"Critical|High|Medium","description":"1-2 sentences","why":"1 sentence","steps":["s1","s2","s3"],"pitfalls":["p1","p2"],"toolCategories":["t1","t2"],"estimatedEffort":"short","estimatedCost":"short","scores":{"threatMatch":0.0,"gapSeverity":0.0,"industryFit":0.0,"budgetFit":0.0,"teamFit":0.0,"simplicity":0.0,"timeToValue":0.0,"regulatoryFit":0.0,"attackSurfaceReduction":0.0,"forceMultiplier":0.0}}],"roadmap":{"days30":["a1","a2"],"days60":["a1","a2"],"days90":["a1","a2"]},"kpis":[{"metric":"name","baseline":"now","target30":"30d","target90":"90d"}],"incidentResponse":{"title":"short title","steps":[{"timeframe":"0-15 min","actions":["a1","a2"]},{"timeframe":"15-60 min","actions":["a1","a2"]}],"contacts":"1 sentence"},"analysis":"1-2 sentence summary"}

Return exactly 4 recommendations, one per category. Scores are 0.0-1.0. Be CONCISE but SPECIFIC - name real products, vendors, and exact steps. No generic advice.`;

    // Call AI API: OpenRouter primary, Groq fallback
    let message;
    let usedProvider = 'unknown';
    const chatParams = {
      max_tokens: 8000,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SECURITY_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ]
    };

    const orClient = getOpenRouterClient();
    if (orClient) {
      try {
        message = await orClient.chat.completions.create({
          model: 'nvidia/nemotron-3-nano-30b-a3b:free',
          ...chatParams
        });
        usedProvider = 'openrouter';
      } catch (primaryErr) {
        console.warn('OpenRouter failed, trying Groq fallback:', primaryErr.message);
      }
    }

    if (!message) {
      const gClient = getGroqClient();
      if (!gClient) throw new Error('No AI provider available');
      message = await gClient.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        ...chatParams
      });
      usedProvider = 'groq';
    }

    // Extract the response text
    const responseText = message.choices[0].message.content;
    const finishReason = message.choices[0].finish_reason;

    if (finishReason === 'length') {
      console.warn('AI response was truncated (finish_reason: length)');
    }

    // Try to parse as JSON with robust repair
    let analysisResult;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      let jsonStr = jsonMatch[0];

      // Repair common JSON issues from smaller models
      // Remove trailing commas before } or ]
      jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');
      // Fix unescaped newlines in strings
      jsonStr = jsonStr.replace(/(?<=":.*"[^"]*)\n([^"]*")/g, '\\n$1');
      // Close unclosed brackets/braces
      const openBraces = (jsonStr.match(/\{/g) || []).length;
      const closeBraces = (jsonStr.match(/\}/g) || []).length;
      const openBrackets = (jsonStr.match(/\[/g) || []).length;
      const closeBrackets = (jsonStr.match(/\]/g) || []).length;
      jsonStr += ']'.repeat(Math.max(0, openBrackets - closeBrackets));
      jsonStr += '}'.repeat(Math.max(0, openBraces - closeBraces));

      try {
        analysisResult = JSON.parse(jsonStr);
      } catch (firstErr) {
        // More aggressive repair: remove control characters
        jsonStr = jsonStr.replace(/[\x00-\x1F\x7F]/g, ' ');
        jsonStr = jsonStr.replace(/,\s*([}\]])/g, '$1');
        analysisResult = JSON.parse(jsonStr);
      }
    } catch (parseErr) {
      console.error('Failed to parse AI response:', responseText.substring(0, 500));
      // If OpenRouter failed to produce valid JSON, retry with Groq
      if (usedProvider === 'openrouter') {
        const gClient = getGroqClient();
        if (gClient) {
          console.log('Retrying with Groq due to JSON parse failure...');
          message = await gClient.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            ...chatParams
          });
          usedProvider = 'groq-retry';
          const retryText = message.choices[0].message.content;
          const retryMatch = retryText.match(/\{[\s\S]*\}/);
          if (retryMatch) {
            let retryJson = retryMatch[0].replace(/,\s*([}\]])/g, '$1');
            analysisResult = JSON.parse(retryJson);
          }
        }
      }
      if (!analysisResult) {
        return res.status(500).json({
          error: 'Failed to parse AI recommendations',
          details: parseErr.message
        });
      }
    }

    // Validate the response has required structure
    if (!analysisResult.recommendations || !Array.isArray(analysisResult.recommendations)) {
      return res.status(500).json({
        error: 'Invalid AI response structure',
        details: 'Missing recommendations array'
      });
    }

    // Compute weighted scores for each recommendation
    const scoredRecommendations = analysisResult.recommendations
      .filter(rec => rec && rec.name && rec.category)
      .map(rec => ({
        ...rec,
        totalScore: computeScore(rec.scores),
        steps: Array.isArray(rec.steps) ? rec.steps : [],
        pitfalls: Array.isArray(rec.pitfalls) ? rec.pitfalls : [],
        toolCategories: Array.isArray(rec.toolCategories) ? rec.toolCategories : []
      }));

    // Sort by score descending
    scoredRecommendations.sort((a, b) => b.totalScore - a.totalScore);

    // Return the full security analysis
    res.json({
      success: true,
      diagnosis: analysisResult.diagnosis || { riskLevel: 'medium', summary: 'Analysis completed', keyFindings: [], industryContext: '' },
      threatModel: analysisResult.threatModel || { topThreats: [], attackSurface: '' },
      recommendations: scoredRecommendations,
      roadmap: analysisResult.roadmap || { days30: [], days60: [], days90: [] },
      kpis: Array.isArray(analysisResult.kpis) ? analysisResult.kpis : [],
      incidentResponse: analysisResult.incidentResponse || { title: '', steps: [], contacts: '' },
      analysis: String(analysisResult.analysis || 'Security analysis completed').trim(),
      source: usedProvider
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
      error: 'Failed to generate security recommendations',
      message: error.message,
      details: error.code || error.type
    });
  }
});

module.exports = router;
