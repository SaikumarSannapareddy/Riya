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

// GET all customized links for a specific bureau (supports both URL param and body)
router.get('/customized-links/:bureauId?', (req, res) => {
  // Get bureau_id from URL params or request body
  const bureauId = req.params.bureauId || req.body.bureau_id || req.query.bureau_id;

  if (!bureauId) {
    return res.status(400).json({ 
      success: false,
      message: 'Bureau ID is required. Provide it in URL params, query params, or request body.' 
    });
  }

  const selectQuery = `
    SELECT id, bureau_id, title, url_link, created_at, status
    FROM customized_links 
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
      links: result
    });
  });
});

// GET public customized links (active only) for a specific bureau
router.get('/customized-links/public/:bureauId?', (req, res) => {
  // Get bureau_id from URL params or request body
  const bureauId = req.params.bureauId || req.body.bureau_id || req.query.bureau_id;

  if (!bureauId) {
    return res.status(400).json({ 
      success: false,
      message: 'Bureau ID is required. Provide it in URL params, query params, or request body.' 
    });
  }

  const selectQuery = `
    SELECT id, title, url_link, created_at
    FROM customized_links 
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
      links: result
    });
  });
});

// POST endpoint to get customized links (alternative to GET with body)
router.post('/customized-links/fetch', (req, res) => {
  const { bureau_id } = req.body;

  if (!bureau_id) {
    return res.status(400).json({ 
      success: false,
      message: 'Bureau ID is required in request body.' 
    });
  }

  const selectQuery = `
    SELECT id, bureau_id, title, url_link, created_at, status
    FROM customized_links 
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
      links: result
    });
  });
});

// POST endpoint to get public customized links (alternative to GET with body)
router.post('/customized-links/fetch-public', (req, res) => {
  const { bureau_id } = req.body;

  if (!bureau_id) {
    return res.status(400).json({ 
      success: false,
      message: 'Bureau ID is required in request body.' 
    });
  }

  const selectQuery = `
    SELECT id, title, url_link, created_at
    FROM customized_links 
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
      links: result
    });
  });
});

// GET a single customized link by ID
router.get('/customized-links/single/:id', (req, res) => {
  const { id } = req.params;

  const selectQuery = `
    SELECT id, bureau_id, title, url_link, created_at, status
    FROM customized_links 
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
        message: 'Customized link not found.' 
      });
    }
    
    res.status(200).json({
      success: true,
      link: result[0]
    });
  });
});

// CREATE a new customized link
router.post('/customized-links', (req, res) => {
  const { bureau_id, title, url_link, status } = req.body;
  
  console.log('Request body:', req.body);

  if (!bureau_id || !title || !url_link) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide bureau_id, title, and url_link for the customized link.' 
    });
  }

  // Validate URL format
  try {
    new URL(url_link);
  } catch (error) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide a valid URL link.' 
    });
  }

  const insertQuery = `
    INSERT INTO customized_links (bureau_id, title, url_link, status, created_at) 
    VALUES (?, ?, ?, ?, NOW())
  `;
  
  db.query(insertQuery, [bureau_id, title, url_link, status || 'active'], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Server error. Please try again later.' 
      });
    }
    
    // Fetch the created link
    const selectQuery = 'SELECT * FROM customized_links WHERE id = ?';
    db.query(selectQuery, [result.insertId], (err, linkResult) => {
      if (err) {
        console.error('Error fetching created link:', err);
      }
      
      res.status(201).json({ 
        success: true,
        message: 'Customized link created successfully!', 
        link: linkResult[0] || { id: result.insertId }
      });
    });
  });
});

// UPDATE a customized link
router.put('/customized-links/:id', (req, res) => {
  const { id } = req.params;
  const { bureau_id, title, url_link, status } = req.body;
  
  console.log('Update request body:', req.body);

  if (!id || !bureau_id || !title || !url_link) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide id, bureau_id, title, and url_link for the customized link.' 
    });
  }

  // Validate URL format
  try {
    new URL(url_link);
  } catch (error) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide a valid URL link.' 
    });
  }

  // Check if link exists and belongs to the bureau
  db.query('SELECT id FROM customized_links WHERE id = ? AND bureau_id = ?', [id, bureau_id], (err, result) => {
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
        message: 'Customized link not found or access denied.' 
      });
    }

    const updateQuery = `
      UPDATE customized_links 
      SET title = ?, url_link = ?, status = ? 
      WHERE id = ? AND bureau_id = ?
    `;
    
    db.query(updateQuery, [title, url_link, status || 'active', id, bureau_id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false,
          message: 'Server error. Please try again later.' 
        });
      }
      
      // Fetch updated link
      const selectQuery = 'SELECT * FROM customized_links WHERE id = ?';
      db.query(selectQuery, [id], (err, linkResult) => {
        if (err) {
          console.error('Error fetching updated link:', err);
        }
        
        res.status(200).json({ 
          success: true,
          message: 'Customized link updated successfully!',
          link: linkResult[0]
        });
      });
    });
  });
});

// PATCH - Update customized link status
router.patch('/customized-links/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, bureau_id } = req.body;
  
  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be "active" or "inactive"'
    });
  }
  
  const updateQuery = `
    UPDATE customized_links 
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
        message: 'Customized link not found or access denied.'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Status updated successfully'
    });
  });
});

// DELETE a customized link by ID
router.delete('/customized-links/:id', (req, res) => {
  const { id } = req.params;
  const { bureau_id } = req.body; // Get bureau_id from request body

  if (!id || !bureau_id) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide link ID and bureau_id in request body.' 
    });
  }

  // Delete the record from the database
  const deleteQuery = 'DELETE FROM customized_links WHERE id = ? AND bureau_id = ?';
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
        message: 'Customized link not found or access denied.' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Customized link deleted successfully!' 
    });
  });
});

module.exports = router; 