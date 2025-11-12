// controllers/analyticsController.js
const UserAnalytics = require('../models/UserAnalytics');
const Goal = require('../models/Goal');
const InterviewSession = require('../models/InterviewSession');
const CodingChallenge = require('../models/CodingChallenge');

// Get user analytics dashboard
exports.getUserAnalytics = async (req, res) => {
    try {
        let analytics = await UserAnalytics.findOne({ userId: req.user._id });
        
        // Create analytics record if it doesn't exist
        if (!analytics) {
            analytics = new UserAnalytics({ userId: req.user._id });
            await analytics.save();
        }
        
        res.json({ success: true, analytics });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
};

// Update user activity
exports.trackActivity = async (req, res) => {
    try {
        const { activityType, timeSpent, metadata } = req.body;
        const userId = req.user._id;
        
        let analytics = await UserAnalytics.findOne({ userId });
        if (!analytics) {
            analytics = new UserAnalytics({ userId });
        }
        
        // Calculate XP based on activity type and time spent
        let xpEarned = 0;
        switch (activityType) {
            case 'interviewPractice':
                xpEarned = Math.floor(timeSpent / 5) * 10; // 10 XP per 5 minutes
                break;
            case 'codingChallenges':
                xpEarned = metadata?.solved ? 50 : 10; // 50 XP for solving, 10 for attempt
                break;
            case 'resumeBuilding':
                xpEarned = Math.floor(timeSpent / 10) * 15; // 15 XP per 10 minutes
                break;
            case 'goalTracking':
                xpEarned = metadata?.milestoneCompleted ? 25 : 5;
                break;
            default:
                xpEarned = Math.floor(timeSpent / 10) * 5; // 5 XP per 10 minutes
        }
        
        await analytics.addDailyActivity(new Date(), activityType, timeSpent, xpEarned);
        
        res.json({ success: true, xpEarned, newLevel: analytics.currentLevel });
    } catch (error) {
        console.error('Track activity error:', error);
        res.status(500).json({ error: 'Failed to track activity' });
    }
};

// Get activity history
exports.getActivityHistory = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const userId = req.user._id;
        
        const analytics = await UserAnalytics.findOne({ userId });
        if (!analytics) {
            return res.json({ success: true, activities: [] });
        }
        
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
        
        const recentActivities = analytics.dailyActivities
            .filter(activity => activity.date >= cutoffDate)
            .sort((a, b) => b.date - a.date);
        
        res.json({ success: true, activities: recentActivities });
    } catch (error) {
        console.error('Get activity history error:', error);
        res.status(500).json({ error: 'Failed to fetch activity history' });
    }
};

// Get skill progress
exports.getSkillProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const analytics = await UserAnalytics.findOne({ userId });
        if (!analytics) {
            return res.json({ success: true, skills: [] });
        }
        
        res.json({ success: true, skills: analytics.skillsProgress });
    } catch (error) {
        console.error('Get skill progress error:', error);
        res.status(500).json({ error: 'Failed to fetch skill progress' });
    }
};

// Update skill progress
exports.updateSkillProgress = async (req, res) => {
    try {
        const { skillName, category, practiceTime, milestone } = req.body;
        const userId = req.user._id;
        
        let analytics = await UserAnalytics.findOne({ userId });
        if (!analytics) {
            analytics = new UserAnalytics({ userId });
        }
        
        let skill = analytics.skillsProgress.find(s => s.skillName === skillName);
        if (!skill) {
            skill = {
                skillName,
                category,
                currentLevel: 'Beginner',
                progress: 0,
                practiceHours: 0,
                milestones: []
            };
            analytics.skillsProgress.push(skill);
        }
        
        // Update practice time
        if (practiceTime) {
            skill.practiceHours += practiceTime / 60; // convert minutes to hours
            skill.lastPracticed = new Date();
            
            // Update progress based on practice time
            const progressIncrease = Math.floor(practiceTime / 30) * 5; // 5% per 30 minutes
            skill.progress = Math.min(100, skill.progress + progressIncrease);
            
            // Level up logic
            if (skill.progress >= 100 && skill.currentLevel === 'Beginner') {
                skill.currentLevel = 'Intermediate';
                skill.progress = 0;
            } else if (skill.progress >= 100 && skill.currentLevel === 'Intermediate') {
                skill.currentLevel = 'Advanced';
                skill.progress = 0;
            } else if (skill.progress >= 100 && skill.currentLevel === 'Advanced') {
                skill.currentLevel = 'Expert';
                skill.progress = 100;
            }
        }
        
        // Add milestone if provided
        if (milestone) {
            skill.milestones.push({
                title: milestone,
                achievedAt: new Date(),
                xpEarned: 25
            });
            analytics.totalXP += 25;
        }
        
        await analytics.save();
        
        res.json({ success: true, skill });
    } catch (error) {
        console.error('Update skill progress error:', error);
        res.status(500).json({ error: 'Failed to update skill progress' });
    }
};

