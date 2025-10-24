const express = require('express');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

const router = express.Router();

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET all terms and conditions
router.get('/terms', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT * FROM terms_and_conditions');
    
    // If no terms found, return an empty array
    res.status(200).json(result);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// PUT (Update or Create) terms and conditions for a specific bureau
router.put('/terms/:bureauId', async (req, res) => {
  const { bureauId } = req.params;
  const { term } = req.body;

  if (!bureauId) {
    return res.status(400).json({ message: 'Please provide bureauId.' });
  }

  try {
    // Check if a term exists for this bureau
    const [checkResult] = await pool.query(
      'SELECT id FROM terms_and_conditions WHERE bureau_id = ?', 
      [bureauId]
    );

    if (checkResult.length > 0) {
      // Update existing term
      await pool.query(
        'UPDATE terms_and_conditions SET term = ? WHERE bureau_id = ?', 
        [term, bureauId]
      );
      res.status(200).json({ message: 'Term updated successfully' });
    } else {
      // Create new term if none exists
      await pool.query(
        'INSERT INTO terms_and_conditions (bureau_id, term) VALUES (?, ?)', 
        [bureauId, term]
      );
      res.status(201).json({ message: 'Term created successfully' });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;