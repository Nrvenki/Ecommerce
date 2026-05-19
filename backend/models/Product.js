// ======================================================
// models/Product.js — Product Schema for MongoDB
// ======================================================
// Defines the Product model for boys' clothing items.
// Fields: name, description, price, category, sizes,
//         colors, image, stock, rating, featured
// ======================================================

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // Product name
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    // Detailed description of the product
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    // Price in USD
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    // Original price (for showing discounts)
    originalPrice: {
      type: Number,
      default: 0,
    },

    // Category (e.g., T-Shirts, Jeans, Hoodies, etc.)
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'T-Shirts',
        'Jeans',
        'Hoodies',
        'Jackets',
        'Shorts',
        'Formal',
        'Sports',
        'Accessories',
      ],
    },

    // Available sizes
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
    },

    // Available colors
    colors: {
      type: [String],
      default: ['Blue', 'Black'],
    },

    // Product image URL
    image: {
      type: String,
      required: [true, 'Product image URL is required'],
    },

    // Stock quantity
    stock: {
      type: Number,
      default: 100,
      min: 0,
    },

    // Average rating (1–5)
    rating: {
      type: Number,
      default: 4.0,
      min: 1,
      max: 5,
    },

    // Whether this product is featured on the homepage
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
