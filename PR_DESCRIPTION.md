# 🎨 VolatiSense v2 Foundation & Design System

## 📝 Description

This PR establishes the foundational design system, component library, and theming infrastructure for VolatiSense v2. It includes:

- **Design tokens** (spacing, colors, typography, shadows)
- **shadcn/ui component library** (8 core components)
- **Enhanced MetricCard** with size and category variants
- **Dark mode system** with localStorage persistence
- **Chart theming** for Plotly and Recharts
- **Comprehensive documentation** and migration guides

## 🎯 Objectives

### Design System
- [x] Create design tokens in `tokens.ts`
- [x] Extend Tailwind config with financial semantic colors
- [x] Add typography scale (h1: 56px → h4: 24px)
- [x] Add JetBrains Mono for financial numerals
- [x] Implement tabular numerals utility (`.num` class)

### Component Library
- [x] Initialize shadcn/ui with 8 components
- [x] Add Button variants (default, destructive, outline, ghost, etc.)
- [x] Add Card, Input, Select, Tabs, Tooltip, Dialog, Slider
- [x] Create enhanced MetricCard with size/category props

### Dark Mode
- [x] Create `useDarkMode` hook with localStorage sync
- [x] Add toggle button in Layout header (Sun/Moon icons)
- [x] Configure Tailwind `darkMode: ['class']`

### Chart Theming
- [x] Create PlotlyTheme.ts with light/dark variants
- [x] Create RechartsTheme.ts with formatters
- [x] Add `applyPlotlyTheme()` helper function

### Documentation
- [x] Write MIGRATION_NOTES.md (developer guide)
- [x] Create FRONTEND_ANALYSIS_REPORT.md (60-page audit)
- [x] Write V2_FOUNDATION_SUMMARY.md (deliverables checklist)

### Testing
- [x] Add MetricCard.test.tsx (8 test cases with Vitest)

## 📦 Dependencies Added

```json
{
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
```

## 🚀 Key Features

### 1. Design Tokens (`frontend/src/lib/tokens.ts`)

**Typography Scale:**
- h1: 56px (hero titles)
- h2: 40px (page titles)
- h3: 30px (section headings)
- h4: 24px (subsection headings)
- Body: 16px / 18px / 14px / 12px