// Get achievements and badges
exports.getAchievements = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const analytics = await UserAnalytics.findOne({ userId });
        if (!analytics) {
            return res.json({ success: true, achievements: [], badges: [] });
        }
        
        res.json({ 
            success: true, 
            achievements: analytics.achievements,
            badges: analytics.badges 
        });
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ error: 'Failed to fetch achievements' });
    }
};

// Get comprehensive dashboard data
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Get analytics
        let analytics = await UserAnalytics.findOne({ userId });
        if (!analytics) {
            analytics = new UserAnalytics({ userId });
            await analytics.save();
        }
        
        // Get recent activity (last 7 days)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const recentActivity = analytics.dailyActivities
            .filter(activity => activity.date >= weekAgo)
            .sort((a, b) => b.date - a.date);
        
        // Get goal statistics
        const goalStats = await Goal.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: null,
                    totalGoals: { $sum: 1 },
                    completedGoals: { 
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } 
                    },
                    activeGoals: { 
                        $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } 
                    }
                }
            }
        ]);
        
        // Get interview session stats
        const interviewStats = await InterviewSession.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: null,
                    totalSessions: { $sum: 1 },
                    completedSessions: { 
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } 
                    },
                    averageRating: { $avg: '$averageRating' }
                }
            }
        ]);
        
        // Calculate streak and progress
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const todayActivity = analytics.dailyActivities.find(
            activity => activity.date.toDateString() === today.toDateString()
        );
        
        const dashboardData = {
            // User level and XP
            level: analytics.currentLevel,
            totalXP: analytics.totalXP,
            xpToNextLevel: analytics.xpToNextLevel,
            
            // Streaks and consistency
            currentStreak: analytics.currentStreak,
            longestStreak: analytics.longestStreak,
            todayActive: !!todayActivity,
            
            // Overall statistics
            totalTimeSpent: analytics.totalTimeSpent,
            totalSessions: analytics.totalSessions,
            totalActivitiesCompleted: analytics.totalActivitiesCompleted,
            
            // Goal progress
            goals: goalStats[0] || { totalGoals: 0, completedGoals: 0, activeGoals: 0 },
            
            // Interview progress
            interviews: interviewStats[0] || { totalSessions: 0, completedSessions: 0, averageRating: 0 },
            
            // Recent activity
            recentActivity: recentActivity.slice(0, 7),
            
            // Top skills
            topSkills: analytics.skillsProgress
                .sort((a, b) => b.practiceHours - a.practiceHours)
                .slice(0, 5),
            
            // Recent achievements
            recentAchievements: analytics.achievements
                .sort((a, b) => b.unlockedAt - a.unlockedAt)
                .slice(0, 3),
            
            // Performance insights
            performanceMetrics: analytics.performanceMetrics,
            
            // Learning insights
            learningInsights: analytics.learningInsights
        };
        
        res.json({ success: true, dashboard: dashboardData });
    } catch (error) {
        console.error('Get dashboard data error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
};

// Get leaderboard data
exports.getLeaderboard = async (req, res) => {
    try {
        const { type = 'xp', limit = 10 } = req.query;
        
        let sortField = 'totalXP';
        switch (type) {
            case 'level':
                sortField = 'currentLevel';
                break;
            case 'streak':
                sortField = 'currentStreak';
                break;
            case 'goals':
                sortField = 'performanceMetrics.goalTracking.completedGoals';
                break;
            case 'challenges':
                sortField = 'performanceMetrics.codingChallenges.totalSolved';
                break;
        }
        
        const leaderboard = await UserAnalytics.find({})
            .populate('userId', 'username fullName profilePictureUrl')
            .sort({ [sortField]: -1 })
            .limit(parseInt(limit));
        
        // Find current user's rank
        const currentUserAnalytics = await UserAnalytics.findOne({ userId: req.user._id });
        let currentUserRank = null;
        
        if (currentUserAnalytics) {
            const rank = await UserAnalytics.countDocuments({
                [sortField]: { $gt: currentUserAnalytics[sortField] }
            });
            currentUserRank = rank + 1;
        }
        
        res.json({ 
            success: true, 
            leaderboard,
            currentUserRank,
            type 
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};
