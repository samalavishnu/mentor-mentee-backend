const { Server } = require('socket.io');
const jwt        = require('jsonwebtoken');
const Message    = require('./models/Message');
const Conversation = require('./models/Conversation');
const { createCorsOriginValidator } = require('./utils/cors');

const userSocketMap = {}; // userId -> socketId

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: createCorsOriginValidator(),
      credentials: true,
    },
  });

  // Auth middleware for socket
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch { next(new Error('Invalid token')); }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    userSocketMap[userId] = socket.id;
    console.log(`🔌 User connected: ${userId}`);

    // Join user's personal room
    socket.join(userId);

    // Send/receive messages
    socket.on('send_message', async ({ conversationId, content }) => {
      try {
        const convo = await Conversation.findById(conversationId);
        if (!convo) return;
        const isParticipant = convo.participants.some(p => p.toString() === userId);
        if (!isParticipant) return;

        const message = await Message.create({ conversation: conversationId, sender: userId, content });
        await message.populate('sender', 'name avatar');

        convo.lastMessage   = message._id;
        convo.lastMessageAt = new Date();
        await convo.save();

        // Emit to all conversation participants
        convo.participants.forEach(participantId => {
          io.to(participantId.toString()).emit('new_message', {
            conversationId,
            message,
          });
        });
      } catch (err) { console.error('Socket send_message error:', err); }
    });

    // Typing indicator
    socket.on('typing', ({ conversationId, recipientId }) => {
      socket.to(recipientId).emit('user_typing', { conversationId, userId });
    });
    socket.on('stop_typing', ({ recipientId }) => {
      socket.to(recipientId).emit('user_stop_typing', { userId });
    });

    socket.on('disconnect', () => {
      delete userSocketMap[userId];
      console.log(`🔌 User disconnected: ${userId}`);
    });
  });

  return io;
}

module.exports = initSocket;
