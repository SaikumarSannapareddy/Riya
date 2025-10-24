const mongoose = require("mongoose");
const { Schema } = mongoose;

const packageDetailsSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    martialId: { 
      type: String, 
      required: true 
    },
    fullName: { 
      type: String, 
      required: true 
    },
    bureauId: { 
      type: String, 
      required: true 
    },
    
    // Service Preference
    servicePreference: {
      type: String,
      enum: ['only_online', 'only_offline', 'online_offline'],
      required: true
    },
    
    // Membership Type
    membershipType: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free'
    },
    
    // Package Details based on service preference
    packageDetails: {
      // For only_online service
      payingAmount: { type: Number, default: 0 },
      visibleContactNumbers: { type: Number, default: 0 },
      validityDays: { type: Number, default: 0 },
      
      // For only_offline service
      registrationFees: { type: Number, default: 0 },
      goodwillAmount: { type: Number, default: 0 },
      
      // For online_offline service
      onlinePayingAmount: { type: Number, default: 0 },
      offlineRegistrationFees: { type: Number, default: 0 },
      offlineGoodwillAmount: { type: Number, default: 0 },
      combinedValidityDays: { type: Number, default: 0 },
      combinedVisibleContactNumbers: { type: Number, default: 0 }
    },
    
    // Payment Status
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'expired'],
      default: 'pending'
    },
    
    // Package Activation
    isActive: { 
      type: Boolean, 
      default: false 
    },
    activatedAt: { 
      type: Date 
    },
    expiresAt: { 
      type: Date 
    },
    
    // Views tracking
    viewsCount: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    lastViewedAt: { 
      type: Date 
    },
    
    // Contact visibility settings
    contactVisibility: {
      showMobile: { type: Boolean, default: false },
      showEmail: { type: Boolean, default: false },
      showWhatsapp: { type: Boolean, default: false }
    },
    
    // Contact counter for visibility
    contactCounter: { type: Number, default: 0, min: 0 },
    
    // Additional notes
    notes: { 
      type: String 
    },
    
    // Created and updated by
    createdBy: { 
      type: String, 
      required: true 
    },
    updatedBy: { 
      type: String 
    }
  },
  { timestamps: true }
);

// Index for efficient queries
packageDetailsSchema.index({ userId: 1 });
packageDetailsSchema.index({ martialId: 1 });
packageDetailsSchema.index({ bureauId: 1 });
packageDetailsSchema.index({ membershipType: 1 });
packageDetailsSchema.index({ servicePreference: 1 });

const PackageDetails = mongoose.model("PackageDetails", packageDetailsSchema);

module.exports = PackageDetails; 