/**
 * Mindpex Backend Server
 *
 * Username + password authentication (no email).
 * Uses Supabase (Postgres) with bcrypt for password hashing.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;
const SALT_ROUNDS = 10;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));

app.use(express.json());

// ============================================
// AUTH ROUTES
// ============================================

/**
 * POST /auth/signup
 *
 * Request: { username, password }
 * Response: { success, user, token } or { success: false, error, code }
 */
app.post('/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    if (username.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Username must be at least 2 characters'
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 4 characters'
      });
    }

    // Check if username exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Username already taken',
        code: 'USERNAME_EXISTS'
      });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        username,
        password_hash,
        display_name: username,
        intro_completed: false
      })
      .select('id, username, display_name, intro_completed, created_at')
      .single();

    if (insertError) {
      console.error('Signup error:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create account'
      });
    }

    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      user: newUser,
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * POST /auth/login
 *
 * Request: { username, password }
 * Response: { success, user, token } or { success: false, error }
 */
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, username, password_hash, display_name, intro_completed, created_at')
      .eq('username', username)
      .single();

    if (fetchError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password'
      });
    }

    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * GET /auth/me
 *
 * Requires: Authorization: Bearer <token>
 * Response: { success, user }
 */
app.get('/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, display_name, intro_completed, created_at')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    console.error('Auth check error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * PUT /auth/intro-complete
 *
 * Mark intro as completed for user.
 * Requires: Authorization: Bearer <token>
 */
app.put('/auth/intro-complete', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
      .from('users')
      .update({ intro_completed: true })
      .eq('id', decoded.userId)
      .select('id, username, display_name, intro_completed, created_at')
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Intro complete error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * PUT /auth/profile
 *
 * Update display_name.
 * Requires: Authorization: Bearer <token>
 */
app.put('/auth/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { display_name } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .update({ display_name })
      .eq('id', decoded.userId)
      .select('id, username, display_name, intro_completed, created_at')
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Mindpex server running on http://localhost:${PORT}`);
});
