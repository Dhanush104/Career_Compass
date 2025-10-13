// models/QuizQuestion.js

const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
    },
    options: [{
        optionText: {
            type: String,
            required: true,
        },
        affinities: {
            type: Object, 
        },
        keywords: [String]
    }],
});

const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);

module.exports = QuizQuestion;