const express = require('express');
const router = express.Router();
const Profile = require('../Models/user-register');

// POST route to update profile visibility
router.post('/visibletoall/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const { visibleToAll } = req.body;

    // Validate input
    if (typeof visibleToAll !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'visibleToAll must be a boolean value'
      });
    }

    // Find and update the profile
    const profile = await Profile.findByIdAndUpdate(
      profileId,
      { visibleToAll: visibleToAll },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Log the visibility change for audit purposes
    console.log(`Profile ${profileId} visibility changed to: ${visibleToAll ? 'Public' : 'Private'}`);

    res.status(200).json({
      success: true,
      message: `Profile visibility updated to ${visibleToAll ? 'public' : 'private'}`,
      data: {
        profileId: profile._id,
        visibleToAll: profile.visibleToAll,
        updatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error updating profile visibility:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating profile visibility',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET route to fetch profile visibility status
router.get('/visibletoall/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;

    // Find the profile and return only visibility status
    const profile = await Profile.findById(profileId).select('visibleToAll fullName martialId');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        profileId: profile._id,
        fullName: profile.fullName,
        martialId: profile.martialId,
        visibleToAll: profile.visibleToAll || false // Default to false if not set
      }
    });

  } catch (error) {
    console.error('Error fetching profile visibility:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching profile visibility',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET route to fetch all public profiles (for public listing)
router.get('/visibletoall/public/profiles', async (req, res) => {
  try {
    const { page = 1, limit = 20, gender, minAge, maxAge, caste, location } = req.query;
    
    // Build filter query
    let filter = { visibleToAll: true };
    
    if (gender) {
      filter.gender = gender;
    }
    
    if (caste) {
      filter.caste = new RegExp(caste, 'i'); // Case insensitive search
    }
    
    if (location) {
      filter.$or = [
        { district: new RegExp(location, 'i') },
        { state: new RegExp(location, 'i') },
        { originalLocation: new RegExp(location, 'i') }
      ];
    }

    // Age filter requires date calculation
    if (minAge || maxAge) {
      const currentDate = new Date();
      
      if (maxAge) {
        const minBirthDate = new Date(currentDate.getFullYear() - maxAge - 1, currentDate.getMonth(), currentDate.getDate());
        filter.dateOfBirth = { $gte: minBirthDate };
      }
      
      if (minAge) {
        const maxBirthDate = new Date(currentDate.getFullYear() - minAge, currentDate.getMonth(), currentDate.getDate());
        filter.dateOfBirth = { ...filter.dateOfBirth, $lte: maxBirthDate };
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch profiles with pagination
    const profiles = await Profile.find(filter)
      .select('-password -email') // Exclude sensitive data
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalProfiles = await Profile.countDocuments(filter);
    const totalPages = Math.ceil(totalProfiles / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        profiles,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProfiles,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching public profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching public profiles',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PATCH route to bulk update multiple profiles visibility
router.patch('/visibletoall/bulk', async (req, res) => {
  try {
    const { profileIds, visibleToAll } = req.body;

    // Validate input
    if (!Array.isArray(profileIds) || profileIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'profileIds must be a non-empty array'
      });
    }

    if (typeof visibleToAll !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'visibleToAll must be a boolean value'
      });
    }

    // Update multiple profiles
    const result = await Profile.updateMany(
      { _id: { $in: profileIds } },
      { visibleToAll: visibleToAll },
      { runValidators: true }
    );

    console.log(`Bulk update: ${result.modifiedCount} profiles visibility changed to: ${visibleToAll ? 'Public' : 'Private'}`);

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} profiles updated successfully`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        visibleToAll: visibleToAll,
        updatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during bulk update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;