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

// Test route to verify router is working
router.get('/test', (req, res) => {
  console.log('GET /test route hit');
  res.json({ message: 'Admin services router is working!' });
});

// Check and create table if needed
router.get('/init', (req, res) => {
  console.log('GET /init route hit - checking table');
  
  // Check if table exists
  const checkQuery = 'SHOW TABLES LIKE "admin_services"';
  db.query(checkQuery, (err, results) => {
    if (err) {
      console.error('Error checking table:', err);
      return res.status(500).json({ error: 'Failed to check table' });
    }
    
    if (results.length === 0) {
      // Table doesn't exist, create it
      console.log('Creating admin_services table...');
      const createQuery = `
        CREATE TABLE admin_services (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          status ENUM('active', 'inactive') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `;
      
      db.query(createQuery, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          return res.status(500).json({ error: 'Failed to create table' });
        }
        
        // Insert sample data
        const sampleData = [
          ['Premium Matchmaking', 'Our premium matchmaking service uses advanced algorithms and personal consultation to find your perfect match.', 'active'],
          ['Family Consultation', 'We provide comprehensive family consultation services to ensure both families are comfortable.', 'active'],
          ['Background Verification', 'Thorough background verification service to ensure the authenticity of all profiles.', 'active']
        ];
        
        const insertQuery = 'INSERT INTO admin_services (title, description, status) VALUES ?';
        db.query(insertQuery, [sampleData], (err) => {
          if (err) {
            console.error('Error inserting sample data:', err);
            return res.status(500).json({ error: 'Failed to insert sample data' });
          }
          
          res.json({ 
            message: 'Table created and sample data inserted successfully',
            tableCreated: true
          });
        });
      });
    } else {
      res.json({ 
        message: 'Table already exists',
        tableExists: true
      });
    }
  });
});

// Debug route to check table structure
router.get('/debug/table', (req, res) => {
  console.log('GET /debug/table route hit');
  const query = 'SHOW TABLES LIKE "admin_services"';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error checking table:', err);
      return res.status(500).json({ error: 'Failed to check table' });
    }
    
    if (results.length === 0) {
      return res.json({ 
        tableExists: false, 
        message: 'admin_services table does not exist' 
      });
    }
    
    // Check table structure
    const structureQuery = 'DESCRIBE admin_services';
    db.query(structureQuery, (err, structure) => {
      if (err) {
        console.error('Error getting table structure:', err);
        return res.status(500).json({ error: 'Failed to get table structure' });
      }
      
      // Count total records
      const countQuery = 'SELECT COUNT(*) as total FROM admin_services';
      db.query(countQuery, (err, count) => {
        if (err) {
          console.error('Error counting records:', err);
          return res.status(500).json({ error: 'Failed to count records' });
        }
        
        res.json({ 
          tableExists: true, 
          structure: structure,
          totalRecords: count[0].total,
          message: 'admin_services table exists' 
        });
      });
    });
  });
});

// Get all services
router.get('/', (req, res) => {
  console.log('GET / route hit - fetching all services');
  const query = 'SELECT * FROM admin_services ORDER BY created_at DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching services:', err);
      return res.status(500).json({ error: 'Failed to fetch services' });
    }
    console.log('All services found:', results.length);
    res.json(results);
  });
});

// Get single service by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM admin_services WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching service:', err);
      return res.status(500).json({ error: 'Failed to fetch service' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(results[0]);
  });
});

// Create new service
router.post('/', (req, res) => {
  const { title, description, status = 'active' } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  const query = 'INSERT INTO admin_services (title, description, status) VALUES (?, ?, ?)';
  
  db.query(query, [title, description, status], (err, results) => {
    if (err) {
      console.error('Error creating service:', err);
      return res.status(500).json({ error: 'Failed to create service' });
    }
    
    res.status(201).json({ 
      id: results.insertId, 
      message: 'Service created successfully' 
    });
  });
});

// Update service
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  const query = 'UPDATE admin_services SET title = ?, description = ?, status = ? WHERE id = ?';
  
  db.query(query, [title, description, status, id], (err, results) => {
    if (err) {
      console.error('Error updating service:', err);
      return res.status(500).json({ error: 'Failed to update service' });
    }
    
    res.json({ message: 'Service updated successfully' });
  });
});

// Delete service
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM admin_services WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting service:', err);
      return res.status(500).json({ error: 'Failed to delete service' });
    }
    
    res.json({ message: 'Service deleted successfully' });
  });
});

// Toggle service status
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status || !['active', 'inactive'].includes(status)) {
    return res.status(400).json({ error: 'Status must be either active or inactive' });
  }
  
  const query = 'UPDATE admin_services SET status = ? WHERE id = ?';
  
  db.query(query, [status, id], (err, results) => {
    if (err) {
      console.error('Error updating service status:', err);
      return res.status(500).json({ error: 'Failed to update service status' });
    }
    
    res.json({ message: 'Service status updated successfully', status });
  });
});

module.exports = router; 