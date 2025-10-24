// routes/auth.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/user-register');

// Environment variables should be properly configured
const JWT_SECRET = process.env.JWT_SECRET || 'heeltech@5552';

// Login route
router.post('/login', async (req, res) => {
  try {
    const { martialId, password } = req.body;
 
    // Input validation
    if (!martialId || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Martial ID and password are required' 
      });
    }

    // Find user by martialId
    const user = await User.findOne({ martialId });
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Simple password check (in a real app, use bcrypt.compare)
    const isMatch = user.password === password;
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        martialId: user.martialId,
        bureauId: user.bureauId
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return user data and token
    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        martialId: user.martialId,
        bureauId: user.bureauId,
        gender: user.gender,
        imagePrivacy: user.imagePrivacy,
        image: user.image,
        profileStatus: user.profileStatus,
        paymentStatus: user.paymentStatus,
        step1: user.step1,
        step2: user.step2,
        step3: user.step3,
        step4: user.step4,
        step5: user.step5,
        step6: user.step6,
        step7: user.step7,
        step8: user.step8
      }
      
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// Auth check middleware
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token, access denied' 
      });
    }

    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token verification failed' 
    });
  }
};

// Protected route to get current user data
router.get('/userdata', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userData = user.toObject();
    delete userData.password;

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user data' });
  }
});

// Route 1: Show opposite gender users within same bureauId (ALL MATCHES - SAME BUREAU)
router.get('/userdataongender', authMiddleware, async (req, res) => {
  try {
    const { gender, bureauId, page = 1, limit = 10 } = req.query;

    // Validate gender parameter
    if (!gender || !['male', 'female'].includes(gender.toLowerCase())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or missing gender parameter' 
      });
    }

    // Validate bureauId parameter
    if (!bureauId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing bureauId parameter' 
      });
    }

    const oppositeGender = gender.toLowerCase() === 'male' ? 'female' : 'male';
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Find users with opposite gender and same bureauId with pagination
    // Sort by createdAt (most recent first) and then by _id
    const users = await User.find({ 
      gender: oppositeGender,
      bureauId: bureauId 
    })
    .sort({ createdAt: -1, _id: -1 }) // Most recent first
    .skip(skip)
    .limit(parseInt(limit))
    .select('-password');

    // Count total matching documents
    const total = await User.countDocuments({ 
      gender: oppositeGender,
      bureauId: bureauId 
    });

    res.json({ 
      success: true, 
      users,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      message: `Found ${users.length} ${oppositeGender} matches within bureauId: ${bureauId}`
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching users',
      error: error.message 
    });
  }
});

// Route 2: Show opposite gender users from OTHER bureauIds (ALL MATCHES - OTHER BUREAUS)
router.get('/userdataongenderexeptthatbureau', authMiddleware, async (req, res) => {
  try {
    const { gender, bureauId, page = 1, limit = 10 } = req.query;

    // Validate gender
    if (!gender || !['male', 'female'].includes(gender.toLowerCase())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or missing gender parameter' 
      });
    }

    // Validate bureauId
    if (!bureauId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing bureauId parameter' 
      });
    }

    const oppositeGender = gender.toLowerCase() === 'male' ? 'female' : 'male';
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Query with pagination - opposite gender from OTHER bureaus
    // Sort by createdAt (most recent first) and then by _id
    const users = await User.find({ 
      gender: oppositeGender,
      bureauId: { $ne: bureauId }
    })
    .sort({ createdAt: -1, _id: -1 }) // Most recent first
    .skip(skip)
    .limit(parseInt(limit))
    .select('-password');

    // Count total matching documents
    const total = await User.countDocuments({ 
      gender: oppositeGender,
      bureauId: { $ne: bureauId }
    });

    res.json({ 
      success: true, 
      users,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      message: `Found ${users.length} ${oppositeGender} matches from other bureaus (excluding bureauId: ${bureauId})`
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching users',
      error: error.message 
    });
  }
});

