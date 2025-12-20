// routes/ai.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getChatResponse } = require('../controllers/aiController');

// All routes require authentication
router.use(auth);

// @route   POST /api/ai/chat
// @desc    Get AI chat response
// @access  Private
router.post('/chat', getChatResponse);

module.exports = router;
