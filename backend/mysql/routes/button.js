const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const router = express.Router();

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// PUT route to update profile visibility settings
router.put('/update', async (req, res) => {
    const {
      bureauId,
      otherbuttons
    } = req.body;
  
    // Validate input - otherbuttons should be "show" or "hide"
    if (!bureauId || !otherbuttons) {
      console.warn('Invalid input: Missing bureauId or otherbuttons field.', req.body);
      return res.status(400).json({
        message: 'Please provide bureauId and otherbuttons field.',
      });
    }

    // Validate otherbuttons value
    if (!['show', 'hide'].includes(otherbuttons)) {
      return res.status(400).json({
        message: 'otherbuttons must be either "show" or "hide".',
      });
    }
  
    try {
      const updateQuery = `UPDATE bureau_profiles SET otherbuttons = ? WHERE bureauId = ?`;
      const values = [otherbuttons, bureauId];
  
      console.log('SQL Query to be executed:', updateQuery);
      console.log('Values to be used:', values);
  
      db.query(updateQuery, values, (err, result) => {
        if (err) {
          console.error('Database error during update:', err);
          return res.status(500).json({
            message: 'Server error occurred. Please try again later.',
            error: err.message,
          });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: 'Bureau not found or no changes were made.',
          });
        }
  
        res.status(200).json({
          message: 'Profile visibility settings updated successfully',
          updatedField: 'otherbuttons',
          newValue: otherbuttons,
          bureauId: bureauId
        });
      });
    } catch (error) {
      console.error('Unexpected server error:', error);
      res.status(500).json({
        message: 'Server error occurred. Please try again later.',
        error: error.message,
      });
    }
});

// POST route to fetch current profile visibility settings
router.post('/profile-settings', async (req, res) => {
    const { bureauId } = req.body;
  
    if (!bureauId) {
      return res.status(400).json({
        message: 'Please provide bureauId in the request body.',
      });
    }
  
    try {
      const selectQuery = `SELECT otherbuttons FROM bureau_profiles WHERE bureauId = ?`;
  
      db.query(selectQuery, [bureauId], (err, results) => {
        if (err) {
          console.error('Database error during fetch:', err);
          return res.status(500).json({
            message: 'Server error occurred. Please try again later.',
            error: err.message,
          });
        }
  
        if (results.length === 0) {
          return res.status(404).json({
            message: 'Bureau not found.',
          });
        }
  
        const otherButtonsValue = results[0].otherbuttons;
        
        // Default to "show" if null or undefined
        const finalValue = otherButtonsValue || "show";
  
        res.status(200).json({
          message: 'Profile settings fetched successfully',
          bureauId: bureauId,
          otherbuttons: finalValue,
        });
      });
    } catch (error) {
      console.error('Unexpected server error:', error);
      res.status(500).json({
        message: 'Server error occurred. Please try again later.',
        error: error.message,
      });
    }
});

module.exports = router;