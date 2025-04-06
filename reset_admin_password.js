import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydatabase',
  port: 3306
};

async function resetAdminPassword() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // Hash the new password
    const password = 'admin123'; // Change this to your desired password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update the admin user's password
    await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, 'sarthakpunit@gmail.com']
    );
    
    console.log('Admin password has been reset successfully');
    console.log('New password:', password);
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await connection.end();
  }
}

resetAdminPassword(); 