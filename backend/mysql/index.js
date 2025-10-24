const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const multer = require('multer');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Use bcryptjs instead of bcrypt
const path = require('path');
const fs = require('fs');
const app = express();
const imageRouter = require('./routes/imageRouter2');
const adminRoutes = require('./routes/admin');
const distributerloginn = require('./routes/distributer.js');
const bureaulogin = require('./routes/bureaulogin.js');
const bureauRouter = require('./routes/bureau.js');
const Getimages = require('./routes/getimages.js');
const bureauProfilesRouter = require('./routes/bureauProfilesRouter');
const distributorRoutes = require('./routes/distributeorCreate.js');
const Allrouters = require('./routes/regRouters.js');
const Settings = require('./routes/settings.js');
const Services = require('./routes/services.js')
const Location = require('./routes/location.js');
const Terms = require('./routes/Termsandconditions');
const Profiles = require('./routes/editprofile.js');
const Testimonial = require('./routes/testmonials.js');
const Testimonials2 = require('./routes/testimonials2.js');
const CustomizedLinks = require('./routes/customized_links.js');
const Userreviews = require('./routes/userrevies.js');
const Videolinks = require('./routes/videolinks.js');
const ManageVideos = require('./routes/manageVideos.js');
const Locationlinks = require('./routes/locationlinks.js');
const Distributorreviews = require('./routes/distributorreviews.js');
const Business = require('./routes/business.js');
const Buttons = require('./routes/button.js');
const packages = require('./routes/packages.js');
const packages2 = require('./routes/packages2.js');
const ProfileScore = require('./routes/profileScore.js');
const adminServices = require('./routes/adminServices.js');

// Enable CORS for all routes and use dotenv
// app.use(cors());
dotenv.config();
app.use(express.json()); // To parse JSON request bodies



const corsOptions = {
  origin: "*",

  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "bureauid"],
  credentials: true
};
   
app.use(cors(corsOptions));

app.options("*", cors(corsOptions)); // Handle preflight requests

// Serve static files from package_banners directory
app.use('/api/package_banners', express.static(path.join(__dirname, 'package_banners')));



// Specific route to serve package banner images with better error handling
app.get('/api/package_banners/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'package_banners', filename);
  
  console.log('Requested filename:', filename);
  console.log('File path:', filePath);
  console.log('File exists:', fs.existsSync(filePath));
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return res.status(404).json({ error: 'Image not found' });
  }
  
  // Get file extension to set correct content type
  const ext = path.extname(filename).toLowerCase();
  let contentType = 'image/jpeg'; // default
  
  switch (ext) {
    case '.png':
      contentType = 'image/png';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.webp':
      contentType = 'image/webp';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }
  
  console.log('Serving file:', filePath, 'with content-type:', contentType);
  res.setHeader('Content-Type', contentType);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.sendFile(filePath);
});

// Debug route to check package_banners folder
app.get('/api/debug/package_banners', (req, res) => {
  const folderPath = path.join(__dirname, 'package_banners');
  console.log('Checking folder:', folderPath);
  console.log('Folder exists:', fs.existsSync(folderPath));
  
  if (fs.existsSync(folderPath)) {
    try {
      const files = fs.readdirSync(folderPath);
      console.log('Files in folder:', files);
      res.json({ 
        folderExists: true, 
        folderPath: folderPath,
        files: files 
      });
    } catch (error) {
      console.error('Error reading folder:', error);
      res.status(500).json({ error: 'Error reading folder', details: error.message });
    }
  } else {
    res.json({ 
      folderExists: false, 
      folderPath: folderPath 
    });
  }
});

const port = process.env.PORT || 3200;
// Database connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});
app.use('/api', imageRouter);
app.use('/api/admin', adminRoutes); // Now, all routes prefixed with /api/admin will use adminRoutes
app.use('/api/distributor', distributerloginn); 
app.use('/api', bureaulogin);
app.use('/api', Business);

app.use('/api/bureau', bureauRouter);
app.use('/api', Testimonial);
app.use('/api', Testimonials2);
app.use('/api', CustomizedLinks);
app.use('/api', Distributorreviews);
app.use('/api', Userreviews);
app.use('/api', Videolinks);
app.use('/api', ManageVideos);
app.use('/api', Locationlinks);

app.use('/api/bureau', Getimages);

