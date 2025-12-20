// routes/resume.js
const express = require('express');
const router = express.Router();
const {
    getUserResumes,
    getResume,
    createResume,
    updateResume,
    deleteResume,
    downloadResume,
    getResumeVersions,
    shareResume
} = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Resume CRUD operations
router.get('/', getUserResumes);
router.get('/:resumeId', getResume);
router.post('/', createResume);
router.put('/:resumeId', updateResume);
router.delete('/:resumeId', deleteResume);

// Resume actions
router.post('/:resumeId/download', downloadResume);
router.get('/:resumeId/versions', getResumeVersions);
router.post('/:resumeId/share', shareResume);

module.exports = router;
