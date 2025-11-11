/**
 * Design System Tokens
 * VolatiSense v2 Foundation
 */

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const

export const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px'
} as const

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 20px rgba(59, 130, 246, 0.3)',
  'card-hover': '0 20px 40px -12px rgba(59, 130, 246, 0.2)',
} as const

export const typography = {
  h1: {
    fontSize: '3.5rem',      // 56px
    lineHeight: '1.1',
    fontWeight: '700',
    letterSpacing: '-0.02em'
  },
  h2: {
    fontSize: '2.5rem',      // 40px
    lineHeight: '1.2',
    fontWeight: '600',
    letterSpacing: '-0.01em'
  },
  h3: {
    fontSize: '1.875rem',    // 30px
    lineHeight: '1.3',
    fontWeight: '600',
    letterSpacing: '-0.01em'
  },
  h4: {
    fontSize: '1.5rem',      // 24px
    lineHeight: '1.4',
    fontWeight: '600',
    letterSpacing: '0'
  },
  bodyLg: {
    fontSize: '1.125rem',    // 18px
    lineHeight: '1.75',
    fontWeight: '400'
  },
  body: {
    fontSize: '1rem',        // 16px
    lineHeight: '1.5',
    fontWeight: '400'
  },
  bodySm: {
    fontSize: '0.875rem',    // 14px
    lineHeight: '1.5',
    fontWeight: '400'
  },
  bodyXs: {
    fontSize: '0.75rem',     // 12px
    lineHeight: '1.5',
    fontWeight: '400'
  },
} as const

// Financial semantic colors
export const financialColors = {
  profit: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  loss: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
} as const

// Metric category colors
export const metricColors = {
  npm: '#3B82F6',      // Primary metric - blue
  roa: '#8B5CF6',      // Secondary metric - purple
  var: '#F59E0B',      // Risk metric - amber
  cvar: '#EF4444',     // Critical risk - red
  hedge: '#10B981',    // Hedge effectiveness - green
} as const

// Chart color palettes
export const chartColors = {
  primary: ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
  sequential: ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
  diverging: ['#B91C1C', '#EF4444', '#F8FAFC', '#3B82F6', '#1E3A8A'],
  profit: ['#064E3B', '#047857', '#10B981', '#6EE7B7', '#D1FAE5'],
  loss: ['#7F1D1D', '#B91C1C', '#EF4444', '#FCA5A5', '#FEE2E2'],
} as const
