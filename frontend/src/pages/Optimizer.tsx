import { useState } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { Target, TrendingUp, Shield, Zap, ChevronRight } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

interface OptimizationResult {
  optimal_hedge_ratio: {
    forwards: number;
    options: number;
    natural: number;
  };
  expected_npm: number;
  expected_roa: number;
  cvar_95: number;
  sharpe_ratio: number;
}

interface EfficientFrontierPoint {
  hedge_ratio: number;
  expected_npm: number;
  npm_std: number;
  cvar_95: number;
}

export default function Optimizer() {
  const [loading, setLoading] = useState(false);
  const [cvarTarget, setCvarTarget] = useState(0.05);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);

  const runOptimization = async () => {
    setLoading(true);
    // Simulated optimization - replace with: const response = await axios.post('/api/optimize', ...)
    setTimeout(() => {
      setOptimizationResult({
        optimal_hedge_ratio: {
          forwards: 0.52,
          options: 0.28,
          natural: 0.20
        },
        expected_npm: 0.1245,
        expected_roa: 0.1521,
        cvar_95: 0.0485,
        sharpe_ratio: 1.85
      });
      setLoading(false);
    }, 1500);
  };

  // Generate efficient frontier data
  const generateEfficientFrontier = (): EfficientFrontierPoint[] => {
    return Array.from({ length: 21 }, (_, i) => {
      const hedge_ratio = i * 0.05;
      const base_npm = 0.12;
      const volatility_reduction = hedge_ratio * 0.04;
      const hedge_cost = hedge_ratio * 0.008;
      
      return {
        hedge_ratio,
        expected_npm: base_npm - hedge_cost + volatility_reduction * 0.3,
        npm_std: 0.03 * (1 - hedge_ratio * 0.7),
        cvar_95: 0.08 * (1 - hedge_ratio * 0.65)
      };
    });
  };

  const frontierData = generateEfficientFrontier();

  if (loading) {
    return <LoadingSpinner message="Running CVaR-constrained optimization..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="section-heading flex items-center gap-3">
          <Target className="w-8 h-8 text-primary-500" />
          Hedge Ratio Optimizer
        </h1>
        <p className="text-secondary-600 mt-2">
          Find optimal hedge ratios using CVaR-constrained SLSQP optimization
        </p>
      </div>

      {/* Optimization Controls */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Optimization Parameters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CVaR Target */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              CVaR Target (95% confidence)
            </label>
            <input
              type="range"
              min="0.02"
              max="0.10"
              step="0.005"
              value={cvarTarget}
              onChange={(e) => setCvarTarget(parseFloat(e.target.value))}
              className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-sm text-secondary-600 mt-1">
              <span>2%</span>
              <span className="font-semibold text-primary-600">{(cvarTarget * 100).toFixed(1)}%</span>
              <span>10%</span>
            </div>
            <p className="text-xs text-secondary-500 mt-2">
              Maximum acceptable loss in worst 5% scenarios
            </p>
          </div>

          {/* Run Button */}
          <div className="flex items-end">
            <button
              onClick={runOptimization}
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Run Optimization
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Optimization Results */}
      {optimizationResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-6 border-2 border-primary-500"
        >
          <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary-500" />
            Optimal Hedge Strategy
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-primary-50 to-white p-4 rounded-lg border border-primary-200">
              <div className="text-sm text-secondary-600 mb-1">Expected NPM</div>
              <div className="text-2xl font-bold text-primary-600">
                {(optimizationResult.expected_npm * 100).toFixed(2)}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-200">
              <div className="text-sm text-secondary-600 mb-1">Expected ROA</div>
              <div className="text-2xl font-bold text-green-600">
                {(optimizationResult.expected_roa * 100).toFixed(2)}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-white p-4 rounded-lg border border-orange-200">
              <div className="text-sm text-secondary-600 mb-1">CVaR (95%)</div>
              <div className="text-2xl font-bold text-orange-600">
                {(optimizationResult.cvar_95 * 100).toFixed(2)}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-secondary-600 mb-1">Sharpe Ratio</div>
              <div className="text-2xl font-bold text-blue-600">
                {optimizationResult.sharpe_ratio.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Optimal Hedge Ratios */}
          <h3 className="font-semibold text-secondary-900 mb-3">Recommended Hedge Allocation</h3>
          <div className="space-y-3">
            {/* Forward */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-secondary-700">Forward Contracts</span>
                <span className="font-semibold text-secondary-900">
                  {(optimizationResult.optimal_hedge_ratio.forwards * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${optimizationResult.optimal_hedge_ratio.forwards * 100}%` }}
                />
              </div>
            </div>

            {/* Options */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-secondary-700">Currency Options</span>
                <span className="font-semibold text-secondary-900">
                  {(optimizationResult.optimal_hedge_ratio.options * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${optimizationResult.optimal_hedge_ratio.options * 100}%` }}
                />
              </div>
            </div>

            {/* Natural */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-secondary-700">Natural Hedge</span>
                <span className="font-semibold text-secondary-900">
                  {(optimizationResult.optimal_hedge_ratio.natural * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-secondary-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${optimizationResult.optimal_hedge_ratio.natural * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Efficient Frontier */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          Efficient Frontier: Risk vs Return
        </h2>
        <Plot
          data={[
            {
              x: frontierData.map(p => p.npm_std * 100),
              y: frontierData.map(p => p.expected_npm * 100),
              type: 'scatter',
              mode: 'lines+markers',
              name: 'Efficient Frontier',
              line: {
                color: '#14B8A6',
                width: 3
              },
              marker: {
                color: '#14B8A6',
                size: 8,
                line: {
                  color: '#0F172A',
                  width: 1
                }
              },
              text: frontierData.map(p => `Hedge: ${(p.hedge_ratio * 100).toFixed(0)}%`),
              hovertemplate: 
                'Risk (Std): %{x:.2f}%<br>' +
                'Return (NPM): %{y:.2f}%<br>' +
                '%{text}<extra></extra>'
            },
            // Optimal point
            optimizationResult ? {
              x: [frontierData.find(p => 
                Math.abs(p.hedge_ratio - 
                  (optimizationResult.optimal_hedge_ratio.forwards + 
                   optimizationResult.optimal_hedge_ratio.options)) < 0.05
              )?.npm_std! * 100],
              y: [optimizationResult.expected_npm * 100],
              type: 'scatter',
              mode: 'markers',
              name: 'Optimal Point',
              marker: {
                color: '#EF4444',
                size: 15,
                symbol: 'star',
                line: {
                  color: '#FFFFFF',
                  width: 2
                }
              },
              hovertemplate: 
                'OPTIMAL STRATEGY<br>' +
                'Risk: %{x:.2f}%<br>' +
                'Return: %{y:.2f}%<extra></extra>'
            } as any : {} as any
          ].filter(d => d.type)}
          layout={{
            title: '',
            xaxis: {
              title: 'Risk (NPM Std Dev %)',
              gridcolor: '#E2E8F0',
              range: [0, Math.max(...frontierData.map(p => p.npm_std * 100)) * 1.1]
            },
            yaxis: {
              title: 'Expected Return (NPM %)',
              gridcolor: '#E2E8F0',
              range: [
                Math.min(...frontierData.map(p => p.expected_npm * 100)) * 0.95,
                Math.max(...frontierData.map(p => p.expected_npm * 100)) * 1.05
              ]
            },
            plot_bgcolor: '#F8FAFC',
            paper_bgcolor: 'transparent',
            font: {
              family: 'Inter, sans-serif',
              size: 12,
              color: '#475569'
            },
            margin: { l: 80, r: 40, t: 20, b: 80 },
            showlegend: true,
            legend: {
              x: 0.02,
              y: 0.98,
              bgcolor: 'rgba(255,255,255,0.9)',
              bordercolor: '#E2E8F0',
              borderwidth: 1
            }
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false
          }}
          style={{ width: '100%', height: '500px' }}
        />
        <div className="mt-4 text-sm text-secondary-600">
          <p>
            <strong>Interpretation:</strong> Each point represents a different hedge ratio (0% to 100%). 
            Move up and left to find optimal risk-return combinations. The red star shows the CVaR-constrained optimum.
          </p>
        </div>
      </div>

      {/* CVaR Analysis */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          CVaR Impact by Hedge Ratio
        </h2>
        <Plot
          data={[
            {
              x: frontierData.map(p => p.hedge_ratio * 100),
              y: frontierData.map(p => p.cvar_95 * 100),
              type: 'scatter',
              mode: 'lines',
              fill: 'tozeroy',
              name: 'CVaR (95%)',
              line: {
                color: '#EF4444',
                width: 2
              },
              fillcolor: 'rgba(239, 68, 68, 0.2)'
            },
            // CVaR target line
            {
              x: [0, 100],
              y: [cvarTarget * 100, cvarTarget * 100],
              type: 'scatter',
              mode: 'lines',
              name: 'CVaR Target',
              line: {
                color: '#F59E0B',
                width: 2,
                dash: 'dash'
              }
            }
          ]}
          layout={{
            title: '',
            xaxis: {
              title: 'Hedge Ratio (%)',
              gridcolor: '#E2E8F0'
            },
            yaxis: {
              title: 'CVaR at 95% (%)',
              gridcolor: '#E2E8F0'
            },
            plot_bgcolor: '#F8FAFC',
            paper_bgcolor: 'transparent',
            font: {
              family: 'Inter, sans-serif',
              size: 12,
              color: '#475569'
            },
            margin: { l: 80, r: 40, t: 20, b: 80 },
            showlegend: true,
            legend: {
              x: 0.7,
              y: 0.98
            }
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false
          }}
          style={{ width: '100%', height: '400px' }}
        />
      </div>

      {/* Strategy Comparison Table */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Strategy Comparison
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 font-semibold text-secondary-700">Strategy</th>
                <th className="text-center py-3 px-4 font-semibold text-secondary-700">Hedge Ratio</th>
                <th className="text-center py-3 px-4 font-semibold text-secondary-700">Expected NPM</th>
                <th className="text-center py-3 px-4 font-semibold text-secondary-700">NPM Std</th>
                <th className="text-center py-3 px-4 font-semibold text-secondary-700">CVaR 95%</th>
                <th className="text-center py-3 px-4 font-semibold text-secondary-700">Sharpe</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'No Hedge', ratio: 0, npm: 0.120, std: 0.030, cvar: 0.080, sharpe: 0.50 },
                { name: 'Conservative (25%)', ratio: 0.25, npm: 0.122, std: 0.024, cvar: 0.063, sharpe: 1.10 },
                { name: 'Moderate (50%)', ratio: 0.50, npm: 0.124, std: 0.018, cvar: 0.048, sharpe: 1.65 },
                { name: 'Optimal (CVaR)', ratio: 0.52, npm: 0.1245, std: 0.017, cvar: 0.0485, sharpe: 1.85, highlight: true },
                { name: 'Aggressive (75%)', ratio: 0.75, npm: 0.123, std: 0.012, cvar: 0.035, sharpe: 1.75 },
                { name: 'Full Hedge (100%)', ratio: 1.00, npm: 0.120, std: 0.008, cvar: 0.025, sharpe: 1.40 }
              ].map((strategy) => (
                <tr 
                  key={strategy.name} 
                  className={`border-b border-secondary-100 ${
                    strategy.highlight 
                      ? 'bg-primary-50 font-semibold' 
                      : 'hover:bg-secondary-50'
                  }`}
                >
                  <td className="py-3 px-4 text-secondary-900">
                    {strategy.highlight && '⭐ '}{strategy.name}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-secondary-900">
                    {(strategy.ratio * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-secondary-900">
                    {(strategy.npm * 100).toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-secondary-900">
                    {(strategy.std * 100).toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-secondary-900">
                    {(strategy.cvar * 100).toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-secondary-900">
                    {strategy.sharpe.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="glass-card p-6 border-l-4 border-primary-500">
        <h3 className="font-semibold text-secondary-900 mb-3">💡 Optimization Insights</h3>
        <ul className="text-sm text-secondary-600 space-y-2">
          <li>• <strong>Optimal hedge ratio:</strong> ~52% balances return enhancement with risk reduction</li>
          <li>• <strong>Sharpe ratio peaks</strong> at moderate hedging (50-60%) before declining due to costs</li>
          <li>• <strong>Full hedging</strong> eliminates volatility but sacrifices upside potential and incurs max costs</li>
          <li>• <strong>CVaR constraint</strong> prevents under-hedging in tail risk scenarios</li>
          <li>• <strong>Forward contracts dominate</strong> due to lower cost vs options for directional hedging</li>
        </ul>
      </div>
    </motion.div>
  );
}
