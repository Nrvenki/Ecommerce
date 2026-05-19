// ======================================================
// app/(tabs)/home.js — Main Product Dashboard
// ======================================================
// The main shopping screen featuring:
//   - Animated greeting header with user name
//   - Search bar with live filtering
//   - Horizontal category chips
//   - Product grid with animated cards
//   - Pull-to-refresh functionality
//   - Product detail modal (View)
//   - Quick buy with Add to Cart
// ======================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, Pressable,
  RefreshControl, Alert, Animated, Dimensions, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, CATEGORY_COLORS } from '../../utils/colors';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard';
import ProductDetailModal from '../../components/ProductDetailModal';

const { width } = Dimensions.get('window');

// All categories
const CATEGORIES = [
  'All', 'T-Shirts', 'Jeans', 'Hoodies', 'Jackets',
  'Shorts', 'Formal', 'Sports', 'Accessories',
];

export default function HomeScreen() {
  const { user, addToCart } = useAuth();

  // State
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const searchAnim = useRef(new Animated.Value(0)).current;

  // ==============================================
  // Fetch products from backend
  // ==============================================
  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get('/products');
      if (response.data.success) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching products:', error.message);
      Alert.alert('Connection Error', 'Could not load products. Check your connection and backend URL.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    // Entrance animations
    Animated.stagger(150, [
      Animated.spring(headerAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.spring(searchAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  // ==============================================
  // Filter products by category and search
  // ==============================================
  useEffect(() => {
    let result = products;

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // View product detail
  const handleView = (product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  // Quick buy (add to cart)
  const handleBuy = (product) => {
    addToCart(product, product.sizes[0], product.colors[0], 1);
    Alert.alert('Added! 🛒', `${product.name} added to cart`, [
      { text: 'Continue Shopping' },
      { text: 'View Cart', onPress: () => {} },
    ]);
  };

  // Add to cart from detail modal
  const handleAddToCart = (product, size, color) => {
    addToCart(product, size, color, 1);
    setShowDetail(false);
    Alert.alert('Added! 🛒', `${product.name} (${size}, ${color}) added to cart`);
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // ==============================================
  // Render Category Chip
  // ==============================================
  const renderCategoryChip = (category) => {
    const isActive = selectedCategory === category;
    const catColor = CATEGORY_COLORS[category]?.accent || COLORS.accentBlue;

    return (
      <Pressable
        key={category}
        onPress={() => setSelectedCategory(category)}
        style={[
          styles.chip,
          isActive && { backgroundColor: catColor, borderColor: catColor },
        ]}
      >
        <Text
          style={[
            styles.chipText,
            isActive && { color: '#fff' },
          ]}
        >
          {category}
        </Text>
      </Pressable>
    );
  };

  // ==============================================
  // Header Component
  // ==============================================
  const ListHeader = () => (
    <View>
      {/* Greeting Header */}
      <Animated.View style={[styles.greetingSection, {
        opacity: headerAnim,
        transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
      }]}>
        <View>
          <Text style={styles.greeting}>{getGreeting()} 👋</Text>
          <Text style={styles.userName}>{user?.name || 'Shopper'}</Text>
        </View>
        <View style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
          <View style={styles.notifDot} />
        </View>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View style={[styles.searchContainer, {
        opacity: searchAnim,
        transform: [{ translateY: searchAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
      }]}>
        <Ionicons name="search" size={20} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search cool outfits..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
          </Pressable>
        ) : (
          <Ionicons name="options-outline" size={20} color={COLORS.accentBlue} />
        )}
      </Animated.View>

      {/* Category Chips */}
      <View style={styles.categorySection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderCategoryChip(item)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsRow}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'All Products' : selectedCategory}
        </Text>
        <Text style={styles.resultsCount}>{filteredProducts.length} items</Text>
      </View>
    </View>
  );

  // ==============================================
  // Render
  // ==============================================
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.accentBlue} />
        <Text style={styles.loadingText}>Loading cool stuff...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={ListHeader}
        renderItem={({ item, index }) => (
          <ProductCard
            product={item}
            index={index}
            onView={() => handleView(item)}
            onBuy={() => handleBuy(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={60} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try a different search or category</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.accentBlue}
            colors={[COLORS.accentBlue]}
          />
        }
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        visible={showDetail}
        onClose={() => setShowDetail(false)}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  center: { justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingTop: 50 },
  row: { justifyContent: 'space-between' },
  // Greeting
  greetingSection: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  greeting: { color: COLORS.textSecondary, fontSize: 15 },
  userName: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '800', marginTop: 2 },
  notificationBtn: {
    width: 48, height: 48, borderRadius: 16, backgroundColor: COLORS.bgSecondary,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  notifDot: {
    position: 'absolute', top: 10, right: 12, width: 8, height: 8,
    borderRadius: 4, backgroundColor: COLORS.accentOrange,
  },
  // Search
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgSecondary,
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1, color: COLORS.textPrimary, fontSize: 15, marginLeft: 10, marginRight: 10,
  },
  // Categories
  categorySection: { marginBottom: 16 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  chipRow: { gap: 8, paddingRight: 16 },
  chip: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20,
    backgroundColor: COLORS.bgSecondary, borderWidth: 1, borderColor: COLORS.border,
  },
  chipText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' },
  // Results
  resultsRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  resultsCount: { color: COLORS.textMuted, fontSize: 13 },
  // Empty state
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: COLORS.textSecondary, fontSize: 18, fontWeight: '600', marginTop: 16 },
  emptySubtext: { color: COLORS.textMuted, fontSize: 14, marginTop: 6 },
  // Loading
  loadingText: { color: COLORS.textSecondary, fontSize: 16, marginTop: 16 },
});
