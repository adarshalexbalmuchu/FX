import { Route, Routes } from 'react-router-dom';
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
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/distributions" element={<Distributions />} />
        <Route path="/sensitivities" element={<Sensitivities />} />
        <Route path="/attribution" element={<Attribution />} />
        <Route path="/optimizer" element={<Optimizer />} />
        <Route path="/backtest" element={<Backtest />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </Layout>
  )
}

export default App
