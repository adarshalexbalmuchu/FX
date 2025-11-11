import { useState } from 'react'
import { motion } from 'framer-motion'
import MetricCard from '../components/MetricCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  TrendingUp, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react'

export default function Dashboard() {
  const [isLoading] = useState(false)

  // Mock data - replace with actual API data
  const metrics = {
    npm: { value: '12.5%', change: 2.3 },
    roa: { value: '8.2%', change: 1.5 },
    var95: { value: '₹245M', change: -15.2 },
    cvar95: { value: '₹312M', change: -18.5 },
    hedgeEffectiveness: { value: '78%', change: 5.1 },
    volatility: { value: '8.2%', change: -3.4 },
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading simulation results..." size="lg" />
  }

  return (
    <div className="space-y-10">
      {/* Premium Page Header with gradient */}
      <motion.div 
        className="glass-card p-10 border-l-4 border-l-primary-600 shadow-card"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <motion.div
                className="p-3 bg-gradient-to-br from-primary-100 to-primary-50 rounded-xl shadow-sm"
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12 }}
              >
                <Zap className="w-8 h-8 text-primary-600" strokeWidth={2.5} />
              </motion.div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-secondary-900 via-primary-700 to-primary-600 bg-clip-text text-transparent leading-tight">
                Dashboard
              </h1>
            </div>
            <p className="text-secondary-600 text-lg leading-relaxed max-w-2xl">
              Real-time overview of profitability and risk metrics from FX simulations
            </p>
          </div>
          <motion.div
            className="badge-success px-5 py-2.5 text-sm font-bold shadow-sm"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            🟢 Live Data
          </motion.div>
        </div>
      </motion.div>

      {/* Section Divider */}
      <div className="section-divider" role="separator" aria-label="Section divider" />

      {/* Premium KPI Grid with enhanced spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <MetricCard
          title="Net Profit Margin"
          value={metrics.npm.value}
          change={metrics.npm.change}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="up"
          category="npm"
          description="Expected NPM across all simulated paths"
          delay={0}
        />
        
        <MetricCard
          title="Return on Assets"
          value={metrics.roa.value}
          change={metrics.roa.change}
          icon={<DollarSign className="w-5 h-5" />}
          trend="up"
          category="roa"
          description="Quarterly ROA with current hedge strategy"
          delay={0.1}
        />
        
        <MetricCard
          title="VaR (95%)"
          value={metrics.var95.value}
          change={metrics.var95.change}
          icon={<AlertTriangle className="w-5 h-5" />}
          trend="down"
          category="var"
          description="Maximum expected loss at 95% confidence"
          delay={0.2}
        />
        
        <MetricCard
          title="CVaR (95%)"
          value={metrics.cvar95.value}
          change={metrics.cvar95.change}
          icon={<Shield className="w-5 h-5" />}
          trend="down"
          category="cvar"
          description="Expected shortfall beyond VaR threshold"
          delay={0.3}
        />
        
        <MetricCard
          title="Hedge Effectiveness"
          value={metrics.hedgeEffectiveness.value}
          change={metrics.hedgeEffectiveness.change}
          icon={<BarChart3 className="w-5 h-5" />}
          trend="up"
          category="hedge"
          description="Percentage reduction in CVaR from hedging"
          delay={0.4}
        />
        
        <MetricCard
          title="NPM Volatility"
          value={metrics.volatility.value}
          change={metrics.volatility.change}
          icon={<Activity className="w-5 h-5" />}
          trend="down"
          category="neutral"
          description="Standard deviation of profitability"
          delay={0.5}
        />
      </div>

      {/* Section Divider */}
      <div className="section-divider" role="separator" aria-label="Section divider" />

      {/* Premium Summary Card with refined layout */}
      <motion.div
        className="glass-card p-8 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <h2 className="subsection-heading mb-8">Simulation Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">Configuration</h3>
            <dl className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-secondary-200/50">
                <dt className="text-secondary-600 font-medium">Model</dt>
                <dd className="font-bold text-secondary-900 tabular-nums">GBM</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-secondary-200/50">
                <dt className="text-secondary-600 font-medium">Paths Simulated</dt>
                <dd className="font-bold text-secondary-900 tabular-nums">10,000</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-secondary-200/50">
                <dt className="text-secondary-600 font-medium">Horizon</dt>
                <dd className="font-bold text-secondary-900 tabular-nums">4 quarters</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-secondary-200/50">
                <dt className="text-secondary-600 font-medium">Volatility (σ)</dt>
                <dd className="font-bold text-secondary-900 tabular-nums">8.2%</dd>
              </div>
            </dl>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-secondary-600 uppercase tracking-wider">Hedge Strategy</h3>
            <dl className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-secondary-200/50">
                <dt className="text-secondary-600 font-medium">Forward Contracts</dt>
                <dd className="font-bold text-secondary-900 tabular-nums">55%</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-secondary-200/50">
                <dt className="text-secondary-600 font-medium">Currency Options</dt>
                <dd className="font-bold text-secondary-900 tabular-nums">30%</dd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-secondary-200/50">
                <dt className="text-secondary-600 font-medium">Natural Hedge</dt>
                <dd className="font-bold text-secondary-900 tabular-nums">15%</dd>
              </div>
              <div className="flex justify-between items-center py-2">
                <dt className="text-secondary-600 font-medium">Total Hedged</dt>
                <dd className="font-bold text-primary-600 tabular-nums text-lg">100%</dd>
              </div>
            </dl>
          </div>
        </div>
      </motion.div>

      {/* Section Divider */}
      <div className="section-divider" role="separator" aria-label="Section divider" />

      {/* Premium Action Buttons with enhanced hover states */}
      <motion.div
        className="flex flex-wrap gap-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <motion.button 
          className="btn-primary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          Run New Simulation
        </motion.button>
        <motion.button 
          className="btn-secondary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          Optimize Hedge Ratios
        </motion.button>
        <motion.button 
          className="btn-secondary"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          Generate Report
        </motion.button>
      </motion.div>
    </div>
  )
}
