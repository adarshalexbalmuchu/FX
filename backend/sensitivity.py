"""
Sensitivity Analysis Module
Generates heatmaps for parameter sensitivity
"""
import numpy as np
from typing import Dict, List
import json

from paths import generate_fx_paths
from hedging import calculate_hedge_pnl
from pnl import compute_profitability
from risk import calculate_cvar


def generate_theta_hedge_heatmap(firm: Dict, config: Dict, 
                                 theta_range: List[float] = None,
                                 hedge_range: List[float] = None) -> Dict:
    """
    Generate heatmap: Export share (θ) × Hedge ratio
    Shows how optimal hedging changes with export exposure
    
    Args:
        firm: Firm profile
        config: Simulation configuration
        theta_range: Range of export share values
        hedge_range: Range of total hedge ratios
    
    Returns:
        Heatmap data structure
    """
    if theta_range is None:
        theta_range = np.linspace(0.1, 0.9, 9)
    if hedge_range is None:
        hedge_range = np.linspace(0.0, 1.0, 11)
    
    # Initialize results grid
    npm_grid = np.zeros((len(theta_range), len(hedge_range)))
    cvar_grid = np.zeros((len(theta_range), len(hedge_range)))
    
    # Generate FX paths once for efficiency
    fx_paths = generate_fx_paths(
        model=config.get('model', 'gbm'),
        n_paths=2000,  # Reduced for speed
        horizon_quarters=config.get('horizon_quarters', 4),
        spot_rate=config.get('spot_rate', 83.0),
        sigma_annual=config.get('sigma_annual', 0.08),
        drift_mode=config.get('drift_mode', 'historical'),
        r_inr=config.get('r_inr', 0.065),
        r_usd=config.get('r_usd', 0.05)
    )
    
    for i, theta in enumerate(theta_range):
        for j, total_hedge in enumerate(hedge_range):
            # Update firm profile
            firm_copy = firm.copy() if isinstance(firm, dict) else firm.dict()
            firm_copy['export_share_theta'] = theta
            
            # Balanced hedge allocation
            hedge_config = {
                'forwards': total_hedge * 0.6,
                'options': total_hedge * 0.3,
                'natural': total_hedge * 0.1,
                'tenor_months': config.get('tenor_months', 3)
            }
            
            # Calculate hedge P&L
            hedge_pnl = calculate_hedge_pnl(
                fx_paths=fx_paths,
                spot_rate=config.get('spot_rate', 83.0),
                hedge_config=hedge_config,
                r_inr=config.get('r_inr', 0.065),
                r_usd=config.get('r_usd', 0.05),
                sigma=config.get('sigma_annual', 0.08),
                transaction_cost_bps=config.get('transaction_cost_bps', 10)
            )
            
            # Compute profitability
            profitability = compute_profitability(fx_paths, firm_copy, hedge_pnl)
            npm_array = np.array(profitability['npm'])
            final_npm = npm_array[:, -1]
            
            # Store metrics
            npm_grid[i, j] = np.mean(final_npm)
            cvar_grid[i, j] = calculate_cvar(final_npm, 0.95)
    
    return {
        "type": "theta_hedge_heatmap",
        "x_axis": {
            "label": "Hedge Ratio",
            "values": hedge_range.tolist()
        },
        "y_axis": {
            "label": "Export Share (θ)",
            "values": theta_range.tolist()
        },
        "npm_grid": npm_grid.tolist(),
        "cvar_grid": cvar_grid.tolist(),
        "description": "How export exposure affects optimal hedging strategy"
    }


