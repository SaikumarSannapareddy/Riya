const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require('multer');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config(); // Load environment variables

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'package_banners/'); // Save uploaded images in the 'package_banners' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique file name using timestamp
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Get all package banners
router.get('/packages', (req, res) => {
  const query = `
    SELECT 
      id, image_path, status, created_at, updated_at 
    FROM package_banners 
    ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching package banners:', err);
      return res.status(500).json({ error: 'Failed to fetch package banners' });
    }
    res.json(results);
  });
});

// Get single package banner by ID
router.get('/packages/:id', (req, res) => {
  const bannerId = req.params.id;
  const query = `
    SELECT 
      id, image_path, status, created_at, updated_at 
    FROM package_banners 
    WHERE id = ?
  `;

  db.query(query, [bannerId], (err, results) => {
    if (err) {
      console.error('Error fetching package banner:', err);
      return res.status(500).json({ error: 'Failed to fetch package banner' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Package banner not found' });
    }

    res.json(results[0]);
  });
});

// Create new package banner
router.post('/packages', upload.single('image'), (req, res) => {
  const imagePath = req.file ? req.file.path : null;

  if (!imagePath) {
    return res.status(400).json({ error: 'Image is required' });
  }

  const query = `
    INSERT INTO package_banners 
    (image_path, status, created_at, updated_at) 
    VALUES (?, 'active', NOW(), NOW())
  `;

  db.query(query, [imagePath], (err, results) => {
    if (err) {
      console.error('Error creating package banner:', err);
      return res.status(500).json({ error: 'Failed to create package banner' });
    }

    res.status(201).json({ 
      message: 'Package banner created successfully', 
      bannerId: results.insertId,
      imagePath: imagePath
    });
  });
});

// Update package banner
router.put('/packages/:id', upload.single('image'), (req, res) => {
  const bannerId = req.params.id;
  const { status } = req.body;
  const imagePath = req.file ? req.file.path : null;

  let query, params;

  if (imagePath) {
    // Update with new image
    query = `
      UPDATE package_banners 
      SET image_path = ?, status = ?, updated_at = NOW() 
      WHERE id = ?
    `;
    params = [imagePath, status, bannerId];
  } else {
    // Update without changing image
    query = `
      UPDATE package_banners 
      SET status = ?, updated_at = NOW() 
      WHERE id = ?
    `;
    params = [status, bannerId];
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error updating package banner:', err);
      return res.status(500).json({ error: 'Failed to update package banner' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Package banner not found' });
    }

    res.json({ 
      message: 'Package banner updated successfully',
      imagePath: imagePath
    });
  });
});

// Delete package banner
router.delete('/packages/:id', (req, res) => {
  const bannerId = req.params.id;

  // First get the image path to delete the file
  const getQuery = 'SELECT image_path FROM package_banners WHERE id = ?';
  
  db.query(getQuery, [bannerId], (err, results) => {
    if (err) {
      console.error('Error fetching banner for deletion:', err);
      return res.status(500).json({ error: 'Failed to fetch banner for deletion' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Package banner not found' });
    }

    const imagePath = results[0].image_path;

    // Delete from database
    const deleteQuery = 'DELETE FROM package_banners WHERE id = ?';
    
    db.query(deleteQuery, [bannerId], (err, results) => {
      if (err) {
        console.error('Error deleting package banner:', err);
        return res.status(500).json({ error: 'Failed to delete package banner' });
      }

      // Delete the image file from filesystem
      const fs = require('fs');
      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      res.json({ message: 'Package banner deleted successfully' });
    });
  });
});

// Toggle banner status
router.patch('/packages/:id/status', (req, res) => {
  const bannerId = req.params.id;
  const { status } = req.body;

  if (!status || !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ error: 'Status must be either active or inactive' });
  }

  const query = `
    UPDATE package_banners 
    SET status = ?, updated_at = NOW() 
    WHERE id = ?
  `;

  db.query(query, [status, bannerId], (err, results) => {
    if (err) {
      console.error('Error updating banner status:', err);
      return res.status(500).json({ error: 'Failed to update banner status' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Package banner not found' });
    }

    res.json({ message: 'Banner status updated successfully', status });
  });
});

module.exports = router;
