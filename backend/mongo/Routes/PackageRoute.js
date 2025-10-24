const express = require('express');
const router = express.Router();
const PackageDetails = require('../Models/package-details');
const User = require('../Models/user-register');

// Get package details for a user
router.get('/package/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get package details
    let packageDetails = await PackageDetails.findOne({ userId });
    
    // If no package exists and user is free, return null
    if (!packageDetails && user.servicePreference === 'free') {
      return res.status(200).json({
        success: true,
        data: null
      });
    }
    
    // If no package exists but user has a service preference, create one
    if (!packageDetails && user.servicePreference !== 'free') {
      packageDetails = new PackageDetails({
        userId: user._id,
        martialId: user.martialId,
        fullName: user.fullName,
        bureauId: user.bureauId,
        servicePreference: user.servicePreference,
        membershipType: 'free',
        createdBy: user.bureauId || 'system'
      });
      
      await packageDetails.save();
    }
    
    res.status(200).json({
      success: true,
      data: packageDetails
    });
  } catch (error) {
    console.error('Error fetching package details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all packages for a bureau
router.get('/bureau/:bureauId', async (req, res) => {
  try {
    const { bureauId } = req.params;
    
    const packages = await PackageDetails.find({ bureauId })
      .populate('userId', 'fullName martialId image gender')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: packages
    });
  } catch (error) {
    console.error('Error fetching bureau packages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update package details
router.post('/package', async (req, res) => {
  try {
    const {
      userId,
      servicePreference,
      membershipType,
      packageDetails,
      contactVisibility,
      contactCounter,
      notes
    } = req.body;
    
    // Validate service preference
    const validServicePreferences = ['only_online', 'only_offline', 'online_offline'];
    if (servicePreference && !validServicePreferences.includes(servicePreference)) {
      return res.status(400).json({ 
        message: 'Invalid service preference. Must be one of: only_online, only_offline, online_offline' 
      });
    }
    
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if package already exists
    let existingPackage = await PackageDetails.findOne({ userId });
    
    if (existingPackage) {
      // Update existing package
      existingPackage.servicePreference = servicePreference;
      existingPackage.membershipType = membershipType;
      existingPackage.packageDetails = { ...existingPackage.packageDetails, ...packageDetails };
      existingPackage.contactVisibility = { ...existingPackage.contactVisibility, ...contactVisibility };
      existingPackage.contactCounter = contactCounter;
      existingPackage.notes = notes;
      existingPackage.updatedBy = user.bureauId || 'system';
      
      // Ensure package remains active if it was already active
      if (existingPackage.isActive) {
        existingPackage.paymentStatus = 'completed';
      }
      
      await existingPackage.save();
      
      res.status(200).json({
        success: true,
        message: 'Package updated successfully',
        data: existingPackage
      });
    } else {
      // Create new package
      const newPackage = new PackageDetails({
        userId: user._id,
        martialId: user.martialId,
        fullName: user.fullName,
        bureauId: user.bureauId,
        servicePreference,
        membershipType,
        packageDetails,
        contactVisibility,
        contactCounter,
        notes,
        createdBy: user.bureauId || 'system',
        isActive: true,
        paymentStatus: 'completed',
        activatedAt: new Date()
      });
      
      // Calculate expiry date based on validity days
      let validityDays = 0;
      if (servicePreference === 'only_online') {
        validityDays = packageDetails?.validityDays || 0;
      } else if (servicePreference === 'only_offline') {
        validityDays = packageDetails?.validityDays || 0;
      } else if (servicePreference === 'online_offline') {
        validityDays = packageDetails?.combinedValidityDays || 0;
      }
      
      if (validityDays > 0) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + validityDays);
        newPackage.expiresAt = expiryDate;
      }
      
      await newPackage.save();
      
      // Update user's service preference
      await User.findByIdAndUpdate(userId, {
        servicePreference: servicePreference
      });
      
      res.status(201).json({
        success: true,
        message: 'Package created and activated successfully',
        data: newPackage
      });
    }
  } catch (error) {
    console.error('Error creating/updating package:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Activate package
router.post('/package/:userId/activate', async (req, res) => {
  try {
    const { userId } = req.params;
    const { paymentStatus } = req.body;
    
    const packageDetails = await PackageDetails.findOne({ userId });
    if (!packageDetails) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    packageDetails.isActive = true;
    packageDetails.paymentStatus = 'completed'; // Always set to completed when activating
    packageDetails.activatedAt = new Date();
    
    // Calculate expiry date based on validity days
    let validityDays = 0;
    if (packageDetails.servicePreference === 'only_online') {
      validityDays = packageDetails.packageDetails.validityDays || 0;
    } else if (packageDetails.servicePreference === 'only_offline') {
      validityDays = packageDetails.packageDetails.validityDays || 0;
    } else if (packageDetails.servicePreference === 'online_offline') {
      validityDays = packageDetails.packageDetails.combinedValidityDays || 0;
    }
    
    if (validityDays > 0) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + validityDays);
      packageDetails.expiresAt = expiryDate;
    }
    
    await packageDetails.save();
    
    // Update user's service preference
    await User.findByIdAndUpdate(userId, {
      servicePreference: packageDetails.servicePreference
    });
    
    res.status(200).json({
      success: true,
      message: 'Package activated successfully!',
      data: packageDetails
    });
  } catch (error) {
    console.error('Error activating package:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Deactivate package (move to free)
router.post('/package/:userId/deactivate', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const packageDetails = await PackageDetails.findOne({ userId });
    if (!packageDetails) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    // Delete the package details record for free users to keep database clean
    await PackageDetails.findByIdAndDelete(packageDetails._id);
    
    // Update user's service preference to free
    await User.findByIdAndUpdate(userId, {
      servicePreference: 'free'
    });
    
    res.status(200).json({
      success: true,
      message: 'Profile moved to free membership successfully',
      data: null
    });
  } catch (error) {
    console.error('Error deactivating package:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available profiles for contact visibility (only online service profiles)
router.get('/available-profiles/:bureauId', async (req, res) => {
  try {
    const { bureauId } = req.params;
    
    // Get all paid online service profiles from this bureau
    const availableProfiles = await PackageDetails.find({
      bureauId,
      membershipType: 'paid',
      servicePreference: { $in: ['only_online', 'online_offline'] },
      isActive: true,
      'packageDetails.visibleContactNumbers': { $gt: 0 }
    }).populate('userId', 'fullName martialId image gender mobileNumber email');
    
    res.status(200).json({
      success: true,
      data: availableProfiles
    });
  } catch (error) {
    console.error('Error fetching available profiles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact visibility settings
router.put('/package/:userId/contact-visibility', async (req, res) => {
  try {
    const { userId } = req.params;
    const { contactVisibility, contactCounter } = req.body;
    
    const packageDetails = await PackageDetails.findOne({ userId });
    if (!packageDetails) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    if (contactVisibility) {
      packageDetails.contactVisibility = { ...packageDetails.contactVisibility, ...contactVisibility };
    }
    
    if (contactCounter !== undefined) {
      packageDetails.contactCounter = contactCounter;
    }
    
    await packageDetails.save();
    
    res.status(200).json({
      success: true,
      message: 'Contact settings updated successfully',
      data: packageDetails
    });
  } catch (error) {
    console.error('Error updating contact settings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Increment views count for package
router.post('/package/:userId/increment-views', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const packageDetails = await PackageDetails.findOne({ userId });
    if (!packageDetails) {
      // If no package exists, this is a free user, so just return success
      return res.status(200).json({
        success: true,
        message: 'No package found (free user)',
        viewsCount: 0
      });
    }
    
    // Increment views count
    packageDetails.viewsCount = (packageDetails.viewsCount || 0) + 1;
    packageDetails.lastViewedAt = new Date();
    
    await packageDetails.save();
    
    res.status(200).json({
      success: true,
      message: 'Views incremented successfully',
      viewsCount: packageDetails.viewsCount
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check and update expired packages
router.post('/package/check-expired', async (req, res) => {
  try {
    const now = new Date();
    
    // Find all active packages that have expired
    const expiredPackages = await PackageDetails.find({
      isActive: true,
      expiresAt: { $lt: now }
    });
    
    // Delete expired packages and update user service preferences to free
    if (expiredPackages.length > 0) {
      const userIds = expiredPackages.map(pkg => pkg.userId);
      
      // Delete expired package records
      await PackageDetails.deleteMany({
        isActive: true,
        expiresAt: { $lt: now }
      });
      
      // Update user service preferences to free
      await User.updateMany(
        { _id: { $in: userIds } },
        { servicePreference: 'free' }
      );
    }
    
    res.status(200).json({
      success: true,
      message: `Updated ${expiredPackages.length} expired packages`,
      expiredCount: expiredPackages.length
    });
  } catch (error) {
    console.error('Error checking expired packages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Function to automatically check expired packages (can be called by cron job)
const checkExpiredPackagesAutomatically = async () => {
  try {
    const now = new Date();
    
    // Find all active packages that have expired
    const expiredPackages = await PackageDetails.find({
      isActive: true,
      expiresAt: { $lt: now }
    });
    
    // Delete expired packages and update user service preferences to free
    if (expiredPackages.length > 0) {
      const userIds = expiredPackages.map(pkg => pkg.userId);
      
      // Delete expired package records
      await PackageDetails.deleteMany({
        isActive: true,
        expiresAt: { $lt: now }
      });
      
      // Update user service preferences to free
      await User.updateMany(
        { _id: { $in: userIds } },
        { servicePreference: 'free' }
      );
      
      console.log(`Automatically deleted ${expiredPackages.length} expired packages`);
    }
  } catch (error) {
    console.error('Error in automatic expired package check:', error);
  }
};

// Update package status and payment status
router.put('/package/:packageId', async (req, res) => {
  try {
    const { packageId } = req.params;
    const { isActive, paymentStatus } = req.body;
    
    const packageDetails = await PackageDetails.findById(packageId);
    if (!packageDetails) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    if (isActive !== undefined) {
      packageDetails.isActive = isActive;
    }
    
    if (paymentStatus) {
      packageDetails.paymentStatus = paymentStatus;
    }
    
    // If activating, set activation date
    if (isActive && !packageDetails.activatedAt) {
      packageDetails.activatedAt = new Date();
    }
    
    await packageDetails.save();
    
    res.status(200).json({
      success: true,
      message: 'Package status updated successfully',
      data: packageDetails
    });
  } catch (error) {
    console.error('Error updating package status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export the function for use in other parts of the application
module.exports = { router, checkExpiredPackagesAutomatically }; 