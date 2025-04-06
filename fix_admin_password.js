import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydatabase',
  port: 3306
};

async function fixAdminPassword() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // Get the admin user
    const [rows] = await connection.execute(
      'SELECT id, email, password FROM users WHERE email = ?',
      ['sarthakpunit@gmail.com']
    );
    
    if (rows.length === 0) {
      console.log('Admin user not found');
      return;
    }
    
    const admin = rows[0];
    console.log('Current admin password hash:', admin.password);
    
    // Generate a new hash for the password "admin123"
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash('admin123', salt);
    
    // Update the password in the database
    await connection.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [newHash, admin.id]
    );
    
    console.log('Admin password updated successfully');
    console.log('New password hash:', newHash);
    
  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await connection.end();
  }
}

fixAdminPassword(); 