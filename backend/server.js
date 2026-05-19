// ======================================================
// server.js — Express Server Entry Point
// ======================================================
// Main server file that:
//   1. Loads environment variables
//   2. Connects to MongoDB Atlas
//   3. Sets up CORS and JSON body parsing
//   4. Mounts all route modules
//   5. Starts listening on the configured port
// ======================================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Import route modules
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialize Express app
const app = express();

// ==============================================
// Middleware Configuration
// ==============================================

// Enable CORS for all origins (adjust in production)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ==============================================
// API Routes
// ==============================================

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🛍️ Boys Clothing E-Commerce API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
    },
  });
});

// Mount route modules
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// ==============================================
// 404 Handler — catch unmatched routes
// ==============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==============================================
// Global Error Handler
// ==============================================
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ==============================================
// Start Server
// ==============================================
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and then start the server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📡 API Base URL: http://localhost:${PORT}`);
    console.log(`📦 Products:     http://localhost:${PORT}/api/products`);
    console.log(`🔐 Auth:         http://localhost:${PORT}/api/auth`);
    console.log(`🛒 Orders:       http://localhost:${PORT}/api/orders\n`);
  });
});
