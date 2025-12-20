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
        console.error('Error details:', err.message);
        console.error('Request body:', req.body);
        res.status(500).json({ 
            success: false,
            error: 'Server error fetching user profile.',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// This function will update the user's profile
exports.updateUserProfile = async (req, res) => {
    const userId = req.user._id;
    // We only allow updating these specific fields for security
    const { 
        fullName, dateOfBirth, nationality, state, profilePictureUrl, 
        workStatus, linkedInUrl, githubUrl, mobileNumber, skills, bio 
    } = req.body;

    try {
        // Build update object with only provided fields
        const updateData = {};
        if (fullName !== undefined) updateData.fullName = fullName;
        if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
        if (nationality !== undefined) updateData.nationality = nationality;
        if (state !== undefined) updateData.state = state;
        if (profilePictureUrl !== undefined) updateData.profilePictureUrl = profilePictureUrl;
        if (workStatus !== undefined) updateData.workStatus = workStatus;
        if (linkedInUrl !== undefined) updateData.linkedInUrl = linkedInUrl;
        if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
        if (mobileNumber !== undefined) updateData.mobileNumber = mobileNumber;
        if (bio !== undefined) updateData.bio = bio;
        
        // Handle skills - ensure it's an array of skill objects with proper structure
        if (skills !== undefined) {
            if (Array.isArray(skills)) {
                updateData.skills = skills.map(skill => {
                    // If skill is just a string, convert to object
                    if (typeof skill === 'string') {
                        return { name: skill, level: 'Beginner', yearsOfExperience: 0 };
                    }
                    
                    // If skill has numeric level (0-100), convert to string level
                    if (typeof skill.level === 'number') {
                        let levelString;
                        if (skill.level < 30) levelString = 'Beginner';
                        else if (skill.level < 60) levelString = 'Intermediate';
                        else if (skill.level < 85) levelString = 'Advanced';
                        else levelString = 'Expert';
                        
                        return {
                            name: skill.name,
                            level: levelString,
                            yearsOfExperience: skill.yearsOfExperience || 0
                        };
                    }
                    
                    // Skill already has proper format
                    return {
                        name: skill.name,
                        level: skill.level || 'Beginner',
                        yearsOfExperience: skill.yearsOfExperience || 0
                    };
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        
        res.status(200).json({ 
            success: true,
            message: 'Profile updated successfully!', 
            user: updatedUser 
        });
    } catch (err) {
        console.error('Error in updateUserProfile:', err);
        console.error('Error details:', err.message);
        console.error('Request body:', req.body);
        res.status(500).json({ 
            success: false,
            error: 'Server error updating profile.',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};