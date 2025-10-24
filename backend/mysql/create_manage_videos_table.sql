-- Create manage_videos table for admin video management
CREATE TABLE IF NOT EXISTS `manage_videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `video_link` varchar(500) NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS `idx_manage_videos_status` ON `manage_videos` (`status`);
CREATE INDEX IF NOT EXISTS `idx_manage_videos_created_at` ON `manage_videos` (`created_at`);
CREATE INDEX IF NOT EXISTS `idx_manage_videos_updated_at` ON `manage_videos` (`updated_at`);

-- Insert sample data (optional)
INSERT INTO `manage_videos` (`title`, `description`, `video_link`, `status`) VALUES
('Welcome to Matrimony Studio', 'Learn about our matrimony services and how we help people find their perfect match.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'active'),
('How to Create Your Profile', 'Step-by-step guide on creating your matrimony profile with all necessary details.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'active'),
('Finding Your Perfect Match', 'Tips and tricks for finding your ideal life partner through our platform.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'active'); 