const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Interest = require('../Models/Interest'); // Adjust path as needed
const User = require('../Models/user-register'); // Adjust path as needed

// Send Interest
router.post('/send-interest', async (req, res) => {
  try {
    const { senderUserId, targetUserId } = req.body;

    if (!targetUserId || !senderUserId) {
      return res.status(400).json({
        success: false,
        message: 'Sender and target user IDs are required'
      });
    }

    if (senderUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send interest to yourself'
      });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found'
      });
    }

    const existingInterest = await Interest.findOne({
      senderUserId,
      targetUserId
    });

    if (existingInterest) {
      return res.status(409).json({
        success: false,
        message: 'Interest already sent to this user'
      });
    }

    const newInterest = new Interest({
      senderUserId,
      targetUserId,
      status: 'pending',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        platform: req.headers['x-platform'] || 'web'
      }
    });

    await newInterest.save();

    await newInterest.populate([
      { path: 'sender', select: 'fullName martialId image' },
      { path: 'target', select: 'fullName martialId image' }
    ]);

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

// Get sent interests
router.get('/sent-interests', async (req, res) => {
  try {
    const { userId, page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;
    const filter = { senderUserId: userId };

    if (status && ['pending', 'accepted', 'rejected', 'withdrawn'].includes(status)) {
      filter.status = status;
    }

    const interests = await Interest.find(filter)
      .populate({
        path: 'target',
        select: 'fullName martialId image age height education occupation caste profileStatus'
      })
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Interest.countDocuments(filter);

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
    console.error('Error fetching sent interests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch sent interests' });
  }
});

// Get received interests
router.get('/received-interests', async (req, res) => {
  try {
    const { userId, page = 1, limit = 20, status } = req.query;
    const skip = (page - 1) * limit;
    const filter = { targetUserId: userId };

    if (status && ['pending', 'accepted', 'rejected', 'withdrawn'].includes(status)) {
      filter.status = status;
    }

    const interests = await Interest.find(filter)
      .populate({
        path: 'sender',
        select: 'fullName martialId image age height education occupation caste profileStatus'
      })
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Interest.countDocuments(filter);

    await Interest.updateMany(
      { targetUserId: userId, isRead: false },
      { isRead: true }
    );

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
    console.error('Error fetching received interests:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch received interests' });
  }
});

// Respond to interest
router.patch('/respond-interest/:interestId', async (req, res) => {
  try {
    const { interestId } = req.params;
    const { userId, status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const interest = await Interest.findOne({
      _id: interestId,
      targetUserId: userId,
      status: 'pending'
    });

    if (!interest) {
      return res.status(404).json({ success: false, message: 'Interest not found or already responded' });
    }

    interest.status = status;
    interest.respondedAt = new Date();
    await interest.save();

    await interest.populate([
      { path: 'sender', select: 'fullName martialId image' },
      { path: 'target', select: 'fullName martialId image' }
    ]);

    res.json({
      success: true,
      message: `Interest ${status} successfully`,
      data: interest
    });

  } catch (error) {
    console.error('Error responding to interest:', error);
    res.status(500).json({ success: false, message: 'Failed to respond to interest' });
  }
});

// Withdraw interest
router.patch('/withdraw-interest/:interestId', async (req, res) => {
  try {
    const { interestId } = req.params;
    const { userId } = req.body;

    const interest = await Interest.findOne({
      _id: interestId,
      senderUserId: userId,
      status: 'pending'
    });

    if (!interest) {
      return res.status(404).json({ success: false, message: 'Interest not found or cannot be withdrawn' });
    }

    interest.status = 'withdrawn';
    await interest.save();

    res.json({ success: true, message: 'Interest withdrawn successfully', data: interest });

  } catch (error) {
    console.error('Error withdrawing interest:', error);
    res.status(500).json({ success: false, message: 'Failed to withdraw interest' });
  }
});

// Get interest stats
router.get('/interest-stats', async (req, res) => {
  try {
    const { userId } = req.query;

    const [sentStats, receivedStats] = await Promise.all([
      Interest.aggregate([
        { $match: { senderUserId: mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Interest.aggregate([
        { $match: { targetUserId: mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const formatStats = (stats) => {
      const result = { pending: 0, accepted: 0, rejected: 0, withdrawn: 0 };
      stats.forEach(stat => { result[stat._id] = stat.count; });
      return result;
    };

    const unreadCount = await Interest.countDocuments({
      targetUserId: userId,
      isRead: false
    });

    res.json({
      success: true,
      data: {
        sent: formatStats(sentStats),
        received: formatStats(receivedStats),
        unreadCount
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch interest statistics' });
  }
});

// Get specific interest
router.get('/interest/:interestId', async (req, res) => {
  try {
    const { interestId } = req.params;
    const { userId } = req.query;

    const interest = await Interest.findOne({
      _id: interestId,
      $or: [
        { senderUserId: userId },
        { targetUserId: userId }
      ]
    })
      .populate([
        { path: 'sender', select: 'fullName martialId image age height education occupation caste profileStatus' },
        { path: 'target', select: 'fullName martialId image age height education occupation caste profileStatus' }
      ]);

    if (!interest) {
      return res.status(404).json({ success: false, message: 'Interest not found' });
    }

    if (interest.targetUserId.toString() === userId && !interest.isRead) {
      interest.isRead = true;
      await interest.save();
    }

    res.json({ success: true, data: interest });

  } catch (error) {
    console.error('Error fetching interest details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch interest details' });
  }
});

module.exports = router;
