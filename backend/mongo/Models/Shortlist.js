// models/Shortlist.js
const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  shortlistedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'removed'],
    default: 'active',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for better query performance
shortlistSchema.index({ userId: 1, shortlistedUserId: 1 }, { unique: true });
shortlistSchema.index({ userId: 1, status: 1 });
shortlistSchema.index({ shortlistedUserId: 1 });

// Update the updatedAt field before saving
shortlistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to check if user is shortlisted
shortlistSchema.statics.isShortlisted = async function(userId, shortlistedUserId) {
  const shortlist = await this.findOne({
    userId: userId,
    shortlistedUserId: shortlistedUserId,
    status: 'active'
  });
  return !!shortlist;
};

// Static method to get shortlist count for a user
shortlistSchema.statics.getShortlistCount = async function(userId) {
  return await this.countDocuments({
    userId: userId,
    status: 'active'
  });
};

const Shortlist = mongoose.model('Shortlist', shortlistSchema);

module.exports = Shortlist;