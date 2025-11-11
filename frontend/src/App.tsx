import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Distributions from './pages/Distributions'
import Sensitivities from './pages/Sensitivities'
import Attribution from './pages/Attribution'
import Optimizer from './pages/Optimizer'
import Backtest from './pages/Backtest'
import Report from './pages/Report'

const BASENAME = '/FX'

function App() {
  return (
    <Router basename={BASENAME}>
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
    </Router>
  )
}

export default App
