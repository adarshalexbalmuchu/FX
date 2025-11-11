"""
Profitability & P&L Computation Engine
Calculates NPM (Net Profit Margin) and ROA (Return on Assets) under FX volatility
"""
import numpy as np
from typing import Dict


def compute_fx_revenue_impact(fx_paths: np.ndarray, base_revenue_inr: float,
                               export_share_theta: float, pass_through_psi: float,
                               spot_rate: float) -> np.ndarray:
    """
    Compute change in revenue due to FX movements
    
    ΔR = θ · R₀ · [(S_t/S₀ - 1) · (1 - ψ)]
    
    Where:
        θ = export share
        ψ = price pass-through coefficient
        (1-ψ) = portion of FX change reflected in INR revenue
    
    Args:
        fx_paths: FX rate paths (n_paths × n_steps)
        base_revenue_inr: Quarterly revenue in INR
        export_share_theta: Export revenue as % of total (θ)
        pass_through_psi: Price pass-through coefficient (ψ)
        spot_rate: Initial spot rate S₀
    
    Returns:
        Revenue change array (n_paths × n_steps)
    """
    # FX rate change percentage
    fx_change_pct = (fx_paths / spot_rate) - 1.0
    
    # Revenue impact: Export revenue × FX change × (1 - pass-through)
    # When INR weakens (spot ↑), revenue increases (before pass-through)
    delta_revenue = export_share_theta * base_revenue_inr * fx_change_pct * (1 - pass_through_psi)
    
    return delta_revenue


def compute_fx_cost_impact(fx_paths: np.ndarray, base_cost_inr: float,
                           foreign_cost_share_kappa: float, spot_rate: float) -> np.ndarray:
    """
    Compute change in costs due to FX movements
    
    ΔC = κ · C₀ · (S_t/S₀ - 1)
    
    Where:
        κ = foreign cost share (imported inputs)
    
    Args:
        fx_paths: FX rate paths
        base_cost_inr: Quarterly costs in INR
        foreign_cost_share_kappa: Foreign cost as % of total (κ)
        spot_rate: Initial spot rate
    
    Returns:
        Cost change array (n_paths × n_steps)
    """
    fx_change_pct = (fx_paths / spot_rate) - 1.0
    
    # Cost impact: When INR weakens (spot ↑), costs increase
    delta_cost = foreign_cost_share_kappa * base_cost_inr * fx_change_pct
    
    return delta_cost


def compute_npm(revenue: np.ndarray, costs: np.ndarray, hedge_pnl: np.ndarray) -> np.ndarray:
    """
    Calculate Net Profit Margin
    
    NPM = (Revenue - Costs + Hedge_PnL) / Revenue
    
    Args:
        revenue: Total revenue (n_paths × n_steps)
        costs: Total costs (n_paths × n_steps)
        hedge_pnl: Hedge P&L (n_paths × n_steps)
    
    Returns:
        NPM array (n_paths × n_steps)
    """
    net_profit = revenue - costs + hedge_pnl
    npm = net_profit / revenue
    
    # Handle division by zero
    npm = np.where(revenue > 0, npm, 0.0)
    
    return npm


def compute_roa(revenue: np.ndarray, costs: np.ndarray, hedge_pnl: np.ndarray,
               assets: float) -> np.ndarray:
    """
    Calculate Return on Assets
    
    ROA = (Revenue - Costs + Hedge_PnL) / Assets
    
    Args:
        revenue: Total revenue (n_paths × n_steps)
        costs: Total costs (n_paths × n_steps)
        hedge_pnl: Hedge P&L (n_paths × n_steps)
        assets: Total assets in INR
    
    Returns:
        ROA array (n_paths × n_steps)
    """
    net_profit = revenue - costs + hedge_pnl
    roa = net_profit / assets
    
    return roa


