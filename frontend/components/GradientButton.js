// ======================================================
// components/GradientButton.js — Gradient Action Button
// ======================================================
// A vibrant, animated button with:
//   - Linear gradient background (simulated)
//   - Press scale animation
//   - Loading spinner support
//   - Multiple color presets
// ======================================================

import React, { useRef } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  View,
} from 'react-native';
import { COLORS } from '../utils/colors';

/**
 * GradientButton — Animated pressable button
 *
 * @param {string} title       - Button text
 * @param {func}   onPress     - Press handler
 * @param {bool}   loading     - Show loading spinner
 * @param {string} variant     - 'blue', 'purple', 'orange', 'teal'
 * @param {object} style       - Additional styles
 * @param {bool}   disabled    - Disable the button
 */
const GradientButton = ({
  title,
  onPress,
  loading = false,
  variant = 'blue',
  style,
  disabled = false,
}) => {
  // Scale animation on press
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  // Color variants
  const variantStyles = {
    blue: {
      backgroundColor: COLORS.accentBlue,
      shadowColor: COLORS.shadowBlue,
    },
    purple: {
      backgroundColor: COLORS.accentPurple,
      shadowColor: COLORS.shadowPurple,
    },
    orange: {
      backgroundColor: COLORS.accentOrange,
      shadowColor: COLORS.shadowOrange,
    },
    teal: {
      backgroundColor: COLORS.accentTeal,
      shadowColor: COLORS.shadowOrange,
    },
  };

  const currentVariant = variantStyles[variant] || variantStyles.blue;

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          {
            backgroundColor: currentVariant.backgroundColor,
            shadowColor: currentVariant.shadowColor,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default GradientButton;
