const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../Models/user-register'); // Import your User model
const ReportedProfile = require('../Models/Report');
const router = express.Router();

// Create 'uploads' folder if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) { 
  fs.mkdirSync(uploadDir);
}

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save the files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Ensure unique filenames
  }
});

// Filter to accept only image files (optional)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false); // Reject the file
  }
};

// Multer middleware to handle image upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 5MB
});

// Register user (POST)
router.post('/register', upload.single('image'), async (req, res) => {
  try {

    const { mobileNumber } = req.body;

    // Check if mobile number already exists
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Mobile number already registered' });
    }

    const {
      gender, createdBy, paymentStatus, imagePrivacy, countryCode, email, password, bureauId,
      step1, step2, step3, step4, step5, step6, step7, step8, step9,
      martialId, fullName, dateOfBirth, time, maritalStatus, maleKids, femaleKids, hasRelatives,
      height, weight, physicalState, eatingHabits, smokingHabits, drinkingHabits,
      religion, motherTongue, languagesKnown, caste, subcaste, gotram, raasi, star,
      profileStatus, servicePreference, visibleToAll, showOtherProfiles,

      // Education and Employment
      education, employmentStatus, occupation, annualIncome, jobLocation, otherBusiness, businessLocation, otherBusinessIncome, extraTalentedSkills,

      // Family Details
      fatherEmployee, fatherOccupied, motherEmployee, motherOccupied, totalBrothers, marriedBrothers, totalSisters, marriedSisters,
      familyValue, familyType, originalLocation, selectedLocation,

      // Family Property Details
      houseType, houseSqFeet, houseValue, monthlyRent, houseLocation, openPlots, openPlotsSqFeet, openPlotsValue, openPlotsLocation,

      // Apartment/Flat Details
      numberOfFlats, flatType, propertyNames, numberOfApartments, flatValue, flatLocation,
      agricultureLand, agricultureLandValue, agricultureLandLocation, anyMoreProperties, totalPropertiesValue,

      // Location Details
      country, state, district, citizenship,

      // Partner Preferences
      partnerServicePreference, partnerCreatedBy, religionPreferences, castePreferences, subCastePreferences,
      maritalStatusPreferences, childrenPreferences, motherTonguePreferences, agePreferences, partnerEducationPreferences,
      partnerOccupationPreferences, partnerJobLocationPreferences, partnerAnnualIncome, familyPreferences, settledLocationPreferences,
      ownHousePreferences, squareYardPreferences, monthlyRentPreferences, plotPreference, flatPreference, ownLocationPreferences,
      agricultureLandPreference, totalPropertyValuePreference, countryLocationPreferences, stateLocationPreferences,
      cityLocationPreferences, citizenshipPreferences
    } = req.body;

    const image = req.file ? req.file.filename : null;

    // Define fields to calculate profile completion
    const profileFields = [
  'fullName', 'dateOfBirth', 'time', 'maritalStatus', 'maleKids', 'femaleKids', 'hasRelatives',
  'height', 'weight', 'physicalState', 'eatingHabits', 'smokingHabits', 'drinkingHabits',
  'religion', 'motherTongue', 'languagesKnown', 'caste', 'subcaste', 'gotram', 'raasi', 'star',
  'education', 'employmentStatus', 'occupation', 'annualIncome', 'jobLocation', 'otherBusiness',
  'businessLocation', 'otherBusinessIncome', 'extraTalentedSkills'
];

    // Count how many fields are filled
    let filledFields = 0;

   profileFields.forEach(field => {
  let value = req.body[field];

  // Parse JSON arrays if coming as string
  if (typeof value === 'string' && (value.startsWith('[') && value.endsWith(']'))) {
        try { value = JSON.parse(value); } catch(e) { value = []; }

  }

  // Check for valid values
  if (
    (Array.isArray(value) && value.length > 0) ||  // arrays
    (typeof value === 'number' && !isNaN(value)) || // numbers
    (typeof value === 'string' && value.trim() !== '' && value.toLowerCase() !== 'null') || // non-empty strings
    (typeof value === 'boolean') // boolean
  ) {
    filledFields++;
  }
});                                   

    const profileCompletion = Math.round((filledFields / profileFields.length) * 100);

    // Create user instance
    const newUser = new User({
      gender, createdBy, paymentStatus, image, imagePrivacy, countryCode, mobileNumber, email,
      password, bureauId, martialId, profileStatus, servicePreference,
      step1, step2, step3, step4, step5, step6, step7, step8, step9,
      fullName, dateOfBirth, time, maritalStatus, maleKids, femaleKids, hasRelatives,
      height, weight, physicalState, eatingHabits, smokingHabits, drinkingHabits,
      religion, motherTongue, languagesKnown, caste, subcaste, gotram, raasi, star,
      education, employmentStatus, occupation, annualIncome, jobLocation, otherBusiness, businessLocation, otherBusinessIncome, extraTalentedSkills,
      fatherEmployee, fatherOccupied, motherEmployee, motherOccupied, totalBrothers, marriedBrothers, totalSisters, marriedSisters,
      familyValue, familyType, originalLocation, selectedLocation,
      houseType, houseSqFeet, houseValue, monthlyRent, houseLocation, openPlots, openPlotsSqFeet, openPlotsValue, openPlotsLocation,
      numberOfFlats, flatType, propertyNames, numberOfApartments, flatValue, flatLocation,
      agricultureLand, agricultureLandValue, agricultureLandLocation, anyMoreProperties, totalPropertiesValue,
      country, state, district, citizenship,
      partnerServicePreference, partnerCreatedBy, religionPreferences, castePreferences, subCastePreferences,
      maritalStatusPreferences, childrenPreferences, motherTonguePreferences, agePreferences, partnerEducationPreferences,
      partnerOccupationPreferences, partnerJobLocationPreferences, partnerAnnualIncome, familyPreferences, settledLocationPreferences,
      ownHousePreferences, squareYardPreferences, monthlyRentPreferences, plotPreference, flatPreference, ownLocationPreferences,
      agricultureLandPreference, totalPropertyValuePreference, countryLocationPreferences, stateLocationPreferences,
      cityLocationPreferences, citizenshipPreferences,
      profileCompletion
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully', userId: newUser._id, profileCompletion });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.get('/check-mobile', async (req, res) => {
  try {
    const { mobileNumber } = req.query;
    if (!mobileNumber) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    const existingUser = await User.findOne({ mobileNumber });
    return res.json({ exists: !!existingUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// Get all users (GET)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/users/search', async (req, res) => {
  try {
    // Extract query parameters
    const { gender, maritalStatus, caste, country, state, city, religion } = req.query;

    // Build a query object based on the provided parameters
    const query = {};
    if (gender) query.gender = gender;
    if (maritalStatus) query.maritalStatus = maritalStatus;
    if (caste) query.caste = caste;
    if (country) query.country = country;
    if (state) query.state = state;
    if (city) query.city = city;
    if(religion) query.religion = religion;

    // Fetch users matching the query
    const users = await User.find(query);

    // Return results
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found matching the criteria.' });
    }

    // Profile data: e.g., count users by gender
    const profile = {
      totalUsers: users.length,
      genderDistribution: users.reduce(
        (acc, user) => {
          acc[user.gender] = (acc[user.gender] || 0) + 1;
          return acc;
        },
        {}
      ),
      maritalStatusDistribution: users.reduce(
        (acc, user) => {
          acc[user.maritalStatus] = (acc[user.maritalStatus] || 0) + 1;
          return acc;
        },
        {}
      ),
    };

    res.status(200).json({ users, profile });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/users', async (req, res) => {
  try {
    // Get the gender query parameter from the request
    const gender = req.query.gender;

    // Build the query object
    let query = {};
    if (gender) {
      query.gender = gender; // Only add the gender filter if it's provided
    }

    // Find users based on the query
    const users = await User.find(query);

    // Respond with the found users
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get user by ID (GET /user/:id)
router.get('/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find by ObjectId
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
 
    res.status(200).json(user);
  } catch (error) {
    console.error('❌ Error fetching user by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Update user by ID (PUT /user/:id)
router.put('/user/:id',  async (req, res) => {
  const { id } = req.params;
  const { 
    gender, createdBy, paymentStatus, image, imagePrivacy, countryCode, mobileNumber, email, password, bureauId, step1, step2, step3, step4, 
    step5, step6, step7, step8, step9, martialId, fullName, dateOfBirth, time, maritalStatus, maleKids, femaleKids, 
    hasRelatives, height, weight, physicalState, eatingHabits, smokingHabits, drinkingHabits, religion, motherTongue, 
    languagesKnown, caste, subcaste, gotram, raasi, star, status, deletereason, suspendreason, servicePreference, visibleToAll, showOtherProfiles,

    // New fields for education and employment
    education, employmentStatus, occupation, annualIncome, jobLocation, otherBusiness, businessLocation, otherBusinessIncome, extraTalentedSkills,

    // Family Details fields
    fatherEmployee, fatherOccupied, motherEmployee, motherOccupied, totalBrothers, marriedBrothers, totalSisters, marriedSisters, 
    familyValue, familyType, familyStatus, originalLocation, selectedLocation,

    // Newly added Family Property Details fields
    houseType, houseSqFeet, houseValue, monthlyRent, houseLocation, openPlots, openPlotsSqFeet, openPlotsValue, openPlotsLocation,shopssqyards,commercialshops,

    // Newly added Apartment/Flat details
    numberOfFlats, flatType, propertyNames,numberOfApartments, flatValue, flatLocation, agricultureLand, agricultureLandValue, agricultureLandLocation, anyMoreProperties, totalPropertiesValue,

    // Location Details fields (country, state, district, citizenship)
    country, state, district, citizenship,

    partnerServicePreference,partnerCreatedBy,religionPreferences,castePreferences,subCastePreferences,maritalStatusPreferences,childrenPreferences,motherTonguePreferences,agePreferences,partnerEducationPreferences,partnerOccupationPreferences,partnerJobLocationPreferences,partnerAnnualIncome,
    familyPreferences,settledLocationPreferences,ownHousePreferences,squareYardPreferences,monthlyRentPreferences,plotPreference,flatPreference,ownLocationPreferences,agricultureLandPreference,totalPropertyValuePreference,
    countryLocationPreferences,stateLocationPreferences,cityLocationPreferences,citizenshipPreferences,
    activeStatus,customWords
  } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details, only if new values are provided
    user.gender = gender || user.gender;
    user.createdBy = createdBy || user.createdBy;
    user.paymentStatus = paymentStatus || user.paymentStatus;
    user.image = image || user.image;
    user.imagePrivacy = imagePrivacy || user.imagePrivacy;
    user.countryCode = countryCode || user.countryCode;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.email = email || user.email;
    user.password = password || user.password;
    user.bureauId = bureauId || user.bureauId;
    user.martialId = martialId || user.martialId;
    user.servicePreference = servicePreference || user.servicePreference;
    user.visibleToAll = visibleToAll !== undefined ? visibleToAll : user.visibleToAll;
    user.showOtherProfiles = showOtherProfiles !== undefined ? showOtherProfiles : user.showOtherProfiles;
    user.activeStatus = (typeof activeStatus !== 'undefined') ? (activeStatus === true || activeStatus === 'true') : user.activeStatus;

    // Steps fields
    user.step1 = step1 || user.step1;
    user.step2 = step2 || user.step2;
    user.step3 = step3 || user.step3;
    user.step4 = step4 || user.step4;
    user.step5 = step5 || user.step5;
    user.step6 = step6 || user.step6;
    user.step7 = step7 || user.step7;
    user.step8 = step8 || user.step8;
    user.step9 = step9 || user.step9;

    // Personal details fields
    user.fullName = fullName || user.fullName;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth; 
    user.time = time || user.time;
    user.maritalStatus = maritalStatus || user.maritalStatus;
    user.maleKids = maleKids !== undefined ? maleKids : user.maleKids;
    user.femaleKids = femaleKids !== undefined ? femaleKids : user.femaleKids;
    user.hasRelatives = hasRelatives || user.hasRelatives;
    user.height = height || user.height;
    user.weight = weight !== undefined ? weight : user.weight;
    user.physicalState = physicalState || user.physicalState;
    user.eatingHabits = eatingHabits || user.eatingHabits;
    user.smokingHabits = smokingHabits || user.smokingHabits;
    user.drinkingHabits = drinkingHabits || user.drinkingHabits;

    // Form details fields
    user.religion = religion || user.religion;
    user.motherTongue = motherTongue || user.motherTongue;
    user.languagesKnown = languagesKnown || user.languagesKnown;
    user.caste = caste || user.caste;
    user.subcaste = subcaste || user.subcaste;
    user.gotram = gotram || user.gotram;
    user.raasi = raasi || user.raasi;
    user.star = star || user.star;
    user.status = status || user.status;
    user.deletereason = deletereason || user.deletereason;
    user.suspendreason = suspendreason || user.suspendreason;

    // Education and Employment fields
    user.education = education || user.education;
    user.employmentStatus = employmentStatus || user.employmentStatus;
    user.occupation = occupation || user.occupation;
    user.annualIncome = annualIncome !== undefined ? annualIncome : user.annualIncome;
    user.jobLocation = jobLocation || user.jobLocation;
    user.otherBusiness = otherBusiness || user.otherBusiness;
    user.businessLocation = businessLocation || user.businessLocation;
    user.otherBusinessIncome = otherBusinessIncome !== undefined ? otherBusinessIncome : user.otherBusinessIncome;
    user.extraTalentedSkills = extraTalentedSkills || user.extraTalentedSkills;

    // Family Details fields
    user.fatherEmployee = fatherEmployee || user.fatherEmployee;
    user.fatherOccupied = fatherOccupied || user.fatherOccupied;
    user.motherEmployee = motherEmployee || user.motherEmployee;
    user.motherOccupied = motherOccupied || user.motherOccupied;
    user.totalBrothers = totalBrothers !== undefined ? totalBrothers : user.totalBrothers;
    user.marriedBrothers = marriedBrothers !== undefined ? marriedBrothers : user.marriedBrothers;
    user.totalSisters = totalSisters !== undefined ? totalSisters : user.totalSisters;
    user.marriedSisters = marriedSisters !== undefined ? marriedSisters : user.marriedSisters;
    user.familyValue = familyValue || user.familyValue;
    user.familyType = familyType || user.familyType;
    user.familyStatus = familyStatus || user.familyStatus;
    user.originalLocation = originalLocation || user.originalLocation;
    user.selectedLocation = selectedLocation || user.selectedLocation;

    // Family Property Details fields
    user.houseType = houseType || user.houseType;
    user.houseSqFeet = houseSqFeet !== undefined ? houseSqFeet : user.houseSqFeet;
    user.houseValue = houseValue !== undefined ? houseValue : user.houseValue;
    user.monthlyRent = monthlyRent !== undefined ? monthlyRent : user.monthlyRent;
    user.houseLocation = houseLocation || user.houseLocation;
    user.openPlots = openPlots !== undefined ? openPlots : user.openPlots;
    user.openPlotsSqFeet = openPlotsSqFeet !== undefined ? openPlotsSqFeet : user.openPlotsSqFeet;
    user.openPlotsValue = openPlotsValue !== undefined ? openPlotsValue : user.openPlotsValue;
    user.openPlotsLocation = openPlotsLocation || user.openPlotsLocation;

    user.shopssqyards = shopssqyards !== undefined ? shopssqyards : user.shopssqyards;
    user.commercialshops = commercialshops || user.commercialshops;

    // Apartment/Flat details
    user.numberOfFlats = numberOfFlats !== undefined ? numberOfFlats : user.numberOfFlats;
    user.flatType  = flatType  !== undefined ? flatType : user.flatType ;
    user.propertyNames = propertyNames !== undefined ? propertyNames : user.propertyNames

    user.numberOfApartments = numberOfApartments !== undefined ? numberOfApartments : user.numberOfApartments;
    user.flatValue = flatValue !== undefined ? flatValue : user.flatValue;
    user.flatLocation = flatLocation || user.flatLocation;
    user.agricultureLand = agricultureLand !== undefined ? agricultureLand : user.agricultureLand;
    user.agricultureLandValue = agricultureLandValue !== undefined ? agricultureLandValue : user.agricultureLandValue;
    user.agricultureLandLocation = agricultureLandLocation || user.agricultureLandLocation;
    user.anyMoreProperties = anyMoreProperties || user.anyMoreProperties;
    user.totalPropertiesValue = totalPropertiesValue !== undefined ? totalPropertiesValue : user.totalPropertiesValue;

    // Location Details fields
    user.country = country || user.country;
    user.state = state || user.state;
    user.district = district || user.district;
    user.citizenship = citizenship || user.citizenship;


        // partner preference
        user.partnerServicePreference = partnerServicePreference || user.partnerServicePreference
        user.partnerCreatedBy = partnerCreatedBy || user.partnerCreatedBy
        user.religionPreferences = religionPreferences || user.religionPreferences
        user.castePreferences = castePreferences || user.castePreferences
        user.subCastePreferences = subCastePreferences || user.subCastePreferences
        user.maritalStatusPreferences = maritalStatusPreferences || user.maritalStatusPreferences
        user.childrenPreferences = childrenPreferences || user.childrenPreferences
        user.motherTonguePreferences = motherTonguePreferences || user.motherTonguePreferences 
        user.agePreferences = agePreferences || user.agePreferences
        user.partnerEducationPreferences  = partnerEducationPreferences  || user.partnerEducationPreferences 
        user.partnerOccupationPreferences = partnerOccupationPreferences || user.partnerOccupationPreferences
        user.partnerJobLocationPreferences = partnerJobLocationPreferences || user.partnerJobLocationPreferences
        user.partnerAnnualIncome = partnerAnnualIncome || user.partnerAnnualIncome 
        user.familyPreferences = familyPreferences || user.familyPreferences
        user.settledLocationPreferences = settledLocationPreferences || user.settledLocationPreferences
        user.ownHousePreferences = ownHousePreferences || user.ownHousePreferences
        user.squareYardPreferences = squareYardPreferences || user.squareYardPreferences
        user.monthlyRentPreferences = monthlyRentPreferences || user.monthlyRentPreferences
        user.plotPreference = plotPreference || user.plotPreference
        user.flatPreference = flatPreference || user.flatPreference
        user.ownLocationPreferences = ownLocationPreferences || user.ownLocationPreferences
        user.agricultureLandPreference = agricultureLandPreference || user.agricultureLandPreference
        user.totalPropertyValuePreference = totalPropertyValuePreference || user.totalPropertyValuePreference
        user.countryLocationPreferences = countryLocationPreferences || user.countryLocationPreferences
        user.stateLocationPreferences = stateLocationPreferences || user.stateLocationPreferences
        user.cityLocationPreferences = cityLocationPreferences || user.cityLocationPreferences 
        user.citizenshipPreferences = citizenshipPreferences || user.citizenshipPreferences
        user.customWords = customWords || user.customWords


         // Recalculate profileCompletion after updates
    const profileFields = [
      'fullName', 'dateOfBirth', 'time', 'maritalStatus', 'maleKids', 'femaleKids', 'hasRelatives',
      'height', 'weight', 'physicalState', 'eatingHabits', 'smokingHabits', 'drinkingHabits',
      'religion', 'motherTongue', 'languagesKnown', 'caste', 'subcaste', 'gotram', 'raasi', 'star',
      'education', 'employmentStatus', 'occupation', 'annualIncome', 'jobLocation', 'otherBusiness',
      'businessLocation', 'otherBusinessIncome', 'extraTalentedSkills'
    ];

    let filledFields = 0;
    profileFields.forEach(field => {
      let value = user[field];

      // Parse JSON arrays if coming as string
      if (typeof value === 'string' && (value.startsWith('[') && value.endsWith(']'))) {
        try { value = JSON.parse(value); } catch(e) { value = []; }
      }

      // Check for valid values
      if (
        (Array.isArray(value) && value.length > 0) ||  // arrays
        (typeof value === 'number' && !isNaN(value)) || // numbers
        (typeof value === 'string' && value.trim() !== '' && value.toLowerCase() !== 'null') || // non-empty strings
        (typeof value === 'boolean') // boolean
      ) {
        filledFields++;
      }
    });

    user.profileCompletion = Math.round((filledFields / profileFields.length) * 100);

    

    // Save updated user to the database
    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Delete user by ID (DELETE /user/:id)
router.delete('/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await User.deleteOne({ _id: id });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/bureau/complete-profiles/:bureauId', async (req, res) => {
  const { bureauId } = req.params;

  if (!bureauId) {
    return res.status(400).json({ success: false, message: 'Bureau ID is required' });
  }

  try {
    // Find all users under this bureau
    const users = await User.find({ bureauId });

    if (!users || users.length === 0) {
      return res.status(200).json({
        success: true,
        totalUsers: 0,
        completeProfiles: 0,
        message: 'No users found for this bureau'
      });
    }

    // Count users with profileCompletion >= 80
    const completeProfiles = users.filter(u => u.profileCompletion >= 80).length;

    res.status(200).json({
    
  counters: {
    completeProfiles: completeProfiles,
    totalUsers: users.length
  },
  total: users.length
});

  } catch (error) {
    console.error('Error fetching bureau profiles:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



router.get('/userbymartial/:id', async (req, res) => {
  const { id } = req.params; // This gets the martialId from the URL parameter

  try {
    const user = await User.findOne({ martialId: id }); // Find user by martialId field


      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a user by bureauId
router.get('/bureau/:id', async (req, res) => {
  const { id: bureauId } = req.params;

  try {
    const user = await User.find({ bureauId }).sort({ _id: -1 }); // Sort in descending order

    const totalUsers = user.length;

    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user,totalUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users except the one with a specific bureauId
router.get('/bureau/except/:id', async (req, res) => {
  const { id: bureauId } = req.params;

  try {
    const users = await User.find({ bureauId: { $ne: bureauId } }).sort({ _id: -1 }); // Sort in descending order

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all users except the one with a specific bureauId and filter by gender
router.get('/bureau/except/gender/:id+/:gender', async (req, res) => {
  const { id: bureauId, gender } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const users = await User.find({
      $and: [
        { bureauId: { $ne: bureauId } },
        { gender: gender },
        {
          $or: [
            { showOtherProfiles: { $ne: false } }, // true or undefined/null
            { showOtherProfiles: { $exists: false } }
          ]
        },
        {
          $or: [
            { dontshowagain: { $exists: false } }, // profiles that don't have dontshowagain field
            { dontshowagain: { $nin: [bureauId] } } // profiles that don't have current bureauId in dontshowagain array
          ]
        }
      ]
    })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({
      $and: [
        { bureauId: { $ne: bureauId } },
        { gender: gender },
        {
          $or: [
            { showOtherProfiles: { $ne: false } },
            { showOtherProfiles: { $exists: false } }
          ]
        },
        {
          $or: [
            { dontshowagain: { $exists: false } }, // profiles that don't have dontshowagain field
            { dontshowagain: { $nin: [bureauId] } } // profiles that don't have current bureauId in dontshowagain array
          ]
        }
      ]
    });

    res.status(200).json({
      users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}); 




// Helper function to get excluded profile IDs
const getExcludedProfileIds = async (bureauId) => {
  const reportedProfiles = await ReportedProfile.find({ reporterBureauId: bureauId }).select('reportedProfileId');
  return reportedProfiles.map(report => report.reportedProfileId);
};

// Get completed profiles for a bureau (with pagination and optional active-only filter)
router.get('/bureau/:bureauId/:gender', async (req, res) => {
  const { gender, bureauId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  
  // Return all profiles by default, only use pagination when explicitly requested
  const usePagination = req.query.page || req.query.limit;
  const limit = usePagination ? Math.min(parseInt(req.query.limit, 10) || 20, 100) : 0;
  
  const activeOnly = req.query.activeOnly === '1' || req.query.activeOnly === 'true';
  
  try {
    // Get excluded profile IDs
    const excludedProfileIds = await getExcludedProfileIds(bureauId);

    // Construct the filter object with bureauId, gender, and steps 1-8 set to 1
    const filter = {
      gender,
      bureauId,
      _id: { $nin: excludedProfileIds }
    };
    
    // Add condition that all steps 1-8 must be completed (set to 1)
    for (let i = 1; i <= 8; i++) {
      filter[`step${i}`] = { $in: [1, '1'] };
    }

    // Optional: Only active profiles
    if (activeOnly) {
      filter.$or = [
        { activeStatus: true },
        { activeStatus: 'true' }
      ];
    }

    // Only show visible profiles
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        { visibleToAll: { $ne: false } },
        { visibleToAll: { $exists: false } }
      ]
    });

    // Fetch users - if usePagination is false, get all profiles
    let users, total;
    if (usePagination) {
      // Use pagination
      const skip = (page - 1) * limit;
      [users, total] = await Promise.all([
        User.find(filter).sort({ createdAt: -1, _id: -1 }).skip(skip).limit(limit),
        User.countDocuments(filter)
      ]);
    } else {
      // Get all profiles without pagination
      [users, total] = await Promise.all([
        User.find(filter).sort({ createdAt: -1, _id: -1 }),
        User.countDocuments(filter)
      ]);
    }

    // Prepare counters from ALL returned profiles
    let activeCount = 0, inactiveCount = 0, paidCount = 0, freeCount = 0, otherMediatorCount=0;
    let servicePrefCounters = { only_online: 0, only_offline: 0, online_offline: 0 };
    const PackageDetails = require('../Models/package-details');

    const userData = await Promise.all(users.map(async (user) => {
      const isActive = user.activeStatus === true || user.activeStatus === 'true';
      const profileStatus = isActive ? 'ActiveProfile' : 'InactiveProfile';
      if (isActive) activeCount++; else inactiveCount++;
      
      const isPaid = user.paymentStatus === 'paid';
      const paymentType = isPaid ? 'PaidProfile' : 'FreeProfile';
      if (isPaid) paidCount++; else freeCount++;
      
      let servicePreferenceDetail = null; 
      if (isPaid) {
        const pkg = await PackageDetails.findOne({ userId: user._id });
        if (pkg && pkg.servicePreference) {
          servicePreferenceDetail = pkg.servicePreference;
          if (servicePrefCounters.hasOwnProperty(pkg.servicePreference)) {
            servicePrefCounters[pkg.servicePreference]++;
          }
        }
      }
      
      const filterTags = [];
      filterTags.push(isActive ? 'Active' : 'Inactive');
      filterTags.push(isPaid ? 'Paid' : 'Free');
      if (servicePreferenceDetail) {
        if (servicePreferenceDetail === 'only_online') filterTags.push('Online');
        else if (servicePreferenceDetail === 'only_offline') filterTags.push('Offline');
        else if (servicePreferenceDetail === 'online_offline') filterTags.push('Both');
      }

       // Include Other Mediater Profile details if createdBy is "Other Mediater Profile"
      let otherMediatorDetails = null;
      if (user.createdBy === 'Other Mediater Profile') {
        // otherMediatorDetails = await User.findOne({ _id: user._id }); // fetch the full user document
        otherMediatorCount++; // increment counter
            otherMediatorDetails = user;

      }

      
      return {
        ...user.toObject(),
        profileStatus,
        paymentType,
        servicePreferenceDetail,
        filterTags, 
        otherMediatorDetails
      };
    }));   

    const response = {
      users: userData,
      counters: {
        active: activeCount,
        inactive: inactiveCount,
        paid: paidCount,
        free: freeCount,
        otherMediatorDetails: otherMediatorCount,
        servicePreferences: servicePrefCounters
      },
      total: total + otherMediatorCount
    };

    // Only include pagination info if using pagination
    if (usePagination) {
      response.currentPage = page;
      response.totalPages = Math.ceil(total / limit);
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Get pending profiles for a bureau
router.get('/bureaupendinguser/:bureauId/:gender', async (req, res) => {
  const { gender, bureauId } = req.params;
  
  try {
    // Get excluded profile IDs
    const excludedProfileIds = await getExcludedProfileIds(bureauId);

    // Construct query to find users who have at least one step pending (0) or missing
    const query = { 
      gender,  
      bureauId,
      _id: { $nin: excludedProfileIds },
      $or: [] 
    };

    // Add conditions to fetch users with any step (1-8) missing OR set to 0
    for (let i = 1; i <= 8; i++) {
      query.$or.push(
        { [`step${i}`]: 0 }, 
        { [`step${i}`]: { $exists: false } }
      );
    }

    // Fetch only users who have at least one missing or pending step
    const pendingUsers = await User.find(query).sort({ _id: -1 });

    if (pendingUsers.length === 0) {
      return res.status(404).json({
        message: `No pending profiles found for gender ${gender} and bureauId ${bureauId}.`,
      });
    }

    // Process users to identify their pending steps
    const formattedUsers = pendingUsers.map(user => {
      const pendingSteps = [];

      // Check each step (1-8) for being missing or 0
      for (let i = 1; i <= 8; i++) {
        if (!user.hasOwnProperty(`step${i}`) || user[`step${i}`] === 0) {
          pendingSteps.push(`step${i}`);
        }
      }

      return { ...user.toObject(), pendingSteps };
    });

    // Return consistent structure with the first route
    res.status(200).json({
      users: formattedUsers,
      totalPending: formattedUsers.length
    });
  } catch (error) {
    console.error('Error fetching pending profiles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get('/profile/:userId', async (req, res) => {
  const { martialId } = req.params;

  try {
    // Find the user by the bureauId field
    const user = await User.findOne({ martialId: martialId }); // Use `findOne` with a filter condition
    
    // If the user does not exist, return a 404 response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the full user object as a response
    res.status(200).json(user);
  } catch (error) {
    console.error('❌ Error fetching user by martialId:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users with gender "female" (in descending order)
router.get('/gender/female', async (req, res) => {
  try {
    // Find all users with gender "female" and sort by `_id` in descending order
    const users = await User.find({ gender: "female" }).sort({ _id: -1 });

    // If no users with gender "female" are found, return a 404 response
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Female users not found' });
    }

    // Return the array of users as a response
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users with gender "male" (in descending order)
router.get('/gender/male', async (req, res) => {
  try {
    // Find all users with gender "male" and sort by `_id` in descending order
    const users = await User.find({ gender: "male" }).sort({ _id: -1 });

    // If no users with gender "male" are found, return a 404 response
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'Male users not found' });
    }

    // Return the array of users as a response
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Serve static files from the 'uploads' folder
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to handle image requests
router.get('/uploads/:imageName', (req, res) => {
  const { imageName } = req.params;

  // Adjust the path to point to the correct location of the uploads folder
  const imagePath = path.join(__dirname, '..', 'uploads', imageName);

  // console.log('Resolved Image Path:', imagePath); // For debugging, check the full path

  // Send the image file
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).json({ message: 'Image not found' });
    }
  });
});

// Advanced Search endpoint for users (original route)
router.post('/user-advanced-search', async (req, res) => {
  console.log('=== USER ADVANCED SEARCH ROUTE CALLED ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const {
      // Gender selection (required)
      gender,
      
      // Bureau filtering
      bureauId,
      excludeBureauId,
      
      // Caste & Religion Preferences
      religionPreferences,
      castePreferences,
      subCastePreferences,
      motherTonguePreferences,
      maritalStatusPreferences,
      childrenPreferences,
      
      // Basic Details Preferences
      ageMin,
      ageMax,
      heightMin,
      heightMax,
      createdByPreferences,
      physicalStatusPreferences,
      eatingHabitsPreferences,
      
      // Profession & Income Preferences
      educationPreferences,
      occupationPreferences,
      jobLocationPreferences,
      annualIncomePreferences,
      familyPreferences,
      settledLocationPreferences,
      
      // Location Preferences
      countryPreferences,
      statePreferences,
      cityPreferences,
      citizenshipPreferences,
      
      // Pagination
      page = 1,
      limit = 10
    } = req.body;

    console.log('Extracted parameters:', {
      gender,
      bureauId,
      excludeBureauId,
      ageMin,
      ageMax,
      heightMin,
      heightMax
    });

    // Validate required fields
    if (!gender) {
      console.log('ERROR: Gender is required but not provided');
      return res.status(400).json({ message: 'Gender is required for search' });
    }

    // Validate pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    
    if (pageNum < 1) {
      return res.status(400).json({ message: 'Page must be greater than 0' });
    }
    
    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ message: 'Limit must be between 1 and 100' });
    }

    // Build the query object
    const query = { gender };
    console.log('Initial query:', query);

    // Add bureau filtering
    if (bureauId) {
      query.bureauId = bureauId; // Same bureau search
      console.log('Added bureauId filter:', bureauId);
    } else if (excludeBureauId) {
      query.bureauId = { $ne: excludeBureauId }; // Other bureau search
      console.log('Added excludeBureauId filter:', excludeBureauId);
    }

    // Helper function to add array-based filters
    const addArrayFilter = (field, preferences) => {
      if (preferences && preferences !== 'Any' && preferences.trim() !== '') {
        const values = preferences.split(',').map(p => p.trim()).filter(p => p !== '');
        if (values.length > 0) {
          query[field] = { $in: values };
          console.log(`Added ${field} filter:`, values);
        }
      }
    };

    // Helper function to add range filters
    const addRangeFilter = (field, min, max) => {
      if (min !== undefined && max !== undefined && min !== null && max !== null) {
        query[field] = { $gte: min, $lte: max };
        console.log(`Added ${field} range filter:`, { min, max });
      }
    };

    // Religion preferences
    addArrayFilter('religion', religionPreferences);

    // Caste preferences
    addArrayFilter('caste', castePreferences);

    // Sub-caste preferences
    addArrayFilter('subcaste', subCastePreferences);

    // Mother tongue preferences
    addArrayFilter('motherTongue', motherTonguePreferences);

    // Marital status preferences
    addArrayFilter('maritalStatus', maritalStatusPreferences);

    // Children preferences (only if marital status is not "Never Married")
    if (childrenPreferences && childrenPreferences !== 'Any' && childrenPreferences !== 'no_children') {
      if (childrenPreferences === 'has_children') {
        query.$or = [
          { maleKids: { $gt: 0 } },
          { femaleKids: { $gt: 0 } }
        ];
        console.log('Added has_children filter');
      } else if (childrenPreferences === 'want_children') {
        query.$or = [
          { maleKids: 0, femaleKids: 0 },
          { maleKids: { $exists: false } },
          { femaleKids: { $exists: false } }
        ];
        console.log('Added want_children filter');
      }
    }

    // Created by preferences
    addArrayFilter('createdBy', createdByPreferences);

    // Physical status preferences
    addArrayFilter('physicalState', physicalStatusPreferences);

    // Eating habits preferences
    addArrayFilter('eatingHabits', eatingHabitsPreferences);

    // Education preferences
    addArrayFilter('education', educationPreferences);

    // Occupation preferences
    addArrayFilter('occupation', occupationPreferences);

    // Job location preferences
    addArrayFilter('jobLocation', jobLocationPreferences);

    // Annual income preferences
    addArrayFilter('annualIncome', annualIncomePreferences);

    // Family preferences
    addArrayFilter('familyType', familyPreferences);

    // Settled location preferences
    addArrayFilter('selectedLocation', settledLocationPreferences);

    // Country preferences
    addArrayFilter('country', countryPreferences);

    // State preferences
    addArrayFilter('state', statePreferences);

    // City/District preferences
    addArrayFilter('district', cityPreferences);

    // Citizenship preferences
    addArrayFilter('citizenship', citizenshipPreferences);

    // Age range filter (calculate age from dateOfBirth)
    if (ageMin !== undefined && ageMax !== undefined) {
      query.$and = query.$and || [];
      const today = new Date();
      const minDate = new Date(today.getFullYear() - ageMax, today.getMonth(), today.getDate());
      const maxDate = new Date(today.getFullYear() - ageMin, today.getMonth(), today.getDate());
      query.$and.push({
        $and: [
          { dateOfBirth: { $exists: true, $ne: null } },
          { dateOfBirth: { $gte: minDate, $lte: maxDate } }
        ]
      });
      console.log('Added age range filter:', { ageMin, ageMax, minDate, maxDate });
    }

    // Height range filter
    if (heightMin !== undefined && heightMax !== undefined) {
      query.$and = query.$and || [];
      query.$and.push({
        $and: [
          { height: { $exists: true, $ne: null, $ne: "" } },
          { height: { $gte: heightMin.toString(), $lte: heightMax.toString() } }
        ]
      });
      console.log('Added height range filter:', { heightMin, heightMax });
    }

    // Add step completion filter (only show profiles with steps 1-8 completed)
    for (let i = 1; i <= 8; i++) {
      query[`step${i}`] = 1;
    }
    console.log('Added step completion filters (steps 1-8)');

    // Add visibility filters
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { visibleToAll: { $ne: false } }, // true or undefined/null
        { visibleToAll: { $exists: false } }
      ]
    });
    console.log('Added visibility filters');

    // Debug: Log the final query being built
    console.log('Final query:', JSON.stringify(query, null, 2));

    // Calculate pagination
    const skip = (pageNum - 1) * limitNum;
    console.log('Pagination:', { pageNum, limitNum, skip });

    // Execute the query with pagination
    const users = await User.find(query)
      .sort({ createdAt: -1, _id: -1 }) // Sort by recent profiles first
      .skip(skip)
      .limit(limitNum);

    console.log(`Found ${users.length} users`);

    // Get total count for pagination
    const total = await User.countDocuments(query);
    console.log(`Total count: ${total}`);

    // Calculate total pages
    const totalPages = Math.ceil(total / limitNum);

    const response = {
      users,
      total,
      currentPage: pageNum,
      totalPages,
      hasMore: pageNum < totalPages
    };

    console.log('Sending response:', {
      usersCount: users.length,
      total,
      currentPage: pageNum,
      totalPages,
      hasMore: pageNum < totalPages
    });

    res.status(200).json(response);

  } catch (error) {
    console.error('User advanced search error:', error);
    res.status(500).json({ message: 'Server error during advanced search' });
  }
});

// Advanced Search endpoint for frontend compatibility (matches /api/advanced-search)
router.post('/advanced-search', async (req, res) => {
  console.log('=== ADVANCED SEARCH ROUTE CALLED (frontend compatibility) ===');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const {
      // Gender selection (required)
      gender,
      
      // Bureau filtering
      bureauId,
      excludeBureauId,
      
      // Caste & Religion Preferences
      religionPreferences,
      castePreferences,
      subCastePreferences,
      motherTonguePreferences,
      maritalStatusPreferences,
      childrenPreferences,
      
      // Basic Details Preferences
      ageMin,
      ageMax,
      heightMin,
      heightMax,
      createdByPreferences,
      physicalStatusPreferences,
      eatingHabitsPreferences,
      
      // Profession & Income Preferences
      educationPreferences,
      occupationPreferences,
      jobLocationPreferences,
      annualIncomePreferences,
      familyPreferences,
      settledLocationPreferences,
      
      // Location Preferences
      countryPreferences,
      statePreferences,
      cityPreferences,
      citizenshipPreferences,
      
      // Pagination
      page = 1,
      limit = 10
    } = req.body;

    console.log('Extracted parameters:', {
      gender,
      bureauId,
      excludeBureauId,
      ageMin,
      ageMax,
      heightMin,
      heightMax
    });

    // Validate required fields
    if (!gender) {
      console.log('ERROR: Gender is required but not provided');
      return res.status(400).json({ message: 'Gender is required for search' });
    }

    // Validate pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    
    if (pageNum < 1) {
      return res.status(400).json({ message: 'Page must be greater than 0' });
    }
    
    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ message: 'Limit must be between 1 and 100' });
    }

    // Build the query object
    const query = { gender };
    console.log('Initial query:', query);

    // Add bureau filtering
    if (bureauId) {
      query.bureauId = bureauId; // Same bureau search
      console.log('Added bureauId filter:', bureauId);
    } else if (excludeBureauId) {
      query.bureauId = { $ne: excludeBureauId }; // Other bureau search
      console.log('Added excludeBureauId filter:', excludeBureauId);
    }

    // Helper function to add array-based filters
    const addArrayFilter = (field, preferences) => {
      if (preferences && preferences !== 'Any' && preferences.trim() !== '') {
        const values = preferences.split(',').map(p => p.trim()).filter(p => p !== '');
        if (values.length > 0) {
          query[field] = { $in: values };
          console.log(`Added ${field} filter:`, values);
        }
      }
    };

    // Helper function to add range filters
    const addRangeFilter = (field, min, max) => {
      if (min !== undefined && max !== undefined && min !== null && max !== null) {
        query[field] = { $gte: min, $lte: max };
        console.log(`Added ${field} range filter:`, { min, max });
      }
    };

    // Religion preferences
    addArrayFilter('religion', religionPreferences);

    // Caste preferences
    addArrayFilter('caste', castePreferences);

    // Sub-caste preferences
    addArrayFilter('subcaste', subCastePreferences);

    // Mother tongue preferences
    addArrayFilter('motherTongue', motherTonguePreferences);

    // Marital status preferences
    addArrayFilter('maritalStatus', maritalStatusPreferences);

    // Children preferences (only if marital status is not "Never Married")
    if (childrenPreferences && childrenPreferences !== 'Any' && childrenPreferences !== 'no_children') {
      if (childrenPreferences === 'has_children') {
        query.$or = [
          { maleKids: { $gt: 0 } },
          { femaleKids: { $gt: 0 } }
        ];
        console.log('Added has_children filter');
      } else if (childrenPreferences === 'want_children') {
        query.$or = [
          { maleKids: 0, femaleKids: 0 },
          { maleKids: { $exists: false } },
          { femaleKids: { $exists: false } }
        ];
        console.log('Added want_children filter');
      }
    }

    // Created by preferences
    addArrayFilter('createdBy', createdByPreferences);

    // Physical status preferences
    addArrayFilter('physicalState', physicalStatusPreferences);

    // Eating habits preferences
    addArrayFilter('eatingHabits', eatingHabitsPreferences);

    // Education preferences
    addArrayFilter('education', educationPreferences);

    // Occupation preferences
    addArrayFilter('occupation', occupationPreferences);

    // Job location preferences
    addArrayFilter('jobLocation', jobLocationPreferences);

    // Annual income preferences
    addArrayFilter('annualIncome', annualIncomePreferences);

    // Family preferences
    addArrayFilter('familyType', familyPreferences);

    // Settled location preferences
    addArrayFilter('selectedLocation', settledLocationPreferences);

    // Country preferences
    addArrayFilter('country', countryPreferences);

    // State preferences
    addArrayFilter('state', statePreferences);

    // City/District preferences
    addArrayFilter('district', cityPreferences);

    // Citizenship preferences
    addArrayFilter('citizenship', citizenshipPreferences);

    // Age range filter (calculate age from dateOfBirth)
    if (ageMin !== undefined && ageMax !== undefined) {
      query.$and = query.$and || [];
      const today = new Date();
      const minDate = new Date(today.getFullYear() - ageMax, today.getMonth(), today.getDate());
      const maxDate = new Date(today.getFullYear() - ageMin, today.getMonth(), today.getDate());
      query.$and.push({
        $and: [
          { dateOfBirth: { $exists: true, $ne: null } },
          { dateOfBirth: { $gte: minDate, $lte: maxDate } }
        ]
      });
      console.log('Added age range filter:', { ageMin, ageMax, minDate, maxDate });
    }

    // Height range filter
    if (heightMin !== undefined && heightMax !== undefined) {
      query.$and = query.$and || [];
      query.$and.push({
        $and: [
          { height: { $exists: true, $ne: null, $ne: "" } },
          { height: { $gte: heightMin.toString(), $lte: heightMax.toString() } }
        ]
      });
      console.log('Added height range filter:', { heightMin, heightMax });
    }

    // Add step completion filter (only show profiles with steps 1-8 completed)
    for (let i = 1; i <= 8; i++) {
      query[`step${i}`] = 1;
    }
    console.log('Added step completion filters (steps 1-8)');

    // Add visibility filters
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { visibleToAll: { $ne: false } }, // true or undefined/null
        { visibleToAll: { $exists: false } }
      ]
    });
    console.log('Added visibility filters');

    // Debug: Log the final query being built
    console.log('Final query:', JSON.stringify(query, null, 2));

    // Calculate pagination
    const skip = (pageNum - 1) * limitNum;
    console.log('Pagination:', { pageNum, limitNum, skip });

    // Execute the query with pagination
    const users = await User.find(query)
      .sort({ createdAt: -1, _id: -1 }) // Sort by recent profiles first
      .skip(skip)
      .limit(limitNum);

    console.log(`Found ${users.length} users`);

    // Get total count for pagination
    const total = await User.countDocuments(query);
    console.log(`Total count: ${total}`);

    // Calculate total pages
    const totalPages = Math.ceil(total / limitNum);

    const response = {
      users,
      total,
      currentPage: pageNum,
      totalPages,
      hasMore: pageNum < totalPages
    };

    console.log('Sending response:', {
      usersCount: users.length,
      total,
      currentPage: pageNum,
      totalPages,
      hasMore: pageNum < totalPages
    });

    res.status(200).json(response);

  } catch (error) {
    console.error('User advanced search error:', error);
    res.status(500).json({ message: 'Server error during advanced search' });
  }
});

// Increment profile views (POST /user/:id/increment-views)
router.post('/user/:id/increment-views', async (req, res) => {
  const { id } = req.params;

  try {
    // Use findOneAndUpdate with atomic increment to avoid version conflicts
    const result = await User.findOneAndUpdate(
      { _id: id },
      { $inc: { views: 1 } },
      { 
        new: true, // Return the updated document
        runValidators: true,
        upsert: false // Don't create if doesn't exist
      }
    );

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Views incremented successfully',
      views: result.views 
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add counts endpoint for dashboards (GET /users/counts)
router.get('/users/counts', async (req, res) => {
  try {
    // Total users
    const totalPromise = User.countDocuments({});

    // Gender counts
    const malePromise = User.countDocuments({ gender: 'male' });
    const femalePromise = User.countDocuments({ gender: 'female' });

    // Today's profiles (based on createdAt)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);
    const todayPromise = User.countDocuments({ createdAt: { $gte: startOfDay, $lt: endOfDay } });

    // Suspended profiles (suspendreason present and non-empty)
    const suspendedPromise = User.countDocuments({ suspendreason: { $exists: true, $ne: null, $ne: '' } });

    // Reported profiles (all reports count)
    const reportedPromise = ReportedProfile.countDocuments({});

    // Complete profiles (steps 1-8 equal to 1 or "1"). Incomplete = total - complete
    const completeQuery = {
      $and: Array.from({ length: 8 }, (_, i) => i + 1).map((stepNum) => ({
        $or: [
          { [`step${stepNum}`]: 1 },
          { [`step${stepNum}`]: '1' }
        ]
      }))
    };
    const completePromise = User.countDocuments(completeQuery);

    const [total, male, female, today, suspended, reported, complete] = await Promise.all([
      totalPromise,
      malePromise,
      femalePromise,
      todayPromise,
      suspendedPromise,
      reportedPromise,
      completePromise,
    ]);

    const incomplete = Math.max(0, total - complete);

    // Deleted profiles: hard-deletes are not tracked, so return 0 (no audit collection). Keep key for UI compatibility.
    const deleted = 0;

    return res.status(200).json({
      total,
      male,
      female,
      today,
      suspended,
      reported,
      incomplete,
      deleted,
    });
  } catch (error) {
    console.error('Error fetching user counts:', error);
    return res.status(500).json({ message: 'Server error fetching counts' });
  }
});

module.exports = router;
 