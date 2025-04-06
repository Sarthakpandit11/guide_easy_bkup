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

// Admin user details
const adminDetails = {
  firstName: 'Sarthak',
  lastName: 'Punit',
  email: 'sarthakpunit@gmail.com',
  password: 'PunitS!5thak',
  phoneNumber: '9828854300',
  role: 'Admin'
};

async function mergeAdminUser() {
  let connection;
  try {
    // Create a connection pool
    const pool = mysql.createPool(dbConfig);
    
    // Get a connection from the pool
    connection = await pool.getConnection();
    console.log('Database connected successfully');
    
    // Check if admin user already exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [adminDetails.email]
    );
    
    if (existingUsers.length > 0) {
      console.log('Admin user already exists with this email');
      
      // Check if the existing user is already an admin
      const existingUser = existingUsers[0];
      if (existingUser.role === 'Admin') {
        console.log('User is already an admin');
      } else {
        // Update the user's role to Admin
        await connection.query(
          'UPDATE users SET role = ? WHERE email = ?',
          [adminDetails.role, adminDetails.email]
        );
        console.log('User role updated to Admin');
      }
      
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminDetails.password, 10);
    
    // Combine first and last name
    const fullName = `${adminDetails.firstName} ${adminDetails.lastName}`;
    
    // Insert admin user
    const [result] = await connection.query(
      'INSERT INTO users (full_name, email, password, phone_number, role) VALUES (?, ?, ?, ?, ?)',
      [fullName, adminDetails.email, hashedPassword, adminDetails.phoneNumber, adminDetails.role]
    );
    
    console.log('Admin user inserted successfully with ID:', result.insertId);
  } catch (error) {
    console.error('Error merging admin user:', error);
  } finally {
    if (connection) {
      connection.release();
      console.log('Database connection released');
    }
  }
}

// Execute the function
mergeAdminUser(); 