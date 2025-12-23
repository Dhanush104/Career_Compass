# 🚀 Career Compass Deployment Guide

Complete step-by-step guide to deploy Career Compass to production.

---

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- MongoDB Atlas account (already configured)

---

## Part 1: Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

Your backend is already configured with `render.yaml`. The following files have been created:
- ✅ `render.yaml` - Render deployment configuration
- ✅ `.env.production.example` - Production environment template
- ✅ Updated `server.js` - CORS configuration for production

### Step 2: Push Code to GitHub

```bash
# Navigate to project root
cd "d:\career compass"

# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for deployment"

# Create GitHub repository and push
# (Create a new repository on GitHub first, then run:)
git remote add origin https://github.com/YOUR_USERNAME/career-compass.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `career-compass-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `career-compass-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://dhanushoff006:Dhanush006@career.1inrfej.mongodb.net/test?retryWrites=true&w=majority&appName=Career
   JWT_SECRET=a_super_secret_key_for_jwt_production_2024
   JWT_EXPIRES_IN=3h
   JWT_REFRESH_EXPIRES_IN=7d
   GEMINI_API_KEY=AIzaSyCZDJOApUATfjYQ09RYJ16r5lvZtP7Dj8w
   GEMINI_MODEL=gemini-2.5-flash
   CLAUDE_API_KEY=your-claude-api-key-here
   CLAUDE_MODEL=claude-3-5-sonnet-20241022
   CORS_ORIGIN=https://your-app.vercel.app
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   MAX_FILE_SIZE=5242880
   DB_NAME=test
   MAX_POOL_SIZE=10
   MIN_POOL_SIZE=2
   ```

6. **Click "Create Web Service"**

7. **Wait for deployment** (takes 2-5 minutes)

8. **Copy your backend URL** (e.g., `https://career-compass-backend.onrender.com`)

> [!IMPORTANT]
> **MongoDB Atlas IP Whitelist**: You need to allow Render's IP addresses in MongoDB Atlas:
> 1. Go to MongoDB Atlas → Network Access
> 2. Click "Add IP Address"
> 3. Click "Allow Access from Anywhere" (0.0.0.0/0) for simplicity, or add Render's specific IPs
> 4. Click "Confirm"

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

The following files have been created:
- ✅ `vercel.json` - Vercel configuration
- ✅ `src/config.js` - Centralized API configuration
- ✅ `.env.production.example` - Environment template

### Step 2: Create Production Environment File

Create `.env.production` in `career-compass-frontend`:

```bash
cd career-compass-frontend
```

Create file `.env.production` with:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace `your-backend-url.onrender.com` with your actual Render backend URL from Part 1, Step 8.

### Step 3: Update Frontend API Calls

You need to update all API calls to use the centralized config. I'll create a helper script for this.

### Step 4: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to frontend directory
cd career-compass-frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "Add New..." → "Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `career-compass-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables:**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com` (from Part 1)

6. **Click "Deploy"**

7. **Wait for deployment** (takes 1-3 minutes)

8. **Copy your frontend URL** (e.g., `https://career-compass.vercel.app`)

### Step 5: Update Backend CORS

Go back to Render dashboard:
1. Open your backend service
2. Go to "Environment" tab
3. Update `CORS_ORIGIN` variable to your Vercel URL:
   ```
   CORS_ORIGIN=https://your-app.vercel.app,http://localhost:5173
   ```
4. Save changes (this will trigger a redeploy)

---

## Part 3: Verification

### Test Backend
```bash
# Test health endpoint
curl https://your-backend-url.onrender.com/

# Should return: "API is running..."
```

### Test Frontend
1. Open your Vercel URL in browser
2. Try to register a new account
3. Login with the account
4. Navigate through different features:
   - Dashboard
   - Goal Tracker
   - Resume Builder
   - AI Assistant

### Common Issues

**Issue: Frontend can't connect to backend**
- Check CORS_ORIGIN in Render environment variables
- Verify VITE_API_URL in Vercel environment variables
- Check browser console for errors

**Issue: MongoDB connection failed**
- Verify IP whitelist in MongoDB Atlas
- Check MONGO_URI in Render environment variables

**Issue: 404 errors on page refresh**
- Verify `vercel.json` is in the frontend directory
- Check Vercel build logs

---

## Part 4: Post-Deployment Security

> [!CAUTION]
> **Security Recommendations**

1. **Rotate Credentials** (Important!)
   - Change MongoDB password in Atlas
   - Generate new JWT_SECRET
   - Update environment variables in Render

2. **Restrict MongoDB Access**
   - Instead of "Allow from Anywhere", add specific Render IPs
   - Enable MongoDB Atlas audit logs

3. **API Keys**
   - Get a Claude API key if you want full AI features
   - Consider rate limiting for API keys

4. **Environment Variables**
   - Never commit `.env` files to GitHub
   - Use `.env.example` files as templates
   - Rotate secrets regularly

---

## Deployment Checklist

- [ ] Backend deployed to Render
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Backend environment variables set
- [ ] Backend health check passes
- [ ] Frontend `.env.production` created
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set
- [ ] CORS updated with frontend URL
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard loads correctly
- [ ] API calls work from frontend
- [ ] Security credentials rotated

---

## Monitoring & Maintenance

### Render (Backend)
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Monitor logs in Render dashboard
- Set up health checks

### Vercel (Frontend)
- Automatic deployments on git push
- Preview deployments for pull requests
- Monitor analytics in Vercel dashboard
- Check build logs for errors

### MongoDB Atlas
- Monitor database usage
- Set up alerts for high usage
- Regular backups (automatic on Atlas)
- Review slow queries

---

## Upgrade to Paid Plans (Optional)

**Render ($7/month)**
- No sleep time
- Faster performance
- More resources

**Vercel (Free tier is generous)**
- Pro plan only needed for teams or high traffic

**MongoDB Atlas (Free tier: 512MB)**
- Upgrade when you exceed storage
- Shared clusters are fine for most apps

---

## Support & Troubleshooting

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments → View Logs
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

## 🎉 You're Live!

Your Career Compass application is now deployed and accessible worldwide!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com

**Next Steps:**
- Share your app with friends
- Add custom domain (optional)
- Monitor usage and performance
- Implement analytics
- Add more features!

**Happy Deploying! 🚀**
