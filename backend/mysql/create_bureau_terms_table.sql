-- Create bureau_terms table for managing terms and conditions
CREATE TABLE IF NOT EXISTS `bureau_terms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT 'Terms and Conditions',
  `content` longtext NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default terms
INSERT INTO `bureau_terms` (`title`, `content`, `is_active`) VALUES 
('Terms and Conditions', '<h2>Welcome to Matrimony Studio</h2><p>These terms and conditions govern your use of our matrimony services. By using our platform, you agree to these terms.</p><h3>1. User Conduct</h3><p>Users must provide accurate information and behave respectfully towards other users.</p><h3>2. Privacy</h3><p>We protect your personal information as outlined in our privacy policy.</p><h3>3. Service Usage</h3><p>Our services are for legitimate matrimony purposes only.</p>', 1); 