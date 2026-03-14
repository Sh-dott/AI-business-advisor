# 🚀 Railway.app Git Auto-Deploy Setup (5 Minutes)

## What This Does

Every time you push to GitHub → **Automatic deployment to Railway** ✅

No manual steps needed after setup!

---

## Step-by-Step Guide

### Step 1: Create Railway Account (1 min)
1. Go to: https://railway.app
2. Click "Start Project"
3. Sign up with **GitHub** (important!)
4. Authorize Railway to access your repos

### Step 2: Create New Railway Project (2 min)

**In Railway Dashboard:**
1. Click "New Project"
2. Click "Deploy from GitHub"
3. Select your GitHub account
4. **Find and select**: `AI-business-advisor`
5. Railway auto-detects the Node.js backend ✅

### Step 3: Add Environment Variables (2 min)

**In Railway Dashboard → Variables Tab:**

Add these 5 variables:

```
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=your-openai-api-key-here
JWT_SECRET=your-jwt-secret-here
FRONTEND_URL=https://sh-dott.github.io/AI-business-advisor
```

**Note**: Copy each one as you type them. Railway will show a green checkmark when saved.

### Step 4: First Deploy (2-3 min)

**In Railway:**
1. Click "Deploy" button
2. Watch the build logs
3. Shows green ✅ when complete (takes ~3 minutes)
4. Go to "Settings" → "Service Domains"
5. **Copy your backend URL**
   - Example: `https://ai-advisor-prod-abc123.railway.app`
6. **Save this URL!** You'll need it later.

### Step 5: Enable Git Auto-Deploy (Already Done!)

Railway **automatically** deploys when you push to GitHub!

---

## 🎯 How It Works

```
You push to GitHub
        ↓
Webhook triggers Railway
        ↓
Railway builds from latest code
        ↓
Tests run automatically
        ↓
Deploy to production ✅
        ↓
Users see new version instantly
```

---

## 🧪 Test Your Deployment

### Test 1: Check Backend is Running

```bash
curl https://your-railway-url/health
```

You should get:
```json
{
  "success": true,
  "message": "Server is running",
  "environment": "production"
}
```

### Test 2: Full System Test

1. Visit: https://sh-dott.github.io/AI-business-advisor
2. Answer the 6 business questions
3. Click "Get Recommendations"
4. System analyzes and recommends
5. Download your Word document ✅

---

## 📝 Making Changes Later

**To update your app:**

```bash
# 1. Make changes locally
# 2. Commit to GitHub
git add .
git commit -m "Update feature"
git push origin main

# That's it! Railway auto-deploys!
# Check deployment status at https://railway.app
```

---

## 🔄 How to Check Deployment Status

1. Go to: https://railway.app
2. Select your project
3. Click "Deployments" tab
4. See all deployments with status:
   - 🟢 Green = Success
   - 🔴 Red = Failed
   - 🟡 Yellow = In progress

---

## 📊 Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | App mode | `production` |
| `PORT` | Server port | `5000` |
| `OPENAI_API_KEY` | AI API key | Your key |
| `JWT_SECRET` | Auth secret | Long random string |
| `FRONTEND_URL` | CORS origin | Your GitHub Pages URL |

---

## ⚠️ Troubleshooting

### Build Failed
**Check**:
- Does `backend/package.json` exist?
- Does `backend/server.js` exist?
- Are environment variables set?
- Check Railway logs for error message

### Deploy Failed
**Check**:
- Logs in Railway dashboard
- Environment variables set correctly
- OPENAI_API_KEY is valid

### API Returns 500
**Check**:
- All environment variables are set
- OPENAI_API_KEY is correct
- Check Railway logs for specific error

### Can't Connect to Backend
**Check**:
- Wait 2-3 minutes for deploy
- Refresh Railway dashboard
- Check Service Domains URL
- Verify `/health` endpoint works

---

## 💰 Cost Tracking

Railway shows your usage:
1. Go to Railway dashboard
2. Click your project
3. Click "Billing"
4. Free tier includes:
   - 500 hours/month of compute
   - Enough for ~1,000 requests/day
   - No credit card required

---

## 🚀 Advanced: Custom Domain (Optional)

If you have your own domain:

1. Go to Railway → Project Settings
2. Find "Custom Domains"
3. Add your domain
4. Follow DNS instructions
5. Your backend at: `api.yourdomain.com`

---

## 📈 Your Architecture Now

```
GitHub Repository
    ↓ (push code)
Railway.app
    ↓ (auto-deploys)
Live API Server
    ↓ (serves requests)
Frontend at GitHub Pages
    ↓ (makes API calls)
Users get AI recommendations
    ↓
Download Word documents
```

---

## ✅ You're All Set!

From now on:
- ✅ Push code to GitHub
- ✅ Railway auto-deploys
- ✅ Users see new version
- ✅ No manual deployment needed

---

## 🎊 What You Have Now

**Frontend**:
- ✅ Live at GitHub Pages
- ✅ Auto-updates on push

**Backend**:
- ✅ Live at Railway
- ✅ Auto-deploys on push

**System**:
- ✅ Fully automated
- ✅ Production ready
- ✅ Zero cost

---

## 📚 Next Steps

1. **Update Frontend URL** (if needed)
   - Currently pointing to localhost
   - Update to your Railway URL

2. **Test Everything**
   - Visit frontend
   - Answer quiz
   - Download document

3. **Make First Change**
   - Edit a file
   - Push to GitHub
   - Watch auto-deploy

---

## 🎯 Summary

| Step | Time | Status |
|------|------|--------|
| Create account | 1 min | ✅ |
| Connect repo | 2 min | ✅ |
| Add variables | 2 min | ✅ |
| First deploy | 3 min | ✅ |
| **Total** | **8 min** | **✅ DONE** |

**Your backend is now deployed with automatic Git deployment!** 🚀

---

**Next**: Test your system and celebrate! 🎉

Visit: https://sh-dott.github.io/AI-business-advisor
