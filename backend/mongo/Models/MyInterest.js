const mongoose = require('mongoose');

// My Interest Schema - For interests within the same bureau
const myInterestSchema = new mongoose.Schema({
  // Bureau ID (same for both sender and receiver since it's within the same bureau)
  bureauId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  
  // Martial IDs for the profiles involved
  senderMartialId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  
  targetMartialId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  // Add ObjectId references for user data
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },

  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },

  // Interest description/message
  description: {
    type: String,
    required: true,
    trim: true,
  },

  // Interest status
  status: {
    type: String,
    enum: ['pending', 'seen', 'accepted', 'rejected'],
    default: 'pending',
    index: true
  },

  // Timestamp when interest was sent
  sentAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  // Additional metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    platform: {
      type: String,
      default: 'web'
    }
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  collection: 'myinterests'
});

// Create indexes for better query performance
myInterestSchema.index({ bureauId: 1, status: 1 });
myInterestSchema.index({ senderMartialId: 1, targetMartialId: 1 });
myInterestSchema.index({ createdAt: -1 });

// Create the model
const MyInterest = mongoose.model('MyInterest', myInterestSchema);

module.exports = MyInterest; 