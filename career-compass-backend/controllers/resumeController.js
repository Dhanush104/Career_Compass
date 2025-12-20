// controllers/resumeController.js
const Resume = require('../models/Resume');
const UserAnalytics = require('../models/UserAnalytics');

// Get all resumes for a user
exports.getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id })
            .sort({ updatedAt: -1 });
        
        res.json({ success: true, resumes });
    } catch (error) {
        console.error('Get resumes error:', error);
        res.status(500).json({ error: 'Failed to fetch resumes' });
    }
};

// Get a specific resume
exports.getResume = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
        
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        
        // Increment view count
        resume.viewCount += 1;
        await resume.save();
        
        res.json({ success: true, resume });
    } catch (error) {
        console.error('Get resume error:', error);
        res.status(500).json({ error: 'Failed to fetch resume' });
    }
};

// Create a new resume
exports.createResume = async (req, res) => {
    try {
        const { title, template, personalInfo, experience, education, skills, certifications, languages, projects, isDefault } = req.body;
        
        // If this is set as default, unset other defaults
        if (isDefault) {
            await Resume.updateMany(
                { userId: req.user._id, isDefault: true },
                { isDefault: false }
            );
        }
        
        const resume = new Resume({
            userId: req.user._id,
            title,
            template: template || 'modern',
            personalInfo,
            experience: experience || [],
            education: education || [],
            skills: skills || [],
            certifications: certifications || [],
            languages: languages || [],
            projects: projects || [],
            isDefault: isDefault || false
        });
        
        await resume.save();
        
        // Update analytics
        const analytics = await UserAnalytics.findOne({ userId: req.user._id });
        if (analytics) {
            await analytics.addDailyActivity(new Date(), 'resumeBuilding', 30, 50);
        }
        
        res.status(201).json({ success: true, resume });
    } catch (error) {
        console.error('Create resume error:', error);
        res.status(500).json({ error: 'Failed to create resume' });
    }
};

// Update a resume
exports.updateResume = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const updates = req.body;
        
        const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        
        // Create version before major update
        if (updates.experience || updates.education || updates.skills) {
            resume.createVersion();
        }
        
        // If setting as default, unset other defaults
        if (updates.isDefault) {
            await Resume.updateMany(
                { userId: req.user._id, isDefault: true, _id: { $ne: resumeId } },
                { isDefault: false }
            );
        }
        
        Object.assign(resume, updates);
        await resume.save();
        
        res.json({ success: true, resume });
    } catch (error) {
        console.error('Update resume error:', error);
        res.status(500).json({ error: 'Failed to update resume' });
    }
};

// Delete a resume
exports.deleteResume = async (req, res) => {
    try {
        const { resumeId } = req.params;
        
        const resume = await Resume.findOneAndDelete({ _id: resumeId, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        
        res.json({ success: true, message: 'Resume deleted successfully' });
    } catch (error) {
        console.error('Delete resume error:', error);
        res.status(500).json({ error: 'Failed to delete resume' });
    }
};

// Download resume (increment counter)
exports.downloadResume = async (req, res) => {
    try {
        const { resumeId } = req.params;
        
        const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        
        resume.downloadCount += 1;
        resume.lastDownloaded = new Date();
        await resume.save();
        
        res.json({ success: true, resume });
    } catch (error) {
        console.error('Download resume error:', error);
        res.status(500).json({ error: 'Failed to download resume' });
    }
};

// Get resume versions
exports.getResumeVersions = async (req, res) => {
    try {
        const { resumeId } = req.params;
        
        const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id })
            .select('previousVersions version title');
        
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        
        res.json({ 
            success: true, 
            currentVersion: resume.version,
            versions: resume.previousVersions 
        });
    } catch (error) {
        console.error('Get versions error:', error);
        res.status(500).json({ error: 'Failed to fetch versions' });
    }
};

// Share resume
exports.shareResume = async (req, res) => {
    try {
        const { resumeId } = req.params;
        
        const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        
        resume.shareCount += 1;
        resume.isPublic = true;
        await resume.save();
        
        res.json({ 
            success: true, 
            shareUrl: `/resumes/public/${resumeId}`,
            resume 
        });
    } catch (error) {
        console.error('Share resume error:', error);
        res.status(500).json({ error: 'Failed to share resume' });
    }
};
