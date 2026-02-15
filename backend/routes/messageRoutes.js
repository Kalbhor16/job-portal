const express = require('express');
const {
  sendMessage,
  getMessages,
  getConversation,
  getAllConversations,
} = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', authMiddleware, sendMessage);

// @route   GET /api/messages/conversations/all/list
// @desc    Get all conversations for recruiter
// @access  Private
router.get('/conversations/all/list', authMiddleware, getAllConversations);

// @route   GET /api/messages/job/:jobId
// @desc    Get messages for a job
// @access  Private
router.get('/job/:jobId', authMiddleware, getMessages);

// @route   GET /api/messages/conversation/:userId
// @desc    Get conversation with user
// @access  Private
router.get('/conversation/:userId', authMiddleware, getConversation);

module.exports = router;