def compute_profitability(fx_paths: np.ndarray, firm: Dict, hedge_pnl: Dict) -> Dict:
    """
    Main function to compute all profitability metrics
    
    Args:
        fx_paths: FX rate paths (n_paths × n_steps)
        firm: Firm profile dictionary
        hedge_pnl: Hedge P&L dictionary from calculate_hedge_pnl
    
    Returns:
        Dictionary with:
            - npm: NPM array
            - roa: ROA array
            - revenue: Total revenue array
            - costs: Total costs array
            - net_profit: Net profit array
            - delta_revenue: FX-driven revenue changes
            - delta_cost: FX-driven cost changes
            - summary_stats: Mean, std, percentiles
    """
    # Extract firm parameters
    if isinstance(firm, dict):
        base_revenue = firm['revenue_inr_q']
        base_cost = firm['cost_inr_q']
        assets = firm['assets_inr']
        theta = firm['export_share_theta']
        kappa = firm['foreign_cost_share_kappa']
        psi = firm['pass_through_psi']
        spot_rate = 83.0  # Default, should come from config
    else:
        # Pydantic model
        base_revenue = firm.revenue_inr_q
        base_cost = firm.cost_inr_q
        assets = firm.assets_inr
        theta = firm.export_share_theta
        kappa = firm.foreign_cost_share_kappa
        psi = firm.pass_through_psi
        spot_rate = 83.0
    
    # Calculate FX impacts
    delta_revenue = compute_fx_revenue_impact(fx_paths, base_revenue, theta, psi, spot_rate)
    delta_cost = compute_fx_cost_impact(fx_paths, base_cost, kappa, spot_rate)
    
    # Total revenue and costs
    total_revenue = base_revenue + delta_revenue
    total_costs = base_cost + delta_cost
    
    # Extract total hedge P&L
    total_hedge_pnl = hedge_pnl['total_pnl']
    
    # Scale hedge P&L to quarterly revenue (convert from $100M notional to firm scale)
    # Assume hedge P&L is in INR millions already scaled appropriately
    hedge_pnl_scaled = total_hedge_pnl * (theta * base_revenue / 100.0)  # Scale factor
    
    # Calculate profitability metrics
    npm = compute_npm(total_revenue, total_costs, hedge_pnl_scaled)
    roa = compute_roa(total_revenue, total_costs, hedge_pnl_scaled, assets)
    net_profit = total_revenue - total_costs + hedge_pnl_scaled
    
    # Summary statistics (focus on final period)
    final_npm = npm[:, -1]
    final_roa = roa[:, -1]
    final_profit = net_profit[:, -1]
    
    summary_stats = {
        "npm": {
            "mean": float(np.mean(final_npm)),
            "std": float(np.std(final_npm)),
            "median": float(np.median(final_npm)),
            "p05": float(np.percentile(final_npm, 5)),
            "p95": float(np.percentile(final_npm, 95))
        },
        "roa": {
            "mean": float(np.mean(final_roa)),
            "std": float(np.std(final_roa)),
            "median": float(np.median(final_roa)),
            "p05": float(np.percentile(final_roa, 5)),
            "p95": float(np.percentile(final_roa, 95))
        },
        "net_profit": {
            "mean": float(np.mean(final_profit)),
            "std": float(np.std(final_profit)),
            "median": float(np.median(final_profit)),
            "p05": float(np.percentile(final_profit, 5)),
            "p95": float(np.percentile(final_profit, 95))
        }
    }
    
    return {
        "npm": npm.tolist(),
        "roa": roa.tolist(),
        "net_profit": net_profit.tolist(),
        "revenue": total_revenue.tolist(),
        "costs": total_costs.tolist(),
        "delta_revenue": delta_revenue.tolist(),
        "delta_cost": delta_cost.tolist(),
        "summary_stats": summary_stats
    }


def compute_attribution_waterfall(base_revenue: float, base_cost: float,
                                  delta_revenue: float, delta_cost: float,
                                  hedge_pnl: float) -> Dict:
    """
    Create waterfall chart data for profit attribution
    
    Components:
        1. Base profit (R₀ - C₀)
        2. FX Revenue impact
        3. FX Cost impact
        4. Hedge P&L
        5. Final profit
    
    Args:
        base_revenue: Base quarterly revenue
        base_cost: Base quarterly costs
        delta_revenue: Average FX revenue impact
        delta_cost: Average FX cost impact
        hedge_pnl: Average hedge P&L
    
    Returns:
        Waterfall chart data structure
    """
    base_profit = base_revenue - base_cost
    final_profit = base_profit + delta_revenue - delta_cost + hedge_pnl
    
    waterfall = [
        {"label": "Base Profit", "value": base_profit, "type": "base"},
        {"label": "FX Revenue Impact", "value": delta_revenue, "type": "increase" if delta_revenue > 0 else "decrease"},
        {"label": "FX Cost Impact", "value": -delta_cost, "type": "decrease" if delta_cost > 0 else "increase"},
        {"label": "Hedge P&L", "value": hedge_pnl, "type": "increase" if hedge_pnl > 0 else "decrease"},
        {"label": "Final Profit", "value": final_profit, "type": "total"}
    ]
    
    return {
        "waterfall": waterfall,
        "base_profit": base_profit,
        "final_profit": final_profit,
        "total_fx_impact": delta_revenue - delta_cost,
        "hedge_contribution": hedge_pnl
    }


if __name__ == "__main__":
    # Test profitability calculations
    n_paths = 1000
    n_steps = 5
    
    # Mock FX paths
    spot = 83.0
    fx_paths = np.random.normal(spot, 2.0, (n_paths, n_steps))
    fx_paths = np.abs(fx_paths)  # Ensure positive
    
    # Mock firm
    firm = {
        'revenue_inr_q': 1000.0,  # 1000 Cr INR
        'cost_inr_q': 800.0,
        'assets_inr': 5000.0,
        'export_share_theta': 0.4,
        'foreign_cost_share_kappa': 0.2,
        'pass_through_psi': 0.3
    }
    
    # Mock hedge P&L
    hedge_pnl = {
        'total_pnl': np.random.normal(0, 10, (n_paths, n_steps)),
        'forward_pnl': np.zeros((n_paths, n_steps)),
        'option_pnl': np.zeros((n_paths, n_steps)),
        'natural_hedge_benefit': np.zeros((n_paths, n_steps)),
        'transaction_costs': 0.0
    }
    
    result = compute_profitability(fx_paths, firm, hedge_pnl)
    print("NPM Stats:", result['summary_stats']['npm'])
    print("ROA Stats:", result['summary_stats']['roa'])
