const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const router = express.Router();

// Add middleware to log all requests
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ManageVideos route`);
  next();
});

// Create thumbnails directory if it doesn't exist
const thumbnailsDir = path.join(__dirname, '..', 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Configure multer for thumbnail uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, thumbnailsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'thumbnail-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// GET all videos for admin management
router.get('/videos', (req, res) => {
  console.log('GET /videos endpoint called');
  
  // First check if table exists
  const checkTableQuery = "SHOW TABLES LIKE 'manage_videos'";
  db.query(checkTableQuery, (err, tableResult) => {
    if (err) {
      console.error('Error checking table:', err);
      return res.status(500).json({ message: 'Database error checking table.' });
    }
    
    if (tableResult.length === 0) {
      console.log('Table manage_videos does not exist, creating it...');
      // Create table if not exists
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS manage_videos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          video_link VARCHAR(500) NOT NULL,
          thumbnail VARCHAR(255),
          status ENUM('active', 'inactive') DEFAULT 'active',
          type ENUM('bureau', 'user') DEFAULT 'bureau',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_status (status),
          INDEX idx_type (type)
        )
      `;
      
      db.query(createTableQuery, (err, createResult) => {
        if (err) {
          console.error('Error creating table:', err);
          return res.status(500).json({ message: 'Error creating table.' });
        }
        console.log('Table created successfully');
        res.status(200).json([]); // Return empty array for new table
      });
    } else {
      console.log('Table exists, checking for type column...');
      // Check if type column exists
      const checkColumnQuery = "SHOW COLUMNS FROM manage_videos LIKE 'type'";
      db.query(checkColumnQuery, (err, columnResult) => {
        if (err) {
          console.error('Error checking column:', err);
          return res.status(500).json({ message: 'Database error checking column.' });
        }
        
        if (columnResult.length === 0) {
          console.log('Type column does not exist, adding it...');
          // Add type column to existing table
          const addColumnQuery = "ALTER TABLE manage_videos ADD COLUMN type ENUM('bureau', 'user') DEFAULT 'bureau'";
          db.query(addColumnQuery, (err, addResult) => {
            if (err) {
              console.error('Error adding column:', err);
              return res.status(500).json({ message: 'Error adding type column.' });
            }
            console.log('Type column added successfully');
            // Now fetch videos
            fetchVideos();
          });
        } else {
          console.log('Type column exists, fetching videos...');
          fetchVideos();
        }
      });
      
      const fetchVideos = () => {
        const selectQuery = `
          SELECT id, title, description, video_link as videoLink, thumbnail, 
                 status, type, created_at, updated_at
          FROM manage_videos 
          ORDER BY created_at DESC
        `;
        
        db.query(selectQuery, (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Server error. Please try again later.' });
          }
          console.log('Videos fetched successfully:', result.length);
          res.status(200).json(result);
        });
      };
    }
  });
});

// GET a single video by ID
router.get('/videos/:id', (req, res) => {
  const { id } = req.params;

  const selectQuery = 'SELECT id, title, description, video_link as videoLink, thumbnail, status, type FROM manage_videos WHERE id = ?';
  db.query(selectQuery, [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Video not found.' });
    }
    
    res.status(200).json(result[0]);
  });
});

