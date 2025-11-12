// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const scrapingController = require('../controllers/scrapingController');

// GET /api/users/me - Get the logged-in user's profile
router.get('/me', authMiddleware, getUserProfile);

// PUT /api/users/me - Update the logged-in user's profile
router.put('/me', authMiddleware, updateUserProfile);

router.post('/report-card/generate', authMiddleware, scrapingController.generateReportCard);

module.exports = router;