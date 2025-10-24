
// POST: Report a profile
const express = require('express');
const router = express.Router();
const ReportedProfile = require('../Models/Report'); // Shortlist model
const ShortlistedProfile = require('../Models/Bureaushortlist'); // Shortlist model


router.post('/profiles/report', async (req, res) => {
  try {
    console.log("Received report request:", req.body);  // 👈 Log request body

    const {
      reportedProfileId,
      reportedMartialId,
      reporterBureauId,
      reason,
      description,
      reportedProfileName
    } = req.body;

    // Validate required fields
    if (!reportedProfileId || !reportedMartialId || !reporterBureauId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if this bureau already reported this profile
    const existingReport = await ReportedProfile.findOne({
      reportedProfileId,
      reporterBureauId
    });

    if (existingReport) {
      return res.status(409).json({
        success: false,
        message: 'You have already reported this profile'
      });
    }

    // Create new report
    const newReport = new ReportedProfile({
      reportedProfileId,
      reportedMartialId,
      reporterBureauId,
      reason,
      description: description || '',
      reportedProfileName,
      reportedAt: new Date()
    });

    await newReport.save();

    res.status(201).json({
      success: true,
      message: 'Profile reported successfully',
      reportId: newReport._id
    });

  } catch (error) {
    console.error('Error reporting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

  
  // POST: Shortlist a profile
  router.post('/profiles/shortlist', async (req, res) => {
    try {
      const {
        profileId,
        martialId,
        bureauId,
        profileName,
        note
      } = req.body;
  
      // Validate required fields
      if (!profileId || !martialId || !bureauId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }
  
      // Check if this profile is already shortlisted by this bureau
      const existingShortlist = await ShortlistedProfile.findOne({
        profileId,
        bureauId
      });
  
      if (existingShortlist) {
        return res.status(409).json({
          success: false,
          message: 'Profile is already in your shortlist'
        });
      }
  
      // Create new shortlist entry
      const newShortlist = new ShortlistedProfile({
        profileId,
        martialId,
        bureauId,
        profileName,
        note: note || '',
        shortlistedAt: new Date()
      });
  
      await newShortlist.save();
  
      res.status(201).json({
        success: true,
        message: 'Profile shortlisted successfully',
        shortlistId: newShortlist._id
      });
  
    } catch (error) {
      console.error('Error shortlisting profile:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  });
  

  
  // GET: Get shortlisted profiles for a bureau
  router.get('/profiles/shortlist/:bureauId', async (req, res) => {
    try {
      const { bureauId } = req.params;
      const { page = 1, limit = 20, status = 'all' } = req.query;
  
      let filter = { bureauId };
      if (status !== 'all') {
        filter.status = status;
      }
  
      const shortlisted = await ShortlistedProfile.find(filter)
        .select('profileId martialId bureauId note shortlistedAt status lastUpdated') // Select the fields you need
        .sort({ shortlistedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
  
      const total = await ShortlistedProfile.countDocuments(filter);
  
      res.json({
        success: true,
        data: shortlisted,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalShortlisted: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      });
  
    } catch (error) {
      console.error('Error fetching shortlisted profiles:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
});
  


  
  // DELETE: Remove from shortlist
  router.delete('/profiles/shortlist/:shortlistId', async (req, res) => {
    try {
      const { shortlistId } = req.params;
  
      const deletedShortlist = await ShortlistedProfile.findByIdAndDelete(shortlistId);
  
      if (!deletedShortlist) {
        return res.status(404).json({
          success: false,
          message: 'Shortlist entry not found'
        });
      }
  
      res.json({
        success: true,
        message: 'Profile removed from shortlist successfully'
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
  

  
  module.exports = router;