// ======================================================
// controllers/authController.js — Auth Business Logic
// ======================================================
// Handles user registration and login.
// Registration: validates input, creates user, returns JWT.
// Login: validates credentials, returns JWT on success.
// ======================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * generateToken - Creates a JWT for the given user ID and email
 * @param {string} id   - MongoDB user _id
 * @param {string} email - User's email
 * @returns {string} JWT token valid for 30 days
 */
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ==============================================
// POST /api/auth/register
// Register a new user
// ==============================================
const register = async (req, res) => {
  try {
    const { name, email, mobile, age, country, password } = req.body;

    // --- Validation ---
    if (!name || !email || !mobile || !age || !country || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create new user (password is hashed via pre-save hook)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobile,
      age: Number(age),
      country,
      password,
    });

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        age: user.age,
        country: user.country,
        token,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

// ==============================================
// POST /api/auth/login
// Login an existing user
// ==============================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validation ---
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        age: user.age,
        country: user.country,
        token,
      },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// ==============================================
// GET /api/auth/profile
// Get logged-in user's profile (protected)
// ==============================================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = { register, login, getProfile };
