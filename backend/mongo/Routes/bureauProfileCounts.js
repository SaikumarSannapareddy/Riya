const express = require('express');
const router = express.Router();
const User = require('../Models/user-register');

// Test route to verify the route is working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Bureau profile counts route is working',
    timestamp: new Date().toISOString()
  });
});

// Test route for delete functionality
router.get('/test-delete/:bureauId', (req, res) => {
  const { bureauId } = req.params;
  res.json({ 
    success: true, 
    message: 'Delete test route working',
    bureauId: bureauId,
    timestamp: new Date().toISOString()
  });
});

// Route to get profile counts for a specific bureau
router.get('/bureau-profile-counts/:bureauId', async (req, res) => {
  try {
    const { bureauId } = req.params;
    
    if (!bureauId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bureau ID is required' 
      });
    }

    // Create filters for different profile types
    const baseFilter = {
      bureauId: bureauId,
      activeStatus: { $ne: false },
      visibleToAll: { $ne: "false" }
    };

    // Count total profiles
    const totalProfiles = await User.countDocuments(baseFilter);
    
    // Count male profiles
    const maleProfiles = await User.countDocuments({
      ...baseFilter,
      gender: 'male'
    });
    
    // Count female profiles
    const femaleProfiles = await User.countDocuments({
      ...baseFilter,
      gender: 'female'
    });

    // Count incomplete profiles (less than 2 steps completed)
    const incompleteProfiles = await User.countDocuments({
      ...baseFilter,
      $expr: {
        $lt: [
          {
            $add: [
              { $cond: [{ $eq: ['$step1', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step2', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step3', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step4', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step5', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step6', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step7', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step8', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step9', '1'] }, 1, 0] }
            ]
          },
          2
        ]
      }
    });

    // Count complete profiles (2 or more steps completed)
    const completeProfiles = totalProfiles - incompleteProfiles;

    // Return the counts
    res.json({
      success: true,
      bureauId: bureauId,
      totalProfiles,
      maleProfiles,
      femaleProfiles,
      completeProfiles,
      incompleteProfiles,
      completionRate: totalProfiles > 0 ? Math.round((completeProfiles / totalProfiles) * 100) : 0
    });

  } catch (error) {
    console.error('Error fetching bureau profile counts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Route to get profile counts for all bureaus (summary)
router.get('/all-bureau-profile-counts', async (req, res) => {
  try {
    // Get all unique bureau IDs
    const bureaus = await User.distinct('bureauId', {
      activeStatus: { $ne: false },
      visibleToAll: { $ne: "false" }
    });

    const bureauCounts = [];

    // Count profiles for each bureau
    for (const bureauId of bureaus) {
      if (!bureauId) continue; // Skip profiles without bureauId
      
      const baseFilter = {
        bureauId: bureauId,
        activeStatus: { $ne: false },
        visibleToAll: { $ne: "false" }
      };

      const totalProfiles = await User.countDocuments(baseFilter);
      const maleProfiles = await User.countDocuments({
        ...baseFilter,
        gender: 'male'
      });
      const femaleProfiles = await User.countDocuments({
        ...baseFilter,
        gender: 'female'
      });

      // Count incomplete profiles for this bureau
      const incompleteProfiles = await User.countDocuments({
        ...baseFilter,
        $expr: {
          $lt: [
            {
              $add: [
                { $cond: [{ $eq: ['$step1', '1'] }, 1, 0] },
                { $cond: [{ $eq: ['$step2', '1'] }, 1, 0] },
                { $cond: [{ $eq: ['$step3', '1'] }, 1, 0] },
                { $cond: [{ $eq: ['$step4', '1'] }, 1, 0] },
                { $cond: [{ $eq: ['$step5', '1'] }, 1, 0] },
                { $cond: [{ $eq: ['$step6', '1'] }, 1, 0] },
                { $cond: [{ $eq: ['$step7', '1'] }, 1, 0] },
                { $cond: [{ $eq: ['$step8', '1'] }, 1, 0] },
                { $cond: [{ $eq: ['$step9', '1'] }, 1, 0] }
              ]
            },
            2
          ]
        }
      });

      const completeProfiles = totalProfiles - incompleteProfiles;

      bureauCounts.push({
        bureauId,
        totalProfiles,
        maleProfiles,
        femaleProfiles,
        completeProfiles,
        incompleteProfiles,
        completionRate: totalProfiles > 0 ? Math.round((completeProfiles / totalProfiles) * 100) : 0
      });
    }

    // Sort by total profiles (descending)
    bureauCounts.sort((a, b) => b.totalProfiles - a.totalProfiles);
    
    res.json({
      success: true,
      totalBureaus: bureauCounts.length,
      bureauCounts
    });

  } catch (error) {
    console.error('Error fetching all bureau profile counts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Route to delete incomplete profiles for a specific bureau
router.delete('/delete-incomplete-profiles/:bureauId', async (req, res) => {
  try {
    const { bureauId } = req.params;
    
    console.log('Delete incomplete profiles route called');
    console.log('Received bureauId:', bureauId);
    console.log('Request params:', req.params);
    console.log('Request body:', req.body);
    
    if (!bureauId) {
      console.log('Bureau ID is missing');
      return res.status(400).json({ 
        success: false, 
        message: 'Bureau ID is required' 
      });
    }

    if (bureauId === 'undefined') {
      console.log('Bureau ID is undefined string');
      return res.status(400).json({ 
        success: false, 
        message: 'Bureau ID cannot be undefined' 
      });
    }

    // Find and delete incomplete profiles (less than 2 steps completed)
    const deleteResult = await User.deleteMany({
      bureauId: bureauId,
      activeStatus: { $ne: false },
      visibleToAll: { $ne: "false" },
      $expr: {
        $lt: [
          {
            $add: [
              { $cond: [{ $eq: ['$step1', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step2', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step3', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step4', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step5', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step6', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step7', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step8', '1'] }, 1, 0] },
              { $cond: [{ $eq: ['$step9', '1'] }, 1, 0] }
            ]
          },
          2
        ]
      }
    });

    console.log('Delete result:', deleteResult);

    // Return the deletion result
    res.json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} incomplete profiles`,
      bureauId: bureauId,
      deletedCount: deleteResult.deletedCount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error deleting incomplete profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router; 