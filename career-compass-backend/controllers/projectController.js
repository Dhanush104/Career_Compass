// controllers/projectController.js
const User = require('../models/User');

exports.addProject = async (req, res) => {
    const { title, description, technologies, liveDemoUrl, sourceCodeUrl } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        const newProject = { title, description, technologies, liveDemoUrl, sourceCodeUrl };
        user.projects.push(newProject);
        
        await user.save();
        res.status(201).json({ success: true, projects: user.projects });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add project.' });
    }
};

exports.getProjects = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await User.findById(userId).select('projects');
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.status(200).json({ projects: user.projects });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects.' });
    }
};

exports.deleteProject = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        // Remove project from user's projects array
        user.projects = user.projects.filter(project => project._id.toString() !== projectId);
        
        await user.save();
        res.status(200).json({ success: true, projects: user.projects });
    } catch (err) {
        console.error('Delete project error:', err);
        res.status(500).json({ error: 'Failed to delete project.' });
    }
};