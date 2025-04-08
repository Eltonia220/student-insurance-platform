// src/api.js
import axios from 'axios';
import { getCompactToken, refreshAuthToken } from './auth';

// Create axios instance with safe defaults
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  maxBodyLength: 5 * 1024 * 1024, // 5MB max payload
  maxContentLength: 5 * 1024 * 1024, // 5MB max response
  headers: {
    'Content-Type': 'application/json',
    // No other headers by default
  }
});

// Request interceptor to manage headers and tokens
api.interceptors.request.use(async (config) => {
  // Add minimal auth token if needed
  if (config.url !== '/auth/refresh' && config.url !== '/auth/login') {
    const token = await getCompactToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // Remove any undefined headers
  Object.keys(config.headers).forEach(key => {
    if (config.headers[key] === undefined) {
      delete config.headers[key];
    }
  });

  // Log warning for large headers (dev only)
  if (process.env.NODE_ENV === 'development') {
    const headersSize = JSON.stringify(config.headers).length;
    if (headersSize > 2048) { // 2KB
      console.warn(`Large headers detected: ${headersSize} bytes`, config.headers);
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 431 errors specifically
    if (error.response?.status === 431) {
      console.error('Header size error - cleaning cookies and retrying');
      document.cookie.split(';').forEach(c => {
        document.cookie = c.replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
      return api(originalRequest);
    }

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAuthToken();
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login'; // Redirect if refresh fails
        return Promise.reject(refreshError);
      }
    }

    // Standard error handling
    return Promise.reject(error);
  }
);

// Helper methods for specific endpoints
export const fetchPlans = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    return await api.get('/plans', {
      params,
      headers: {
        'X-Request-Origin': 'web-app' // Example custom header
      }
    });
  } catch (error) {
    throw new Error(`Failed to fetch plans: ${error.message}`);
  }
};

// Other API methods
export const createPlan = (planData) => api.post('/plans', planData);
export const updatePlan = (id, updates) => api.patch(`/plans/${id}`, updates);
export const deletePlan = (id) => api.delete(`/plans/${id}`);

export default api;