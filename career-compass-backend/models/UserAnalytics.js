// models/UserAnalytics.js
const mongoose = require('mongoose');

const dailyActivitySchema = new mongoose.Schema({
    date: { type: Date, required: true },
    sessionsCount: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 }, // in minutes
    activitiesCompleted: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    
    // Activity breakdown
    activities: {
        interviewPractice: { count: { type: Number, default: 0 }, time: { type: Number, default: 0 } },
        codingChallenges: { count: { type: Number, default: 0 }, time: { type: Number, default: 0 } },
        resumeBuilding: { count: { type: Number, default: 0 }, time: { type: Number, default: 0 } },
        goalTracking: { count: { type: Number, default: 0 }, time: { type: Number, default: 0 } },
        courseLearning: { count: { type: Number, default: 0 }, time: { type: Number, default: 0 } },
        networking: { count: { type: Number, default: 0 }, time: { type: Number, default: 0 } }
    }
});

const skillProgressSchema = new mongoose.Schema({
    skillName: { type: String, required: true },
    category: String,
    currentLevel: { 
        type: String, 
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Beginner' 
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    practiceHours: { type: Number, default: 0 },
    lastPracticed: Date,
    milestones: [{
        title: String,
        achievedAt: Date,
        xpEarned: Number
    }]
});

const achievementSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    category: String,
    icon: String,
    xpReward: { type: Number, default: 0 },
    rarity: { 
        type: String, 
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common' 
    },
    unlockedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    maxProgress: { type: Number, default: 1 }
});

const userAnalyticsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    
    // Overall statistics
    totalTimeSpent: { type: Number, default: 0 }, // in minutes
    totalSessions: { type: Number, default: 0 },
    totalActivitiesCompleted: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 }, // days
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: Date,
    
    // XP and Leveling
    totalXP: { type: Number, default: 0 },
    currentLevel: { type: Number, default: 1 },
    xpToNextLevel: { type: Number, default: 100 },
    
    // Daily activity tracking
    dailyActivities: [dailyActivitySchema],
    
    // Skill progression
    skillsProgress: [skillProgressSchema],
    
    // Achievements and badges
    achievements: [achievementSchema],
    badges: [{
        id: String,
        name: String,
        description: String,
        earnedAt: { type: Date, default: Date.now },
        category: String
    }],
    
    // Performance metrics
    performanceMetrics: {
        interviewPractice: {
            totalSessions: { type: Number, default: 0 },
            averageRating: { type: Number, default: 0 },
            improvementRate: { type: Number, default: 0 },
            strongCategories: [String],
            weakCategories: [String]
        },
        codingChallenges: {
            totalSolved: { type: Number, default: 0 },
            acceptanceRate: { type: Number, default: 0 },
            averageAttempts: { type: Number, default: 0 },
            strongTopics: [String],
            weakTopics: [String],
            difficultyBreakdown: {
                easy: { type: Number, default: 0 },
                medium: { type: Number, default: 0 },
                hard: { type: Number, default: 0 }
            }
        },
        goalTracking: {
            totalGoals: { type: Number, default: 0 },
            completedGoals: { type: Number, default: 0 },
            completionRate: { type: Number, default: 0 },
            averageCompletionTime: { type: Number, default: 0 } // in days
        }
    },
    
    // Social metrics
    socialMetrics: {
        profileViews: { type: Number, default: 0 },
        connectionsCount: { type: Number, default: 0 },
        mentorshipSessions: { type: Number, default: 0 },
        communityContributions: { type: Number, default: 0 },
        helpfulVotes: { type: Number, default: 0 }
    },
    
    // Learning preferences (AI insights)
    learningInsights: {
        preferredTimeOfDay: String,
        averageSessionLength: { type: Number, default: 0 },
        mostActiveDay: String,
        learningStyle: String,
        motivationFactors: [String],
        recommendedFocus: [String]
    }
}, { timestamps: true });

// Methods for updating analytics
userAnalyticsSchema.methods.addDailyActivity = function(date, activityType, timeSpent, xpEarned) {
    const dateStr = date.toDateString();
    let dailyActivity = this.dailyActivities.find(da => da.date.toDateString() === dateStr);
    
    if (!dailyActivity) {
        dailyActivity = {
            date: date,
            sessionsCount: 0,
            timeSpent: 0,
            activitiesCompleted: 0,
            xpEarned: 0,
            activities: {
                interviewPractice: { count: 0, time: 0 },
                codingChallenges: { count: 0, time: 0 },
                resumeBuilding: { count: 0, time: 0 },
                goalTracking: { count: 0, time: 0 },
                courseLearning: { count: 0, time: 0 },
                networking: { count: 0, time: 0 }
            }
        };
        this.dailyActivities.push(dailyActivity);
    }
    
    dailyActivity.sessionsCount += 1;
    dailyActivity.timeSpent += timeSpent;
    dailyActivity.activitiesCompleted += 1;
    dailyActivity.xpEarned += xpEarned;
    
    if (dailyActivity.activities[activityType]) {
        dailyActivity.activities[activityType].count += 1;
        dailyActivity.activities[activityType].time += timeSpent;
    }
    
    // Update overall stats
    this.totalTimeSpent += timeSpent;
    this.totalSessions += 1;
    this.totalActivitiesCompleted += 1;
    this.totalXP += xpEarned;
    this.lastActiveDate = date;
    
    // Update level
    this.updateLevel();
    
    // Update streak
    this.updateStreak(date);
    
    return this.save();
};

userAnalyticsSchema.methods.updateLevel = function() {
    const xpPerLevel = 100;
    const newLevel = Math.floor(this.totalXP / xpPerLevel) + 1;
    
    if (newLevel > this.currentLevel) {
        this.currentLevel = newLevel;
        // Award level up achievement
        this.addAchievement(`level_${newLevel}`, `Reached Level ${newLevel}`, 'progression', 'star', 50);
    }
    
    this.xpToNextLevel = (this.currentLevel * xpPerLevel) - this.totalXP;
};

userAnalyticsSchema.methods.updateStreak = function(date) {
    const today = new Date(date);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (!this.lastActiveDate) {
        this.currentStreak = 1;
    } else {
        const lastActive = new Date(this.lastActiveDate);
        const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
            this.currentStreak += 1;
        } else if (daysDiff > 1) {
            this.currentStreak = 1;
        }
    }
    
    if (this.currentStreak > this.longestStreak) {
        this.longestStreak = this.currentStreak;
    }
    
    // Award streak achievements
    if (this.currentStreak === 7) {
        this.addAchievement('week_streak', '7-Day Streak', 'consistency', 'fire', 100);
    } else if (this.currentStreak === 30) {
        this.addAchievement('month_streak', '30-Day Streak', 'consistency', 'fire', 500);
    }
};

userAnalyticsSchema.methods.addAchievement = function(id, title, category, icon, xpReward) {
    const existingAchievement = this.achievements.find(a => a.id === id);
    if (!existingAchievement) {
        this.achievements.push({
            id,
            title,
            category,
            icon,
            xpReward,
            unlockedAt: new Date()
        });
        this.totalXP += xpReward;
        this.updateLevel();
    }
};

const UserAnalytics = mongoose.model('UserAnalytics', userAnalyticsSchema);
module.exports = UserAnalytics;
