// models/CareerPath.js
const mongoose = require('mongoose');

const careerPathSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    matchKeywords: [String],
    // UPDATED: Roadmap is now a series of milestones
    roadmapTemplate: [{
        milestoneTitle: String,
        tasks: [{
            title: { type: String, required: true },
            description: { type: String, required: true },
            resources: [{ title: String, url: String }]
        }]
    }],
});

const CareerPath = mongoose.model('CareerPath', careerPathSchema);
module.exports = CareerPath;