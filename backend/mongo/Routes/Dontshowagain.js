const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Interest = require('../Models/Interest'); // Adjust path as needed
const User = require('../Models/user-register'); // Adjust path as needed

// POST /api/dontshowagain
router.post('/dontshowagain', async (req, res) => {
    try {
      const { profileId, bureauId } = req.body;
  
      // Validate input
      if (!profileId || !bureauId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Profile ID and Bureau ID are required' 
        });
      }
  
      // Find the user profile by ID
      const user = await User.findById(profileId);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Profile not found' 
        });
      }
  
      // Initialize dontshowagain array if it doesn't exist
      if (!user.dontshowagain) {
        user.dontshowagain = [];
      }
  
      // Check if bureauId already exists in the array
      if (user.dontshowagain.includes(bureauId)) {
        return res.status(200).json({ 
          success: true, 
          message: 'Profile is already hidden for this bureau',
          user: {
            id: user._id,
            fullName: user.fullName,
            martialId: user.martialId,
            dontshowagain: user.dontshowagain
          }
        });
      }
  
      // Add bureauId to the dontshowagain array
      user.dontshowagain.push(bureauId);
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ 
        success: true, 
        message: 'Profile successfully hidden for this bureau',
        user: {
          id: user._id,
          fullName: user.fullName,
          martialId: user.martialId,
          dontshowagain: user.dontshowagain
        }
      });
    } catch (error) {
      console.error('Error in dontshowagain route:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      });
    }
});

// GET /api/dontshowagain/:profileId - Get the dontshowagain list for a user
router.get('/dontshowagain/:profileId', async (req, res) => {
    try {
      const { profileId } = req.params;
  
      // Validate input
      if (!profileId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Profile ID is required' 
        });
      }
  
      // Find the user profile by ID
      const user = await User.findById(profileId);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Profile not found' 
        });
      }
  
      res.status(200).json({ 
        success: true, 
        message: 'Dont show again list retrieved successfully',
        dontshowagain: user.dontshowagain || []
      });
    } catch (error) {
      console.error('Error in get dontshowagain route:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      });
    }
});

// DELETE /api/dontshowagain/:profileId/:bureauId - Remove a bureau from dontshowagain list
router.delete('/dontshowagain/:profileId/:bureauId', async (req, res) => {
    try {
      const { profileId, bureauId } = req.params;
  
      // Validate input
      if (!profileId || !bureauId) {
        return res.status(400).json({ 
          success: false, 
          message: 'Profile ID and Bureau ID are required' 
        });
      }
  
      // Find the user profile by ID
      const user = await User.findById(profileId);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Profile not found' 
        });
      }
  
      // Initialize dontshowagain array if it doesn't exist
      if (!user.dontshowagain) {
        user.dontshowagain = [];
      }
  
      // Check if bureauId exists in the array
      if (!user.dontshowagain.includes(bureauId)) {
        return res.status(200).json({ 
          success: true, 
          message: 'Bureau was not in the hidden list',
          user: {
            id: user._id,
            fullName: user.fullName,
            martialId: user.martialId,
            dontshowagain: user.dontshowagain
          }
        });
      }
  
      // Remove bureauId from the dontshowagain array
      user.dontshowagain = user.dontshowagain.filter(id => id !== bureauId);
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({ 
        success: true, 
        message: 'Profile is now visible for this bureau',
        user: {
          id: user._id,
          fullName: user.fullName,
          martialId: user.martialId,
          dontshowagain: user.dontshowagain
        }
      });
    } catch (error) {
      console.error('Error in remove dontshowagain route:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      });
    }
});

module.exports = router;
