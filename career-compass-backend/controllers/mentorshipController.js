// controllers/mentorshipController.js
const { MentorshipRequest, StudyGroup, NetworkingConnection } = require('../models/Community');
const User = require('../models/User');

// ==================== MENTORSHIP REQUESTS ====================

// Get all mentorship requests for user (as mentor or mentee)
exports.getMentorshipRequests = async (req, res) => {
    try {
        const { role, status } = req.query; // role: 'mentor' or 'mentee'
        let filter = {};
        
        if (role === 'mentor') {
            filter.mentorId = req.user._id;
        } else if (role === 'mentee') {
            filter.menteeId = req.user._id;
        } else {
            filter.$or = [
                { mentorId: req.user._id },
                { menteeId: req.user._id }
            ];
        }
        
        if (status) filter.status = status;
        
        const requests = await MentorshipRequest.find(filter)
            .populate('menteeId', 'username fullName profilePictureUrl email')
            .populate('mentorId', 'username fullName profilePictureUrl email')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, requests });
    } catch (error) {
        console.error('Get mentorship requests error:', error);
        res.status(500).json({ error: 'Failed to fetch mentorship requests' });
    }
};

// Create mentorship request
exports.createMentorshipRequest = async (req, res) => {
    try {
        const { mentorId, title, description, category, duration, preferredTime } = req.body;
        
        // Check if mentor exists and offers mentorship
        const mentor = await User.findById(mentorId);
        if (!mentor || !mentor.mentorshipOffered) {
            return res.status(400).json({ error: 'Invalid mentor or mentor not available' });
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
        await request.populate('menteeId mentorId', 'username fullName profilePictureUrl email');
        
        res.status(201).json({ success: true, request });
    } catch (error) {
        console.error('Create mentorship request error:', error);
        res.status(500).json({ error: 'Failed to create mentorship request' });
    }
};

// Update mentorship request status
exports.updateMentorshipStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, scheduledAt, sessionNotes, feedback, rating } = req.body;
        
        const request = await MentorshipRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        
        // Only mentor can accept/decline, both can complete/cancel
        if (status === 'accepted' || status === 'declined') {
            if (request.mentorId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Only mentor can accept/decline requests' });
            }
        }
        
        request.status = status;
        if (scheduledAt) request.scheduledAt = scheduledAt;
        if (sessionNotes) request.sessionNotes = sessionNotes;
        if (rating) request.rating = rating;
        
        // Set feedback based on who is providing it
        if (feedback) {
            if (request.mentorId.toString() === req.user._id.toString()) {
                request.mentorFeedback = feedback;
            } else {
                request.menteeFeedback = feedback;
            }
        }
        
        if (status === 'completed') {
            request.completedAt = new Date();
        }
        
        await request.save();
        await request.populate('menteeId mentorId', 'username fullName profilePictureUrl');
        
        res.json({ success: true, request });
    } catch (error) {
        console.error('Update mentorship status error:', error);
        res.status(500).json({ error: 'Failed to update request' });
    }
};

// Add message to mentorship request
exports.addMentorshipMessage = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { content } = req.body;
        
        const request = await MentorshipRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        
        // Only mentor and mentee can message
        const isParticipant = request.mentorId.toString() === req.user._id.toString() ||
                             request.menteeId.toString() === req.user._id.toString();
        
        if (!isParticipant) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        
        request.messages.push({
            senderId: req.user._id,
            content,
            createdAt: new Date()
        });
        
        await request.save();
        await request.populate('messages.senderId', 'username fullName profilePictureUrl');
        
        res.json({ success: true, messages: request.messages });
    } catch (error) {
        console.error('Add message error:', error);
        res.status(500).json({ error: 'Failed to add message' });
    }
};

// ==================== STUDY GROUPS ====================

// Get all study groups
exports.getStudyGroups = async (req, res) => {
    try {
        const { category, isPrivate } = req.query;
        const filter = {};
        
        if (category) filter.category = category;
        if (isPrivate !== undefined) filter.isPrivate = isPrivate === 'true';
        
        const groups = await StudyGroup.find(filter)
            .populate('createdBy', 'username fullName profilePictureUrl')
            .populate('members.userId', 'username fullName profilePictureUrl')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, groups });
    } catch (error) {
        console.error('Get study groups error:', error);
        res.status(500).json({ error: 'Failed to fetch study groups' });
    }
};

// Get user's study groups
exports.getUserStudyGroups = async (req, res) => {
    try {
        const groups = await StudyGroup.find({ 
            'members.userId': req.user._id 
        })
        .populate('createdBy', 'username fullName profilePictureUrl')
        .populate('members.userId', 'username fullName profilePictureUrl')
        .sort({ createdAt: -1 });
        
        res.json({ success: true, groups });
    } catch (error) {
        console.error('Get user study groups error:', error);
        res.status(500).json({ error: 'Failed to fetch study groups' });
    }
};

// Create study group
exports.createStudyGroup = async (req, res) => {
    try {
        const { name, description, category, maxMembers, isPrivate, schedule } = req.body;
        
        const inviteCode = isPrivate ? 
            Math.random().toString(36).substring(2, 10).toUpperCase() : null;
        
        const group = new StudyGroup({
            name,
            description,
            category,
            createdBy: req.user._id,
            maxMembers: maxMembers || 20,
            isPrivate: isPrivate || false,
            inviteCode,
            schedule,
            members: [{
                userId: req.user._id,
                role: 'admin',
                joinedAt: new Date()
            }]
        });
        
        await group.save();
        await group.populate('createdBy members.userId', 'username fullName profilePictureUrl');
        
        res.status(201).json({ success: true, group });
    } catch (error) {
        console.error('Create study group error:', error);
        res.status(500).json({ error: 'Failed to create study group' });
    }
};

