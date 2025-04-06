import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/db';
import bcrypt from 'bcryptjs';

interface User {
  id: number;
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  role: 'Tourist' | 'Guide';
  created_at: Date;
  updated_at: Date;
}

interface SignupRequestBody {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: 'Tourist' | 'Guide';
}

interface SignupResponse {
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignupResponse>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fullName, email, password, phoneNumber, role } = req.body as SignupRequestBody;

    // Input validation
    if (!fullName || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Phone number validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    let connection;
    try {
      connection = await connectToDatabase();

      // Check if user already exists
      const [existingUsers] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const [result] = await connection.execute(
        'INSERT INTO users (full_name, email, password, phone_number, role) VALUES (?, ?, ?, ?, ?)',
        [fullName, email, hashedPassword, phoneNumber, role]
      );

      if (!result) {
        throw new Error('Failed to insert user');
      }

      return res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database operation failed' });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
} 