// routes/roadmap.js

const express = require('express');
const router = express.Router();
const { getQuizQuestions, generateRoadmap, choosePath, updateTaskStatus } = require('../controllers/roadmapController');
const authMiddleware = require('../middleware/authMiddleware');

// Get quiz questions
router.get('/quiz', getQuizQuestions);

// Generate roadmap based on quiz answers
router.post('/generate', authMiddleware, generateRoadmap);

// NEW: Route for a user to select their official path
router.post('/choose', authMiddleware, choosePath);

// NEW: Route to update a task's completion status
router.patch('/task', authMiddleware, updateTaskStatus);

module.exports = router;