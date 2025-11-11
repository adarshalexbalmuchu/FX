/**
 * Recharts Theme Configuration
 * Standardized styling for all Recharts components
 */

import { chartColors, metricColors } from '../lib/tokens'

export const rechartsTheme = {
  colors: chartColors.primary,
  font: {
    family: 'Inter, sans-serif',
    size: 13,
    weight: 400,
  },
  grid: {
    stroke: '#E2E8F0', // secondary-200
    strokeDasharray: '3 3',
  },
  axis: {
    stroke: '#94A3B8', // secondary-400
    tick: {
      fill: '#64748B', // secondary-500
      fontSize: 12,
    },
    label: {
      fill: '#475569', // secondary-600
      fontSize: 13,
    },
  },
  tooltip: {
    contentStyle: {
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px',
      color: '#0F172A',
    },
    labelStyle: {
      color: '#475569',
      fontWeight: 600,
      marginBottom: '4px',
    },
  },
  legend: {
    wrapperStyle: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px',
      color: '#475569',
    },
  },
}

// Dark mode theme
export const rechartsThemeDark = {
  colors: chartColors.primary,
  font: {
    family: 'Inter, sans-serif',
    size: 13,
    weight: 400,
  },
  grid: {
    stroke: '#334155', // neutral-700
    strokeDasharray: '3 3',
  },
  axis: {
    stroke: '#64748B', // neutral-500
    tick: {
      fill: '#94A3B8', // neutral-400
      fontSize: 12,
    },
    label: {
      fill: '#CBD5E1', // neutral-300
      fontSize: 13,
    },
  },
  tooltip: {
    contentStyle: {
      backgroundColor: '#1E293B', // neutral-800
      border: '1px solid #475569',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px',
      color: '#F8FAFC',
    },
    labelStyle: {
      color: '#CBD5E1',
      fontWeight: 600,
      marginBottom: '4px',
    },
  },
  legend: {
    wrapperStyle: {
      fontFamily: 'Inter, sans-serif',
      fontSize: '12px',
      color: '#CBD5E1',
    },
  },
}

/**
 * Get color by metric type
 */
export function getMetricColor(metricName: string): string {
  const key = metricName.toLowerCase().replace(/[^a-z]/g, '') as keyof typeof metricColors
  return metricColors[key] || chartColors.primary[0]
}

/**
 * Format percentage for display
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

/**
 * Custom tick formatter for percentages
 */
export const percentTickFormatter = (value: number) => `${(value * 100).toFixed(0)}%`

/**
 * Custom tick formatter for currency
 */
export const currencyTickFormatter = (value: number) => formatCurrency(value)
