/**
 * Plotly.js Theme Configuration
 * Standardized styling for all Plotly charts
 */

import { chartColors } from '../lib/tokens'

export const plotlyTheme = {
  layout: {
    font: {
      family: 'Inter, sans-serif',
      size: 13,
      color: '#475569', // secondary-600
    },
    colorway: chartColors.primary,
    plot_bgcolor: 'rgba(255, 255, 255, 0.9)',
    paper_bgcolor: 'rgba(255, 255, 255, 0.9)',
    margin: { t: 60, r: 40, b: 60, l: 60 },
    xaxis: {
      gridcolor: '#E2E8F0', // secondary-200
      zerolinecolor: '#CBD5E1', // secondary-300
      linecolor: '#94A3B8', // secondary-400
      tickfont: {
        size: 12,
        color: '#64748B', // secondary-500
      },
      titlefont: {
        size: 13,
        color: '#475569', // secondary-600
      },
    },
    yaxis: {
      gridcolor: '#E2E8F0',
      zerolinecolor: '#CBD5E1',
      linecolor: '#94A3B8',
      tickfont: {
        size: 12,
        color: '#64748B',
      },
      titlefont: {
        size: 13,
        color: '#475569',
      },
    },
    legend: {
      bgcolor: 'rgba(255, 255, 255, 0.95)',
      bordercolor: '#E2E8F0',
      borderwidth: 1,
      font: {
        size: 12,
        color: '#475569',
      },
    },
    hoverlabel: {
      bgcolor: '#FFFFFF',
      bordercolor: '#3B82F6',
      font: {
        size: 12,
        family: 'Inter, sans-serif',
        color: '#0F172A',
      },
    },
  },
}

// Dark mode theme
export const plotlyThemeDark = {
  layout: {
    font: {
      family: 'Inter, sans-serif',
      size: 13,
      color: '#CBD5E1', // neutral-300
    },
    colorway: chartColors.primary,
    plot_bgcolor: 'rgba(15, 23, 42, 0.9)', // neutral-900
    paper_bgcolor: 'rgba(15, 23, 42, 0.9)',
    margin: { t: 60, r: 40, b: 60, l: 60 },
    xaxis: {
      gridcolor: '#334155', // neutral-700
      zerolinecolor: '#475569', // neutral-600
      linecolor: '#64748B', // neutral-500
      tickfont: {
        size: 12,
        color: '#94A3B8', // neutral-400
      },
      titlefont: {
        size: 13,
        color: '#CBD5E1', // neutral-300
      },
    },
    yaxis: {
      gridcolor: '#334155',
      zerolinecolor: '#475569',
      linecolor: '#64748B',
      tickfont: {
        size: 12,
        color: '#94A3B8',
      },
      titlefont: {
        size: 13,
        color: '#CBD5E1',
      },
    },
    legend: {
      bgcolor: 'rgba(30, 41, 59, 0.95)', // neutral-800
      bordercolor: '#475569',
      borderwidth: 1,
      font: {
        size: 12,
        color: '#CBD5E1',
      },
    },
    hoverlabel: {
      bgcolor: '#1E293B',
      bordercolor: '#3B82F6',
      font: {
        size: 12,
        family: 'Inter, sans-serif',
        color: '#F8FAFC',
      },
    },
  },
}

// Heatmap-specific colorscale
export const heatmapColorscale = [
  [0, '#1E3A8A'],    // primary-900 (dark blue)
  [0.25, '#3B82F6'], // primary-500 (blue)
  [0.5, '#60A5FA'],  // primary-400 (light blue)
  [0.75, '#93C5FD'], // primary-300 (lighter blue)
  [1, '#DBEAFE'],    // primary-100 (very light blue)
]

// Diverging colorscale (for profit/loss)
export const divergingColorscale = [
  [0, '#B91C1C'],    // loss-700 (dark red)
  [0.25, '#EF4444'], // loss-500 (red)
  [0.5, '#F8FAFC'],  // neutral (white)
  [0.75, '#10B981'], // profit-500 (green)
  [1, '#047857'],    // profit-700 (dark green)
]

/**
 * Apply theme to Plotly layout
 * Merges custom layout with theme defaults
 */
export function applyPlotlyTheme(customLayout: any = {}, isDark = false) {
  const theme = isDark ? plotlyThemeDark : plotlyTheme
  return {
    ...theme.layout,
    ...customLayout,
    xaxis: {
      ...theme.layout.xaxis,
      ...customLayout.xaxis,
    },
    yaxis: {
      ...theme.layout.yaxis,
      ...customLayout.yaxis,
    },
    legend: {
      ...theme.layout.legend,
      ...customLayout.legend,
    },
  }
}
