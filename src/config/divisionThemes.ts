/**
 * Division Theme Configuration
 *
 * Defines color themes for each division's header, navbar, and footer.
 * When contentPalette is set, division pages use only these colors (no global green/lime).
 *
 * Forest-genetics: uses only #374151, #ffffff, and rgba(55, 65, 81, x).
 */

import { colors } from './colors';

/** Content palette for division page content (optional). When set, use only these colors. */
export interface DivisionContentPalette {
  primary: string;           // main actions, links, borders
  primaryHover: string;
  primaryLight: string;      // light bg for selected/hover
  primaryLightest: string;   // lightest bg
  heading: string;
  headingSecondary: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  bgPaper: string;
  bgPage: string;
  bgMuted: string;
  buttonBg: string;
  buttonBgHover: string;
  buttonText: string;
  shopButtonBg?: string;     // distinct color for shop/eco-store button (optional)
  shopButtonText?: string;   // text color for shop button (optional)
}

export interface DivisionTheme {
  headerBg: string;
  headerText: string;
  navbarBg: string;
  navbarText: string;
  footerBg: string;
  footerOverlay: string;
  footerText: string;
  /** When set, division page content uses only these colors (e.g. forest-genetics gray-only). */
  contentPalette?: DivisionContentPalette;
}

/**
 * Default theme (used for home page and divisions without specific themes)
 */
export const defaultTheme: DivisionTheme = {
  headerBg: colors.background.page,
  headerText: colors.text.heading,
  navbarBg: colors.components.navbar.background,
  navbarText: colors.text.inverse,
  footerBg: colors.components.footer.background,
  footerOverlay: colors.components.footer.overlay,
  footerText: colors.components.footer.text,
};

/** Forest-genetics: only #374151, #ffffff, rgba(55,65,81,0.9) and derived shades */
const FG_DARK = '#374151';
const FG_WHITE = '#ffffff';
const FG_RGBA = (a: number) => `rgba(55, 65, 81, ${a})`;

/**
 * Division-specific color themes
 * Key: division slug (must match the slug in mockData.ts)
 */
export const divisionThemes: Record<string, DivisionTheme> = {
  'forest-genetics': {
    headerBg: FG_WHITE,
    headerText: FG_DARK,
    navbarBg: FG_DARK,
    navbarText: FG_WHITE,
    footerBg: FG_RGBA(0.9),
    footerOverlay: FG_RGBA(0.9),
    footerText: FG_WHITE,
    contentPalette: {
      primary: FG_DARK,
      primaryHover: FG_RGBA(0.85),
      primaryLight: FG_RGBA(0.15),
      primaryLightest: FG_RGBA(0.06),
      heading: FG_DARK,
      headingSecondary: FG_DARK,
      text: FG_DARK,
      textSecondary: FG_RGBA(0.85),
      textTertiary: FG_RGBA(0.7),
      border: FG_RGBA(0.25),
      bgPaper: FG_WHITE,
      bgPage: FG_RGBA(0.04),
      bgMuted: FG_RGBA(0.08),
      buttonBg: FG_DARK,
      buttonBgHover: FG_RGBA(0.9),
      buttonText: FG_WHITE,
      shopButtonBg: '#6b7280', // Medium gray (gray-500) - stands out from dark navbar
      shopButtonText: FG_WHITE,
    },
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
