// routes/projects.js
const express = require('express');
const router = express.Router();
const { addProject, getProjects } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, addProject);
router.get('/', authMiddleware, getProjects);

module.exports = router;