// Join study group
exports.joinStudyGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { inviteCode } = req.body;
        
        const group = await StudyGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Study group not found' });
        }
        
        // Check if already a member
        const isMember = group.members.some(
            m => m.userId.toString() === req.user._id.toString()
        );
        
        if (isMember) {
            return res.status(400).json({ error: 'Already a member of this group' });
        }
        
        // Check if group is full
        if (group.members.length >= group.maxMembers) {
            return res.status(400).json({ error: 'Study group is full' });
        }
        
        // Check invite code for private groups
        if (group.isPrivate && inviteCode !== group.inviteCode) {
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
            description: `${req.user.username} joined the group`,
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

// Leave study group
exports.leaveStudyGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        
        const group = await StudyGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Study group not found' });
        }
        
        const memberIndex = group.members.findIndex(
            m => m.userId.toString() === req.user._id.toString()
        );
        
        if (memberIndex === -1) {
            return res.status(400).json({ error: 'Not a member of this group' });
        }
        
        // Don't allow creator to leave if there are other members
        if (group.createdBy.toString() === req.user._id.toString() && group.members.length > 1) {
            return res.status(400).json({ 
                error: 'Transfer ownership before leaving or delete the group' 
            });
        }
        
        group.members.splice(memberIndex, 1);
        
        group.activities.push({
            type: 'member_left',
            userId: req.user._id,
            description: `${req.user.username} left the group`,
            createdAt: new Date()
        });
        
        await group.save();
        
        res.json({ success: true, message: 'Left study group successfully' });
    } catch (error) {
        console.error('Leave study group error:', error);
        res.status(500).json({ error: 'Failed to leave study group' });
    }
};

// Add resource to study group
exports.addGroupResource = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { title, url, type } = req.body;
        
        const group = await StudyGroup.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: 'Study group not found' });
        }
        
        // Check if user is a member
        const isMember = group.members.some(
            m => m.userId.toString() === req.user._id.toString()
        );
        
        if (!isMember) {
            return res.status(403).json({ error: 'Not a member of this group' });
        }
        
        group.resources.push({
            title,
            url,
            type,
            addedBy: req.user._id,
            addedAt: new Date()
        });
        
        group.activities.push({
            type: 'resource_added',
            userId: req.user._id,
            description: `${req.user.username} added a resource: ${title}`,
            createdAt: new Date()
        });
        
        await group.save();
        await group.populate('resources.addedBy', 'username fullName');
        
        res.json({ success: true, resources: group.resources });
    } catch (error) {
        console.error('Add resource error:', error);
        res.status(500).json({ error: 'Failed to add resource' });
    }
};

// ==================== NETWORKING CONNECTIONS ====================

// Get user connections
exports.getConnections = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {
            $or: [
                { requesterId: req.user._id },
                { recipientId: req.user._id }
            ]
        };
        
        if (status) filter.status = status;
        
        const connections = await NetworkingConnection.find(filter)
            .populate('requesterId', 'username fullName profilePictureUrl email skills')
            .populate('recipientId', 'username fullName profilePictureUrl email skills')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, connections });
    } catch (error) {
        console.error('Get connections error:', error);
        res.status(500).json({ error: 'Failed to fetch connections' });
    }
};

// Send connection request
exports.sendConnectionRequest = async (req, res) => {
    try {
        const { recipientId, message, connectionType, context } = req.body;
        
        if (recipientId === req.user._id.toString()) {
            return res.status(400).json({ error: 'Cannot connect with yourself' });
        }
        
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
        await connection.populate('requesterId recipientId', 'username fullName profilePictureUrl');
        
        res.status(201).json({ success: true, connection });
    } catch (error) {
        console.error('Send connection request error:', error);
        res.status(500).json({ error: 'Failed to send connection request' });
    }
};

// Update connection status
exports.updateConnectionStatus = async (req, res) => {
    try {
        const { connectionId } = req.params;
        const { status } = req.body;
        
        const connection = await NetworkingConnection.findById(connectionId);
        if (!connection) {
            return res.status(404).json({ error: 'Connection not found' });
        }
        
        // Only recipient can accept/decline
        if (connection.recipientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        
        connection.status = status;
        await connection.save();
        await connection.populate('requesterId recipientId', 'username fullName profilePictureUrl');
        
        res.json({ success: true, connection });
    } catch (error) {
        console.error('Update connection status error:', error);
        res.status(500).json({ error: 'Failed to update connection' });
    }
};

// Add interaction to connection
exports.addConnectionInteraction = async (req, res) => {
    try {
        const { connectionId } = req.params;
        const { type, content } = req.body;
        
        const connection = await NetworkingConnection.findById(connectionId);
        if (!connection) {
            return res.status(404).json({ error: 'Connection not found' });
        }
        
        // Check if user is part of connection
        const isParticipant = connection.requesterId.toString() === req.user._id.toString() ||
                             connection.recipientId.toString() === req.user._id.toString();
        
        if (!isParticipant) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        
        connection.interactions.push({
            type,
            content,
            createdAt: new Date()
        });
        
        await connection.save();
        
        res.json({ success: true, interactions: connection.interactions });
    } catch (error) {
        console.error('Add interaction error:', error);
        res.status(500).json({ error: 'Failed to add interaction' });
    }
};
