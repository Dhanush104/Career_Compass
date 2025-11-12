// routes/projects.js
const express = require('express');
const router = express.Router();
const { addProject, getProjects, deleteProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addProject);
router.get('/', authMiddleware, getProjects);
router.delete('/:projectId', authMiddleware, deleteProject);

module.exports = router;