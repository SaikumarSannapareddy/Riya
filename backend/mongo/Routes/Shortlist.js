// routes/shortlist.js
const express = require('express');
const router = express.Router();
const Shortlist = require('../Models/Shortlist'); // Shortlist model
const User = require('../Models/user-register'); // User model

const mongoose = require('mongoose');
// Add to shortlist
router.post('/add', async (req, res) => {
  try {
    const { userId, shortlistedUserId, status = 'active' } = req.body;

    if (!userId || !shortlistedUserId) {
      return res.status(400).json({
        success: false,
        message: 'User ID and shortlisted user ID are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const shortlistedUser = await User.findById(shortlistedUserId);
    if (!shortlistedUser) {
      return res.status(404).json({
        success: false,
        message: 'Shortlisted user not found'
      });
    }

    if (userId === shortlistedUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot shortlist yourself'
      });
    }

    const existingShortlist = await Shortlist.findOne({
      userId,
      shortlistedUserId
    });

    if (existingShortlist) {
      return res.status(400).json({
        success: false,
        message: 'User already in shortlist'
      });
    }

    const newShortlist = new Shortlist({
      userId,
      shortlistedUserId,
      status,
      createdAt: new Date()
    });

    await newShortlist.save();

    const populatedShortlist = await Shortlist.findById(newShortlist._id)
      .populate('shortlistedUserId', 'fullName martialId image profileStatus')
      .populate('userId', 'fullName martialId');

    res.status(201).json({
      success: true,
      message: 'User added to shortlist successfully',
      data: populatedShortlist
    });

  } catch (error) {
    console.error('Error adding to shortlist:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get user's shortlist
router.get('/list/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const shortlist = await Shortlist.find({ 
      userId, 
      status: 'active' 
    })
    .populate('shortlistedUserId', 'fullName martialId image profileStatus caste education occupation annualIncome height dateOfBirth views')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Shortlist.countDocuments({ 
      userId, 
      status: 'active' 
    });

    res.status(200).json({
      success: true,
      data: shortlist,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching shortlist:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Remove from shortlist
// Put this FIRST in your shortlist routes file

router.delete('/remove', async (req, res) => {
  try {
    const { userId, shortListedId } = req.body;

    console.log('DELETE /remove called with:', { userId, shortListedId });

    if (!userId || !shortListedId) {
      return res.status(400).json({
        success: false,
        message: 'User ID and shortlisted user ID are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(shortListedId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid shortlist entry ID'
      });
    }

    const shortlist = await Shortlist.findOneAndDelete({
      _id: shortListedId,
      userId: userId
    });

    if (!shortlist) {
      return res.status(404).json({
        success: false,
        message: 'Shortlist entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User removed from shortlist successfully'
    });

  } catch (error) {
    console.error('Error removing from shortlist:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});


// Check if user is shortlisted
router.get('/check/:userId/:shortlistedUserId', async (req, res) => {
  try {
    const { userId, shortlistedUserId } = req.params;

    const shortlist = await Shortlist.findOne({
      userId,
      shortlistedUserId,
      status: 'active'
    });

    res.status(200).json({
      success: true,
      isShortlisted: !!shortlist,
      data: shortlist
    });

  } catch (error) {
    console.error('Error checking shortlist:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;
