import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MetricCard from '../components/MetricCard'

describe('MetricCard', () => {
  it('renders title and value correctly', () => {
    render(
      <MetricCard
        title="Expected NPM"
        value="12.5"
        suffix="%"
      />
    )
    
    expect(screen.getByText('Expected NPM')).toBeInTheDocument()
    expect(screen.getByText('12.5')).toBeInTheDocument()
    expect(screen.getByText('%')).toBeInTheDocument()
  })

  it('shows trend indicator with change', () => {
    render(
      <MetricCard
        title="NPM"
        value="12.5"
        change={2.3}
        trend="up"
      />
    )
    
    expect(screen.getByText('+2.3%')).toBeInTheDocument()
    expect(screen.getByLabelText('Trend up')).toBeInTheDocument()
  })

  it('applies category-specific styling', () => {
    const { container } = render(
      <MetricCard
        title="NPM"
        value="12.5"
        category="npm"
      />
    )
    
    // Should have card component
    const card = container.querySelector('.glass-card')
    expect(card).toBeInTheDocument()
  })

  it('supports different sizes', () => {
    const { rerender, container } = render(
      <MetricCard
        title="NPM"
        value="12.5"
        size="sm"
      />
    )
    
    let card = container.querySelector('[class*="p-4"]')
    expect(card).toBeInTheDocument()
    
    rerender(
      <MetricCard
        title="NPM"
        value="12.5"
        size="hero"
      />
    )
    
    card = container.querySelector('[class*="p-10"]')
    expect(card).toBeInTheDocument()
  })

  it('renders sparkline slot when provided', () => {
    render(
      <MetricCard
        title="NPM"
        value="12.5"
        sparkline={<div data-testid="sparkline">Chart</div>}
      />
    )
    
    expect(screen.getByTestId('sparkline')).toBeInTheDocument()
  })

  it('applies tabular numerals to value', () => {
    const { container } = render(
      <MetricCard
        title="NPM"
        value="12.5"
      />
    )
    
    const value = container.querySelector('.font-mono-num')
    expect(value).toBeInTheDocument()
  })

  it('shows description when provided', () => {
    render(
      <MetricCard
        title="NPM"
        value="12.5"
        description="This is a description"
      />
    )
    
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  it('handles negative change correctly', () => {
    render(
      <MetricCard
        title="NPM"
        value="12.5"
        change={-1.5}
        trend="down"
      />
    )
    
    expect(screen.getByText('-1.5%')).toBeInTheDocument()
    expect(screen.getByLabelText('Trend down')).toBeInTheDocument()
  })
})
