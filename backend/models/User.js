// ======================================================
// models/User.js — User Schema for MongoDB
// ======================================================
// Defines the User model with fields:
//   - name, email, mobile, age, country, password
// Passwords are hashed before saving using bcryptjs.
// Includes a method to compare passwords for login.
// ======================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },

    // Email address — must be unique
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },

    // Mobile number
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      minlength: [10, 'Mobile must be at least 10 digits'],
    },

    // Age of the user
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [5, 'Minimum age is 5'],
      max: [120, 'Maximum age is 120'],
    },

    // Country
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },

    // Hashed password
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// ==============================================
// Pre-save hook: Hash password before saving
// ==============================================
userSchema.pre('save', async function (next) {
  // Only hash if the password field has been modified
  if (!this.isModified('password')) return next();

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ==============================================
// Instance method: Compare entered password
// with the stored hashed password
// ==============================================
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
