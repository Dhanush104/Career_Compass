// controllers/communityController.js
const { CommunityPost, MentorshipRequest, StudyGroup, NetworkingConnection } = require('../models/Community');
const UserAnalytics = require('../models/UserAnalytics');

// Community Posts
exports.getCommunityPosts = async (req, res) => {
    try {
        const { type, category, page = 1, limit = 10 } = req.query;
        const filter = { isApproved: true };
        
        if (type) filter.type = type;
        if (category) filter.category = category;
        
        const posts = await CommunityPost.find(filter)
            .populate('userId', 'username fullName profilePictureUrl')
            .populate('comments.userId', 'username fullName profilePictureUrl')
            .sort({ isPinned: -1, isFeatured: -1, createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await CommunityPost.countDocuments(filter);
        
        res.json({ 
            success: true, 
            posts, 
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total
            }
        });
    } catch (error) {
        console.error('Get community posts error:', error);
        res.status(500).json({ error: 'Failed to fetch community posts' });
    }
};

exports.createCommunityPost = async (req, res) => {
    try {
        const { title, content, type, category, tags, jobDetails, achievementData } = req.body;
        
        const post = new CommunityPost({
            userId: req.user._id,
            title,
            content,
            type,
            category,
            tags: tags || [],
            jobDetails,
            achievementData
        });
        
        await post.save();
        await post.populate('userId', 'username fullName profilePictureUrl');
        
        // Update user analytics
        const analytics = await UserAnalytics.findOne({ userId: req.user._id });
        if (analytics) {
            analytics.socialMetrics.communityContributions += 1;
            await analytics.addDailyActivity(new Date(), 'networking', 10, 15);
        }
        
        res.status(201).json({ success: true, post });
    } catch (error) {
        console.error('Create community post error:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        
        const post = await CommunityPost.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        post.comments.push({
            userId: req.user._id,
            content,
            createdAt: new Date()
        });
        
        await post.save();
        await post.populate('comments.userId', 'username fullName profilePictureUrl');
        
        res.json({ success: true, post });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        
        const post = await CommunityPost.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        const likeIndex = post.likes.indexOf(req.user._id);
        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(req.user._id);
        }
        
        await post.save();
        
        res.json({ success: true, likesCount: post.likes.length, isLiked: likeIndex === -1 });
    } catch (error) {
        console.error('Toggle like error:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
};

// Mentorship
exports.getMentorshipRequests = async (req, res) => {
    try {
        const { status, type = 'received' } = req.query;
        const filter = {};
        
        if (type === 'sent') {
            filter.menteeId = req.user._id;
        } else {
            filter.mentorId = req.user._id;
        }
        
        if (status) filter.status = status;
        
        const requests = await MentorshipRequest.find(filter)
            .populate('menteeId', 'username fullName profilePictureUrl')
            .populate('mentorId', 'username fullName profilePictureUrl')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, requests });
    } catch (error) {
        console.error('Get mentorship requests error:', error);
        res.status(500).json({ error: 'Failed to fetch mentorship requests' });
    }
};

exports.createMentorshipRequest = async (req, res) => {
    try {
        const { mentorId, title, description, category, duration, preferredTime } = req.body;
        
        // Check if request already exists
        const existingRequest = await MentorshipRequest.findOne({
            menteeId: req.user._id,
            mentorId,
            status: { $in: ['pending', 'accepted'] }
        });
        
        if (existingRequest) {
            return res.status(400).json({ error: 'Active mentorship request already exists' });
        }
        
        const request = new MentorshipRequest({
            menteeId: req.user._id,
            mentorId,
            title,
            description,
            category,
            duration,
            preferredTime
        });
        
        await request.save();
        await request.populate('menteeId mentorId', 'username fullName profilePictureUrl');
        
        res.status(201).json({ success: true, request });
    } catch (error) {
        console.error('Create mentorship request error:', error);
        res.status(500).json({ error: 'Failed to create mentorship request' });
    }
};

exports.respondToMentorshipRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, scheduledAt, message } = req.body;
        
        const request = await MentorshipRequest.findOne({
            _id: requestId,
            mentorId: req.user._id
        });
        
        if (!request) {
            return res.status(404).json({ error: 'Mentorship request not found' });
        }
        
        request.status = status;
        if (scheduledAt) request.scheduledAt = scheduledAt;
        if (message) {
            request.messages.push({
                senderId: req.user._id,
                content: message
            });
        }
        
        await request.save();
        
        // Update analytics for accepted mentorship
        if (status === 'accepted') {
            const analytics = await UserAnalytics.findOne({ userId: req.user._id });
            if (analytics) {
                analytics.socialMetrics.mentorshipSessions += 1;
                await analytics.addDailyActivity(new Date(), 'networking', 30, 50);
            }
        }
        
        res.json({ success: true, request });
    } catch (error) {
        console.error('Respond to mentorship request error:', error);
        res.status(500).json({ error: 'Failed to respond to mentorship request' });
    }
};

// Study Groups
exports.getStudyGroups = async (req, res) => {
    try {
        const { category, page = 1, limit = 10 } = req.query;
        const filter = {};
        
        if (category) filter.category = category;
        
        const groups = await StudyGroup.find(filter)
            .populate('createdBy', 'username fullName profilePictureUrl')
            .populate('members.userId', 'username fullName profilePictureUrl')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        res.json({ success: true, groups });
    } catch (error) {
        console.error('Get study groups error:', error);
        res.status(500).json({ error: 'Failed to fetch study groups' });
    }
};

