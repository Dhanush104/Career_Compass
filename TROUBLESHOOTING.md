# 🔧 Troubleshooting Guide

## White Screen / Dashboard Crash

### Problem
Dashboard shows a white empty screen after integrating analytics.

### Root Cause
The analytics data was being accessed without proper null checking, causing JavaScript errors when:
- Analytics API hasn't loaded yet
- Analytics API returns no data
- User is new and has no analytics data

### Solution Applied ✅

**1. Added Optional Chaining (`?.`) for all analytics data access:**
```javascript
// Before (crashes if analyticsData is null/undefined)
{analyticsData.currentStreak}

// After (safe, returns 0 if data is missing)
{analyticsData?.currentStreak || 0}
```

**2. Added try-catch blocks for all API calls:**
```javascript
try {
    if (analyticsRes && analyticsRes.ok) {
        const analyticsJson = await analyticsRes.json();
        if (analyticsJson.success) {
            setAnalyticsData(analyticsJson.dashboard);
        }
    }
} catch (analyticsError) {
    console.warn('Analytics data not available:', analyticsError);
    // Continue without analytics - it's optional
}
```

**3. Made analytics section conditional:**
```javascript
{analyticsData && (
    <div className="analytics-section">
        {/* Only renders if data exists */}
    </div>
)}
```

---

## Common Issues & Solutions

### 1. Backend Not Running
**Symptoms:**
- White screen
- Network errors in console
- "Failed to fetch" errors

**Solution:**
```bash
cd career-compass-backend
npm run dev
```

**Check:** Backend should show:
```
🚀 Server running on port 5000
✅ MongoDB connected successfully!
```

---

### 2. MongoDB Connection Failed
**Symptoms:**
- Backend starts but crashes
- "MongoDB connection error" in logs
- Dashboard loads but no data

**Solution:**
```bash
# Test database connection
npm run test:db
```

**If fails:**
1. Check `.env` file has correct `MONGO_URI`
2. Verify MongoDB Atlas is accessible
3. Check IP whitelist in MongoDB Atlas
4. Verify credentials are correct

---

### 3. No Analytics Data Showing
**Symptoms:**
- Dashboard loads but analytics section is missing
- Empty analytics cards

**Why:** New users have no analytics data yet

**Solution:**
1. Use the app for a few minutes
2. Create some goals
3. Complete some activities
4. Refresh the page

**Or manually create analytics:**
```javascript
// The system will auto-create analytics when you:
// - Create goals
// - Complete tasks
// - Practice interviews
// - Solve coding challenges
```

---

### 4. Tasks/Deadlines Not Showing
**Symptoms:**
- "No tasks for today" message
- "No upcoming deadlines" message

**Why:** You haven't created any goals with deadlines

**Solution:**
1. Go to "Goal Tracker"
2. Click "Create Goal"
3. Set a deadline (within next 7 days for tasks)
4. Refresh dashboard

---

### 5. Leaderboard Empty
**Symptoms:**
- Leaderboard widget not showing
- No users in leaderboard

**Why:** Not enough users with XP in the system

**Solution:**
1. Use the app to earn XP
2. Complete goals, challenges, etc.
3. Wait for other users to join

---

### 6. Interview Questions Not Loading
**Symptoms:**
- Interview Prep shows no questions
- Empty question list

**Why:** Interview questions not seeded

**Solution:**
```bash
cd career-compass-backend
npm run seed:questions
```

---

### 7. Console Errors

#### Error: "Cannot read property 'currentStreak' of null"
**Fixed!** This was the white screen issue. Update to latest code.

#### Error: "Failed to fetch"
**Cause:** Backend not running or wrong URL

**Solution:**
1. Start backend: `npm run dev`
2. Check URL in frontend is `http://localhost:5000`

#### Error: "401 Unauthorized"
**Cause:** Token expired or invalid

**Solution:**
1. Logout and login again
2. Clear localStorage: `localStorage.clear()`
3. Refresh page

#### Error: "Network request failed"
**Cause:** CORS issue or backend not accessible

**Solution:**
1. Check backend CORS settings
2. Verify backend is running
3. Check firewall/antivirus

---

## Debugging Steps

### Step 1: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Note the error message

### Step 2: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for failed requests (red)
5. Click failed request to see details

### Step 3: Check Backend Logs
1. Look at terminal running backend
2. Check for error messages
3. Verify all API endpoints loaded

### Step 4: Test API Directly
```bash
# Test if backend is responding
curl http://localhost:5000/

# Test auth endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

---

## Prevention Checklist

Before reporting an issue, verify:

- [ ] Backend is running (`npm run dev`)
- [ ] Frontend is running (`npm run dev`)
- [ ] MongoDB is connected (check backend logs)
- [ ] You're logged in (check localStorage for token)
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls
- [ ] Data is seeded (`npm run seed` and `npm run seed:questions`)

---

## Quick Fixes

### Complete Reset
```bash
# Backend
cd career-compass-backend
rm -rf node_modules package-lock.json
npm install
npm run seed
npm run seed:questions
npm run dev

# Frontend (new terminal)
cd career-compass-frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Clear Browser Data
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear storage"
4. Click "Clear site data"
5. Refresh page

### Reset Database
```bash
cd career-compass-backend
npm run seed        # Reseed career paths and challenges
npm run seed:questions  # Reseed interview questions
```

---

## Still Having Issues?

### Collect Information
1. **Browser Console Errors:** Screenshot or copy error messages
2. **Network Tab:** Check which API calls are failing
3. **Backend Logs:** Copy relevant error messages
4. **Steps to Reproduce:** What actions cause the issue

### Check Documentation
- `QUICK_START.md` - Setup instructions
- `API_DOCUMENTATION.md` - API endpoint details
- `DYNAMIC_DATA_MIGRATION.md` - Data flow information
- `SETUP_COMPLETE.md` - Feature list

---

## Performance Tips

### Slow Dashboard Loading
1. **Reduce parallel API calls** - Already optimized
2. **Add loading skeletons** - Shows loading state
3. **Cache data** - Consider React Query
4. **Optimize images** - Compress assets

### High Memory Usage
1. **Close unused tabs**
2. **Clear browser cache**
3. **Restart browser**
4. **Check for memory leaks in DevTools**

---

## Environment-Specific Issues

### Development
- Hot reload may cause stale data
- Clear cache and hard refresh (Ctrl+Shift+R)

### Production
- Check environment variables
- Verify CORS settings
- Enable production mode
- Check SSL certificates

---

## Success Indicators

### Backend Healthy ✅
```
🚀 Server running on port 5000
✅ MongoDB connected successfully!
📋 Available API Endpoints: [list of endpoints]
```

### Frontend Healthy ✅
```
VITE ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Dashboard Working ✅
- User profile loads
- Stats cards show data
- Analytics section appears (if data exists)
- Tasks and deadlines load (if created)
- No console errors
- Smooth animations

---

## Contact & Support

If issues persist after trying these solutions:
1. Check GitHub issues
2. Review code comments
3. Check API documentation
4. Verify database schema

**Remember:** Most issues are due to:
- Backend not running
- Database not connected
- Missing data (not seeded)
- Expired authentication token

Always check these first! 🔍
