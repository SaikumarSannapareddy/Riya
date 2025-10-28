const express = require("express");
const app = express();

const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const userRoutes = require('./Routes/UserRoute.js'); // Import your user route module
const uploadRoutes = require("./Routes/upload.js");
const userImage = require("./Routes/Userimage.js");
const User = require("./Routes/User.js");
const Interest = require("./Routes/Interest.js");
const Shortlist = require("./Routes/Shortlist.js");
const Visibletoall = require("./Routes/visibletoall.js");
const settingother = require("./Routes/settingsother.js");
const Reports = require("./Routes/Reports.js");
const InterestbyBureau = require("./Routes/Interestsbybureau.js");
const Dontshowagain = require("./Routes/Dontshowagain.js");
const MyInterests = require("./Routes/MyInterests.js");
const PackageRoutes = require("./Routes/PackageRoute.js");
const ChatMessageRoutes = require("./Routes/ChatMessageRoute.js");
const ProfileScore = require('./Routes/profileScore.js');
const ProfileCompleteness = require('./Routes/profileCompleteness.js');
const BureauProfileCounts = require('./Routes/bureauProfileCounts.js');

// CORS configuration
const corsOptions = {
    origin: ["http://localhost:3300", "http://localhost:5174"], // your frontend domains

  // origin: ["*"], // Allow all and the specific domain
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow cookies to be sent
};

// Middleware setup
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
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
app.use('/api', User);
app.use('/api', Interest);
app.use('/api/shortlist', Shortlist);
app.use('/api/profiles', Visibletoall);
app.use('/api', settingother);
app.use('/api',Reports);
app.use('/api', InterestbyBureau);
app.use('/api', Dontshowagain);
app.use('/api', MyInterests);
app.use('/api', PackageRoutes.router);
app.use('/api', ChatMessageRoutes);
app.use('/api/profile-score', ProfileScore);
app.use('/api', ProfileCompleteness);
app.use('/api', BureauProfileCounts);

// Set up automatic expired package checking (run every hour)
setInterval(() => {
  PackageRoutes.checkExpiredPackagesAutomatically();
}, 60 * 60 * 1000); // Check every hour

// Also check on server startup
PackageRoutes.checkExpiredPackagesAutomatically();

// If using body-parser (for older Express versions)
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Serve static files (uploaded images)
app.use("/uploads", express.static("uploads"));

// Start server
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
});
