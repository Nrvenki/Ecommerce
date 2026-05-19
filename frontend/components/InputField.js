// ======================================================
// components/InputField.js — Styled Input Component
// ======================================================
// A reusable, animated text input with:
//   - Left icon support
//   - Focus/blur glow animation
//   - Error message display
//   - Dark theme styling
// ======================================================

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/colors';

/**
 * InputField — Animated text input with icon
 *
 * @param {string}  icon       - Ionicons icon name
 * @param {string}  label      - Placeholder/label text
 * @param {string}  value      - Current input value
 * @param {func}    onChangeText - Text change handler
 * @param {string}  error      - Error message to display
 * @param {boolean} secureTextEntry - Password mode
 * @param {string}  keyboardType - Keyboard type
 */
const InputField = ({
  icon,
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animated border glow
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(borderAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(borderAnim, {
      toValue: 0,
      friction: 5,
      useNativeDriver: false,
    }).start();
  };

  // Interpolate border color
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.accentBlue],
  });

  // Interpolate shadow opacity
  const shadowOpacity = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            shadowColor: COLORS.accentBlue,
            shadowOpacity,
          },
          error && styles.inputError,
        ]}
      >
        {/* Left Icon */}
        <Ionicons
          name={icon}
          size={20}
          color={isFocused ? COLORS.accentBlue : COLORS.textMuted}
          style={styles.icon}
        />

        {/* Text Input */}
        <TextInput
          style={styles.input}
          placeholder={label}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />

        {/* Password visibility toggle */}
        {secureTextEntry && (
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textMuted}
            />
          </Pressable>
        )}
      </Animated.View>

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgInput,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 3,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 16,
    paddingVertical: 14,
    fontFamily: 'System',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 16,
  },
});

export default InputField;
