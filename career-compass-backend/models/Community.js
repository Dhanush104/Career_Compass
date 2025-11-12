// models/Community.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        createdAt: { type: Date, default: Date.now }
    }],
    isEdited: { type: Boolean, default: false },
    editedAt: Date
}, { timestamps: true });

const communityPostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['discussion', 'question', 'achievement', 'tip', 'resource', 'job_posting'],
        required: true 
    },
    category: { 
        type: String, 
        enum: ['career', 'technical', 'interview', 'resume', 'networking', 'general'],
        required: true 
    },
    tags: [String],
    
    // Engagement metrics
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shares: { type: Number, default: 0 },
    
    // Comments and discussions
    comments: [commentSchema],
    commentsCount: { type: Number, default: 0 },
    
    // Moderation
    isApproved: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    reports: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: String,
        createdAt: { type: Date, default: Date.now }
    }],
    
    // For job postings
    jobDetails: {
        company: String,
        location: String,
        salary: String,
        type: String, // full-time, part-time, contract
        remote: Boolean,
        applicationUrl: String,
        deadline: Date
    },
    
    // For achievements
    achievementData: {
        type: String, // goal_completed, challenge_solved, etc.
        details: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

// Update comments count before saving
communityPostSchema.pre('save', function(next) {
    this.commentsCount = this.comments.length;
    next();
});

const mentorshipRequestSchema = new mongoose.Schema({
    menteeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['career_guidance', 'technical_skills', 'interview_prep', 'resume_review', 'networking'],
        required: true 
    },
    duration: String, // "30 minutes", "1 hour", etc.
    preferredTime: String,
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
        default: 'pending' 
    },
    scheduledAt: Date,
    completedAt: Date,
    
    // Session details
    sessionNotes: String,
    mentorFeedback: String,
    menteeFeedback: String,
    rating: { type: Number, min: 1, max: 5 },
    
    // Communication
    messages: [{
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const studyGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['coding_challenges', 'interview_prep', 'system_design', 'career_development', 'specific_technology'],
        required: true 
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['admin', 'moderator', 'member'], default: 'member' },
        joinedAt: { type: Date, default: Date.now }
    }],
    maxMembers: { type: Number, default: 20 },
    isPrivate: { type: Boolean, default: false },
    inviteCode: String,
    
    // Schedule and meetings
    schedule: {
        frequency: String, // weekly, bi-weekly, monthly
        dayOfWeek: String,
        time: String,
        timezone: String
    },
    nextMeeting: Date,
    
    // Resources and activities
    resources: [{
        title: String,
        url: String,
        type: String, // link, document, video
        addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        addedAt: { type: Date, default: Date.now }
    }],
    
    // Progress tracking
    groupGoals: [{
        title: String,
        description: String,
        deadline: Date,
        completed: { type: Boolean, default: false },
        completedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    
    // Activity feed
    activities: [{
        type: String, // member_joined, resource_added, goal_completed, etc.
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        description: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const networkingConnectionSchema = new mongoose.Schema({
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'declined', 'blocked'],
        default: 'pending' 
    },
    message: String,
    connectionType: { 
        type: String, 
        enum: ['professional', 'mentor', 'peer', 'recruiter'],
        default: 'professional' 
    },
    
    // Interaction history
    interactions: [{
        type: String, // message, endorsement, recommendation
        content: String,
        createdAt: { type: Date, default: Date.now }
    }],
    
    // Mutual connections
    mutualConnections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    // Networking context
    context: {
        howMet: String, // conference, online, referral, etc.
        commonInterests: [String],
        notes: String
    }
}, { timestamps: true });

// Models
const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
const MentorshipRequest = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);
const NetworkingConnection = mongoose.model('NetworkingConnection', networkingConnectionSchema);

module.exports = {
    CommunityPost,
    MentorshipRequest,
    StudyGroup,
    NetworkingConnection
};
