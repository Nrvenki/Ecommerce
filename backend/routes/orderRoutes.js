// ======================================================
// routes/orderRoutes.js — Order Routes
// ======================================================
// POST /api/orders  — Place a new order (protected)
// GET  /api/orders  — Get all orders for user (protected)
// ======================================================

const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

// All order routes are protected
router.post('/', protect, placeOrder);
router.get('/', protect, getMyOrders);

module.exports = router;
