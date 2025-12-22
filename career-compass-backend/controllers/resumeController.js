const Resume = require('../models/Resume');
const User = require('../models/User');

// Get all resumes for the authenticated user
exports.getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });

        res.json({
            success: true,
            resumes
        });
    } catch (error) {
        console.error('Get resumes error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch resumes'
        });
    }
};

// Get a single resume by ID
exports.getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
        }

        res.json({
            success: true,
            resume
        });
    } catch (error) {
        console.error('Get resume error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch resume'
        });
    }
};

// Create a new resume
exports.createResume = async (req, res) => {
    try {
        const resumeData = {
            userId: req.user._id,
            ...req.body
        };

        const resume = new Resume(resumeData);
        await resume.save();

        res.status(201).json({
            success: true,
            resume
        });
    } catch (error) {
        console.error('Create resume error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create resume'
        });
    }
};

// Update a resume
exports.updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!resume) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
        }

        res.json({
            success: true,
            resume
        });
    } catch (error) {
        console.error('Update resume error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update resume'
        });
    }
};

// Delete a resume
exports.deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!resume) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
        }

        res.json({
            success: true,
            message: 'Resume deleted successfully'
        });
    } catch (error) {
        console.error('Delete resume error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete resume'
        });
    }
};
