// routes/codingChallenge.js
const express = require('express');
const router = express.Router();
const {
    getAllChallenges,
    getChallenge,
    createChallenge,
    submitSolution,
    getUserSubmissions,
    getEditorial,
    toggleChallengeLike,
    addDiscussion,
    getChallengeStats
} = require('../controllers/codingChallengeController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Challenge operations
router.get('/', getAllChallenges);
router.get('/stats', getChallengeStats);
router.get('/:challengeId', getChallenge);
router.post('/', createChallenge); // Admin only in production

// Submission operations
router.post('/:challengeId/submit', submitSolution);
router.get('/:challengeId/submissions', getUserSubmissions);
router.get('/:challengeId/editorial', getEditorial);

// Social features
router.post('/:challengeId/like', toggleChallengeLike);
router.post('/:challengeId/discussions', addDiscussion);

module.exports = router;
