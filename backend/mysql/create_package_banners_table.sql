-- Create package_banners table
CREATE TABLE IF NOT EXISTS package_banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_path VARCHAR(500) NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX idx_package_banners_status ON package_banners(status);
CREATE INDEX idx_package_banners_created_at ON package_banners(created_at); 