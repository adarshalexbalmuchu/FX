import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Plot from 'react-plotly.js';
import { TrendingDown, TrendingUp, DollarSign, Shield } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

interface WaterfallItem {
  label: string;
  value: number;
  type: 'base' | 'increase' | 'decrease' | 'total';
}

export default function Attribution() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAttributionData();
  }, []);

  const loadAttributionData = async () => {
    setLoading(true);
    // Simulated data - replace with: const response = await axios.post('/api/simulate', ...)
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  // Sample waterfall data showing profit attribution
  const generateWaterfallData = (): WaterfallItem[] => {
    return [
      { label: 'Base Revenue', value: 8500, type: 'base' },
      { label: 'FX Revenue Impact', value: -340, type: 'decrease' },
      { label: 'Operating Revenue', value: 8160, type: 'total' },
      { label: 'Base Costs', value: -6800, type: 'decrease' },
      { label: 'FX Cost Impact', value: -122, type: 'decrease' },
      { label: 'Operating Profit', value: 1238, type: 'total' },
      { label: 'Forward Hedge P&L', value: 85, type: 'increase' },
      { label: 'Option Hedge P&L', value: 42, type: 'increase' },
      { label: 'Natural Hedge Benefit', value: 28, type: 'increase' },
      { label: 'Net Profit', value: 1393, type: 'total' }
    ];
  };

  const waterfallData = generateWaterfallData();

  // Calculate NPM and ROA
  const netProfit = waterfallData.find(item => item.label === 'Net Profit')?.value || 0;
  const baseRevenue = waterfallData.find(item => item.label === 'Base Revenue')?.value || 0;
  const npm = netProfit / baseRevenue;
  const roa = netProfit / 45000; // Assuming assets of 45,000

  // Prepare data for Plotly waterfall
  const waterfallPlotData = {
    x: waterfallData.map(item => item.label),
    y: waterfallData.map(item => item.value),
    measure: waterfallData.map(item => {
      if (item.type === 'base') return 'absolute';
      if (item.type === 'total') return 'total';
      return 'relative';
    }),
    text: waterfallData.map(item => 
      item.type === 'total' || item.type === 'base'
        ? `₹${item.value.toFixed(0)} Cr`
        : `${item.value >= 0 ? '+' : ''}₹${item.value.toFixed(0)} Cr`
    ),
    textposition: 'outside',
    connector: {
      line: {
        color: '#94A3B8',
        width: 2,
        dash: 'dot'
      }
    },
    increasing: { marker: { color: '#14B8A6' } },
    decreasing: { marker: { color: '#EF4444' } },
    totals: { marker: { color: '#3B82F6' } }
  };

  // Component breakdown
  const fxRevenue = waterfallData.find(item => item.label === 'FX Revenue Impact')?.value || 0;
  const fxCost = waterfallData.find(item => item.label === 'FX Cost Impact')?.value || 0;
  const forwardPnl = waterfallData.find(item => item.label === 'Forward Hedge P&L')?.value || 0;
  const optionPnl = waterfallData.find(item => item.label === 'Option Hedge P&L')?.value || 0;
  const naturalHedge = waterfallData.find(item => item.label === 'Natural Hedge Benefit')?.value || 0;

  const totalHedgePnl = forwardPnl + optionPnl + naturalHedge;
  const netFxImpact = fxRevenue + fxCost + totalHedgePnl;

  if (loading) {
    return <LoadingSpinner message="Calculating attribution..." />;
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
          <DollarSign className="w-8 h-8 text-primary-500" />
          Profit Attribution Analysis
        </h1>
        <p className="text-secondary-600 mt-2">
          Waterfall breakdown of FX revenue impact, costs, and hedging P&L
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="text-sm text-secondary-600 mb-1">Net Profit</div>
          <div className="text-2xl font-bold text-primary-600">
            ₹{netProfit.toFixed(0)} Cr
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="text-sm text-secondary-600 mb-1">Net Profit Margin</div>
          <div className="text-2xl font-bold text-secondary-900">
            {(npm * 100).toFixed(2)}%
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="text-sm text-secondary-600 mb-1">Return on Assets</div>
          <div className="text-2xl font-bold text-secondary-900">
            {(roa * 100).toFixed(2)}%
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="text-sm text-secondary-600 mb-1">Net FX Impact</div>
          <div className={`text-2xl font-bold ${netFxImpact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netFxImpact >= 0 ? '+' : ''}₹{netFxImpact.toFixed(0)} Cr
          </div>
        </div>
      </div>

      {/* Waterfall Chart */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Profit Waterfall Chart
        </h2>
        <Plot
          data={[
            {
              type: 'waterfall',
              orientation: 'v',
              ...waterfallPlotData
            } as any
          ]}
          layout={{
            title: '',
            xaxis: {
              title: '',
              tickangle: -45,
              automargin: true
            },
            yaxis: {
              title: 'Amount (₹ Crores)',
              gridcolor: '#E2E8F0'
            },
            plot_bgcolor: '#F8FAFC',
            paper_bgcolor: 'transparent',
            font: {
              family: 'Inter, sans-serif',
              size: 11,
              color: '#475569'
            },
            margin: { l: 80, r: 40, t: 20, b: 120 },
            showlegend: false
          }}
          config={{
            responsive: true,
            displayModeBar: true,
            displaylogo: false
          }}
          style={{ width: '100%', height: '500px' }}
        />
      </div>

      {/* FX Impact Breakdown */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          FX Impact Components
        </h2>
        <div className="space-y-4">
          {/* Revenue Impact */}
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <div>
                <div className="font-semibold text-secondary-900">FX Revenue Impact</div>
                <div className="text-sm text-secondary-600">Export revenue loss from INR appreciation</div>
              </div>
            </div>
            <div className="text-xl font-bold text-red-600">
              ₹{fxRevenue.toFixed(0)} Cr
            </div>
          </div>

          {/* Cost Impact */}
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-semibold text-secondary-900">FX Cost Impact</div>
                <div className="text-sm text-secondary-600">Imported input cost increase</div>
              </div>
            </div>
            <div className="text-xl font-bold text-orange-600">
              ₹{fxCost.toFixed(0)} Cr
            </div>
          </div>

          {/* Hedge P&L */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-semibold text-secondary-900">Total Hedge P&L</div>
                <div className="text-sm text-secondary-600">Forwards + Options + Natural hedge</div>
              </div>
            </div>
            <div className="text-xl font-bold text-green-600">
              +₹{totalHedgePnl.toFixed(0)} Cr
            </div>
          </div>
        </div>
      </div>

      {/* Hedging Strategy Breakdown */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Hedging Strategy Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Forward Hedge */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200">
            <div className="text-sm text-secondary-600 mb-2">Forward Contracts</div>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              ₹{forwardPnl.toFixed(0)} Cr
            </div>
            <div className="text-xs text-secondary-500">
              {((forwardPnl / totalHedgePnl) * 100).toFixed(0)}% of hedge P&L
            </div>
            <div className="mt-3 text-sm text-secondary-600">
              Lock in future rates, eliminate uncertainty
            </div>
          </div>

          {/* Option Hedge */}
          <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-200">
            <div className="text-sm text-secondary-600 mb-2">Currency Options</div>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              ₹{optionPnl.toFixed(0)} Cr
            </div>
            <div className="text-xs text-secondary-500">
              {((optionPnl / totalHedgePnl) * 100).toFixed(0)}% of hedge P&L
            </div>
            <div className="mt-3 text-sm text-secondary-600">
              Downside protection, upside participation
            </div>
          </div>

          {/* Natural Hedge */}
          <div className="p-4 bg-gradient-to-br from-teal-50 to-white rounded-lg border border-teal-200">
            <div className="text-sm text-secondary-600 mb-2">Natural Hedge</div>
            <div className="text-2xl font-bold text-teal-600 mb-2">
              ₹{naturalHedge.toFixed(0)} Cr
            </div>
            <div className="text-xs text-secondary-500">
              {((naturalHedge / totalHedgePnl) * 100).toFixed(0)}% of hedge P&L
            </div>
            <div className="mt-3 text-sm text-secondary-600">
              Foreign cost offsets revenue exposure
            </div>
          </div>
        </div>
      </div>

      {/* Effectiveness Analysis */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">
          Hedge Effectiveness Analysis
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 font-semibold text-secondary-700">Metric</th>
                <th className="text-right py-3 px-4 font-semibold text-secondary-700">Value</th>
                <th className="text-right py-3 px-4 font-semibold text-secondary-700">Analysis</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-secondary-100 hover:bg-secondary-50">
                <td className="py-3 px-4 text-secondary-900">Gross FX Exposure</td>
                <td className="py-3 px-4 text-right font-mono text-red-600">
                  ₹{(Math.abs(fxRevenue) + Math.abs(fxCost)).toFixed(0)} Cr
                </td>
                <td className="py-3 px-4 text-right text-sm text-secondary-600">
                  Total unhedged loss
                </td>
              </tr>
              <tr className="border-b border-secondary-100 hover:bg-secondary-50">
                <td className="py-3 px-4 text-secondary-900">Hedge P&L</td>
                <td className="py-3 px-4 text-right font-mono text-green-600">
                  +₹{totalHedgePnl.toFixed(0)} Cr
                </td>
                <td className="py-3 px-4 text-right text-sm text-secondary-600">
                  Total protection gained
                </td>
              </tr>
              <tr className="border-b border-secondary-100 hover:bg-secondary-50">
                <td className="py-3 px-4 text-secondary-900">Hedge Ratio</td>
                <td className="py-3 px-4 text-right font-mono text-primary-600">
                  {((totalHedgePnl / (Math.abs(fxRevenue) + Math.abs(fxCost))) * 100).toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-right text-sm text-secondary-600">
                  Exposure covered
                </td>
              </tr>
              <tr className="border-b border-secondary-100 hover:bg-secondary-50">
                <td className="py-3 px-4 text-secondary-900">Net FX Impact</td>
                <td className="py-3 px-4 text-right font-mono text-secondary-900">
                  {netFxImpact >= 0 ? '+' : ''}₹{netFxImpact.toFixed(0)} Cr
                </td>
                <td className="py-3 px-4 text-right text-sm text-secondary-600">
                  After hedging
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-6 border-l-4 border-green-500">
          <h3 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            What Worked
          </h3>
          <ul className="text-sm text-secondary-600 space-y-2">
            <li>• Forward contracts provided {((forwardPnl/totalHedgePnl)*100).toFixed(0)}% of hedge benefit</li>
            <li>• Natural hedge reduced net exposure by ₹{naturalHedge.toFixed(0)} Cr</li>
            <li>• Overall hedge effectiveness: {((totalHedgePnl/(Math.abs(fxRevenue)+Math.abs(fxCost)))*100).toFixed(0)}%</li>
          </ul>
        </div>
        <div className="glass-card p-6 border-l-4 border-orange-500">
          <h3 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-orange-600" />
            Improvement Areas
          </h3>
          <ul className="text-sm text-secondary-600 space-y-2">
            <li>• Revenue exposure (₹{Math.abs(fxRevenue).toFixed(0)} Cr) exceeds hedge coverage</li>
            <li>• Consider increasing hedge ratio to 70-80%</li>
            <li>• Option strategy could be optimized for lower premiums</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
