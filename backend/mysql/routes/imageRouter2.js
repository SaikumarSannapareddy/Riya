const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');

// Serve static files from each directory
router.use('/bannerimages', express.static(path.join(__dirname, '..', 'bannerimages')));
router.use('/galleryimages', express.static(path.join(__dirname, '..', 'galleryimages')));
router.use('/homebanners', express.static(path.join(__dirname, '..', 'homebanners')));
router.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
router.use('/logo', express.static(path.join(__dirname, '..', 'logo')));
router.use('/thumbnails', express.static(path.join(__dirname, '..', 'thumbnails')));

// Route to serve files dynamically from each directory
router.get('/:folder/:imageName', (req, res) => {
  const { folder, imageName } = req.params;

  // Restrict folder access to the specified directories only
  const allowedFolders = ['bannerimages', 'galleryimages', 'homebanners', 'uploads', 'logo', 'thumbnails'];
  if (!allowedFolders.includes(folder)) {
    return res.status(403).json({ message: 'Access to this folder is not allowed.' });
  }

  // Resolve the path dynamically based on the folder and image name
  const imagePath = path.join(__dirname, '..', folder, imageName);

  // Send the file or return a 404 error if not found
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).json({ message: 'Image not found' });
    }
  });
});

// Serve package_banners images
router.get('/package_banners/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'package_banners', filename);
  
  console.log('ImageRouter - Requested filename:', filename);
  console.log('ImageRouter - File path:', filePath);
  console.log('ImageRouter - File exists:', fs.existsSync(filePath));
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log('ImageRouter - File not found:', filePath);
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
  
  console.log('ImageRouter - Serving file:', filePath, 'with content-type:', contentType);
  res.setHeader('Content-Type', contentType);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.sendFile(filePath);
});

// Debug route to check package_banners folder
router.get('/debug/package_banners', (req, res) => {
  const folderPath = path.join(__dirname, '..', 'package_banners');
  console.log('ImageRouter - Checking folder:', folderPath);
  console.log('ImageRouter - Folder exists:', fs.existsSync(folderPath));
  
  if (fs.existsSync(folderPath)) {
    try {
      const files = fs.readdirSync(folderPath);
      console.log('ImageRouter - Files in folder:', files);
      res.json({ 
        folderExists: true, 
        folderPath: folderPath,
        files: files 
      });
    } catch (error) {
      console.error('ImageRouter - Error reading folder:', error);
      res.status(500).json({ error: 'Error reading folder', details: error.message });
    }
  } else {
    res.json({ 
      folderExists: false, 
      folderPath: folderPath 
    });
  }
});

module.exports = router;
