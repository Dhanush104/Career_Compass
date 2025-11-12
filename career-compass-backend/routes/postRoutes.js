// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

const authMiddleware = require('../middleware/authMiddleware');

// ✅ GET all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

// ✅ GET single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
});

// ✅ POST new blog post
router.post('/', authMiddleware, async (req, res) => { 
  try {
    const { title, content, authorName } = req.body;
    const newPost = new Post({ title, content, authorName });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

module.exports = router;
