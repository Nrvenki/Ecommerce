// ======================================================
// app/login.js — Login Screen
// ======================================================
// Login form with Email + Password fields.
// Validates input, authenticates via backend,
// and navigates to (tabs)/home on success.
// ======================================================

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Animated, Alert,
  KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/colors';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Header animation
  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.stagger(200, [
      Animated.spring(headerAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.spring(formAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  // Validate
  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Minimum 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit login
  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Login Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Background Circles */}
      <View style={[styles.bgCircle, styles.circle1]} />
      <View style={[styles.bgCircle, styles.circle2]} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </Pressable>

        {/* Header */}
        <Animated.View style={[styles.header, {
          opacity: headerAnim,
          transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        }]}>
          <View style={styles.iconBg}>
            <Ionicons name="log-in" size={32} color="#fff" />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue shopping</Text>
        </Animated.View>

        {/* Form */}
        <Animated.View style={[styles.form, {
          opacity: formAnim,
          transform: [{ translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
        }]}>
          <InputField
            icon="mail-outline"
            label="Email Address"
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
            keyboardType="email-address"
          />

          <InputField
            icon="lock-closed-outline"
            label="Password"
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              if (errors.password) setErrors({ ...errors, password: '' });
            }}
            error={errors.password}
            secureTextEntry
          />

          {/* Forgot Password */}
          <Pressable style={styles.forgotRow}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>

          {/* Login Button */}
          <GradientButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            variant="blue"
            style={{ marginTop: 8 }}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login Hint (UI only) */}
          <View style={styles.socialRow}>
            {['logo-google', 'logo-apple', 'logo-facebook'].map((icon, i) => (
              <Pressable key={i} style={styles.socialBtn}>
                <Ionicons name={icon} size={24} color={COLORS.textSecondary} />
              </Pressable>
            ))}
          </View>

          {/* Register Link */}
          <Pressable onPress={() => router.push('/register')} style={styles.linkRow}>
            <Text style={styles.linkText}>
              Don't have an account?{' '}
              <Text style={styles.linkHighlight}>Sign Up</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 50 },
  bgCircle: { position: 'absolute', borderRadius: 999, opacity: 0.06 },
  circle1: { width: 250, height: 250, backgroundColor: COLORS.accentBlue, top: -60, left: -60 },
  circle2: { width: 180, height: 180, backgroundColor: COLORS.accentOrange, bottom: 80, right: -40 },
  backBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.bgSecondary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  iconBg: {
    width: 70, height: 70, borderRadius: 22, backgroundColor: COLORS.accentBlue,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    shadowColor: COLORS.shadowBlue, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5, shadowRadius: 15, elevation: 10,
  },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary },
  form: { flex: 1 },
  forgotRow: { alignItems: 'flex-end', marginBottom: 10, marginTop: -6 },
  forgotText: { color: COLORS.accentBlue, fontSize: 14, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.textMuted, marginHorizontal: 16, fontSize: 13, fontWeight: '600' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 28 },
  socialBtn: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: COLORS.bgSecondary,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  linkRow: { alignItems: 'center', paddingVertical: 16 },
  linkText: { color: COLORS.textSecondary, fontSize: 15 },
  linkHighlight: { color: COLORS.accentBlue, fontWeight: '700' },
});
