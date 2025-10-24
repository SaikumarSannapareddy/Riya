const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../Models/user-register"); // Import User model directly

const router = express.Router();

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Define route for handling file upload
router.put("/:userId/gallery", upload.array("images[]", 5), async (req, res) => {
    const { userId } = req.params;
  
    if (!req.files) {
      return res.status(400).json({ error: "No files uploaded." });
    }
  
    try {
      const filePaths = req.files.map(file => file.path);
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      user.gallery.push(...filePaths);
      await user.save();
  
      res.status(200).json({ message: "Gallery updated successfully", gallery: user.gallery });
    } catch (error) {
      console.error("Error updating gallery:", error);
      res.status(500).json({ error: "Server error occurred" });
    }
  });
  

module.exports = router;
