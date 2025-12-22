// server.js

// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');


// Load environment variables from .env file
dotenv.config();

// Create the Express app
const app = express();

// Middleware
app.use(express.json()); // Allows us to accept JSON data in the body
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(morgan('dev'));


// Define the port to run the server on
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ MongoDB connected successfully!');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.error('💡 Troubleshooting tips:');
        console.error('   1. Check if your IP address is whitelisted in MongoDB Atlas');
        console.error('   2. Verify your MongoDB Atlas cluster is running');
        console.error('   3. Check your internet connection');
        console.error('   4. Verify the MONGO_URI in .env file');
        // Exit process with failure
        process.exit(1);
    }
};


// Call the function to connect to the database
connectDB();

// A simple test route to check if the server is working
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import all routes
const authRoutes = require('./routes/auth');
const roadmapRoutes = require('./routes/roadmap');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const reportCardRoutes = require('./routes/reportCard');
const goalRoutes = require('./routes/goals');
const analyticsRoutes = require('./routes/analytics');
const mentorshipRoutes = require('./routes/mentorship');
const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');
const aiRoutes = require('./routes/ai');
const resumeRoutes = require('./routes/resumes');

// Use all routes
app.use('/api/auth', authRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/report-card', reportCardRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/mentorship', mentorshipRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/resumes', resumeRoutes);

// 404 Handler - Must be after all routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            details: errors
        });
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(409).json({
            success: false,
            error: `${field} already exists`
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: 'Token expired'
        });
    }

    // Default error
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`\n📋 Available API Endpoints:`);
    console.log(`   - Auth: /api/auth`);
    console.log(`   - Users: /api/users`);
    console.log(`   - Roadmap: /api/roadmap`);
    console.log(`   - Goals: /api/goals`);
    console.log(`   - Analytics: /api/analytics`);
    console.log(`   - Mentorship: /api/mentorship`);
    console.log(`   - Posts: /api/posts`);
    console.log(`   - Report Card: /api/report-card`);
});