// CREATE a new video
router.post('/videos', (req, res) => {
  const { title, description, videoLink, thumbnail, status = 'active', type = 'bureau' } = req.body;
  
  console.log('POST /videos - Request body:', req.body);

  if (!title || !videoLink) {
    return res.status(400).json({ message: 'Please provide title and video link.' });
  }

  // First ensure table exists with type field
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS manage_videos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      video_link VARCHAR(500) NOT NULL,
      thumbnail VARCHAR(255),
      status ENUM('active', 'inactive') DEFAULT 'active',
      type ENUM('bureau', 'user') DEFAULT 'bureau',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_status (status),
      INDEX idx_type (type)
    )
  `;
  
  db.query(createTableQuery, (err, createResult) => {
    if (err) {
      console.error('Error creating table:', err);
      return res.status(500).json({ message: 'Error creating table.' });
    }
    
    const insertQuery = 'INSERT INTO manage_videos (title, description, video_link, thumbnail, status, type) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [title, description, videoLink, thumbnail, status, type], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }
      
      console.log('Video created successfully with ID:', result.insertId);
      res.status(201).json({ 
        message: 'Video created successfully!', 
        videoId: result.insertId
      });
    });
  });
});

// UPDATE a video
router.put('/videos/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, videoLink, thumbnail, status, type } = req.body;
  
  console.log('Update request body:', req.body);

  if (!title || !videoLink) {
    return res.status(400).json({ message: 'Please provide title and video link.' });
  }

  // Check if video exists
  db.query('SELECT id FROM manage_videos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Video not found.' });
    }
    
    const updateQuery = 'UPDATE manage_videos SET title = ?, description = ?, video_link = ?, thumbnail = ?, status = ?, type = ? WHERE id = ?';
    db.query(updateQuery, [title, description, videoLink, thumbnail, status, type, id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }
      
      console.log('Video updated successfully');
      res.status(200).json({ message: 'Video updated successfully!' });
    });
  });
});

// DELETE a video by ID
router.delete('/videos/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Please provide video ID.' });
  }

  // Check if the video exists
  db.query('SELECT id FROM manage_videos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Video not found.' });
    }
    
    // Delete the record from the database
    const deleteQuery = 'DELETE FROM manage_videos WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }
      
      res.status(200).json({ message: 'Video deleted successfully!' });
    });
  });
});

// Upload thumbnail route
router.post('/upload-thumbnail', upload.single('thumbnail'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No thumbnail file uploaded.' });
    }

    res.status(200).json({ 
      message: 'Thumbnail uploaded successfully!',
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading thumbnail:', error);
    res.status(500).json({ message: 'Error uploading thumbnail.' });
  }
});

// Get video statistics
router.get('/videos/stats', (req, res) => {
  const statsQuery = `
    SELECT 
      COUNT(*) as total_videos,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_videos,
      COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_videos,
      COUNT(CASE WHEN thumbnail IS NOT NULL AND thumbnail != '' THEN 1 END) as videos_with_thumbnails
    FROM manage_videos
  `;
  
  db.query(statsQuery, (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    res.status(200).json(result[0]);
  });
});

// Add a new endpoint to get only bureau videos
router.get('/bureau-videos', (req, res) => {
  try {
    console.log('GET /bureau-videos - Fetching bureau videos');
    
    // Create table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS manage_videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        video_link VARCHAR(500) NOT NULL,
        thumbnail VARCHAR(255),
        status ENUM('active', 'inactive') DEFAULT 'active',
        type ENUM('bureau', 'user') DEFAULT 'bureau',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_type (type)
      )
    `;
    
    db.query(createTableQuery, (err, createResult) => {
      if (err) {
        console.error('Error creating table:', err);
        return res.status(500).json({ error: 'Failed to create table' });
      }
      
      // Check if type column exists
      const checkColumnQuery = "SHOW COLUMNS FROM manage_videos LIKE 'type'";
      db.query(checkColumnQuery, (err, columnResult) => {
        if (err) {
          console.error('Error checking column:', err);
          return res.status(500).json({ error: 'Failed to check column' });
        }
        
        if (columnResult.length === 0) {
          console.log('Type column does not exist, adding it...');
          // Add type column to existing table
          const addColumnQuery = "ALTER TABLE manage_videos ADD COLUMN type ENUM('bureau', 'user') DEFAULT 'bureau'";
          db.query(addColumnQuery, (err, addResult) => {
            if (err) {
              console.error('Error adding column:', err);
              return res.status(500).json({ error: 'Failed to add type column' });
            }
            console.log('Type column added successfully');
            // Now fetch bureau videos
            fetchBureauVideos();
          });
        } else {
          console.log('Type column exists, fetching bureau videos...');
          fetchBureauVideos();
        }
      });
      
      const fetchBureauVideos = () => {
        // Get only bureau videos that are active
        const selectQuery = `
          SELECT id, title, description, video_link as videoLink, thumbnail, status, type, created_at, updated_at
          FROM manage_videos 
          WHERE type = 'bureau' AND status = 'active'
          ORDER BY created_at DESC
        `;
        
        db.query(selectQuery, (err, rows) => {
          if (err) {
            console.error('Error fetching bureau videos:', err);
            return res.status(500).json({ error: 'Failed to fetch bureau videos' });
          }
          
          console.log(`Found ${rows.length} bureau videos`);
          res.json(rows);
        });
      };
    });
  } catch (error) {
    console.error('Error in bureau-videos endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch bureau videos' });
  }
});

module.exports = router; 