// Admin routes - define these BEFORE the general /api routes to avoid conflicts
app.get('/api/admin/bureau_details/:bureauId', (req, res) => {
  console.log('Admin bureau_details endpoint called with:', req.params);
  
  const { bureauId } = req.params;
  
  if (!bureauId) {
    console.log('bureauId missing');
    return res.status(400).json({ message: 'bureauId is required' });
  }

  console.log('Querying database for bureauId:', bureauId);

  // Query to get bureau details by ID with distributor information
  const query = `
    SELECT 
      bp.*,
      dp.fullName as distributor_fullName,
      dp.mobileNumber as distributor_mobileNumber
    FROM bureau_profiles bp
    LEFT JOIN distributor_profiles dp ON bp.distributorId = dp.id
    WHERE bp.bureauId = ?
  `;
  
  db.query(query, [bureauId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    console.log('Database query results:', { count: results.length, hasResults: results.length > 0 });

    if (results.length === 0) {
      console.log('Bureau not found in database');
      return res.status(404).json({ message: 'Bureau not found' });
    }

    const bureau = results[0];
    
    // Format the response with distributor info
    const response = {
      success: true,
      bureauProfile: {
        ...bureau,
        distributorInfo: bureau.distributor_fullName ? {
          fullName: bureau.distributor_fullName,
          mobileNumber: bureau.distributor_mobileNumber
        } : null
      }
    };

    console.log('Bureau found, sending response');
    // Respond with the bureau details
    res.status(200).json(response);
  });
});

