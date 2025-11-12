// routes/reportCard.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// Generate Report Card
router.post('/generate', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if user has GitHub and LinkedIn URLs
        if (!user.githubUrl || !user.linkedInUrl) {
            return res.status(400).json({ 
                error: 'Please add your GitHub and LinkedIn URLs to your profile first' 
            });
        }

        // Set report card status to pending
        user.reportCard = {
            status: 'pending',
            lastGenerated: new Date(),
            github: null,
            linkedin: null
        };

        await user.save();

        // Simulate report generation (in real app, this would be async)
        setTimeout(async () => {
            try {
                // Mock report data - in real app, this would scrape actual profiles
                const mockReportCard = {
                    status: 'completed',
                    lastGenerated: new Date(),
                    github: {
                        username: user.githubUrl.split('/').pop(),
                        bio: 'Full Stack Developer passionate about creating amazing web experiences',
                        publicRepos: 42,
                        followers: 156,
                        overallScore: 78,
                        pinnedRepos: [
                            {
                                title: 'Career Compass',
                                description: 'A full-stack web application for career guidance and skill development',
                                link: user.githubUrl + '/career-compass'
                            },
                            {
                                title: 'Portfolio Website',
                                description: 'Personal portfolio built with React and Tailwind CSS',
                                link: user.githubUrl + '/portfolio'
                            }
                        ],
                        lastGenerated: new Date()
                    },
                    linkedin: {
                        profileUrl: user.linkedInUrl,
                        headline: 'Software Developer | Full Stack | React & Node.js',
                        connections: 500,
                        overallScore: 82,
                        summary: 'Passionate software developer with 3+ years of experience in full-stack development. Skilled in React, Node.js, and modern web technologies.',
                        experience: [
                            {
                                title: 'Full Stack Developer',
                                company: 'Tech Solutions Inc.',
                                duration: '2022 - Present'
                            },
                            {
                                title: 'Frontend Developer',
                                company: 'StartUp Co.',
                                duration: '2021 - 2022'
                            }
                        ],
                        lastGenerated: new Date()
                    }
                };

                // Update user with completed report
                await User.findByIdAndUpdate(req.user._id, {
                    reportCard: mockReportCard
                });

                console.log('✅ Report card generated successfully for user:', req.user._id);
            } catch (error) {
                console.error('❌ Error generating report card:', error);
                // Update status to failed
                await User.findByIdAndUpdate(req.user._id, {
                    'reportCard.status': 'failed',
                    'reportCard.lastError': error.message
                });
            }
        }, 3000); // 3 second delay to simulate processing

        res.json({
            message: 'Report generation started! Check back in a moment.',
            user: user
        });

    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({ error: 'Failed to start report generation' });
    }
});

// Get Report Card Status
router.get('/status', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('reportCard');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            reportCard: user.reportCard || { status: 'not-generated' }
        });

    } catch (error) {
        console.error('Get report status error:', error);
        res.status(500).json({ error: 'Failed to get report status' });
    }
});

module.exports = router;
