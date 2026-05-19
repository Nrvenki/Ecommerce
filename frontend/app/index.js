// ======================================================
// app/index.js — Splash / Welcome Screen
// ======================================================
// Entry screen that checks auth status and redirects:
//   - If logged in → navigate to (tabs)/home
//   - If not logged in → show welcome screen
// Features animated logo, tagline, and CTA buttons.
// ======================================================

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Pressable, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/colors';
import GradientButton from '../components/GradientButton';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Animations
  const logoAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // If user is already logged in, skip welcome
    if (!loading && user) {
      router.replace('/(tabs)/home');
      return;
    }

    // Staggered entrance animations
    Animated.stagger(200, [
      Animated.spring(logoAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.spring(titleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.spring(subtitleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.spring(buttonsAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();

    // Floating animation loop for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 10, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, [loading, user]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Animated.View style={{ opacity: logoAnim }}>
          <Ionicons name="shirt" size={60} color={COLORS.accentBlue} />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Decorative Background Circles */}
      <View style={[styles.bgCircle, styles.circle1]} />
      <View style={[styles.bgCircle, styles.circle2]} />
      <View style={[styles.bgCircle, styles.circle3]} />

      {/* Logo Section */}
      <Animated.View
        style={[
          styles.logoSection,
          {
            opacity: logoAnim,
            transform: [
              { scale: logoAnim },
              { translateY: floatAnim },
            ],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Ionicons name="shirt" size={50} color="#fff" />
        </View>
      </Animated.View>

      {/* Title */}
      <Animated.View
        style={{
          opacity: titleAnim,
          transform: [{ translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
        }}
      >
        <Text style={styles.title}>BOYS</Text>
        <Text style={styles.titleAccent}>FASHION</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View
        style={{
          opacity: subtitleAnim,
          transform: [{ translateY: subtitleAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
        }}
      >
        <Text style={styles.subtitle}>
          Discover trending styles for every young man.{'\n'}
          Cool, comfortable, and confident.
        </Text>
      </Animated.View>

      {/* Features Row */}
      <Animated.View style={[styles.featuresRow, { opacity: subtitleAnim }]}>
        {[
          { icon: 'flash', label: 'Fast Delivery' },
          { icon: 'shield-checkmark', label: 'Quality' },
          { icon: 'pricetag', label: 'Best Prices' },
        ].map((item, i) => (
          <View key={i} style={styles.featureItem}>
            <Ionicons name={item.icon} size={22} color={COLORS.accentTeal} />
            <Text style={styles.featureText}>{item.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Buttons */}
      <Animated.View
        style={[
          styles.buttonsSection,
          {
            opacity: buttonsAnim,
            transform: [{ translateY: buttonsAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
          },
        ]}
      >
        <GradientButton
          title="Get Started"
          onPress={() => router.push('/register')}
          variant="blue"
          style={{ marginBottom: 14 }}
        />

        <Pressable onPress={() => router.push('/login')} style={styles.loginLink}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginHighlight}>Sign In</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: COLORS.bgPrimary,
    alignItems: 'center', justifyContent: 'center', padding: 24,
  },
  center: { justifyContent: 'center' },
  // Decorative circles
  bgCircle: { position: 'absolute', borderRadius: 999, opacity: 0.08 },
  circle1: { width: 300, height: 300, backgroundColor: COLORS.accentBlue, top: -50, right: -80 },
  circle2: { width: 200, height: 200, backgroundColor: COLORS.accentPurple, bottom: 100, left: -60 },
  circle3: { width: 150, height: 150, backgroundColor: COLORS.accentOrange, bottom: -30, right: -30 },
  // Logo
  logoSection: { marginBottom: 30 },
  logoContainer: {
    width: 100, height: 100, borderRadius: 30,
    backgroundColor: COLORS.accentBlue, alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadowBlue, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6, shadowRadius: 20, elevation: 15,
  },
  // Title
  title: {
    fontSize: 48, fontWeight: '900', color: COLORS.textPrimary,
    textAlign: 'center', letterSpacing: 8,
  },
  titleAccent: {
    fontSize: 48, fontWeight: '900', color: COLORS.accentBlue,
    textAlign: 'center', letterSpacing: 8, marginTop: -8,
  },
  subtitle: {
    color: COLORS.textSecondary, fontSize: 16, textAlign: 'center',
    lineHeight: 24, marginTop: 16, marginBottom: 24,
  },
  // Features
  featuresRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 24, marginBottom: 40,
  },
  featureItem: { alignItems: 'center', gap: 6 },
  featureText: { color: COLORS.textMuted, fontSize: 11, fontWeight: '600' },
  // Buttons
  buttonsSection: { width: '100%', paddingHorizontal: 20 },
  loginLink: { alignItems: 'center', paddingVertical: 12 },
  loginText: { color: COLORS.textSecondary, fontSize: 15 },
  loginHighlight: { color: COLORS.accentBlue, fontWeight: '700' },
});
