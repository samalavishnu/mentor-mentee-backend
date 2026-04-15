const express = require('express');
const router  = express.Router();
const { getConversations, getMessages, sendMessage, getConversationWith } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/conversations',              protect, getConversations);
router.get('/conversation-with/:userId',  protect, getConversationWith);
router.get('/:conversationId/messages',   protect, getMessages);
router.post('/:conversationId/messages',  protect, sendMessage);

module.exports = router;
