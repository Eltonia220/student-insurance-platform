import express from 'express';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import models from '../models/index.js'; // Note the .js extension
import { textEncoder } from '../utils/helpers.js'; // Helper for JWT

const router = express.Router();
const { User } = models;

// JWT Configuration
const secretKey = process.env.JWT_SECRET;
if (!secretKey) throw new Error('JWT_SECRET is not configured');
const secretKeyEncoded = textEncoder.encode(secretKey);
const tokenExpiration = process.env.JWT_EXPIRES_IN || '2h';

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Passwords do not match' 
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already in use'
      });
    }

    // Create user (password auto-hashed via model hook)
    const user = await User.create({ name, email, password });

    // Generate JWT
    const token = await new SignJWT({ 
      userId: user.id,
      email: user.email,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(tokenExpiration)
      .sign(secretKeyEncoded);

    // Set HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    });

    // Return user data (excluding sensitive fields)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.status(201).json({
      success: true,
      data: { user: userResponse }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('; ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      role: user.role
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(tokenExpiration)
      .sign(secretKeyEncoded);

    // Set cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000
    });

    // Return user data
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({
      success: true,
      data: { user: userResponse }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Logout Route
router.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Verify Route (for checking auth state)
router.get('/verify', async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.json({ isAuthenticated: false });
    }

    const { payload } = await jwtVerify(token, secretKeyEncoded);
    const user = await User.findByPk(payload.userId, {
      attributes: ['id', 'name', 'email', 'role']
    });

    if (!user) {
      return res.json({ isAuthenticated: false });
    }

    res.json({ 
      isAuthenticated: true,
      user 
    });
  } catch (error) {
    res.json({ isAuthenticated: false });
  }
});

export default router;