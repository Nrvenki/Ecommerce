// ======================================================
// controllers/orderController.js — Order Business Logic
// ======================================================
// Handles placing new orders and retrieving user orders.
// ======================================================

const Order = require('../models/Order');
const Product = require('../models/Product');

// ==============================================
// POST /api/orders
// Place a new order (protected route)
// ==============================================
const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // --- Validation ---
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in the order',
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required',
      });
    }

    // Calculate total amount from the items
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;
    }

    // Create the order document
    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      status: 'Confirmed',
    });

    // Populate product details in the response
    const populatedOrder = await Order.findById(order._id).populate(
      'items.product',
      'name image price'
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! 🎉',
      data: populatedOrder,
    });
  } catch (error) {
    console.error('Order Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message,
    });
  }
};

// ==============================================
// GET /api/orders
// Get all orders for the logged-in user (protected)
// ==============================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

module.exports = { placeOrder, getMyOrders };
