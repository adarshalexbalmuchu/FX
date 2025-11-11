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
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Activity className="w-4 h-4 text-primary-500" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600'
    if (trend === 'down') return 'text-red-600'
    return 'text-secondary-600'
  }

  return (
    <motion.div
      className="metric-card group"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay,
        type: 'spring',
        stiffness: 200,
      }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {icon && (
            <div className="p-2 bg-primary-100 rounded-lg text-primary-600">
              {icon}
            </div>
          )}
          <h3 className="text-sm font-medium text-secondary-600 group-hover:text-secondary-900 transition-colors">
            {title}
          </h3>
        </div>
        {getTrendIcon()}
      </div>

      <div className="space-y-1">
        <motion.div
          className="text-3xl font-bold text-secondary-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          {value}
          {suffix && <span className="text-xl text-secondary-600 ml-1">{suffix}</span>}
        </motion.div>

        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${getTrendColor()}`}>
            <span>{change > 0 ? '+' : ''}{change.toFixed(2)}%</span>
            <span className="text-secondary-500">vs baseline</span>
          </div>
        )}

        {description && (
          <p className="text-xs text-secondary-500 mt-2">{description}</p>
        )}
      </div>
    </motion.div>
  )
}
