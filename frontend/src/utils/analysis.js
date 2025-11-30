// AI Analysis Engine - Recommendation Algorithm
import { technologies } from '../data/technologies.js';

export function analyzeAnswers(answers) {
    const scores = {};

    // Score each technology based on answers
    for (const [key, tech] of Object.entries(technologies)) {
        let score = 0;

        // Business type fit (25 points)
        if (tech.best_for.includes(answers.business)) {
            score += 25;
        }

        // Challenge relevance (30 points)
        if (answers.challenge && tech.category) {
            // Map challenges to categories
            const challengeToCategory = {
                'customers': 'Marketing',
                'retention': 'Marketing',
                'cashflow': 'Payments',
                'time_management': 'Management & Productivity',
                'inventory': 'Management & Productivity',
                'communication': 'CRM & Customer Management',
                'team_management': 'Management & Productivity',
                'data_tracking': 'Analytics',
                'online_presence': ['Website Builder', 'E-commerce'],
                'compliance': 'Management & Productivity'
            };

            const relevantCategories = Array.isArray(challengeToCategory[answers.challenge])
                ? challengeToCategory[answers.challenge]
                : [challengeToCategory[answers.challenge]];

            if (relevantCategories.some(cat => tech.category.includes(cat))) {
                score += 30;
            }
        }

        // Tech level compatibility (20 points)
        if (answers.tech_level) {
            const techLevelScores = {
                'no_tech': { 'נמוכה': 20, 'בינונית': 5 },
                'basic': { 'נמוכה': 20, 'בינונית': 15 },
                'intermediate': { 'נמוכה': 15, 'בינונית': 20 },
                'advanced': { 'בינונית': 20, 'גבוהה': 20 }
            };

            score += techLevelScores[answers.tech_level]?.[tech.complexity] || 0;
        }

        // Budget fit (20 points)
        if (answers.budget) {
            const budgetFit = checkBudgetFit(answers.budget, tech.pricing);
            score += budgetFit * 20;
        }

        // Team size fit (10 points)
        if (answers.team_size) {
            const scalability = {
                'solo': 1,
                'small': 1,
                'medium': 0.8,
                'large': 0.6
            };
            score += (scalability[answers.team_size] || 0.5) * 10;
        }

        // Implementation speed bonus (10 points)
        const setupTime = parseInt(tech.setup);
        if (setupTime <= 4) {
            score += 10;
        }

        // Add to scores
        scores[key] = {
            score: score,
            tech: tech,
            priority: getPriority(score)
        };
    }

    // Sort by score and return top 4
    return Object.values(scores)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(item => ({
            ...item.tech,
            priority: item.priority,
            score: item.score
        }));
}

function checkBudgetFit(budget, pricing) {
    // Parse pricing to estimate cost
    const pricingLower = pricing.toLowerCase();

    const budgetRanges = {
        'free': { min: 0, max: 0 },
        'low': { min: 50, max: 150 },
        'medium_low': { min: 150, max: 500 },
        'medium': { min: 500, max: 1500 },
        'medium_high': { min: 1500, max: 5000 },
        'high': { min: 5000, max: Infinity }
    };

    const userRange = budgetRanges[budget];

    if (pricingLower.includes('חינם') || pricingLower.includes('free')) {
        return budget === 'free' ? 1 : 0.8;
    }

    // Extract price from string like "180 ש"ח/חודש" or "59 ש"ח/חודש"
    const priceMatch = pricing.match(/(\d+)/);
    if (priceMatch) {
        const techPrice = parseInt(priceMatch[1]);
        if (techPrice >= userRange.min && techPrice <= userRange.max) {
            return 1;
        } else if (Math.abs(techPrice - userRange.min) < 100) {
            return 0.7;
        }
    }

    return 0.5;
}

function getPriority(score) {
    if (score >= 90) return 'קריטי';
    if (score >= 70) return 'גבוה';
    if (score >= 50) return 'בינוני';
    return 'שימושי';
}

export default analyzeAnswers;
