// controllers/chatbotController.js
const CareerPath = require('../models/CareerPath');

exports.handleChatbotRequest = async (req, res) => {
    const intentName = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;

    let responseText = "I'm sorry, I couldn't find that information.";

    if (intentName === 'GetCareerInfo') {
        const careerName = parameters['career-path'];
        const career = await CareerPath.findOne({ name: careerName });
        if (career) {
            responseText = career.description;
        }
    }

    if (intentName === 'GetRoadmap') {
        const careerName = parameters['career-path'];
        const career = await CareerPath.findOne({ name: careerName });
        if (career) {
            const roadmapTitles = career.roadmapTemplate.map((step, i) => `${i + 1}. ${step.title}`).join('\n');
            responseText = `Here is the roadmap for ${careerName}:\n${roadmapTitles}`;
        }
    }

    res.json({
        fulfillmentText: responseText
    });
};