// Helper functions for preference matching
const isAnyAllowed = (preference) => {
  if (!preference) return true;
  if (Array.isArray(preference)) {
    return preference.some(
      (p) =>
        typeof p === 'string' &&
        (p.toLowerCase() === 'any' || p.toLowerCase() === 'any one')
    );
  }
  return (
    typeof preference === 'string' &&
    (preference.toLowerCase() === 'any' ||
      preference.toLowerCase() === 'any one')
  );
};

const matchPreference = (userValue, preferenceValue) => {
  if (!preferenceValue || isAnyAllowed(preferenceValue)) return true;
  if (!userValue) return false;

  if (Array.isArray(preferenceValue)) {
    if (Array.isArray(userValue)) {
      return preferenceValue.some((pref) => userValue.includes(pref));
    }
    return preferenceValue.includes(userValue);
  }

  if (Array.isArray(userValue)) {
    return userValue.includes(preferenceValue);
  }

  return userValue === preferenceValue;
};

const matchAgeRange = (dateOfBirth, agePreference) => {
  if (!agePreference || isAnyAllowed(agePreference)) return true;
  if (!dateOfBirth) return false;

  const age = Math.floor(
    (new Date() - new Date(dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000)
  );

  if (typeof agePreference === 'string') {
    const ageRange = agePreference
      .split('-')
      .map((a) => parseInt(a.trim()));
    if (ageRange.length === 2) {
      return age >= ageRange[0] && age <= ageRange[1];
    }
  }

  if (Array.isArray(agePreference)) {
    return agePreference.some((range) => {
      if (typeof range === 'string') {
        const ageRange = range.split('-').map((a) => parseInt(a.trim()));
        if (ageRange.length === 2) {
          return age >= ageRange[0] && age <= ageRange[1];
        }
      }
      return false;
    });
  }

  return true;
};

const matchIncomeRange = (userIncome, incomePreference) => {
  if (!incomePreference || isAnyAllowed(incomePreference)) return true;
  if (!userIncome) return false;

  // Extract numeric value from income string (e.g., "4 - 5 lakhs" -> 4)
  const incomeMatch = userIncome.match(/(\d+)/);
  if (!incomeMatch) return false;
  
  const income = parseInt(incomeMatch[1]);

  if (typeof incomePreference === 'string') {
    const incomeRange = incomePreference
      .split('-')
      .map((i) => parseInt(i.trim()));
    if (incomeRange.length === 2) {
      return income >= incomeRange[0] && income <= incomeRange[1];
    }
  }

  if (Array.isArray(incomePreference)) {
    return incomePreference.some((range) => {
      if (typeof range === 'string') {
        const incomeRange = range.split('-').map((i) => parseInt(i.trim()));
        if (incomeRange.length === 2) {
          return income >= incomeRange[0] && income <= incomeRange[1];
        }
      }
      return false;
    });
  }

  return true;
};

// Route 3: My Preferences - Matches within same bureau with 50%+ compatibility
router.get('/userDataMypreferences', authMiddleware, async (req, res) => {
  try {
    const { martialId, bureauId, page = 1, limit = 10 } = req.query;

    // Validate martialId parameter
    if (!martialId) {
      return res.status(400).json({
        success: false,
        message: 'Missing martialId parameter',
      });
    }

    // Retrieve the current user's data using martialId
    const currentUser = await User.findOne({ martialId }).select('-password');
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const currentUserId = currentUser._id;
    if (!bureauId) {
      return res.status(400).json({
        success: false,
        message: 'User bureauId not found',
      });
    }

    // Determine opposite gender for basic filtering
    const oppositeGender =
      currentUser.gender?.toLowerCase() === 'male' ? 'female' : 'male';

    // Build matching query - SAME BUREAU, OPPOSITE GENDER
    const matchQuery = {
      bureauId: bureauId, // Same bureau
      gender: oppositeGender, // Opposite gender
      _id: { $ne: currentUserId }, // Exclude the current user by ObjectId
    };

    // Get all potential matches from the same bureau with opposite gender
    // Sort by createdAt (most recent first) and then by _id
    const potentialMatches = await User.find(matchQuery)
      .sort({ createdAt: -1, _id: -1 }) // Most recent first
      .select('-password');

    // Calculate match percentage and filter for 50%+ compatibility
    const matchesWithScore = potentialMatches.map((match) => {
      let totalCriteria = 0;
      let matchedCriteria = 0;

      // Updated preference mappings with all fields
      const preferenceMapping = [
        // Basic preferences
        { pref: 'religionPreferences', field: 'religion', type: 'direct' },
        { pref: 'castePreferences', field: 'caste', type: 'direct' },
        { pref: 'subCastePreferences', field: 'subcaste', type: 'direct' },
        { pref: 'maritalStatusPreferences', field: 'maritalStatus', type: 'direct' },
        { pref: 'childrenPreferences', field: null, type: 'children' },
        { pref: 'motherTonguePreferences', field: 'motherTongue', type: 'direct' },
        { pref: 'agePreferences', field: 'dateOfBirth', type: 'age' },
        
        // Partner preferences
        { pref: 'partnerServicePreference', field: 'employmentStatus', type: 'direct' },
        { pref: 'partnerCreatedBy', field: 'createdBy', type: 'direct' },
        { pref: 'partnerEducationPreferences', field: 'education', type: 'direct' },
        { pref: 'partnerOccupationPreferences', field: 'occupation', type: 'direct' },
        { pref: 'partnerJobLocationPreferences', field: 'jobLocation', type: 'direct' },
        { pref: 'partnerAnnualIncome', field: 'annualIncome', type: 'income' },
        
        // Family preferences
        { pref: 'familyPreferences', field: 'familyType', type: 'direct' },
        
        // Location preferences
        { pref: 'settledLocationPreferences', field: 'selectedLocation', type: 'direct' },
        { pref: 'countryLocationPreferences', field: 'country', type: 'direct' },
        { pref: 'stateLocationPreferences', field: 'state', type: 'direct' },
        { pref: 'cityLocationPreferences', field: 'district', type: 'direct' },
        { pref: 'citizenshipPreferences', field: 'citizenship', type: 'direct' },
        { pref: 'ownLocationPreferences', field: 'originalLocation', type: 'direct' },
        
        // Property preferences
        { pref: 'ownHousePreferences', field: 'houseType', type: 'property' },
        { pref: 'squareYardPreferences', field: 'houseSqFeet', type: 'numeric' },
        { pref: 'monthlyRentPreferences', field: 'monthlyRent', type: 'income' },
        { pref: 'plotPreference', field: 'openPlots', type: 'property' },
        { pref: 'flatPreference', field: 'numberOfFlats', type: 'property' },
        { pref: 'agricultureLandPreference', field: 'agricultureLand', type: 'property' },
        { pref: 'totalPropertyValuePreference', field: 'totalPropertiesValue', type: 'income' },
      ];

      preferenceMapping.forEach(({ pref, field, type }) => {
        totalCriteria++;
        const prefValue = currentUser[pref];
        
        switch (type) {
          case 'age':
            if (matchAgeRange(match.dateOfBirth, prefValue)) {
              matchedCriteria++;
            }
            break;
            
          case 'income':
          case 'numeric':
            if (matchIncomeRange(match[field], prefValue)) {
              matchedCriteria++;
            }
            break;
            
          case 'children':
            const hasChildren = (match.maleKids && match.maleKids > 0) || (match.femaleKids && match.femaleKids > 0);
            if (prefValue && !isAnyAllowed(prefValue)) {
              const childrenPref = Array.isArray(prefValue) ? prefValue[0]?.toLowerCase() : prefValue.toLowerCase();
              if ((childrenPref?.includes('no') && !hasChildren) || 
                  (childrenPref?.includes('yes') && hasChildren)) {
                matchedCriteria++;
              }
            } else {
              matchedCriteria++;
            }
            break;
            
          case 'property':
            let hasProperty = false;
            switch (pref) {
              case 'ownHousePreferences':
                hasProperty = match.houseType && match.houseType !== 'none' && match.houseType !== '';
                break;
              case 'plotPreference':
                hasProperty = match.openPlots && parseInt(match.openPlots) > 0;
                break;
              case 'flatPreference':
                hasProperty = match.numberOfFlats && parseInt(match.numberOfFlats) > 0;
                break;
              case 'agricultureLandPreference':
                hasProperty = match.agricultureLand && parseInt(match.agricultureLand) > 0;
                break;
            }
            
            if (prefValue && !isAnyAllowed(prefValue)) {
              const propertyPref = Array.isArray(prefValue) ? prefValue[0]?.toLowerCase() : prefValue.toLowerCase();
              if ((propertyPref?.includes('yes') && hasProperty) ||
                  (propertyPref?.includes('no') && !hasProperty)) {
                matchedCriteria++;
              }
            } else {
              matchedCriteria++;
            }
            break;
            
          case 'direct':
          default:
            if (field && matchPreference(match[field], prefValue)) {
              matchedCriteria++;
            } else if (!field) {
              matchedCriteria++; // For unmapped fields, count as match for now
            }
            break;
        }
      });

      const matchPercentage = totalCriteria > 0 ? Math.round((matchedCriteria / totalCriteria) * 100) : 0;

      return {
        ...match._doc,
        matchPercentage,
        matchedCriteria,
        totalCriteria
      };
    }).filter(match => match.matchPercentage >= 50); // Only return matches with 50%+ compatibility

    // Sort by match percentage (highest first), then by recent profiles
    matchesWithScore.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      // If match percentage is same, sort by recent profiles
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Implement pagination on filtered results
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedMatches = matchesWithScore.slice(skip, skip + parseInt(limit));
    const total = matchesWithScore.length;
    const totalPages = Math.ceil(total / parseInt(limit));

    return res.status(200).json({
      success: true,
      data: paginatedMatches,
      total,
      totalPages,
      pagination: {
        total,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
      message: `Found ${total} ${oppositeGender} matches within same bureau with 50% or higher compatibility`
    });
  } catch (error) {
    console.error('Error in /userDataMypreferences:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

// Route 4: My Preferences Others - Matches from OTHER bureaus with 50%+ compatibility
router.get('/userDataMypreferencesOtherBureaus', authMiddleware, async (req, res) => {
  try {
    const { martialId, bureauId, page = 1, limit = 10 } = req.query;

    // Validate martialId parameter
    if (!martialId) {
      return res.status(400).json({
        success: false,
        message: 'Missing martialId parameter',
      });
    }

    // Retrieve the current user's data using martialId
    const currentUser = await User.findOne({ martialId }).select('-password');
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const currentUserId = currentUser._id;
    if (!bureauId) {
      return res.status(400).json({
        success: false,
        message: 'User bureauId not found',
      });
    }

    // Determine opposite gender for basic filtering
    const oppositeGender =
      currentUser.gender?.toLowerCase() === 'male' ? 'female' : 'male';

    // Build matching query - OTHER BUREAUS, OPPOSITE GENDER
    const matchQuery = {
      gender: oppositeGender, // Opposite gender
      bureauId: { $ne: bureauId }, // Exclude current user's bureau
      _id: { $ne: currentUserId }, // Exclude the current user by ObjectId
    };

    // Get all potential matches from other bureaus with opposite gender
    // Sort by createdAt (most recent first) and then by _id
    const potentialMatches = await User.find(matchQuery)
      .sort({ createdAt: -1, _id: -1 }) // Most recent first
      .select('-password');

    // Calculate match percentage and filter for 50%+ compatibility
    const matchesWithScore = potentialMatches.map((match) => {
      let totalCriteria = 0;
      let matchedCriteria = 0;

      // Updated preference mappings with all fields
      const preferenceMapping = [
        // Basic preferences
        { pref: 'religionPreferences', field: 'religion', type: 'direct' },
        { pref: 'castePreferences', field: 'caste', type: 'direct' },
        { pref: 'subCastePreferences', field: 'subcaste', type: 'direct' },
        { pref: 'maritalStatusPreferences', field: 'maritalStatus', type: 'direct' },
        { pref: 'childrenPreferences', field: null, type: 'children' },
        { pref: 'motherTonguePreferences', field: 'motherTongue', type: 'direct' },
        { pref: 'agePreferences', field: 'dateOfBirth', type: 'age' },
        
        // Partner preferences
        { pref: 'partnerServicePreference', field: 'employmentStatus', type: 'direct' },
        { pref: 'partnerCreatedBy', field: 'createdBy', type: 'direct' },
        { pref: 'partnerEducationPreferences', field: 'education', type: 'direct' },
        { pref: 'partnerOccupationPreferences', field: 'occupation', type: 'direct' },
        { pref: 'partnerJobLocationPreferences', field: 'jobLocation', type: 'direct' },
        { pref: 'partnerAnnualIncome', field: 'annualIncome', type: 'income' },
        
        // Family preferences
        { pref: 'familyPreferences', field: 'familyType', type: 'direct' },
        
        // Location preferences
        { pref: 'settledLocationPreferences', field: 'selectedLocation', type: 'direct' },
        { pref: 'countryLocationPreferences', field: 'country', type: 'direct' },
        { pref: 'stateLocationPreferences', field: 'state', type: 'direct' },
        { pref: 'cityLocationPreferences', field: 'district', type: 'direct' },
        { pref: 'citizenshipPreferences', field: 'citizenship', type: 'direct' },
        { pref: 'ownLocationPreferences', field: 'originalLocation', type: 'direct' },
        
        // Property preferences
        { pref: 'ownHousePreferences', field: 'houseType', type: 'property' },
        { pref: 'squareYardPreferences', field: 'houseSqFeet', type: 'numeric' },
        { pref: 'monthlyRentPreferences', field: 'monthlyRent', type: 'income' },
        { pref: 'plotPreference', field: 'openPlots', type: 'property' },
        { pref: 'flatPreference', field: 'numberOfFlats', type: 'property' },
        { pref: 'agricultureLandPreference', field: 'agricultureLand', type: 'property' },
        { pref: 'totalPropertyValuePreference', field: 'totalPropertiesValue', type: 'income' },
      ];

      preferenceMapping.forEach(({ pref, field, type }) => {
        totalCriteria++;
        const prefValue = currentUser[pref];
        
        switch (type) {
          case 'age':
            if (matchAgeRange(match.dateOfBirth, prefValue)) {
              matchedCriteria++;
            }
            break;
            
          case 'income':
          case 'numeric':
            if (matchIncomeRange(match[field], prefValue)) {
              matchedCriteria++;
            }
            break;
            
          case 'children':
            const hasChildren = (match.maleKids && match.maleKids > 0) || (match.femaleKids && match.femaleKids > 0);
            if (prefValue && !isAnyAllowed(prefValue)) {
              const childrenPref = Array.isArray(prefValue) ? prefValue[0]?.toLowerCase() : prefValue.toLowerCase();
              if ((childrenPref?.includes('no') && !hasChildren) || 
                  (childrenPref?.includes('yes') && hasChildren)) {
                matchedCriteria++;
              }
            } else {
              matchedCriteria++;
            }
            break;
            
          case 'property':
            let hasProperty = false;
            switch (pref) {
              case 'ownHousePreferences':
                hasProperty = match.houseType && match.houseType !== 'none' && match.houseType !== '';
                break;
              case 'plotPreference':
                hasProperty = match.openPlots && parseInt(match.openPlots) > 0;
                break;
              case 'flatPreference':
                hasProperty = match.numberOfFlats && parseInt(match.numberOfFlats) > 0;
                break;
              case 'agricultureLandPreference':
                hasProperty = match.agricultureLand && parseInt(match.agricultureLand) > 0;
                break;
            }
            
            if (prefValue && !isAnyAllowed(prefValue)) {
              const propertyPref = Array.isArray(prefValue) ? prefValue[0]?.toLowerCase() : prefValue.toLowerCase();
              if ((propertyPref?.includes('yes') && hasProperty) ||
                  (propertyPref?.includes('no') && !hasProperty)) {
                matchedCriteria++;
              }
            } else {
              matchedCriteria++;
            }
            break;
            
          case 'direct':
          default:
            if (field && matchPreference(match[field], prefValue)) {
              matchedCriteria++;
            } else if (!field) {
              matchedCriteria++; // For unmapped fields, count as match for now
            }
            break;
        }
      });

      const matchPercentage = totalCriteria > 0 ? Math.round((matchedCriteria / totalCriteria) * 100) : 0;

      return {
        ...match._doc,
        matchPercentage,
        matchedCriteria,
        totalCriteria
      };
    }).filter(match => match.matchPercentage >= 50); // Only return matches with 50%+ compatibility

    // Sort by match percentage (highest first), then by recent profiles
    matchesWithScore.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      // If match percentage is same, sort by recent profiles
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Implement pagination on filtered results
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedMatches = matchesWithScore.slice(skip, skip + parseInt(limit));
    const total = matchesWithScore.length;
    const totalPages = Math.ceil(total / parseInt(limit));

    return res.status(200).json({
      success: true,
      data: paginatedMatches,
      total,
      totalPages,
      pagination: {
        total,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
      message: `Found ${total} ${oppositeGender} matches from other bureaus with 50% or higher compatibility`
    });
  } catch (error) {
    console.error('Error in /userDataMypreferencesOtherBureaus:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

// Route 5: Alternative endpoint for other bureaus (keeping for backward compatibility)
router.get('/userDataMypreferencesAllBureaus', authMiddleware, async (req, res) => {
  try {
    const { martialId, bureauId, page = 1, limit = 10 } = req.query;

    // Validate martialId parameter
    if (!martialId) {
      return res.status(400).json({
        success: false,
        message: 'Missing martialId parameter',
      });
    }

    // Retrieve the current user's data using martialId
    const currentUser = await User.findOne({ martialId }).select('-password');
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const currentUserId = currentUser._id;
    if (!bureauId) {
      return res.status(400).json({
        success: false,
        message: 'User bureauId not found',
      });
    }

    // Determine opposite gender for basic filtering
    const oppositeGender =
      currentUser.gender?.toLowerCase() === 'male' ? 'female' : 'male';

    // Build matching query - OTHER BUREAUS, OPPOSITE GENDER
    const matchQuery = {
      gender: oppositeGender, // Opposite gender
      bureauId: { $ne: bureauId }, // Exclude current user's bureau
      _id: { $ne: currentUserId }, // Exclude the current user by ObjectId
    };

    // Get all potential matches from other bureaus with opposite gender
    // Sort by createdAt (most recent first) and then by _id
    const potentialMatches = await User.find(matchQuery)
      .sort({ createdAt: -1, _id: -1 }) // Most recent first
      .select('-password');

    // Calculate match percentage and filter for 50%+ compatibility
    const matchesWithScore = potentialMatches.map((match) => {
      let totalCriteria = 0;
      let matchedCriteria = 0;

      // Updated preference mappings with all fields
      const preferenceMapping = [
        // Basic preferences
        { pref: 'religionPreferences', field: 'religion', type: 'direct' },
        { pref: 'castePreferences', field: 'caste', type: 'direct' },
        { pref: 'subCastePreferences', field: 'subcaste', type: 'direct' },
        { pref: 'maritalStatusPreferences', field: 'maritalStatus', type: 'direct' },
        { pref: 'childrenPreferences', field: null, type: 'children' },
        { pref: 'motherTonguePreferences', field: 'motherTongue', type: 'direct' },
        { pref: 'agePreferences', field: 'dateOfBirth', type: 'age' },
        
        // Partner preferences
        { pref: 'partnerServicePreference', field: 'employmentStatus', type: 'direct' },
        { pref: 'partnerCreatedBy', field: 'createdBy', type: 'direct' },
        { pref: 'partnerEducationPreferences', field: 'education', type: 'direct' },
        { pref: 'partnerOccupationPreferences', field: 'occupation', type: 'direct' },
        { pref: 'partnerJobLocationPreferences', field: 'jobLocation', type: 'direct' },
        { pref: 'partnerAnnualIncome', field: 'annualIncome', type: 'income' },
        
        // Family preferences
        { pref: 'familyPreferences', field: 'familyType', type: 'direct' },
        
        // Location preferences
        { pref: 'settledLocationPreferences', field: 'selectedLocation', type: 'direct' },
        { pref: 'countryLocationPreferences', field: 'country', type: 'direct' },
        { pref: 'stateLocationPreferences', field: 'state', type: 'direct' },
        { pref: 'cityLocationPreferences', field: 'district', type: 'direct' },
        { pref: 'citizenshipPreferences', field: 'citizenship', type: 'direct' },
        { pref: 'ownLocationPreferences', field: 'originalLocation', type: 'direct' },
        
        // Property preferences
        { pref: 'ownHousePreferences', field: 'houseType', type: 'property' },
        { pref: 'squareYardPreferences', field: 'houseSqFeet', type: 'numeric' },
        { pref: 'monthlyRentPreferences', field: 'monthlyRent', type: 'income' },
        { pref: 'plotPreference', field: 'openPlots', type: 'property' },
        { pref: 'flatPreference', field: 'numberOfFlats', type: 'property' },
        { pref: 'agricultureLandPreference', field: 'agricultureLand', type: 'property' },
        { pref: 'totalPropertyValuePreference', field: 'totalPropertiesValue', type: 'income' },
      ];

      preferenceMapping.forEach(({ pref, field, type }) => {
        totalCriteria++;
        const prefValue = currentUser[pref];
        
        switch (type) {
          case 'age':
            if (matchAgeRange(match.dateOfBirth, prefValue)) {
              matchedCriteria++;
            }
            break;
            
          case 'income':
          case 'numeric':
            if (matchIncomeRange(match[field], prefValue)) {
              matchedCriteria++;
            }
            break;
            
          case 'children':
            const hasChildren = (match.maleKids && match.maleKids > 0) || (match.femaleKids && match.femaleKids > 0);
            if (prefValue && !isAnyAllowed(prefValue)) {
              const childrenPref = Array.isArray(prefValue) ? prefValue[0]?.toLowerCase() : prefValue.toLowerCase();
              if ((childrenPref?.includes('no') && !hasChildren) || 
                  (childrenPref?.includes('yes') && hasChildren)) {
                matchedCriteria++;
              }
            } else {
              matchedCriteria++;
            }
            break;
            
          case 'property':
            let hasProperty = false;
            switch (pref) {
              case 'ownHousePreferences':
                hasProperty = match.houseType && match.houseType !== 'none' && match.houseType !== '';
                break;
              case 'plotPreference':
                hasProperty = match.openPlots && parseInt(match.openPlots) > 0;
                break;
              case 'flatPreference':
                hasProperty = match.numberOfFlats && parseInt(match.numberOfFlats) > 0;
                break;
              case 'agricultureLandPreference':
                hasProperty = match.agricultureLand && parseInt(match.agricultureLand) > 0;
                break;
            }
            
            if (prefValue && !isAnyAllowed(prefValue)) {
              const propertyPref = Array.isArray(prefValue) ? prefValue[0]?.toLowerCase() : prefValue.toLowerCase();
              if ((propertyPref?.includes('yes') && hasProperty) ||
                  (propertyPref?.includes('no') && !hasProperty)) {
                matchedCriteria++;
              }
            } else {
              matchedCriteria++;
            }
            break;
            
          case 'direct':
          default:
            if (field && matchPreference(match[field], prefValue)) {
              matchedCriteria++;
            } else if (!field) {
              matchedCriteria++; // For unmapped fields, count as match for now
            }
            break;
        }
      });

      const matchPercentage = totalCriteria > 0 ? Math.round((matchedCriteria / totalCriteria) * 100) : 0;

      return {
        ...match._doc,
        matchPercentage,
        matchedCriteria,
        totalCriteria
      };
    }).filter(match => match.matchPercentage >= 50); // Only return matches with 50%+ compatibility

    // Sort by match percentage (highest first), then by recent profiles
    matchesWithScore.sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      // If match percentage is same, sort by recent profiles
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Implement pagination on filtered results
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedMatches = matchesWithScore.slice(skip, skip + parseInt(limit));
    const total = matchesWithScore.length;
    const totalPages = Math.ceil(total / parseInt(limit));

    return res.status(200).json({
      success: true,
      data: paginatedMatches,
      total,
      totalPages,
      pagination: {
        total,
        totalPages,
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
      message: `Found ${total} ${oppositeGender} matches from other bureaus with 50% or higher compatibility`
    });
  } catch (error) {
    console.error('Error in /userDataMypreferencesAllBureaus:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

module.exports = router;