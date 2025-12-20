// routes/skills.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    getUserSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    trackSkillPractice,
    getSkillRecommendations,
    getSkillStats
} = require('../controllers/skillController');

// All routes require authentication
router.use(auth);

// @route   GET /api/skills
// @desc    Get all skills for logged-in user
// @access  Private
router.get('/', getUserSkills);

// @route   GET /api/skills/stats
// @desc    Get skill statistics
// @access  Private
router.get('/stats', getSkillStats);

// @route   GET /api/skills/recommendations
// @desc    Get skill recommendations
// @access  Private
router.get('/recommendations', getSkillRecommendations);

// @route   POST /api/skills
// @desc    Add a new skill
// @access  Private
router.post('/', addSkill);

// @route   PUT /api/skills/:skillId
// @desc    Update a skill
// @access  Private
router.put('/:skillId', updateSkill);

// @route   DELETE /api/skills/:skillId
// @desc    Delete a skill
// @access  Private
router.delete('/:skillId', deleteSkill);

// @route   POST /api/skills/:skillId/practice
// @desc    Track skill practice session
// @access  Private
router.post('/:skillId/practice', trackSkillPractice);

module.exports = router;
