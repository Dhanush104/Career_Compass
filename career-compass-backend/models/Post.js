// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  authorName: {
    type: String,
    required: true
  }
}, { timestamps: true }); // adds createdAt & updatedAt

module.exports = mongoose.model('Post', postSchema);
