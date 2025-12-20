// controllers/codingChallengeController.js
const CodingChallenge = require('../models/CodingChallenge');
const UserAnalytics = require('../models/UserAnalytics');

// Get all coding challenges
exports.getAllChallenges = async (req, res) => {
    try {
        const { difficulty, category, tag } = req.query;
        const filter = { isActive: true };
        
        if (difficulty) filter.difficulty = difficulty;
        if (category) filter.category = category;
        if (tag) filter.tags = tag;
        
        const challenges = await CodingChallenge.find(filter)
            .select('-testCases -editorial -submissions')
            .sort({ featured: -1, createdAt: -1 });
        
        res.json({ success: true, challenges });
    } catch (error) {
        console.error('Get challenges error:', error);
        res.status(500).json({ error: 'Failed to fetch challenges' });
    }
};

// Get a specific challenge
exports.getChallenge = async (req, res) => {
    try {
        const { challengeId } = req.params;
        
        const challenge = await CodingChallenge.findById(challengeId)
            .select('-testCases.expectedOutput -editorial.code');
        
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }
        
        res.json({ success: true, challenge });
    } catch (error) {
        console.error('Get challenge error:', error);
        res.status(500).json({ error: 'Failed to fetch challenge' });
    }
};

// Create a new challenge (admin only)
exports.createChallenge = async (req, res) => {
    try {
        const {
            title,
            description,
            difficulty,
            category,
            tags,
            timeLimit,
            points,
            hints,
            examples,
            testCases,
            companies,
            editorial
        } = req.body;
        
        const challenge = new CodingChallenge({
            title,
            description,
            difficulty,
            category,
            tags: tags || [],
            timeLimit: timeLimit || 30,
            points,
            hints: hints || [],
            examples: examples || [],
            testCases: testCases || [],
            companies: companies || [],
            editorial,
            createdBy: req.user._id
        });
        
        await challenge.save();
        
        res.status(201).json({ success: true, challenge });
    } catch (error) {
        console.error('Create challenge error:', error);
        res.status(500).json({ error: 'Failed to create challenge' });
    }
};

// Submit solution
exports.submitSolution = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const { code, language } = req.body;
        
        const challenge = await CodingChallenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }
        
        // In a real implementation, you would run the code against test cases
        // For now, we'll simulate the result
        const testCasesPassed = challenge.testCases.length;
        const totalTestCases = challenge.testCases.length;
        const status = testCasesPassed === totalTestCases ? 'accepted' : 'wrong_answer';
        
        const submission = {
            userId: req.user._id,
            code,
            language,
            status,
            runtime: Math.floor(Math.random() * 1000), // Simulated
            memory: Math.floor(Math.random() * 50000), // Simulated
            testCasesPassed,
            totalTestCases,
            score: status === 'accepted' ? challenge.points : 0,
            submittedAt: new Date()
        };
        
        await challenge.addSubmission(submission);
        
        // Update user analytics
        if (status === 'accepted') {
            const analytics = await UserAnalytics.findOne({ userId: req.user._id });
            if (analytics) {
                analytics.performanceMetrics.codingChallenges.totalSolved += 1;
                
                // Update difficulty breakdown
                if (challenge.difficulty === 'easy') {
                    analytics.performanceMetrics.codingChallenges.difficultyBreakdown.easy += 1;
                } else if (challenge.difficulty === 'medium') {
                    analytics.performanceMetrics.codingChallenges.difficultyBreakdown.medium += 1;
                } else if (challenge.difficulty === 'hard') {
                    analytics.performanceMetrics.codingChallenges.difficultyBreakdown.hard += 1;
                }
                
                // Award XP based on difficulty
                const xpReward = challenge.difficulty === 'hard' ? 150 : 
                                challenge.difficulty === 'medium' ? 100 : 50;
                
                await analytics.addDailyActivity(new Date(), 'codingChallenges', 45, xpReward);
                
                // Add achievement
                analytics.addAchievement(
                    `challenge_${challengeId}`,
                    `Solved: ${challenge.title}`,
                    'coding',
                    'code',
                    xpReward
                );
            }
        }
        
        res.json({ 
            success: true, 
            submission,
            message: status === 'accepted' ? 'Solution accepted!' : 'Some test cases failed'
        });
    } catch (error) {
        console.error('Submit solution error:', error);
        res.status(500).json({ error: 'Failed to submit solution' });
    }
};

