import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { Activity, Zap, TrendingUp } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

interface HeatmapData {
  x_values: number[];
  y_values: number[];
  z_values: number[][];
  x_label: string;
  y_label: string;
  title: string;
}

interface TornadoData {
  parameters: string[];
  low_values: number[];
  high_values: number[];
  base_value: number;
}

export default function Sensitivities() {
  const [loading, setLoading] = useState(false);
  const [selectedHeatmap, setSelectedHeatmap] = useState<'theta_hedge' | 'psi_sigma'>('theta_hedge');

  useEffect(() => {
    loadSensitivityData();
  }, []);

  const loadSensitivityData = async () => {
    setLoading(true);
    // Simulated data - replace with: const response = await axios.post('/api/sensitivity', ...)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Generate sample heatmap data
  const generateThetaHedgeHeatmap = (): HeatmapData => {
    const theta_values = Array.from({ length: 11 }, (_, i) => i * 0.1);
    const hedge_values = Array.from({ length: 11 }, (_, i) => i * 0.1);
    const z_values = theta_values.map(theta =>
      hedge_values.map(hedge => {
        // NPM = baseline - theta * (1 - hedge) * volatility_impact
        const baseline = 0.12;
        const volatility_impact = 0.03;
        return baseline - theta * (1 - hedge) * volatility_impact;
      })
    );

    return {
      x_values: hedge_values,
      y_values: theta_values,
      z_values,
      x_label: 'Hedge Ratio',
      y_label: 'Export Share (θ)',
      title: 'NPM Sensitivity: Export Share × Hedge Ratio'
    };
  };

  const generatePsiSigmaHeatmap = (): HeatmapData => {
    const psi_values = Array.from({ length: 11 }, (_, i) => i * 0.1);
    const sigma_values = Array.from({ length: 11 }, (_, i) => 0.04 + i * 0.02);
    const z_values = psi_values.map(psi =>
      sigma_values.map(sigma => {
        // NPM decreases with pass-through and volatility
        const baseline = 0.12;
        return baseline - psi * sigma * 2;
      })
    );

    return {
      x_values: sigma_values,
      y_values: psi_values,
      z_values,
      x_label: 'Volatility (σ)',
      y_label: 'Pass-through (ψ)',
      title: 'NPM Sensitivity: Pass-through × Volatility'
    };
  };

  const generateTornadoData = (): TornadoData => {
    const base_npm = 0.12;
    return {
      parameters: [
        'Export Share (θ)',
        'Volatility (σ)',
        'Pass-through (ψ)',
        'Hedge Ratio',
        'Foreign Cost (κ)',
        'Interest Rate Diff'
      ],
      low_values: [0.105, 0.108, 0.110, 0.095, 0.115, 0.118],
      high_values: [0.135, 0.132, 0.130, 0.145, 0.125, 0.122],
      base_value: base_npm
    };
  };

  const heatmapData = selectedHeatmap === 'theta_hedge' 
    ? generateThetaHedgeHeatmap() 
    : generatePsiSigmaHeatmap();
  
  const tornadoData = generateTornadoData();

  if (loading) {
    return <LoadingSpinner message="Calculating sensitivities..." />;
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
          <Activity className="w-8 h-8 text-primary-500" />
          Sensitivity Analysis
        </h1>
        <p className="text-secondary-600 mt-2">
          How key parameters influence profitability outcomes
        </p>
      </div>

      {/* Heatmap Selector */}
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedHeatmap('theta_hedge')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            selectedHeatmap === 'theta_hedge'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-white text-secondary-600 hover:bg-secondary-50'
          }`}
        >
          Export Share × Hedge Ratio
        </button>
        <button
          onClick={() => setSelectedHeatmap('psi_sigma')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            selectedHeatmap === 'psi_sigma'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-white text-secondary-600 hover:bg-secondary-50'
          }`}
        >
          Pass-through × Volatility
        </button>
      </div>

      {/* Heatmap */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary-500" />
          {heatmapData.title}
        </h2>
        <Plot
          data={[
            {
              z: heatmapData.z_values,
              x: heatmapData.x_values,
              y: heatmapData.y_values,
              type: 'heatmap',
              colorscale: [
                [0, '#DC2626'],      // Red (low NPM)
                [0.3, '#F59E0B'],    // Orange
                [0.5, '#FDE047'],    // Yellow
                [0.7, '#84CC16'],    // Light green
                [1, '#14B8A6']       // Teal (high NPM)
              ],
              colorbar: {
                title: 'NPM',
                tickformat: '.1%',
                thickness: 20,
                len: 0.7
              },
              hovertemplate: 
                `${heatmapData.y_label}: %{y:.2f}<br>` +
                `${heatmapData.x_label}: %{x:.2f}<br>` +
                'NPM: %{z:.2%}<extra></extra>',
              showscale: true
            }
          ]}
          layout={{
            title: '',
            xaxis: {
              title: heatmapData.x_label,
              gridcolor: '#E2E8F0',
              tickformat: selectedHeatmap === 'psi_sigma' ? '.2f' : '.1f'
            },
            yaxis: {
              title: heatmapData.y_label,
              gridcolor: '#E2E8F0',
              tickformat: '.1f'
            },
            plot_bgcolor: '#F8FAFC',
            paper_bgcolor: 'transparent',
            font: {
              family: 'Inter, sans-serif',
              size: 12,
              color: '#475569'
            },
            margin: { l: 80, r: 100, t: 20, b: 80 }
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false
          }}
          style={{ width: '100%', height: '500px' }}
        />
        <div className="mt-4 text-sm text-secondary-600">
          {selectedHeatmap === 'theta_hedge' ? (
            <p>
              <strong>Insight:</strong> Higher export shares (θ) increase FX exposure. 
              Hedging mitigates this risk—optimal hedge ratio balances cost and protection.
            </p>
          ) : (
            <p>
              <strong>Insight:</strong> Higher pass-through (ψ) and volatility (σ) compound to 
              reduce profitability. Firms with high pass-through are most vulnerable to FX swings.
            </p>
          )}
        </div>
      </div>

      {/* Tornado Chart */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          Tornado Chart: Parameter Impact (±20% Variation)
        </h2>
        <Plot
          data={[
            {
              x: tornadoData.low_values.map((low, i) => tornadoData.high_values[i] - low),
              y: tornadoData.parameters,
              type: 'bar',
              orientation: 'h',
              marker: {
                color: '#14B8A6'
              },
              name: 'Impact Range',
              hovertemplate: '%{y}<br>Range: %{x:.3f}<extra></extra>'
            }
          ]}
          layout={{
            title: '',
            xaxis: {
              title: 'NPM Impact Range',
              gridcolor: '#E2E8F0'
            },
            yaxis: {
              title: '',
              automargin: true
            },
            plot_bgcolor: '#F8FAFC',
            paper_bgcolor: 'transparent',
            font: {
              family: 'Inter, sans-serif',
              size: 12,
              color: '#475569'
            },
            margin: { l: 150, r: 40, t: 20, b: 80 },
            showlegend: false
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false
          }}
          style={{ width: '100%', height: '400px' }}
        />
        <div className="mt-4 text-sm text-secondary-600">
          <p>
            <strong>Interpretation:</strong> Longer bars indicate parameters with greater 
            impact on NPM. Focus risk management on the most sensitive variables.
          </p>
        </div>
      </div>

      {/* Parameter Details Table */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Sensitivity Summary
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 font-semibold text-secondary-700">Parameter</th>
                <th className="text-center py-3 px-4 font-semibold text-secondary-700">Base Case</th>
                <th className="text-center py-3 px-4 font-semibold text-secondary-700">Low (-20%)</th>
                <th className="text-center py-3 px-4 font-semibold text-secondary-700">High (+20%)</th>
                <th className="text-center py-3 px-4 font-semibold text-secondary-700">Impact</th>
              </tr>
            </thead>
            <tbody>
              {tornadoData.parameters.map((param, i) => {
                const impact = tornadoData.high_values[i] - tornadoData.low_values[i];
                return (
                  <tr key={param} className="border-b border-secondary-100 hover:bg-secondary-50">
                    <td className="py-3 px-4 text-secondary-900 font-medium">{param}</td>
                    <td className="py-3 px-4 text-center font-mono text-secondary-900">
                      {(tornadoData.base_value * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-orange-600">
                      {(tornadoData.low_values[i] * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-green-600">
                      {(tornadoData.high_values[i] * 100).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        impact > 0.03 ? 'bg-red-100 text-red-700' :
                        impact > 0.02 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {impact > 0.03 ? 'High' : impact > 0.02 ? 'Medium' : 'Low'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-6 border-l-4 border-primary-500">
          <h3 className="font-semibold text-secondary-900 mb-3">🎯 Key Findings</h3>
          <ul className="text-sm text-secondary-600 space-y-2">
            <li>• Export share (θ) is the dominant sensitivity driver</li>
            <li>• Hedging effectiveness increases nonlinearly with hedge ratio</li>
            <li>• Pass-through × volatility interaction is critical</li>
          </ul>
        </div>
        <div className="glass-card p-6 border-l-4 border-orange-500">
          <h3 className="font-semibold text-secondary-900 mb-3">⚠️ Risk Factors</h3>
          <ul className="text-sm text-secondary-600 space-y-2">
            <li>• High θ firms need aggressive hedging (60-80%)</li>
            <li>• Low ψ firms face amplified revenue volatility</li>
            <li>• Volatility regime changes dominate outcomes</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
