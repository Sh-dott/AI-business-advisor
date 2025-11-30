// Technology Database - Comprehensive business solutions
export const technologies = {
    hubspot_free: {
        name: 'HubSpot CRM Free',
        category: 'CRM & Customer Management',
        pricing: 'חינם',
        setup: '1-2 שעות',
        complexity: 'נמוכה',
        description: 'מערכת ניהול לקוחות חינמית וחזקה עם תכונות בסיסיות',
        best_for: ['services', 'health', 'retail'],
        factors: ['100% חינמי לעולם', 'קל ללמידה', 'אינטגרציה עם Gmail'],
        link: 'https://hubspot.com',
        steps: ['הרשמה חינמית לחשבון HubSpot', 'הוספת כל אנשי הקשר שלך', 'הגדרת תהליכי המכירות שלך', 'התחלת מעקב אחרי עסקאות']
    },
    hubspot_starter: {
        name: 'HubSpot CRM Starter',
        category: 'CRM & Customer Management',
        pricing: '180 ש"ח/חודש',
        setup: '4-8 שעות',
        complexity: 'בינונית',
        description: 'מערכת CRM מתקדמת עם אוטומציה וכלים שיווקיים',
        best_for: ['services', 'retail'],
        factors: ['יחס מחיר-ביצועים מעולה', 'תמיכה 24/7', 'אינטגרציות רבות'],
        link: 'https://hubspot.com/pricing/crm',
        steps: ['רישום ל-Starter Plan', 'יבוא נתוני לקוחות קיימים', 'הגדרת זרימות אוטומציה', 'הכשרת הצוות שלך']
    },
    pipedrive: {
        name: 'Pipedrive',
        category: 'CRM & Customer Management',
        pricing: '59 ש"ח/חודש',
        setup: '2-4 שעות',
        complexity: 'נמוכה',
        description: 'CRM ממוקד מכירות עם ממשק ויזואלי וידידותי',
        best_for: ['retail', 'services'],
        factors: ['פשוט וידידותי', 'התמחות במכירות', 'מחיר נגיש'],
        link: 'https://pipedrive.com',
        steps: ['צור חשבון Pipedrive', 'כנס את שלבי המכירות שלך', 'הוסף את הצוות שלך', 'התחל לנהל עסקאות']
    },
    shopify: {
        name: 'Shopify',
        category: 'E-commerce',
        pricing: '116 ש"ח/חודש',
        setup: '1-2 ימים',
        complexity: 'נמוכה',
        description: 'פלטפורמת e-commerce מובילה לפתיחת חנות אונליין',
        best_for: ['retail'],
        factors: ['הקמה מהירה', 'תמיכה מעולה', 'תבניות יפות'],
        link: 'https://shopify.com',
        steps: ['בחר תיכנית Shopify', 'בחר תבנית עיצוב', 'הוסף מוצרים', 'הגדר תשלומים ומשלוחים']
    },
    calendly: {
        name: 'Calendly',
        category: 'Scheduling',
        pricing: 'חינם / 39 ש"ח',
        setup: '30 דקות',
        complexity: 'נמוכה',
        description: 'תיאום פגישות אוטומטי וחינם',
        best_for: ['services', 'health'],
        factors: ['תיאום פגישות אוטומטי', 'אינטגרציה לוח שנה', 'קל מאוד'],
        link: 'https://calendly.com',
        steps: ['הרשם ל-Calendly', 'חבר את לוח השנה שלך', 'הגדר זמנים זמינים', 'שתף את הקישור שלך']
    },
    mailchimp: {
        name: 'Mailchimp',
        category: 'Marketing',
        pricing: 'חינם / 39 ש"ח',
        setup: '2-6 שעות',
        complexity: 'בינונית',
        description: 'אימייל מרקטינג ואוטומציה למכירות',
        best_for: ['retail', 'services'],
        factors: ['אימייל מרקטינג מתקדם', 'אוטומציה', 'דוחות מפורטים'],
        link: 'https://mailchimp.com',
        steps: ['הרשם ל-Mailchimp', 'יבוא רשימת המייל שלך', 'עיצוב תבלטים', 'התחלת קמפיינים']
    },
    wix: {
        name: 'Wix',
        category: 'Website Builder',
        pricing: 'חינם / 68 ש"ח',
        setup: '1-3 שעות',
        complexity: 'נמוכה',
        description: 'בניית אתרים עם AI וללא צורך בקוד',
        best_for: ['services', 'restaurant', 'health'],
        factors: ['בניית אתר אוטומטית', 'קל מאוד', 'עיצוב AI'],
        link: 'https://wix.com',
        steps: ['בחר תיכנית Wix', 'בחר עיצוב', 'הוסף את הקונטנט שלך', 'פרסם את האתר']
    },
    stripe: {
        name: 'Stripe',
        category: 'Payments',
        pricing: '2.9% לעסקה',
        setup: '2-8 שעות',
        complexity: 'בינונית',
        description: 'תשלומים מתקדמים וממשקים API',
        best_for: ['retail', 'services'],
        factors: ['תשלומים מתקדמים', 'אבטחה גבוהה', 'API חזק'],
        link: 'https://stripe.com',
        steps: ['הרשם ל-Stripe', 'אמת את חשבונך', 'קבל את פרטי ה-API', 'שלב בחנות שלך']
    },
    notion: {
        name: 'Notion',
        category: 'Management & Productivity',
        pricing: 'חינם / 39 ש"ח',
        setup: '3-10 ימים',
        complexity: 'בינונית',
        description: 'מרחב עבודה הכל-במקום-אחד לניהול העסק',
        best_for: ['services', 'health'],
        factors: ['גמישות מלאה', 'עלות נמוכה', 'שיתוף פעולה'],
        link: 'https://notion.so',
        steps: ['הרשם ל-Notion', 'בחר תבלטים', 'הגדר מסדי נתונים', 'שתף עם הצוות']
    },
    google_analytics: {
        name: 'Google Analytics 4',
        category: 'Analytics',
        pricing: 'חינם',
        setup: '1-2 שעות',
        complexity: 'בינונית',
        description: 'ניתוח מפורט של ביצועי אתר ומשתמשים',
        best_for: ['retail', 'services'],
        factors: ['ניתוח מלא', 'אינטגרציה Google', 'חינמי ומתקדם'],
        link: 'https://analytics.google.com',
        steps: ['הרשם ל-Google Analytics', 'הוסף את הקוד לאתר', 'הגדר קונברסיות', 'בדוק את הדוחות']
    }
};

export default technologies;