exports.createStudyGroup = async (req, res) => {
    try {
        const { name, description, category, maxMembers, isPrivate, schedule } = req.body;
        
        const group = new StudyGroup({
            name,
            description,
            category,
            createdBy: req.user._id,
            maxMembers: maxMembers || 20,
            isPrivate: isPrivate || false,
            schedule,
            members: [{
                userId: req.user._id,
                role: 'admin',
                joinedAt: new Date()
            }],
            inviteCode: isPrivate ? Math.random().toString(36).substring(2, 15) : null
        });
        
        await group.save();
        await group.populate('createdBy members.userId', 'username fullName profilePictureUrl');
        
        res.status(201).json({ success: true, group });
    } catch (error) {
        console.error('Create study group error:', error);
        res.status(500).json({ error: 'Failed to create study group' });
    }
};

exports.joinStudyGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { inviteCode } = req.body;
        
        const group = await StudyGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Study group not found' });
        }
        
        // Check if already a member
        const isMember = group.members.some(member => 
            member.userId.toString() === req.user._id.toString()
        );
        
        if (isMember) {
            return res.status(400).json({ error: 'Already a member of this group' });
        }
        
        // Check capacity
        if (group.members.length >= group.maxMembers) {
            return res.status(400).json({ error: 'Study group is full' });
        }
        
        // Check invite code for private groups
        if (group.isPrivate && group.inviteCode !== inviteCode) {
            return res.status(403).json({ error: 'Invalid invite code' });
        }
        
        group.members.push({
            userId: req.user._id,
            role: 'member',
            joinedAt: new Date()
        });
        
        group.activities.push({
            type: 'member_joined',
            userId: req.user._id,
            description: 'joined the study group',
            createdAt: new Date()
        });
        
        await group.save();
        await group.populate('members.userId', 'username fullName profilePictureUrl');
        
        res.json({ success: true, group });
    } catch (error) {
        console.error('Join study group error:', error);
        res.status(500).json({ error: 'Failed to join study group' });
    }
};

// Networking
exports.getNetworkingConnections = async (req, res) => {
    try {
        const { status, type = 'all' } = req.query;
        let filter = {};
        
        if (type === 'sent') {
            filter.requesterId = req.user._id;
        } else if (type === 'received') {
            filter.recipientId = req.user._id;
        } else {
            filter = {
                $or: [
                    { requesterId: req.user._id },
                    { recipientId: req.user._id }
                ]
            };
        }
        
        if (status) filter.status = status;
        
        const connections = await NetworkingConnection.find(filter)
            .populate('requesterId', 'username fullName profilePictureUrl workStatus')
            .populate('recipientId', 'username fullName profilePictureUrl workStatus')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, connections });
    } catch (error) {
        console.error('Get networking connections error:', error);
        res.status(500).json({ error: 'Failed to fetch connections' });
    }
};

exports.sendConnectionRequest = async (req, res) => {
    try {
        const { recipientId, message, connectionType, context } = req.body;
        
        // Check if connection already exists
        const existingConnection = await NetworkingConnection.findOne({
            $or: [
                { requesterId: req.user._id, recipientId },
                { requesterId: recipientId, recipientId: req.user._id }
            ]
        });
        
        if (existingConnection) {
            return res.status(400).json({ error: 'Connection already exists' });
        }
        
        const connection = new NetworkingConnection({
            requesterId: req.user._id,
            recipientId,
            message,
            connectionType: connectionType || 'professional',
            context
        });
        
        await connection.save();
        await connection.populate('requesterId recipientId', 'username fullName profilePictureUrl workStatus');
        
        res.status(201).json({ success: true, connection });
    } catch (error) {
        console.error('Send connection request error:', error);
        res.status(500).json({ error: 'Failed to send connection request' });
    }
};

exports.respondToConnectionRequest = async (req, res) => {
    try {
        const { connectionId } = req.params;
        const { status } = req.body;
        
        const connection = await NetworkingConnection.findOne({
            _id: connectionId,
            recipientId: req.user._id
        });
        
        if (!connection) {
            return res.status(404).json({ error: 'Connection request not found' });
        }
        
        connection.status = status;
        await connection.save();
        
        // Update analytics for accepted connections
        if (status === 'accepted') {
            const analytics = await UserAnalytics.findOne({ userId: req.user._id });
            if (analytics) {
                analytics.socialMetrics.connectionsCount += 1;
                await analytics.addDailyActivity(new Date(), 'networking', 5, 20);
            }
            
            // Update requester's analytics too
            const requesterAnalytics = await UserAnalytics.findOne({ userId: connection.requesterId });
            if (requesterAnalytics) {
                requesterAnalytics.socialMetrics.connectionsCount += 1;
                await requesterAnalytics.save();
            }
        }
        
        res.json({ success: true, connection });
    } catch (error) {
        console.error('Respond to connection request error:', error);
        res.status(500).json({ error: 'Failed to respond to connection request' });
    }
};

// Placeholder functions for missing exports
exports.updateCommunityPost = async (req, res) => {
    res.status(501).json({ error: 'Not implemented yet' });
};

exports.deleteCommunityPost = async (req, res) => {
    res.status(501).json({ error: 'Not implemented yet' });
};
