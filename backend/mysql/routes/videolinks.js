const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config(); // Load environment variables

const router = express.Router();

// Create thumbnails directory if it doesn't exist
const thumbnailsDir = path.join(__dirname, '..', 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Configure multer for thumbnail uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, thumbnailsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'thumbnail-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET all video links
router.get('/videolinks', (req, res) => {
  const selectQuery = `
    SELECT id, title, description, video_link as videoLink, thumbnail, created_at 
    FROM videolinks 
    ORDER BY created_at DESC
  `;
  
  db.query(selectQuery, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    res.status(200).json(result);
  });
});

// GET a single video link by ID
router.get('/videolinks/:id', (req, res) => {
  const { id } = req.params;

  const selectQuery = 'SELECT id, title, description, video_link as videoLink, thumbnail FROM videolinks WHERE id = ?';
  db.query(selectQuery, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Video link not found.' });
    }
    
    res.status(200).json(result[0]);
  });
});

// CREATE a new video link
router.post('/videolinks-adding', (req, res) => {
  const { title, description, videoLink, thumbnail } = req.body;
  
  // Debug log to check what's coming in the request
  console.log('Request body:', req.body);

  if (!title || !description || !videoLink) {
    return res.status(400).json({ message: 'Please provide title, description, and video link.' });
  }

  const insertQuery = 'INSERT INTO videolinks (title, description, video_link, thumbnail, created_at) VALUES (?, ?, ?, ?, NOW())';
  db.query(insertQuery, [title, description, videoLink, thumbnail], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    res.status(201).json({ 
      message: 'Video link created successfully!', 
      videoId: result.insertId
    });
  });
});

// UPDATE a video link
router.put('/videolinks-update', (req, res) => {
  const { id, title, description, videoLink, thumbnail } = req.body;
  
  // Debug log to check what's coming in the request
  console.log('Update request body:', req.body);

  if (!id || !title || !description || !videoLink) {
    return res.status(400).json({ message: 'Please provide id, title, description, and video link.' });
  }

  // Check if video link exists
  db.query('SELECT id FROM videolinks WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Video link not found.' });
    }
    
    const updateQuery = 'UPDATE videolinks SET title = ?, description = ?, video_link = ?, thumbnail = ? WHERE id = ?';
    db.query(updateQuery, [title, description, videoLink, thumbnail, id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }
      
      res.status(200).json({ 
        message: 'Video link updated successfully!'
      });
    });
  });
});

// DELETE a video link by ID
router.delete('/videolinks-delete/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Please provide video link ID.' });
  }

  // Check if the video link exists
  db.query('SELECT id FROM videolinks WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Video link not found.' });
    }
    
    // Delete the record from the database
    const deleteQuery = 'DELETE FROM videolinks WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }
      
      res.status(200).json({ message: 'Video link deleted successfully!' });
    });
  });
});

// Upload thumbnail route
router.post('/upload-thumbnail', upload.single('thumbnail'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No thumbnail file uploaded.' });
    }

    res.status(200).json({ 
      message: 'Thumbnail uploaded successfully!',
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    res.status(500).json({ message: 'Error uploading thumbnail.' });
  }
});

module.exports = router;