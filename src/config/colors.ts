/**
 * TN Forest — Color Palette
 *
 * Single source of truth for app colors. Use semantic names so one change
 * updates the whole UI.
 *
 * Quick pick:
 *   Buttons (primary)   → interactive.primaryDefault + interactive.primaryText
 *   Buttons (secondary) → interactive.secondaryDefault + interactive.secondaryText
 *   Page background     → background.page
 *   Cards / modals      → background.paper
 *   Body text           → text.primary
 *   Headings            → text.heading
 *   Links               → text.link / text.linkHover
 *   Success/Error/etc   → status.success.main, status.error.main, …
 *
 * Import: import { colors, forestGreen } from '@/config/colors'
 */

// =============================================================================
// BRAND SCALES (base palettes — use semantic colors below in UI)
// =============================================================================

/** Forest green — primary brand. Use via colors.primary in components. */
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

/** Lime — accent/highlights. Use via colors.accent in components. */
export const lime = {
  50: '#f7fee7',
  100: '#ecfccb',
  200: '#d9f99d',
  300: '#bef264',
  400: '#a3e635',
  500: '#84cc16',
  600: '#65a30d',
  700: '#4d7c0f',
  800: '#3f6212',
  900: '#365314',
  950: '#1a2e05',
} as const;

/** Light blue — optional accent. Use via colors.lightBlue in components. */
export const lightBlue = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
  950: '#082f49',
} as const;

// =============================================================================
// SEMANTIC PALETTE (use these in components)
// =============================================================================

