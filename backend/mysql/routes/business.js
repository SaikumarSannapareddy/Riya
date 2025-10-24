// adminRoutes.js
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config(); // Load environment variables

const router = express.Router();

// Set up MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload instances - don't reuse the same instance across routes
const createUpload = (fieldName) => {
  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max file size
    }
  }).single(fieldName);
};

// Handle multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      message: `Upload error: ${err.message}`,
      field: err.field
    });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
};

// Route handler for uploading slider images (up to 5)
router.put('/slider-images', (req, res, next) => {
  const upload = createUpload('sliderImage');
  upload(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
  
    // Check how many slider images already exist
    db.query('SELECT COUNT(*) as count FROM slider_images_main', (err, countResults) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }
  
      const currentCount = countResults[0].count;
      
      // Check if limit of 5 images is reached
      if (currentCount >= 5) {
        // Delete the uploaded file since we can't use it
        fs.unlinkSync(path.join(uploadsDir, req.file.filename));
        return res.status(400).json({ message: 'Maximum limit of 5 slider images has been reached. Delete an existing image before adding a new one.' });
      }
  
      const imageFilename = req.file.filename;
      const imagePath = `uploads/${imageFilename}`; // Store relative path in database
      
      // Insert new slider image into database
      db.query('INSERT INTO slider_images_main (image_path) VALUES (?)', [imagePath], (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Database insert error:', insertErr);
          // Delete the uploaded file if database insert fails
          fs.unlinkSync(path.join(uploadsDir, imageFilename));
          return res.status(500).json({ message: 'Failed to save slider image in database.' });
        }
        
        res.status(200).json({ 
          message: 'Slider image uploaded successfully',
          image: {
            id: insertResult.insertId,
            path: imagePath
          }
        });
      });
    });
  });
});

router.put('/success-stories', (req, res, next) => {
  const upload = createUpload('successImage');
  upload(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
 
    const imageFilename = req.file.filename;
    const imagePath = `uploads/${imageFilename}`; // Store relative path in database
    
    // Insert new success story image into database
    db.query('INSERT INTO success_stories (image_path) VALUES (?)', [imagePath], (insertErr, insertResult) => {
      if (insertErr) {
        console.error('Database insert error:', insertErr);
        // Delete the uploaded file if database insert fails
        fs.unlinkSync(path.join(uploadsDir, imageFilename));
        return res.status(500).json({ message: 'Failed to save Success image in database.' });
      }
      
      res.status(200).json({ 
        message: 'Success image uploaded successfully',
        image: {
          id: insertResult.insertId,
          path: imagePath
        }
      });
    });
  });
});

// Route handler for deleting a slider image
router.delete('/slider-images/:id', (req, res) => {
  const imageId = req.params.id;
  
  // Get the image path before deleting the record
  db.query('SELECT image_path FROM slider_images_main WHERE id = ?', [imageId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Slider image not found' });
    }
    
    const imagePath = results[0].image_path;
    
    // Delete the record from the database
    db.query('DELETE FROM slider_images_main WHERE id = ?', [imageId], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error('Database delete error:', deleteErr);
        return res.status(500).json({ message: 'Failed to delete slider image from database.' });
      }
      
      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Slider image not found' });
      }
      
      // Delete the file from the filesystem
      const fullImagePath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(fullImagePath)) {
        try {
          fs.unlinkSync(fullImagePath);
        } catch (unlinkErr) {
          console.error('Error deleting slider image file:', unlinkErr);
          // Continue despite error in deleting file, as the database record is already removed
        }
      }
      
      res.status(200).json({ message: 'Slider image deleted successfully' });
    });
  });
});

