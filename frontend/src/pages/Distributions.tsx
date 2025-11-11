import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { BarChart3, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Distributions() {
  const [loading, setLoading] = useState(false);
  const [npmData, setNpmData] = useState<number[]>([]);
  const [roaData, setRoaData] = useState<number[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'npm' | 'roa'>('npm');

  useEffect(() => {
    // Simulate loading data - replace with actual API call
    loadDistributionData();
  }, []);

  const loadDistributionData = async () => {
    setLoading(true);
    // Simulated data - replace with: const response = await axios.post('/api/simulate', ...)
    setTimeout(() => {
      // Generate sample NPM distribution
      const sampleNPM = Array.from({ length: 5000 }, () => 
        0.12 + (Math.random() - 0.5) * 0.06 + (Math.random() - 0.5) * 0.03
      );
      const sampleROA = Array.from({ length: 5000 }, () => 
        0.15 + (Math.random() - 0.5) * 0.08 + (Math.random() - 0.5) * 0.04
      );
      setNpmData(sampleNPM);
      setRoaData(sampleROA);
      setLoading(false);
    }, 1000);
  };

  const currentData = selectedMetric === 'npm' ? npmData : roaData;
  const metricLabel = selectedMetric === 'npm' ? 'Net Profit Margin' : 'Return on Assets';

  if (loading) {
    return <LoadingSpinner message="Loading distributions..." />;
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
          <BarChart3 className="w-8 h-8 text-primary-500" />
          Profitability Distributions
        </h1>
        <p className="text-secondary-600 mt-2">
          Histogram and statistical analysis of NPM and ROA outcomes across {currentData.length.toLocaleString()} simulated paths
        </p>
      </div>

      {/* Metric Selector */}
      <div className="flex gap-4">
        <button
          onClick={() => setSelectedMetric('npm')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            selectedMetric === 'npm'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-white text-secondary-600 hover:bg-secondary-50'
          }`}
        >
          Net Profit Margin
        </button>
        <button
          onClick={() => setSelectedMetric('roa')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            selectedMetric === 'roa'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-white text-secondary-600 hover:bg-secondary-50'
          }`}
        >
          Return on Assets
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="text-sm text-secondary-600 mb-1">Mean</div>
          <div className="text-2xl font-bold text-secondary-900">
            {(currentData.reduce((a, b) => a + b, 0) / currentData.length * 100).toFixed(2)}%
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="text-sm text-secondary-600 mb-1">Std Dev</div>
          <div className="text-2xl font-bold text-secondary-900">
            {(Math.sqrt(currentData.reduce((acc, val) => {
              const mean = currentData.reduce((a, b) => a + b, 0) / currentData.length;
              return acc + Math.pow(val - mean, 2);
            }, 0) / currentData.length) * 100).toFixed(2)}%
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="text-sm text-secondary-600 mb-1">5th Percentile</div>
          <div className="text-2xl font-bold text-orange-600">
            {(currentData.sort((a, b) => a - b)[Math.floor(currentData.length * 0.05)] * 100).toFixed(2)}%
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="text-sm text-secondary-600 mb-1">95th Percentile</div>
          <div className="text-2xl font-bold text-green-600">
            {(currentData.sort((a, b) => a - b)[Math.floor(currentData.length * 0.95)] * 100).toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Histogram */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          {metricLabel} Distribution
        </h2>
        <Plot
          data={[
            {
              x: currentData,
              type: 'histogram' as const,
              marker: {
                color: '#14B8A6',
                line: {
                  color: '#0F172A',
                  width: 0.5
                }
              },
              opacity: 0.75,
              name: metricLabel
            }
          ]}
          layout={{
            title: '',
            xaxis: {
              title: `${metricLabel} (%)`,
              tickformat: '.1%',
              gridcolor: '#E2E8F0'
            },
            yaxis: {
              title: 'Frequency',
              gridcolor: '#E2E8F0'
            },
            plot_bgcolor: '#F8FAFC',
            paper_bgcolor: 'transparent',
            font: {
              family: 'Inter, sans-serif',
              size: 12,
              color: '#475569'
            },
            margin: { l: 60, r: 40, t: 20, b: 60 },
            bargap: 0.05
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['lasso2d', 'select2d']
          }}
          style={{ width: '100%', height: '400px' }}
        />
      </div>

      {/* Box Plot */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Box Plot & Violin
        </h2>
        <Plot
          data={[
            {
              y: currentData,
              type: 'box',
              name: metricLabel,
              marker: {
                color: '#14B8A6'
              },
              boxmean: 'sd'
            }
          ]}
          layout={{
            title: '',
            yaxis: {
              title: `${metricLabel} (%)`,
              tickformat: '.1%',
              gridcolor: '#E2E8F0'
            },
            plot_bgcolor: '#F8FAFC',
            paper_bgcolor: 'transparent',
            font: {
              family: 'Inter, sans-serif',
              size: 12,
              color: '#475569'
            },
            margin: { l: 60, r: 40, t: 20, b: 60 }
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false
          }}
          style={{ width: '100%', height: '400px' }}
        />
      </div>

      {/* Percentile Table */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Percentile Analysis
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 font-semibold text-secondary-700">Percentile</th>
                <th className="text-right py-3 px-4 font-semibold text-secondary-700">Value</th>
              </tr>
            </thead>
            <tbody>
              {[1, 5, 10, 25, 50, 75, 90, 95, 99].map(p => {
                const sorted = [...currentData].sort((a, b) => a - b);
                const value = sorted[Math.floor(currentData.length * p / 100)];
                return (
                  <tr key={p} className="border-b border-secondary-100 hover:bg-secondary-50">
                    <td className="py-3 px-4 text-secondary-900">P{p}</td>
                    <td className="py-3 px-4 text-right font-mono text-secondary-900">
                      {(value * 100).toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="glass-card p-6 border-l-4 border-primary-500">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-secondary-900 mb-2">Interpretation Guide</h3>
            <ul className="text-sm text-secondary-600 space-y-1">
              <li>• <strong>Mean:</strong> Average profitability across all scenarios</li>
              <li>• <strong>Std Dev:</strong> Volatility/uncertainty in outcomes</li>
              <li>• <strong>5th Percentile:</strong> Worst-case scenario (95% of outcomes are better)</li>
              <li>• <strong>95th Percentile:</strong> Best-case scenario (5% of outcomes are better)</li>
              <li>• Wider distributions indicate higher uncertainty from FX volatility</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
