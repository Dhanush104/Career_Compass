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

        // If manually marked as completed, set progress to 100%
        if (updates.status === 'completed') {
            goal.progress = 100;
            // Optionally mark all milestones as completed? 
            // Let's keep it simple: Progress 100%, but milestones stay as is unless user checks them. 
            // Actually users prefer 100% progress bar visual.
        }

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

        // Calculate new progress
        const totalMilestones = goal.milestones.length;
        const completedMilestones = goal.milestones.filter(m => m.completed).length;
        // The current milestone change hasn't been saved to DB yet, so we need to account for it manually
        // But since we modified the document instance `goal` in memory (line 113 & 118), 
        // `goal.milestones` should reflect the change if we save it.
        // Actually, let's just save first (line 123) and then use the instance method to update progress if needed, 
        // OR better: do it before saving to avoid double save.

        // Mongoose document matches the in-memory changes
        const newCompletedCount = goal.milestones.filter(m => m.completed).length;
        goal.progress = totalMilestones === 0 ? 0 : Math.round((newCompletedCount / totalMilestones) * 100);

        // Auto-update status based on progress
        if (goal.progress === 100) {
            goal.status = 'completed';
        } else if (goal.status === 'completed' && goal.progress < 100) {
            goal.status = 'active';
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

// Get today's tasks (active goals with upcoming deadlines)
exports.getTodaysTasks = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        // Get active goals with deadlines in the next 7 days
        const tasks = await Goal.find({
            userId: userId,
            status: 'active',
            deadline: { $lte: nextWeek }
        })
            .sort({ deadline: 1 })
            .limit(5)
            .select('title progress deadline priority category');

        // Calculate time remaining and format tasks
        const formattedTasks = tasks.map(task => {
            const timeRemaining = task.deadline - today;
            const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

            let timeLabel;
            if (daysRemaining === 0) {
                timeLabel = 'Today';
            } else if (daysRemaining === 1) {
                timeLabel = 'Tomorrow';
            } else if (daysRemaining <= 7) {
                timeLabel = `${daysRemaining} days`;
            } else {
                timeLabel = 'Next week';
            }

            return {
                id: task._id,
                task: task.title,
                progress: task.progress,
                time: timeLabel,
                color: task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-blue-500' : 'bg-green-500',
                category: task.category
            };
        });

        res.json({ success: true, tasks: formattedTasks });
    } catch (error) {
        console.error('Get today\'s tasks error:', error);
        res.status(500).json({ error: 'Failed to fetch today\'s tasks' });
    }
};

// Get upcoming deadlines
exports.getUpcomingDeadlines = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setDate(nextMonth.getDate() + 30);

        const deadlines = await Goal.find({
            userId: userId,
            status: { $in: ['active', 'paused'] },
            deadline: { $gte: today, $lte: nextMonth }
        })
            .sort({ deadline: 1 })
            .limit(10)
            .select('title deadline priority status');

        const formattedDeadlines = deadlines.map(goal => {
            const timeRemaining = goal.deadline - today;
            const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

            let dateLabel;
            let urgent = false;

            if (daysRemaining === 0) {
                dateLabel = 'Today';
                urgent = true;
            } else if (daysRemaining === 1) {
                dateLabel = 'Tomorrow';
                urgent = true;
            } else if (daysRemaining <= 3) {
                dateLabel = `In ${daysRemaining} days`;
                urgent = true;
            } else if (daysRemaining <= 7) {
                dateLabel = `In ${daysRemaining} days`;
            } else {
                dateLabel = `In ${Math.ceil(daysRemaining / 7)} weeks`;
            }

            return {
                id: goal._id,
                title: goal.title,
                date: dateLabel,
                urgent: urgent,
                priority: goal.priority
            };
        });

        res.json({ success: true, deadlines: formattedDeadlines });
    } catch (error) {
        console.error('Get deadlines error:', error);
        res.status(500).json({ error: 'Failed to fetch deadlines' });
    }
};
