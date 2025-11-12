// models/Goal.js
const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
    dueDate: Date,
    completedAt: Date
});

const goalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    category: { 
        type: String, 
        enum: ['career', 'learning', 'technical', 'networking', 'personal'],
        required: true 
    },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'],
        default: 'medium' 
    },
    status: { 
        type: String, 
        enum: ['active', 'completed', 'paused', 'cancelled'],
        default: 'active' 
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    deadline: Date,
    milestones: [milestoneSchema],
    tags: [String],
    completedAt: Date,
    
    // Analytics fields
    timeSpent: { type: Number, default: 0 }, // in minutes
    lastUpdated: { type: Date, default: Date.now },
    viewCount: { type: Number, default: 0 },
    
    // Social features
    isPublic: { type: Boolean, default: false },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Calculate progress based on completed milestones
goalSchema.methods.calculateProgress = function() {
    if (this.milestones.length === 0) return 0;
    const completed = this.milestones.filter(m => m.completed).length;
    return Math.round((completed / this.milestones.length) * 100);
};

// Update progress before saving
goalSchema.pre('save', function(next) {
    this.progress = this.calculateProgress();
    this.lastUpdated = new Date();
    next();
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
