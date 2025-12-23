---
description: Deploy Career Compass to production (Vercel + Render)
---

# Deploy Career Compass

This workflow guides you through deploying the Career Compass application to production.

## Prerequisites

Before starting, ensure you have:
- GitHub account
- Vercel account (sign up at vercel.com)
- Render account (sign up at render.com)
- MongoDB Atlas configured and accessible

---

## Step 1: Push Code to GitHub

If you haven't already pushed your code to GitHub:

```bash
cd "d:\career compass"
git init
git add .
git commit -m "Prepare for deployment"
```

Create a new repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/career-compass.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Render

1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: career-compass-backend
   - **Root Directory**: career-compass-backend
   - **Runtime**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Plan**: Free

5. Add Environment Variables (see DEPLOYMENT.md for full list):
   - NODE_ENV=production
   - PORT=10000
   - MONGO_URI=(your MongoDB connection string)
   - JWT_SECRET=(generate a secure random string)
   - GEMINI_API_KEY=(your Gemini API key)
   - CORS_ORIGIN=(will update after frontend deployment)

6. Click "Create Web Service"
7. **Copy your backend URL** (e.g., https://career-compass-backend.onrender.com)

---

## Step 3: Configure MongoDB Atlas

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

---

## Step 4: Create Frontend Environment File

Create `.env.production` in career-compass-frontend:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace with your actual Render backend URL from Step 2.

Commit this file:

```bash
cd "d:\career compass"
git add career-compass-frontend/.env.production
git commit -m "Add production environment"
git push
```

---

## Step 5: Deploy Frontend to Vercel

**Option A: Vercel CLI**

// turbo
```bash
npm install -g vercel
```

```bash
cd "d:\career compass\career-compass-frontend"
vercel login
vercel --prod
```

**Option B: Vercel Dashboard**

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: career-compass-frontend
   - **Build Command**: npm run build
   - **Output Directory**: dist

5. Add Environment Variable:
   - Key: VITE_API_URL
   - Value: (your Render backend URL)

6. Click "Deploy"
7. **Copy your frontend URL** (e.g., https://career-compass.vercel.app)

---

## Step 6: Update Backend CORS

1. Go to Render dashboard → Your backend service
2. Go to "Environment" tab
3. Update CORS_ORIGIN:
   ```
   CORS_ORIGIN=https://your-app.vercel.app,http://localhost:5173
   ```
4. Save (triggers automatic redeploy)

---

## Step 7: Verify Deployment

Test your deployed application:

1. Open your Vercel URL in browser
2. Register a new account
3. Login
4. Test features:
   - Dashboard
   - Goal Tracker
   - Resume Builder
   - AI Assistant

---

## Troubleshooting

**Frontend can't connect to backend:**
- Check CORS_ORIGIN in Render
- Verify VITE_API_URL in Vercel
- Check browser console for errors

**MongoDB connection failed:**
- Verify IP whitelist in MongoDB Atlas
- Check MONGO_URI in Render

**404 on page refresh:**
- Verify vercel.json exists in frontend directory

---

## 🎉 Deployment Complete!

Your app is now live at:
- Frontend: https://your-app.vercel.app
- Backend: https://your-backend.onrender.com

For detailed information, see DEPLOYMENT.md in the project root.
