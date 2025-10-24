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

// GET all locations for a specific bureau
router.get('/location', (req, res) => {
    console.log('Fetching all locations'); // Debugging log

    const selectQuery = 'SELECT * FROM location';

    db.query(selectQuery, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Server error. Please try again later.' });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'No locations found.' });
        }

        console.log('Query Result:', result); // Debugging log
        res.status(200).json(result);
    });
});

// CREATE a new location
router.post('/location', (req, res) => {
  const { bureau_id, branch_manager_name, contact_details, house_no, street, city, district, state, country, google_map_link } = req.body;

  if (!branch_manager_name) {
    return res.status(400).json({ message: 'Please provide branch manager name.' });
  }

  const insertQuery = 'INSERT INTO location (bureau_id, branch_manager_name, contact_details, house_no, street, city, district, state, country, google_map_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
  db.query(insertQuery, [bureau_id, branch_manager_name, contact_details, house_no, street, city, district, state, country, google_map_link], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    res.status(201).json({ message: 'Location created successfully!', locationId: result.insertId });
  });
});

// UPDATE a location
router.put('/location/:id', (req, res) => {
  const locationId = req.params.id;
  const { 
    bureau_id, 
    branch_manager_name, 
    contact_details, 
    house_no, 
    street, 
    city, 
    district, 
    state, 
    country, 
    google_map_link 
  } = req.body;

  // Validate required fields
  if (!branch_manager_name) {
    return res.status(400).json({ message: 'Branch manager name is required.' });
  }

  const updateQuery = `
    UPDATE location 
    SET 
      bureau_id = ?, 
      branch_manager_name = ?, 
      contact_details = ?, 
      house_no = ?, 
      street = ?, 
      city = ?, 
      district = ?, 
      state = ?, 
      country = ?, 
      google_map_link = ?
    WHERE id = ?
  `;

  db.query(
    updateQuery, 
    [
      bureau_id, 
      branch_manager_name, 
      contact_details, 
      house_no, 
      street, 
      city, 
      district, 
      state, 
      country, 
      google_map_link, 
      locationId
    ], 
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Location not found.' });
      }

      res.status(200).json({ 
        message: 'Location updated successfully!', 
        affectedRows: result.affectedRows 
      });
    }
  );
});

// DELETE a location
router.delete('/location/:id', (req, res) => {
  const locationId = req.params.id;

  const deleteQuery = 'DELETE FROM location WHERE id = ?';

  db.query(deleteQuery, [locationId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Location not found.' });
    }

    res.status(200).json({ 
      message: 'Location deleted successfully!', 
      affectedRows: result.affectedRows 
    });
  });
});

module.exports = router;