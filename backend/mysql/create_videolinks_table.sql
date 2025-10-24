-- Create videolinks table if it doesn't exist
CREATE TABLE IF NOT EXISTS `videolinks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `video_link` varchar(500) NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS `idx_videolinks_created_at` ON `videolinks` (`created_at`); 