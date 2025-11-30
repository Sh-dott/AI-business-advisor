# Deployment Checklist: From Local to Production

**Current Status**: Phases 1-6 Complete ✓ | Phase 7 (Backend Deployment) - Ready to Start

This document guides you through deploying your AI Business Advisor to production in the correct order.

---

## 📋 Step-by-Step Deployment Path

### STEP 1: MongoDB Atlas Setup (5-10 minutes)
**File**: `MONGODB_SETUP.md`

**What to do**:
1. Go to MongoDB Atlas (you already have an account)
2. Create a free M0 Sandbox cluster
3. Create database user `admin` with strong password
4. Create database named `ai_advisor`
5. Generate connection string
6. Add IP to whitelist (0.0.0.0/0 for testing)

**Expected Output**: Connection string in format:
```
mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai_advisor?retryWrites=true&w=majority
```

**Save this string** - you'll need it in Step 2.

---

### STEP 2: Backend Deployment (5-10 minutes)
**File**: `QUICK_DEPLOY.md`

**What to do**:
1. Choose deployment platform:
   - **Railway.app** (Recommended - faster, easier GitHub integration)
   - **Render.com** (Alternative)

2. For Railway.app:
   - Create account at https://railway.app
   - Connect to your GitHub repository
   - Select `AI-business-advisor` repo
   - Set root directory to `backend`
   - Configure environment variables:
     ```
     NODE_ENV=production
     PORT=5000
     MONGODB_URI=(from Step 1)
     JWT_SECRET=(generate: openssl rand -base64 32)
     CLAUDE_API_KEY=(you'll get this later if needed)
     OPENAI_API_KEY=(you have this)
     FRONTEND_URL=(placeholder for now)
     ```
   - Deploy (automatic via GitHub)
   - Get your backend URL from Settings > Service Domains

**Expected Output**: Backend URL like:
```
https://ai-advisor-prod-abc123.railway.app
```

**Save this URL** - you'll need it in Step 4.

**Test your backend**:
```bash
curl https://your-backend-url/health
# Should return: {"success": true, "message": "Server is running", "environment": "production"}
```

---

### STEP 3: Seed Production Database (2 minutes)
**After backend is deployed**

**What to do**:
Call the seed endpoint to populate 50+ technologies:
```bash
curl -X POST https://your-backend-url/api/seed
```

**Expected Output**:
```
Connected to MongoDB
✓ Successfully seeded 50 technologies
Average rating: 4.2
```

**Verify in MongoDB Dashboard**:
- Go to MongoDB Atlas
- Click Collections on your cluster
- You should see `technologies` collection with 50 items

---

### STEP 4: Deploy Frontend (5 minutes)
**File**: `DEPLOYMENT.md` (Frontend Deployment section)

**What to do**:
1. Go to https://vercel.com/new
2. Select your GitHub repository
3. Configure:
   - Framework: React
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Environment Variable:
     ```
     REACT_APP_API_URL=https://your-backend-url/api
     ```
4. Deploy

**Expected Output**: Frontend URL like:
```
https://your-project-name.vercel.app
```

**Test your frontend**:
- Open the URL in browser
- You should see the AI Business Advisor interface
- Try the interactive quiz

---

### STEP 5: Final Production Checklist (10-15 minutes)

After both backend and frontend are deployed, complete these items:

#### Security
- [ ] Verify HTTPS is enabled on both backend and frontend
- [ ] Check CORS configuration (backend only allows frontend domain)
- [ ] Enable rate limiting on API endpoints
- [ ] Set up API key rotation schedule
- [ ] Enable database backups (MongoDB Atlas Settings > Backup & Restore)

#### Monitoring
- [ ] Set up error tracking (Sentry):
  ```bash
  npm install @sentry/node @sentry/tracing
  ```
  Add to `backend/server.js`:
  ```javascript
  const Sentry = require("@sentry/node");
  Sentry.init({ dsn: "your-sentry-dsn", tracesSampleRate: 1.0 });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());
  ```

- [ ] Set up uptime monitoring (UptimeRobot):
  - Monitor: `https://your-backend-url/health`
  - Alert email if down

- [ ] Enable performance monitoring:
  - Railway Dashboard: Check metrics tab
  - MongoDB Atlas: Check Performance Advisor