// Route handler for deleting a success image
router.delete('/success-stories/:id', (req, res) => {
  const imageId = req.params.id;
  
  // Get the image path before deleting the record
  db.query('SELECT image_path FROM success_stories WHERE id = ?', [imageId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Success story image not found' });
    }
    
    const imagePath = results[0].image_path;
    
    // Delete the record from the database
    db.query('DELETE FROM success_stories WHERE id = ?', [imageId], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error('Database delete error:', deleteErr);
        return res.status(500).json({ message: 'Failed to delete Success image from database.' });
      }
      
      if (deleteResult.affectedRows === 0) {
        return res.status(404).json({ message: 'Success image not found' });
      }
      
      // Delete the file from the filesystem
      const fullImagePath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(fullImagePath)) {
        try {
          fs.unlinkSync(fullImagePath);
        } catch (unlinkErr) {
          console.error('Error deleting Success image file:', unlinkErr);
          // Continue despite error in deleting file, as the database record is already removed
        }
      }
      
      res.status(200).json({ message: 'Success image deleted successfully' });
    });
  });
});

// Route handler for retrieving all slider images
router.get('/slider-images', (_, res) => {  // Use underscore to indicate unused parameter
  const query = 'SELECT id, image_path FROM slider_images_main ORDER BY id ASC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    res.status(200).json({ 
      sliderImages: results.map(img => ({
        id: img.id,
        path: img.image_path
      }))
    });
  });
});

router.get('/success-stories', (_, res) => {  // Use underscore to indicate unused parameter
  const query = 'SELECT id, image_path FROM success_stories ORDER BY id ASC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    res.status(200).json({ 
      successStories: results.map(img => ({
        id: img.id,
        path: img.image_path
      }))
    });
  }); 
});

// Route handler for retrieving business details including name and logo
router.get('/buname', (_, res) => {  // Use underscore to indicate unused parameter
  // First get business details
  const businessQuery = 'SELECT * FROM admin WHERE id = 2';
  
  db.query(businessQuery, (err, businessResults) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }
    
      if (businessResults.length === 0) {
        return res.status(404).json({ message: 'Business details not found' });
      }
    
      const sliderQuery = 'SELECT id, image_path FROM slider_images_main ORDER BY id ASC';
      const successQuery = 'SELECT id, image_path FROM success_stories ORDER BY id ASC';
    
      // First query for slider images
      db.query(sliderQuery, (sliderErr, sliderResults) => {
        if (sliderErr) {
          console.error('Slider images query error:', sliderErr);
          return res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    
        // Then query for success stories
        db.query(successQuery, (successErr, successResults) => {
          if (successErr) {
            console.error('Success stories query error:', successErr);
            return res.status(500).json({ message: 'Server error. Please try again later.' });
          }
    
          // Return all combined data
          res.status(200).json({
            bname: businessResults[0].bname,
            logo: businessResults[0].logo,
            bemail: businessResults[0].bemail,
            bnumber: businessResults[0].bnumber,
            about: businessResults[0].about,
            twitter: businessResults[0].twitter,
            youtube: businessResults[0].youtube,
            instagram: businessResults[0].instagram,
            facebook: businessResults[0].facebook,
            address : businessResults[0].address,
            houseno : businessResults[0].houseno,
            pincode : businessResults[0].pincode,
            sliderImages: sliderResults.map(img => ({
              id: img.id,
              path: img.image_path
            })),
            successImages: successResults.map(img => ({
              id: img.id,
              path: img.image_path
            })),
          });
        });
      });
    });
});

// Update business name
router.put('/business-name', (req, res) => {
  const { bname } = req.body;
  
  // Basic validation
  if (!bname || typeof bname !== 'string') {
    return res.status(400).json({ message: 'Valid business name is required' });
  }
  
  const query = 'UPDATE admin SET bname = ? WHERE id = 2';
  
  db.query(query, [bname], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Business name record not found' });
    }
    
    res.status(200).json({ message: 'Business name updated successfully', bname });
  });
});

router.put('/business-contact', (req, res) => {
  const { bemail, bnumber } = req.body;
  
  // Basic validation
  if (!bemail || typeof bemail !== 'string' || !bemail.includes('@')) {
    return res.status(400).json({ message: 'Valid business email is required' });
  }
  
  if (!bnumber || typeof bnumber !== 'string') {
    return res.status(400).json({ message: 'Valid business phone number is required' });
  }
  
  const query = 'UPDATE admin SET bemail = ?, bnumber = ? WHERE id = 2';
  
  db.query(query, [bemail, bnumber], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Business contact record not found' });
    }
    
    res.status(200).json({ 
      message: 'Business contact information updated successfully', 
      bemail,
      bnumber
    });
  });
});

