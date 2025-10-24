const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Interest = require('../Models/Interestbybureau'); // Adjust path as needed
const User = require('../Models/user-register'); // Adjust path as needed

// Send Interest
router.post('/send-interestbybureau', async (req, res) => {
    try {
      const {  
        senderbureauId,
        targetbureauId,
        description,
        martialId,
        targetmartialId
      } = req.body;
  
      if (!senderbureauId || !targetbureauId) {
        return res.status(400).json({
          success: false,
          message: 'Sender and target Bureau IDs are required'
        });
      }
  
      if (!targetmartialId) {
        return res.status(400).json({
          success: false,
          message: 'Target martial ID is required'
        });
      }
  
      if (senderbureauId === targetbureauId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot send interest to yourself'
        });
      }
  
      const existingInterest = await Interest.findOne({
        targetbureauId,
        senderbureauId,
        martialId
      });
  
      if (existingInterest) {
        return res.status(409).json({
          success: false,
          message: 'Interest already sent to this user'
        });
      }
  
      const newInterest = new Interest({
        senderbureauId,
        targetbureauId,
        status: 'pending',
        description,
        martialId,
        targetmartialId
      });
  
      await newInterest.save();
  
      // Remove the populate since these are not ObjectId references
      // Just return the saved interest
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

// Add these new routes to your existing router


  
  // Get received notifications/interests for a bureau
  router.post('/get-notifications', async (req, res) => {
    try {
      const { bureauId } = req.body;
  
      if (!bureauId) {
        return res.status(400).json({
          success: false,
          message: 'Bureau ID is required'
        });
      }
  
      // Find all interests where this bureau is the target
      const interests = await Interest.find({
        targetbureauId: bureauId
      }).sort({ createdAt: -1 }); // Sort by newest first
  
      res.json({
        success: true,
        message: 'Notifications retrieved successfully',
        data: interests
      });
  
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notifications'
      });
    }
  });
  
  // Get sent interests for a bureau
  router.post('/get-sent-interests', async (req, res) => {
    try {
      const { bureauId } = req.body;
  
      if (!bureauId) {
        return res.status(400).json({
          success: false,
          message: 'Bureau ID is required'
        });
      }
  
      // Find all interests sent by this bureau
      const sentInterests = await Interest.find({
        senderbureauId: bureauId
      }).sort({ createdAt: -1 }); // Sort by newest first
  
      res.json({
        success: true,
        message: 'Sent interests retrieved successfully',
        data: sentInterests
      });
  
    } catch (error) {
      console.error('Error fetching sent interests:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sent interests'
      });
    }
  });
  
  // Update notification/interest status
  router.post('/update-notification-status', async (req, res) => {
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
  
      const updatedInterest = await Interest.findByIdAndUpdate(
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
        message: 'Notification status updated successfully',
        data: updatedInterest
      });
  
    } catch (error) {
      console.error('Error updating notification status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update notification status'
      });
    }
  });
  
  // Get notification count (pending notifications)
  router.post('/get-notification-count', async (req, res) => {
    try {
      const { bureauId } = req.body;
  
      if (!bureauId) {
        return res.status(400).json({
          success: false,
          message: 'Bureau ID is required'
        });
      }
  
      // Count pending notifications for this bureau
      const count = await Interest.countDocuments({
        targetbureauId: bureauId,
        status: 'pending'
      });
  
      res.json({
        success: true,
        message: 'Notification count retrieved successfully',
        count: count
      });
  
    } catch (error) {
      console.error('Error fetching notification count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch notification count'
      });
    }
  });
  
  // Mark all notifications as seen
  router.post('/mark-all-notifications-seen', async (req, res) => {
    try {
      const { bureauId } = req.body;
  
      if (!bureauId) {
        return res.status(400).json({
          success: false,
          message: 'Bureau ID is required'
        });
      }
  
      // Update all pending notifications to seen
      const result = await Interest.updateMany(
        {
          targetbureauId: bureauId,
          status: 'pending'
        },
        {
          status: 'seen',
          updatedAt: new Date()
        }
      );
  
      res.json({
        success: true,
        message: 'All notifications marked as seen',
        modifiedCount: result.modifiedCount
      });
  
    } catch (error) {
      console.error('Error marking notifications as seen:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notifications as seen'
      });
    }
  });
  
  // Get all interests with pagination (for detailed notifications page)
  router.post('/get-all-interests', async (req, res) => {
    try {
      const { bureauId, page = 1, limit = 10 } = req.body;
  
      if (!bureauId) {
        return res.status(400).json({
          success: false,
          message: 'Bureau ID is required'
        });
      }
  
      const skip = (page - 1) * limit;
  
      // Find all interests for this bureau with pagination
      const interests = await Interest.find({
        targetbureauId: bureauId
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
  
      // Get total count for pagination
      const totalCount = await Interest.countDocuments({
        targetbureauId: bureauId
      });
  
      res.json({
        success: true,
        message: 'All interests retrieved successfully',
        data: interests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount: totalCount,
          hasNextPage: skip + interests.length < totalCount,
          hasPrevPage: page > 1
        }
      });
  
    } catch (error) {
      console.error('Error fetching all interests:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch all interests'
      });
    }
  });



module.exports = router;
