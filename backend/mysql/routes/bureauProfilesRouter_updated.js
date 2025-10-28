const express = require('express');
const dotenv = require('dotenv'); // To load environment variables from .env file
const mysql = require('mysql2'); // Import the mysql module

const router = express.Router();
dotenv.config();

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
});

// Enhanced image processing function
const processUserImages = (row) => {
  let processedImages = [];
  
  try {
    // Try images field first (BLOB or JSON)
    if (row.images) {
      if (typeof row.images === 'string') {
        // JSON string
        processedImages = JSON.parse(row.images);
      } else if (Buffer.isBuffer(row.images)) {
        // BLOB data - convert to base64
        const base64Image = Buffer.from(row.images).toString('base64');
        processedImages = [base64Image];
      }
    }
    // Try image field (single image)
    else if (row.image) {
      if (typeof row.image === 'string') {
        // File path or base64 string
        if (row.image.startsWith('data:')) {
          processedImages = [row.image];
        } else {
          // File path - convert to full URL
          processedImages = [`/uploads/${row.image}`];
        }
      } else if (Buffer.isBuffer(row.image)) {
        // BLOB data
        const base64Image = Buffer.from(row.image).toString('base64');
        processedImages = [base64Image];
      }
    }
    // Try profile_img field
    else if (row.profile_img) {
      if (typeof row.profile_img === 'string') {
        if (row.profile_img.startsWith('data:')) {
          processedImages = [row.profile_img];
        } else {
          processedImages = [`/uploads/${row.profile_img}`];
        }
      } else if (Buffer.isBuffer(row.profile_img)) {
        const base64Image = Buffer.from(row.profile_img).toString('base64');
        processedImages = [base64Image];
      }
    }
  } catch (error) {
    console.error('Error processing images for user', row.userId, ':', error);
    processedImages = [];
  }
  
  return processedImages;
};

// Endpoint to get bureau profiles by bureauId
router.get('/bureau_profiles_bureauId', (req, res) => {
  const bureauId = req.query.bureauId;

  // Check if bureauId is provided
  if (!bureauId) {
    return res.status(400).json({ message: 'bureauId is required' });
  }

  // Query to get bureau profiles for the specified bureauId with profile image
  const query = `
    SELECT 
      bp.*,
      p.profile_img
    FROM bureau_profiles bp
    LEFT JOIN profiles p ON bp.bureauId = p.bureau_id
    WHERE bp.bureauId = ?
  `;
  
  db.query(query, [bureauId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    // Process results to handle profile images
    const processedResults = results.map(row => {
      const bureau = { ...row };
      if (bureau.profile_img) {
        // Convert BLOB buffer to base64 string
        bureau.profile_img = Buffer.from(bureau.profile_img).toString('base64');
      }
      return bureau;
    });

    // Respond with the processed results
    res.status(200).json({ bureauProfiles: processedResults });
  });
});

router.get('/all_bureaus', (req, res) => {
  const query = `SELECT DISTINCT bureauId, bureauName FROM bureau_profiles`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    res.status(200).json({ bureaus: results });
  });
});

