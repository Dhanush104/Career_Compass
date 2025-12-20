# 📊 Sample Data Seeding Guide

## Overview
This guide explains how to populate your database with comprehensive sample data to make your dashboard look fully functional with realistic information.

---

## 🎯 What Gets Seeded

### 1. **Test User Account**
- **Email:** `test@example.com`
- **Password:** `test123`
- **Username:** `testuser`
- **Level:** 8
- **XP:** 3,250
- **Current Streak:** 7 days
- **Longest Streak:** 15 days

### 2. **Skills** (5 skills)
- React (Advanced, 85% progress, 45.5h practiced)
- JavaScript (Expert, 95% progress, 67.2h practiced)
- Node.js (Intermediate, 70% progress, 32.8h practiced)
- MongoDB (Intermediate, 65% progress, 28.5h practiced)
- Python (Beginner, 40% progress, 15.3h practiced)

### 3. **Projects** (3 projects)
- E-Commerce Platform (Completed)
- Task Management App (In Progress)
- Weather Dashboard (Completed)

### 4. **Goals** (7 goals)
- **Active Goals (5):**
  - Complete React Challenge (75% - Due in 2 days) 🔥
  - Master Data Structures (60% - Due in 5 days)
  - Build Portfolio Website (40% - Due in 10 days)
  - Learn System Design (30% - Due in 20 days)
  - Contribute to Open Source (20% - Due in 30 days)

- **Completed Goals (2):**
  - Prepare for FAANG Interview (100%)
  - Complete JavaScript Course (100%)

### 5. **Analytics Data**
- **Total Time Spent:** 40 hours (2,400 minutes)
- **Total Sessions:** 45
- **Total Activities:** 89 completed
- **Daily Activity:** Last 14 days with varying metrics
- **Performance Metrics:**
  - Goal completion rate: 28.57%
  - Coding challenges: 58/75 solved (77.33%)
  - Interview sessions: 10/12 completed (4.2 avg rating)

### 6. **Achievements** (4 unlocked)
- First Goal Completed (+50 XP)
- Week Streak (+100 XP)
- Coding Master (+200 XP)
- Interview Ready (+150 XP)

### 7. **Interview Sessions** (2 sessions)
- Technical Interview (Completed, 4/5 rating)
- Behavioral Interview (Completed, 5/5 rating)

### 8. **Learning Insights**
- Preferred Time: Morning
- Avg Session Length: 35 minutes
- Most Active Day: Tuesday
- Productivity Score: 82%

---

## 🚀 How to Seed Data

### Option 1: Seed Dashboard Data Only
```bash
cd career-compass-backend
npm run seed:dashboard
```

### Option 2: Seed Everything (Recommended)
```bash
cd career-compass-backend
npm run seed:all
```

This will seed:
1. Career paths and coding challenges
2. Interview questions
3. Dashboard data (user, goals, analytics, projects)

### Option 3: Individual Seeding
```bash
# Seed career paths and challenges
npm run seed

# Seed interview questions
npm run seed:questions

# Seed dashboard data
npm run seed:dashboard
```

---

## 📋 Expected Output

```
🌱 Starting Dashboard Data Seeding...

📡 Connecting to MongoDB...
✅ Connected to MongoDB

👤 Finding or creating test user...
✅ Test user created

🗑️  Clearing existing data for test user...
✅ Cleared existing data

🎯 Creating sample goals...
✅ Created 7 sample goals

📊 Creating user analytics data...
✅ Created user analytics data

💼 Creating interview sessions...
✅ Created 2 interview sessions

═══════════════════════════════════════════════════
🎉 DASHBOARD DATA SEEDING COMPLETED!
═══════════════════════════════════════════════════

📊 Summary:
   User: test@example.com
   Goals: 7 (2 completed, 5 active)
   Projects: 3
   Skills: 5
   Analytics: Complete with 14 days of activity
   Achievements: 4
   Interview Sessions: 2

🔑 Test User Credentials:
   Email: test@example.com
   Password: test123

✨ Your dashboard is now fully populated with sample data!
═══════════════════════════════════════════════════
```

---

## 🔐 Login with Test Account

### Frontend Login
1. Go to http://localhost:5173
2. Click "Login"
3. Enter credentials:
   - **Email:** `test@example.com`
   - **Password:** `test123`
4. Click "Login"

### What You'll See
- ✅ Fully populated dashboard
- ✅ Analytics with charts and graphs
- ✅ Recent activity timeline
- ✅ Active goals with progress bars
- ✅ Upcoming deadlines
- ✅ Skills with progress
- ✅ Achievements unlocked
- ✅ Projects showcase
- ✅ Leaderboard position
- ✅ Learning insights

---

## 📊 Dashboard Sections Populated

### Main Dashboard
1. **Welcome Header**
   - Level 8, 3,250 XP
   - 7-day streak
   - 3 projects

2. **Analytics Overview**
   - Current Streak: 7 days (Best: 15)
   - Goals: 2 completed, 5 active
   - Time Spent: 40 hours
   - Activities: 89 completed

3. **Recent Activity**
   - Last 5 days of activities
   - XP earned per day
   - Time spent tracking

4. **Top Skills**
   - React (Advanced, 85%)
   - JavaScript (Expert, 95%)
   - Node.js (Intermediate, 70%)
   - MongoDB (Intermediate, 65%)

