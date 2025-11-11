# VolatiSense v2 Migration Notes

## Overview
This document explains the new design system patterns introduced in the v2 foundation sprint. These changes improve visual consistency, accessibility, and developer experience.

---

## 🎨 Design Tokens

### Location
`frontend/src/lib/tokens.ts`

### Usage

**Typography:**
```tsx
import { typography } from '@/lib/tokens'

// Apply typography to components
<h1 style={typography.h1}>Dashboard</h1>
<p style={typography.body}>Content</p>
```

**Or use Tailwind classes:**
```tsx
<h1 className="text-h1">Dashboard</h1>
<h2 className="text-h2">Section Title</h2>
<h3 className="text-h3">Subsection</h3>
<p className="text-body">Regular text</p>
<p className="text-body-sm">Small text</p>
```

**Spacing:**
```tsx
import { spacing } from '@/lib/tokens'

// Consistent spacing
<div style={{ padding: spacing.lg }}>Content</div>

// Or use Tailwind
<div className="p-lg">Content</div>
```

---

## 🔢 Tabular Numerals

### Problem
By default, numbers have proportional widths (1 is narrower than 8), causing alignment issues in tables and dashboards.

### Solution
Use the `.num` or `.font-mono-num` utility class:

```tsx
// Before
<span className="text-4xl font-bold">12.5%</span>

// After - numbers align perfectly
<span className="text-4xl font-bold num">12.5%</span>

// Or use monospace font + numerals
<span className="text-4xl font-bold font-mono-num">12.5%</span>
```

**When to use:**
- ✅ Financial metrics (NPM, ROA, percentages)
- ✅ Tables with numeric columns
- ✅ Charts with axis labels
- ✅ Countdown timers
- ❌ Body text, headings (use regular fonts)

---

## 💳 MetricCard Component

### Old API
```tsx
<MetricCard
  title="Expected NPM"
  value="12.5"
  suffix="%"
  change={2.3}
  trend="up"
  icon={<TrendingUp />}
/>
```

### New API
```tsx
<MetricCard
  title="Expected NPM"
  value="12.5"
  suffix="%"
  change={2.3}
  trend="up"
  category="npm"        // NEW: Color codes by metric type
  size="md"             // NEW: Size variant (sm/md/lg/hero)
  icon={TrendingUp}     // Can now pass component directly
  sparkline={<Chart />} // NEW: Optional sparkline slot
/>
```

### Category Colors
Maps metric types to semantic colors:

