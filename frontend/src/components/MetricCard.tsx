import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { Card } from './ui/card'
import { cn } from '../lib/utils'

type MetricCategory = 'npm' | 'roa' | 'var' | 'cvar' | 'hedge' | 'neutral'
type MetricSize = 'sm' | 'md' | 'lg' | 'hero'
type TrendDirection = 'up' | 'down' | 'neutral'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  suffix?: string
  icon?: ReactNode | LucideIcon
  trend?: TrendDirection
  category?: MetricCategory
  size?: MetricSize
  description?: string
  delay?: number
  sparkline?: ReactNode
  className?: string
}

const sizeStyles = {
  sm: {
    padding: 'p-4',
    title: 'text-xs',
    value: 'text-2xl',
    suffix: 'text-base',
    icon: 'p-2 w-8 h-8',
    badge: 'px-2 py-1 text-xs',
  },
  md: {
    padding: 'p-6',
    title: 'text-sm',
    value: 'text-4xl',
    suffix: 'text-2xl',
    icon: 'p-3 w-12 h-12',
    badge: 'px-3 py-1.5 text-xs',
  },
  lg: {
    padding: 'p-8',
    title: 'text-base',
    value: 'text-5xl',
    suffix: 'text-3xl',
    icon: 'p-4 w-16 h-16',
    badge: 'px-4 py-2 text-sm',
  },
  hero: {
    padding: 'p-10',
    title: 'text-lg',
    value: 'text-6xl md:text-7xl',
    suffix: 'text-4xl',
    icon: 'p-5 w-20 h-20',
    badge: 'px-5 py-2.5 text-base',
  },
}

const categoryStyles: Record<MetricCategory, { color: string; bg: string; border: string; hoverBorder: string }> = {
  npm: {
    color: 'text-blue-600',
    bg: 'from-blue-100 to-blue-50',
    border: 'border-blue-200',
    hoverBorder: 'hover:border-l-blue-500',
  },
  roa: {
    color: 'text-purple-600',
    bg: 'from-purple-100 to-purple-50',
    border: 'border-purple-200',
    hoverBorder: 'hover:border-l-purple-500',
  },
  var: {
    color: 'text-amber-600',
    bg: 'from-amber-100 to-amber-50',
    border: 'border-amber-200',
    hoverBorder: 'hover:border-l-amber-500',
  },
  cvar: {
    color: 'text-red-600',
    bg: 'from-red-100 to-red-50',
    border: 'border-red-200',
    hoverBorder: 'hover:border-l-red-500',
  },
  hedge: {
    color: 'text-green-600',
    bg: 'from-green-100 to-green-50',
    border: 'border-green-200',
    hoverBorder: 'hover:border-l-green-500',
  },
  neutral: {
    color: 'text-primary-600',
    bg: 'from-primary-100 to-primary-50',
    border: 'border-primary-200',
    hoverBorder: 'hover:border-l-primary-500',
  },
}

export default function MetricCard({
  title,
  value,
  change,
  suffix = '',
  icon,
  trend = 'neutral',
  category = 'neutral',
  size = 'md',
  description,
  delay = 0,
  sparkline,
  className,
}: MetricCardProps) {
  const styles = sizeStyles[size]
  const catStyles = categoryStyles[category]

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-profit-600" aria-label="Trend up" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-loss-600" aria-label="Trend down" />
    return <Activity className="w-4 h-4 text-neutral-600" aria-label="Trend neutral" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-profit-700 bg-profit-50 border-profit-200'
    if (trend === 'down') return 'text-loss-700 bg-loss-50 border-loss-200'
    return 'text-neutral-700 bg-neutral-50 border-neutral-200'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={className}
    >
      <Card 
        className={cn(
          'glass-card group border-l-4 border-l-transparent transition-all duration-300',
          catStyles.hoverBorder,
          styles.padding
        )}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {icon && (
              <motion.div 
                className={cn(
                  'bg-gradient-to-br rounded-xl group-hover:shadow-md transition-shadow',
                  catStyles.bg,
                  catStyles.color,
                  styles.icon
                )}
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {typeof icon === 'function' ? icon({ className: 'w-full h-full' }) : icon}
              </motion.div>
            )}
          </div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {getTrendIcon()}
          </motion.div>
        </div>

        {/* Title */}
        <h3 className={cn(
          'font-semibold text-neutral-600 group-hover:text-neutral-900 transition-colors mb-2 uppercase tracking-wide',
          styles.title
        )}>
          {title}
        </h3>

        {/* Value with tabular numerals */}
        <div className="space-y-2">
          <motion.div
            className={cn(
              'font-bold font-mono-num bg-gradient-to-r from-neutral-900 to-primary-700 bg-clip-text text-transparent',
              styles.value
            )}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring' }}
          >
            {value}
            {suffix && (
              <span className={cn('text-neutral-500 ml-1', styles.suffix)}>{suffix}</span>
            )}
          </motion.div>

          {/* Change Badge */}
          {change !== undefined && (
            <motion.div 
              className={cn(
                'inline-flex items-center space-x-1.5 rounded-full font-bold border-2',
                getTrendColor(),
                styles.badge
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
            >
              <span className="num">{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
              <span className="text-neutral-400" aria-hidden="true">•</span>
              <span className="font-normal">vs baseline</span>
            </motion.div>
          )}

          {/* Sparkline slot */}
          {sparkline && (
            <motion.div
              className="mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.4 }}
            >
              {sparkline}
            </motion.div>
          )}

          {/* Description */}
          {description && (
            <p className="text-xs text-neutral-500 mt-3 leading-relaxed">{description}</p>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
