// models/InterviewSession.js
const mongoose = require('mongoose');

const questionResponseSchema = new mongoose.Schema({
    questionId: String,
    question: String,
    category: String,
    difficulty: String,
    userAnswer: String,
    timeSpent: Number, // in seconds
    rating: { type: Number, min: 1, max: 5 },
    feedback: String,
    answeredAt: { type: Date, default: Date.now }
});

const interviewSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionType: { 
        type: String, 
        enum: ['practice', 'mock', 'real'],
        default: 'practice' 
    },
    category: { 
        type: String, 
        enum: ['technical', 'behavioral', 'system-design', 'leadership', 'company-specific'],
        required: true 
    },
    
    // Session details
    title: String,
    company: String,
    position: String,
    duration: { type: Number, default: 0 }, // in minutes
    
    // Questions and responses
    questions: [questionResponseSchema],
    totalQuestions: { type: Number, default: 0 },
    answeredQuestions: { type: Number, default: 0 },
    
    // Performance metrics
    averageRating: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // in seconds
    averageTimePerQuestion: { type: Number, default: 0 },
    
    // Session status
    status: { 
        type: String, 
        enum: ['in_progress', 'completed', 'abandoned'],
        default: 'in_progress' 
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
    
    // AI Analysis (future feature)
    aiAnalysis: {
        strengths: [String],
        weaknesses: [String],
        recommendations: [String],
        overallScore: Number,
        confidenceLevel: String
    },
    
    // Recording (if enabled)
    recordingUrl: String,
    transcription: String,
    
    // Social features
    isPublic: { type: Boolean, default: false },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    mentorFeedback: [{
        mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        feedback: String,
        rating: Number,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Calculate session metrics before saving
interviewSessionSchema.pre('save', function(next) {
    if (this.questions.length > 0) {
        this.answeredQuestions = this.questions.filter(q => q.userAnswer).length;
        
        const ratingsSum = this.questions.reduce((sum, q) => sum + (q.rating || 0), 0);
        this.averageRating = ratingsSum / this.questions.length;
        
        const timeSum = this.questions.reduce((sum, q) => sum + (q.timeSpent || 0), 0);
        this.totalTimeSpent = timeSum;
        this.averageTimePerQuestion = timeSum / this.questions.length;
    }
    next();
});

// Add question response
interviewSessionSchema.methods.addResponse = function(questionData) {
    this.questions.push(questionData);
    this.totalQuestions = this.questions.length;
    return this.save();
};

// Complete session
interviewSessionSchema.methods.completeSession = function() {
    this.status = 'completed';
    this.completedAt = new Date();
    this.duration = Math.round((this.completedAt - this.startedAt) / (1000 * 60)); // in minutes
    return this.save();
};

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
module.exports = InterviewSession;
