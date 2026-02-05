/**
 * Tailwind config - theme colors from single source: src/config/colors.ts
 * Changing the color scheme: edit only src/config/colors.ts
 */

import type { Config } from 'tailwindcss';
import { colors, forestGreen } from './src/config/colors';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': forestGreen,
        'forest-gold': colors.forestGold,
        'forest-olive': colors.forestOlive,
        'forest-teal': colors.forestTeal,
        'forest-cream': colors.forestCream,
        primary: colors.primary,
        accent: colors.accent,
        background: { DEFAULT: colors.background.default, ...colors.background },
        // "content" = text palette (avoids Tailwind conflict → classes: text-content-heading, etc.)
        content: colors.text,
        foreground: colors.text.heading,
        border: colors.border,
        status: colors.status,
        interactive: colors.interactive,
        footer: colors.components.footer,
        card: colors.components.card,
        form: colors.components.form,
        badge: colors.components.badge,
        lightBlue: colors.lightBlue,
      },
      backgroundImage: {
        'gradient-cream': colors.gradients.cream,
        'gradient-hero': colors.gradients.hero,
        'gradient-gold': colors.gradients.gold,
      },
      boxShadow: {
        elevated: colors.shadows.elevated,
        soft: colors.shadows.soft,
        gold: colors.shadows.gold,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
