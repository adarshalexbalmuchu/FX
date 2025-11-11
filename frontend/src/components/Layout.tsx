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
  Moon,
  Sun,
} from 'lucide-react'
import { useDarkMode } from '../hooks/useDarkMode'
import { Button } from './ui/button'

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
  const { isDark, toggle } = useDarkMode()

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Premium Header with refined glassmorphism */}
      <header className="bg-white/95 dark:bg-card/95 backdrop-blur-2xl border-b border-secondary-200/60 dark:border-white/10 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"></div>
                <Activity className="w-11 h-11 text-primary-600 dark:text-primary-400 relative z-10 transition-transform duration-300 group-hover:scale-110" strokeWidth={2.5} />
                <Sparkles className="w-4 h-4 text-primary-400 dark:text-primary-300 absolute -top-1 -right-1 animate-pulse z-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 dark:from-primary-400 dark:via-primary-300 dark:to-primary-400 bg-clip-text text-transparent">
                  VolatiSense
                </h1>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold tracking-wide uppercase">
                  FX Risk Analytics
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="hidden md:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="flex items-center gap-4">
                {/* System Status Badge */}
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-950/50 dark:to-primary-900/30 border border-primary-200 dark:border-primary-800 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-2 h-2 bg-profit-500 rounded-full animate-pulse shadow-glow-sm"></div>
                  <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">Live</span>
                </div>
                
                {/* Premium Dark Mode Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggle}
                  className="rounded-full hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md"
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDark ? (
                    <Sun className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-primary-600" />
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Premium Navigation with refined depth */}
      <nav className="bg-white/90 dark:bg-card/90 backdrop-blur-2xl border-b border-secondary-200/60 dark:border-white/10 sticky top-20 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex space-x-2 overflow-x-auto py-4 scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-transparent">
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative group flex-shrink-0"
                >
                  <motion.div
                    className={`
                      flex items-center space-x-2.5 px-6 py-3 rounded-xl font-semibold text-sm
                      transition-all duration-300 whitespace-nowrap
                      ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 shadow-lg shadow-primary-500/25 scale-105'
                          : 'text-secondary-600 dark:text-secondary-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50/80 dark:hover:bg-primary-950/30 hover:shadow-md'
                      }
                    `}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: isActive ? 1.05 : 1.08, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? '' : 'group-hover:scale-110 transition-transform duration-300'}`} />
                    <span className="tracking-wide">{item.name}</span>
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 rounded-full shadow-glow-sm"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 25,
                      }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content with enhanced animations */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="animate-fade-in-page"
        >
          {children}
        </motion.div>
      </main>

      {/* Premium Footer with refined styling */}
      <footer className="bg-white/90 dark:bg-card/90 backdrop-blur-2xl border-t border-secondary-200/60 dark:border-white/10 mt-20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg opacity-0 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                <Activity className="w-6 h-6 text-primary-600 dark:text-primary-400 relative z-10" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-secondary-700 dark:text-secondary-300">
                  © 2025 VolatiSense v2.1
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  Premium Edition
                </p>
              </div>
            </div>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 text-center md:text-right max-w-md">
              Advanced FX Volatility & Hedging Optimization Platform
              <span className="block mt-1 text-xs text-secondary-500">
                Built with precision for financial professionals
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
