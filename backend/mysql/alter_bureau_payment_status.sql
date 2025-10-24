-- Alter bureau_profiles table to make paymentStatus field nullable
ALTER TABLE bureau_profiles MODIFY COLUMN paymentStatus INT NULL;

-- Optional: Add a comment to document the change
ALTER TABLE bureau_profiles MODIFY COLUMN paymentStatus INT NULL COMMENT 'Payment status - can be NULL for new bureaus'; 