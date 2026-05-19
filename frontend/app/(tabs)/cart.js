// ======================================================
// app/(tabs)/cart.js — Shopping Cart Screen
// ======================================================
// Displays cart items with quantity controls, total price,
// and a checkout button that places an order via the API.
// ======================================================

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, Pressable,
  Alert, Animated, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/colors';
import api from '../../utils/api';
import GradientButton from '../../components/GradientButton';

export default function CartScreen() {
  const { cart, removeFromCart, clearCart, getCartTotal } = useAuth();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Header animation
  const headerAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.spring(headerAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, []);

  // ==============================================
  // Place Order
  // ==============================================
  const handleCheckout = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Add some items to your cart first!');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Address Required', 'Please enter your shipping address.');
      return;
    }

    setLoading(true);
    try {
      const orderItems = cart.map((item) => ({
        product: item.product._id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      }));

      const response = await api.post('/orders', {
        items: orderItems,
        shippingAddress: address,
      });

      if (response.data.success) {
        Alert.alert(
          '🎉 Order Placed!',
          `Your order of $${getCartTotal().toFixed(2)} has been confirmed!`,
          [{ text: 'Awesome!' }]
        );
        clearCart();
        setAddress('');
      }
    } catch (error) {
      Alert.alert('Order Failed', 'Could not place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ==============================================
  // Render Cart Item
  // ==============================================
  const renderCartItem = ({ item, index }) => (
    <Animated.View style={styles.cartItem}>
      {/* Product Image */}
      <Image source={{ uri: item.product.image }} style={styles.itemImage} />

      {/* Item Details */}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
        <View style={styles.itemMeta}>
          <Text style={styles.metaText}>Size: {item.size}</Text>
          <Text style={styles.metaDot}>•</Text>
          <Text style={styles.metaText}>Color: {item.color}</Text>
        </View>
        <View style={styles.itemPriceRow}>
          <Text style={styles.itemPrice}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
          <Text style={styles.itemQty}>×{item.quantity}</Text>
        </View>
      </View>

      {/* Remove Button */}
      <Pressable style={styles.removeBtn} onPress={() => {
        Alert.alert('Remove Item', `Remove ${item.product.name} from cart?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(index) },
        ]);
      }}>
        <Ionicons name="trash-outline" size={20} color={COLORS.error} />
      </Pressable>
    </Animated.View>
  );

  // ==============================================
  // Empty Cart
  // ==============================================
  if (cart.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Ionicons name="cart-outline" size={80} color={COLORS.textMuted} />
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySubtext}>
          Start adding some cool outfits!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, {
        opacity: headerAnim,
        transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
      }]}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        <Pressable onPress={() => {
          Alert.alert('Clear Cart', 'Remove all items?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: clearCart },
          ]);
        }}>
          <Text style={styles.clearText}>Clear All</Text>
        </Pressable>
      </Animated.View>

      {/* Cart Items */}
      <FlatList
        data={cart}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderCartItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Bottom Section: Address + Checkout */}
      <View style={styles.bottomSection}>
        {/* Shipping Address */}
        <View style={styles.addressContainer}>
          <Ionicons name="location-outline" size={20} color={COLORS.accentBlue} />
          <TextInput
            style={styles.addressInput}
            placeholder="Enter shipping address..."
            placeholderTextColor={COLORS.textMuted}
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>

        {/* Price Summary */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${getCartTotal().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={[styles.summaryValue, { color: COLORS.success }]}>FREE</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${getCartTotal().toFixed(2)}</Text>
        </View>

        {/* Checkout Button */}
        <GradientButton
          title={`Place Order — $${getCartTotal().toFixed(2)}`}
          onPress={handleCheckout}
          loading={loading}
          variant="orange"
          style={{ marginTop: 16 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary, paddingTop: 50 },
  emptyContainer: { justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '700', marginTop: 20 },
  emptySubtext: { color: COLORS.textMuted, fontSize: 15, marginTop: 8 },
  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 20, marginBottom: 16,
  },
  headerTitle: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '800' },
  clearText: { color: COLORS.error, fontSize: 14, fontWeight: '600' },
  listContent: { paddingHorizontal: 16 },
  // Cart Item
  cartItem: {
    flexDirection: 'row', backgroundColor: COLORS.bgCard, borderRadius: 16,
    padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center',
  },
  itemImage: { width: 80, height: 80, borderRadius: 12 },
  itemDetails: { flex: 1, marginLeft: 12 },
  itemName: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600', marginBottom: 4 },
  itemMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  metaText: { color: COLORS.textMuted, fontSize: 12 },
  metaDot: { color: COLORS.textMuted, fontSize: 8 },
  itemPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemPrice: { color: COLORS.accentTeal, fontSize: 16, fontWeight: '800' },
  itemQty: { color: COLORS.textMuted, fontSize: 13 },
  removeBtn: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.error + '15',
    alignItems: 'center', justifyContent: 'center',
  },
  // Bottom
  bottomSection: {
    backgroundColor: COLORS.bgSecondary, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, borderTopWidth: 1, borderColor: COLORS.border,
  },
  addressContainer: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.bgInput,
    borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  addressInput: { flex: 1, color: COLORS.textPrimary, fontSize: 14, marginLeft: 10, maxHeight: 60 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: COLORS.textSecondary, fontSize: 15 },
  summaryValue: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 10 },
  totalLabel: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  totalValue: { color: COLORS.accentOrange, fontSize: 22, fontWeight: '900' },
});
