/**
 * Document export translations for security protection program
 * Supports: English, Hebrew
 */

const translations = {
  en: {
    // Cover Page
    businessProgram: 'Anti-Phishing Protection Program',
    preparedFor: 'Prepared for',
    generatedOn: 'Generated on',

    // Executive Summary
    executiveSummary: 'Executive Summary',
    yourBusinessProfile: 'Your Security Profile',
    industry: 'Industry',
    threatExposure: 'Threat Exposure',
    currentControls: 'Current Controls',
    securityBudget: 'Security Budget',
    techMaturity: 'Tech Maturity',
    teamSize: 'Team Size',

    // Diagnosis
    diagnosis: 'Risk Diagnosis & Threat Model',
    riskLevel: 'Risk Level',
    riskAssessment: 'Risk Assessment',
    keyFindings: 'Key Findings',
    industryContext: 'Industry Context',
    threatModel: 'Threat Model',
    attackSurface: 'Attack Surface',
    topThreats: 'Top Threats',
    likelihood: 'Likelihood',
    impact: 'Impact',

    // Security Recommendations
    securityRecommendations: 'Security Recommendations',
    priority: 'Priority',
    description: 'Description',
    whyThisMatters: 'Why This Matters',
    implementationSteps: 'Implementation Steps',
    commonPitfalls: 'Common Pitfalls',
    toolCategories: 'Tool Categories',
    estimatedEffort: 'Estimated Effort',
    estimatedCost: 'Estimated Cost',

    // Categories
    categoryEmailSecurity: 'Email Security',
    categoryIdentityAccess: 'Identity & Access',
    categoryAwarenessTraining: 'Awareness Training',
    categoryProcessIr: 'Process & Incident Response',

    // Roadmap
    protectionRoadmap: 'Protection Roadmap',
    days30: 'First 30 Days',
    days60: '30-60 Days',
    days90: '60-90 Days',

    // KPIs
    securityKpis: 'Security KPIs',
    metric: 'Metric',
    baseline: 'Baseline',
    target30: '30-Day Target',
    target90: '90-Day Target',

    // Incident Response
    incidentResponse: 'Incident Response Playbook',
    timeframe: 'Timeframe',
    actions: 'Actions',
    emergencyContacts: 'Emergency Contacts',

    // Policies
    securityPolicies: 'Security Policies',
    paymentVerification: 'Payment Change Verification Policy',
    suspiciousReporting: 'Suspicious Message Reporting Policy',
    antiVishing: 'Anti-Vishing Call Script',

    // Priority levels
    critical: 'Critical',
    highPriority: 'High',
    mediumPriority: 'Medium',

    // Document footer
    generatedDocument: 'Generated',
    documentType: 'Document Type',
    pages: 'Pages',
    confidential: 'CONFIDENTIAL - For Internal Use Only'
  },

  he: {
    // Cover Page
    businessProgram: 'תוכנית הגנה מפני פישינג',
    preparedFor: 'הוכן עבור',
    generatedOn: 'נוצר ב',

    // Executive Summary
    executiveSummary: 'סיכום מנהלים',
    yourBusinessProfile: 'פרופיל האבטחה שלך',
    industry: 'תעשייה',
    threatExposure: 'חשיפה לאיומים',
    currentControls: 'בקרות נוכחיות',
    securityBudget: 'תקציב אבטחה',
    techMaturity: 'בשלות טכנולוגית',
    teamSize: 'גודל צוות',

    // Diagnosis
    diagnosis: 'אבחון סיכונים ומודל איומים',
    riskLevel: 'רמת סיכון',
    riskAssessment: 'הערכת סיכונים',
    keyFindings: 'ממצאים עיקריים',
    industryContext: 'הקשר תעשייתי',
    threatModel: 'מודל איומים',
    attackSurface: 'משטח תקיפה',
    topThreats: 'איומים מובילים',
    likelihood: 'סבירות',
    impact: 'השפעה',

    // Security Recommendations
    securityRecommendations: 'המלצות אבטחה',
    priority: 'עדיפות',
    description: 'תיאור',
    whyThisMatters: 'למה זה חשוב',
    implementationSteps: 'שלבי יישום',
    commonPitfalls: 'מלכודות נפוצות',
    toolCategories: 'קטגוריות כלים',
    estimatedEffort: 'מאמץ משוער',
    estimatedCost: 'עלות משוערת',

    // Categories
    categoryEmailSecurity: 'אבטחת דוא"ל',
    categoryIdentityAccess: 'זהות וגישה',
    categoryAwarenessTraining: 'הכשרת מודעות',
    categoryProcessIr: 'תהליכים ותגובה לאירועים',

    // Roadmap
    protectionRoadmap: 'מפת דרכים להגנה',
    days30: '30 ימים ראשונים',
    days60: '30-60 ימים',
    days90: '60-90 ימים',

    // KPIs
    securityKpis: 'מדדי אבטחה',
    metric: 'מדד',
    baseline: 'בסיס',
    target30: 'יעד 30 יום',
    target90: 'יעד 90 יום',

    // Incident Response
    incidentResponse: 'תוכנית תגובה לאירועים',
    timeframe: 'מסגרת זמן',
    actions: 'פעולות',
    emergencyContacts: 'אנשי קשר לחירום',

    // Policies
    securityPolicies: 'מדיניות אבטחה',
    paymentVerification: 'מדיניות אימות שינוי תשלום',
    suspiciousReporting: 'מדיניות דיווח על הודעות חשודות',
    antiVishing: 'תסריט נגד שיחות הונאה',

    // Priority levels
    critical: 'קריטי',
    highPriority: 'גבוה',
    mediumPriority: 'בינוני',

    // Document footer
    generatedDocument: 'נוצר',
    documentType: 'סוג מסמך',
    pages: 'עמודים',
    confidential: 'חסוי - לשימוש פנימי בלבד'
  }
};

/**
 * Get translation for a key in specified language
 * @param {string} language - Language code (en, he)
 * @param {string} key - Translation key
 * @returns {string} - Translated text or key if not found
 */
function t(language, key) {
  const lang = translations[language] || translations.en;
  return lang[key] || translations.en[key] || key;
}

module.exports = {
  translations,
  t
};
