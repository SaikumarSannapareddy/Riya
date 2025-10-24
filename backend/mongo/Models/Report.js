const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Report Profile Schema
const reportSchema = new mongoose.Schema({
  reportedProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Profile'
  },
  reportedMartialId: {
    type: String,
    required: true
  },
  reporterBureauId: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: [
      'Inappropriate Content',
      'Fake Profile',
      'Spam or Scam',
      'Harassment',
      'Impersonation',
      'Misleading Information',
      'Other'
    ]
  },
  description: {
    type: String,
    default: ''
  },

  reportedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: String
  }
});



const ReportedProfile = mongoose.model('ReportedProfile', reportSchema);

module.exports = ReportedProfile;