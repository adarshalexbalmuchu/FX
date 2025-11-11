import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  TrendingUp,
  Sliders,
  PieChart,
  Target,
  History,
  FileText,
  Activity,
} from 'lucide-react'

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Distributions', href: '/distributions', icon: TrendingUp },
  { name: 'Sensitivities', href: '/sensitivities', icon: Sliders },
  { name: 'Attribution', href: '/attribution', icon: PieChart },
  { name: 'Optimizer', href: '/optimizer', icon: Target },
  { name: 'Backtest', href: '/backtest', icon: History },
  { name: 'Report', href: '/report', icon: FileText },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-primary-500" strokeWidth={2.5} />
              <h1 className="text-2xl font-bold font-heading text-gradient">
                VolatiSense
              </h1>
            </div>
            <p className="text-sm text-secondary-600">
              FX Volatility & Hedging Platform
            </p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative"
                >
                  <motion.div
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm
                      transition-colors duration-200 whitespace-nowrap
                      ${
                        isActive
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-secondary-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-secondary-500">
            © 2025 VolatiSense v1.0 | Advanced FX Risk Analytics Platform
          </p>
        </div>
      </footer>
    </div>
  )
}
