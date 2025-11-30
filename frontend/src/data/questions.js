// Quiz Questions - Comprehensive business assessment
export const questions = [
    {
        id: 'business',
        text: 'איזה סוג עסק יש לך?',
        subtitle: 'בחר את הסוג שהכי קרוב לעסקך',
        type: 'multiple',
        options: [
            { value: 'retail', label: '🛍️ חנות / מכירה אונליין', desc: 'מוצרים פיזיים או דיגיטליים' },
            { value: 'services', label: '💼 שירותים מקצועיים', desc: 'ייעוץ, עיצוב, שיווק, תוכנה' },
            { value: 'restaurant', label: '🍽️ מסעדה / קפה / דליברי', desc: 'מזון, משקאות, תפעול' },
            { value: 'health', label: '⚕️ בריאות / יופי / כושר', desc: 'קליניקה, ספא, גיים, פסיכולוג' },
            { value: 'freelance', label: '👨‍💻 עצמאי / סוכן עבודה', desc: 'ייעוץ, כתיבה, עיצוב, פרוגרמציה' },
            { value: 'manufacturing', label: '🏭 ייצור / מלאכה', desc: 'מוצרים בעבודת יד, ייצור קטן' },
            { value: 'education', label: '📚 חינוך / הדרכה', desc: 'קורסים, שיעורים, הכשרה' },
            { value: 'nonprofit', label: '❤️ ארגון חברתי / תמיכה', desc: 'NGO, מוקדים, התנדבות' }
        ]
    },
    {
        id: 'challenge',
        text: 'מה הבעיה הגדולה ביותר שלך?',
        subtitle: 'בחר את 1-2 בעיות המרכזיות',
        type: 'multiple',
        options: [
            { value: 'customers', label: '👥 משיכת לקוחות חדשים', desc: 'קשה לי למצוא ולהשיג לקוחות חדשים' },
            { value: 'retention', label: '🔄 שמירה על לקוחות קיימים', desc: 'לקוחות לא חוזרים שוב' },
            { value: 'cashflow', label: '💸 בעיות תזרים מזומנים', desc: 'קושי בקבלת תשלומים בזמן' },
            { value: 'time_management', label: '⏰ בזבוז זמן בעבודה ידנית', desc: 'יותר מדי עבודה ידנית שלא מייצרת רווח' },
            { value: 'inventory', label: '📦 ניהול מלאי/הזמנות', desc: 'קשה לנהל מלאי או הזמנות' },
            { value: 'communication', label: '💬 תקשורת עם לקוחות', desc: 'קשה לתקשר עם לקוחות בזמן' },
            { value: 'team_management', label: '👔 ניהול צוות', desc: 'קושי בתיאום וניהול עובדים' },
            { value: 'data_tracking', label: '📊 ניהול נתונים וביצועים', desc: 'אין לי ראות מובהקת של הנתונים' },
            { value: 'online_presence', label: '🌐 נוכחות דיגיטלית', desc: 'אין אתר, מדיה חברתית או נוכחות אונליין' },
            { value: 'compliance', label: '⚖️ ציות חוקי/ניהול מסמכים', desc: 'קושי בניהול מסמכים וציות' }
        ]
    },
    {
        id: 'budget',
        text: 'מה התקציב החודשי שלך?',
        subtitle: 'בחר את הטווח הרלוונטי',
        type: 'multiple',
        options: [
            { value: 'free', label: '🆓 חינם לחלוטין', desc: '0 ש"ח - אני צריך רק כלים בחינם' },
            { value: 'low', label: '💰 קטן מאוד', desc: '50-150 ש"ח / חודש' },
            { value: 'medium_low', label: '💵 קטן', desc: '150-500 ש"ח / חודש' },
            { value: 'medium', label: '💴 בינוני', desc: '500-1,500 ש"ח / חודש' },
            { value: 'medium_high', label: '💶 גבוה יחסית', desc: '1,500-5,000 ש"ח / חודש' },
            { value: 'high', label: '💷 גבוה מאוד', desc: '5,000+ ש"ח / חודש' }
        ]
    },
    {
        id: 'team_size',
        text: 'כמה אנשים בצוות שלך?',
        subtitle: 'כולל את עצמך',
        type: 'multiple',
        options: [
            { value: 'solo', label: '👤 עצמאי', desc: 'רק אני - עסק קטן מאוד' },
            { value: 'small', label: '👥 קטן', desc: '2-5 עובדים' },
            { value: 'medium', label: '👨‍💼 בינוני', desc: '6-20 עובדים' },
            { value: 'large', label: '👨‍💼👨‍💼 גדול', desc: '20+ עובדים' }
        ]
    },
    {
        id: 'tech_level',
        text: 'מה רמת ההיכרות שלך עם טכנולוגיה?',
        subtitle: 'כמה קל לך ללמוד כלים חדשים',
        type: 'multiple',
        options: [
            { value: 'no_tech', label: '🙈 ללא ידע טכנולוגי', desc: 'אני עדיין מעדיף ככל הניתן לא להשתמש בטכנולוגיה' },
            { value: 'basic', label: '📱 בסיסי', desc: 'אני משתמש בטלפון וברשתות חברתיות' },
            { value: 'intermediate', label: '💻 בינוני', desc: 'אני משתמש בדוא"ל, אקסל, ובסיס נתונים' },
            { value: 'advanced', label: '🚀 מתקדם', desc: 'אני בקיא בטכנולוגיה ותוכנות' }
        ]
    },
    {
        id: 'description',
        text: '📝 ספר לנו בפירוט על עסקך',
        subtitle: 'תיאור מפורט יעזור ל-AI לתת לך ניתוח אישי מדוייק',
        type: 'textarea',
        placeholder: 'לדוגמה: אני מנהל חנות בגדים קטנה עם 2 עובדים בתל אביב. אני משקיע הרבה זמן בניהול הזמנות, עדכון לקוחות ודוא"ל. רוצה לאוטומט תהליכים, להגביר מכירות דרך הרשתות החברתיות, ולחסוך זמן על ניהול מלאי.'
    }
];

export default questions;
