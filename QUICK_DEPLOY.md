# Quick Backend Deployment Guide (5-10 minutes)

## Option 1: Railway.app (RECOMMENDED - Fastest & Free)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Start Project"
3. Sign up with GitHub (recommended) or email
4. Verify email

### Step 2: Create New Project
1. Click "New Project"
2. Click "Deploy from GitHub"
3. Connect your GitHub account
4. Select `AI-business-advisor` repository
5. Select `backend` as root directory

### Step 3: Configure Environment Variables
In Railway Dashboard, go to **Variables** and add:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai_advisor
JWT_SECRET=your-super-secret-key-change-this-to-something-long-and-random
CLAUDE_API_KEY=sk-ant-YOUR_KEY_HERE
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
FRONTEND_URL=https://yourfrontend.vercel.app
```

**To get your MongoDB URI:**
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click "Connect"
3. Choose "Drivers"
4. Copy connection string
5. Replace `<password>` with your database user password
6. Replace `myFirstDatabase` with `ai_advisor`

### Step 4: Deploy
1. Railway automatically detects changes in GitHub
2. Wait for build to complete (usually 2-3 minutes)
3. Go to "Deployments" tab
4. You should see a green checkmark when complete
5. Click on deployment to see logs

### Step 5: Get Your Backend URL
1. Go to "Settings" in Railway
2. Find "Service Domains" section
3. Copy the generated URL (e.g., `https://ai-advisor-prod-abc123.railway.app`)
4. Your API will be at: `https://your-url/api`

---

## Option 2: Render.com (Free Alternative)

### Step 1: Create Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize the app

### Step 2: Create New Web Service
1. Click "New +"
2. Select "Web Service"
3. Connect to your GitHub repository
4. Select `AI-business-advisor` repo
5. Set build command: `npm install`
6. Set start command: `cd backend && npm start`

### Step 3: Set Environment Variables
Add the same variables as Railway (see above)

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (3-5 minutes)
3. Get your URL from the dashboard

---

## MongoDB Atlas Setup (Required for Both)

### Step 1: Create Cluster
1. Go to https://cloud.mongodb.com
2. Log in to your account
3. Click "Create" → "Cluster"
4. Choose "Free" tier
5. Select region closest to you
6. Click "Create Cluster" (wait 5 minutes)

### Step 2: Create Database User
1. Go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Create username: `admin`
4. Create strong password (write it down!)
5. Click "Add User"

### Step 3: Create Database
1. Go to "Databases"
2. Click "Browse Collections"
3. Click "Create Database"
4. Database name: `ai_advisor`
5. Collection name: `users`
6. Click "Create"

### Step 4: Get Connection String
1. Click "Connect" on your cluster
2. Click "Drivers"
3. Copy the connection string
4. It will look like: `mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
5. Replace `PASSWORD` with your actual password
6. Replace `retryWrites=true&w=majority` with just the database name and query params

**Final format:**
```
mongodb+srv://admin:your-password@cluster0.xxxxx.mongodb.net/ai_advisor?retryWrites=true&w=majority
```

### Step 5: Seed Database (Optional but Recommended)
Once your backend is deployed and connected to MongoDB:

```bash
curl -X POST https://your-backend-url/api/seed
```

Or run locally:
```bash
cd backend
npm run seed
```

---

## Testing Your Deployment

### Check if Backend is Running
```bash
curl https://your-backend-url/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "environment": "production"
}
```

### Test API Endpoint
```bash
curl -X POST https://your-backend-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "businessName": "Test Business",
    "businessType": "saas"
  }'
```

---

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment type | `production` |
| PORT | Server port | `5000` |
| MONGODB_URI | Database connection | `mongodb+srv://...` |
| JWT_SECRET | Auth token secret | Long random string |
| CLAUDE_API_KEY | Claude API key | `sk-ant-...` |
| OPENAI_API_KEY | OpenAI API key | `sk-proj-...` |
| FRONTEND_URL | Your frontend domain | `https://...vercel.app` |

---

## Troubleshooting

### Build Failed
- Check logs in Railway/Render dashboard
- Ensure `package.json` exists in backend directory
- Make sure Node version is 18+

### Can't Connect to MongoDB
- Verify connection string is correct
- Check username and password
- Add your Railway IP to MongoDB whitelist
  - Go to MongoDB > Security > Network Access
  - Click "Add IP Address"
  - Select "Allow access from anywhere" (for testing)

### API Returns 500 Error
- Check logs: Click "Logs" in Railway dashboard
- Verify all environment variables are set
- Check MongoDB connection string

### Slow Response Time
- Free tier has limited resources
- Wait 1-2 minutes for container to warm up
- Consider upgrading to paid tier if needed

---

## Next Steps After Deployment

Once your backend is deployed:

1. ✅ **Copy your backend URL**
   - Example: `https://ai-advisor-prod-abc123.railway.app`

2. ⏳ **Deploy frontend** (we'll do Vercel next)
   - Update `REACT_APP_API_URL` with your backend URL

3. ⏳ **Seed database with technologies**
   - Run `npm run seed` or use endpoint

4. ⏳ **Set up monitoring** (later steps)
   - Error tracking
   - Performance monitoring
   - Uptime monitoring

5. ⏳ **Production checklist** (final steps)
   - Security hardening
   - CORS configuration
   - Rate limiting
   - Analytics setup

---

## Quick Verification Checklist

After deployment, verify:

- [ ] Backend URL is accessible
- [ ] `/health` endpoint returns success
- [ ] MongoDB connection works
- [ ] Environment variables are set
- [ ] No errors in logs
- [ ] Can register a test user
- [ ] JWT tokens are generated

---

**Time to Deploy: 5-10 minutes**
**Free Tier: Yes (Railway or Render)**
**No Credit Card Required: Yes**

Once deployment is done, let me know your backend URL and we'll move to:
1. MongoDB seeding
2. Frontend deployment to Vercel
3. Final production checklist
