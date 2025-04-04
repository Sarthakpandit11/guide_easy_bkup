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

interface SigninRequestBody {
  email: string;
  password: string;
}

interface SigninResponse {
  user?: Omit<User, 'password'>;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SigninResponse>
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
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body as SigninRequestBody;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    let connection;
    try {
      connection = await connectToDatabase();
      
      // Find user by email
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (!Array.isArray(users) || users.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = users[0] as User;

      // Compare passwords
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Remove password from user object before sending
      const { password: _, ...userWithoutPassword } = user;

      return res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database operation failed' });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
} 