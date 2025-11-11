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
  Sparkles,
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
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-primary-50/30 to-secondary-50">
      {/* Header with gradient background */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-secondary-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <Activity className="w-10 h-10 text-primary-600" strokeWidth={2.5} />
                <Sparkles className="w-4 h-4 text-primary-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gradient">
                  VolatiSense
                </h1>
                <p className="text-xs text-secondary-500 font-medium">FX Risk Analytics</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="hidden md:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-primary-100/50 border border-primary-200">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-secondary-700">System Online</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs with improved styling */}
      <nav className="bg-white/70 backdrop-blur-md border-b border-secondary-200/50 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-3 scrollbar-hide">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative group"
                >
                  <motion.div
                    className={`
                      flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium text-sm
                      transition-all duration-300 whitespace-nowrap
                      ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-primary-600 to-primary-500 shadow-md shadow-primary-500/30'
                          : 'text-secondary-600 hover:text-primary-700 hover:bg-primary-50/80'
                      }
                    `}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
                    <span>{item.name}</span>
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
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

      {/* Main Content with fade animation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="animate-fade-in-page"
        >
          {children}
        </motion.div>
      </main>

      {/* Footer with gradient */}
      <footer className="bg-gradient-to-r from-white/80 to-primary-50/50 backdrop-blur-md border-t border-secondary-200/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              <p className="text-sm text-secondary-600 font-medium">
                © 2025 VolatiSense v1.0
              </p>
            </div>
            <p className="text-sm text-secondary-500">
              Advanced FX Volatility & Hedging Optimization Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
