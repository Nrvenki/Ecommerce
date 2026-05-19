// ======================================================
// controllers/productController.js — Product Logic
// ======================================================
// Handles fetching all products, single product details,
// filtering by category, and search functionality.
// ======================================================

const Product = require('../models/Product');

// ==============================================
// GET /api/products
// Get all products (with optional filters)
// Query params: ?category=T-Shirts&search=polo&featured=true
// ==============================================
const getProducts = async (req, res) => {
  try {
    const { category, search, featured } = req.query;

    // Build dynamic query filter
    let filter = {};

    // Filter by category if provided
    if (category) {
      filter.category = category;
    }

    // Filter featured products
    if (featured === 'true') {
      filter.featured = true;
    }

    // Search by name (case-insensitive partial match)
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message,
    });
  }
};

// ==============================================
// GET /api/products/:id
// Get a single product by its ID
// ==============================================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
};

// ==============================================
// GET /api/products/categories/list
// Get all unique categories
// ==============================================
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

module.exports = { getProducts, getProductById, getCategories };