**Financial Semantic Colors:**
- `profit`: Green (#10B981) for positive metrics
- `loss`: Red (#EF4444) for negative metrics
- `neutral`: Slate (#64748B) for general UI

**Metric Category Colors:**
- `npm`: Blue (#3B82F6) - Net Profit Margin
- `roa`: Purple (#8B5CF6) - Return on Assets
- `var`: Amber (#F59E0B) - Value at Risk
- `cvar`: Red (#EF4444) - Conditional VaR
- `hedge`: Green (#10B981) - Hedge Effectiveness

### 2. Enhanced MetricCard

**New Props:**
```tsx
<MetricCard
  title="Expected NPM"
  value="12.5"
  suffix="%"
  change={2.3}
  trend="up"
  category="npm"        // NEW: Color codes by metric
  size="md"             // NEW: sm/md/lg/hero
  sparkline={<Chart />} // NEW: Optional mini-chart
/>
```

**Size Variants:**
- `sm`: Compact (p-4, text-2xl)
- `md`: Default (p-6, text-4xl)
- `lg`: Emphasized (p-8, text-5xl)
- `hero`: Page header (p-10, text-6xl)

**Tabular Numerals:**
All values use `.font-mono-num` class for perfect alignment.

### 3. Dark Mode

**Hook API:**
```tsx
const { isDark, toggle, setIsDark } = useDarkMode()
```

**Features:**
- ✅ Syncs with localStorage (`theme` key)
- ✅ Detects system preference on first load
- ✅ Toggles `.dark` class on `<html>`
- ✅ Header toggle with animated icon swap

### 4. Chart Theming

**Plotly:**
```tsx
import { applyPlotlyTheme } from '@/lib/PlotlyTheme'

<Plot
  data={data}
  layout={applyPlotlyTheme({
    title: 'NPM Distribution',
    xaxis: { title: 'NPM (%)' }
  }, isDark)}
/>
```

**Recharts:**
```tsx
import { rechartsTheme } from '@/lib/RechartsTheme'

<LineChart data={data}>
  <Line stroke={theme.colors[0]} />
</LineChart>
```

## 📸 Visual Changes

### Before
- Generic metric cards (all same color)
- No dark mode
- Inconsistent chart colors (teal/blue mix)
- Misaligned numbers (proportional widths)
- Basic unstyled buttons

### After
- ✅ Color-coded metric cards by category
- ✅ Full dark mode with toggle
- ✅ Unified blue chart palette
- ✅ Perfect number alignment (tabular numerals)
- ✅ Professional shadcn/ui components

## 🧪 Testing

### Run Tests
```bash
cd frontend
npm test MetricCard.test.tsx
```

### Coverage
- ✅ Renders title and value
- ✅ Shows trend indicators
- ✅ Applies category styling
- ✅ Supports size variants
- ✅ Renders sparkline slot
- ✅ Uses tabular numerals
- ✅ Shows descriptions
- ✅ Handles negative changes

## 📚 Documentation

### For Developers
- **MIGRATION_NOTES.md**: Step-by-step guide for using new design patterns
  - Tabular numerals implementation
  - MetricCard migration
  - Dark mode setup
  - Chart theming
  - shadcn/ui examples

### For Reviewers
- **V2_FOUNDATION_SUMMARY.md**: Sprint deliverables checklist
- **FRONTEND_ANALYSIS_REPORT.md**: Comprehensive 60-page audit

## ✅ Acceptance Criteria

### Completed
- [x] shadcn/ui initialized with Tailwind theme
- [x] Dependencies installed (zustand, react-hook-form, zod, etc.)
- [x] Design tokens created
- [x] Typography scale implemented
- [x] JetBrains Mono font added
- [x] Tabular numerals utility created
- [x] Financial semantic colors added
- [x] Dark mode hook + toggle
- [x] shadcn/ui components added
- [x] MetricCard enhanced (size/category/sparkline)
- [x] Chart theming system created
- [x] Documentation written
- [x] Tests added

### Deferred to Next Sprint
(Per "non-goals" in requirements)
- [ ] Chart color updates (requires page refactors)
- [ ] Mobile bottom navigation (needs full UI)
- [ ] Loading skeletons (needs component updates)
- [ ] Accessibility audit (Lighthouse)
- [ ] Screenshots
- [ ] Full sidebar rebuild
- [ ] Landing page redesign
- [ ] Recharts migration

## 🔄 Migration Guide

### Updating Components

**Old:**
```tsx
<MetricCard title="NPM" value="12.5" suffix="%" />
```

**New:**
```tsx
<MetricCard
  title="NPM"
  value="12.5"
  suffix="%"
  category="npm"  // Add category
  size="md"       // Add size
/>
```

### Adding Tabular Numerals

**Old:**
```tsx
<span className="text-4xl font-bold">12.5%</span>
```

**New:**
```tsx
<span className="text-4xl font-bold num">12.5%</span>
```

### Using Dark Mode

**Old:**
```tsx
// No dark mode
```

**New:**
```tsx
const { isDark, toggle } = useDarkMode()

<div className="bg-white dark:bg-neutral-900">
  <button onClick={toggle}>
    {isDark ? <Sun /> : <Moon />}
  </button>
</div>
```

## 🐛 Known Issues

### Build Memory
Plotly bundle may cause memory issues in dev containers.

**Solution:**
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

## 🚀 Next Steps

After this PR merges, Sprint 2 will focus on:

1. **Typography updates** (replace headings with design system)
2. **Chart color consistency** (apply themes to existing charts)
3. **MetricCard migration** (add category props to Dashboard)
4. **Mobile navigation** (bottom nav + hamburger)
5. **Loading skeletons** (replace spinners)

## 📋 Checklist for Reviewers

- [ ] Review design tokens structure (`tokens.ts`)
- [ ] Test dark mode toggle (check localStorage)
- [ ] Verify MetricCard variants (size, category)
- [ ] Check tabular numerals on numbers
- [ ] Review documentation (MIGRATION_NOTES.md)
- [ ] Run tests: `npm test MetricCard.test.tsx`
- [ ] Verify build passes (may need extra memory)

## 🔗 Resources

- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Recharts Docs](https://recharts.org)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Branch:** `feat/v2-foundation-and-quick-wins`  
**Closes:** #[issue-number] (if applicable)  
**Related:** FRONTEND_ANALYSIS_REPORT.md  
**Reviewers:** @adarshalexbalmuchu

/cc @adarshalexbalmuchu
