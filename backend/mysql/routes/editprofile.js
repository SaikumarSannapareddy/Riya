const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


// Multer storage configuration for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to extract bureauId from request headers
const getBureauId = (req, res, next) => {
  req.bureauId = req.headers['bureauid'];
  if (!req.bureauId) {
    return res.status(400).json({ error: 'Bureau ID is required' });
  }
  next();
};

// Get profile image
router.get('/profiles', getBureauId, (req, res) => {
  db.query('SELECT id, profile_img FROM profiles WHERE bureau_id = ? ORDER BY id DESC LIMIT 1', [req.bureauId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // If no profile image found, return null
    if (results.length === 0) {
      return res.json({ profile_img: null });
    }

    // Convert buffer to base64 if image exists
    const profileImg = results[0].profile_img 
      ? results[0].profile_img.toString('base64') 
      : null;

    res.json({ 
      id: results[0].id, 
      profile_img: profileImg 
    });
  });
});

// Upload/Update profile image
router.post('/profiles', upload.single('profile_img'), getBureauId, (req, res) => {
  const profileImg = req.file ? req.file.buffer : null;

  // First, delete any existing profile images for this bureau
  db.query('DELETE FROM profiles WHERE bureau_id = ?', [req.bureauId], (deleteErr) => {
    if (deleteErr) {
      return res.status(500).json({ error: deleteErr.message });
    }

    // Then insert the new profile image
    db.query(
      'INSERT INTO profiles (profile_img, bureau_id) VALUES (?, ?)',
      [profileImg, req.bureauId],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ 
          message: 'Profile image uploaded successfully', 
          profileId: result.insertId 
        });
      }
    );
  });
});

module.exports = router;