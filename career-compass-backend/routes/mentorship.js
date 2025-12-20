// routes/mentorship.js
const express = require('express');
const router = express.Router();
const {
    getMentorshipRequests,
    createMentorshipRequest,
    updateMentorshipStatus,
    addMentorshipMessage,
    getStudyGroups,
    getUserStudyGroups,
    createStudyGroup,
    joinStudyGroup,
    leaveStudyGroup,
    addGroupResource,
    getConnections,
    sendConnectionRequest,
    updateConnectionStatus,
    addConnectionInteraction
} = require('../controllers/mentorshipController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Mentorship request routes
router.get('/requests', getMentorshipRequests);
router.post('/requests', createMentorshipRequest);
router.put('/requests/:requestId', updateMentorshipStatus);
router.post('/requests/:requestId/messages', addMentorshipMessage);

// Study group routes
router.get('/study-groups', getStudyGroups);
router.get('/study-groups/my-groups', getUserStudyGroups);
router.post('/study-groups', createStudyGroup);
router.post('/study-groups/:groupId/join', joinStudyGroup);
router.post('/study-groups/:groupId/leave', leaveStudyGroup);
router.post('/study-groups/:groupId/resources', addGroupResource);

// Networking connection routes
router.get('/connections', getConnections);
router.post('/connections', sendConnectionRequest);
router.put('/connections/:connectionId', updateConnectionStatus);
router.post('/connections/:connectionId/interactions', addConnectionInteraction);

module.exports = router;
