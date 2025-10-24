const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// Shortlist Profile Schema
const shortlistSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Profile'
  },
  martialId: {
    type: String,
    required: true
  },
  bureauId: {
    type: String,
    required: true
  },

  note: {
    type: String,
    default: ''
  },
  shortlistedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'contacted', 'interested', 'not_interested', 'removed'],
    default: 'active'
  },
  contactedAt: {
    type: Date
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});



const ShortlistedProfile = mongoose.model('ShortlistedProfile', shortlistSchema);

module.exports = ShortlistedProfile;