router.get('/all_bureau_users_grouped', (req, res) => {
  const query = `
    SELECT 
      bp.bureauId,
      bp.bureauName,
      bp.mobileNumber, 
      bp.email,
      u.id AS userId,
      u.name AS userName,
      u.gender,
      u.email AS userEmail,
      u.mobileNumber AS userMobile,
      u.images,
      u.image,
      u.profile_img
    FROM bureau_profiles bp
    LEFT JOIN users u ON bp.bureauId = u.bureauId
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    // Group users by bureauId
    const bureaus = {};
    results.forEach(row => {
      if (!bureaus[row.bureauId]) {
        bureaus[row.bureauId] = {
          bureauId: row.bureauId,
          bureauName: row.bureauName,
          mobileNumber: row.mobileNumber,
          email: row.email,
          users: []
        };
      }

      if (row.userId) {
        const processedImages = processUserImages(row);

        bureaus[row.bureauId].users.push({
          userId: row.userId,
          userName: row.userName,
          gender: row.gender,
          email: row.userEmail,
          mobileNumber: row.userMobile,
          images: processedImages
        });
      }
    });

    res.status(200).json({ bureaus: Object.values(bureaus) });
  });
});

router.get('/all_bureau_users_othermidiater', (req, res) => {
  const query = `
    SELECT 
      bp.bureauId,
      bp.bureauName,
      bp.mobileNumber,
      bp.email,
      u.id AS userId,
      u.name AS userName,
      u.gender,
      u.email AS userEmail,
      u.mobileNumber AS userMobile,
      u.images,
      u.image,
      u.profile_img,
      u.createdBy
    FROM bureau_profiles bp
    LEFT JOIN users u ON bp.bureauId = u.bureauId
    WHERE u.createdBy = 'Other Midiater Profile'
  `;

  console.log('Executing query for other mediator profiles...');

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    console.log('Query results count:', results.length);
    console.log('Sample result:', results[0] ? {
      userId: results[0].userId,
      userName: results[0].userName,
      imagesType: typeof results[0].images,
      imagesLength: results[0].images ? results[0].images.length : 'null',
      imageType: typeof results[0].image,
      imageLength: results[0].image ? results[0].image.length : 'null',
      profileImgType: typeof results[0].profile_img,
      profileImgLength: results[0].profile_img ? results[0].profile_img.length : 'null',
      imagesPreview: results[0].images ? results[0].images.toString().substring(0, 100) : 'null',
      imagePreview: results[0].image ? results[0].image.toString().substring(0, 100) : 'null',
      profileImgPreview: results[0].profile_img ? results[0].profile_img.toString().substring(0, 100) : 'null'
    } : 'No results');

    const bureaus = {};

    results.forEach(row => {
      if (!bureaus[row.bureauId]) {
        bureaus[row.bureauId] = {
          bureauId: row.bureauId,
          bureauName: row.bureauName,
          mobileNumber: row.mobileNumber,
          email: row.email,
          maleUsers: [],
          femaleUsers: []
        };
      }

      if (row.userId) {
        const processedImages = processUserImages(row);

        const userObj = {
          userId: row.userId,
          userName: row.userName,
          gender: row.gender,
          email: row.userEmail,
          mobileNumber: row.userMobile,
          createdBy: row.createdBy,
          images: processedImages
        };

        if (row.gender === 'Male') {
          bureaus[row.bureauId].maleUsers.push(userObj);
        } else if (row.gender === 'Female') {
          bureaus[row.bureauId].femaleUsers.push(userObj);
        }
      }
    });

    res.status(200).json({ bureaus: Object.values(bureaus) });
  });
});

router.get('/all_bureau_users_gender', (req, res) => {
  const { gender } = req.query; // e.g. ?gender=Male or ?gender=Female

  // Base query
  let query = `
    SELECT 
      bp.bureauId,
      bp.bureauName,
      bp.mobileNumber,
      bp.email,
      u.id AS userId,
      u.name AS userName,
      u.gender,
      u.email AS userEmail,
      u.mobileNumber AS userMobile,
      u.images,
      u.image,
      u.profile_img,
      u.createdBy
    FROM bureau_profiles bp
    LEFT JOIN users u ON bp.bureauId = u.bureauId
    WHERE u.createdBy = 'Other Midiater Profile'
  `;

  const params = [];

  // If gender filter is provided, add to query
  if (gender) {
    query += ' AND u.gender = ?';
    params.push(gender);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    const bureaus = {};

    results.forEach(row => {
      if (!bureaus[row.bureauId]) {
        bureaus[row.bureauId] = {
          bureauId: row.bureauId,
          bureauName: row.bureauName,
          mobileNumber: row.mobileNumber,
          email: row.email,
          maleUsers: [],
          femaleUsers: []
        };
      }

      if (row.userId) {
        const processedImages = processUserImages(row);

        const userObj = {
          userId: row.userId,
          userName: row.userName,
          gender: row.gender,
          email: row.userEmail,
          mobileNumber: row.userMobile,
          createdBy: row.createdBy,
          images: processedImages
        };

        if (row.gender === 'Male') {
          bureaus[row.bureauId].maleUsers.push(userObj);
        } else if (row.gender === 'Female') {
          bureaus[row.bureauId].femaleUsers.push(userObj);
        }
      }
    });

    res.status(200).json({ bureaus: Object.values(bureaus) });
  });
});

// Get user images by userId
router.get('/user-images/:userId', (req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    return res.status(400).json({ message: 'userId is required' });
  }

  const query = `
    SELECT 
      u.id AS userId,
      u.name AS userName,
      u.images,
      u.image,
      u.profile_img,
      u.createdBy
    FROM users u
    WHERE u.id = ? AND u.createdBy = 'Other Midiater Profile'
  `;

  console.log('Fetching images for userId:', userId);

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    console.log('User found:', {
      userId: user.userId,
      userName: user.userName,
      imagesType: typeof user.images,
      imagesLength: user.images ? user.images.length : 'null',
      imageType: typeof user.image,
      imageLength: user.image ? user.image.length : 'null',
      profileImgType: typeof user.profile_img,
      profileImgLength: user.profile_img ? user.profile_img.length : 'null',
      imagesPreview: user.images ? user.images.toString().substring(0, 100) : 'null',
      imagePreview: user.image ? user.image.toString().substring(0, 100) : 'null',
      profileImgPreview: user.profile_img ? user.profile_img.toString().substring(0, 100) : 'null'
    });

    const processedImages = processUserImages(user);

    res.status(200).json({
      userId: user.userId,
      userName: user.userName,
      images: processedImages,
      createdBy: user.createdBy
    });
  });
});

// Get all users with their images (for debugging)
router.get('/debug-users-images', (req, res) => {
  const query = `
    SELECT 
      u.id AS userId,
      u.name AS userName,
      u.gender,
      u.images,
      u.image,
      u.profile_img,
      u.createdBy,
      LENGTH(u.images) as imagesLength,
      TYPE(u.images) as imagesType,
      LENGTH(u.image) as imageLength,
      LENGTH(u.profile_img) as profileImgLength
    FROM users u
    WHERE u.createdBy = 'Other Midiater Profile'
    LIMIT 10
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    const debugResults = results.map(row => ({
      userId: row.userId,
      userName: row.userName,
      gender: row.gender,
      imagesLength: row.imagesLength,
      imagesType: row.imagesType,
      imageLength: row.imageLength,
      profileImgLength: row.profileImgLength,
      hasImages: row.images ? true : false,
      hasImage: row.image ? true : false,
      hasProfileImg: row.profile_img ? true : false,
      imagesPreview: row.images ? row.images.toString().substring(0, 50) + '...' : 'null',
      imagePreview: row.image ? row.image.toString().substring(0, 50) + '...' : 'null',
      profileImgPreview: row.profile_img ? row.profile_img.toString().substring(0, 50) + '...' : 'null'
    }));

    res.status(200).json({
      message: 'Debug information for users with Other Midiater Profile',
      count: results.length,
      users: debugResults
    });
  });
});

module.exports = router;
