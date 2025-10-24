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

// GET all services for a specific bureau
router.get('/services/:bureauId', (req, res) => {
  const { bureauId } = req.params;

  if (!bureauId) {
    return res.status(400).json({ message: 'Please provide bureauId.' });
  }

  const selectQuery = 'SELECT id, bureau_id, Servicename FROM services WHERE bureau_id = ?';
  db.query(selectQuery, [bureauId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    res.status(200).json(result);
  });
});

// CREATE a new service
router.post('/services', (req, res) => {
  const { bureau_id, Servicename } = req.body;

  if (!bureau_id || !Servicename) {
    return res.status(400).json({ message: 'Please provide bureau_id and Servicename.' });
  }

  const insertQuery = 'INSERT INTO services (bureau_id, Servicename) VALUES (?, ?)';
  db.query(insertQuery, [bureau_id, Servicename], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    res.status(201).json({ message: 'Service created successfully!', serviceId: result.insertId });
  });
});

// DELETE a service by ID
router.delete('/services/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Please provide service ID.' });
  }

  const deleteQuery = 'DELETE FROM services WHERE id = ?';
  db.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.status(200).json({ message: 'Service deleted successfully!' });
  });
});

module.exports = router;