// Delete incomplete profiles for a specific bureau
app.delete('/api/admin/delete-incomplete-profiles/:bureauId', async (req, res) => {
  try {
    const { bureauId } = req.params;
    
    // First, get all profiles for this bureau from MongoDB
    // We'll need to make a request to MongoDB to get the incomplete profiles
    // For now, we'll return a message that this should be handled by MongoDB
    
    res.json({
      success: true,
      message: 'Incomplete profiles deletion should be handled by MongoDB backend',
      bureauId: bureauId
    });
    
  } catch (error) {
    console.error('Error deleting incomplete profiles:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Test route to verify admin path is working
app.get('/api/admin/test', (req, res) => {
  console.log('Admin test route called');
  res.json({ message: 'Admin path is working', success: true });
});

// Test endpoint to debug profile image data
app.get('/api/admin/debug-profile/:bureauId', (req, res) => {
  const { bureauId } = req.params;
  
  const query = `
    SELECT 
      bp.bureauId,
      bp.bureauName,
      p.profile_img,
      typeof(p.profile_img) as profile_img_type,
      p.profile_img IS NULL as profile_img_is_null
    FROM bureau_profiles bp
    LEFT JOIN profiles p ON bp.bureauId = p.bureau_id
    WHERE bp.bureauId = ?
  `;
  
  db.query(query, [bureauId], (err, results) => {
    if (err) {
      console.error('Debug query error:', err);
      return res.status(500).json({ error: err.message });
    }
    
    const result = results[0] || {};
    const debugInfo = {
      bureauId: result.bureauId,
      bureauName: result.bureauName,
      hasProfileImg: !!result.profile_img,
      profileImgType: result.profile_img_type,
      profileImgIsNull: result.profile_img_is_null,
      profileImgLength: result.profile_img ? result.profile_img.length : null,
      profileImgBuffer: result.profile_img ? 'Buffer present' : 'No buffer',
      rawResult: result
    };
    
    res.json(debugInfo);
  });
});

console.log('Admin routes registered before bureauProfilesRouter');

app.use('/api', bureauProfilesRouter);

app.use('/api/distributor', distributorRoutes);
app.use('/api', Allrouters);

app.use('/api', Settings);
app.use('/api/services', Services);
app.use('/api', Location);
app.use('/api', Terms);
app.use('/api',Profiles);
app.use('/api/bureaubutton', Buttons);
app.use('/api',packages);
app.use('/api/pak',packages2);
app.use('/api/profile-score', ProfileScore);
app.use('/api/admin-services', adminServices);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});



// Endpoint to get bureau profiles by distributor ID
app.get('/api/bureau_profiles_distributer', (req, res) => {
  const distributorId = req.query.distributorId;

  // Check if distributorId is provided
  if (!distributorId) {
    return res.status(400).json({ message: 'Distributor ID is required' });
  }

  // Query to get bureau profiles for the specified distributor ID with profile images
  const query = `
    SELECT 
      bp.*,
      p.profile_img
    FROM bureau_profiles bp
    LEFT JOIN profiles p ON bp.bureauId = p.bureau_id
    WHERE bp.distributorId = ?
    ORDER BY bp.createdAt DESC
  `;
  
  db.query(query, [distributorId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    // Process results to handle profile images
    const processedResults = results.reduce((acc, row) => {
      const existingBureau = acc.find(b => b.bureauId === row.bureauId);
      
      if (existingBureau) {
        // If bureau already exists, add profile_img if it doesn't exist
        if (row.profile_img && !existingBureau.profile_img) {
          // Convert BLOB buffer to base64 string
          existingBureau.profile_img = Buffer.from(row.profile_img).toString('base64');
        }
      } else {
        // Create new bureau entry
        const bureau = { ...row };
        if (bureau.profile_img) {
          // Convert BLOB buffer to base64 string
          bureau.profile_img = Buffer.from(bureau.profile_img).toString('base64');
        }
        acc.push(bureau);
      }
      
      return acc;
    }, []);

    // Respond with the processed results
    res.status(200).json({ bureauProfiles: processedResults });
  });
});


// Endpoint to get all bureau profiles
app.get('/api/bureau_profiles', (req, res) => {
  // Query to get all records from bureau_profiles and join with profiles table for profile images
  const query = `
    SELECT 
      bp.*,
      p.profile_img 
    FROM bureau_profiles bp
    LEFT JOIN profiles p ON bp.bureauId = p.bureau_id
    ORDER BY bp.createdAt DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    // Process results to handle multiple profile images per bureau
    const processedResults = results.reduce((acc, row) => {
      const existingBureau = acc.find(b => b.bureauId === row.bureauId);
      
      // Debug logging for first few rows
      if (acc.length < 3) {
        console.log('Processing row:', {
          bureauId: row.bureauId,
          hasProfileImg: !!row.profile_img,
          profileImgType: typeof row.profile_img,
          isBuffer: Buffer.isBuffer(row.profile_img),
          profileImgLength: row.profile_img ? row.profile_img.length : null
        });
      }
      
      if (existingBureau) {
        // If bureau already exists, add profile_img if it doesn't exist
        if (row.profile_img && !existingBureau.profile_img) {
          // Convert BLOB buffer to base64 string - handle different data types
          try {
            if (Buffer.isBuffer(row.profile_img)) {
              existingBureau.profile_img = row.profile_img.toString('base64');
            } else if (typeof row.profile_img === 'string') {
              existingBureau.profile_img = row.profile_img;
            } else if (row.profile_img) {
              existingBureau.profile_img = Buffer.from(row.profile_img).toString('base64');
            }
          } catch (error) {
            console.error('Error converting profile_img to base64:', error);
            existingBureau.profile_img = null;
          }
        }
      } else {
        // Create new bureau entry
        const bureau = { ...row };
        if (bureau.profile_img) {
          // Convert BLOB buffer to base64 string - handle different data types
          try {
            if (Buffer.isBuffer(bureau.profile_img)) {
              bureau.profile_img = bureau.profile_img.toString('base64');
            } else if (typeof bureau.profile_img === 'string') {
              // Already a string, keep as is
            } else if (bureau.profile_img) {
              bureau.profile_img = Buffer.from(bureau.profile_img).toString('base64');
            }
          } catch (error) {
            console.error('Error converting profile_img to base64:', error);
            bureau.profile_img = null;
          }
        }
        acc.push(bureau);
      }
      
      return acc;
    }, []);

    // Respond with the processed results
    res.status(200).json({ bureauProfiles: processedResults });
  });
});


app.get('/api/bureau_users', (req, res) => {
  const query = `
    SELECT 
      u.id AS userId,
      u.name AS userName,
      u.gender,
      u.email,
      u.mobileNumber,
      u.createdAt AS createdAt,
      u.images AS profile_img,
      u.bureauId,
      bp.bureauName,
      bp.mobileNumber AS bureauMobile,
      bp.email AS bureauEmail
    FROM users u
    INNER JOIN bureau_profiles bp ON u.bureauId = bp.bureauId
    ORDER BY u.createdAt DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    // Convert images to base64
    const processedResults = results.map(row => {
      let profileImg = null;
      try {
        if (row.profile_img) {
          profileImg = Buffer.from(row.profile_img).toString('base64');
        }
      } catch (error) {
        console.error('Error converting profile image to base64:', error);
      }

      return {
        userId: row.userId,
        name: row.userName,
        gender: row.gender,
        email: row.email,
        mobileNumber: row.mobileNumber,
        createdAt: row.createdAt,
        profile_img: profileImg,
        bureau: {
          bureauId: row.bureauId,
          bureauName: row.bureauName,
          bureauMobile: row.bureauMobile,
          bureauEmail: row.bureauEmail
        }
      };
    });

    res.status(200).json({ users: processedResults });
  });
});

