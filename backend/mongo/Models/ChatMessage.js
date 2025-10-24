const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
chatMessageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema); 