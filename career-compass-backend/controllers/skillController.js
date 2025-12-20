// controllers/skillController.js
const User = require('../models/User');
const UserAnalytics = require('../models/UserAnalytics');

// @desc    Get all skills for a user
// @route   GET /api/skills
// @access  Private
exports.getUserSkills = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('skills');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Get analytics data for skills if available
        const analytics = await UserAnalytics.findOne({ userId: req.user._id });
        
        // Merge user skills with analytics progress
        const enrichedSkills = user.skills.map(skill => {
            const analyticsSkill = analytics?.skillsProgress?.find(
                s => s.skillName.toLowerCase() === skill.name.toLowerCase()
            );
            
            return {
                _id: skill._id,
                name: skill.name,
                level: skill.level,
                yearsOfExperience: skill.yearsOfExperience,
                progress: analyticsSkill?.progress || 0,
                practiceHours: analyticsSkill?.practiceHours || 0,
                lastPracticed: analyticsSkill?.lastPracticed || null,
                currentLevel: analyticsSkill?.currentLevel || skill.level
            };
        });

        res.json({
            success: true,
            count: enrichedSkills.length,
            skills: enrichedSkills
        });
    } catch (error) {
        console.error('Error fetching user skills:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch skills'
        });
    }
};

// @desc    Add a new skill
// @route   POST /api/skills
// @access  Private
exports.addSkill = async (req, res) => {
    try {
        const { name, level, yearsOfExperience } = req.body;

        // Validation
        if (!name || !level) {
            return res.status(400).json({
                success: false,
                error: 'Skill name and level are required'
            });
        }

        const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
        if (!validLevels.includes(level)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid skill level. Must be: Beginner, Intermediate, Advanced, or Expert'
            });
        }

        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Check if skill already exists
        const existingSkill = user.skills.find(
            s => s.name.toLowerCase() === name.toLowerCase()
        );

        if (existingSkill) {
            return res.status(400).json({
                success: false,
                error: 'Skill already exists. Use update endpoint to modify it.'
            });
        }

        // Add new skill
        const newSkill = {
            name,
            level,
            yearsOfExperience: yearsOfExperience || 0
        };

        user.skills.push(newSkill);
        await user.save();

        // Initialize skill in analytics
        let analytics = await UserAnalytics.findOne({ userId: req.user._id });
        if (!analytics) {
            analytics = new UserAnalytics({ userId: req.user._id });
        }

        // Calculate initial progress based on level
        const progressMap = {
            'Beginner': 25,
            'Intermediate': 50,
            'Advanced': 75,
            'Expert': 95
        };

        analytics.skillsProgress.push({
            skillName: name,
            currentLevel: level,
            progress: progressMap[level] || 0,
            practiceHours: 0,
            lastPracticed: new Date()
        });

        await analytics.save();

        // Award XP for adding a skill
        await analytics.addDailyActivity(new Date(), 'skillDevelopment', 10, 25);

        res.status(201).json({
            success: true,
            message: 'Skill added successfully',
            skill: user.skills[user.skills.length - 1]
        });
    } catch (error) {
        console.error('Error adding skill:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add skill'
        });
    }
};

// @desc    Update a skill
// @route   PUT /api/skills/:skillId
// @access  Private
exports.updateSkill = async (req, res) => {
    try {
        const { skillId } = req.params;
        const { name, level, yearsOfExperience } = req.body;

        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const skill = user.skills.id(skillId);
        
        if (!skill) {
            return res.status(404).json({
                success: false,
                error: 'Skill not found'
            });
        }

        // Update skill fields
        if (name) skill.name = name;
        if (level) {
            const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
            if (!validLevels.includes(level)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid skill level'
                });
            }
            skill.level = level;
        }
        if (yearsOfExperience !== undefined) {
            skill.yearsOfExperience = yearsOfExperience;
        }

        await user.save();

        // Update analytics if level changed
        if (level) {
            const analytics = await UserAnalytics.findOne({ userId: req.user._id });
            if (analytics) {
                const analyticsSkill = analytics.skillsProgress.find(
                    s => s.skillName.toLowerCase() === skill.name.toLowerCase()
                );
                
                if (analyticsSkill) {
                    analyticsSkill.currentLevel = level;
                    const progressMap = {
                        'Beginner': 25,
                        'Intermediate': 50,
                        'Advanced': 75,
                        'Expert': 95
                    };
                    analyticsSkill.progress = Math.max(analyticsSkill.progress, progressMap[level] || 0);
                    await analytics.save();
                }
            }
        }

        res.json({
            success: true,
            message: 'Skill updated successfully',
            skill
        });
    } catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update skill'
        });
    }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:skillId
