import mysql from 'mysql2/promise';

export async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

// Test the connection
export async function testConnection() {
  try {
    const connection = await connectToDatabase();
    await connection.execute('SELECT 1');
    console.log('Database connection successful!');
    await connection.end();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
} 