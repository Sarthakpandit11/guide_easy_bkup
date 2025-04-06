import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5001;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Make sure this matches your MySQL root password
  database: process.env.DB_NAME || 'mydatabase',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

console.log('Database configuration:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

// Create a connection pool with error handling
const pool = mysql.createPool(dbConfig);

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    // Test the connection
    return connection.query('SELECT 1')
      .then(() => {
        console.log('Database connection test successful');
        connection.release();
      })
      .catch(err => {
        console.error('Database connection test failed:', err);
        connection.release();
        throw err;
      });
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit if database connection fails
  });

// Add error handler for the pool
pool.on('error', (err) => {
  console.error('Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('Database has too many connections.');
  }
  if (err.code === 'ECONNREFUSED') {
    console.error('Database connection was refused.');
  }
});

// Health check endpoint
app.get('/api/health-check', (req, res) => {
  res.status(200).json({ status: 'ok', database: 'connected' });
});

// Auth endpoint
app.post('/api/auth.php', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    console.log('Login attempt for email:', email);
    console.log('Password length:', password.length);
    
    // Get a connection from the pool
    const connection = await pool.getConnection();
    
    try {
      // Find user by email
      const [rows] = await connection.execute(
        'SELECT id, full_name, email, password, phone_number, role FROM users WHERE email = ?',
        [email]
      );
      
      if (rows.length === 0) {
        console.log('No user found with email:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const user = rows[0];
      console.log('User found:', {
        id: user.id,
        email: user.email,
        role: user.role,
        passwordHash: user.password,
        passwordHashLength: user.password.length
      });
      
      // Check if the password hash is valid
      if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$') && !user.password.startsWith('$2y$')) {
        console.log('Password hash is not a valid bcrypt hash');
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Verify password using bcryptjs
      console.log('Attempting to verify password with bcrypt.compare');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password verification result:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('Password verification failed for user:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Format user data for response
      const [firstName, ...lastNameParts] = user.full_name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      const formattedUser = {
        id: user.id,
        email: user.email,
        role: user.role.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        phone_number: user.phone_number,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Formatted user data:', formattedUser);
      console.log('User role:', formattedUser.role);
      
      return res.status(200).json({ user: formattedUser });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Profile update endpoint
app.get('/api/profile/update', async (req, res) => {
  let connection;
  try {
    const userId = req.query.id;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    connection = await pool.getConnection();
    
    // Fetch user profile
    const [users] = await connection.execute(
      'SELECT id, full_name, email, phone_number, role FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user: users[0] });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

app.put('/api/profile/update', async (req, res) => {
  let connection;
  try {
    const userId = req.query.id;
    const { full_name, email, phone_number } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Validate required fields
    if (!full_name || !email || !phone_number) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone number
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phone_number)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    connection = await pool.getConnection();

    // Check if email is already taken by another user
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE email = ? AND id != ?',
      [email, userId]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already taken by another user' });
    }

    // Update user profile
    await connection.execute(
      'UPDATE users SET full_name = ?, email = ?, phone_number = ? WHERE id = ?',
      [full_name, email, phone_number, userId]
    );

    // Fetch updated user data
    const [users] = await connection.execute(
      'SELECT id, full_name, email, phone_number, role FROM users WHERE id = ?',
      [userId]
    );

    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: users[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

// Password change endpoint
app.post('/api/profile/change-password', async (req, res) => {
  let connection;
  try {
    const { id, current_password, new_password } = req.body;

    console.log('Change password request received:', { id });

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (new_password.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    connection = await pool.getConnection();

    // Get user's current password hash
    const [users] = await connection.execute(
      'SELECT password FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];

    // Verify current password
    const isPasswordValid = await bcrypt.compare(current_password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    // Update password
    await connection.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  let connection;
  try {
    const { fullName, email, password, phoneNumber, role } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Validate phone number
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    connection = await pool.getConnection();

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await connection.execute(
      'INSERT INTO users (full_name, email, password, phone_number, role) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, hashedPassword, phoneNumber, role]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

// Signin endpoint
app.post('/api/signin', async (req, res) => {
  let connection;
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    // Validate role
    const validRoles = ['Admin', 'Tourist', 'Guide'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    connection = await pool.getConnection();

    // Find user by email AND role (matching the PHP implementation)
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      [email, role]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'No user found with this role and email!' });
    }

    const user = users[0];

    // For development purposes, allow plain text passwords like in the PHP example
    // In production, you should use bcrypt.compare
    if (process.env.NODE_ENV === 'development') {
      if (user.password !== password) {
        return res.status(401).json({ error: 'Incorrect password!' });
      }
    } else {
      // In production, use bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Incorrect password!' });
      }
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    // Log the user object for debugging
    console.log('User logged in:', { 
      id: userWithoutPassword.id, 
      email: userWithoutPassword.email, 
      role: userWithoutPassword.role 
    });

    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

// Auth check endpoint
app.get('/api/auth/check', async (req, res) => {
  let connection;
  try {
    // Get user ID from session or token (for now, we'll use a simple approach)
    // In a real app, you would use sessions or JWT tokens
    const userId = req.query.userId || req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    connection = await pool.getConnection();
    
    // Find user by ID
    const [users] = await connection.execute(
      'SELECT id, full_name, email, phone_number, role FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const user = users[0];
    
    // Format user data
    const formattedUser = {
      id: user.id,
      email: user.email,
      role: user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase(),
      first_name: user.full_name.split(' ')[0],
      last_name: user.full_name.split(' ').slice(1).join(' '),
      phone_number: user.phone_number
    };
    
    res.status(200).json({ user: formattedUser });
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release();
  }
});

// Admin endpoints
app.get('/api/admin/users.php', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
    
    // Fetch all users from the database
    const [rows] = await connection.execute(
      'SELECT id, full_name, email, role, phone_number FROM users ORDER BY full_name ASC'
    );
    
    // Release the connection
    connection.release();
    
    // Format user data
    const users = rows.map(user => ({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      phone_number: user.phone_number
    }));
    
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

// Get all guides
app.get('/api/admin/guides.php', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [guides] = await connection.query(`
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.phone_number,
        u.status,
        u.created_at,
        g.id_proof,
        g.certification,
        g.experience
      FROM users u
      LEFT JOIN guides g ON u.id = g.user_id
      WHERE u.role = 'guide'
      ORDER BY u.created_at DESC
    `);
    connection.release();
    
    res.json({ guides });
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ error: 'Failed to fetch guides' });
  }
});

// Update guide status
app.patch('/api/admin/guides.php', async (req, res) => {
  const { id } = req.query;
  const { status } = req.body;
  
  if (!id || !status) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  
  try {
    const connection = await pool.getConnection();
    
    // Update user status
    await connection.query(
      'UPDATE users SET status = ? WHERE id = ? AND role = "guide"',
      [status, id]
    );
    
    // If approved, create guide record if it doesn't exist
    if (status === 'approved') {
      const [existingGuide] = await connection.query(
        'SELECT id FROM guides WHERE user_id = ?',
        [id]
      );
      
      if (existingGuide.length === 0) {
        await connection.query(
          'INSERT INTO guides (user_id) VALUES (?)',
          [id]
        );
      }
    }
    
    connection.release();
    res.json({ message: 'Guide status updated successfully' });
  } catch (error) {
    console.error('Error updating guide status:', error);
    res.status(500).json({ error: 'Failed to update guide status' });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve the React application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Database configuration:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database,
    port: dbConfig.port
  });
}); 