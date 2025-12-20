// routes/interview.js
const express = require('express');
const router = express.Router();
const {
    getUserSessions,
    getSession,
    createSession,
    addQuestionResponse,
    completeSession,
    deleteSession,
    getSessionStats,
    shareSession,
    addMentorFeedback,
    getInterviewQuestions,
    getRandomQuestion,
    createQuestion
} = require('../controllers/interviewController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Session CRUD operations
router.get('/', getUserSessions);
router.get('/stats', getSessionStats);
router.get('/:sessionId', getSession);
router.post('/', createSession);
router.delete('/:sessionId', deleteSession);

// Session actions
router.post('/:sessionId/responses', addQuestionResponse);
router.post('/:sessionId/complete', completeSession);
router.post('/:sessionId/share', shareSession);
router.post('/:sessionId/feedback', addMentorFeedback);

// Question routes
router.get('/questions/all', getInterviewQuestions);
router.get('/questions/random', getRandomQuestion);
router.post('/questions', createQuestion);

module.exports = router;
