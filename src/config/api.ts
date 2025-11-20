import axios from 'axios';

// This will be the function from AuthContext that handles logging out.
let logoutCallback: (showToast?: boolean) => void;

/**
 * A function for the AuthProvider to set its signOut function.
 * This allows the interceptor to trigger a logout globally and gracefully.
 */
export const setLogoutCallback = (callback: (showToast?: boolean) => void) => {
  logoutCallback = callback;
};

// Base URL for your backend API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and automatic logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 error and ensure it's not a retry request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request to avoid infinite loops

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // If no refresh token, logout immediately
          if (logoutCallback) logoutCallback(true);
          return Promise.reject(error);
        }

        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token } = response.data;
        localStorage.setItem('authToken', token);

        // Update the authorization header for the original request and retry it
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);

      } catch (refreshError) {
        // If the refresh token request itself fails, trigger the logout.
        // This is the crucial part for automatic logout on token expiry.
        console.error("Token refresh failed. Logging out.", refreshError);
        if (logoutCallback) {
          logoutCallback(true); // Call the signOut function from AuthContext
        }
        return Promise.reject(refreshError);
      }
    }

    // For all other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default api;

// API endpoints (remains the same)
export const endpoints = {
  auth: {
    login: '/auth/login',
    studentLogin: '/auth/student/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
  },
  users: {
    profile: '/users/profile',
    update: '/users/update',
  },
};