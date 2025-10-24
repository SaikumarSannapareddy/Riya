// routes/bureauRouter.js

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

// Storage configuration for document uploads
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded documents in the 'bureau_documents' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Generate a unique file name using timestamp
  },
});

const uploadDocuments = multer({ storage: documentStorage });

// Bureau creation route with document uploads
router.post('/create', uploadDocuments.array('documents', 10), async (req, res) => {
  const { bureauName, mobileNumber, about, location, email, ownerName, paymentStatus, distributorId, password } = req.body;
  const documentFiles = req.files; // Access uploaded files

  // Check if all required fields are present
  if (!bureauName || !email || !mobileNumber || !ownerName || !distributorId || !password) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  // Generate a unique bureauId (7-digit random number)
  const generateBureauId = () => {
    const randomNum = Math.floor(1000000 + Math.random() * 9000000); // Generate a random 7-digit number
    return randomNum.toString();
  };

  const bureauId = generateBureauId(); // Generate the unique bureau ID

  try {
    // Check if a bureau already exists with the same email or mobile number
    const checkQuery = 'SELECT * FROM bureau_profiles WHERE email = ? OR mobileNumber = ?';
    db.query(checkQuery, [email, mobileNumber], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: 'Bureau already exists with this email or mobile number.' });
      }

      // Hash the password before saving it to the database using bcryptjs
      bcrypt.hash(password, 10, (err, hashedPassword) => { // saltRounds is 10
        if (err) {
          console.error('Error hashing password:', err);
          return res.status(500).json({ message: 'Error hashing password.' });
        }

        // Insert bureau profile into the database
        const insertQuery =
          'INSERT INTO bureau_profiles (bureauId, bureauName, mobileNumber, about, location, email, ownerName, paymentStatus, distributorId, password, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
          bureauId,
          bureauName,
          mobileNumber,
          about,
          location,
          email,
          ownerName,
          paymentStatus || null, // Allow null values for paymentStatus
          distributorId,
          hashedPassword, // Save hashed password
          new Date(), // Created at timestamp
        ];

        db.query(insertQuery, values, (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Server error. Please try again later.' });
          }

          // If document files are uploaded, store file paths in the database
          if (documentFiles && documentFiles.length > 0) {
            documentFiles.forEach((file) => {
              const filePathQuery = 'INSERT INTO bureau_documents (bureau_id, file_path) VALUES (?, ?)';
              db.query(filePathQuery, [result.insertId, file.path], (err) => {
                if (err) {
                  console.error('Error saving file path:', err);
                }
              });
            });
          }

          // Respond with success message
          res.status(201).json({ message: 'Bureau created successfully', bureauId: bureauId });
        });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Bureau update route
router.put('/update', async (req, res) => {
  const {
    bureauId,
    bureauName,
    mobileNumber,
    about,
    location,
    email,
    facebook,
    instagram,
    linkedin,
    youtube,
    twitter,
  } = req.body;

  if (
    !bureauId ||
    (!bureauName &&
      !mobileNumber &&
      !about &&
      !location &&
      !email &&
      !facebook &&
      !instagram &&
      !linkedin &&
      !youtube &&
      !twitter)
  ) {
    console.warn('Invalid input: Missing bureauId or fields to update.', req.body);
    return res.status(400).json({
      message: 'Please provide bureauId and at least one field to update.',
    });
  }

  try {
    const updates = [];
    const values = [];

    if (bureauName) {
      updates.push('bureauName = ?');
      values.push(bureauName);
    }
    if (mobileNumber) {
      updates.push('mobileNumber = ?');
      values.push(mobileNumber);
    }
    if (about) {
      updates.push('about = ?');
      values.push(about);
    }
    if (location) {
      updates.push('location = ?');
      values.push(location);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (facebook) {
      updates.push('facebook = ?');
      values.push(facebook);
    }
    if (instagram) {
      updates.push('instagram = ?');
      values.push(instagram);
    }
    if (linkedin) {
      updates.push('linkedin = ?');
      values.push(linkedin);
    }
    if (youtube) {
      updates.push('youtube = ?');
      values.push(youtube);
    }
    if (twitter) {
      updates.push('twitter = ?');
      values.push(twitter);
    }

    values.push(bureauId); // for WHERE clause

    const updateQuery = `UPDATE bureau_profiles SET ${updates.join(', ')} WHERE bureauId = ?`;

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
        message: 'Bureau updated successfully',
        updatedFields: updates.map((u) => u.split(' = ')[0]),
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

router.put('/update-status', async (req, res) => {
  const {
    bureauId,
    suspend,
    deleted,
    paymentStatus,
    expiryDate,
  } = req.body;

  // Check for bureauId and at least one field to update
  if (
    !bureauId ||
    (suspend === undefined &&
      deleted === undefined &&
      paymentStatus === undefined &&
      expiryDate === undefined)
  ) {
    return res.status(400).json({
      message: 'Please provide bureauId and at least one field to update.',
    });
  }

  try {
    const updates = [];
    const values = [];

    // Only update fields that are explicitly provided
    if (suspend !== undefined) {
      updates.push('suspend = ?');
      values.push(suspend);
    }

    if (deleted !== undefined) {
      updates.push('deleted = ?');
      values.push(deleted);
    }

    if (paymentStatus !== undefined) {
      updates.push('paymentStatus = ?');
      values.push(paymentStatus);
    }

    if (expiryDate !== undefined) {
      updates.push('expiryDate = ?');
      values.push(expiryDate);
    }

    values.push(bureauId); // Always needed for WHERE clause

    const updateQuery = `UPDATE bureau_profiles SET ${updates.join(', ')} WHERE bureauId = ?`;

    console.log('SQL:', updateQuery);
    console.log('Values:', values);

    db.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({
          message: 'Database error during update.',
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: 'No bureau found or no changes made.',
        });
      }

      res.status(200).json({
        message: 'Bureau status updated successfully.',
        updatedFields: updates.map((u) => u.split(' = ')[0]),
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({
      message: 'Internal server error.',
      error: error.message,
    });
  }
});

router.post('/add-transaction', async (req, res) => {
  const { bureau_id, date, expiryDate, amount } = req.body;

  // Basic validation
  if (!bureau_id || !date || !expiryDate || !amount) {
    return res.status(400).json({
      message: 'All fields (bureau_id, date, expiryDate, amount) are required.',
    });
  }

  try {
    const insertQuery = `
      INSERT INTO payment_transactions (bureau_id, date, expiryDate, amount)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertQuery, [bureau_id, date, expiryDate, amount], (err, result) => {
      if (err) {
        console.error('Error inserting into payment_transactions:', err);
        return res.status(500).json({
          message: 'Failed to add payment transaction.',
          error: err.message,
        });
      }

      res.status(201).json({
        message: 'Payment transaction added successfully.',
        transactionId: result.insertId,
      });
    });
  } catch (error) {
    console.error('Unexpected server error:', error);
    res.status(500).json({
      message: 'Server error occurred.',
      error: error.message,
    });
  }
});

router.post('/PasswordUpdate', async (req, res) => {
  const { bureauId, currentPassword, newPassword } = req.body;

  if (!bureauId || !currentPassword || !newPassword) {
    return res.status(400).json({
      message: 'Please provide bureauId, currentPassword, and newPassword.',
    });
  }

  try {
    // Fetch the user's existing hashed password from the database
    const query = 'SELECT password FROM bureau_profiles WHERE bureauId = ?';
    db.query(query, [bureauId], async (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error occurred.' });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: 'Bureau not found.' });
      }

      const hashedPassword = result[0].password;

      // Compare the current password with the stored hashed password
      const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, hashedPassword);
      if (!isCurrentPasswordCorrect) {
        return res.status(400).json({ message: 'Current password is incorrect!' });
      }

      // Hash the new password
      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the password in the database
      const updateQuery = 'UPDATE bureau_profiles SET password = ? WHERE bureauId = ?';
      db.query(updateQuery, [newHashedPassword, bureauId], (err, result) => {
        if (err) {
          console.error('Error updating password:', err);
          return res.status(500).json({ message: 'Error updating password.' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Failed to update password.' });
        }

        res.status(200).json({ message: 'Password updated successfully.' });
      });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
});

router.post('/PasswordUpdateadmin', async (req, res) => {
  const { bureauId, newPassword } = req.body;

  if (!bureauId || !newPassword) {
    return res.status(400).json({
      message: 'Please provide bureauId and newPassword.',
    });
  }

  try {
    // Hash the new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const updateQuery = 'UPDATE bureau_profiles SET password = ? WHERE id = ?';
    db.query(updateQuery, [newHashedPassword, bureauId], (err, result) => {
      if (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({ message: 'Error updating password.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Bureau not found or password update failed.' });
      }

      res.status(200).json({ message: 'Password updated successfully.' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
});

// Storage configuration for banner upload
const homeBannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'homebanners/'); // Save in 'homebanners' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const uploadHomeBanner = multer({ storage: homeBannerStorage });

// Upload banner image route
router.put('/uploadBanner', uploadHomeBanner.single('image'), async (req, res) => {
  const { bureauId } = req.body;

  if (!bureauId || !req.file) {
    return res.status(400).json({ message: 'Please provide bureauId and an image to upload.' });
  }

  const imageUrl = `/homebanners/${req.file.filename}`; // Path to the saved image

  try {
    const updateQuery = 'UPDATE bureau_profiles SET welcomeImageBanner = ? WHERE bureauId = ?';
    const values = [imageUrl, bureauId];

    db.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Bureau not found.' });
      }

      res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// Banner upload route
const bannerImageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'bannerimages/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const uploadBannerImages = multer({ storage: bannerImageStorage });
  
  router.post('/slider', uploadBannerImages.single('image'), async (req, res) => {
    const { bureauId } = req.body;
  
    if (!bureauId || !req.file) {
      return res.status(400).json({ message: 'Please provide bureauId and an image to upload.' });
    }
  
    console.log('Bureau ID:', bureauId);
    console.log('File Info:', req.file); // Log file information to ensure it's being received
  
    const imageUrl = `/bannerimages/${req.file.filename}`;
  
    try {
      const insertQuery = 'INSERT INTO slider_images (bureauId, imageUrl) VALUES (?, ?)';
      const values = [bureauId, imageUrl];
  
      db.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error('Database Error:', err); // Log the error for debugging
          return res.status(500).json({ message: 'Server error. Please try again later.' });
        }
  
        res.status(200).json({
          message: 'Image uploaded and inserted into slider_images table successfully.',
          imageUrl,
        });
      });
    } catch (error) {
      console.error('Catch Block Error:', error); // Log any errors from the try block
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  });

  // Storage configuration for navbar logo upload
const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'logo/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const uploadLogo = multer({ storage: logoStorage });

// Upload navbar logo route
router.put('/uploadLogo', uploadLogo.single('image'), async (req, res) => {
  const { bureauId } = req.body;
  if (!bureauId || !req.file) {
    return res.status(400).json({ message: 'Please provide bureauId and an image to upload.' });
  }
  const logoUrl = `/logo/${req.file.filename}`;
  try {
    const updateQuery = 'UPDATE bureau_profiles SET navbarLogo = ? WHERE bureauId = ?';
    db.query(updateQuery, [logoUrl, bureauId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Bureau not found.' });
      }
      res.status(200).json({ message: 'Logo uploaded successfully', logoUrl });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});


  router.delete('/delete/:bureauId', async (req, res) => {
    const { bureauId } = req.params;
    
    if (!bureauId) {
      return res.status(400).json({ message: 'Please provide a valid bureauId to delete.' });
    }
  
    console.log('Deleting bureau with ID:', bureauId); // Debugging line
    
    try {
      const deleteQuery = 'DELETE FROM bureau_profiles WHERE id = ?'; // Ensure the column name is correct
      db.query(deleteQuery, [bureauId], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Server error. Please try again later.' });
        }
  
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Bureau not found or already deleted.' });
        }
  
        res.status(200).json({ message: 'Bureau deleted successfully.' });
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Server error. Please try again.' });
    }
  });
  
  
module.exports = router;