// Update business about us
router.put('/business-aboutus', (req, res) => {
  const { about } = req.body;  // Changed from bname to about
  
  // Basic validation
  if (!about || typeof about !== 'string') {
    return res.status(400).json({ message: 'Valid about us content is required' });
  }
  
  const query = 'UPDATE admin SET about = ? WHERE id = 2';
  
  db.query(query, [about], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Business About record not found' });
    }
    
    res.status(200).json({ message: 'Business About updated successfully', about });
  });
});
router.put('/business-address', (req, res) => {
  const { address, pincode, houseno } = req.body;
  
  // Basic validation
  if (!address || typeof address !== 'string') {
    return res.status(400).json({ message: 'Valid address is required' });
  }
  
  if (!pincode || typeof pincode !== 'string') {
    return res.status(400).json({ message: 'Valid pincode is required' });
  }
  
  if (!houseno || typeof houseno !== 'string') {
    return res.status(400).json({ message: 'Valid house number is required' });
  }
  
  const query = 'UPDATE admin SET address = ?, pincode = ?, houseno = ? WHERE id = 2';
  
  db.query(query, [address, pincode, houseno], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Business record not found' });
    }
    
    res.status(200).json({ 
      message: 'Business address details updated successfully', 
      address,
      pincode,
      houseno
    });
  });
});
// GET endpoint to fetch social media links
router.get('/social-media-links', (req, res) => {
  const query = 'SELECT twitter, youtube, instagram, facebook FROM admin WHERE id = 2';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Social media links record not found' });
    }
    
    res.status(200).json(results[0]);
  });
});

// PUT endpoint to update social media links
router.put('/social-media-links', (req, res) => {
  const { twitter, youtube, instagram, facebook } = req.body;
  
  // Basic validation - URLs are optional but if provided must be strings
  if ((twitter && typeof twitter !== 'string') ||
      (youtube && typeof youtube !== 'string') ||
      (instagram && typeof instagram !== 'string') ||
      (facebook && typeof facebook !== 'string')) {
    return res.status(400).json({ message: 'Invalid social media URL format' });
  }
  
  const query = 'UPDATE admin SET twitter = ?, youtube = ?, instagram = ?, facebook = ? WHERE id = 2';
  
  db.query(query, [twitter, youtube, instagram, facebook], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Social media links record not found' });
    }
    
    res.status(200).json({ 
      message: 'Social media links updated successfully', 
      twitter,
      youtube,
      instagram,
      facebook
    });
  });
});

// Update business logo
router.put('/logo', (req, res, next) => {
  const upload = createUpload('logo');
  upload(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No logo file uploaded' });
    }

    // Get the existing logo file path if any
    db.query('SELECT logo FROM admin WHERE id = 2', (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }

      const oldLogo = results[0]?.logo;
      const logoFilename = req.file.filename;
      const logoPath = `uploads/${logoFilename}`; // Store relative path in database
      
      // Update logo path in database
      db.query('UPDATE admin SET logo = ? WHERE id = 2', [logoPath], (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Database update error:', updateErr);
          // Delete the uploaded file if database update fails
          fs.unlinkSync(path.join(uploadsDir, logoFilename));
          return res.status(500).json({ message: 'Failed to update logo in database.' });
        }
        
        if (updateResult.affectedRows === 0) {
          // Delete the uploaded file if no rows were affected
          fs.unlinkSync(path.join(uploadsDir, logoFilename));
          return res.status(404).json({ message: 'Business record not found' });
        }
        
        // Delete the old logo file if it exists
        if (oldLogo) {
          const oldLogoPath = path.join(__dirname, '..', oldLogo);
          if (fs.existsSync(oldLogoPath)) {
            try {
              fs.unlinkSync(oldLogoPath);
            } catch (unlinkErr) {
              console.error('Error deleting old logo:', unlinkErr);
              // Continue despite error in deleting old file
            }
          }
        }
        
        res.status(200).json({ 
          message: 'Logo updated successfully',
          logo: logoPath
        });
      });
    });
  });
});

module.exports = router;