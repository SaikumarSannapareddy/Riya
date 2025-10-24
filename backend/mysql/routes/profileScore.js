const express = require('express');
const mysql = require('mysql2');
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

// Route to get profile checkpoints
router.post('/get-checkpoints', (req, res) => {
  const { bureauId } = req.body;

  if (!bureauId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Bureau ID is required'  
    });
  }

  // Check bureau_profiles table for required fields
  const checkProfileQuery = 'SELECT bureauName, mobileNumber, about, location, email, navbarLogo FROM bureau_profiles WHERE bureauId = ?';
  
  db.query(checkProfileQuery, [bureauId], (err, profileResults) => {
    if (err) {
      console.error('Error checking profile fields:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error while checking profile fields' 
      });
    }
 
    if (profileResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bureau profile not found'
      });
    }

    const profile = profileResults[0];
    
    // Check edit-website checkpoint (all required fields must be present)
    const editWebsite = !!(profile.bureauName && profile.mobileNumber && profile.about && profile.location && profile.email);
    
    // Check navbarLogo checkpoint
    const navbarLogo = !!(profile.navbarLogo && profile.navbarLogo !== null && profile.navbarLogo !== '');

    // Check slider_images checkpoint
    const checkSliderQuery = 'SELECT COUNT(*) as count FROM slider_images WHERE bureauId = ?';
    
    db.query(checkSliderQuery, [bureauId], (err, sliderResults) => {
      if (err) {
        console.error('Error checking slider images:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Database error while checking slider images' 
        });
      }

      const sliderImages = sliderResults.length > 0 && sliderResults[0].count > 0;

      // Check location checkpoint
      const checkLocationQuery = 'SELECT COUNT(*) as count FROM location WHERE bureau_id = ?';

      db.query(checkLocationQuery, [bureauId], (err, locationResults) => {
        if (err) {
          console.error('Error checking location:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error while checking location'
          });
        }

        const locationCheckpoint = locationResults.length > 0 && locationResults[0].count > 0;

        // Check profiles checkpoint
        const checkProfilesQuery = 'SELECT COUNT(*) as count FROM profiles WHERE bureau_id = ?';

        db.query(checkProfilesQuery, [bureauId], (err, profilesResults) => {
          if (err) {
            console.error('Error checking profiles:', err);
            return res.status(500).json({
              success: false,
              message: 'Database error while checking profiles'
            });
          }

          const profilesCheckpoint = profilesResults.length > 0 && profilesResults[0].count > 0;

          // Check terms_and_conditions checkpoint
          const checkTermsQuery = 'SELECT COUNT(*) as count FROM terms_and_conditions WHERE bureau_id = ?';

          db.query(checkTermsQuery, [bureauId], (err, termsResults) => {
            if (err) {
              console.error('Error checking terms_and_conditions:', err);
              return res.status(500).json({
                success: false,
                message: 'Database error while checking terms_and_conditions'
              });
            }

            const termsCheckpoint = termsResults.length > 0 && termsResults[0].count > 0;

            // Check success_stories checkpoint
            const checkSuccessQuery = 'SELECT COUNT(*) as count FROM success_stories';

            db.query(checkSuccessQuery, (err, successResults) => {
              if (err) {
                console.error('Error checking success_stories:', err);
                return res.status(500).json({
                  success: false,
                  message: 'Database error while checking success_stories'
                });
              }

              const successCheckpoint = successResults.length > 0 && successResults[0].count > 0;

              // Check testimonials2 checkpoint
              const checkTestimonialsQuery = 'SELECT COUNT(*) as count FROM testimonials2 WHERE bureau_id = ?';

              db.query(checkTestimonialsQuery, [bureauId], (err, testimonialsResults) => {
                if (err) {
                  console.error('Error checking testimonials2:', err);
                  return res.status(500).json({
                    success: false,
                    message: 'Database error while checking testimonials2'
                  });
                }

                const testimonialsCheckpoint = testimonialsResults.length > 0 && testimonialsResults[0].count > 0;

                // Check packages2 checkpoint
                const checkPackagesQuery = 'SELECT COUNT(*) as count FROM packages2 WHERE bureau_id = ?';

                db.query(checkPackagesQuery, [bureauId], (err, packagesResults) => {
                  if (err) {
                    console.error('Error checking packages2:', err);
                    return res.status(500).json({
                      success: false,
                      message: 'Database error while checking packages2'
                    });
                  }

                  const packagesCheckpoint = packagesResults.length > 0 && packagesResults[0].count > 0;

                  // Check services checkpoint
                  const checkServicesQuery = 'SELECT COUNT(*) as count FROM services WHERE bureau_id = ?';

                  db.query(checkServicesQuery, [bureauId], (err, servicesResults) => {
                    if (err) {
                      console.error('Error checking services:', err);
                      return res.status(500).json({
                        success: false,
                        message: 'Database error while checking services'
                      });
                    }

                    const servicesCheckpoint = servicesResults.length > 0 && servicesResults[0].count > 0;

                    // Return the checkpoints
                    res.json({
                      success: true,
                      checkpoints: {
                        editWebsite: editWebsite,
                        navbarLogo: navbarLogo,
                        sliderImages: sliderImages,
                        location: locationCheckpoint,
                        profiles: profilesCheckpoint,
                        terms_and_conditions: termsCheckpoint,
                        success_stories: successCheckpoint,
                        testimonials2: testimonialsCheckpoint,
                        packages2: packagesCheckpoint,
                        services: servicesCheckpoint
                      },
                      message: 'Checkpoints retrieved successfully'
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

module.exports = router;
