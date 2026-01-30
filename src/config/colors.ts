/**
 * TN Forest Application Color Palette
 * 
 * This file defines the centralized color palette for the entire application.
 * Use these semantic color names for consistency across all components.
 * 
 * Usage:
 * - Import colors: import { colors } from '@/config/colors'
 * - Use in Tailwind: Reference the Tailwind class equivalents in comments
 */

// =============================================================================
// FOREST GREEN SCALE (Custom Brand Colors)
// =============================================================================
export const forestGreen = {
  50: '#f0f9f0',
  100: '#dcf2dc',
  200: '#bce5bc',
  300: '#8dd18d',
  400: '#56b856',
  500: '#2d7a2d',
  600: '#1f5f1f',
  700: '#1a4d1a',
  800: '#163e16',
  900: '#143314',
  950: '#0a1a0a',
} as const;

// =============================================================================
// SEMANTIC COLOR PALETTE
// =============================================================================

export const colors = {
  // ---------------------------------------------------------------------------
  // PRIMARY - Main brand color (Forest Green)
  // Used for: Primary buttons, active states, main CTAs, headers
  // ---------------------------------------------------------------------------
  primary: {
    lightest: forestGreen[50],    // Tailwind: forest-green-50 | Very light backgrounds
    lighter: forestGreen[100],    // Tailwind: forest-green-100 | Light backgrounds
    light: forestGreen[400],      // Tailwind: forest-green-400 | Light accents
    main: forestGreen[700],       // Tailwind: forest-green-700 | Primary buttons, borders
    dark: forestGreen[800],       // Tailwind: forest-green-800 | Hover states
    darker: forestGreen[900],     // Tailwind: forest-green-900 | Headers, overlays
    darkest: forestGreen[950],    // Tailwind: forest-green-950 | Deepest backgrounds
  },

  // ---------------------------------------------------------------------------
  // ACCENT - Secondary brand color (Lime)
  // Used for: Highlights, badges, icons, secondary CTAs, navbar
  // ---------------------------------------------------------------------------
  accent: {
    lightest: '#f7fee7',          // Tailwind: lime-50 | Very light backgrounds
    lighter: '#ecfccb',           // Tailwind: lime-100 | Light badge backgrounds
    light: '#a3e635',             // Tailwind: lime-400 | Borders, light accents
    main: '#b9f041',              // Custom | Navbar background, primary accent
    dark: '#84cc16',              // Tailwind: lime-500 | Buttons, active states
    darker: '#65a30d',            // Tailwind: lime-600 | Hover states
    darkest: '#3f6212',           // Tailwind: lime-800 | Badge text
  },

  // ---------------------------------------------------------------------------
  // BACKGROUND - Page and surface backgrounds
  // Used for: Page backgrounds, cards, sections, containers
  // ---------------------------------------------------------------------------
  background: {
    page: '#f8fafc',              // Tailwind: slate-50 | Main page background
    paper: '#ffffff',             // Tailwind: white | Cards, modals, paper surfaces
    subtle: '#f9fafb',            // Tailwind: gray-50 | Subtle section backgrounds
    muted: '#f3f4f6',             // Tailwind: gray-100 | Muted backgrounds, disabled
    elevated: '#ffffff',          // Tailwind: white | Elevated surfaces (dropdowns, tooltips)
    overlay: 'rgba(20, 51, 20, 0.9)', // forest-green-900/90 | Modal overlays, footer
  },

  // ---------------------------------------------------------------------------
  // TEXT - Typography colors
  // Used for: Headings, body text, labels, placeholders
  // ---------------------------------------------------------------------------
  text: {
    primary: '#1f2937',           // Tailwind: gray-800 | Main body text
    secondary: '#4b5563',         // Tailwind: gray-600 | Secondary text, descriptions
    tertiary: '#6b7280',          // Tailwind: gray-500 | Helper text, captions
    muted: '#9ca3af',             // Tailwind: gray-400 | Disabled text, placeholders
    inverse: '#ffffff',           // Tailwind: white | Text on dark backgrounds
    inverseSecondary: '#dcfce7',  // Tailwind: green-100 | Secondary text on dark
    heading: forestGreen[900],    // Tailwind: forest-green-900 | Page headings
    headingSecondary: forestGreen[800], // Tailwind: forest-green-800 | Section headings
    link: forestGreen[700],       // Tailwind: forest-green-700 | Links
    linkHover: forestGreen[600],  // Tailwind: forest-green-600 | Link hover states
  },

  // ---------------------------------------------------------------------------
  // BORDER - Border and divider colors
  // Used for: Card borders, input borders, dividers, separators
  // ---------------------------------------------------------------------------
  border: {
    lightest: '#f3f4f6',          // Tailwind: gray-100 | Very subtle borders
    light: '#e5e7eb',             // Tailwind: gray-200 | Default borders, dividers
    default: '#d1d5db',           // Tailwind: gray-300 | Input borders
    dark: '#9ca3af',              // Tailwind: gray-400 | Emphasized borders
    primary: forestGreen[700],    // Tailwind: forest-green-700 | Primary accent borders
    accent: '#a3e635',            // Tailwind: lime-400 | Accent borders, card highlights
    accentDark: '#84cc16',        // Tailwind: lime-500 | Stronger accent borders
  },

  // ---------------------------------------------------------------------------
  // STATUS - Feedback and state colors
  // Used for: Alerts, badges, form validation, notifications
  // ---------------------------------------------------------------------------
  status: {
    // Success
    success: {
      lightest: '#f0fdf4',        // Tailwind: green-50 | Success background light
      light: '#dcfce7',           // Tailwind: green-100 | Success background
      main: '#16a34a',            // Tailwind: green-600 | Success icons, text
      dark: '#15803d',            // Tailwind: green-700 | Success buttons
    },
    // Error
    error: {
      lightest: '#fef2f2',        // Tailwind: red-50 | Error input background
      light: '#fee2e2',           // Tailwind: red-100 | Error background
      main: '#dc2626',            // Tailwind: red-600 | Error icons, text
      dark: '#b91c1c',            // Tailwind: red-700 | Error buttons
      text: '#991b1b',            // Tailwind: red-800 | Error badge text
    },
    // Warning
    warning: {
      lightest: '#fffbeb',        // Tailwind: amber-50 | Warning background light
      light: '#ffedd5',           // Tailwind: orange-100 | Warning background
      main: '#ea580c',            // Tailwind: orange-600 | Warning icons, text
      dark: '#c2410c',            // Tailwind: orange-700 | Warning buttons
    },
    // Info
    info: {
      lightest: '#eff6ff',        // Tailwind: blue-50 | Info background light
      light: '#dbeafe',           // Tailwind: blue-100 | Info background
      border: '#bfdbfe',          // Tailwind: blue-200 | Info borders
      main: '#2563eb',            // Tailwind: blue-600 | Info icons, text
      dark: '#1d4ed8',            // Tailwind: blue-700 | Info buttons
      text: '#1e40af',            // Tailwind: blue-800 | Info badge text
    },
  },

  // ---------------------------------------------------------------------------
  // INTERACTIVE - Button and interactive element colors
  // Used for: Buttons, links, clickable elements
  // ---------------------------------------------------------------------------
  interactive: {
    // Primary button (Forest green)
    primaryDefault: forestGreen[700],
    primaryHover: forestGreen[600],
    primaryActive: forestGreen[800],
    primaryText: '#ffffff',

    // Secondary button (Lime accent)
    secondaryDefault: '#84cc16',  // Tailwind: lime-500
    secondaryHover: '#65a30d',    // Tailwind: lime-600
    secondaryActive: '#4d7c0f',   // Tailwind: lime-700
    secondaryText: forestGreen[900],

    // Ghost/Outline buttons
    ghostDefault: 'transparent',
    ghostHover: forestGreen[50],
    ghostBorder: forestGreen[700],
    ghostText: forestGreen[700],

    // Disabled state
    disabled: '#e5e7eb',          // Tailwind: gray-200
    disabledText: '#9ca3af',      // Tailwind: gray-400

    // Focus ring
    focusRing: '#84cc16',         // Tailwind: lime-500
  },

  // ---------------------------------------------------------------------------
  // COMPONENT-SPECIFIC - Colors tied to specific UI components
  // ---------------------------------------------------------------------------
  components: {
    // Navbar
    navbar: {
      background: '#b9f041',      // Custom bright lime
      text: forestGreen[950],
      textHover: '#bbf7d0',       // Tailwind: green-200
      mobileMenu: forestGreen[800],
    },
    // Footer
    footer: {
      background: 'rgba(20, 51, 20, 0.9)', // forest-green-900/90
      text: '#ffffff',
      textSecondary: '#dcfce7',   // Tailwind: green-100
      icon: '#86efac',            // Tailwind: green-300
      border: forestGreen[700],
    },
    // Cards
    card: {
      background: '#ffffff',
      border: '#e5e7eb',          // Tailwind: gray-200
      borderAccent: '#a3e635',    // Tailwind: lime-400
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    // Forms
    form: {
      inputBorder: '#d1d5db',     // Tailwind: gray-300
      inputFocus: '#84cc16',      // Tailwind: lime-500
      inputError: '#ef4444',      // Tailwind: red-500
      inputErrorBg: '#fef2f2',    // Tailwind: red-50
      label: forestGreen[900],
      placeholder: '#9ca3af',     // Tailwind: gray-400
    },
    // Scrollbar
    scrollbar: {
      thumb: '#a7f3d0',           // Custom emerald tint
      track: '#f0fdf4',           // Tailwind: green-50
    },
    // Badges/Tags
    badge: {
      inStockBg: '#ecfccb',       // Tailwind: lime-100
      inStockText: '#3f6212',     // Tailwind: lime-800
      outOfStockBg: '#fee2e2',    // Tailwind: red-100
      outOfStockText: '#991b1b',  // Tailwind: red-800
    },
  },

  // ---------------------------------------------------------------------------
  // GRADIENTS - Gradient definitions
  // ---------------------------------------------------------------------------
  gradients: {
    forest: 'linear-gradient(135deg, #0a1a0a 0%, #143314 50%, #1a4d1a 100%)',
    forestVertical: 'linear-gradient(180deg, #0a1a0a 0%, #143314 50%, #1a4d1a 100%)',
    accent: 'linear-gradient(135deg, #84cc16 0%, #b9f041 100%)',
    overlay: 'linear-gradient(to bottom, transparent 0%, rgba(20, 51, 20, 0.8) 100%)',
  },

  // ---------------------------------------------------------------------------
  // SHADOWS - Box shadow colors
  // ---------------------------------------------------------------------------
  shadows: {
    subtle: 'rgba(0, 0, 0, 0.05)',
    default: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.15)',
    strong: 'rgba(0, 0, 0, 0.25)',
    text: 'rgba(0, 0, 0, 0.5)',    // Text shadow on hero images
    accent: 'rgba(132, 204, 22, 0.3)', // Lime glow effect
  },
} as const;

