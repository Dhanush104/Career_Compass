const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const resumeController = require('../controllers/resumeController');

// All routes require authentication
router.use(auth);

// GET /api/resumes - Get all resumes for the user
router.get('/', resumeController.getResumes);

// GET /api/resumes/:id - Get a specific resume
router.get('/:id', resumeController.getResumeById);

// POST /api/resumes - Create a new resume
router.post('/', resumeController.createResume);

// PUT /api/resumes/:id - Update a resume
router.put('/:id', resumeController.updateResume);

// DELETE /api/resumes/:id - Delete a resume
router.delete('/:id', resumeController.deleteResume);

module.exports = router;
