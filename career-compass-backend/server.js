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
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully!');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
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

const authRoutes = require('./routes/auth');
const roadmapRoutes = require('./routes/roadmap');
// Import and use the blog post routes
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes');
const reportCardRoutes = require('./routes/reportCard');
const goalRoutes = require('./routes/goals');
const analyticsRoutes = require('./routes/analytics');
const communityRoutes = require('./routes/community');

app.use('/api/auth', authRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/report-card', reportCardRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/community', communityRoutes);

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));