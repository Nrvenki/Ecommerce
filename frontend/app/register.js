// ======================================================
// app/register.js — Registration Screen
// ======================================================
// Full registration form with fields:
//   Name, Email, Mobile, Age, Country, Password
// Includes input validation, error display, and
// auto-navigation to (tabs)/home on success.
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

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  // Form state
  const [form, setForm] = useState({
    name: '', email: '', mobile: '', age: '', country: '', password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Header animation
  const headerAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.spring(headerAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, []);

  // Update form field
  const updateField = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  // Validate all fields
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (form.mobile.length < 10) newErrors.mobile = 'Enter at least 10 digits';
    if (!form.age.trim()) newErrors.age = 'Age is required';
    else if (isNaN(form.age) || Number(form.age) < 5 || Number(form.age) > 120)
      newErrors.age = 'Enter a valid age (5-120)';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    if (!form.password.trim()) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Minimum 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit registration
  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await register(form);
      if (result.success) {
        Alert.alert('🎉 Welcome!', result.message, [
          { text: 'Let\'s Shop!', onPress: () => router.replace('/(tabs)/home') },
        ]);
      } else {
        Alert.alert('Registration Failed', result.message);
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
            <Ionicons name="person-add" size={32} color="#fff" />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the coolest fashion community!</Text>
        </Animated.View>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            icon="person-outline" label="Full Name" value={form.name}
            onChangeText={(v) => updateField('name', v)} error={errors.name}
            autoCapitalize="words"
          />
          <InputField
            icon="mail-outline" label="Email Address" value={form.email}
            onChangeText={(v) => updateField('email', v)} error={errors.email}
            keyboardType="email-address"
          />
          <InputField
            icon="call-outline" label="Mobile Number" value={form.mobile}
            onChangeText={(v) => updateField('mobile', v)} error={errors.mobile}
            keyboardType="phone-pad"
          />
          <InputField
            icon="calendar-outline" label="Age" value={form.age}
            onChangeText={(v) => updateField('age', v)} error={errors.age}
            keyboardType="numeric"
          />
          <InputField
            icon="globe-outline" label="Country" value={form.country}
            onChangeText={(v) => updateField('country', v)} error={errors.country}
            autoCapitalize="words"
          />
          <InputField
            icon="lock-closed-outline" label="Password" value={form.password}
            onChangeText={(v) => updateField('password', v)} error={errors.password}
            secureTextEntry
          />

          {/* Register Button */}
          <GradientButton
            title="Create My Account"
            onPress={handleRegister}
            loading={loading}
            variant="purple"
            style={{ marginTop: 8 }}
          />

          {/* Login Link */}
          <Pressable onPress={() => router.push('/login')} style={styles.linkRow}>
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.linkHighlight}>Sign In</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgPrimary },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 50 },
  bgCircle: { position: 'absolute', borderRadius: 999, opacity: 0.06 },
  circle1: { width: 250, height: 250, backgroundColor: COLORS.accentPurple, top: -60, right: -60 },
  circle2: { width: 180, height: 180, backgroundColor: COLORS.accentTeal, bottom: 40, left: -40 },
  backBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.bgSecondary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  header: { alignItems: 'center', marginBottom: 30 },
  iconBg: {
    width: 70, height: 70, borderRadius: 22, backgroundColor: COLORS.accentPurple,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    shadowColor: COLORS.shadowPurple, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5, shadowRadius: 15, elevation: 10,
  },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary },
  form: { flex: 1 },
  linkRow: { alignItems: 'center', paddingVertical: 20 },
  linkText: { color: COLORS.textSecondary, fontSize: 15 },
  linkHighlight: { color: COLORS.accentPurple, fontWeight: '700' },
});
