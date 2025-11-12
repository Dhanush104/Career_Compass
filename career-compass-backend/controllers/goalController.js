// controllers/goalController.js
const Goal = require('../models/Goal');
const UserAnalytics = require('../models/UserAnalytics');

// Get all goals for a user
exports.getUserGoals = async (req, res) => {
    try {
        const { status, category } = req.query;
        const filter = { userId: req.user._id };
        
        if (status) filter.status = status;
        if (category) filter.category = category;
        
        const goals = await Goal.find(filter)
            .populate('comments.userId', 'username fullName profilePictureUrl')
            .sort({ createdAt: -1 });
            
        res.json({ success: true, goals });
    } catch (error) {
        console.error('Get goals error:', error);
        res.status(500).json({ error: 'Failed to fetch goals' });
    }
};

// Create a new goal
exports.createGoal = async (req, res) => {
    try {
        const { title, description, category, priority, deadline, milestones, tags, isPublic } = req.body;
        
        const goal = new Goal({
            userId: req.user._id,
            title,
            description,
            category,
            priority,
            deadline,
            milestones: milestones || [],
            tags: tags || [],
            isPublic: isPublic || false
        });
        
        await goal.save();
        
        // Update user analytics
        const analytics = await UserAnalytics.findOne({ userId: req.user._id });
        if (analytics) {
            analytics.performanceMetrics.goalTracking.totalGoals += 1;
            await analytics.save();
        }
        
        res.status(201).json({ success: true, goal });
    } catch (error) {
        console.error('Create goal error:', error);
        res.status(500).json({ error: 'Failed to create goal' });
    }
};

// Update a goal
exports.updateGoal = async (req, res) => {
    try {
        const { goalId } = req.params;
        const updates = req.body;
        
        const goal = await Goal.findOne({ _id: goalId, userId: req.user._id });
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }
        
        // Track if goal is being completed
        const wasCompleted = goal.status === 'completed';
        const isNowCompleted = updates.status === 'completed';
        
        Object.assign(goal, updates);
        await goal.save();
        
        // Update analytics if goal was completed
        if (!wasCompleted && isNowCompleted) {
            const analytics = await UserAnalytics.findOne({ userId: req.user._id });
            if (analytics) {
                analytics.performanceMetrics.goalTracking.completedGoals += 1;
                analytics.performanceMetrics.goalTracking.completionRate = 
                    (analytics.performanceMetrics.goalTracking.completedGoals / 
                     analytics.performanceMetrics.goalTracking.totalGoals) * 100;
                
                // Award XP for goal completion
                const xpReward = goal.priority === 'high' ? 100 : goal.priority === 'medium' ? 75 : 50;
                await analytics.addDailyActivity(new Date(), 'goalTracking', 30, xpReward);
                
                // Add achievement
                analytics.addAchievement(`goal_completed_${goal.category}`, 
                    `Completed ${goal.category} Goal`, 'goals', 'target', xpReward);
            }
        }
        
        res.json({ success: true, goal });
    } catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({ error: 'Failed to update goal' });
    }
};

// Update milestone status
exports.updateMilestone = async (req, res) => {
    try {
        const { goalId, milestoneId } = req.params;
        const { completed } = req.body;
        
        const goal = await Goal.findOne({ _id: goalId, userId: req.user._id });
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }
        
        const milestone = goal.milestones.id(milestoneId);
        if (!milestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }
        
        milestone.completed = completed;
        if (completed) {
            milestone.completedAt = new Date();
        }
        
        await goal.save();
        
        // Update analytics for milestone completion
        if (completed) {
            const analytics = await UserAnalytics.findOne({ userId: req.user._id });
            if (analytics) {
                await analytics.addDailyActivity(new Date(), 'goalTracking', 10, 25);
            }
        }
        
        res.json({ success: true, goal });
    } catch (error) {
        console.error('Update milestone error:', error);
        res.status(500).json({ error: 'Failed to update milestone' });
    }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
    try {
        const { goalId } = req.params;
        
        const goal = await Goal.findOneAndDelete({ _id: goalId, userId: req.user._id });
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }
        
        // Update analytics
        const analytics = await UserAnalytics.findOne({ userId: req.user._id });
        if (analytics) {
            analytics.performanceMetrics.goalTracking.totalGoals = 
                Math.max(0, analytics.performanceMetrics.goalTracking.totalGoals - 1);
            await analytics.save();
        }
        
        res.json({ success: true, message: 'Goal deleted successfully' });
    } catch (error) {
        console.error('Delete goal error:', error);
        res.status(500).json({ error: 'Failed to delete goal' });
    }
};

// Get goal statistics
exports.getGoalStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const stats = await Goal.aggregate([
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
                    },
                    averageProgress: { $avg: '$progress' },
                    totalMilestones: { $sum: { $size: '$milestones' } },
                    completedMilestones: {
                        $sum: {
                            $size: {
                                $filter: {
                                    input: '$milestones',
                                    cond: { $eq: ['$$this.completed', true] }
                                }
                            }
                        }
                    }
                }
            }
        ]);
        
        const categoryStats = await Goal.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    completed: { 
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } 
                    },
                    averageProgress: { $avg: '$progress' }
                }
            }
        ]);
        
        res.json({ 
            success: true, 
            stats: stats[0] || {
                totalGoals: 0,
                completedGoals: 0,
                activeGoals: 0,
                averageProgress: 0,
                totalMilestones: 0,
                completedMilestones: 0
            },
            categoryStats 
        });
    } catch (error) {
        console.error('Get goal stats error:', error);
        res.status(500).json({ error: 'Failed to fetch goal statistics' });
    }
};

// Add comment to goal (social feature)
exports.addGoalComment = async (req, res) => {
    try {
        const { goalId } = req.params;
        const { text } = req.body;
        
        const goal = await Goal.findById(goalId);
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }
        
        if (!goal.isPublic) {
            return res.status(403).json({ error: 'Cannot comment on private goal' });
        }
        
        goal.comments.push({
            userId: req.user._id,
            text,
            createdAt: new Date()
        });
        
        await goal.save();
        await goal.populate('comments.userId', 'username fullName profilePictureUrl');
        
        res.json({ success: true, goal });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

// Like/unlike a goal
exports.toggleGoalLike = async (req, res) => {
    try {
        const { goalId } = req.params;
        
        const goal = await Goal.findById(goalId);
        if (!goal) {
            return res.status(404).json({ error: 'Goal not found' });
        }
        
        if (!goal.isPublic) {
            return res.status(403).json({ error: 'Cannot like private goal' });
        }
        
        const likeIndex = goal.likes.indexOf(req.user._id);
        if (likeIndex > -1) {
            goal.likes.splice(likeIndex, 1);
        } else {
            goal.likes.push(req.user._id);
        }
        
        await goal.save();
        
        res.json({ success: true, likesCount: goal.likes.length, isLiked: likeIndex === -1 });
    } catch (error) {
        console.error('Toggle like error:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
};
