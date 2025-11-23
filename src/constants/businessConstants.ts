/**
 * Business Constants
 * 
 * This file contains business logic constants, default values, and configuration
 * that are used throughout the application.
 */

// Default values
export const DEFAULT_VALUES = {
  // Pagination
  PAGE_SIZE: 10,
  INITIAL_PAGE: 1,
  
  // Shop
  INITIAL_PRODUCT_LIMIT: 4,
  
  // Contact form
  MAX_MESSAGE_LENGTH: 1000,
  MAX_NAME_LENGTH: 100,
  MAX_SUBJECT_LENGTH: 200,
} as const;

// Configuration
export const CONFIG = {
  // Office hours
  OFFICE_HOURS: {
    WEEKDAYS: '9:00 AM - 5:00 PM',
    WEEKEND: 'Closed',
  },
  
  // Contact information placeholders
  CONTACT: {
    PHONE: '+91 44 XXXXX 5678',
    EMAIL: 'info@tnfrd.gov.in',
    ADDRESS: 'Forest Department Complex, Chennai, Tamil Nadu 600006, India',
  },
} as const;

// Categories
export const PRODUCT_CATEGORIES = {
  SAPLINGS: 'Saplings',
  SEEDS: 'Seeds',
  PRODUCTS: 'Products',
  CRAFTS: 'Crafts',
  PUBLICATIONS: 'Publications',
  TOOLS: 'Tools',
} as const;

