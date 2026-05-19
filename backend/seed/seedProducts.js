// ======================================================
// seed/seedProducts.js — Seed Sample Products
// ======================================================
// Run: npm run seed
// Populates the database with sample boys' clothing items
// using free placeholder images from picsum.photos.
// ======================================================

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

// ============================
// Sample Boys' Clothing Data
// ============================
const sampleProducts = [
  {
    name: 'Cool Blue Graphic Tee',
    description:
      'A vibrant blue graphic t-shirt featuring a cool skateboard design. Made from 100% premium cotton for ultimate comfort. Perfect for everyday casual wear.',
    price: 19.99,
    originalPrice: 29.99,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Navy', 'Teal'],
    image: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=400&h=400&fit=crop',
    stock: 150,
    rating: 4.5,
    featured: true,
  },
  {
    name: 'Red Superhero Print Tee',
    description:
      'Stand out with this bold red superhero print t-shirt. Soft-touch fabric with a classic crew neck. Machine washable and built to last through adventures.',
    price: 22.99,
    originalPrice: 34.99,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L'],
    colors: ['Red', 'Maroon', 'Orange'],
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
    stock: 120,
    rating: 4.3,
    featured: true,
  },
  {
    name: 'Classic Slim Fit Jeans',
    description:
      'Comfortable slim-fit denim jeans with a modern tapered leg. Features stretch denim fabric for flexibility. Durable construction with reinforced stitching.',
    price: 34.99,
    originalPrice: 49.99,
    category: 'Jeans',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Dark Blue', 'Black', 'Light Blue'],
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
    stock: 90,
    rating: 4.7,
    featured: true,
  },
  {
    name: 'Ripped Distressed Denim',
    description:
      'Trendy distressed jeans with a relaxed fit. Pre-washed for a vintage look. Features ripped knee details and comfortable stretch waistband.',
    price: 39.99,
    originalPrice: 55.99,
    category: 'Jeans',
    sizes: ['M', 'L', 'XL'],
    colors: ['Blue', 'Grey'],
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=400&fit=crop',
    stock: 75,
    rating: 4.2,
    featured: false,
  },
  {
    name: 'Urban Street Hoodie',
    description:
      'Cozy fleece-lined hoodie with a kangaroo pocket. Features an adjustable drawstring hood and ribbed cuffs. Perfect for cool weather and layering.',
    price: 44.99,
    originalPrice: 64.99,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Grey', 'Black', 'Navy'],
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
    stock: 100,
    rating: 4.8,
    featured: true,
  },
  {
    name: 'Neon Green Zip Hoodie',
    description:
      'Eye-catching neon green zip-up hoodie. Lightweight and breathable with moisture-wicking interior. Zip pockets for secure storage.',
    price: 49.99,
    originalPrice: 69.99,
    category: 'Hoodies',
    sizes: ['S', 'M', 'L'],
    colors: ['Green', 'Yellow', 'Orange'],
    image: 'https://images.unsplash.com/photo-1578768079470-83f21997178d?w=400&h=400&fit=crop',
    stock: 60,
    rating: 4.4,
    featured: false,
  },
  {
    name: 'Bomber Jacket Navy',
    description:
      'Classic bomber jacket in navy blue. Water-resistant outer shell with soft quilted lining. Features ribbed collar, cuffs, and hem for a snug fit.',
    price: 59.99,
    originalPrice: 89.99,
    category: 'Jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Black', 'Olive'],
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    stock: 50,
    rating: 4.6,
    featured: true,
  },
  {
    name: 'Lightweight Windbreaker',
    description:
      'Ultra-light windbreaker jacket with packable design. Folds into its own pocket for easy carrying. Water-repellent finish keeps you dry in light rain.',
    price: 39.99,
    originalPrice: 59.99,
    category: 'Jackets',
    sizes: ['M', 'L', 'XL'],
    colors: ['Blue', 'Red', 'Black'],
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
    stock: 80,
    rating: 4.3,
    featured: false,
  },
  {
    name: 'Cargo Shorts Khaki',
    description:
      'Versatile cargo shorts with multiple pockets. Made from durable cotton twill fabric. Elastic waistband with drawstring for a comfortable fit.',
    price: 24.99,
    originalPrice: 35.99,
    category: 'Shorts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Khaki', 'Navy', 'Olive'],
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
    stock: 130,
    rating: 4.1,
    featured: false,
  },
  {
    name: 'Athletic Sports Shorts',
    description:
      'Quick-dry athletic shorts with moisture-wicking technology. Lightweight mesh panels for breathability. Elastic waistband with internal drawstring.',
    price: 19.99,
    originalPrice: 29.99,
    category: 'Shorts',
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Grey', 'Blue'],
    image: 'https://images.unsplash.com/photo-1562886877-aaaa5c17d1a4?w=400&h=400&fit=crop',
    stock: 110,
    rating: 4.4,
    featured: false,
  },
  {
    name: 'Formal White Shirt',
    description:
      'Crisp white formal shirt with a classic collar. Wrinkle-resistant fabric for a polished look all day. Perfect for school events and special occasions.',
    price: 29.99,
    originalPrice: 44.99,
    category: 'Formal',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Light Blue', 'Pink'],
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=400&h=400&fit=crop',
    stock: 85,
    rating: 4.5,
    featured: true,
  },
  {
    name: 'Sports Performance Tee',
    description:
      'High-performance sports t-shirt with DriFit technology. Ultra-lightweight and breathable mesh design. UV protection with UPF 50+ rating.',
    price: 27.99,
    originalPrice: 39.99,
    category: 'Sports',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue', 'Red', 'Green', 'Black'],
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
    stock: 140,
    rating: 4.6,
    featured: true,
  },
  {
    name: 'Cool Snapback Cap',
    description:
      'Trendy snapback cap with embroidered logo. Adjustable snap closure fits all sizes. Structured crown with flat brim for a street-style look.',
    price: 14.99,
    originalPrice: 22.99,
    category: 'Accessories',
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Red', 'Blue'],
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400&h=400&fit=crop',
    stock: 200,
    rating: 4.3,
    featured: false,
  },
  {
    name: 'Leather Belt Classic',
    description:
      'Premium faux leather belt with a brushed metal buckle. Adjustable to any waist size with multiple holes. Durable construction built to last.',
    price: 12.99,
    originalPrice: 19.99,
    category: 'Accessories',
    sizes: ['S', 'M', 'L'],
    colors: ['Brown', 'Black'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    stock: 95,
    rating: 4.0,
    featured: false,
  },
  {
    name: 'Striped Polo Shirt',
    description:
      'Classic striped polo shirt with a button-down collar. Soft piqué cotton fabric with a relaxed fit. Ribbed collar and cuffs for a polished look.',
    price: 25.99,
    originalPrice: 38.99,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White/Blue', 'Navy/White', 'Red/White'],
    image: 'https://images.unsplash.com/photo-1625910513413-5fc421e0deb0?w=400&h=400&fit=crop',
    stock: 70,
    rating: 4.4,
    featured: true,
  },
];

// ==============================================
// Seed function — clears existing and inserts new
// ==============================================
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${inserted.length} products successfully!`);

    // Disconnect
    await mongoose.disconnect();
    console.log('🔌 Database disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
