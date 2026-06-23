const bcrypt = require('bcryptjs');
const { findUserByEmail, createUser, findUserById } = require('../models/user.model');
const { generateToken } = require('../utils/jwt.util');

// POST /api/auth/register
// Creates a new user account. New accounts are "member" by default.
async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if a user already exists with this email
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    // Hash the password before storing it (never store plain text passwords)
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user (role_id 3 = member, set as default in the DB)
    const userId = await createUser({ name, email, passwordHash });

    const user = await findUserById(userId);
    const token = generateToken(user);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Something went wrong while creating the account' });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the submitted password with the stored hash
    const passwordMatches = await bcrypt.compare(password, existingUser.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = await findUserById(existingUser.id);
    const token = generateToken(user);

    return res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Something went wrong while logging in' });
  }
}

// GET /api/auth/me
// Returns the currently logged-in user's profile (requires a valid token)
async function getProfile(req, res) {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (err) {
    console.error('Profile error:', err);
    return res.status(500).json({ message: 'Something went wrong fetching profile' });
  }
}

module.exports = { register, login, getProfile };