app.get('/api/bureau_users/:gender?', (req, res) => {
  const { gender } = req.params; // now it captures "male", "female", or undefined

  console.log("Gender param:", req.params.gender);
  res.send("Route works");

  let query = `
    SELECT 
      u.id AS userId,
      u.name AS userName,
      u.gender,
      u.email,
      u.mobileNumber,
      u.createdAt AS createdAt,
      u.images AS profile_img,
      u.bureauId,
      bp.bureauName,
      bp.mobileNumber AS bureauMobile,
      bp.email AS bureauEmail
    FROM users u
    INNER JOIN bureau_profiles bp ON u.bureauId = bp.bureauId
  `;

  // Filter by gender if provided
  if (gender) {
    query += ` WHERE u.gender = ? `;
  }

  query += ` ORDER BY u.createdAt DESC `;

  db.query(query, gender ? [gender] : [], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    // Convert images to base64
    const processedResults = results.map(row => {
      let profileImg = null;
      try {
        if (row.profile_img) {
          profileImg = Buffer.from(row.profile_img).toString('base64');
        }
      } catch (error) {
        console.error('Error converting profile image to base64:', error);
      }

      return {
        userId: row.userId,
        name: row.userName,
        gender: row.gender,
        email: row.email,
        mobileNumber: row.mobileNumber,
        createdAt: row.createdAt,
        profile_img: profileImg,
        bureau: {
          bureauId: row.bureauId,
          bureauName: row.bureauName,
          bureauMobile: row.bureauMobile,
          bureauEmail: row.bureauEmail
        }
      };
    });

    res.status(200).json({ users: processedResults });
  });
});




