const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config(); // Load environment variables

const router = express.Router();

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create uploads directory for testimonials if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads', 'testimonials');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'testimonial-' + uniqueSuffix + ext);
  }
});

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 } // 1MB limit
});

// GET all testimonials
router.get('/testimonials2', (req, res) => {
  const selectQuery = `
    SELECT id, name, position, content, photo_url as photoUrl, created_at 
    FROM userreviews 
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

// GET a single testimonial by ID
router.get('/testimonials2/:id', (req, res) => {
  const { id } = req.params;

  const selectQuery = 'SELECT id, name, position, content, photo_url as photoUrl FROM userreviews WHERE id = ?';
  db.query(selectQuery, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }
    
    res.status(200).json(result[0]);
  });
});

// CREATE a new testimonial
router.post('/testimonials2-adding', upload.single('photo'), (req, res) => {
  const { name, position, content } = req.body;
  
  // Debug log to check what's coming in the request
  console.log('Request body:', req.body);
  console.log('File:', req.file);

  if (!name || !content) {
    return res.status(400).json({ message: 'Please provide name and content for the testimonial.' });
  }

  // Get the file path if a photo was uploaded
  const photoUrl = req.file ? `/uploads/testimonials/${req.file.filename}` : null;

  const insertQuery = 'INSERT INTO userreviews (name, position, content, photo_url, created_at) VALUES (?, ?, ?, ?, NOW())';
  db.query(insertQuery, [name, position, content, photoUrl], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    res.status(201).json({ 
      message: 'Testimonial created successfully!', 
      testimonialId: result.insertId,
      photoUrl
    });
  });
});

// UPDATE a testimonial
router.put('/testimonials2-update', upload.single('photo'), (req, res) => {
  const { id, name, position, content } = req.body;
  
  // Debug log to check what's coming in the request
  console.log('Update request body:', req.body);
  console.log('Update file:', req.file);

  if (!id || !name || !content) {
    return res.status(400).json({ message: 'Please provide id, name, and content for the testimonial.' });
  }

  // Check if testimonial exists
  db.query('SELECT photo_url FROM userreviews WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }
    
    const existingPhotoUrl = result[0].photo_url;
    
    // If a new photo was uploaded, use it; otherwise keep the existing one
    const photoUrl = req.file ? `/uploads/testimonials/${req.file.filename}` : existingPhotoUrl;

    const updateQuery = 'UPDATE userreviews SET name = ?, position = ?, content = ?, photo_url = ? WHERE id = ?';
    db.query(updateQuery, [name, position, content, photoUrl, id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }
      
      // If a new photo was uploaded and there was an old one, delete the old file
      if (req.file && existingPhotoUrl) {
        try {
          const oldFilePath = path.join(__dirname, '..', existingPhotoUrl);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        } catch (err) {
          console.error('Error deleting old photo:', err);
          // Continue anyway, this isn't critical
        }
      }
      
      res.status(200).json({ 
        message: 'userreviews updated successfully!',
        photoUrl
      });
    });
  });
});

// DELETE a testimonial by ID
router.delete('/testimonials2-delete/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Please provide testimonial ID.' });
  }

  // Get the photo URL first to delete the file
  db.query('SELECT photo_url FROM userreviews WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Testimonial not found.' });
    }
    
    const photoUrl = result[0].photo_url;
    
    // Delete the record from the database
    const deleteQuery = 'DELETE FROM userreviews WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }
      
      // Delete the photo file if it exists
      if (photoUrl) {
        try {
          const filePath = path.join(__dirname, '..', photoUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error('Error deleting photo file:', err);
          // Continue anyway, this isn't critical
        }
      }
      
      res.status(200).json({ message: 'userreviews reviews deleted successfully!' });
    });
  });
});

module.exports = router;