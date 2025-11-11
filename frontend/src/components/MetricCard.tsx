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

const categoryStyles: Record<MetricCategory, { color: string; bg: string; border: string; hoverBorder: string; glow: string }> = {
  npm: {
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'from-blue-100 to-blue-50 dark:from-blue-950/40 dark:to-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    hoverBorder: 'hover:border-l-blue-500 dark:hover:border-l-blue-400',
    glow: 'shadow-blue-500/20',
  },
  roa: {
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'from-purple-100 to-purple-50 dark:from-purple-950/40 dark:to-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    hoverBorder: 'hover:border-l-purple-500 dark:hover:border-l-purple-400',
    glow: 'shadow-purple-500/20',
  },
  var: {
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'from-amber-100 to-amber-50 dark:from-amber-950/40 dark:to-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    hoverBorder: 'hover:border-l-amber-500 dark:hover:border-l-amber-400',
    glow: 'shadow-amber-500/20',
  },
  cvar: {
    color: 'text-red-600 dark:text-red-400',
    bg: 'from-red-100 to-red-50 dark:from-red-950/40 dark:to-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    hoverBorder: 'hover:border-l-red-500 dark:hover:border-l-red-400',
    glow: 'shadow-red-500/20',
  },
  hedge: {
    color: 'text-green-600 dark:text-green-400',
    bg: 'from-green-100 to-green-50 dark:from-green-950/40 dark:to-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    hoverBorder: 'hover:border-l-green-500 dark:hover:border-l-green-400',
    glow: 'shadow-green-500/20',
  },
  neutral: {
    color: 'text-primary-600 dark:text-primary-400',
    bg: 'from-primary-100 to-primary-50 dark:from-primary-950/40 dark:to-primary-900/20',
    border: 'border-primary-200 dark:border-primary-800',
    hoverBorder: 'hover:border-l-primary-500 dark:hover:border-l-primary-400',
    glow: 'shadow-primary-500/20',
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
      whileHover={{ 
        y: -6, 
        scale: 1.01,
        transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } 
      }}
      className={className}
    >
      <Card 
        className={cn(
          'glass-card group border-l-4 border-l-transparent',
          'shadow-card hover:shadow-card-hover',
          'transition-all duration-300 ease-smooth',
          'hover:scale-[1.01]',
          catStyles.hoverBorder,
          catStyles.glow,
          styles.padding
        )}
      >
        {/* Card Header with enhanced depth */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {icon && (
              <motion.div 
                className={cn(
                  'bg-gradient-to-br rounded-xl shadow-sm',
                  'group-hover:shadow-lg transition-all duration-300',
                  catStyles.bg,
                  catStyles.color,
                  catStyles.glow,
                  styles.icon
                )}
                whileHover={{ 
                  rotate: 5, 
                  scale: 1.15,
                  transition: { type: 'spring', stiffness: 400, damping: 12 }
                }}
              >
                {typeof icon === 'function' ? icon({ className: 'w-full h-full' }) : icon}
              </motion.div>
            )}
          </div>
          <motion.div
            whileHover={{ 
              scale: 1.25, 
              rotate: 5,
              transition: { type: 'spring', stiffness: 400, damping: 10 }
            }}
            className="relative"
          >
            {getTrendIcon()}
          </motion.div>
        </div>

        {/* Title with refined typography */}
        <h3 className={cn(
          'font-semibold text-secondary-600 dark:text-secondary-400',
          'group-hover:text-secondary-900 dark:group-hover:text-secondary-200',
          'transition-colors duration-300 mb-3 uppercase tracking-wider',
          styles.title
        )}>
          {title}
        </h3>

        {/* Value with tabular numerals and enhanced emphasis */}
        <div className="space-y-3">
          <motion.div
            className={cn(
              'font-bold font-mono-num',
              'bg-gradient-to-r from-secondary-900 via-primary-700 to-secondary-900',
              'dark:from-secondary-100 dark:via-primary-400 dark:to-secondary-100',
              'bg-clip-text text-transparent',
              'leading-none',
              styles.value
            )}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: delay + 0.2, 
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
          >
            {value}
            {suffix && (
              <span className={cn(
                'text-secondary-500 dark:text-secondary-400 ml-2 font-medium',
                styles.suffix
              )}>
                {suffix}
              </span>
            )}
          </motion.div>

          {/* Change Badge with enhanced styling */}
          {change !== undefined && (
            <motion.div 
              className={cn(
                'inline-flex items-center space-x-2 rounded-full font-bold border-2',
                'shadow-sm backdrop-blur-sm',
                getTrendColor(),
                styles.badge
              )}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: delay + 0.3,
                type: 'spring',
                stiffness: 300
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <span className="num tabular-nums">{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
              <span className="text-secondary-400 dark:text-secondary-500" aria-hidden="true">•</span>
              <span className="font-medium">vs baseline</span>
            </motion.div>
          )}

          {/* Sparkline slot with smooth reveal */}
          {sparkline && (
            <motion.div
              className="mt-4 pt-3 border-t border-secondary-200/50 dark:border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ 
                delay: delay + 0.4,
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              {sparkline}
            </motion.div>
          )}

          {/* Description with refined typography */}
          {description && (
            <motion.p 
              className="text-xs text-secondary-500 dark:text-secondary-400 mt-4 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.5 }}
            >
              {description}
            </motion.p>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
