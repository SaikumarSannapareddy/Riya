const mongoose = require('mongoose');

// Interest By Bureau Schema
const interestByBureauSchema = new mongoose.Schema({
  // Bureau IDs for tracking interest between organizations/bureaus
  senderbureauId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  martialId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  targetmartialId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  
  targetbureauId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  // Add ObjectId references if you want to populate user data
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Replace 'User' with your actual user model name
    required: false // Make optional if you want to keep the bureauId fields
  },

  target: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Replace 'User' with your actual user model name
    required: false // Make optional if you want to keep the bureauId fields
  },

  // Interest description/message between bureaus
  description: {
    type: String,
    required: false,
    trim: true,
  },

  // Interest status
  status: {
    type: String,
    enum: ['pending', 'accepted','seen', 'rejected'],
    default: 'pending',
    index: true
  },

  // Timestamp when interest was sent
  sentAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  collection: 'interestsbybureau'
});

// Create the model
const InterestsByBureau = mongoose.model('Interestbybureau', interestByBureauSchema);

module.exports = InterestsByBureau;