// =============================================================================
// TAILWIND CLASS MAPPINGS
// =============================================================================
/**
 * Quick reference for Tailwind class equivalents:
 * 
 * PRIMARY:
 *   primary.main       -> bg-forest-green-700, text-forest-green-700
 *   primary.dark       -> bg-forest-green-800, hover:bg-forest-green-800
 *   primary.darker     -> bg-forest-green-900, text-forest-green-900
 * 
 * ACCENT:
 *   accent.main        -> bg-[#b9f041] (custom)
 *   accent.dark        -> bg-lime-500, text-lime-500
 *   accent.darker      -> bg-lime-600, hover:bg-lime-600
 * 
 * BACKGROUND:
 *   background.page    -> bg-slate-50
 *   background.paper   -> bg-white
 *   background.subtle  -> bg-gray-50
 * 
 * TEXT:
 *   text.primary       -> text-gray-800
 *   text.secondary     -> text-gray-600
 *   text.heading       -> text-forest-green-900, text-green-900
 * 
 * STATUS:
 *   status.success.main -> text-green-600, bg-green-600
 *   status.error.main   -> text-red-600, bg-red-600
 *   status.warning.main -> text-orange-600, bg-orange-600
 *   status.info.main    -> text-blue-600, bg-blue-600
 */

// Type exports for TypeScript support
export type ForestGreenShade = keyof typeof forestGreen;
export type ColorPalette = typeof colors;
export type PrimaryColors = typeof colors.primary;
export type AccentColors = typeof colors.accent;
export type StatusColors = typeof colors.status;

export default colors;
