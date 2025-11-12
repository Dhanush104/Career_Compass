// controllers/userController.js
const User = require('../models/User');

// This function will get the full profile of the currently logged-in user
exports.getUserProfile = async (req, res) => {
    try {
        // req.user._id is attached by the authMiddleware
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error in getUserProfile:', err);
        res.status(500).json({ error: 'Server error fetching user profile.' });
    }
};

// This function will update the user's profile
exports.updateUserProfile = async (req, res) => {
    const userId = req.user._id;
    // We only allow updating these specific fields for security
    const { 
        fullName, dateOfBirth, nationality, state, profilePictureUrl, 
        workStatus, linkedInUrl, githubUrl, mobileNumber, skills 
    } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                fullName, dateOfBirth, nationality, state, profilePictureUrl, 
                workStatus, linkedInUrl, githubUrl, mobileNumber, skills 
            },
            { new: true, runValidators: true } // 'new: true' returns the updated document
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json({ message: 'Profile updated successfully!', user: updatedUser });
    } catch (err) {
        console.error('Error in updateUserProfile:', err);
        res.status(500).json({ error: 'Server error updating profile.' });
    }
};