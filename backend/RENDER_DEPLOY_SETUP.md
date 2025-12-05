# Render Deployment Setup Guide

## Quick Deploy Instructions

### One-Time Setup (Get Your Deploy Hook):

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Select your backend service**: `ai-business-advisor-backend`
3. **Go to Settings**
4. **Scroll to "Deploy Hook"** section
5. **Click "Create Deploy Hook"**
6. **Copy the URL** (looks like: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`)
7. **Save it securely** - you'll need this for automated deployments

### Manual Deploy (Right Now):

1. Go to https://dashboard.render.com/
2. Click `ai-business-advisor-backend`
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait 2-3 minutes for deployment to complete

### Automated Deploy (After Setup):

Once you have your deploy hook URL, save it in a `.env` file:

```bash
# In backend/.env
RENDER_DEPLOY_HOOK=https://api.render.com/deploy/srv-xxxxx?key=yyyyy
```

Then you can deploy with:
```bash
curl -X POST YOUR_DEPLOY_HOOK_URL
```

## Current Status

- ✅ Code pushed to GitHub (commit `a49b1812`)
- ❌ Backend needs manual deployment on Render.com
- Backend includes multilingual support + backwards compatibility

## What's New

Latest commits include:
1. **Multilingual document export** (English, Hebrew, Russian)
2. **Backwards compatibility** (works even with old backend)
3. **Enhanced error handling**

After deploying, test at: https://sh-dott.github.io/AI-business-advisor/
