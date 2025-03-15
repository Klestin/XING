import express from 'express';
import { Message } from '../models/Message';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get chat history with a specific user
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user?._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user?._id }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name photos')
    .populate('receiver', 'name photos');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a new message
router.post('/', auth, async (req, res) => {
  try {
    const message = new Message({
      ...req.body,
      sender: req.user?._id
    });
    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name photos')
      .populate('receiver', 'name photos');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ error: 'Failed to send message' });
  }
});

// Mark messages as read
router.patch('/read/:userId', auth, async (req, res) => {
  try {
    await Message.updateMany(
      {
        sender: req.params.userId,
        receiver: req.user?._id,
        read: false
      },
      { read: true }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Get unread message count
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user?._id,
      read: false
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

export default router; 