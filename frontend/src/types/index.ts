/**
 * TypeScript Type Definitions for VolatiSense
 */

// ============= Firm Profile =============
export interface FirmProfile {
  firm: string;
  revenue_inr_q: number;
  cost_inr_q: number;
  assets_inr: number;
  export_share_theta: number;
  foreign_cost_share_kappa: number;
  pass_through_psi: number;
}

// ============= Hedge Configuration =============
export interface HedgeConfig {
  forwards: number;
  options: number;
  natural: number;
  tenor_months: number;
}

// ============= Simulation Configuration =============
export type ModelType = 'gbm' | 'regime' | 'jump' | 'garch';
export type DriftMode = 'historical' | 'zero' | 'custom';

export interface SimulationConfig {
  model: ModelType;
  n_paths: number;
  horizon_quarters: number;
  sigma_annual: number;
  drift_mode: DriftMode;
  custom_drift?: number;
  spot_rate: number;
  r_inr: number;
  r_usd: number;
  hedge: HedgeConfig;
  transaction_cost_bps: number;
}

// ============= Simulation Request & Response =============
export interface SimulationRequest {
  firm: FirmProfile;
  config: SimulationConfig;
}

export interface SummaryStats {
  mean: number;
  std: number;
  median: number;
  p05: number;
  p95: number;
}

export interface ProfitabilityMetrics {
  npm: number[][];
  roa: number[][];
  net_profit: number[][];
  revenue: number[][];
  costs: number[][];
  delta_revenue: number[][];
  delta_cost: number[][];
  summary_stats: {
    npm: SummaryStats;
    roa: SummaryStats;
    net_profit: SummaryStats;
  };
}

export interface RiskMetric {
  npm: number;
  roa: number;
  profit: number;
}

export interface VaRMetrics {
  var_90: RiskMetric;
  var_95: RiskMetric;
  var_99: RiskMetric;
}

export interface CVaRMetrics {
  cvar_90: RiskMetric;
  cvar_95: RiskMetric;
  cvar_99: RiskMetric;
}

export interface VolatilityMetric {
  total: number;
  downside: number;
}

export interface VolatilityMetrics {
  npm: VolatilityMetric;
  roa: VolatilityMetric;
  profit: VolatilityMetric;
}

export interface RiskAdjustedMetrics {
  npm_sharpe: number;
  npm_sortino: number;
  roa_sharpe: number;
  roa_sortino: number;
}

export interface Percentile {
  p01: number;
  p05: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
}

export interface PercentileMetrics {
  npm: Percentile;
  roa: Percentile;
}

export interface ProbabilityMetrics {
  npm_negative: number;
  npm_below_5pct: number;
  roa_negative: number;
  roa_below_5pct: number;
}

export interface RiskMetrics {
  var: VaRMetrics;
  cvar: CVaRMetrics;
  volatility: VolatilityMetrics;
  risk_adjusted: RiskAdjustedMetrics;
  percentiles: PercentileMetrics;
  probability: ProbabilityMetrics;
}

export interface HedgePnL {
  total_pnl: number[][];
  forward_pnl: number[][];
  option_pnl: number[][];
  natural_hedge_benefit: number[][];
  transaction_costs: number;
  forward_rate: number;
  option_strike: number;
  option_premium: number;
}

export interface SimulationResponse {
  success: boolean;
  fx_paths: number[][];
  profitability: ProfitabilityMetrics;
  risk_metrics: RiskMetrics;
  hedge_pnl: HedgePnL;
}

// ============= Optimization =============
export type OptimizationObjective = 'maximize_npm' | 'minimize_variance';

export interface OptimizationRequest {
  firm: FirmProfile;
  config: SimulationConfig;
  target_cvar?: number;
  objective: OptimizationObjective;
}

export interface FrontierPoint {
  hedge_ratio: number;
  expected_npm: number;
  npm_volatility: number;
  cvar_95: number;
  forwards: number;
  options: number;
  natural: number;
}

export interface OptimizationResponse {
  success: boolean;
  optimal_hedge: HedgeConfig;
  expected_npm: number;
  npm_median: number;
  npm_volatility: number;
  cvar_95: number;
  efficient_frontier: FrontierPoint[];
  optimization_success: boolean;
  iterations: number;
}

// ============= Sensitivity Analysis =============
export interface AxisConfig {
  label: string;
  values: number[];
}

export interface HeatmapData {
  type: string;
  x_axis: AxisConfig;
  y_axis: AxisConfig;
  npm_grid: number[][];
  cvar_grid: number[][];
  description: string;
}

export interface SensitivityResponse {
  success: boolean;
  heatmaps: {
    theta_hedge: HeatmapData;
    psi_sigma: HeatmapData;
  };
}

// ============= UI State =============
export interface UIState {
  isLoading: boolean;
  error: string | null;
  currentTab: string;
  simulationResults: SimulationResponse | null;
  optimizationResults: OptimizationResponse | null;
}

// ============= Chart Data =============
export interface ChartDataPoint {
  x: number | string;
  y: number;
  label?: string;
}

export interface WaterfallChartData {
  label: string;
  value: number;
  type: 'base' | 'increase' | 'decrease' | 'total';
}
