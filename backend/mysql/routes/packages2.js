const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Get package details by package ID
router.get('/package/:packageId', (req, res) => {
  const packageId = req.params.packageId;
  const query = `
    SELECT 
      p.id, p.title, p.description, p.price, p.duration, p.features, 
      p.is_active, p.views, p.contact_visibility, p.bureau_id,
      p.created_at, p.updated_at
    FROM packages2 p
    WHERE p.id = ?
  `;

  db.query(query, [packageId], (err, results) => {
    if (err) {
      console.error('Error fetching package details:', err);
      return res.status(500).json({ error: 'Failed to fetch package details' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json({ success: true, data: results[0] });
  });
});

// Get bureau packages
router.post('/bureau/:bureauId', (req, res) => {
  const bureauId = req.params.bureauId;
  const query = `
    SELECT 
      p.id, p.title, p.description, p.price, p.duration, p.features, 
      p.is_active, p.views, p.contact_visibility, p.bureau_id,
      p.created_at, p.updated_at
    FROM packages2 p
    WHERE p.bureau_id = ?
    ORDER BY p.created_at DESC
  `;

  db.query(query, [bureauId], (err, results) => {
    if (err) {
      console.error('Error fetching bureau packages:', err);
      return res.status(500).json({ error: 'Failed to fetch bureau packages' });
    }

    res.json({ success: true, data: results });
  });
});

// Create new package
router.post('/package', (req, res) => {
  const { title, description, price, duration, features, is_active, bureau_id, contact_visibility } = req.body;

  if (!title || !description || !price || !duration || !bureau_id) {
    return res.status(400).json({ error: 'Title, description, price, duration, and bureau_id are required' });
  }

  // Always store features as a JSON string
  const featuresValue = Array.isArray(features) ? JSON.stringify(features) : (typeof features === 'string' ? features : null);

  const query = `
    INSERT INTO packages2 
    (title, description, price, duration, features, is_active, bureau_id, 
     contact_visibility, views, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())
  `;

  db.query(query, [
    title, 
    description, 
    parseFloat(price), 
    duration, 
    featuresValue, // <-- always a string
    is_active !== false, 
    bureau_id,
    contact_visibility !== false
  ], (err, results) => {
    if (err) {
      console.error('Error creating package:', err);
      return res.status(500).json({ error: 'Failed to create package' });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Package created successfully', 
      data: { id: results.insertId }
    });
  });
});

// Update package
router.put('/package/:id', (req, res) => {
  const packageId = req.params.id;
  const { title, description, price, duration, features, is_active, contact_visibility } = req.body;

  if (!title || !description || !price || !duration) {
    return res.status(400).json({ error: 'Title, description, price, and duration are required' });
  }

  // Always store features as a JSON string
  const featuresValue = Array.isArray(features) ? JSON.stringify(features) : (typeof features === 'string' ? features : null);

  const query = `
    UPDATE packages2 
    SET title = ?, description = ?, price = ?, duration = ?, features = ?, 
        is_active = ?, contact_visibility = ?, updated_at = NOW() 
    WHERE id = ?
  `;

  db.query(query, [
    title, 
    description, 
    parseFloat(price), 
    duration, 
    featuresValue, // <-- always a string
    is_active !== false,
    contact_visibility !== false,
    packageId
  ], (err, results) => {
    if (err) {
      console.error('Error updating package:', err);
      return res.status(500).json({ error: 'Failed to update package' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json({ success: true, message: 'Package updated successfully' });
  });
});

// Activate package
router.post('/package/:packageId/activate', (req, res) => {
  const packageId = req.params.packageId;
  
  const query = `
    UPDATE packages2 
    SET is_active = true, updated_at = NOW() 
    WHERE id = ?
  `;

  db.query(query, [packageId], (err, results) => {
    if (err) {
      console.error('Error activating package:', err);
      return res.status(500).json({ error: 'Failed to activate package' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json({ success: true, message: 'Package activated successfully' });
  });
});

// Deactivate package
router.post('/package/:packageId/deactivate', (req, res) => {
  const packageId = req.params.packageId;
  
  const query = `
    UPDATE packages2 
    SET is_active = false, updated_at = NOW() 
    WHERE id = ?
  `;

  db.query(query, [packageId], (err, results) => {
    if (err) {
      console.error('Error deactivating package:', err);
      return res.status(500).json({ error: 'Failed to deactivating package' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json({ success: true, message: 'Package deactivated successfully' });
  });
});

// Update contact visibility
router.put('/package/:packageId/contact-visibility', (req, res) => {
  const packageId = req.params.packageId;
  const { contact_visibility } = req.body;

  const query = `
    UPDATE packages2 
    SET contact_visibility = ?, updated_at = NOW() 
    WHERE id = ?
  `;

  db.query(query, [contact_visibility, packageId], (err, results) => {
    if (err) {
      console.error('Error updating contact visibility:', err);
      return res.status(500).json({ error: 'Failed to update contact visibility' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json({ success: true, message: 'Contact visibility updated successfully' });
  });
});

// Increment package views
router.post('/package/:packageId/increment-views', (req, res) => {
  const packageId = req.params.packageId;

  const query = `
    UPDATE packages2 
    SET views = views + 1, updated_at = NOW() 
    WHERE id = ?
  `;

  db.query(query, [packageId], (err, results) => {
    if (err) {
      console.error('Error incrementing views:', err);
      return res.status(500).json({ error: 'Failed to increment views' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json({ success: true, message: 'Views incremented successfully' });
  });
});

// Delete package
router.delete('/package/:id', (req, res) => {
  const packageId = req.params.id;

  const query = 'DELETE FROM packages2 WHERE id = ?';

  db.query(query, [packageId], (err, results) => {
    if (err) {
      console.error('Error deleting package:', err);
      return res.status(500).json({ error: 'Failed to delete package' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json({ success: true, message: 'Package deleted successfully' });
  });
});

// Package statistics by bureau
router.get('/package/stats/overview/:bureauId', (req, res) => {
  const bureauId = req.params.bureauId;
  const query = `
    SELECT 
      COUNT(*) as total_packages,
      SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_packages,
      SUM(CASE WHEN is_active = false THEN 1 ELSE 0 END) as inactive_packages,
      AVG(price) as average_price,
      MIN(price) as min_price,
      MAX(price) as max_price,
      SUM(views) as total_views
    FROM packages2
    WHERE bureau_id = ?
  `;

  db.query(query, [bureauId], (err, results) => {
    if (err) {
      console.error('Error fetching package stats:', err);
      return res.status(500).json({ error: 'Failed to fetch package stats' });
    }

    res.json({ success: true, data: results[0] });
  });
});

// Get active packages for public display
router.get('/package/active', (req, res) => {
  const query = `
    SELECT 
      p.id, p.title, p.description, p.price, p.duration, p.features,
      p.bureau_id
    FROM packages2 p
    WHERE p.is_active = true AND p.contact_visibility = true
    ORDER BY p.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching active packages:', err);
      return res.status(500).json({ error: 'Failed to fetch active packages' });
    }

    res.json({ success: true, data: results });
  });
});

// Get active packages by bureau for public display
router.get('/package/active/:bureauId', (req, res) => {
  const bureauId = req.params.bureauId;
  const query = `
    SELECT 
      p.id, p.title, p.description, p.price, p.duration, p.features,
      p.bureau_id, p.created_at
    FROM packages2 p
    WHERE p.bureau_id = ? AND p.is_active = true AND p.contact_visibility = true
    ORDER BY p.created_at DESC
  `;

  db.query(query, [bureauId], (err, results) => {
    if (err) {
      console.error('Error fetching active packages:', err);
      return res.status(500).json({ error: 'Failed to fetch active packages' });
    }

    res.json({ success: true, data: results });
  });
});

module.exports = router;