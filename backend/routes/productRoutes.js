// ======================================================
// routes/productRoutes.js — Product Routes
// ======================================================
// GET /api/products              — Get all products (with filters)
// GET /api/products/categories   — Get all categories
// GET /api/products/:id          — Get single product details
// ======================================================

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getCategories,
} = require('../controllers/productController');

// Public routes — no authentication required
router.get('/', getProducts);
router.get('/categories/list', getCategories);
router.get('/:id', getProductById);

module.exports = router;
