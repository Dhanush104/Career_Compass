# 🚀 Career Compass - Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

---

## 📦 Installation

### 1. Clone & Install Dependencies

```bash
# Navigate to backend
cd career-compass-backend
npm install

# Navigate to frontend (in another terminal)
cd career-compass-frontend
npm install
```

---

## 🗄️ Database Setup

### 1. Configure Environment Variables

Edit `career-compass-backend/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```

### 2. Test Database Connection
```bash
cd career-compass-backend
npm run test:db
```

**Expected Output:**
```
✅ Successfully connected to MongoDB!
✅ Connected to database: career_compass
✅ Found X collections
```

### 3. Seed Initial Data
```bash
# Seed career paths and coding challenges
npm run seed

# Seed interview questions
npm run seed:questions
```

---

## 🎯 Running the Application

### Terminal 1 - Backend
```bash
cd career-compass-backend
npm run dev
```

**Expected Output:**
```
🚀 Server running on port 5000
📍 Environment: development
✅ MongoDB connected successfully!

📋 Available API Endpoints:
   - Auth: /api/auth
   - Users: /api/users
   - Roadmap: /api/roadmap
   - Goals: /api/goals
   - Analytics: /api/analytics
   - Community: /api/community
   - Resumes: /api/resumes
   - Coding Challenges: /api/coding-challenges
   - Interviews: /api/interviews
   - Mentorship: /api/mentorship
   - Posts: /api/posts
   - Report Card: /api/report-card
```

### Terminal 2 - Frontend
```bash
cd career-compass-frontend
npm run dev
```

**Expected Output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🎨 First Time Setup

### 1. Register an Account
1. Open http://localhost:5173
2. Click "Register"
3. Fill in:
   - Username
   - Email
   - Password
4. Click "Create Account"

### 2. Complete Profile
1. Navigate to "My Profile"
2. Add:
   - Full Name
   - Skills
   - Bio
   - Social Links

### 3. Create Your First Goal
1. Go to "Goal Tracker"
2. Click "Create Goal"
3. Fill in:
   - Title: "Learn React"
   - Category: "Learning"
   - Priority: "High"
   - Deadline: (Pick a date)
   - Add milestones
4. Click "Create"

### 4. Explore Features
- **Dashboard:** See your progress and analytics
- **Roadmap:** Generate personalized learning path
- **Projects:** Add your portfolio projects
- **Interview Prep:** Practice interview questions
- **Coding Challenges:** Solve coding problems
- **Resume Builder:** Create professional resumes
- **Community:** Connect with others
- **Analytics:** Track your learning journey

---

## 📊 Key Features

### ✅ Fully Dynamic
- All data from MongoDB
- Real-time updates
- Personalized for each user
- No mock/fake data

### 🎯 Core Features
1. **Personalized Roadmaps** - AI-generated learning paths
2. **Goal Tracking** - Set and track career goals
3. **Interview Prep** - 20+ interview questions
4. **Coding Challenges** - Practice algorithms
5. **Resume Builder** - Multiple templates
6. **Analytics Dashboard** - Track progress
7. **Community** - Connect with peers
8. **Mentorship** - Find mentors

---

## 🔧 Troubleshooting

### Backend Won't Start
```bash
# Check if MongoDB is accessible
npm run test:db

# Check if port 5000 is available
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux
```

### Frontend Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if port 5173 is available
netstat -ano | findstr :5173  # Windows
lsof -i :5173                 # Mac/Linux
```

### Database Connection Failed
1. Check MONGO_URI in `.env`
2. Verify MongoDB Atlas IP whitelist
3. Check network connectivity
4. Verify credentials

### No Data Showing
```bash
# Reseed the database
cd career-compass-backend
npm run seed
npm run seed:questions
```

---

## 📚 API Documentation

Full API documentation available at:
`career-compass-backend/API_DOCUMENTATION.md`

### Quick API Test
```bash
# Test health endpoint
curl http://localhost:5000/

# Test auth (after registering)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"youruser","password":"yourpass"}'
```

---

## 🎓 Learning Path

### Week 1: Setup & Basics
- [x] Install and run application
- [ ] Create account and profile
- [ ] Create 3 goals
- [ ] Generate roadmap
- [ ] Add 2 projects

### Week 2: Practice & Build
- [ ] Complete 5 coding challenges
- [ ] Practice 10 interview questions
- [ ] Build resume
- [ ] Join a study group

### Week 3: Community & Growth
- [ ] Create community post
- [ ] Connect with 3 users
- [ ] Request mentorship
- [ ] Track analytics

---

## 🔐 Security Notes

### Production Deployment
Before deploying to production:

1. **Change JWT_SECRET** to a strong random string
2. **Enable HTTPS** for all connections
3. **Set NODE_ENV=production**
4. **Configure CORS** properly
5. **Enable rate limiting**
6. **Add input validation**
7. **Implement proper error logging**

### Environment Variables
Never commit `.env` file to version control!

---

## 📞 Support

### Issues?
1. Check `DYNAMIC_DATA_MIGRATION.md` for detailed info
2. Check `API_DOCUMENTATION.md` for API details
3. Check `SETUP_COMPLETE.md` for feature list

### Common Questions

**Q: Where is the data stored?**
A: All data is stored in MongoDB Atlas

**Q: Can I use local MongoDB?**
A: Yes, change MONGO_URI to `mongodb://localhost:27017/career_compass`

**Q: How do I reset the database?**
A: Run `npm run seed` to reseed all data

**Q: Can I add more interview questions?**
A: Yes, use POST `/api/interviews/questions` endpoint

---

## 🎉 You're All Set!

Your Career Compass application is now fully functional with:
- ✅ Complete backend API
- ✅ Dynamic frontend
- ✅ Database connectivity
- ✅ Real-time data
- ✅ User authentication
- ✅ All features working

**Start exploring and building your career journey!** 🚀

---

## 📈 Next Steps

1. **Customize:** Modify colors, themes, and layouts
2. **Extend:** Add new features and endpoints
3. **Deploy:** Host on Vercel (frontend) + Render (backend)
4. **Scale:** Add caching, CDN, and optimization
5. **Monetize:** Add premium features

**Happy Coding!** 💻✨
