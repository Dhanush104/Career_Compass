// routes/chatbot.js
const express = require('express');
const router = express.Router();
const { handleChatbotRequest } = require('../controllers/chatbotController');

router.post('/webhook', handleChatbotRequest);

module.exports = router;