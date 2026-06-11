// src/services/api.js
import axios from 'axios';

// Use environment variable if available, otherwise fallback to your Render URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nora-clothing-backend.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Request interceptor (unchanged, but robust)
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – helpful for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log network errors clearly
    if (error.message === 'Network Error') {
      console.error('❌ API Network Error – is your backend running?', error.config?.baseURL);
    }
    return Promise.reject(error);
  }
);

export default api;