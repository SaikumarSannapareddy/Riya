const express = require('express');
const ChatMessage = require('../Models/ChatMessage');
const router = express.Router();

// Get all chat messages
router.get('/chat-messages', async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single chat message by ID
router.get('/chat-messages/:id', async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    console.error('Error fetching chat message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new chat message
router.post('/chat-messages', async (req, res) => {
  try {
    const { messageId, message } = req.body;
    
    if (!messageId || !message) {
      return res.status(400).json({ message: 'Message ID and message are required' });
    }

    // Check if messageId already exists
    const existingMessage = await ChatMessage.findOne({ messageId });
    if (existingMessage) {
      return res.status(400).json({ message: 'Message ID already exists' });
    }

    const newMessage = new ChatMessage({
      messageId,
      message
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error creating chat message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a chat message
router.put('/chat-messages/:id', async (req, res) => {
  try {
    const { messageId, message } = req.body;
    
    if (!messageId || !message) {
      return res.status(400).json({ message: 'Message ID and message are required' });
    }

    // Check if messageId already exists for another document
    const existingMessage = await ChatMessage.findOne({ 
      messageId, 
      _id: { $ne: req.params.id } 
    });
    if (existingMessage) {
      return res.status(400).json({ message: 'Message ID already exists' });
    }

    const updatedMessage = await ChatMessage.findByIdAndUpdate(
      req.params.id,
      { messageId, message },
      { new: true, runValidators: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error('Error updating chat message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a chat message
router.delete('/chat-messages/:id', async (req, res) => {
  try {
    const deletedMessage = await ChatMessage.findByIdAndDelete(req.params.id);
    
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 