// Get user submissions for a challenge
exports.getUserSubmissions = async (req, res) => {
    try {
        const { challengeId } = req.params;
        
        const challenge = await CodingChallenge.findById(challengeId)
            .select('submissions');
        
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }
        
        const userSubmissions = challenge.submissions
            .filter(sub => sub.userId.toString() === req.user._id.toString())
            .sort((a, b) => b.submittedAt - a.submittedAt);
        
        res.json({ success: true, submissions: userSubmissions });
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
};

// Get editorial (only after solving)
exports.getEditorial = async (req, res) => {
    try {
        const { challengeId } = req.params;
        
        const challenge = await CodingChallenge.findById(challengeId)
            .select('editorial submissions');
        
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }
        
        // Check if user has solved the challenge
        const hasSolved = challenge.submissions.some(
            sub => sub.userId.toString() === req.user._id.toString() && 
                   sub.status === 'accepted'
        );
        
        if (!hasSolved) {
            return res.status(403).json({ 
                error: 'You must solve the challenge first to view the editorial' 
            });
        }
        
        res.json({ success: true, editorial: challenge.editorial });
    } catch (error) {
        console.error('Get editorial error:', error);
        res.status(500).json({ error: 'Failed to fetch editorial' });
    }
};

// Like/unlike a challenge
exports.toggleChallengeLike = async (req, res) => {
    try {
        const { challengeId } = req.params;
        
        const challenge = await CodingChallenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }
        
        const likeIndex = challenge.likes.indexOf(req.user._id);
        if (likeIndex > -1) {
            challenge.likes.splice(likeIndex, 1);
        } else {
            challenge.likes.push(req.user._id);
            
            // Remove from dislikes if present
            const dislikeIndex = challenge.dislikes.indexOf(req.user._id);
            if (dislikeIndex > -1) {
                challenge.dislikes.splice(dislikeIndex, 1);
            }
        }
        
        await challenge.save();
        
        res.json({ 
            success: true, 
            likesCount: challenge.likes.length,
            isLiked: likeIndex === -1 
        });
    } catch (error) {
        console.error('Toggle like error:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
};

// Add discussion
exports.addDiscussion = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const { title, content } = req.body;
        
        const challenge = await CodingChallenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }
        
        challenge.discussions.push({
            userId: req.user._id,
            title,
            content,
            replies: [],
            createdAt: new Date()
        });
        
        await challenge.save();
        await challenge.populate('discussions.userId', 'username fullName profilePictureUrl');
        
        res.json({ success: true, discussions: challenge.discussions });
    } catch (error) {
        console.error('Add discussion error:', error);
        res.status(500).json({ error: 'Failed to add discussion' });
    }
};

// Get challenge statistics
exports.getChallengeStats = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const allChallenges = await CodingChallenge.find({ isActive: true });
        
        const userSubmissions = allChallenges.reduce((acc, challenge) => {
            const userSubs = challenge.submissions.filter(
                sub => sub.userId.toString() === userId.toString()
            );
            return acc.concat(userSubs);
        }, []);
        
        const solvedChallenges = new Set(
            userSubmissions
                .filter(sub => sub.status === 'accepted')
                .map(sub => sub.challengeId)
        ).size;
        
        const stats = {
            totalChallenges: allChallenges.length,
            solvedChallenges,
            totalSubmissions: userSubmissions.length,
            acceptedSubmissions: userSubmissions.filter(sub => sub.status === 'accepted').length,
            difficultyBreakdown: {
                easy: 0,
                medium: 0,
                hard: 0
            }
        };
        
        // Calculate difficulty breakdown
        allChallenges.forEach(challenge => {
            const hasSolved = challenge.submissions.some(
                sub => sub.userId.toString() === userId.toString() && 
                       sub.status === 'accepted'
            );
            
            if (hasSolved) {
                stats.difficultyBreakdown[challenge.difficulty] += 1;
            }
        });
        
        res.json({ success: true, stats });
    } catch (error) {
        console.error('Get challenge stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};
