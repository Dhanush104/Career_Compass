// routes/goals.js
const express = require('express');
const router = express.Router();
const {
    getUserGoals,
    createGoal,
    updateGoal,
    updateMilestone,
    deleteGoal,
    getGoalStats,
    addGoalComment,
    toggleGoalLike
} = require('../controllers/goalController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Goal CRUD operations
router.get('/', getUserGoals);
router.post('/', createGoal);
router.put('/:goalId', updateGoal);
router.delete('/:goalId', deleteGoal);

// Milestone operations
router.put('/:goalId/milestones/:milestoneId', updateMilestone);

// Statistics
router.get('/stats', getGoalStats);

// Social features
router.post('/:goalId/comments', addGoalComment);
router.post('/:goalId/like', toggleGoalLike);

module.exports = router;
