/** @type {import('tailwindcss').Config} */
export default {
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
  '950': '#172554',
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
  '950': '#020617',
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
  '100': '#FEF3C7',
  '200': '#FDE68A',
  '300': '#FCD34D',
  '400': '#FBBF24',
  '500': '#F59E0B',
  '600': '#D97706',
  '700': '#B45309',
  '800': '#92400E',
  '900': '#78350F',
  '950': '#431407',
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
  '950': '#022C22',
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
  '950': '#450A0A',
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
  heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
  body: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['JetBrains Mono', 'IBM Plex Mono', 'ui-monospace', 'Menlo', 'Monaco', 'monospace']
  },
  fontSize: {
  'h1': ['3.5rem', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-0.025em' }],
  'h2': ['2.5rem', { lineHeight: '1.15', fontWeight: '700', letterSpacing: '-0.02em' }],
  'h3': ['1.875rem', { lineHeight: '1.3', fontWeight: '600', letterSpacing: '-0.015em' }],
  'h4': ['1.5rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '-0.01em' }],
  'h5': ['1.25rem', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '-0.005em' }],
  'body-lg': ['1.125rem', { lineHeight: '1.75', fontWeight: '400' }],
  'body': ['1rem', { lineHeight: '1.625', fontWeight: '400' }],
  'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
  'body-xs': ['0.75rem', { lineHeight: '1.5', fontWeight: '500', letterSpacing: '0.01em' }],
  'label': ['0.8125rem', { lineHeight: '1.5', fontWeight: '500', letterSpacing: '0.02em', textTransform: 'uppercase' }],
  },
  borderRadius: {
  '2xl': '1.25rem',
  '3xl': '1.5rem',
  '4xl': '2rem',
  lg: 'var(--radius)',
  md: 'calc(var(--radius) - 2px)',
  sm: 'calc(var(--radius) - 4px)'
  },
  boxShadow: {
  'xs': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
  'sm': '0 2px 4px -1px rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
  'md': '0 4px 6px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
  'lg': '0 10px 15px -4px rgba(15, 23, 42, 0.10), 0 4px 6px -3px rgba(15, 23, 42, 0.05)',
  'xl': '0 20px 25px -6px rgba(15, 23, 42, 0.12), 0 8px 10px -5px rgba(15, 23, 42, 0.06)',
  '2xl': '0 25px 50px -12px rgba(15, 23, 42, 0.20)',
  '3xl': '0 35px 60px -15px rgba(15, 23, 42, 0.25)',
  glow: '0 0 20px rgba(59, 130, 246, 0.25), 0 0 40px rgba(59, 130, 246, 0.1)',
  'glow-sm': '0 0 12px rgba(59, 130, 246, 0.15)',
  'glow-lg': '0 0 32px rgba(59, 130, 246, 0.3), 0 0 64px rgba(59, 130, 246, 0.15)',
  card: '0 2px 8px -2px rgba(15, 23, 42, 0.08), 0 1px 4px -1px rgba(15, 23, 42, 0.04)',
  'card-hover': '0 12px 32px -8px rgba(59, 130, 246, 0.18), 0 4px 16px -4px rgba(59, 130, 246, 0.08)',
  inner: 'inset 0 2px 4px 0 rgba(15, 23, 42, 0.06)',
  'inner-lg': 'inset 0 4px 8px 0 rgba(15, 23, 42, 0.08)'
  },
  animation: {
  'fade-in': 'fadeInPage 0.5s ease-out',
  'slide-in-right': 'slideInRight 0.4s ease-out',
  'scale-in': 'scaleIn 0.3s ease-out',
  'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'glow': 'glow 2.5s ease-in-out infinite',
  'gradient-shift': 'gradient-shift 3s ease infinite'
  },
  keyframes: {
  fadeInPage: {
  'from': { opacity: '0', transform: 'translateY(16px)' },
  'to': { opacity: '1', transform: 'translateY(0)' }
  },
  slideInRight: {
  'from': { opacity: '0', transform: 'translateX(-20px)' },
  'to': { opacity: '1', transform: 'translateX(0)' }
  },
  scaleIn: {
  'from': { opacity: '0', transform: 'scale(0.95)' },
  'to': { opacity: '1', transform: 'scale(1)' }
  },
  'pulse-soft': {
  '0%, 100%': { opacity: '1', transform: 'scale(1)' },
  '50%': { opacity: '0.9', transform: 'scale(1.02)' }
  },
  glow: {
  '0%, 100%': { boxShadow: '0 0 15px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.1)' },
  '50%': { boxShadow: '0 0 25px rgba(59, 130, 246, 0.5), 0 0 50px rgba(59, 130, 246, 0.2)' }
  },
  'gradient-shift': {
  '0%, 100%': { backgroundPosition: '0% 50%' },
  '50%': { backgroundPosition: '100% 50%' }
  }
  },
  backdropBlur: {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px'
  },
  scale: {
  '102': '1.02',
  '103': '1.03',
  '105': '1.05'
  },
  spacing: {
  '18': '4.5rem',
  '88': '22rem',
  '128': '32rem'
  },
  transitionDuration: {
  '250': '250ms',
  '400': '400ms',
  '600': '600ms'
  },
  transitionTimingFunction: {
  'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
  }
  },
  plugins: [require("tailwindcss-animate")],
}
