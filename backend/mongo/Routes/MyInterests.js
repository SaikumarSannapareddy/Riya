const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MyInterest = require('../Models/MyInterest');
const User = require('../Models/user-register');

// Send Interest within same bureau
router.post('/send-my-interest', async (req, res) => {
  try {
    const { 
      bureauId,
      senderMartialId,
      targetMartialId,
      description 
    } = req.body;

    if (!bureauId || !senderMartialId || !targetMartialId || !description) {
      return res.status(400).json({
        success: false,
        message: 'Bureau ID, sender martial ID, target martial ID, and description are required'
      });
    }

    if (senderMartialId === targetMartialId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send interest to yourself'
      });
    }

    // Check if interest already exists
    const existingInterest = await MyInterest.findOne({
      bureauId,
      senderMartialId,
      targetMartialId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingInterest) {
      return res.status(409).json({
        success: false,
        message: 'Interest already sent to this profile'
      });
    }

    // Get user references if they exist
    let senderUser = null;
    let targetUser = null;

    try {
      senderUser = await User.findOne({ martialId: senderMartialId });
      targetUser = await User.findOne({ martialId: targetMartialId });
    } catch (error) {
      console.log('User lookup failed, continuing without user references');
    }

    const newInterest = new MyInterest({
      bureauId,
      senderMartialId,
      targetMartialId,
      description,
      sender: senderUser ? senderUser._id : null,
      target: targetUser ? targetUser._id : null,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        platform: req.headers['x-platform'] || 'web'
      }
    });

    await newInterest.save();

    res.json({
      success: true,
      message: 'Interest sent successfully',
      data: newInterest
    });

  } catch (error) {
    console.error('Error sending interest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send interest'
    });
  }
});

// Get received interests for a bureau (same bureau)
router.post('/get-my-notifications', async (req, res) => {
  try {
    const { bureauId } = req.body;

    if (!bureauId) {
      return res.status(400).json({
        success: false,
        message: 'Bureau ID is required'
      });
    }

    // Find all interests where this bureau is the target (received interests)
    const interests = await MyInterest.find({
      bureauId: bureauId
    }).sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      success: true,
      message: 'My notifications retrieved successfully',
      data: interests
    });

  } catch (error) {
    console.error('Error fetching my notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch my notifications'
    });
  }
});

// Get sent interests for a bureau (same bureau)
router.post('/get-my-sent-interests', async (req, res) => {
  try {
    const { bureauId } = req.body;

    if (!bureauId) {
      return res.status(400).json({
        success: false,
        message: 'Bureau ID is required'
      });
    }

    // Find all interests sent by this bureau (same bureau)
    const sentInterests = await MyInterest.find({
      bureauId: bureauId
    }).sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      success: true,
      message: 'My sent interests retrieved successfully',
      data: sentInterests
    });

  } catch (error) {
    console.error('Error fetching my sent interests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch my sent interests'
    });
  }
});

// Update my notification/interest status
router.post('/update-my-notification-status', async (req, res) => {
  try {
    const { interestId, status } = req.body;

    if (!interestId || !status) {
      return res.status(400).json({
        success: false,
        message: 'Interest ID and status are required'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'seen', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, seen, accepted, rejected'
      });
    }

    const updatedInterest = await MyInterest.findByIdAndUpdate(
      interestId,
      { 
        status: status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedInterest) {
      return res.status(404).json({
        success: false,
        message: 'Interest not found'
      });
    }

    res.json({
      success: true,
      message: 'My notification status updated successfully',
      data: updatedInterest
    });

  } catch (error) {
    console.error('Error updating my notification status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update my notification status'
    });
  }
});

// Get my notification count (pending notifications)
router.post('/get-my-notification-count', async (req, res) => {
  try {
    const { bureauId } = req.body;

    if (!bureauId) {
      return res.status(400).json({
        success: false,
        message: 'Bureau ID is required'
      });
    }

    const count = await MyInterest.countDocuments({
      bureauId: bureauId,
      status: 'pending'
    });

    res.json({
      success: true,
      count: count
    });

  } catch (error) {
    console.error('Error fetching my notification count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch my notification count'
    });
  }
});

// Mark all my notifications as seen
router.post('/mark-all-my-notifications-seen', async (req, res) => {
  try {
    const { bureauId } = req.body;

    if (!bureauId) {
      return res.status(400).json({
        success: false,
        message: 'Bureau ID is required'
      });
    }

    const result = await MyInterest.updateMany(
      { 
        bureauId: bureauId,
        status: 'pending'
      },
      { 
        status: 'seen',
        updatedAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'All my notifications marked as seen',
      updatedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error marking all my notifications as seen:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all my notifications as seen'
    });
  }
});

// Get all my interests with pagination and filters
router.post('/get-all-my-interests', async (req, res) => {
  try {
    const { 
      bureauId, 
      page = 1, 
      limit = 20, 
      status,
      type = 'all' // 'received', 'sent', or 'all'
    } = req.body;

    if (!bureauId) {
      return res.status(400).json({
        success: false,
        message: 'Bureau ID is required'
      });
    }

    const skip = (page - 1) * limit;
    const filter = { bureauId: bureauId };

    // Add status filter if provided
    if (status && ['pending', 'seen', 'accepted', 'rejected'].includes(status)) {
      filter.status = status;
    }

    // Add type filter if provided
    if (type === 'received') {
      // For received interests, we can add additional filters if needed
    } else if (type === 'sent') {
      // For sent interests, we can add additional filters if needed
    }

    const interests = await MyInterest.find(filter)
      .populate('sender', 'fullName martialId image age height education occupation caste')
      .populate('target', 'fullName martialId image age height education occupation caste')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await MyInterest.countDocuments(filter);

    res.json({
      success: true,
      data: interests,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching all my interests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch all my interests'
    });
  }
});

// Delete my interest
router.delete('/delete-my-interest/:interestId', async (req, res) => {
  try {
    const { interestId } = req.params;

    const deletedInterest = await MyInterest.findByIdAndDelete(interestId);

    if (!deletedInterest) {
      return res.status(404).json({
        success: false,
        message: 'Interest not found'
      });
    }

    res.json({
      success: true,
      message: 'Interest deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting my interest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete my interest'
    });
  }
});

module.exports = router; 