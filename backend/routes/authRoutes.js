// ======================================================
// routes/authRoutes.js — Authentication Routes
// ======================================================
// POST /api/auth/register  — Create new user account
// POST /api/auth/login     — Login and get JWT token
// GET  /api/auth/profile   — Get user profile (protected)
// ======================================================

const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route — requires valid JWT
router.get('/profile', protect, getProfile);

module.exports = router;
