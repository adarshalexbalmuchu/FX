import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { ReactNode } from 'react'

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  suffix?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  description?: string;
  delay?: number;
}

export default function MetricCard({
  title,
  value,
  change,
  suffix = '',
  icon,
  trend = 'neutral',
  description,
  delay = 0,
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-success-600" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-danger-600" />
    return <Activity className="w-4 h-4 text-primary-600" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success-700 bg-success-50'
    if (trend === 'down') return 'text-danger-700 bg-danger-50'
    return 'text-secondary-700 bg-secondary-50'
  }

  const getBorderColor = () => {
    if (trend === 'up') return 'hover:border-l-success-500'
    if (trend === 'down') return 'hover:border-l-danger-500'
    return 'hover:border-l-primary-500'
  }

  return (
    <motion.div
      className={`metric-card ${getBorderColor()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        type: 'spring',
        stiffness: 100,
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <motion.div 
              className="p-3 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl text-primary-600 group-hover:shadow-md transition-shadow"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {icon}
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
      <h3 className="text-sm font-semibold text-secondary-600 group-hover:text-secondary-900 transition-colors mb-3 uppercase tracking-wide">
        {title}
      </h3>

      {/* Value */}
      <div className="space-y-2">
        <motion.div
          className="text-4xl font-bold bg-gradient-to-r from-secondary-900 to-primary-700 bg-clip-text text-transparent"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: delay + 0.2, type: 'spring' }}
        >
          {value}
          {suffix && <span className="text-2xl text-secondary-500 ml-1">{suffix}</span>}
        </motion.div>

        {/* Change Badge */}
        {change !== undefined && (
          <motion.div 
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${getTrendColor()} border-2 ${trend === 'up' ? 'border-success-200' : trend === 'down' ? 'border-danger-200' : 'border-secondary-200'}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.3 }}
          >
            <span>{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
            <span className="text-secondary-400">•</span>
            <span className="font-normal">vs baseline</span>
          </motion.div>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-secondary-500 mt-3 leading-relaxed">{description}</p>
        )}
      </div>
    </motion.div>
  )
}
