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
    
    // UPDATED: Structured roadmap to match CareerPath model
    roadmap: {
        type: userRoadmapSchema,
        default: null,
    },
    achievements: { type: [String], default: [] },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    projects: [projectSchema]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;