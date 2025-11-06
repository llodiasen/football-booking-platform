const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendMessage,
  getConversations,
  getConversation,
  getUnreadCount
} = require('../controllers/messageController');

// Routes protégées
router.use(protect);

// @route   POST /api/messages
router.post('/', sendMessage);

// @route   GET /api/messages/conversations
router.get('/conversations', getConversations);

// @route   GET /api/messages/conversation/:userId
router.get('/conversation/:userId', getConversation);

// @route   GET /api/messages/unread-count
router.get('/unread-count', getUnreadCount);

module.exports = router;

