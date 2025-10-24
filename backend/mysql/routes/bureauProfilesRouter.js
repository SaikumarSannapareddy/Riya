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
      u.images
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
        bureaus[row.bureauId].users.push({
          userId: row.userId,
          userName: row.userName,
          gender: row.gender,
          email: row.userEmail,
          mobileNumber: row.userMobile,
          images: row.images ? JSON.parse(row.images) : []
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
      u.createdBy
    FROM bureau_profiles bp
    LEFT JOIN users u ON bp.bureauId = u.bureauId
    WHERE u.createdBy = 'Other Midiater Profile'
  `;

  db.query(query, (err, results) => {
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
        const userObj = {
          userId: row.userId,
          userName: row.userName,
          gender: row.gender,
          email: row.userEmail,
          mobileNumber: row.userMobile,
          createdBy: row.createdBy,
          images: row.images ? JSON.parse(row.images) : []
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
        const userObj = {
          userId: row.userId,
          userName: row.userName,
          gender: row.gender,
          email: row.userEmail,
          mobileNumber: row.userMobile,
          createdBy: row.createdBy,
          images: (() => {
            try {
              return row.images ? JSON.parse(row.images) : [];
            } catch {
              return [];
            }
          })(),
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


module.exports = router;
