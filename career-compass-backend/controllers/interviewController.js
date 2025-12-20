// controllers/interviewController.js
const InterviewSession = require('../models/InterviewSession');
const UserAnalytics = require('../models/UserAnalytics');
const InterviewQuestion = require('../models/InterviewQuestion');

// Get all interview sessions for a user
exports.getUserSessions = async (req, res) => {
    try {
        const { status, category, sessionType } = req.query;
        const filter = { userId: req.user._id };
        
        if (status) filter.status = status;
        if (category) filter.category = category;
        if (sessionType) filter.sessionType = sessionType;
        
        const sessions = await InterviewSession.find(filter)
            .sort({ startedAt: -1 });
        
        res.json({ success: true, sessions });
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
};

// Get a specific session
exports.getSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const session = await InterviewSession.findOne({ 
            _id: sessionId, 
            userId: req.user._id 
        });
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        res.json({ success: true, session });
    } catch (error) {
        console.error('Get session error:', error);
        res.status(500).json({ error: 'Failed to fetch session' });
    }
};

// Create a new interview session
exports.createSession = async (req, res) => {
    try {
        const { sessionType, category, title, company, position } = req.body;
        
        const session = new InterviewSession({
            userId: req.user._id,
            sessionType: sessionType || 'practice',
            category,
            title,
            company,
            position,
            startedAt: new Date()
        });
        
        await session.save();
        
        res.status(201).json({ success: true, session });
    } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
};

// Add question response to session
exports.addQuestionResponse = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { questionId, question, category, difficulty, userAnswer, timeSpent, rating, feedback } = req.body;
        
        const session = await InterviewSession.findOne({ 
            _id: sessionId, 
            userId: req.user._id 
        });
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        if (session.status === 'completed') {
            return res.status(400).json({ error: 'Cannot add responses to completed session' });
        }
        
        const questionResponse = {
            questionId,
            question,
            category,
            difficulty,
            userAnswer,
            timeSpent,
            rating,
            feedback,
            answeredAt: new Date()
        };
        
        await session.addResponse(questionResponse);
        
        res.json({ success: true, session });
    } catch (error) {
        console.error('Add response error:', error);
        res.status(500).json({ error: 'Failed to add response' });
    }
};

// Complete interview session
exports.completeSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { aiAnalysis } = req.body;
        
        const session = await InterviewSession.findOne({ 
            _id: sessionId, 
            userId: req.user._id 
        });
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        if (session.status === 'completed') {
            return res.status(400).json({ error: 'Session already completed' });
        }
        
        if (aiAnalysis) {
            session.aiAnalysis = aiAnalysis;
        }
        
        await session.completeSession();
        
        // Update user analytics
        const analytics = await UserAnalytics.findOne({ userId: req.user._id });
        if (analytics) {
            analytics.performanceMetrics.interviewPractice.totalSessions += 1;
            
            // Update average rating
            const totalRating = analytics.performanceMetrics.interviewPractice.averageRating * 
                               (analytics.performanceMetrics.interviewPractice.totalSessions - 1);
            analytics.performanceMetrics.interviewPractice.averageRating = 
                (totalRating + session.averageRating) / 
                analytics.performanceMetrics.interviewPractice.totalSessions;
            
            // Award XP based on session performance
            const xpReward = Math.round(session.averageRating * 30);
            await analytics.addDailyActivity(new Date(), 'interviewPractice', session.duration, xpReward);
            
            // Add achievement for completing sessions
            if (analytics.performanceMetrics.interviewPractice.totalSessions === 10) {
                analytics.addAchievement(
                    'interview_10_sessions',
                    'Completed 10 Interview Sessions',
                    'interview',
                    'briefcase',
                    200
                );
            }
            
            await analytics.save();
        }
        
        res.json({ success: true, session });
    } catch (error) {
        console.error('Complete session error:', error);
        res.status(500).json({ error: 'Failed to complete session' });
    }
};

// Delete session
exports.deleteSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const session = await InterviewSession.findOneAndDelete({ 
            _id: sessionId, 
            userId: req.user._id 
        });
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        res.json({ success: true, message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Delete session error:', error);
        res.status(500).json({ error: 'Failed to delete session' });
    }
};

