// routes/analytics.js
const express = require('express');
const router = express.Router();
const {
    getUserAnalytics,
    trackActivity,
    getActivityHistory,
    getSkillProgress,
    updateSkillProgress,
    getAchievements,
    getDashboardData,
    getLeaderboard
} = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Analytics dashboard
router.get('/dashboard', getDashboardData);
router.get('/', getUserAnalytics);

// Activity tracking
router.post('/activity', trackActivity);
router.get('/activity/history', getActivityHistory);

// Skill progress
router.get('/skills', getSkillProgress);
router.post('/skills', updateSkillProgress);

// Achievements and badges
router.get('/achievements', getAchievements);

// Leaderboard
router.get('/leaderboard', getLeaderboard);

module.exports = router;
