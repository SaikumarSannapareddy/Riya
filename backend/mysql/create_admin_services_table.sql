CREATE TABLE IF NOT EXISTS admin_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data for testing
INSERT INTO admin_services (title, description, status) VALUES 
('Premium Matchmaking', 'Our premium matchmaking service uses advanced algorithms and personal consultation to find your perfect match. We consider compatibility factors like values, lifestyle, and future goals.', 'active'),
('Family Consultation', 'We provide comprehensive family consultation services to ensure both families are comfortable and aligned with the matchmaking process.', 'active'),
('Background Verification', 'Thorough background verification service to ensure the authenticity and credibility of all profiles in our database.', 'active'),
('Wedding Planning Support', 'Complete wedding planning support from venue selection to vendor coordination, making your special day perfect.', 'active'),
('Relationship Counseling', 'Professional relationship counseling services to help couples build strong, lasting relationships.', 'active'),
('Cultural Compatibility', 'Specialized services focusing on cultural and traditional compatibility for meaningful long-term relationships.', 'active'); 