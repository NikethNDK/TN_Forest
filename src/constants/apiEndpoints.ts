/**
 * API Endpoints Constants
 * 
 * This file contains all API endpoint constants for the application.
 * Update these when backend endpoints are defined.
 */

// Base API URL (to be configured when backend is ready)
export const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8500/api';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    REFRESH: '/users/refresh',
    ME: '/users/me',
  },
} as const;