// Alternative endpoint to get all bureau profiles with profile images (separate queries)
app.get('/api/bureau_profiles_with_images', async (req, res) => {
  try {
    // First, get all bureau profiles
    const bureauQuery = 'SELECT * FROM bureau_profiles ORDER BY createdAt DESC';
    
    db.query(bureauQuery, async (err, bureauResults) => {
      if (err) {
        console.error('Bureau query error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }

      // Then, get all profile images
      const profileQuery = 'SELECT bureau_id, profile_img FROM profiles';
      
      db.query(profileQuery, async (profileErr, profileResults) => {
        if (profileErr) {
          console.error('Profile query error:', profileErr);
          return res.status(500).json({ message: 'Server error. Please try again later.' });
        }

        // Create a map of profile images by bureau_id
        const profileMap = {};
        profileResults.forEach(profile => {
          if (profile.profile_img) {
            try {
              profileMap[profile.bureau_id] = profile.profile_img.toString('base64');
            } catch (error) {
              console.error('Error converting profile to base64:', error);
            }
          }
        });

        // Merge profile images with bureau data
        const mergedResults = bureauResults.map(bureau => ({
          ...bureau,
          profile_img: profileMap[bureau.bureauId] || null
        }));

        console.log('Merged results:', {
          totalBureaus: mergedResults.length,
          bureausWithImages: mergedResults.filter(b => b.profile_img).length,
          sampleBureau: mergedResults[0] ? {
            bureauId: mergedResults[0].bureauId,
            hasProfileImg: !!mergedResults[0].profile_img,
            profileImgLength: mergedResults[0].profile_img ? mergedResults[0].profile_img.length : null
          } : null
        });

        res.status(200).json({ bureauProfiles: mergedResults });
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// Endpoint to get bureau profiles from the last 7 days
app.get('/api/bureau_recent', (req, res) => {
  // MySQL DATE_FORMAT of createdAt is 'YYYY-MM-DD HH:MM:SS'; use NOW() - INTERVAL 7 DAY
  const query = `
    SELECT 
      bp.*,
      p.profile_img
    FROM bureau_profiles bp
    LEFT JOIN profiles p ON bp.bureauId = p.bureau_id
    WHERE bp.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ORDER BY bp.createdAt DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    // Process results to handle multiple profile images per bureau
    const processedResults = results.reduce((acc, row) => {
      const existingBureau = acc.find(b => b.bureauId === row.bureauId);
      
      if (existingBureau) {
        // If bureau already exists, add profile_img if it doesn't exist
        if (row.profile_img && !existingBureau.profile_img) {
          // Convert BLOB buffer to base64 string
          existingBureau.profile_img = Buffer.from(row.profile_img).toString('base64');
        }
      } else {
        // Create new bureau entry
        const bureau = { ...row };
        if (bureau.profile_img) {
          // Convert BLOB buffer to base64 string
          bureau.profile_img = Buffer.from(bureau.profile_img).toString('base64');
        }
        acc.push(bureau);
      }
      
      return acc;
    }, []);

    res.status(200).json({ bureauProfiles: processedResults });
  });
});

// Endpoint to get recent bureaus count (last 7 days)
app.get('/api/bureau_recent_count', (req, res) => {
  const query = `
    SELECT COUNT(*) as recentCount
    FROM bureau_profiles
    WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    res.status(200).json({ count: results[0]?.recentCount || 0 });
  });
});

// Endpoint to get bureau counts for dashboard
app.get('/api/bureau_counts', (req, res) => {
  // Query to get counts of different bureau types
  const query = `
    SELECT 
      COUNT(*) as totalBureaus,
      SUM(CASE WHEN paymentStatus != 1 AND deleted != 1 AND suspend != 1 THEN 1 ELSE 0 END) as freeBureaus,
      SUM(CASE WHEN paymentStatus = 1 AND deleted != 1 AND suspend != 1 THEN 1 ELSE 0 END) as paidBureaus,
      SUM(CASE WHEN suspend = 1 THEN 1 ELSE 0 END) as suspendedBureaus,
      SUM(CASE WHEN deleted = 1 THEN 1 ELSE 0 END) as deletedBureaus
    FROM bureau_profiles
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    // Respond with the counts
    res.status(200).json({ 
      counts: results[0],
      success: true 
    });
  });
});

// Endpoint to get all distributor profiles
app.get('/api/distributors', (req, res) => {
  // Query to get all records from the distributor_profiles table
  db.query('SELECT * FROM distributor_profiles', (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    // Respond with the results
    res.status(200).json({ distributors: results });
  });
});

// API endpoint to delete a banner image for a bureau
app.delete('/api/deleteBannerImage/:imageId', async (req, res) => {
  const { imageId } = req.params;

  if (!imageId) {
    return res.status(400).json({ message: 'Please provide imageId.' });
  }

  try {
    // Query to delete the image from the database
    const deleteQuery = 'DELETE FROM slider_images WHERE id = ?';
    const values = [imageId];

    db.query(deleteQuery, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }

      // Check if the image was deleted
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Image not found.' });
      }

      // Respond with success message
      res.status(200).json({ message: 'Image deleted successfully.' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


const galleryImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'galleryimages/'); // Save images in 'galleryimages' directory
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + '-' + file.originalname;
    cb(null, fileName); // Rename the file with a timestamp to avoid conflicts
  },
});

// Set up multer to handle gallery image uploads
const uploadGalleryImages = multer({ storage: galleryImageStorage });

// API endpoint to upload a single gallery image
app.post('/api/gallery/upload', uploadGalleryImages.single('image'), async (req, res) => {
  const { bureauId } = req.body;

  if (!bureauId || !req.file) {
    return res.status(400).json({ message: 'Please provide bureauId and an image to upload.' });
  }

  // Collect the URL of the uploaded image
  const imageUrl = `/galleryimages/${req.file.filename}`; // Image path in the folder

  try {
    // Insert the image URL into the gallery_images table
    const insertQuery = 'INSERT INTO gallery_images (bureauId, imageUrl) VALUES (?, ?)';
    const values = [bureauId, imageUrl];

    db.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }

      // Check if the row was inserted successfully
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Bureau not found or image could not be inserted.' });
      }

      res.status(200).json({
        message: 'Image uploaded and inserted into gallery_images table successfully.',
        imageUrl,
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});



// API endpoint to delete a gallery image for a bureau
app.delete('/api/deleteGalleryImage/:imageId', async (req, res) => {
  const { imageId } = req.params;

  if (!imageId) {
    return res.status(400).json({ message: 'Please provide imageId.' });
  }

  try {
    // Query to delete the image from the database
    const deleteQuery = 'DELETE FROM gallery_images WHERE id = ?';
    const values = [imageId];

    db.query(deleteQuery, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }

      // Check if the image was deleted
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Image not found.' });
      }

      // Respond with success message
      res.status(200).json({ message: 'Image deleted successfully.' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Endpoint to get expired bureaus (expiryDate in past)
app.get('/api/bureau_expired', (req, res) => {
  const query = `
    SELECT *
    FROM bureau_profiles
    WHERE expiryDate IS NOT NULL AND expiryDate <> '' AND DATE(expiryDate) < CURDATE()
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    res.status(200).json({ bureauProfiles: results });
  });
});

// Endpoint to get expired bureaus count
app.get('/api/bureau_expired_count', (req, res) => {
  const query = `
    SELECT COUNT(*) as expiredCount
    FROM bureau_profiles
    WHERE expiryDate IS NOT NULL AND expiryDate <> '' AND DATE(expiryDate) < CURDATE()
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    res.status(200).json({ count: results[0]?.expiredCount || 0 });
  });
});

// Admin Terms and Conditions Management Endpoints
app.get('/api/admin/terms', (req, res) => {
  // First check if table exists, if not create it with default data
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS bureau_terms (
      id int(11) NOT NULL AUTO_INCREMENT,
      title varchar(255) NOT NULL DEFAULT 'Terms and Conditions',
      content longtext NOT NULL,
      is_active tinyint(1) NOT NULL DEFAULT 1,
      created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;
  
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    // Check if ID 1 exists, if not create default terms
    const checkQuery = 'SELECT * FROM bureau_terms WHERE id = 1';
    db.query(checkQuery, (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }
      
      if (results.length === 0) {
        // Create default terms with ID 1
        const defaultContent = '<h2>Welcome to Matrimony Studio</h2><p>These terms and conditions govern your use of our matrimony services. By using our platform, you agree to these terms.</p><h3>1. User Conduct</h3><p>Users must provide accurate information and behave respectfully towards other users.</p><h3>2. Privacy</h3><p>We protect your personal information as outlined in our privacy policy.</p><h3>3. Service Usage</h3><p>Our services are for legitimate matrimony purposes only.</p>';
        const insertQuery = 'INSERT INTO bureau_terms (id, title, content, is_active) VALUES (1, ?, ?, 1)';
        db.query(insertQuery, ['Terms and Conditions', defaultContent], (err) => {
          if (err) {
            console.error('Error inserting default terms:', err);
            return res.status(500).json({ message: 'Server error. Please try again later.' });
          }
          // Return the default terms
          res.status(200).json({ 
            terms: { 
              id: 1, 
              title: 'Terms and Conditions', 
              content: defaultContent, 
              is_active: 1 
            } 
          });
        });
      } else {
        // Return existing terms with ID 1
        res.status(200).json({ terms: results[0] });
      }
    });
  });
});

app.post('/api/admin/terms', (req, res) => {
  const { title, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  // Always update ID 1 instead of creating new records
  const query = 'INSERT INTO bureau_terms (id, title, content, is_active) VALUES (1, ?, ?, 1) ON DUPLICATE KEY UPDATE title = ?, content = ?, is_active = 1';
  const values = [title, content, title, content];
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    res.status(200).json({ 
      message: 'Terms and conditions updated successfully.',
      id: 1 
    });
  });
});

app.put('/api/admin/terms/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, is_active } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  // Only allow updating ID 1
  if (parseInt(id) !== 1) {
    return res.status(400).json({ message: 'Only ID 1 can be modified.' });
  }

  const query = 'UPDATE bureau_terms SET title = ?, content = ?, is_active = ? WHERE id = 1';
  const values = [title, content, is_active ? 1 : 0];
  
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Terms not found.' });
    }

    res.status(200).json({ message: 'Terms and conditions updated successfully.' });
  });
});

app.delete('/api/admin/terms/:id', (req, res) => {
  const { id } = req.params;
  
  // Only allow deleting ID 1
  if (parseInt(id) !== 1) {
    return res.status(400).json({ message: 'Only ID 1 can be modified.' });
  }
  
  const query = 'DELETE FROM bureau_terms WHERE id = 1';
  
  db.query(query, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Terms not found.' });
    }

    res.status(200).json({ message: 'Terms and conditions deleted successfully.' });
  });
});

// Public endpoint to get active terms for bureaus
app.get('/api/bureau/terms', (req, res) => {
  const query = 'SELECT title, content FROM bureau_terms WHERE id = 1 AND is_active = 1';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }

    res.status(200).json({ terms: results[0] || null });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('✅ Admin routes registered:');
  console.log('  - GET /api/admin/bureau_details/:bureauId');
  console.log('  - GET /api/admin/test');
  console.log('🚀 Server ready to handle requests!');
});

