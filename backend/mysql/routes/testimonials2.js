const express = require('express');
const mysql = require('mysql2');
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

// GET all testimonials for a specific bureau (supports both URL param and body)
router.get('/bureau-testimonials2/:bureauId?', (req, res) => {
  // Get bureau_id from URL params or request body
  const bureauId = req.params.bureauId || req.body.bureau_id || req.query.bureau_id;

  if (!bureauId) {
    return res.status(400).json({ 
      success: false,
      message: 'Bureau ID is required. Provide it in URL params, query params, or request body.' 
    });
  }

  const selectQuery = `
    SELECT id, bureau_id, name, message, created_at, status
    FROM testimonials2 
    WHERE bureau_id = ? 
    ORDER BY created_at DESC
  `;
  
  db.query(selectQuery, [bureauId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Server error. Please try again later.' 
      });
    }
    res.status(200).json({
      success: true,
      testimonials: result
    });
  });
});

// GET public testimonials (active only) for a specific bureau (supports both URL param and body)
router.get('/bureau-testimonials2/public/:bureauId?', (req, res) => {
  // Get bureau_id from URL params or request body
  const bureauId = req.params.bureauId || req.body.bureau_id || req.query.bureau_id;

  if (!bureauId) {
    return res.status(400).json({ 
      success: false,
      message: 'Bureau ID is required. Provide it in URL params, query params, or request body.' 
    });
  }

  const selectQuery = `
    SELECT id, name, message, created_at
    FROM testimonials2 
    WHERE bureau_id = ? AND status = 'active'
    ORDER BY created_at DESC
  `;
  
  db.query(selectQuery, [bureauId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Server error. Please try again later.' 
      });
    }
    res.status(200).json({
      success: true,
      testimonials: result
    });
  });
});

// POST endpoint to get testimonials (alternative to GET with body)
router.post('/bureau-testimonials2/fetch', (req, res) => {
  const { bureau_id } = req.body;

  if (!bureau_id) {
    return res.status(400).json({ 
      success: false,
      message: 'Bureau ID is required in request body.' 
    });
  }

  const selectQuery = `
    SELECT id, bureau_id, name, message, created_at, status
    FROM testimonials2 
    WHERE bureau_id = ? 
    ORDER BY created_at DESC
  `;
  
  db.query(selectQuery, [bureau_id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Server error. Please try again later.' 
      });
    }
    res.status(200).json({
      success: true,
      testimonials: result
    });
  });
});

// POST endpoint to get public testimonials (alternative to GET with body)
router.post('/bureau-testimonials2/fetch-public', (req, res) => {
  const { bureau_id } = req.body;

  if (!bureau_id) {
    return res.status(400).json({ 
      success: false,
      message: 'Bureau ID is required in request body.' 
    });
  }

  const selectQuery = `
    SELECT id, name, message, created_at
    FROM testimonials2 
    WHERE bureau_id = ? AND status = 'active'
    ORDER BY created_at DESC
  `;
  
  db.query(selectQuery, [bureau_id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Server error. Please try again later.' 
      });
    }
    res.status(200).json({
      success: true,
      testimonials: result
    });
  });
});

// GET a single testimonial by ID
router.get('/bureau-testimonials2/single/:id', (req, res) => {
  const { id } = req.params;

  const selectQuery = `
    SELECT id, bureau_id, name, message, created_at, status
    FROM testimonials2 
    WHERE id = ?
  `;
  
  db.query(selectQuery, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Server error. Please try again later.' 
      });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Testimonial not found.' 
      });
    }
    
    res.status(200).json({
      success: true,
      testimonial: result[0]
    });
  });
});

// CREATE a new testimonial
router.post('/bureau-testimonials2', (req, res) => {
  const { bureau_id, name, message, status } = req.body;

  if (!bureau_id || !name || !message) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide bureau_id, name, and message for the testimonial.' 
    });
  }

  const insertQuery = `
    INSERT INTO testimonials2 (bureau_id, name, message, status, created_at) 
    VALUES (?, ?, ?, ?, NOW())
  `;
  
  db.query(insertQuery, [bureau_id, name, message, status || 'active'], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Server error. Please try again later.' 
      });
    }
    
    // Fetch the created testimonial
    const selectQuery = 'SELECT * FROM testimonials2 WHERE id = ?';
    db.query(selectQuery, [result.insertId], (err, testimonialResult) => {
      if (err) {
        console.error('Error fetching created testimonial:', err);
      }
      
      res.status(201).json({ 
        success: true,
        message: 'Testimonial created successfully!', 
        testimonial: testimonialResult[0] || { id: result.insertId }
      });
    });
  });
});

// UPDATE a testimonial
router.put('/bureau-testimonials2/:id', (req, res) => {
  const { id } = req.params;
  const { bureau_id, name, message, status } = req.body;
  
  console.log('Update request body:', req.body);

  if (!id || !bureau_id || !name || !message) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide id, bureau_id, name, and message for the testimonial.' 
    });
  }

  // Check if testimonial exists and belongs to the bureau
  db.query('SELECT id FROM testimonials2 WHERE id = ? AND bureau_id = ?', [id, bureau_id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Server error. Please try again later.' 
      });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Testimonial not found or access denied.' 
      });
    }

    const updateQuery = `
      UPDATE testimonials2 
      SET name = ?, message = ?, status = ? 
      WHERE id = ? AND bureau_id = ?
    `;
    
    db.query(updateQuery, [name, message, status || 'active', id, bureau_id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Server error. Please try again later.' 
        });
      }
      
      // Fetch updated testimonial
      const selectQuery = 'SELECT * FROM testimonials2 WHERE id = ?';
      db.query(selectQuery, [id], (err, testimonialResult) => {
        if (err) {
          console.error('Error fetching updated testimonial:', err);
        }
        
        res.status(200).json({ 
          success: true,
          message: 'Testimonial updated successfully!',
          testimonial: testimonialResult[0]
        });
      });
    });
  });
});

// PATCH - Update testimonial status
router.patch('/bureau-testimonials2/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, bureau_id } = req.body;
  
  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be "active" or "inactive"'
    });
  }
  
  const updateQuery = `
    UPDATE testimonials2 
    SET status = ? 
    WHERE id = ? AND bureau_id = ?
  `;
  
  db.query(updateQuery, [status, id, bureau_id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.'
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found or access denied.'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Status updated successfully'
    });
  });
});

// DELETE a testimonial by ID
router.delete('/bureau-testimonials2/:id', (req, res) => {
  const { id } = req.params;
  const { bureau_id } = req.body; // Get bureau_id from request body

  if (!id || !bureau_id) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide testimonial ID and bureau_id in request body.' 
    });
  }

  // Delete the record from the database
  const deleteQuery = 'DELETE FROM testimonials2 WHERE id = ? AND bureau_id = ?';
  db.query(deleteQuery, [id, bureau_id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Server error. Please try again later.' 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Testimonial not found or access denied.' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Testimonial deleted successfully!' 
    });
  });
});

module.exports = router; 