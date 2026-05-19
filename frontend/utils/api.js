// ======================================================
// utils/api.js — Axios Instance for Backend API
// ======================================================
// Creates a configured Axios instance with:
//   - Base URL pointing to your backend
//   - Default headers and timeout
//   - Request interceptor to attach JWT token
//   - Response interceptor for error handling
//
// ⚠️ IMPORTANT: Replace the BASE_URL below with your
//    actual machine's local IP address or deployed URL.
// ======================================================

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ==============================================
// 🔧 CHANGE THIS to your computer's local IP
//    Find it by running `ipconfig` (Windows) or
//    `ifconfig` (Mac/Linux) in your terminal.
//    Example: http://192.168.1.5:5000
// ==============================================
const BASE_URL = 'http://192.168.1.7:5000';

// Create Axios instance with default configuration
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15000, // 15-second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================================
// Request Interceptor — Attach JWT token
// ==============================================
api.interceptors.request.use(
  async (config) => {
    try {
      // Retrieve token from local storage
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error reading token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==============================================
// Response Interceptor — Handle errors globally
// ==============================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error details for debugging
    if (error.response) {
      console.log('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.log('Network Error: No response received');
    } else {
      console.log('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
export { BASE_URL };
