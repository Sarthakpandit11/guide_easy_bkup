import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  database: process.env.DB_NAME || 'mydatabase',
};

async function setupDatabase() {
  let connection;
  try {
    // Create a connection pool
    const pool = mysql.createPool(dbConfig);
    
    // Get a connection from the pool
    connection = await pool.getConnection();
    console.log('Database connected successfully');
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'tourist_db'}`);
    console.log(`Database ${process.env.DB_NAME || 'tourist_db'} created or already exists`);
    
    // Close the current connection
    connection.release();
    
    // Create a new connection with the database selected
    const dbPool = mysql.createPool({
      ...dbConfig,
      database: process.env.DB_NAME || 'tourist_db'
    });
    
    // Get a connection from the new pool
    connection = await dbPool.getConnection();
    console.log(`Connected to database ${process.env.DB_NAME || 'tourist_db'}`);
    
    // Create users table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        role ENUM('Admin', 'Guide', 'Tourist') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists');
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      connection.release();
      console.log('Database connection released');
    }
  }
}

// Execute the function
setupDatabase(); 