/**
 * Design System Tokens - Premium Fintech Edition
 * VolatiSense v2.1 Refined
 * Inspired by Bloomberg Terminal, Stripe Dashboard, Apple Design
 */

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '5rem',    // 80px
  '5xl': '6rem',    // 96px
} as const

export const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.25rem', // 20px - refined for consistency
  '3xl': '1.5rem',  // 24px
  full: '9999px'
} as const

export const shadows = {
  // Refined shadows for depth and premium feel
  xs: '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
  sm: '0 2px 4px -1px rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
  md: '0 4px 6px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
  lg: '0 10px 15px -4px rgba(15, 23, 42, 0.10), 0 4px 6px -3px rgba(15, 23, 42, 0.05)',
  xl: '0 20px 25px -6px rgba(15, 23, 42, 0.12), 0 8px 10px -5px rgba(15, 23, 42, 0.06)',
  '2xl': '0 25px 50px -12px rgba(15, 23, 42, 0.20)',
  '3xl': '0 35px 60px -15px rgba(15, 23, 42, 0.25)',
  
  // Glow effects for interactive elements
  glow: '0 0 20px rgba(59, 130, 246, 0.25), 0 0 40px rgba(59, 130, 246, 0.1)',
  'glow-sm': '0 0 12px rgba(59, 130, 246, 0.15)',
  'glow-lg': '0 0 32px rgba(59, 130, 246, 0.3), 0 0 64px rgba(59, 130, 246, 0.15)',
  
  // Card shadows with depth
  card: '0 2px 8px -2px rgba(15, 23, 42, 0.08), 0 1px 4px -1px rgba(15, 23, 42, 0.04)',
  'card-hover': '0 12px 32px -8px rgba(59, 130, 246, 0.18), 0 4px 16px -4px rgba(59, 130, 246, 0.08)',
  
  // Inner shadows for depth
  inner: 'inset 0 2px 4px 0 rgba(15, 23, 42, 0.06)',
  'inner-lg': 'inset 0 4px 8px 0 rgba(15, 23, 42, 0.08)',
} as const

export const typography = {
  h1: {
    fontSize: '3.5rem',      // 56px
    lineHeight: '1.1',
    fontWeight: '700',
    letterSpacing: '-0.025em'  // Tighter for premium look
  },
  h2: {
    fontSize: '2.5rem',      // 40px
    lineHeight: '1.15',      // Improved readability
    fontWeight: '700',       // Stronger hierarchy
    letterSpacing: '-0.02em'
  },
  h3: {
    fontSize: '1.875rem',    // 30px
    lineHeight: '1.3',
    fontWeight: '600',
    letterSpacing: '-0.015em'
  },
  h4: {
    fontSize: '1.5rem',      // 24px
    lineHeight: '1.4',
    fontWeight: '600',
    letterSpacing: '-0.01em'
  },
  h5: {
    fontSize: '1.25rem',     // 20px
    lineHeight: '1.5',
    fontWeight: '600',
    letterSpacing: '-0.005em'
  },
  bodyLg: {
    fontSize: '1.125rem',    // 18px
    lineHeight: '1.75',      // Better readability
    fontWeight: '400',
    letterSpacing: '0'
  },
  body: {
    fontSize: '1rem',        // 16px
    lineHeight: '1.625',     // Improved from 1.5
    fontWeight: '400',
    letterSpacing: '0'
  },
  bodySm: {
    fontSize: '0.875rem',    // 14px
    lineHeight: '1.6',       // Better readability
    fontWeight: '400',
    letterSpacing: '0'
  },
  bodyXs: {
    fontSize: '0.75rem',     // 12px
    lineHeight: '1.5',
    fontWeight: '500',       // Slightly bolder for small text
    letterSpacing: '0.01em'
  },
  label: {
    fontSize: '0.8125rem',   // 13px
    lineHeight: '1.5',
    fontWeight: '500',
    letterSpacing: '0.02em', // Wider spacing for labels
    textTransform: 'uppercase' as const
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
