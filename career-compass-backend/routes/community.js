// routes/community.js
const express = require('express');
const router = express.Router();
const {
    getCommunityPosts,
    createCommunityPost,
    updateCommunityPost,
    deleteCommunityPost,
    addComment,
    toggleLike,
    getMentorshipRequests,
    createMentorshipRequest,
    respondToMentorshipRequest,
    getStudyGroups,
    createStudyGroup,
    joinStudyGroup,
    getNetworkingConnections,
    sendConnectionRequest,
    respondToConnectionRequest
} = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Community posts
router.get('/posts', getCommunityPosts);
router.post('/posts', createCommunityPost);
router.put('/posts/:postId', updateCommunityPost);
router.delete('/posts/:postId', deleteCommunityPost);
router.post('/posts/:postId/comments', addComment);
router.post('/posts/:postId/like', toggleLike);

// Mentorship
router.get('/mentorship/requests', getMentorshipRequests);
router.post('/mentorship/requests', createMentorshipRequest);
router.put('/mentorship/requests/:requestId', respondToMentorshipRequest);

// Study groups
router.get('/study-groups', getStudyGroups);
router.post('/study-groups', createStudyGroup);
router.post('/study-groups/:groupId/join', joinStudyGroup);

// Networking
router.get('/networking/connections', getNetworkingConnections);
router.post('/networking/connect', sendConnectionRequest);
router.put('/networking/connections/:connectionId', respondToConnectionRequest);

module.exports = router;
