// models/CodingChallenge.js
const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    explanation: String,
    isHidden: { type: Boolean, default: false }
});

const submissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'wrong_answer', 'time_limit_exceeded', 'runtime_error', 'compile_error'],
        default: 'pending' 
    },
    runtime: Number, // in milliseconds
    memory: Number, // in KB
    testCasesPassed: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now }
});

const codingChallengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { 
        type: String, 
        enum: ['easy', 'medium', 'hard'],
        required: true 
    },
    category: { 
        type: String, 
        enum: ['algorithms', 'data-structures', 'dynamic-programming', 'system-design', 'frontend', 'backend'],
        required: true 
    },
    tags: [String],
    
    // Problem details
    timeLimit: { type: Number, default: 30 }, // in minutes
    points: { type: Number, required: true },
    hints: [String],
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],
    
    // Test cases
    testCases: [testCaseSchema],
    
    // Companies that ask this question
    companies: [String],
    
    // Submissions and statistics
    submissions: [submissionSchema],
    totalSubmissions: { type: Number, default: 0 },
    acceptedSubmissions: { type: Number, default: 0 },
    acceptanceRate: { type: Number, default: 0 },
    
    // Editorial and solutions
    editorial: {
        approach: String,
        complexity: {
            time: String,
            space: String
        },
        code: [{
            language: String,
            solution: String
        }]
    },
    
    // Social features
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    discussions: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        title: String,
        content: String,
        replies: [{
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            content: String,
            createdAt: { type: Date, default: Date.now }
        }],
        createdAt: { type: Date, default: Date.now }
    }],
    
    // Metadata
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false }
}, { timestamps: true });

// Calculate acceptance rate before saving
codingChallengeSchema.pre('save', function(next) {
    if (this.totalSubmissions > 0) {
        this.acceptanceRate = Math.round((this.acceptedSubmissions / this.totalSubmissions) * 100);
    }
    next();
});

// Add submission and update statistics
codingChallengeSchema.methods.addSubmission = function(submission) {
    this.submissions.push(submission);
    this.totalSubmissions += 1;
    if (submission.status === 'accepted') {
        this.acceptedSubmissions += 1;
    }
    return this.save();
};

const CodingChallenge = mongoose.model('CodingChallenge', codingChallengeSchema);
module.exports = CodingChallenge;