def generate_psi_sigma_heatmap(firm: Dict, config: Dict,
                               psi_range: List[float] = None,
                               sigma_range: List[float] = None) -> Dict:
    """
    Generate heatmap: Pass-through (ψ) × Volatility (σ)
    Shows how pricing flexibility affects FX risk
    
    Args:
        firm: Firm profile
        config: Simulation configuration
        psi_range: Range of pass-through coefficients
        sigma_range: Range of volatility values
    
    Returns:
        Heatmap data structure
    """
    if psi_range is None:
        psi_range = np.linspace(0.0, 1.0, 11)
    if sigma_range is None:
        sigma_range = np.linspace(0.05, 0.15, 11)
    
    npm_grid = np.zeros((len(psi_range), len(sigma_range)))
    cvar_grid = np.zeros((len(psi_range), len(sigma_range)))
    
    # Fixed hedge configuration
    hedge_config = {
        'forwards': config.get('hedge', {}).get('forwards', 0.5),
        'options': config.get('hedge', {}).get('options', 0.3),
        'natural': config.get('hedge', {}).get('natural', 0.2),
        'tenor_months': config.get('tenor_months', 3)
    }
    
    for i, psi in enumerate(psi_range):
        for j, sigma in enumerate(sigma_range):
            # Update firm profile
            firm_copy = firm.copy() if isinstance(firm, dict) else firm.dict()
            firm_copy['pass_through_psi'] = psi
            
            # Generate FX paths with different volatility
            fx_paths = generate_fx_paths(
                model=config.get('model', 'gbm'),
                n_paths=2000,
                horizon_quarters=config.get('horizon_quarters', 4),
                spot_rate=config.get('spot_rate', 83.0),
                sigma_annual=sigma,
                drift_mode=config.get('drift_mode', 'historical'),
                r_inr=config.get('r_inr', 0.065),
                r_usd=config.get('r_usd', 0.05)
            )
            
            hedge_pnl = calculate_hedge_pnl(
                fx_paths=fx_paths,
                spot_rate=config.get('spot_rate', 83.0),
                hedge_config=hedge_config,
                r_inr=config.get('r_inr', 0.065),
                r_usd=config.get('r_usd', 0.05),
                sigma=sigma,
                transaction_cost_bps=config.get('transaction_cost_bps', 10)
            )
            
            profitability = compute_profitability(fx_paths, firm_copy, hedge_pnl)
            npm_array = np.array(profitability['npm'])
            final_npm = npm_array[:, -1]
            
            npm_grid[i, j] = np.mean(final_npm)
            cvar_grid[i, j] = calculate_cvar(final_npm, 0.95)
    
    return {
        "type": "psi_sigma_heatmap",
        "x_axis": {
            "label": "Volatility (σ)",
            "values": sigma_range.tolist()
        },
        "y_axis": {
            "label": "Pass-through (ψ)",
            "values": psi_range.tolist()
        },
        "npm_grid": npm_grid.tolist(),
        "cvar_grid": cvar_grid.tolist(),
        "description": "How pricing flexibility interacts with FX volatility"
    }


def generate_sensitivity_heatmaps(firm: Dict, config: Dict) -> Dict:
    """
    Generate all sensitivity heatmaps
    
    Args:
        firm: Firm profile
        config: Simulation configuration
    
    Returns:
        Dictionary with all heatmaps
    """
    # Convert Pydantic models if needed
    if hasattr(firm, 'dict'):
        firm = firm.dict()
    if hasattr(config, 'dict'):
        config = config.dict()
    
    theta_hedge = generate_theta_hedge_heatmap(firm, config)
    psi_sigma = generate_psi_sigma_heatmap(firm, config)
    
    return {
        "theta_hedge": theta_hedge,
        "psi_sigma": psi_sigma,
        "timestamp": None
    }


