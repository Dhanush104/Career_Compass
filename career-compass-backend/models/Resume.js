// models/Resume.js
const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    startDate: Date,
    endDate: Date,
    current: { type: Boolean, default: false },
    description: String,
    achievements: [String]
});

const educationSchema = new mongoose.Schema({
    degree: { type: String, required: true },
    school: { type: String, required: true },
    location: String,
    graduationDate: Date,
    gpa: String,
    relevant: String
});

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { 
        type: String, 
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Intermediate' 
    },
    category: { 
        type: String, 
        enum: ['Technical', 'Soft Skills', 'Languages', 'Tools'],
        default: 'Technical' 
    }
});

const certificationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    credentialId: String,
    url: String
});

const languageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    proficiency: { 
        type: String, 
        enum: ['Basic', 'Conversational', 'Fluent', 'Native'],
        default: 'Conversational' 
    }
});

const resumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    template: { 
        type: String, 
        enum: ['modern', 'creative', 'minimal', 'executive'],
        default: 'modern' 
    },
    
    // Personal Information
    personalInfo: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        location: String,
        website: String,
        linkedin: String,
        github: String,
        summary: String
    },
    
    // Resume Sections
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [skillSchema],
    certifications: [certificationSchema],
    languages: [languageSchema],
    projects: [{
        title: String,
        description: String,
        technologies: [String],
        url: String,
        github: String
    }],
    
    // Metadata
    isDefault: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    downloadCount: { type: Number, default: 0 },
    lastDownloaded: Date,
    
    // Analytics
    viewCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    
    // Version control
    version: { type: Number, default: 1 },
    previousVersions: [{
        version: Number,
        data: mongoose.Schema.Types.Mixed,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Create a new version before major updates
resumeSchema.methods.createVersion = function() {
    this.previousVersions.push({
        version: this.version,
        data: this.toObject(),
        createdAt: new Date()
    });
    this.version += 1;
};

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
