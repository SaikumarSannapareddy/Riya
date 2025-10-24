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

// Add new caste route (castesubmit)
router.post('/castesubmit', (req, res) => {
  const { caste } = req.body;

  // Check if caste name is provided
  if (!caste || caste.trim() === '') {
    return res.status(400).json({ message: 'Caste name is required' });
  }

  // Insert the new caste into the database
  db.query('INSERT INTO caste (caste) VALUES (?)', [caste], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Could not add caste. Please try again later.' });
    }

    // Send success response
    res.status(200).json({ message: 'Caste added successfully', casteId: results.insertId });
  });
});

router.post('/submit_sub_caste', (req, res) => {
  const { sub_caste_name } = req.body;

  // Check if caste name is provided
  if (!sub_caste_name || sub_caste_name.trim() === '') {
    return res.status(400).json({ message: 'sub_caste name is required' });
  }

  // Insert the new caste into the database
  db.query('INSERT INTO sub_caste (sub_caste) VALUES (?)', [sub_caste_name], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Could not add Sub Caste. Please try again later.' });
    }

    // Send success response
    res.status(200).json({ message: 'Sub_Caste added successfully', casteId: results.insertId });
  });
});

router.post('/submit_education', (req, res) => {
  const { education } = req.body;

  // Check if caste name is provided
  if (!education || education.trim() === '') {
    return res.status(400).json({ message: 'education name is required' });
  }

  // Insert the new caste into the database
  db.query('INSERT INTO education (education) VALUES (?)', [education], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Could not add Education. Please try again later.' });
    }

    // Send success response
    res.status(200).json({ message: 'education added successfully', casteId: results.insertId });
  });
});


router.post('/submit_occupation', (req, res) => {
  const { occupation_name } = req.body;

  // Check if caste name is provided
  if (!occupation_name || occupation_name.trim() === '') {
    return res.status(400).json({ message: 'occupation name is required' });
  }

  // Insert the new caste into the database
  db.query('INSERT INTO occupations (occupation) VALUES (?)', [occupation_name], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Could not add Occupation. Please try again later.' });
    }

    // Send success response
    res.status(200).json({ message: 'occupation added successfully', casteId: results.insertId });
  });
});

router.post('/submit_country', (req, res) => {
  const { country_name } = req.body;

  // Check if caste name is provided
  if (!country_name || country_name.trim() === '') {
    return res.status(400).json({ message: 'Country name is required' });
  }

  // Insert the new caste into the database
  db.query('INSERT INTO country (country) VALUES (?)', [country_name], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Could not add Country. Please try again later.' });
    }

    // Send success response
    res.status(200).json({ message: 'Country added successfully', casteId: results.insertId });
  });
});


router.post('/submit_state', (req, res) => {
  const { state_name } = req.body;

  // Check if caste name is provided
  if (!state_name || state_name.trim() === '') {
    return res.status(400).json({ message: 'State name is required' });
  }

  // Insert the new caste into the database
  db.query('INSERT INTO state (state) VALUES (?)', [state_name], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Could not add State. Please try again later.' });
    }

    // Send success response
    res.status(200).json({ message: 'State added successfully', casteId: results.insertId });
  });
});

router.post('/submit_city', (req, res) => {
  const { city_name } = req.body;

  // Check if caste name is provided
  if (!city_name || city_name.trim() === '') {
    return res.status(400).json({ message: 'City name is required' });
  }

  // Insert the new caste into the database
  db.query('INSERT INTO city (city) VALUES (?)', [city_name], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Could not add City. Please try again later.' });
    }

    // Send success response
    res.status(200).json({ message: 'City added successfully', casteId: results.insertId });
  });
});


router.post('/submit_star', (req, res) => {
  const { star_name } = req.body;

  // Check if caste name is provided
  if (!star_name || star_name.trim() === '') {
    return res.status(400).json({ message: 'star_name is required' });
  }

  // Insert the new caste into the database
  db.query('INSERT INTO star (star) VALUES (?)', [star_name], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Could not star_name. Please try again later.' });
    }

    // Send success response
    res.status(200).json({ message: 'star_name added successfully', casteId: results.insertId });
  });
});

module.exports = router;
