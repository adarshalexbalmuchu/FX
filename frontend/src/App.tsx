import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Distributions from './pages/Distributions'
import Sensitivities from './pages/Sensitivities'
import Attribution from './pages/Attribution'
import Optimizer from './pages/Optimizer'
import Backtest from './pages/Backtest'
import Report from './pages/Report'

function App() {
  return (
    <Router>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/distributions" element={<Distributions />} />
            <Route path="/sensitivities" element={<Sensitivities />} />
            <Route path="/attribution" element={<Attribution />} />
            <Route path="/optimizer" element={<Optimizer />} />
            <Route path="/backtest" element={<Backtest />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </Router>
  )
}

export default App
