# AI Business Advisor - Production Ready

A sophisticated full-stack AI-powered business technology consulting platform that uses Claude API and OpenAI GPT-4 to analyze business challenges and recommend tailored technology solutions.

## 📁 Project Structure

```
AI-business-advisor/
├── backend/
│   ├── config/          # Environment, database, AI providers
│   ├── models/          # Mongoose schemas
│   │   ├── User.js
│   │   ├── Analysis.js
│   │   ├── Technology.js
│   │   └── ChatMessage.js
│   ├── middleware/      # Auth, error handling
│   ├── routes/          # API endpoints
│   │   ├── auth.js
│   │   └── analyze.js
│   ├── services/        # Business logic
│   │   ├── ai-service.js
│   │   └── recommendation-engine.js
│   ├── scripts/         # Database seeding
│   │   └── seed-technologies.js
│   ├── tests/           # Test suite
│   │   └── api.test.js
│   ├── server.js        # Express app
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components (6 files + CSS)
│   │   │   ├── AdvancedAdvisor.jsx/css
│   │   │   ├── InitialInput.jsx/css
│   │   │   ├── DiagnosisDisplay.jsx/css
│   │   │   ├── ChatInterface.jsx/css
│   │   │   ├── RecommendationCards.jsx/css
│   │   │   └── AnalysisHistory.jsx/css
│   │   ├── hooks/       # React hooks
│   │   │   └── useAnalysis.js
│   │   ├── services/    # API client
│   │   │   └── api.js
│   │   └── index.jsx
│   └── package.json
│
├── SYSTEM_OVERVIEW.md   # Architecture & technical details
├── DEPLOYMENT.md        # Deployment guide
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- MongoDB Atlas account
- Claude API key (https://console.anthropic.com)
- OpenAI API key (https://platform.openai.com)

### Installation (5 minutes)

**1. Clone Repository**
```bash
git clone https://github.com/Sh-dott/AI-business-advisor.git
cd AI-business-advisor
```

**2. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run seed        # Populate 50+ technologies
npm run dev         # Start server on port 5000
```

**3. Frontend Setup**
```bash
cd ../frontend
npm install
npm start          # Start on port 3000
```

**4. Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/health

---

## 📋 Features

✅ **Interactive Quiz**
- 6 intelligent questions about your business
- Beautiful UI with particle animations
- Real-time selection feedback

✅ **AI-Powered Analysis**
- Analyzes 10 different criteria
- Matches business needs to best solutions
- Calculates ROI and success probability

✅ **30+ Technology Recommendations**
- CRM & Customer Management (HubSpot, Pipedrive)
- E-commerce (Shopify, WooCommerce)
- Website Builders (Wix, WordPress, Webflow)
- Payment Solutions (Stripe, PayPal)
- Scheduling (Calendly, Acuity)
- Marketing Automation (Mailchimp, Klaviyo)
- Business Management (Monday.com, Notion, Asana)
- Analytics (Google Analytics, Hotjar)

✅ **Detailed Recommendations**
- Pricing information
- Setup time & complexity
- Features and strengths
- Use cases
- Links to official websites

---

## 🎯 How It Works

1. **User Answer Questions** - Select options about their business
2. **AI Analysis** - System analyzes against 10 scoring criteria:
   - Business type fit (25 pts)
   - Challenge relevance (30 pts)
   - Tech level compatibility (20 pts)
   - Budget fit (20 pts)
   - Timeline compatibility (15 pts)
   - ROI potential (15 pts)
   - AI features (10 pts)
   - Business size fit (10 pts)
   - Support quality (8 pts)
   - Leading tool bonus (5 pts)

3. **Get Recommendations** - Top 4 solutions displayed with:
   - Priority level (Critical → Useful)
   - Detailed description
   - Matching factors
   - Implementation details
   - Official links

---

## 📊 Technology Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Canvas API** - Particle animations

### Future Backend
- Node.js/Express - API server
- MongoDB - Database
- JWT - Authentication
- Email service - Notifications

---

## 📝 Business Questions

The app guides users through these questions:

1. **Business Type** - Retail, Services, Restaurant, Health
2. **Main Challenge** - Customers, Organization, Payments, Online, Time Efficiency
3. **Tech Level** - Beginner, Basic, Intermediate, Advanced
4. **Budget** - Free, Low (100-300), Medium (300-800), High (800+)
5. **Timeline** - Immediate, Short, Medium, Long
6. **Business Size** - Solo, Small Team, Medium, Large

---

## 🔧 Customization

### Add More Technologies
Edit: `frontend/src/data/technologies.js`

### Modify Questions
Edit: `frontend/src/data/questions.js`

### Change Analysis Logic
Edit: `frontend/src/utils/analysis.js`

### Update Styling
Edit: `frontend/src/index.css` or `frontend/public/index.html`

---

## 📦 Build for Production

```bash
cd frontend
npm run build
```

This creates an optimized `build/` folder ready to deploy to:
- Netlify
- Vercel
- AWS S3
- GitHub Pages
- Any static hosting

---

## 🐛 Troubleshooting

**Website won't open?**
- Make sure you're opening: `frontend/build/index.html`
- Use a modern browser (Chrome, Firefox, Safari, Edge)

**Want to make changes?**
- Edit files in `frontend/src/`
- Run `npm run build` to update `build/index.html`

**Need help?**
- Check `docs/SETUP.md` for detailed setup instructions
- Review code comments in source files

---

## 📄 License

This project is designed for educational and business use.

---

## 📞 Support

For questions or issues, refer to:
- `docs/ARCHITECTURE.md` - System design
- `docs/API.md` - API specifications (when backend is built)
- Source code comments throughout

---

**Version:** 1.0.0
**Last Updated:** November 30, 2025
**Status:** Production Ready ✅
