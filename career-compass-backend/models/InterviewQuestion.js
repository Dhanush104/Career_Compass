// models/InterviewQuestion.js
const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['technical', 'behavioral', 'system-design', 'leadership', 'company-specific'],
        required: true 
    },
    subcategory: String, // e.g., "JavaScript", "React", "Teamwork", etc.
    difficulty: { 
        type: String, 
        enum: ['Easy', 'Medium', 'Hard'],
        required: true 
    },
    tips: [String],
    followUp: String,
    
    // For mock interviews
    company: String,
    duration: String, // e.g., "45 min"
    topics: [String],
    
    // Usage statistics
    timesAsked: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    
    // Metadata
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const InterviewQuestion = mongoose.model('InterviewQuestion', interviewQuestionSchema);
module.exports = InterviewQuestion;