export const colors = {
  // ---------------------------------------------------------------------------
  // PRIMARY — Forest green. Use for: main CTAs, key actions, headers
  // ---------------------------------------------------------------------------
  primary: {
    lightest: forestGreen[50],
    lighter: forestGreen[100],
    light: forestGreen[400],
    main: forestGreen[700],
    dark: forestGreen[800],
    darker: forestGreen[900],
    darkest: forestGreen[950],
  },

  // ---------------------------------------------------------------------------
  // ACCENT — Lime. Use for: highlights, badges, secondary CTAs, navbar
  // ---------------------------------------------------------------------------
  accent: {
    lightest: lime[50],
    lighter: lime[100],
    light: lime[400],
    main: lime[300],
    dark: lime[500],
    darker: lime[600],
    darkest: lime[800],
  },

  // ---------------------------------------------------------------------------
  // LIGHT BLUE — Optional accent
  // ---------------------------------------------------------------------------
  lightBlue: {
    lightest: lightBlue[50],
    lighter: lightBlue[100],
    light: lightBlue[400],
    main: lightBlue[500],
    dark: lightBlue[600],
    darker: lightBlue[700],
    darkest: lightBlue[900],
  },

  // ---------------------------------------------------------------------------
  // BACKGROUND — Surfaces. Use for: page, cards, sections, overlays
  // default = section background (e.g. gallery) — reference --background: 48 100% 97% → warm cream
  // ---------------------------------------------------------------------------
  background: {
    default: '#fffef0',
    page: '#ffffff',
    homeBody: '#f3f4f6',
    paper: '#ffffff',
    subtle: '#f9fafb',
    muted: '#f3f4f6',
    elevated: '#ffffff',
    overlay: 'rgba(20, 51, 20, 0.9)',
  },

  // ---------------------------------------------------------------------------
  // TEXT — Typography. Use for: body, headings, links, labels
  // ---------------------------------------------------------------------------
  text: {
    primary: '#1f2937',
    secondary: '#4b5563',
    tertiary: '#6b7280',
    muted: '#9ca3af',
    inverse: '#ffffff',
    inverseSecondary: '#dcfce7',
    heading: forestGreen[900],
    headingSecondary: forestGreen[800],
    link: forestGreen[700],
    linkHover: forestGreen[600],
  },

  // ---------------------------------------------------------------------------
  // BORDER — Dividers and outlines. Use for: cards, inputs, separators
  // ---------------------------------------------------------------------------
  border: {
    lightest: '#f3f4f6',
    light: '#e5e7eb',
    default: '#d1d5db',
    dark: '#9ca3af',
    primary: forestGreen[700],
    accent: lime[400],
    accentDark: lime[500],
  },

  // ---------------------------------------------------------------------------
  // STATUS — Feedback. Use for: success, error, warning, info (alerts, badges)
  // ---------------------------------------------------------------------------
  status: {
    success: {
      lightest: '#f0fdf4',
      light: '#dcfce7',
      main: '#16a34a',
      dark: '#15803d',
    },
    error: {
      lightest: '#fef2f2',
      light: '#fee2e2',
      main: '#dc2626',
      dark: '#b91c1c',
      text: '#991b1b',
    },
    warning: {
      lightest: '#fffbeb',
      light: '#ffedd5',
      main: '#ea580c',
      dark: '#c2410c',
    },
    info: {
      lightest: '#eff6ff',
      light: '#dbeafe',
      border: '#bfdbfe',
      main: '#2563eb',
      dark: '#1d4ed8',
      text: '#1e40af',
    },
  },

  // ---------------------------------------------------------------------------
  // INTERACTIVE — Buttons and focus. Use for: buttons, disabled, focus ring
  // ---------------------------------------------------------------------------
  interactive: {
    primaryDefault: forestGreen[700],
    primaryHover: forestGreen[600],
    primaryActive: forestGreen[800],
    primaryText: '#ffffff',

    secondaryDefault: lime[500],
    secondaryHover: lime[600],
    secondaryActive: lime[700],
    secondaryText: forestGreen[900],

    ghostDefault: 'transparent',
    ghostHover: forestGreen[50],
    ghostBorder: forestGreen[700],
    ghostText: forestGreen[700],

    disabled: '#e5e7eb',
    disabledText: '#9ca3af',

    focusRing: lime[500],
  },

  // ---------------------------------------------------------------------------
  // COMPONENTS — Per-component overrides when needed
  // ---------------------------------------------------------------------------
  components: {
    navbar: {
      background: '#36281b',
      text: forestGreen[950],
      textHover: forestGreen[200],
      mobileMenu: forestGreen[800],
      shopButtonBg: '#a79c82',
      shopButtonText: '#ffffff',
    },
    footer: {
      background: 'rgba(20, 51, 20, 0.9)',
      overlay: 'rgba(154, 147, 141, 0.85)', // #9a938d with opacity so footer bg image shows through
      text: '#ffffff',
      textSecondary: 'rgba(255, 254, 240, 0.8)',
      icon: '#fcd34d',
      border: 'rgba(255, 255, 255, 0.1)',
    },
    card: {
      background: '#ffffff',
      border: '#e5e7eb',
      borderAccent: lime[400],
      shadow: 'rgba(0, 0, 0, 0.1)',
    },
    form: {
      inputBorder: '#d1d5db',
      inputFocus: lime[500],
      inputError: '#ef4444',
      inputErrorBg: '#fef2f2',
      label: forestGreen[900],
      placeholder: '#9ca3af',
    },
    scrollbar: {
      thumb: '#a7f3d0',
      track: '#f0fdf4',
    },
    badge: {
      inStockBg: lime[100],
      inStockText: lime[800],
      outOfStockBg: '#fee2e2',
      outOfStockText: '#991b1b',
    },
  },

  // ---------------------------------------------------------------------------
  // GRADIENTS (derived from brand scales)
  // ---------------------------------------------------------------------------
  gradients: {
    forest: `linear-gradient(135deg, ${forestGreen[950]} 0%, ${forestGreen[900]} 50%, ${forestGreen[700]} 100%)`,
    forestVertical: `linear-gradient(180deg, ${forestGreen[950]} 0%, ${forestGreen[900]} 50%, ${forestGreen[700]} 100%)`,
    accent: `linear-gradient(135deg, ${lime[500]} 0%, ${lime[300]} 100%)`,
    overlay: 'linear-gradient(to bottom, transparent 0%, rgba(20, 51, 20, 0.8) 100%)',
    cream: 'linear-gradient(180deg, #fefce8 0%, #fef9c3 30%, #f8fafc 100%)',
    hero: `linear-gradient(135deg, ${forestGreen[800]} 0%, ${forestGreen[700]} 50%, ${forestGreen[600]} 100%)`,
    gold: 'linear-gradient(90deg, #d97706 0%, #b45309 50%, #92400e 100%)',
  },

  // ---------------------------------------------------------------------------
  // SHADOWS
  // ---------------------------------------------------------------------------
  shadows: {
    subtle: 'rgba(0, 0, 0, 0.05)',
    default: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.15)',
    strong: 'rgba(0, 0, 0, 0.25)',
    elevated: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    soft: '0 2px 8px rgba(0, 0, 0, 0.08)',
    gold: '0 4px 14px rgba(180, 83, 9, 0.25)',
    text: 'rgba(0, 0, 0, 0.5)',
    accent: 'rgba(132, 204, 22, 0.3)',
  },

  // ---------------------------------------------------------------------------
  // FOREST GOLD — Carousel/slider accent (active dot, highlights). Amber/gold.
  // ---------------------------------------------------------------------------
  forestGold: '#b45309',

  // ---------------------------------------------------------------------------
  // FOREST OLIVE / FOREST TEAL — Sidebar tickers (news = olive, events = teal).
  // ---------------------------------------------------------------------------
  forestOlive: '#4a5d23',
  forestTeal: '#0f766e',

  // ---------------------------------------------------------------------------
  // NEWS & EVENTS TICKER — Recent Events / Latest News component (header + body).
  // ---------------------------------------------------------------------------
  newsEventsTicker: {
    header: '#8b7a66',
    body: '#f4f6f3',
  },

  // ---------------------------------------------------------------------------
  // FOREST CREAM — Shop section background (solid cream).
  // ---------------------------------------------------------------------------
  forestCream: '#fef9c3',

  // ---------------------------------------------------------------------------
  // SHOP PREVIEW — Home page shop preview section background.
  // ---------------------------------------------------------------------------
  shopPreviewBg: '#c7c3c0',

  // ---------------------------------------------------------------------------
  // MISSION & VISION — Home page Our Mission / Our Vision card background.
  // ---------------------------------------------------------------------------
  missionVisionCardBg: '#ddd5c8',

  // ---------------------------------------------------------------------------
  // HOME PAGE — Text and headings to match the warm, earthy page palette.
  // ---------------------------------------------------------------------------
  home: {
    heading: '#36281b',       // warm dark brown (navbar tone)
    headingSecondary: '#4a4238',  // card titles (Mission/Vision)
    text: '#3d3832',         // body text
    textSecondary: '#5c5549',    // secondary / muted
    cardBorder: '#a79c82',   // shop preview card top border (matches shop button)
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
export type LimeShade = keyof typeof lime;
export type LightBlueShade = keyof typeof lightBlue;
export type ColorPalette = typeof colors;
export type PrimaryColors = typeof colors.primary;
export type AccentColors = typeof colors.accent;
export type StatusColors = typeof colors.status;

export default colors;
