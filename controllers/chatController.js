const Conversation = require('../models/Conversation');
const Message      = require('../models/Message');
const Follow       = require('../models/Follow');

// GET /api/chat/conversations  → my conversations (only accepted follows)
const getConversations = async (req, res, next) => {
  try {
    const convos = await Conversation.find({ participants: req.user._id, isActive: true })
      .populate('participants', 'name avatar role')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1 });
    res.json({ success: true, conversations: convos });
  } catch (error) { next(error); }
};

// GET /api/chat/:conversationId/messages
const getMessages = async (req, res, next) => {
  try {
    const convo = await Conversation.findById(req.params.conversationId);
    if (!convo) return res.status(404).json({ success: false, message: 'Conversation not found' });

    const isParticipant = convo.participants.some(p => p.toString() === req.user._id.toString());
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Not authorized' });

    const messages = await Message.find({ conversation: req.params.conversationId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: 1 })
      .limit(100);

    // Mark as read
    await Message.updateMany(
      { conversation: req.params.conversationId, sender: { $ne: req.user._id }, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ success: true, messages });
  } catch (error) { next(error); }
};

// POST /api/chat/:conversationId/messages
const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ success: false, message: 'Message cannot be empty' });

    const convo = await Conversation.findById(req.params.conversationId);
    if (!convo) return res.status(404).json({ success: false, message: 'Conversation not found' });

    const isParticipant = convo.participants.some(p => p.toString() === req.user._id.toString());
    if (!isParticipant) return res.status(403).json({ success: false, message: 'Not authorized' });

    const message = await Message.create({
      conversation: convo._id,
      sender:       req.user._id,
      content:      content.trim(),
    });

    await message.populate('sender', 'name avatar');

    // Update conversation
    convo.lastMessage   = message._id;
    convo.lastMessageAt = new Date();
    await convo.save();

    res.status(201).json({ success: true, message });
  } catch (error) { next(error); }
};

// GET /api/chat/conversation-with/:userId  → find or return null
const getConversationWith = async (req, res, next) => {
  try {
    const convo = await Conversation.findOne({
      participants: { $all: [req.user._id, req.params.userId] },
      isActive: true,
    }).populate('participants', 'name avatar role');
    res.json({ success: true, conversation: convo });
  } catch (error) { next(error); }
};

module.exports = { getConversations, getMessages, sendMessage, getConversationWith };
