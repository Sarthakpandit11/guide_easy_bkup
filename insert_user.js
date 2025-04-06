import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydatabase',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// User details
const userDetails = {
  firstName: 'Sarthak',
  lastName: 'Punit',
  email: 'sarthakpunit@gmail.com',
  password: 'PunitS!5thak',
  phoneNumber: '9828854300',
  role: 'Admin'
};

async function insertUser() {
  let connection;
  try {
    // Create a connection pool
    const pool = mysql.createPool(dbConfig);
    
    // Get a connection from the pool
    connection = await pool.getConnection();
    console.log('Database connected successfully');
    
    // Check if user already exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [userDetails.email]
    );
    
    if (existingUsers.length > 0) {
      console.log('User already exists with this email');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    
    // Combine first and last name
    const fullName = `${userDetails.firstName} ${userDetails.lastName}`;
    
    // Insert new user
    const [result] = await connection.query(
      'INSERT INTO users (full_name, email, password, phone_number, role) VALUES (?, ?, ?, ?, ?)',
      [fullName, userDetails.email, hashedPassword, userDetails.phoneNumber, userDetails.role]
    );
    
    console.log('User inserted successfully with ID:', result.insertId);
  } catch (error) {
    console.error('Error inserting user:', error);
  } finally {
    if (connection) {
      connection.release();
      console.log('Database connection released');
    }
  }
}

// Execute the function
insertUser(); 