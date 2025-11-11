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
    <div className="space-y-8">
      {/* Enhanced Page Header */}
      <motion.div 
        className="glass-card p-8 border-l-4 border-l-primary-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-primary-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary-900 via-primary-700 to-primary-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <p className="text-secondary-600 text-lg">
              Real-time overview of profitability and risk metrics from FX simulations
            </p>
          </div>
          <motion.div
            className="badge-success px-4 py-2 text-sm font-bold"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Live Data
          </motion.div>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Net Profit Margin"
          value={metrics.npm.value}
          change={metrics.npm.change}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="up"
          description="Expected NPM across all simulated paths"
          delay={0}
        />
        
        <MetricCard
          title="Return on Assets"
          value={metrics.roa.value}
          change={metrics.roa.change}
          icon={<DollarSign className="w-5 h-5" />}
          trend="up"
          description="Quarterly ROA with current hedge strategy"
          delay={0.1}
        />
        
        <MetricCard
          title="VaR (95%)"
          value={metrics.var95.value}
          change={metrics.var95.change}
          icon={<AlertTriangle className="w-5 h-5" />}
          trend="down"
          description="Maximum expected loss at 95% confidence"
          delay={0.2}
        />
        
        <MetricCard
          title="CVaR (95%)"
          value={metrics.cvar95.value}
          change={metrics.cvar95.change}
          icon={<Shield className="w-5 h-5" />}
          trend="down"
          description="Expected shortfall beyond VaR threshold"
          delay={0.3}
        />
        
        <MetricCard
          title="Hedge Effectiveness"
          value={metrics.hedgeEffectiveness.value}
          change={metrics.hedgeEffectiveness.change}
          icon={<BarChart3 className="w-5 h-5" />}
          trend="up"
          description="Percentage reduction in CVaR from hedging"
          delay={0.4}
        />
        
        <MetricCard
          title="NPM Volatility"
          value={metrics.volatility.value}
          change={metrics.volatility.change}
          icon={<Activity className="w-5 h-5" />}
          trend="down"
          description="Standard deviation of profitability"
          delay={0.5}
        />
      </div>

      {/* Summary Card */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="subsection-heading">Simulation Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-secondary-600 mb-3">Configuration</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-secondary-600">Model</dt>
                <dd className="font-medium text-secondary-900">GBM</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-600">Paths Simulated</dt>
                <dd className="font-medium text-secondary-900">10,000</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-600">Horizon</dt>
                <dd className="font-medium text-secondary-900">4 quarters</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-600">Volatility (σ)</dt>
                <dd className="font-medium text-secondary-900">8.2%</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-secondary-600 mb-3">Hedge Strategy</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-secondary-600">Forward Contracts</dt>
                <dd className="font-medium text-secondary-900">55%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-600">Currency Options</dt>
                <dd className="font-medium text-secondary-900">30%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-600">Natural Hedge</dt>
                <dd className="font-medium text-secondary-900">15%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary-600">Total Hedged</dt>
                <dd className="font-medium text-primary-600">100%</dd>
              </div>
            </dl>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-wrap gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <button className="btn-primary">
          Run New Simulation
        </button>
        <button className="btn-secondary">
          Optimize Hedge Ratios
        </button>
        <button className="btn-secondary">
          Generate Report
        </button>
      </motion.div>
    </div>
  )
}
