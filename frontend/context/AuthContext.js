// ======================================================
// context/AuthContext.js — Global Authentication State
// ======================================================
// Manages user authentication state across the app.
// Provides: user data, token, login, logout, register
// Uses AsyncStorage for persistent token storage.
// Wraps children with AuthContext.Provider.
// ======================================================

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utils/api';

// Create the context
const AuthContext = createContext();

/**
 * useAuth — Custom hook to access auth context
 * Usage: const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * AuthProvider — Wraps the app to provide auth state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Current user data
  const [token, setToken] = useState(null);      // JWT token
  const [loading, setLoading] = useState(true);  // Initial auth check loading
  const [cart, setCart] = useState([]);           // Shopping cart items

  // ==============================================
  // On mount: Check if a token exists in storage
  // ==============================================
  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userData');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('Error checking stored auth:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==============================================
  // Register — Create new account
  // ==============================================
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);

      if (response.data.success) {
        const { token: newToken, ...userInfo } = response.data.data;

        // Store token and user data
        await AsyncStorage.setItem('userToken', newToken);
        await AsyncStorage.setItem('userData', JSON.stringify(userInfo));

        setToken(newToken);
        setUser(userInfo);

        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  // ==============================================
  // Login — Authenticate existing user
  // ==============================================
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.success) {
        const { token: newToken, ...userInfo } = response.data.data;

        // Store token and user data
        await AsyncStorage.setItem('userToken', newToken);
        await AsyncStorage.setItem('userData', JSON.stringify(userInfo));

        setToken(newToken);
        setUser(userInfo);

        return { success: true, message: response.data.message };
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  // ==============================================
  // Logout — Clear auth state and storage
  // ==============================================
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      setToken(null);
      setUser(null);
      setCart([]);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  // ==============================================
  // Cart Management
  // ==============================================

  /**
   * addToCart — Add a product to the cart
   * If the product (same id + size + color) already exists,
   * increment the quantity instead.
   */
  const addToCart = (product, size, color, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product._id === product._id &&
          item.size === size &&
          item.color === color
      );

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      // Add new item
      return [...prev, { product, size, color, quantity, price: product.price }];
    });
  };

  /**
   * removeFromCart — Remove an item by index
   */
  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * clearCart — Empty the entire cart
   */
  const clearCart = () => setCart([]);

  /**
   * getCartTotal — Calculate the total price
   */
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Provide auth values to children
  const value = {
    user,
    token,
    loading,
    cart,
    register,
    login,
    logout,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
