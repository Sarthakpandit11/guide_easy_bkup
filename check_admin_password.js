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

async function checkAdminPassword() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    // Get the admin user's password hash
    const [rows] = await connection.execute(
      'SELECT id, email, password, role FROM users WHERE email = ?',
      ['sarthakpunit@gmail.com']
    );
    
    if (rows.length === 0) {
      console.log('Admin user not found');
      return;
    }
    
    const admin = rows[0];
    console.log('Admin user found:');
    console.log('ID:', admin.id);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Password hash:', admin.password);
    console.log('Password hash length:', admin.password.length);
    
    // Check if the password hash is valid
    if (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$') || admin.password.startsWith('$2y$')) {
      console.log('Password hash appears to be a valid bcrypt hash');
    } else {
      console.log('Password hash does not appear to be a valid bcrypt hash');
    }
  } catch (error) {
    console.error('Error checking admin password:', error);
  } finally {
    await connection.end();
  }
}

checkAdminPassword(); 