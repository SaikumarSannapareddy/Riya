const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
require('dotenv').config();
const userRoutes = require('./Routes/UserRoute.js'); // Import your user route module
const uploadRoutes = require("./Routes/upload.js");
const userImage = require("./Routes/Userimage.js")
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // Replaces bodyParser.json() as it's natively supported
app.use(cookieParser());

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('Mongo URI is missing!');
  process.exit(1);
}
app.use("/api/usergallery", uploadRoutes);

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define your routes here
app.use('/api', userRoutes); 
app.use('/api', userImage); 


// Serve static files (uploaded images)
app.use("/uploads", express.static("uploads"));
// Start server
const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});