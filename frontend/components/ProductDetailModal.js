import React, { useRef } from 'react';
import {
  View, Text, Image, StyleSheet, Pressable, Animated, ScrollView, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

const { width } = Dimensions.get('window');

const ProductDetailModal = ({ product, visible, onClose, onAddToCart }) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const [selectedSize, setSelectedSize] = React.useState(product?.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = React.useState(product?.colors?.[0] || 'Blue');

  if (!visible || !product) return null;

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons key={i} name={i < Math.floor(product.rating) ? 'star' : 'star-outline'}
          size={18} color={COLORS.accentYellow} />
      );
    }
    return stars;
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
        {/* Close Button */}
        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Ionicons name="close-circle" size={32} color={COLORS.textMuted} />
        </Pressable>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Product Image */}
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />

          <View style={styles.content}>
            {/* Category */}
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>

            {/* Name */}
            <Text style={styles.name}>{product.name}</Text>

            {/* Rating */}
            <View style={styles.ratingRow}>
              {renderStars()}
              <Text style={styles.ratingText}>{product.rating} / 5.0</Text>
            </View>

            {/* Price */}
            <View style={styles.priceRow}>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
              {discountPercent > 0 && (
                <>
                  <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{discountPercent}% OFF</Text>
                  </View>
                </>
              )}
            </View>

            {/* Description */}
            <Text style={styles.description}>{product.description}</Text>

            {/* Size Selection */}
            <Text style={styles.sectionTitle}>Select Size</Text>
            <View style={styles.optionRow}>
              {product.sizes.map((size) => (
                <Pressable key={size} onPress={() => setSelectedSize(size)}
                  style={[styles.optionBtn, selectedSize === size && styles.optionActive]}>
                  <Text style={[styles.optionText, selectedSize === size && styles.optionTextActive]}>
                    {size}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Color Selection */}
            <Text style={styles.sectionTitle}>Select Color</Text>
            <View style={styles.optionRow}>
              {product.colors.map((color) => (
                <Pressable key={color} onPress={() => setSelectedColor(color)}
                  style={[styles.colorBtn, selectedColor === color && styles.optionActive]}>
                  <Text style={[styles.optionText, selectedColor === color && styles.optionTextActive]}>
                    {color}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Stock Info */}
            <View style={styles.stockRow}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.stockText}>{product.stock} in stock</Text>
            </View>

            {/* Add to Cart */}
            <Pressable style={styles.addToCartBtn}
              onPress={() => onAddToCart(product, selectedSize, selectedColor)}>
              <Ionicons name="cart" size={20} color="#fff" />
              <Text style={styles.addToCartText}>Add to Cart — ${product.price.toFixed(2)}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center',
    alignItems: 'center', zIndex: 100,
  },
  modal: {
    width: width * 0.92, maxHeight: '90%', backgroundColor: COLORS.bgSecondary,
    borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border,
  },
  closeBtn: { position: 'absolute', top: 12, right: 12, zIndex: 10 },
  image: { width: '100%', height: 280 },
  content: { padding: 20 },
  categoryTag: {
    alignSelf: 'flex-start', backgroundColor: COLORS.accentBlue + '20',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 8,
  },
  categoryText: { color: COLORS.accentBlue, fontSize: 12, fontWeight: '700' },
  name: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  ratingText: { color: COLORS.textSecondary, fontSize: 14, marginLeft: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  price: { color: COLORS.accentTeal, fontSize: 28, fontWeight: '900' },
  originalPrice: { color: COLORS.textMuted, fontSize: 16, textDecorationLine: 'line-through' },
  discountBadge: { backgroundColor: COLORS.error, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  discountText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  description: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 22, marginBottom: 16 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700', marginBottom: 10 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  optionBtn: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bgInput,
  },
  optionActive: { borderColor: COLORS.accentBlue, backgroundColor: COLORS.accentBlue + '20' },
  optionText: { color: COLORS.textSecondary, fontSize: 14, fontWeight: '600' },
  optionTextActive: { color: COLORS.accentBlue },
  colorBtn: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bgInput,
  },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  stockText: { color: COLORS.success, fontSize: 14 },
  addToCartBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.accentBlue, paddingVertical: 16, borderRadius: 16,
    gap: 8, shadowColor: COLORS.shadowBlue, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  addToCartText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});

export default ProductDetailModal;
