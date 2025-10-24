const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../Models/user-register');

const JWT_SECRET = process.env.JWT_SECRET || 'heeltech@5552';

// Reuse simple auth middleware pattern from Routes/User.js
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'No authentication token, access denied' });
    }
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token verification failed' });
  }
};

// Helper to evaluate whether a value is considered filled
function isFilled(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return v !== '' && v !== 'null' && v !== 'undefined';
  }
  if (Array.isArray(value)) return value.length > 0;
  // numbers, booleans, dates, objects
  return true;
}

// Define fields contributing to completeness (exclude system/flags/steps/preferences)
const COMPLETENESS_FIELDS = [
  // Identity & contact
  'fullName','gender','createdBy','countryCode','mobileNumber','email','image',
  // Personal details
  'dateOfBirth','maritalStatus','maleKids','femaleKids','hasRelatives','height','weight','physicalState','eatingHabits','smokingHabits','drinkingHabits',
  // Culture & religion
  'religion','motherTongue','languagesKnown','caste','subcaste','gotram','raasi','star',
  // Education & employment
  'education','employmentStatus','occupation','annualIncome','jobLocation','otherBusiness','businessLocation','otherBusinessIncome','extraTalentedSkills',
  // Family
  'fatherEmployee','fatherOccupied','motherEmployee','motherOccupied','totalBrothers','youngerBrothers','elderBrothers','marriedBrothers','totalSisters','youngerSisters','elderSisters','marriedSisters','familyValue','familyType','familyStatus',
  // Locations
  'originalLocation','selectedLocation','country','state','district','citizenship',
  // Properties
  'houseType','houseSqFeet','houseValue','monthlyRent','houseLocation','openPlots','openPlotsSqFeet','openPlotsValue','openPlotsLocation','numberOfHouses',
  'commercialshops','shopssqyards','numberOfFlats','flatType','flatValue','flatLocation','agricultureLand','agricultureLandValue','agricultureLandLocation','anyMoreProperties','totalPropertiesValue','propertyNames',
];

// GET /profile-completeness -> compute current user's profile completeness
router.get('/profile-completeness', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let total = 0;
    let filled = 0;
    const missingFields = [];

    for (const field of COMPLETENESS_FIELDS) {
      total += 1;
      if (isFilled(user[field])) filled += 1; else missingFields.push(field);
    }

    const percentage = total > 0 ? Math.round((filled / total) * 100) : 0;

    return res.status(200).json({
      success: true,
      percentage,
      filledCount: filled,
      totalCount: total,
      missingFields,
    });
  } catch (error) {
    console.error('Error computing profile completeness:', error);
    return res.status(500).json({ success: false, message: 'Server error computing profile completeness' });
  }
});

module.exports = router;


