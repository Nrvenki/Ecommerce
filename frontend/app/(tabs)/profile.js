// ======================================================
// app/(tabs)/profile.js — User Profile Screen
// ======================================================
// Displays user profile info, order history, and
// provides a logout button.
// ======================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  Alert, Animated, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/colors';
import api from '../../utils/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Animation
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(headerAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching orders:', error.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  // Profile info row component
  const InfoRow = ({ icon, label, value, color = COLORS.accentBlue }) => (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Background Circles */}
      <View style={[styles.bgCircle, styles.circle1]} />

      {/* Profile Header */}
      <Animated.View style={[styles.profileHeader, {
        opacity: headerAnim,
        transform: [{ scale: headerAnim }],
      }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.profileName}>{user?.name || 'User'}</Text>
        <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ${orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>⭐</Text>
            <Text style={styles.statLabel}>Member</Text>
          </View>
        </View>
      </Animated.View>

      {/* Personal Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoCard}>
          <InfoRow icon="person-outline" label="Full Name" value={user?.name || '-'} />
          <InfoRow icon="mail-outline" label="Email" value={user?.email || '-'} color={COLORS.accentPurple} />
          <InfoRow icon="call-outline" label="Mobile" value={user?.mobile || '-'} color={COLORS.accentTeal} />
          <InfoRow icon="calendar-outline" label="Age" value={user?.age ? `${user.age} years` : '-'} color={COLORS.accentOrange} />
          <InfoRow icon="globe-outline" label="Country" value={user?.country || '-'} color={COLORS.accentPink} />
        </View>
      </View>

      {/* Recent Orders */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        {orders.length > 0 ? (
          orders.slice(0, 5).map((order, index) => (
            <View key={order._id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={[styles.statusBadge, {
                  backgroundColor: order.status === 'Confirmed' ? COLORS.success + '20' : COLORS.accentYellow + '20'
                }]}>
                  <Text style={[styles.statusText, {
                    color: order.status === 'Confirmed' ? COLORS.success : COLORS.accentYellow
                  }]}>
                    {order.status}
                  </Text>
                </View>
                <Text style={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.orderItems}>
                {order.items.length} item{order.items.length > 1 ? 's' : ''}
              </Text>
              <Text style={styles.orderTotal}>${order.totalAmount.toFixed(2)}</Text>
            </View>
          ))
        ) : (
          <View style={styles.noOrders}>
            <Ionicons name="receipt-outline" size={40} color={COLORS.textMuted} />
            <Text style={styles.noOrdersText}>No orders yet</Text>
          </View>
        )}
      </View>

      {/* Logout Button */}
      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </Pressable>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  scrollContent: { padding: 20, paddingTop: 50 },
  bgCircle: { position: 'absolute', borderRadius: 999, opacity: 0.06 },
  circle1: { width: 300, height: 300, backgroundColor: COLORS.accentPurple, top: -80, right: -80 },
  // Profile Header
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatar: {
    width: 90, height: 90, borderRadius: 30, backgroundColor: COLORS.accentPurple,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    shadowColor: COLORS.shadowPurple, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5, shadowRadius: 15, elevation: 10,
  },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: '800' },
  profileName: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '800', marginBottom: 4 },
  profileEmail: { color: COLORS.textSecondary, fontSize: 14 },
  // Stats
  statsRow: {
    flexDirection: 'row', backgroundColor: COLORS.bgSecondary, borderRadius: 20,
    padding: 20, marginTop: 20, borderWidth: 1, borderColor: COLORS.border, width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '800' },
  statLabel: { color: COLORS.textMuted, fontSize: 12, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  // Section
  section: { marginBottom: 24 },
  sectionTitle: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  // Info Card
  infoCard: {
    backgroundColor: COLORS.bgSecondary, borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  infoIcon: {
    width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  infoContent: { marginLeft: 14, flex: 1 },
  infoLabel: { color: COLORS.textMuted, fontSize: 12 },
  infoValue: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600', marginTop: 2 },
  // Orders
  orderCard: {
    backgroundColor: COLORS.bgCard, borderRadius: 16, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: COLORS.border,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '700' },
  orderDate: { color: COLORS.textMuted, fontSize: 12 },
  orderItems: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 4 },
  orderTotal: { color: COLORS.accentTeal, fontSize: 18, fontWeight: '800' },
  noOrders: { alignItems: 'center', paddingVertical: 30 },
  noOrdersText: { color: COLORS.textMuted, fontSize: 15, marginTop: 10 },
  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.error + '10', borderRadius: 16, paddingVertical: 16,
    borderWidth: 1, borderColor: COLORS.error + '30', gap: 8,
  },
  logoutText: { color: COLORS.error, fontSize: 16, fontWeight: '700' },
});
