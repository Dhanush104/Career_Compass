// backend/controllers/scrapingController.js
const User = require('../models/User');
const { scrapeAndSave } = require('../services/scrapingService');

exports.generateReportCard = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const { githubUrl, linkedInUrl } = user;

        if (!githubUrl && !linkedInUrl) {
            return res.status(400).json({ error: 'Please add GitHub or LinkedIn URLs to your profile first.' });
        }

        // 1. Immediately set status to 'pending' and save
        if (!user.reportCard) user.reportCard = {};
        user.reportCard.status = 'pending';
        user.reportCard.lastError = null;
        const updatedUser = await user.save();

        // 2. Start the scraping job in the background (DO NOT await it)
        scrapeAndSave(userId, githubUrl, linkedInUrl);

        // 3. Send a 202 (Accepted) response to the frontend
        // Send back the user object with the 'pending' status
        res.status(202).json({ 
            message: 'Report generation started. This may take a few minutes.',
            user: updatedUser 
        });

    } catch (err) {
        console.error('Error starting report generation:', err);
        res.status(500).json({ error: 'Server error starting report generation.' });
    }
};