// ======================================================
// models/Order.js — Order Schema for MongoDB
// ======================================================
// Stores order information including user reference,
// ordered items, total amount, and status tracking.
// ======================================================

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  // Reference to the product
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  // Selected size
  size: {
    type: String,
    required: true,
  },
  // Selected color
  color: {
    type: String,
    required: true,
  },
  // Quantity ordered
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  // Price at time of purchase
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    // Reference to the user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Array of ordered items
    items: [orderItemSchema],

    // Total order amount
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Order status
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },

    // Shipping address (simple string for now)
    shippingAddress: {
      type: String,
      required: [true, 'Shipping address is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
