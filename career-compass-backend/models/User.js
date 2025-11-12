// models/User.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    technologies: [String],
    liveDemoUrl: String,
    sourceCodeUrl: String,
});

// FIXED: Define schemas to match the nested roadmap structure
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: { type: Boolean, default: false },
    resources: [{ title: String, url: String }]
});

const milestoneSchema = new mongoose.Schema({
    milestoneTitle: String,
    tasks: [taskSchema]
});

const userRoadmapSchema = new mongoose.Schema({
    careerPathName: String,
    milestones: [milestoneSchema]
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // --- HIGHLIGHT: ADD THESE NEW FIELDS ---
    fullName: { type: String, default: '' },
    dateOfBirth: { type: Date, default: null },
    nationality: { type: String, default: '' },
    state: { type: String, default: '' },
    profilePictureUrl: { type: String, default: '' },
    workStatus: { type: String, default: '' }, // e.g., "Student", "Working Professional"
    linkedInUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    mobileNumber: { type: String, default: '' },
    
    // Skills will be an array of strings
    skills: [{ type: String }],
    
    // UPDATED: Structured roadmap to match CareerPath model
    roadmap: {
        type: userRoadmapSchema,
        default: null,
    },
    reportCard: {
        status: { 
            type: String, 
            enum: ['pending', 'completed', 'failed', 'not-generated'], 
            default: 'not-generated' 
        },
        lastGenerated: Date,
        lastError: String,
        github: {
            username: String,
            bio: String,
            followers: Number,
            publicRepos: Number,
            overallScore: Number,
            pinnedRepos: [{
                title: String,
                description: String,
                link: String,
            }],
            lastGenerated: Date,
        },
        linkedin: {
            profileUrl: String,
            headline: String,
            connections: Number,
            overallScore: Number,
            summary: String,
            experience: [{
                title: String,
                company: String,
                duration: String,
            }],
            lastGenerated: Date,
        },
    },
    // ============================
    achievements: { type: [String], default: [] },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    projects: [projectSchema],
    
    // Social and Community Features
    bio: { type: String, default: '' },
    interests: [String],
    mentorshipOffered: { type: Boolean, default: false },
    mentorshipSeeking: { type: Boolean, default: false },
    mentorshipAreas: [String],
    socialLinks: {
        twitter: String,
        instagram: String,
        website: String,
        portfolio: String
    },
    
    // Privacy Settings
    profileVisibility: { 
        type: String, 
        enum: ['public', 'connections', 'private'], 
        default: 'public' 
    },
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    
    // Activity Tracking
    lastLoginAt: { type: Date, default: Date.now },
    loginStreak: { type: Number, default: 0 },
    totalLogins: { type: Number, default: 0 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;