# MongoDB Atlas Setup (5 minutes)

## Step-by-Step Setup

### 1. Create MongoDB Account (if not done)
- Go to https://cloud.mongodb.com
- Click "Sign Up"
- Choose "Sign up with Email"
- Fill in details and create account
- Verify your email

### 2. Create a Cluster

1. After login, click **"Create"** → **"Cluster"**
2. Choose **"Free"** tier (M0 Sandbox)
3. Select your region (pick closest to you)
   - US East (N. Virginia) - recommended for most
   - Europe (Frankfurt, Ireland, etc.)
4. Click **"Create Cluster"**
5. ⏳ Wait 5-10 minutes for cluster to be ready

### 3. Create Database User

Once cluster is created:

1. Go to **"Security"** → **"Database Access"**
2. Click **"Add New Database User"**
3. **Authentication Method**: Select "Scram (recommended)"
4. **Username**: `admin`
5. **Password**: Create strong password
   - Example: `Secure@2024!RandomString123`
   - Write this down! You'll need it
6. **User Privileges**: Leave as "Atlas admin"
7. Click **"Add User"**

### 4. Create Database and Collections

1. Go to **"Databases"** section
2. Click your cluster
3. Click **"Collections"** tab
4. Click **"Create Database"**
   - Database name: `ai_advisor`
   - Collection name: `users`
5. Click **"Create"**

MongoDB will auto-create other collections when data is added.

### 5. Get Your Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Drivers"** option
3. Select **"Node.js"** from dropdown
4. Copy the connection string
5. It will look like:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Format Your Connection String

Replace placeholders:
- Replace `<password>` with your actual password
- Replace `/?retryWrites...` with `/ai_advisor?retryWrites=true&w=majority`

**Final format:**
```
mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai_advisor?retryWrites=true&w=majority
```

### 7. Add IP Whitelist

1. Go to **"Security"** → **"Network Access"**
2. Click **"Add IP Address"**
3. For development/testing: Select "Allow Access from Anywhere"
   - 0.0.0.0/0
4. Click **"Confirm"**

(For production, add specific IP addresses instead)

### 8. Test Connection (Local)

In your backend directory, create `.env` file:
```
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ai_advisor?retryWrites=true&w=majority
NODE_ENV=development
PORT=5000
JWT_SECRET=test-secret-key
CLAUDE_API_KEY=sk-ant-your-key
OPENAI_API_KEY=sk-proj-your-key
FRONTEND_URL=http://localhost:3000
```

Run seed script:
```bash
cd backend
npm install
npm run seed
```

You should see:
```
Connected to MongoDB
✓ Successfully seeded 50 technologies
Average rating: 4.2
```

---

## Verify in MongoDB Dashboard

1. Go to your cluster
2. Click **"Collections"**
3. You should see:
   - `users` (empty initially)
   - `analyses` (empty initially)
   - `technologies` (50 items)
   - `chatmessages` (empty initially)

---

## Common Issues & Solutions

### "Authentication failed"
- Check password is correct (no typos)
- Password might contain special characters that need URL encoding
- Try re-creating the database user

### "Cannot connect from this IP"
- Go to Network Access
- Add IP to whitelist (or use 0.0.0.0/0 for testing)

### "Database not found"
- Make sure database name in URI is `ai_advisor`
- Create database first before connecting

### "Connection timeout"
- Check network connection
- Verify MongoDB is running (for local)
- Check IP is whitelisted (for Atlas)

---

## Next: Prepare for Production Deployment

Once MongoDB is set up:

1. **Copy your connection string** with your actual password
2. **In Railway/Render**, add this as `MONGODB_URI` environment variable
3. **Add other variables** (CLAUDE_API_KEY, OPENAI_API_KEY, etc.)
4. **Deploy backend** to Railway/Render
5. **Run seed endpoint** after backend is deployed

---

## Optional: View Your Data

To view data in MongoDB:

1. Go to **"Collections"**
2. Click **"technologies"**
3. Click **"Browse Collections"**
4. You'll see all 50 technologies with their details

---

**Time to Complete: 5-10 minutes**
**Cost: FREE (F0 Sandbox Tier)**

Ready to deploy? Use the connection string in QUICK_DEPLOY.md!
