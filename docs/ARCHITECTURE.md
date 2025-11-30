# System Architecture

This document describes the design and architecture of the Business Tech Advisor.

## Overview

Business Tech Advisor is a full-stack application that provides AI-powered technology recommendations based on business characteristics.

```
┌─────────────────────────────────────────────────────┐
│                 React Frontend (Port 3000)           │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Quiz Module  │→ │Analysis Eng. │→ │Results UI  │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
│         ↓               ↓                    ↓         │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Data & Utilities                              │ │
│  │  - technologies.js (30+ tools)                │ │
│  │  - questions.js (6 question sets)             │ │
│  │  - analysis.js (scoring algorithm)            │ │
│  └─────────────────────────────────────────────────┘ │
│         ↓               ↓                    ↓         │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │LocalStorage  │  │Calculations  │  │Rendering   │ │
│  └──────────────┘  └──────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────┘
         ↓ (Future)
┌─────────────────────────────────────────────────────┐
│          Node.js Backend API (Port 5000)            │
│  ┌──────────────────────────────────────────────┐   │
│  │ Express Routes                               │   │
│  │ /api/analyze, /api/users, /api/email, etc    │   │
│  └──────────────────────────────────────────────┘   │
│         ↓                                            │
│  ┌──────────────────────────────────────────────┐   │
│  │ MongoDB Database                             │   │
│  │ - User profiles                              │   │
│  │ - Recommendation history                     │   │
│  │ - Analytics data                             │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Frontend Architecture (Current)

### Components

**BusinessTechAdvisor.jsx** - Main component
- Manages quiz state and navigation
- Handles user answers
- Triggers analysis
- Displays results

**ResultsView** - Results display component
- Shows top 4 recommendations
- Displays detailed information per technology
- Provides action links

### Data Flow

1. **User Input** → Quiz questions answered
2. **Storage** → Answers saved to localStorage
3. **Analysis** → `analyzeAnswers()` scoring function
4. **Results** → Top 4 technologies displayed
5. **Output** → User can visit tool websites

### State Management

Uses React hooks:
- `useState` - For quiz progress, answers, results
- `useEffect` - For localStorage persistence

```javascript
const [currentStep, setCurrentStep] = useState(0);
const [answers, setAnswers] = useState({});
const [analysisResults, setAnalysisResults] = useState(null);
```

### Scoring Algorithm

Located in `src/utils/analysis.js`

**Criteria Weights:**
- Business type fit: 25 points
- Challenge relevance: 30 points
- Tech level compatibility: 20 points
- Budget fit: 20 points
- Timeline compatibility: 15 points
- ROI potential: 15 points
- AI features: 10 points
- Business size fit: 10 points
- Support quality: 8 points
- Leading tool bonus: 5 points

**Total Possible: ~150+ points**

### Priority Levels

Based on final score:
- **Critical** (90+ points) - Essential tool
- **High** (70-89 points) - Strong match
- **Medium** (50-69 points) - Good fit
- **Useful** (<50 points) - Secondary option

## Data Structure

### Technologies Object

```javascript
{
  name: string,
  category: string,
  pricing: string,
  setup: string,
  complexity: 'low' | 'medium' | 'high',
  description: string,
  best_for: string[],
  factors: string[],
  link: string,
  steps: string[]
}
```

### Questions Array

```javascript
{
  id: string,
  text: string,
  subtitle: string,
  type: 'multiple' | 'textarea',
  options?: [{
    value: string,
    label: string,
    desc: string
  }],
  placeholder?: string
}
```

### User Answers

```javascript
{
  business: string,
  challenge: string,
  budget: string,
  team_size: string,
  tech_level: string,
  description: string
}
```

## Storage

**Local Storage Keys:**
- `techAdvisorAnswers` - Persists quiz answers between sessions

## Styling

**CSS Architecture:**
- CSS Variables for colors (`:root`)
- Mobile-first responsive design
- Flexbox and CSS Grid
- Animations for UX polish

**Color Scheme:**
```css
--primary: #1e3a5f (Dark blue)
--secondary: #2d5a8c (Medium blue)
--accent: #00d4ff (Cyan)
--light-bg: #f8fafb (Off-white)
--card-bg: #ffffff (White)
```

## Future Backend Integration

### API Endpoints (To Be Implemented)

```
POST /api/analyze
├─ Request: { answers, description }
├─ Process: Cloud AI analysis
└─ Response: { recommendations, insights }

POST /api/users
├─ Request: { email, business_name }
├─ Process: Create user profile
└─ Response: { user_id, token }

GET /api/recommendations/:userId
├─ Process: Fetch user's past recommendations
└─ Response: { recommendations[] }

POST /api/email
├─ Request: { userId, email }
├─ Process: Send recommendations via email
└─ Response: { success, messageId }
```

### Database Schema (To Be Implemented)

**Users Collection:**
```javascript
{
  _id: ObjectId,
  email: string,
  businessName: string,
  createdAt: Date,
  lastAnalysis: Date
}
```

**Recommendations Collection:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  answers: Object,
  recommendations: Array,
  score: Number,
  createdAt: Date
}
```

**Analytics Collection:**
```javascript
{
  _id: ObjectId,
  toolId: string,
  userId: ObjectId,
  action: 'view' | 'click' | 'signup',
  timestamp: Date
}
```

## Performance Considerations

### Current (Frontend Only)
- Analysis runs client-side (~5-10ms)
- No API latency
- Instant recommendations

### Future (With Backend)
- Deferred cloud processing
- Caching for frequent queries
- Email delivery asynchronously
- Rate limiting for API endpoints

## Security Considerations

### Current
- No sensitive data stored
- Client-side only processing
- localStorage used for user data

### Future
- JWT token authentication
- CORS policies
- Input validation
- SQL injection prevention
- Rate limiting

## Browser Compatibility

Supports:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment Options

### Current (Static Frontend)
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting

### Future (Full Stack)
- Heroku
- AWS EC2 + RDS
- DigitalOcean
- Google Cloud Platform
- Azure App Service

## Development Workflow

```
Feature Branch
    ↓
Code Changes
    ↓
npm run build
    ↓
Manual Testing
    ↓
npm run test (future)
    ↓
Git Commit
    ↓
Push to GitHub
    ↓
Deploy to Production
```

## Version History

- **v1.0.0** - Initial release with React frontend
- **v1.1.0** (Planned) - Backend API integration
- **v2.0.0** (Planned) - Cloud AI analysis
- **v3.0.0** (Planned) - Mobile app version
