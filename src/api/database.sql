-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS mydatabase;

-- Use the database
USE mydatabase;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    role ENUM('Admin', 'Tourist', 'Guide') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add indexes for better performance
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);

-- Insert sample users
-- Note: Passwords are hashed with bcrypt, these are just examples
-- In a real application, you would use password_hash() in PHP to hash passwords

-- Admin user (password: admin123)
INSERT INTO users (full_name, email, password, phone_number, role)
VALUES ('Admin User', 'admin@example.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwO.eH7J0xX7UZqX5qX5qX5qX5qX5qX5q', '+1234567890', 'Admin');

-- Guide user (password: guide123)
INSERT INTO users (full_name, email, password, phone_number, role)
VALUES ('Guide User', 'guide@example.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwO.eH7J0xX7UZqX5qX5qX5qX5qX5qX5q', '+1234567891', 'Guide');

-- Tourist user (password: tourist123)
INSERT INTO users (full_name, email, password, phone_number, role)
VALUES ('Tourist User', 'tourist@example.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwO.eH7J0xX7UZqX5qX5qX5qX5qX5qX5q', '+1234567892', 'Tourist');

-- Migration script for existing data (if needed)
-- This section can be uncommented if you need to migrate data from an old database
/*
-- Check if the old database exists
SET @old_db_exists = (SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name = 'tourist_db');

-- If the old database exists, migrate the data
SET @migration_sql = IF(@old_db_exists > 0,
    CONCAT('
    -- Insert data from tourist_db.users to mydatabase.users
    INSERT INTO mydatabase.users (full_name, email, password, phone_number, role)
    SELECT 
        CONCAT(first_name, " ", COALESCE(last_name, "")) AS full_name,
        email,
        password,
        COALESCE(phone_number, "") AS phone_number,
        role
    FROM tourist_db.users
    ON DUPLICATE KEY UPDATE
        full_name = VALUES(full_name),
        phone_number = VALUES(phone_number),
        role = VALUES(role)
    '),
    'SELECT "No old database found" AS message'
);

-- Execute the migration SQL
PREPARE stmt FROM @migration_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
*/ 