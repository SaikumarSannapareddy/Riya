require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test initial DB connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Failed to connect to the database on startup:', err.message);
  } else {
    console.log('✅ Successfully connected to the database.');
    connection.release(); // release back to pool
  }
});

// Test database query route
app.get('/', (req, res) => {
  pool.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Error executing query');
    }
    res.send(`Database connection successful! Test query result: ${results[0].solution}`);
  });
});

// Get all tables
app.get('/tables', (req, res) => {
  pool.query('SHOW TABLES', (err, results) => {
    if (err) {
      console.error('Error fetching tables:', err);
      return res.status(500).send('Error fetching tables');
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
