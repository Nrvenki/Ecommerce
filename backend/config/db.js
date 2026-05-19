// ======================================================
// config/db.js — MongoDB Atlas Connection Configuration
// ======================================================
// This module establishes a connection to MongoDB Atlas
// using Mongoose. It reads the connection URI from .env
// and handles connection errors gracefully.
// ======================================================

const mongoose = require('mongoose');

/**
 * connectDB - Connects to MongoDB Atlas
 * Uses the MONGO_URI environment variable for the connection string.
 * Logs success or exits process on failure.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit with failure code
  }
};

module.exports = connectDB;