| Category | Color | Use Case |
|----------|-------|----------|
| `npm` | Blue (#3B82F6) | Net Profit Margin |
| `roa` | Purple (#8B5CF6) | Return on Assets |
| `var` | Amber (#F59E0B) | Value at Risk |
| `cvar` | Red (#EF4444) | Conditional VaR |
| `hedge` | Green (#10B981) | Hedge Effectiveness |
| `neutral` | Primary | Generic metrics |

### Size Variants

```tsx
// Small cards (compact dashboards)
<MetricCard size="sm" value="12.5%" />

// Default (most common)
<MetricCard size="md" value="12.5%" />

// Large (emphasis)
<MetricCard size="lg" value="12.5%" />

// Hero (page header)
<MetricCard size="hero" value="12.5%" />
```

### Sparkline Slot
```tsx
import { Sparklines, SparklinesLine } from 'react-sparklines'

<MetricCard
  value="12.5%"
  sparkline={
    <Sparklines data={[5, 10, 5, 20, 18, 15, 12]} height={40}>
      <SparklinesLine color="#3B82F6" />
    </Sparklines>
  }
/>
```

---

## 🌓 Dark Mode

### Usage
```tsx
import { useDarkMode } from '@/hooks/useDarkMode'

function MyComponent() {
  const { isDark, toggle, setIsDark } = useDarkMode()

  return (
    <div>
      <p>Current mode: {isDark ? 'Dark' : 'Light'}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => setIsDark(true)}>Force Dark</button>
    </div>
  )
}
```

### Features
- ✅ Syncs with `localStorage` (`theme` key)
- ✅ Detects system preference on first load
- ✅ Toggles `.dark` class on `<html>` element
- ✅ Tailwind dark mode variants work automatically

### Styling for Dark Mode
```tsx
// Tailwind variants
<div className="bg-white dark:bg-neutral-900">
  <h1 className="text-neutral-900 dark:text-neutral-100">Title</h1>
</div>
```

---

## 📊 Chart Theming

### Plotly Charts

**Before:**
```tsx
import Plot from 'react-plotly.js'

<Plot
  data={[{ x: [1, 2, 3], y: [2, 6, 3], type: 'scatter' }]}
  layout={{ title: 'My Chart' }}
/>
```

**After:**
```tsx
import Plot from 'react-plotly.js'
import { applyPlotlyTheme } from '@/lib/PlotlyTheme'
import { useDarkMode } from '@/hooks/useDarkMode'

function MyChart() {
  const { isDark } = useDarkMode()

  return (
    <Plot
      data={[{
        x: [1, 2, 3],
        y: [2, 6, 3],
        type: 'scatter',
        marker: { color: '#3B82F6' } // Use primary blue
      }]}
      layout={applyPlotlyTheme({
        title: 'My Chart',
        xaxis: { title: 'Time' },
      }, isDark)}
    />
  )
}
```

### Recharts

**Before:**
```tsx
<LineChart data={data}>
  <Line dataKey="value" stroke="#14B8A6" />
</LineChart>
```

**After:**
```tsx
import { rechartsTheme, rechartsThemeDark } from '@/lib/RechartsTheme'
import { useDarkMode } from '@/hooks/useDarkMode'

function MyChart() {
  const { isDark } = useDarkMode()
  const theme = isDark ? rechartsThemeDark : rechartsTheme

  return (
    <LineChart data={data}>
      <CartesianGrid stroke={theme.grid.stroke} strokeDasharray={theme.grid.strokeDasharray} />
      <XAxis tick={{ fill: theme.axis.tick.fill }} />
      <YAxis tick={{ fill: theme.axis.tick.fill }} />
      <Tooltip contentStyle={theme.tooltip.contentStyle} />
      <Line dataKey="value" stroke={theme.colors[0]} strokeWidth={2} />
    </LineChart>
  )
}
```

### Chart Color Palettes

```tsx
import { chartColors } from '@/lib/tokens'

// Primary palette (multi-series charts)
chartColors.primary
// ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981']

// Sequential (heatmaps, choropleth)
chartColors.sequential
// ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE']

// Diverging (profit/loss)
chartColors.diverging
// ['#B91C1C', '#EF4444', '#F8FAFC', '#3B82F6', '#1E3A8A']
```

---

## 🎯 shadcn/ui Components

### Button Variants
```tsx
import { Button } from '@/components/ui/button'

<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Button Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button> // Square for icons
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer actions
  </CardFooter>
</Card>
```

### Dialog
```tsx
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
    </DialogHeader>
    <p>Modal content...</p>
  </DialogContent>
</Dialog>
```

### Tooltip
```tsx
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>
      <p>Helpful explanation</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

## 🔍 Accessibility Improvements

### ARIA Labels
```tsx
// Before
<button onClick={toggle}>
  <Moon />
</button>

// After
<button 
  onClick={toggle}
  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {isDark ? <Sun /> : <Moon />}
</button>
```

### Color-Only Indicators
```tsx
// Before (fails accessibility - color-only)
<span className="text-success-600">+2.3%</span>

// After (has visual icon + text)
<span className="text-success-600" aria-label="Trend up">
  <TrendingUp className="w-4 h-4" />
  +2.3%
</span>
```

### Skip to Content
```tsx
// Add to Layout.tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded"
>
  Skip to content
</a>

<main id="main-content">
  {children}
</main>
```

---

## 🚀 Performance Tips

### Code Splitting
```tsx
// Lazy load heavy chart libraries
import { lazy, Suspense } from 'react'

const PlotlyChart = lazy(() => import('./PlotlyChart'))

<Suspense fallback={<LoadingSpinner />}>
  <PlotlyChart data={data} />
</Suspense>
```

### Conditional Imports
```tsx
// Only import Plotly on pages that need heatmaps
import Plot from 'react-plotly.js' // ❌ Loads 3MB bundle everywhere

// Better:
const Plot = lazy(() => import('react-plotly.js')) // ✅ Code-split
```

---

## 📦 Dependencies Added

```json
{
  "dependencies": {
    "zustand": "^4.4.7",
    "react-hook-form": "^7.49.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "@tremor/react": "^3.13.2",
    "recharts": "^2.10.3",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    "@react-spring/web": "^9.7.3"
  }
}
```

---

## 🔄 Migration Checklist

### Components
- [ ] Replace old `MetricCard` usage with new `category` prop
- [ ] Add `.num` class to all numeric values
- [ ] Update chart colors from teal (#14B8A6) to primary blue (#3B82F6)
- [ ] Apply `applyPlotlyTheme()` to Plotly charts
- [ ] Add dark mode support to custom components

### Styling
- [ ] Replace arbitrary text sizes with `text-h1`, `text-h2`, etc.
- [ ] Use semantic colors: `text-profit-600`, `text-loss-600`, `text-neutral-600`
- [ ] Add dark mode variants: `dark:bg-neutral-900`, `dark:text-neutral-100`

### Accessibility
- [ ] Add `aria-label` to icon-only buttons
- [ ] Add `aria-hidden="true"` to decorative icons
- [ ] Ensure color-only indicators have icons/text
- [ ] Test keyboard navigation
- [ ] Run Lighthouse accessibility audit

---

## 🐛 Known Issues

### Build Memory
Large Plotly bundle may cause memory issues in dev containers. Solutions:
- Use `NODE_OPTIONS=--max-old-space-size=4096 npm run build`
- Code-split Plotly charts
- Consider migrating simple charts to Recharts

### Font Loading
JetBrains Mono loads from Google Fonts. For offline use:
```tsx
// Download and self-host in public/fonts/
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/JetBrainsMono.woff2') format('woff2');
}
```

---

## 📚 Resources

- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Docs](https://recharts.org)
- [Plotly.js Docs](https://plotly.com/javascript/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 💬 Questions?

For questions or issues with the new design system:
1. Check this migration guide
2. Review `FRONTEND_ANALYSIS_REPORT.md`
3. Inspect `frontend/src/lib/tokens.ts`
4. Open an issue with the `design-system` label
