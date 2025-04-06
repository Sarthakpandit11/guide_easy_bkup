import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function copyAdminUser() {
  let sourceConnection;
  let targetConnection;
  
  try {
    // Create connection pools
    const sourcePool = mysql.createPool({ ...dbConfig, database: 'mydatabase' });
    const targetPool = mysql.createPool({ ...dbConfig, database: 'mydatabase' });
    
    // Get connections from the pools
    sourceConnection = await sourcePool.getConnection();
    targetConnection = await targetPool.getConnection();
    
    console.log('Database connections established successfully');
    
    // Get admin user from source database
    const [adminUsers] = await sourceConnection.query(
      'SELECT * FROM users WHERE email = ?',
      ['sarthakpunit@gmail.com']
    );
    
    if (adminUsers.length === 0) {
      console.log('Admin user not found in source database');
      return;
    }
    
    const adminUser = adminUsers[0];
    
    // Insert admin user into target database
    const [result] = await targetConnection.query(
      'INSERT INTO users (full_name, email, password, phone_number, role) VALUES (?, ?, ?, ?, ?)',
      [
        adminUser.full_name,
        adminUser.email,
        adminUser.password,
        adminUser.phone_number,
        'Admin' // Explicitly set role as Admin
      ]
    );
    
    console.log('Admin user copied successfully with ID:', result.insertId);
    
  } catch (error) {
    console.error('Error copying admin user:', error);
  } finally {
    if (sourceConnection) {
      sourceConnection.release();
    }
    if (targetConnection) {
      targetConnection.release();
    }
    console.log('Database connections released');
  }
}

// Execute the function
copyAdminUser(); 