#### Optimization
- [ ] Enable Gzip compression:
  ```bash
  npm install compression
  ```
  Add to `backend/server.js`:
  ```javascript
  const compression = require('compression');
  app.use(compression());
  ```

- [ ] Set up CDN for frontend (optional but recommended):
  - Vercel automatically uses Vercel Edge Network
  - For backend: Consider Cloudflare

#### Analytics
- [ ] Add Google Analytics to frontend (if desired)
- [ ] Set up basic user tracking
- [ ] Monitor API usage patterns

#### Compliance
- [ ] Add Terms of Service page
- [ ] Add Privacy Policy page
- [ ] Enable HTTPS everywhere (already done by Railway/Vercel)
- [ ] Configure backup retention policy

---

## ✅ Completion Checklist

Print this out and check off as you complete:

- [ ] **MongoDB Setup Complete**
  - Connection string saved: `mongodb+srv://admin:...`
  - Database `ai_advisor` created
  - Cluster has 50 technologies seeded

- [ ] **Backend Deployed**
  - Backend URL saved: `https://...`
  - Health endpoint responds
  - API endpoints working
  - Environment variables set correctly

- [ ] **Frontend Deployed**
  - Frontend URL saved: `https://...`
  - Application loads in browser
  - Can interact with quiz
  - Backend connectivity verified

- [ ] **Production Security**
  - CORS configured
  - HTTPS enabled
  - Rate limiting active
  - Database backups scheduled

- [ ] **Monitoring Active**
  - Error tracking enabled
  - Uptime monitoring enabled
  - Performance metrics available

---

## 🚀 Success Criteria

Your deployment is successful when:

1. **Backend**
   ```bash
   curl https://your-backend-url/health
   # Returns: {"success": true, "message": "Server is running"}
   ```

2. **Database**
   - MongoDB Atlas shows `technologies` collection with 50 items
   - Can see other collections in Atlas UI

3. **Frontend**
   - App loads at `https://your-frontend-url`
   - Quiz questions appear
   - Can input answers
   - Recommendations display from API

4. **Integration**
   - Frontend can call backend API
   - User can complete full flow: questions → analysis → recommendations
   - No CORS errors in browser console

---

## 🔧 Environment Variables Summary

### Backend (Railway/Render Dashboard)
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/ai_advisor?retryWrites=true&w=majority
JWT_SECRET=(strong random string)
CLAUDE_API_KEY=sk-ant-xxxxx (optional if not using Claude)
OPENAI_API_KEY=sk-proj-xxxxx (required)
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (Vercel Dashboard)
```
REACT_APP_API_URL=https://your-backend-url/api
REACT_APP_ENV=production
```

---

## 📞 Quick Reference

| Service | Account Status | Next Action |
|---------|---|---|
| MongoDB Atlas | ✓ You have account | Follow MONGODB_SETUP.md |
| Railway/Render | Create new | Follow QUICK_DEPLOY.md |
| Vercel | Create new | Follow DEPLOYMENT.md Step 4 |
| OpenAI API | ✓ You have key | Use in Step 2 |
| Claude API | ⚠ Optional | Get from console.anthropic.com if needed |

---

## 📝 Notes

- **Estimated Total Time**: 20-30 minutes for full deployment
- **Cost**: Completely FREE (all services have free tiers)
- **No credit card required** for any service
- **Auto-scaling**: Both Railway and Vercel auto-scale on free tier within limits
- **Database**: MongoDB Atlas free tier includes 512MB storage (plenty for 50+ technologies)

---

## ⚠️ Common Issues & Solutions

### "Connection refused" when testing backend
- Wait 2-3 minutes for backend container to fully start
- Check Railway/Render deployment logs for errors
- Verify environment variables are set correctly

### "Cannot connect to MongoDB"
- Verify connection string matches exactly (check password encoding)
- Confirm IP whitelist includes Railway server
- Test connection string locally first

### "CORS error" in frontend browser console
- Backend's CORS must allow your frontend domain
- Check `FRONTEND_URL` environment variable
- For testing: temporarily allow all origins in backend

### "API returns 500"
- Check Railway/Render logs for detailed error
- Verify all required environment variables are set
- Ensure MongoDB connection string is correct

---

**Last Updated**: December 1, 2025
**Status**: Ready for deployment
**Next Step**: Follow MONGODB_SETUP.md to begin
