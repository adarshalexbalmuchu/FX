/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
  colors: {
  primary: {
  '50': '#EFF6FF',
  '100': '#DBEAFE',
  '200': '#BFDBFE',
  '300': '#93C5FD',
  '400': '#60A5FA',
  '500': '#3B82F6',
  '600': '#2563EB',
  '700': '#1D4ED8',
  '800': '#1E40AF',
  '900': '#1E3A8A',
  DEFAULT: 'hsl(var(--primary))',
  foreground: 'hsl(var(--primary-foreground))'
  },
  secondary: {
  '50': '#F8FAFC',
  '100': '#F1F5F9',
  '200': '#E2E8F0',
  '300': '#CBD5E1',
  '400': '#94A3B8',
  '500': '#64748B',
  '600': '#475569',
  '700': '#334155',
  '800': '#1E293B',
  '900': '#0F172A',
  DEFAULT: 'hsl(var(--secondary))',
  foreground: 'hsl(var(--secondary-foreground))'
  },
  success: {
  '50': '#ECFDF5',
  '500': '#10B981',
  '600': '#059669',
  DEFAULT: '#10B981'
  },
  warning: {
  '50': '#FFFBEB',
  '500': '#F59E0B',
  '600': '#D97706',
  DEFAULT: '#F59E0B'
  },
  danger: {
  '50': '#FEF2F2',
  '500': '#EF4444',
  '600': '#DC2626',
  DEFAULT: '#EF4444'
  },
  profit: {
  '50': '#ECFDF5',
  '100': '#D1FAE5',
  '200': '#A7F3D0',
  '300': '#6EE7B7',
  '400': '#34D399',
  '500': '#10B981',
  '600': '#059669',
  '700': '#047857',
  '800': '#065F46',
  '900': '#064E3B',
  },
  loss: {
  '50': '#FEF2F2',
  '100': '#FEE2E2',
  '200': '#FECACA',
  '300': '#FCA5A5',
  '400': '#F87171',
  '500': '#EF4444',
  '600': '#DC2626',
  '700': '#B91C1C',
  '800': '#991B1B',
  '900': '#7F1D1D',
  },
  neutral: {
  '50': '#F8FAFC',
  '100': '#F1F5F9',
  '200': '#E2E8F0',
  '300': '#CBD5E1',
  '400': '#94A3B8',
  '500': '#64748B',
  '600': '#475569',
  '700': '#334155',
  '800': '#1E293B',
  '900': '#0F172A',
  },
  metric: {
  npm: '#3B82F6',
  roa: '#8B5CF6',
  var: '#F59E0B',
  cvar: '#EF4444',
  hedge: '#10B981',
  },
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: {
  DEFAULT: 'hsl(var(--card))',
  foreground: 'hsl(var(--card-foreground))'
  },
  popover: {
  DEFAULT: 'hsl(var(--popover))',
  foreground: 'hsl(var(--popover-foreground))'
  },
  muted: {
  DEFAULT: 'hsl(var(--muted))',
  foreground: 'hsl(var(--muted-foreground))'
  },
  accent: {
  DEFAULT: 'hsl(var(--accent))',
  foreground: 'hsl(var(--accent-foreground))'
  },
  destructive: {
  DEFAULT: 'hsl(var(--destructive))',
  foreground: 'hsl(var(--destructive-foreground))'
  },
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  chart: {
  '1': 'hsl(var(--chart-1))',
  '2': 'hsl(var(--chart-2))',
  '3': 'hsl(var(--chart-3))',
  '4': 'hsl(var(--chart-4))',
  '5': 'hsl(var(--chart-5))'
  }
  },
  fontFamily: {
  heading: ['Space Grotesk', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
  mono: ['JetBrains Mono', 'IBM Plex Mono', 'ui-monospace', 'Menlo', 'Monaco', 'monospace']
  },
  fontSize: {
  'h1': ['3.5rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.02em' }],
  'h2': ['2.5rem', { lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.01em' }],
  'h3': ['1.875rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.01em' }],
  'h4': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
  'body-lg': ['1.125rem', { lineHeight: '1.75' }],
  'body': ['1rem', { lineHeight: '1.5' }],
  'body-sm': ['0.875rem', { lineHeight: '1.5' }],
  'body-xs': ['0.75rem', { lineHeight: '1.5' }],
  },
  borderRadius: {
  '2xl': '1rem',
  '3xl': '1.5rem',
  '4xl': '2rem',
  lg: 'var(--radius)',
  md: 'calc(var(--radius) - 2px)',
  sm: 'calc(var(--radius) - 4px)'
  },
  boxShadow: {
  soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
  glass: '0 8px 32px 0 rgba(59, 130, 246, 0.1)',
  glow: '0 0 20px rgba(59, 130, 246, 0.3)',
  card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  'card-hover': '0 20px 40px -12px rgba(59, 130, 246, 0.2)'
  },
  animation: {
  'fade-in': 'fadeIn 0.5s ease-in-out',
  'slide-up': 'slideUp 0.6s ease-out',
  'scale-in': 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
  },
  keyframes: {
  fadeIn: {
  '0%': { opacity: '0' },
  '100%': { opacity: '1' }
  },
  slideUp: {
  '0%': { transform: 'translateY(20px)', opacity: '0' },
  '100%': { transform: 'translateY(0)', opacity: '1' }
  },
  scaleIn: {
  '0%': { transform: 'scale(0.95)', opacity: '0' },
  '100%': { transform: 'scale(1)', opacity: '1' }
  },
  pulseSoft: {
  '0%, 100%': { opacity: '1' },
  '50%': { opacity: '0.8' }
  }
  },
  backdropBlur: {
  xs: '2px'
  },
  scale: {
  '103': '1.03'
  }
  }
  },
  plugins: [require("tailwindcss-animate")],
}
