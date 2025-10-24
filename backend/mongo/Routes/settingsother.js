const express = require('express');
const router = express.Router();
const Profile = require('../Models/user-register');


// POST route to update show other profiles setting
router.post('/showotherprofiles/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;
    const { showOtherProfiles } = req.body;

    // Validate input
    if (typeof showOtherProfiles !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'showOtherProfiles must be a boolean value'
      });
    }

    // Find and update the profile
    const profile = await Profile.findByIdAndUpdate(
      profileId,
      { showOtherProfiles: showOtherProfiles },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Log the change for audit purposes
    console.log(`Profile ${profileId} show other profiles changed to: ${showOtherProfiles ? 'Enabled' : 'Disabled'}`);

    res.status(200).json({
      success: true,
      message: `Show other profiles setting updated to ${showOtherProfiles ? 'enabled' : 'disabled'}`,
      data: {
        profileId: profile._id,
        showOtherProfiles: profile.showOtherProfiles,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error updating show other profiles setting:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating show other profiles setting',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});



// GET route to fetch show other profiles setting
router.get('/showotherprofiles/:profileId', async (req, res) => {
  try {
    const { profileId } = req.params;

    // Find the profile and return show other profiles setting
    const profile = await Profile.findById(profileId).select('showOtherProfiles fullName martialId');

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
        showOtherProfiles: profile.showOtherProfiles || false // Default to false if not set
      }
    });
  } catch (error) {
    console.error('Error fetching show other profiles setting:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching show other profiles setting',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;