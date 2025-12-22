const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'My Resume'
    },
    template: {
        type: String,
        enum: ['modern', 'creative', 'minimal', 'executive'],
        default: 'modern'
    },
    personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        location: String,
        website: String,
        linkedin: String,
        github: String,
        summary: String
    },
    experience: [{
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: Boolean,
        description: String,
        achievements: [String]
    }],
    education: [{
        degree: String,
        school: String,
        location: String,
        graduationDate: String,
        gpa: String,
        relevant: String
    }],
    skills: [{
        name: String,
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
        },
        category: String
    }],
    projects: [{
        title: String,
        description: String,
        technologies: [String],
        url: String,
        github: String
    }],
    certifications: [{
        name: String,
        issuer: String,
        date: String
    }],
    languages: [{
        language: String,
        proficiency: {
            type: String,
            enum: ['Native', 'Fluent', 'Intermediate', 'Basic']
        }
    }],
    isDefault: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Ensure only one default resume per user
resumeSchema.pre('save', async function (next) {
    if (this.isDefault) {
        await this.constructor.updateMany(
            { userId: this.userId, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    next();
});

module.exports = mongoose.model('Resume', resumeSchema);
