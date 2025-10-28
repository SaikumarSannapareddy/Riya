const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../Models/user-register"); // Assuming this is the User model

const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save uploaded files to "uploads" directory
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${timestamp}${fileExtension}`; // Use current timestamp + file extension for the name
    cb(null, fileName); // Save file with generated name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Increase limit to 50MB
  fileFilter: (req, file, cb) => {
    console.log("File Received:", file);
    cb(null, true);
  }
});


// Image upload endpoint
router.put("/update-image/:userId", upload.single("image"), async (req, res) => {
  // Check if the image is uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No image provided" }); // Handle case where no image is uploaded
  }

  // Extract the userId from the request params
  const userId = req.params.userId;
  const fileName = req.file.filename; // Only use the file name (no path)

  try {
    // Find the user by ID and update the image filename
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's image filename (not the full path)
    user.image = fileName;

    // Save the updated user document
    await user.save();

    // Return a success response with the filename
    res.json({
      message: "Image uploaded and saved successfully",
      userId,
      image: user.image, // The saved image filename
    });
  } catch (error) {
    console.error("Error saving image to the database:", error);
    res.status(500).json({ error: "Failed to save image details" });
  }

  console.log("Request Params:", req.params);
  console.log("Uploaded File:", req.file);
});

module.exports = router;


