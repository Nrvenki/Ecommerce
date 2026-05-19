// ======================================================
// middleware/auth.js — JWT Authentication Middleware
// ======================================================
// Verifies the JWT token from the Authorization header.
// If valid, attaches the decoded user info to req.user.
// Protects routes that require authentication.
// ======================================================

const jwt = require('jsonwebtoken');

/**
 * protect - Middleware to protect routes
 * Expects header: Authorization: Bearer <token>
 */
const protect = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized — no token provided',
      });
    }

    // Get the token part (after "Bearer ")
    const token = authHeader.split(' ')[1];

    // Verify the token using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to the request object
    req.user = { id: decoded.id, email: decoded.email };

    next(); // Continue to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — invalid or expired token',
    });
  }
};

module.exports = { protect };
