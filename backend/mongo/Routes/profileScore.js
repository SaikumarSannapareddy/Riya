const express = require('express');
const router = express.Router();
const User = require('../Models/user-register');

// Route to calculate profile score based on profile data completeness
router.post('/calculate-score', async (req, res) => {
  try {
    const { bureauId } = req.body;

    if (!bureauId) {
      return res.status(400).json({ 
        success: false,  
        message: 'Bureau ID is required' 
      });
    }

    // Get all profiles for this bureau
    const profiles = await User.find({ bureauId: bureauId });
    const totalProfiles = profiles.length;

    if (totalProfiles === 0) {
      return res.json({
        success: true,
        score: 0,
        profileCount: 0,
        completeProfiles: 0,
        message: 'No profiles found for this bureau'
      });
    }

    let completeProfiles = 0;

    // Check each profile for data completeness (80%+ filled)
    for (const profile of profiles) {
      let filledFields = 0;
      let totalFields = 0;

      // Check all relevant fields for completeness from user-register model
      const fieldsToCheck = [
        // Basic Information
        'gender', 'image', 'mobileNumber', 'email', 'gallery',
        
        // Personal Details
        'fullName', 'dateOfBirth', 'time', 'maritalStatus', 'maleKids', 'femaleKids', 'hasRelatives',
        'height', 'weight', 'physicalState', 'eatingHabits', 'smokingHabits', 'drinkingHabits',
        
        // Education and Employment
        'education', 'employmentStatus', 'occupation', 'annualIncome', 'jobLocation', 
        'otherBusiness', 'businessLocation', 'otherBusinessIncome', 'extraTalentedSkills',
        
        // Cultural & Religious
        'religion', 'motherTongue', 'languagesKnown', 'caste', 'subcaste', 'gotram', 'raasi', 'star',
        
        // Family Information
        'fatherEmployee', 'fatherOccupied', 'motherEmployee', 'motherOccupied',
        'totalBrothers', 'youngerBrothers', 'elderBrothers', 'marriedBrothers',
        'totalSisters', 'youngerSisters', 'elderSisters', 'marriedSisters',
        'familyValue', 'familyType', 'familyStatus', 'originalLocation', 'selectedLocation',
        
        // Property Details
        'houseType', 'houseSqFeet', 'houseValue', 'monthlyRent', 'houseLocation',
        'openPlots', 'openPlotsSqFeet', 'openPlotsValue', 'openPlotsLocation', 'numberOfHouses',
        'commercialshops', 'shopssqyards', 'numberOfFlats', 'flatType', 'flatValue', 'flatLocation',
        'agricultureLand', 'agricultureLandValue', 'agricultureLandLocation', 'anyMoreProperties',
        'totalPropertiesValue', 'propertyNames',
        
        // Location
        'country', 'state', 'district', 'citizenship',
        
        // Partner Preferences
        'partnerServicePreference', 'partnerCreatedBy', 'religionPreferences', 'castePreferences',
        'subCastePreferences', 'maritalStatusPreferences', 'childrenPreferences', 'motherTonguePreferences',
        'agePreferences', 'partnerEducationPreferences', 'partnerOccupationPreferences',
        'partnerJobLocationPreferences', 'partnerAnnualIncome', 'familyPreferences', 'settledLocationPreferences',
        'ownHousePreferences', 'squareYardPreferences', 'monthlyRentPreferences', 'plotPreference',
        'flatPreference', 'ownLocationPreferences', 'agricultureLandPreference', 'totalPropertyValuePreference',
        'countryLocationPreferences', 'stateLocationPreferences', 'cityLocationPreferences', 'citizenshipPreferences'
      ];

      fieldsToCheck.forEach(field => {
        totalFields++;
        if (profile[field] && profile[field] !== null && profile[field] !== '') {
          // Handle array fields - check if they have content
          if (Array.isArray(profile[field])) {
            if (profile[field].length > 0) {
              filledFields++;
            }
          } else {
            filledFields++;
          }
        }
      });

      
      
      // If profile is 80%+ complete, count it as a complete profile
        if (profile.profileCompletion >= 80) {
        completeProfiles++;
      }
    }

    let score = 0;

    // Calculate score based on complete profiles
    if (completeProfiles === 0) {
      score = 0;
    } else if (completeProfiles <= 1000) {
      // 0.1% per complete profile up to 1000 profiles
      score = Math.round(completeProfiles * 0.1 * 10) / 10; // Round to 1 decimal place
    } else {
      // For 1000+ complete profiles, score is 100%
      score = 100;
    }

    res.json({
      success: true,
      score: score,
      profileCount: totalProfiles,
      completeProfiles: completeProfiles,
      message: 'Profile score calculated successfully based on data completeness'
    });

  } catch (error) {
    console.error('Error calculating profile score:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while calculating profile score' 
    });
  }
});

module.exports = router; 