def generate_tornado_chart(firm: Dict, config: Dict) -> Dict:
    """
    Generate tornado chart showing parameter sensitivities
    Varies each parameter ±20% and measures NPM impact
    
    Args:
        firm: Firm profile
        config: Simulation configuration
    
    Returns:
        Tornado chart data
    """
    if hasattr(firm, 'dict'):
        firm = firm.dict()
    if hasattr(config, 'dict'):
        config = config.dict()
    
    # Base case
    fx_paths_base = generate_fx_paths(
        model=config.get('model', 'gbm'),
        n_paths=2000,
        horizon_quarters=config.get('horizon_quarters', 4),
        spot_rate=config.get('spot_rate', 83.0),
        sigma_annual=config.get('sigma_annual', 0.08),
        drift_mode=config.get('drift_mode', 'historical'),
        r_inr=config.get('r_inr', 0.065),
        r_usd=config.get('r_usd', 0.05)
    )
    
    hedge_config = {
        'forwards': config.get('hedge', {}).get('forwards', 0.5),
        'options': config.get('hedge', {}).get('options', 0.3),
        'natural': config.get('hedge', {}).get('natural', 0.2),
        'tenor_months': config.get('tenor_months', 3)
    }
    
    hedge_pnl_base = calculate_hedge_pnl(
        fx_paths=fx_paths_base,
        spot_rate=config.get('spot_rate', 83.0),
        hedge_config=hedge_config,
        r_inr=config.get('r_inr', 0.065),
        r_usd=config.get('r_usd', 0.05),
        sigma=config.get('sigma_annual', 0.08),
        transaction_cost_bps=config.get('transaction_cost_bps', 10)
    )
    
    prof_base = compute_profitability(fx_paths_base, firm, hedge_pnl_base)
    npm_base = np.mean(np.array(prof_base['npm'])[:, -1])
    
    # Parameters to vary
    parameters = [
        {'name': 'Export Share (θ)', 'key': 'export_share_theta', 'base': firm['export_share_theta']},
        {'name': 'Pass-through (ψ)', 'key': 'pass_through_psi', 'base': firm['pass_through_psi']},
        {'name': 'Foreign Cost (κ)', 'key': 'foreign_cost_share_kappa', 'base': firm['foreign_cost_share_kappa']},
        {'name': 'Volatility (σ)', 'key': 'sigma_annual', 'base': config['sigma_annual'], 'is_config': True}
    ]
    
    tornado_data = []
    
    for param in parameters:
        is_config = param.get('is_config', False)
        base_val = param['base']
        
        # Low case (-20%)
        if is_config:
            config_low = config.copy()
            config_low[param['key']] = base_val * 0.8
            fx_paths_low = generate_fx_paths(**{**config, 'sigma_annual': config_low['sigma_annual']})
            hedge_pnl_low = calculate_hedge_pnl(fx_paths_low, config.get('spot_rate', 83.0), hedge_config,
                                               config.get('r_inr', 0.065), config.get('r_usd', 0.05),
                                               config_low['sigma_annual'], config.get('transaction_cost_bps', 10))
            prof_low = compute_profitability(fx_paths_low, firm, hedge_pnl_low)
        else:
            firm_low = firm.copy()
            firm_low[param['key']] = base_val * 0.8
            hedge_pnl_low = calculate_hedge_pnl(fx_paths_base, config.get('spot_rate', 83.0), hedge_config,
                                               config.get('r_inr', 0.065), config.get('r_usd', 0.05),
                                               config.get('sigma_annual', 0.08), config.get('transaction_cost_bps', 10))
            prof_low = compute_profitability(fx_paths_base, firm_low, hedge_pnl_low)
        
        npm_low = np.mean(np.array(prof_low['npm'])[:, -1])
        
        # High case (+20%)
        if is_config:
            config_high = config.copy()
            config_high[param['key']] = base_val * 1.2
            fx_paths_high = generate_fx_paths(**{**config, 'sigma_annual': config_high['sigma_annual']})
            hedge_pnl_high = calculate_hedge_pnl(fx_paths_high, config.get('spot_rate', 83.0), hedge_config,
                                                config.get('r_inr', 0.065), config.get('r_usd', 0.05),
                                                config_high['sigma_annual'], config.get('transaction_cost_bps', 10))
            prof_high = compute_profitability(fx_paths_high, firm, hedge_pnl_high)
        else:
            firm_high = firm.copy()
            firm_high[param['key']] = base_val * 1.2
            hedge_pnl_high = calculate_hedge_pnl(fx_paths_base, config.get('spot_rate', 83.0), hedge_config,
                                                config.get('r_inr', 0.065), config.get('r_usd', 0.05),
                                                config.get('sigma_annual', 0.08), config.get('transaction_cost_bps', 10))
            prof_high = compute_profitability(fx_paths_base, firm_high, hedge_pnl_high)
        
        npm_high = np.mean(np.array(prof_high['npm'])[:, -1])
        
        tornado_data.append({
            'parameter': param['name'],
            'base_value': base_val,
            'npm_low': npm_low,
            'npm_high': npm_high,
            'npm_base': npm_base,
            'sensitivity': abs(npm_high - npm_low)
        })
    
    # Sort by sensitivity (descending)
    tornado_data = sorted(tornado_data, key=lambda x: x['sensitivity'], reverse=True)
    
    return {
        "type": "tornado_chart",
        "data": tornado_data,
        "description": "Parameter sensitivity analysis (±20% variation)"
    }


if __name__ == "__main__":
    # Test sensitivity analysis
    firm = {
        'firm': 'Test Corp',
        'revenue_inr_q': 1000.0,
        'cost_inr_q': 800.0,
        'assets_inr': 5000.0,
        'export_share_theta': 0.4,
        'foreign_cost_share_kappa': 0.2,
        'pass_through_psi': 0.3
    }
    
    config = {
        'model': 'gbm',
        'n_paths': 2000,
        'horizon_quarters': 4,
        'spot_rate': 83.0,
        'sigma_annual': 0.08,
        'drift_mode': 'historical',
        'r_inr': 0.065,
        'r_usd': 0.05,
        'tenor_months': 3,
        'transaction_cost_bps': 10,
        'hedge': {'forwards': 0.5, 'options': 0.3, 'natural': 0.2}
    }
    
    print("Generating sensitivity heatmaps...")
    heatmaps = generate_sensitivity_heatmaps(firm, config)
    print(f"✓ Generated {len(heatmaps)} heatmaps")
