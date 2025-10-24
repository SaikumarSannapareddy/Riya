const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
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

// Login route for admin authentication
router.post('/bureaulogin', (req, res) => {
  const { email, password, isHashedPassword } = req.body;

  console.log('Login request received:', { 
    email, 
    passwordLength: password ? password.length : 0, 
    isHashed: password ? password.startsWith('$2a$') : false,
    isHashedPassword 
  });

  if (!email || !password) {
    return res.status(400).json({ message: 'Mobile Number and password are required' });
  }

  // Find bureau by email in MySQL
  db.query('SELECT * FROM bureau_profiles WHERE mobileNumber = ?', [email], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    // Check if Bureau exists
    if (results.length === 0) {
      console.log('Bureau not found for mobile:', email);
      return res.status(404).json({ message: 'Bureau not found' });
    }

    const bureau = results[0]; // Get the first result (should be only one)
        const bureauId = bureau.bureauId || bureau.id;

    console.log('Bureau found:', { 
      // bureauId: bureau.bureauId,
      bureauId, 
      mobileNumber: bureau.mobileNumber,
      hasPassword: !!bureau.password,
      passwordStartsWith: bureau.password ? bureau.password.substring(0, 10) + '...' : 'N/A'
    });

    // Check if bureau is suspended
 const suspendStatus = bureau.suspend !== undefined ? bureau.suspend : 0;
    console.log('Bureau suspend status:', suspendStatus);
        if (bureau.suspend === 1) {
      console.log('Bureau login blocked - account suspended');
      return res.status(403).json({ message: 'Your account has been suspended. Please contact support for assistance.' });
    }

    let isPasswordValid = false;

    if (isHashedPassword) {
      // For admin panel login: compare hashed passwords directly
      console.log('Admin panel login: comparing hashed passwords directly');
      console.log('Input password (first 20 chars):', password.substring(0, 20));
      console.log('DB password (first 20 chars):', bureau.password.substring(0, 20));
      isPasswordValid = (password === bureau.password);
      console.log('Password match result:', isPasswordValid);
    } else {
      // For regular login: compare plain text password with hashed password
      console.log('Regular login: comparing plain text with hashed password');
      isPasswordValid = await bcrypt.compare(password, bureau.password);
      console.log('Password match result:', isPasswordValid);
    }

    if (!isPasswordValid) {
      console.log('Password validation failed');
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a simple token (you can enhance this with JWT if needed)
    const token = Buffer.from(`${bureau.bureauId}-${Date.now()}`).toString('base64');
    console.log('Login successful, generated token for bureau:', bureauId);

    // Respond with success if password is valid
    res.status(200).json({ 
      message: 'Login successful', 
      id: bureauId,
      token: token,
      success: true
    });
  });
});

module.exports = router;
