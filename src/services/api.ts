/**
 * Axios instance configuration for API calls.
 * 
 * This file exports a configured axios instance with:
 * - Base URL set to backend API
 * - Credentials included for cookie-based authentication
 * - Request/response interceptors for error handling
 */
import axios from 'axios';
import { API_BASE_URL } from '../constants/apiEndpoints';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:8500/api',
  withCredentials: true, // Include cookies in requests (required for JWT authentication)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens to headers here if needed
    // For now, we're using HTTP-only cookies, so no manual token handling needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          // You can redirect to login page here if needed
          console.error('Unauthorized: Please login again');
          break;
        case 403:
          // Forbidden - insufficient permissions
          console.error('Forbidden: Insufficient permissions');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error: Please try again later');
          break;
        default:
          console.error(`Error ${status}: ${data?.message || 'An error occurred'}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network error: Please check your connection');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;