// @access  Private
exports.deleteSkill = async (req, res) => {
    try {
        const { skillId } = req.params;

        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const skill = user.skills.id(skillId);
        
        if (!skill) {
            return res.status(404).json({
                success: false,
                error: 'Skill not found'
            });
        }

        const skillName = skill.name;
        skill.deleteOne();
        await user.save();

        // Remove from analytics
        const analytics = await UserAnalytics.findOne({ userId: req.user._id });
        if (analytics) {
            analytics.skillsProgress = analytics.skillsProgress.filter(
                s => s.skillName.toLowerCase() !== skillName.toLowerCase()
            );
            await analytics.save();
        }

        res.json({
            success: true,
            message: 'Skill deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete skill'
        });
    }
};

// @desc    Update skill progress (practice tracking)
// @route   POST /api/skills/:skillId/practice
// @access  Private
exports.trackSkillPractice = async (req, res) => {
    try {
        const { skillId } = req.params;
        const { timeSpent, progressIncrease } = req.body; // timeSpent in minutes

        if (!timeSpent || timeSpent <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Valid time spent is required'
            });
        }

        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const skill = user.skills.id(skillId);
        
        if (!skill) {
            return res.status(404).json({
                success: false,
                error: 'Skill not found'
            });
        }

        // Update analytics
        let analytics = await UserAnalytics.findOne({ userId: req.user._id });
        if (!analytics) {
            analytics = new UserAnalytics({ userId: req.user._id });
        }

        let analyticsSkill = analytics.skillsProgress.find(
            s => s.skillName.toLowerCase() === skill.name.toLowerCase()
        );

        if (!analyticsSkill) {
            // Create analytics entry if doesn't exist
            const progressMap = {
                'Beginner': 25,
                'Intermediate': 50,
                'Advanced': 75,
                'Expert': 95
            };
            
            analyticsSkill = {
                skillName: skill.name,
                currentLevel: skill.level,
                progress: progressMap[skill.level] || 0,
                practiceHours: 0,
                lastPracticed: new Date()
            };
            analytics.skillsProgress.push(analyticsSkill);
        }

        // Update practice data
        analyticsSkill.practiceHours = (analyticsSkill.practiceHours || 0) + (timeSpent / 60);
        analyticsSkill.lastPracticed = new Date();
        
        if (progressIncrease) {
            analyticsSkill.progress = Math.min(100, (analyticsSkill.progress || 0) + progressIncrease);
        }

        // Auto-level up based on progress
        if (analyticsSkill.progress >= 90 && analyticsSkill.currentLevel !== 'Expert') {
            const levelOrder = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
            const currentIndex = levelOrder.indexOf(analyticsSkill.currentLevel);
            if (currentIndex < levelOrder.length - 1) {
                analyticsSkill.currentLevel = levelOrder[currentIndex + 1];
                skill.level = analyticsSkill.currentLevel;
                await user.save();
            }
        }

        await analytics.save();

        // Award XP for practice
        const xpReward = Math.floor(timeSpent / 10) * 5; // 5 XP per 10 minutes
        await analytics.addDailyActivity(new Date(), 'skillDevelopment', timeSpent, xpReward);

        res.json({
            success: true,
            message: 'Practice tracked successfully',
            skill: {
                name: skill.name,
                level: skill.level,
                progress: analyticsSkill.progress,
                practiceHours: analyticsSkill.practiceHours,
                xpEarned: xpReward
            }
        });
    } catch (error) {
        console.error('Error tracking skill practice:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to track practice'
        });
    }
};

