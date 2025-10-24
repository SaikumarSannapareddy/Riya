const mongoose = require('mongoose');
const InterestSchema = new mongoose.Schema({ 
  senderUserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  targetUserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, 
  message: { 
    type: String, 
    maxlength: 500, 
    default: '' 
  }, 
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'], 
    default: 'pending' 
  }, 
  sentAt: { 
    type: Date, 
    default: Date.now 
  }, 
  respondedAt: { 
    type: Date, 
    default: null 
  }, 
  isRead: { 
    type: Boolean, 
    default: false 
  }, 
  metadata: { 
    ipAddress: String, 
    userAgent: String, 
    platform: String 
  } 
}, { 
  timestamps: true 
});

// Create compound index to prevent duplicate interests 
InterestSchema.index({ senderUserId: 1, targetUserId: 1 }, { unique: true });

// Create indexes for better query performance 
InterestSchema.index({ targetUserId: 1, status: 1 }); 
InterestSchema.index({ senderUserId: 1, status: 1 }); 
InterestSchema.index({ sentAt: -1 });

// Virtual for populating sender details 
InterestSchema.virtual('sender', { 
  ref: 'User', 
  localField: 'senderUserId', 
  foreignField: '_id', 
  justOne: true 
});

// Virtual for populating target details 
InterestSchema.virtual('target', { 
  ref: 'User', 
  localField: 'targetUserId', 
  foreignField: '_id', 
  justOne: true 
});

// Ensure virtual fields are serialized 
InterestSchema.set('toJSON', { virtuals: true }); 
InterestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Interest', InterestSchema);