// Get session statistics
exports.getSessionStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const stats = await InterviewSession.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: null,
                    totalSessions: { $sum: 1 },
                    completedSessions: { 
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } 
                    },
                    averageRating: { $avg: '$averageRating' },
                    totalTimeSpent: { $sum: '$duration' },
                    totalQuestions: { $sum: '$totalQuestions' }
                }
            }
        ]);
        
        const categoryStats = await InterviewSession.aggregate([
            { $match: { userId: userId, status: 'completed' } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    averageRating: { $avg: '$averageRating' },
                    totalQuestions: { $sum: '$totalQuestions' }
                }
            }
        ]);
        
        res.json({ 
            success: true, 
            stats: stats[0] || {
                totalSessions: 0,
                completedSessions: 0,
                averageRating: 0,
                totalTimeSpent: 0,
                totalQuestions: 0
            },
            categoryStats 
        });
    } catch (error) {
        console.error('Get session stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

// Share session
exports.shareSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { sharedWith } = req.body; // Array of user IDs
        
        const session = await InterviewSession.findOne({ 
            _id: sessionId, 
            userId: req.user._id 
        });
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        session.isPublic = true;
        if (sharedWith && Array.isArray(sharedWith)) {
            session.sharedWith = sharedWith;
        }
        
        await session.save();
        
        res.json({ 
            success: true, 
            message: 'Session shared successfully',
            session 
        });
    } catch (error) {
        console.error('Share session error:', error);
        res.status(500).json({ error: 'Failed to share session' });
    }
};

// Add mentor feedback
exports.addMentorFeedback = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { feedback, rating } = req.body;
        
        const session = await InterviewSession.findById(sessionId);
        
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        
        // Check if session is shared with this user or is public
        const canProvideFeedback = session.isPublic || 
            session.sharedWith.some(id => id.toString() === req.user._id.toString());
        
        if (!canProvideFeedback && session.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to provide feedback' });
        }
        
        session.mentorFeedback.push({
            mentorId: req.user._id,
            feedback,
            rating,
            createdAt: new Date()
        });
        
        await session.save();
        await session.populate('mentorFeedback.mentorId', 'username fullName profilePictureUrl');
        
        res.json({ success: true, session });
    } catch (error) {
        console.error('Add mentor feedback error:', error);
        res.status(500).json({ error: 'Failed to add feedback' });
    }
};

// ==================== INTERVIEW QUESTIONS ====================

// Get interview questions
exports.getInterviewQuestions = async (req, res) => {
    try {
        const { category, difficulty, limit = 50 } = req.query;
        const filter = { isActive: true };
        
        if (category) filter.category = category;
        if (difficulty) filter.difficulty = difficulty;
        
        const questions = await InterviewQuestion.find(filter)
            .limit(parseInt(limit))
            .sort({ timesAsked: 1 }); // Prioritize less-asked questions
        
        res.json({ success: true, questions });
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
};

// Get random question for practice
exports.getRandomQuestion = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = { isActive: true };
        
        if (category) filter.category = category;
        
        const count = await InterviewQuestion.countDocuments(filter);
        const random = Math.floor(Math.random() * count);
        
        const question = await InterviewQuestion.findOne(filter).skip(random);
        
        if (!question) {
            return res.status(404).json({ error: 'No questions found' });
        }
        
        // Increment times asked
        question.timesAsked += 1;
        await question.save();
        
        res.json({ success: true, question });
    } catch (error) {
        console.error('Get random question error:', error);
        res.status(500).json({ error: 'Failed to fetch question' });
    }
};

// Create interview question (admin)
exports.createQuestion = async (req, res) => {
    try {
        const { question, category, subcategory, difficulty, tips, followUp, company, duration, topics } = req.body;
        
        const newQuestion = new InterviewQuestion({
            question,
            category,
            subcategory,
            difficulty,
            tips: tips || [],
            followUp,
            company,
            duration,
            topics: topics || [],
            createdBy: req.user._id
        });
        
        await newQuestion.save();
        
        res.status(201).json({ success: true, question: newQuestion });
    } catch (error) {
        console.error('Create question error:', error);
        res.status(500).json({ error: 'Failed to create question' });
    }
};