// @desc    Get skill recommendations based on goals and career path
// @route   GET /api/skills/recommendations
// @access  Private
exports.getSkillRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('skills roadmap');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const userSkillNames = user.skills.map(s => s.name.toLowerCase());
        
        // Common skill recommendations by category
        const recommendations = {
            frontend: [
                { name: 'React', category: 'Frontend', priority: 'high', reason: 'Most popular frontend framework' },
                { name: 'Vue.js', category: 'Frontend', priority: 'medium', reason: 'Growing in popularity' },
                { name: 'TypeScript', category: 'Frontend', priority: 'high', reason: 'Industry standard for large projects' },
                { name: 'Tailwind CSS', category: 'Frontend', priority: 'medium', reason: 'Modern CSS framework' },
                { name: 'Next.js', category: 'Frontend', priority: 'high', reason: 'React framework for production' }
            ],
            backend: [
                { name: 'Node.js', category: 'Backend', priority: 'high', reason: 'JavaScript runtime for backend' },
                { name: 'Express.js', category: 'Backend', priority: 'high', reason: 'Popular Node.js framework' },
                { name: 'MongoDB', category: 'Backend', priority: 'high', reason: 'NoSQL database' },
                { name: 'PostgreSQL', category: 'Backend', priority: 'medium', reason: 'Relational database' },
                { name: 'GraphQL', category: 'Backend', priority: 'medium', reason: 'Modern API standard' }
            ],
            devops: [
                { name: 'Docker', category: 'DevOps', priority: 'high', reason: 'Containerization standard' },
                { name: 'Kubernetes', category: 'DevOps', priority: 'medium', reason: 'Container orchestration' },
                { name: 'AWS', category: 'DevOps', priority: 'high', reason: 'Leading cloud platform' },
                { name: 'CI/CD', category: 'DevOps', priority: 'high', reason: 'Automated deployment' },
                { name: 'Git', category: 'DevOps', priority: 'high', reason: 'Version control essential' }
            ],
            general: [
                { name: 'JavaScript', category: 'Programming', priority: 'high', reason: 'Essential web language' },
                { name: 'Python', category: 'Programming', priority: 'high', reason: 'Versatile and in-demand' },
                { name: 'SQL', category: 'Database', priority: 'high', reason: 'Database query language' },
                { name: 'REST APIs', category: 'Backend', priority: 'high', reason: 'API design standard' },
                { name: 'Testing', category: 'Quality', priority: 'medium', reason: 'Code quality essential' }
            ]
        };

        // Filter out skills user already has
        const filteredRecommendations = [];
        Object.values(recommendations).forEach(category => {
            category.forEach(skill => {
                if (!userSkillNames.includes(skill.name.toLowerCase())) {
                    filteredRecommendations.push(skill);
                }
            });
        });

        // Sort by priority
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        filteredRecommendations.sort((a, b) => 
            priorityOrder[a.priority] - priorityOrder[b.priority]
        );

        res.json({
            success: true,
            count: filteredRecommendations.length,
            recommendations: filteredRecommendations.slice(0, 10) // Top 10
        });
    } catch (error) {
        console.error('Error getting skill recommendations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get recommendations'
        });
    }
};

// @desc    Get skill statistics
// @route   GET /api/skills/stats
// @access  Private
exports.getSkillStats = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('skills');
        const analytics = await UserAnalytics.findOne({ userId: req.user._id });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Calculate statistics
        const totalSkills = user.skills.length;
        const skillsByLevel = {
            Beginner: user.skills.filter(s => s.level === 'Beginner').length,
            Intermediate: user.skills.filter(s => s.level === 'Intermediate').length,
            Advanced: user.skills.filter(s => s.level === 'Advanced').length,
            Expert: user.skills.filter(s => s.level === 'Expert').length
        };

        const totalPracticeHours = analytics?.skillsProgress?.reduce(
            (sum, skill) => sum + (skill.practiceHours || 0), 0
        ) || 0;

        const averageProgress = analytics?.skillsProgress?.length > 0
            ? analytics.skillsProgress.reduce((sum, skill) => sum + skill.progress, 0) / analytics.skillsProgress.length
            : 0;

        const recentlyPracticed = analytics?.skillsProgress
            ?.filter(s => s.lastPracticed)
            ?.sort((a, b) => new Date(b.lastPracticed) - new Date(a.lastPracticed))
            ?.slice(0, 5)
            ?.map(s => ({
                name: s.skillName,
                lastPracticed: s.lastPracticed,
                practiceHours: s.practiceHours
            })) || [];

        res.json({
            success: true,
            stats: {
                totalSkills,
                skillsByLevel,
                totalPracticeHours: Math.round(totalPracticeHours * 10) / 10,
                averageProgress: Math.round(averageProgress),
                recentlyPracticed
            }
        });
    } catch (error) {
        console.error('Error getting skill stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get skill statistics'
        });
    }
};