5. **Recent Achievements**
   - Week Streak (+100 XP)
   - Coding Master (+200 XP)
   - Interview Ready (+150 XP)

6. **Today's Focus**
   - Complete React Challenge (75%)
   - Master Data Structures (60%)

7. **Upcoming Deadlines**
   - Submit Portfolio (Tomorrow) 🔥
   - Complete Course (In 3 days)
   - Interview Prep (Next week)

8. **Learning Insights**
   - Best time: Morning
   - Avg session: 35 min
   - Most active: Tuesday

---

## 🎨 Visual Features

### Progress Bars
- All goals show realistic progress (20%-100%)
- Color-coded by priority (red/blue/green)
- Animated on load

### Streak Display
- Fire icon with current streak
- Best streak comparison
- Daily activity tracking

### XP System
- Level 8 with 3,250 total XP
- Progress bar to next level
- XP earned per activity

### Skills Progress
- 5 skills with different levels
- Practice hours tracked
- Last practiced dates
- Progress percentages

---

## 🔄 Re-seeding Data

### Clear and Reseed
The seed script automatically:
1. Finds or creates test user
2. Clears existing data for that user
3. Creates fresh sample data

### Safe to Run Multiple Times
```bash
npm run seed:dashboard
```

This won't create duplicate users - it will update the existing test user's data.

---

## 🧪 Testing Scenarios

### Test Active Goals
1. Login with test account
2. Go to "Goal Tracker"
3. See 5 active goals with progress
4. Update progress on any goal
5. Mark a goal as complete

### Test Analytics
1. View main dashboard
2. Scroll to analytics section
3. See 14 days of activity data
4. Check skills progress
5. View achievements

### Test Deadlines
1. Check "Upcoming Deadlines" widget
2. See color-coded urgency
3. Goals due soon show in red
4. Future goals show in yellow

### Test Projects
1. Go to "My Projects"
2. See 3 sample projects
3. View project details
4. Add new project

---

## 📝 Data Structure

### Goals Include
- Title, description, category
- Priority (high/medium/low)
- Status (active/completed)
- Progress percentage
- Deadline dates
- Milestones with completion status

### Analytics Include
- Daily activity for 14 days
- Skills progress tracking
- Achievement system
- Performance metrics
- Learning insights
- Time tracking

### User Profile Includes
- Personal information
- Skills with experience levels
- Projects with technologies
- Level and XP system
- Streak tracking

---

## 🎯 API Endpoints Tested

All these endpoints will return data after seeding:

```bash
# User data
GET /api/users/me

# Goals
GET /api/goals
GET /api/goals/today
GET /api/goals/deadlines

# Analytics
GET /api/analytics/dashboard
GET /api/analytics/leaderboard

# Projects
GET /api/projects

# Interviews
GET /api/interviews
```

---

## 🔧 Troubleshooting

### Issue: User Already Exists
**Solution:** The script handles this automatically. It will find the existing user and update their data.

### Issue: MongoDB Connection Failed
**Solution:** 
1. Check `.env` file has correct `MONGO_URI`
2. Verify MongoDB Atlas is accessible
3. Run `npm run test:db` to verify connection

### Issue: No Data Showing in Dashboard
**Solution:**
1. Make sure you're logged in with test account
2. Check browser console for errors
3. Verify backend is running
4. Re-run seed script

### Issue: Seed Script Fails
**Solution:**
```bash
# Clear everything and start fresh
cd career-compass-backend
npm run seed:all
```

---

## 📚 Additional Seeds Available

### Career Paths & Challenges
```bash
npm run seed
```
Seeds:
- Full Stack Developer path
- Data Science path
- DevOps Engineer path
- 10+ coding challenges

### Interview Questions
```bash
npm run seed:questions
```
Seeds:
- 20+ interview questions
- Multiple categories
- Different difficulty levels

---

## ✨ Benefits

### For Development
- ✅ Instant realistic data
- ✅ Test all features immediately
- ✅ No manual data entry
- ✅ Consistent test environment

### For Demo/Presentation
- ✅ Professional looking dashboard
- ✅ Realistic user journey
- ✅ Complete feature showcase
- ✅ Impressive visual appeal

### For Testing
- ✅ Edge cases covered
- ✅ Various data states
- ✅ Performance testing
- ✅ UI/UX validation

---

## 🎉 Summary

After running the seed script, you'll have:
- ✅ 1 test user account
- ✅ 5 skills with progress
- ✅ 3 projects
- ✅ 7 goals (5 active, 2 completed)
- ✅ 14 days of analytics data
- ✅ 4 achievements
- ✅ 2 interview sessions
- ✅ Complete learning insights
- ✅ Fully functional dashboard

**Your Career Compass application will look production-ready!** 🚀

---

## 🔗 Next Steps

1. **Run the seed:**
   ```bash
   npm run seed:all
   ```

2. **Start the backend:**
   ```bash
   npm run dev
   ```

3. **Start the frontend:**
   ```bash
   cd ../career-compass-frontend
   npm run dev
   ```

4. **Login and explore:**
   - Email: `test@example.com`
   - Password: `test123`

**Enjoy your fully populated dashboard!** 🎊
