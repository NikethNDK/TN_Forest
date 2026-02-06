/**
 * Division Theme Configuration
 * 
 * Defines color themes for each division's header, navbar, and footer.
 * Divisions without a specific theme will use the default (home page) theme.
 * 
 * To add a new division theme:
 * 1. Add a new entry with the division slug as the key
 * 2. Define headerBg, headerText, navbarBg, navbarText, footerBg, footerOverlay, and footerText
 */

import { colors } from './colors';

export interface DivisionTheme {
  headerBg: string;
  headerText: string;
  navbarBg: string;
  navbarText: string;
  footerBg: string;
  footerOverlay: string;
  footerText: string;
}

/**
 * Default theme (used for home page and divisions without specific themes)
 */
export const defaultTheme: DivisionTheme = {
  headerBg: colors.background.page,
  headerText: colors.text.heading,
  navbarBg: colors.primary.main,
  navbarText: colors.text.inverse,
  footerBg: colors.components.footer.background,
  footerOverlay: colors.components.footer.overlay,
  footerText: colors.components.footer.text,
};

/**
 * Division-specific color themes
 * Key: division slug (must match the slug in mockData.ts)
 */
export const divisionThemes: Record<string, DivisionTheme> = {
  'forest-genetics': {
    // Grayscale theme based on color wheel
    headerBg: '#374151', // Dark gray (gray-700)
    headerText: '#ffffff', // White text
    navbarBg: '#374151', // Dark gray (gray-700)
    navbarText: '#ffffff', // White text
    footerBg: 'rgba(55, 65, 81, 0.9)', // Dark gray with transparency
    footerOverlay: 'rgba(55, 65, 81, 0.9)', // Dark gray overlay
    footerText: '#ffffff', // White text
  },
  // Add more division themes here as needed:
  // 'state-forest-research': { ... },
  // 'modern-nursery': { ... },
  // 'industrial-wood': { ... },
  // 'agro-forestry': { ... },
};

/**
 * Get theme for a division by slug
 * Returns the division-specific theme if available, otherwise returns default theme
 */
export const getDivisionTheme = (divisionSlug: string | null | undefined): DivisionTheme => {
  if (!divisionSlug) {
    return defaultTheme;
  }
  return divisionThemes[divisionSlug] || defaultTheme;
};
