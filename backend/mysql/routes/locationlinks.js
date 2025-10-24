const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const router = express.Router();

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET all video links
router.get('/locationlinks', (req, res) => {
  const selectQuery = `
    SELECT id, title, description, video_link as videoLink, created_at 
    FROM locationlinks 
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
router.get('/locationlinks/:id', (req, res) => {
  const { id } = req.params;

  const selectQuery = 'SELECT id, title, description, video_link as videoLink FROM locationlinks WHERE id = ?';
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
router.post('/locationlinks-adding', (req, res) => {
  const { title, description, videoLink } = req.body;
  
  // Debug log to check what's coming in the request
  console.log('Request body:', req.body);

  if (!title || !description || !videoLink) {
    return res.status(400).json({ message: 'Please provide title, description, and video link.' });
  }

  const insertQuery = 'INSERT INTO locationlinks (title, description, video_link, created_at) VALUES (?, ?, ?, NOW())';
  db.query(insertQuery, [title, description, videoLink], (err, result) => {
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
router.put('/locationlinks-update', (req, res) => {
  const { id, title, description, videoLink } = req.body;
  
  // Debug log to check what's coming in the request
  console.log('Update request body:', req.body);

  if (!id || !title || !description || !videoLink) {
    return res.status(400).json({ message: 'Please provide id, title, description, and video link.' });
  }

  // Check if video link exists
  db.query('SELECT id FROM locationlinks WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Video link not found.' });
    }
    
    const updateQuery = 'UPDATE locationlinks SET title = ?, description = ?, video_link = ? WHERE id = ?';
    db.query(updateQuery, [title, description, videoLink, id], (err, result) => {
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
router.delete('/locationlinks-delete/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Please provide video link ID.' });
  }

  // Check if the video link exists
  db.query('SELECT id FROM locationlinks WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Video link not found.' });
    }
    
    // Delete the record from the database
    const deleteQuery = 'DELETE FROM locationlinks WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }
      
      res.status(200).json({ message: 'Video link deleted successfully!' });
    });
  });
});

module.exports = router;