"""
Hedge Ratio Optimization Engine
Implements CVaR-constrained optimization using SLSQP algorithm
"""
import numpy as np
from scipy.optimize import minimize, differential_evolution
from typing import Dict, List, Tuple, Optional
import warnings

from paths import generate_fx_paths
from hedging import calculate_hedge_pnl
from pnl import compute_profitability
from risk import calculate_cvar

warnings.filterwarnings('ignore')


def objective_maximize_npm(hedge_params: np.ndarray, *args) -> float:
    """
    Objective function: Maximize expected NPM
    (Minimize negative NPM for optimization)
    
    Args:
        hedge_params: [forward_ratio, option_ratio, natural_ratio]
        args: (firm, config, fx_paths)
    
    Returns:
        Negative expected NPM
    """
    firm, config, fx_paths = args
    
    # Update hedge configuration
    hedge_config = {
        'forwards': hedge_params[0],
        'options': hedge_params[1],
        'natural': hedge_params[2],
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
    profitability = compute_profitability(fx_paths, firm, hedge_pnl)
    
    # Extract final NPM
    npm_array = np.array(profitability['npm'])
    final_npm = npm_array[:, -1]
    expected_npm = np.mean(final_npm)
    
    return -expected_npm  # Negative for minimization


def objective_minimize_variance(hedge_params: np.ndarray, *args) -> float:
    """
    Objective function: Minimize NPM variance
    
    Args:
        hedge_params: [forward_ratio, option_ratio, natural_ratio]
        args: (firm, config, fx_paths)
    
    Returns:
        NPM variance
    """
    firm, config, fx_paths = args
    
    hedge_config = {
        'forwards': hedge_params[0],
        'options': hedge_params[1],
        'natural': hedge_params[2],
        'tenor_months': config.get('tenor_months', 3)
    }
    
    hedge_pnl = calculate_hedge_pnl(
        fx_paths=fx_paths,
        spot_rate=config.get('spot_rate', 83.0),
        hedge_config=hedge_config,
        r_inr=config.get('r_inr', 0.065),
        r_usd=config.get('r_usd', 0.05),
        sigma=config.get('sigma_annual', 0.08),
        transaction_cost_bps=config.get('transaction_cost_bps', 10)
    )
    
    profitability = compute_profitability(fx_paths, firm, hedge_pnl)
    npm_array = np.array(profitability['npm'])
    final_npm = npm_array[:, -1]
    
    return np.var(final_npm)


def constraint_cvar_threshold(hedge_params: np.ndarray, target_cvar: float, *args) -> float:
    """
    Constraint: CVaR <= target threshold
    
    Returns positive value when constraint is satisfied
    
    Args:
        hedge_params: Hedge ratios
        target_cvar: Maximum acceptable CVaR
        args: (firm, config, fx_paths)
    
    Returns:
        target_cvar - actual_cvar (>= 0 for feasibility)
    """
    firm, config, fx_paths = args
    
    hedge_config = {
        'forwards': hedge_params[0],
        'options': hedge_params[1],
        'natural': hedge_params[2],
        'tenor_months': config.get('tenor_months', 3)
    }
    
    hedge_pnl = calculate_hedge_pnl(
        fx_paths=fx_paths,
        spot_rate=config.get('spot_rate', 83.0),
        hedge_config=hedge_config,
        r_inr=config.get('r_inr', 0.065),
        r_usd=config.get('r_usd', 0.05),
        sigma=config.get('sigma_annual', 0.08),
        transaction_cost_bps=config.get('transaction_cost_bps', 10)
    )
    
    profitability = compute_profitability(fx_paths, firm, hedge_pnl)
    npm_array = np.array(profitability['npm'])
    final_npm = npm_array[:, -1]
    
    actual_cvar = calculate_cvar(final_npm, confidence_level=0.95)
    
    return target_cvar - actual_cvar


def constraint_budget(hedge_params: np.ndarray, max_budget: float, *args) -> float:
    """
    Constraint: Total hedge cost <= budget
    
    Args:
        hedge_params: Hedge ratios
        max_budget: Maximum budget for hedging (in basis points of notional)
        args: (firm, config, fx_paths)
    
    Returns:
        max_budget - actual_cost
    """
    # Simplified budget constraint based on option premiums
    option_ratio = hedge_params[1]
    
    # Rough estimate: option premium ~2-3% of notional
    estimated_cost_bps = option_ratio * 250  # 250 bps for full option hedge
    
    return max_budget - estimated_cost_bps


def optimize_hedge_ratio(firm: Dict, config: Dict, 
                        target_cvar: Optional[float] = None,
                        objective: str = "maximize_npm",
                        max_budget_bps: Optional[float] = None,
                        n_trials: int = 5) -> Dict:
    """
    Optimize hedge ratios using SLSQP with multi-start
    
    Args:
        firm: Firm profile dictionary
        config: Simulation configuration
        target_cvar: Target CVaR threshold (if None, no CVaR constraint)
        objective: 'maximize_npm' or 'minimize_variance'
        max_budget_bps: Maximum hedge budget in basis points
        n_trials: Number of random starts for global optimization
    
    Returns:
        Dictionary with:
            - optimal_hedge: {forwards, options, natural}
            - expected_npm: Expected NPM at optimal hedge
            - npm_volatility: NPM standard deviation
            - cvar_95: CVaR at 95% confidence
            - efficient_frontier: List of (risk, return) points
            - optimization_success: Boolean
    """
    # Convert Pydantic models to dicts if needed
    if hasattr(firm, 'dict'):
        firm = firm.dict()
    if hasattr(config, 'dict'):
        config = config.dict()
    
    # Generate FX paths for optimization
    fx_paths = generate_fx_paths(
        model=config.get('model', 'gbm'),
        n_paths=min(config.get('n_paths', 5000), 5000),  # Limit for optimization speed
        horizon_quarters=config.get('horizon_quarters', 4),
        spot_rate=config.get('spot_rate', 83.0),
        sigma_annual=config.get('sigma_annual', 0.08),
        drift_mode=config.get('drift_mode', 'historical'),
        custom_drift=config.get('custom_drift'),
        r_inr=config.get('r_inr', 0.065),
        r_usd=config.get('r_usd', 0.05),
        seed=42
    )
    
    # Select objective function
    if objective == "maximize_npm":
        obj_func = objective_maximize_npm
    else:
        obj_func = objective_minimize_variance
    
    # Set bounds: each hedge ratio in [0, 1]
    bounds = [(0, 1), (0, 1), (0, 1)]
    
    # Build constraints
    constraints = []
    
    # Total hedge ratio <= 1 (cannot over-hedge)
    constraints.append({
        'type': 'ineq',
        'fun': lambda x: 1.0 - np.sum(x)
    })
    
    # CVaR constraint
    if target_cvar is not None:
        constraints.append({
            'type': 'ineq',
            'fun': constraint_cvar_threshold,
            'args': (target_cvar, firm, config, fx_paths)
        })
    
    # Budget constraint
    if max_budget_bps is not None:
        constraints.append({
            'type': 'ineq',
            'fun': constraint_budget,
            'args': (max_budget_bps, firm, config, fx_paths)
        })
    
    # Multi-start optimization
    best_result = None
    best_value = np.inf
    
    np.random.seed(42)
    
    for trial in range(n_trials):
        # Random initial guess
        if trial == 0:
            x0 = np.array([0.5, 0.3, 0.2])  # Balanced start
        else:
            x0 = np.random.dirichlet([1, 1, 1]) * 0.8  # Random start
        
        try:
            result = minimize(
                fun=obj_func,
                x0=x0,
                args=(firm, config, fx_paths),
                method='SLSQP',
                bounds=bounds,
                constraints=constraints,
                options={'maxiter': 200, 'ftol': 1e-6}
            )
            
            if result.success and result.fun < best_value:
                best_result = result
                best_value = result.fun
        
        except Exception as e:
            print(f"Trial {trial} failed: {e}")
            continue
    
    if best_result is None or not best_result.success:
        # Return balanced default
        optimal_hedge = {'forwards': 0.5, 'options': 0.3, 'natural': 0.2}
        success = False
    else:
        optimal_hedge = {
            'forwards': float(best_result.x[0]),
            'options': float(best_result.x[1]),
            'natural': float(best_result.x[2])
        }
        success = True
    
    # Evaluate optimal hedge
    optimal_hedge_config = {**optimal_hedge, 'tenor_months': config.get('tenor_months', 3)}
    
    hedge_pnl = calculate_hedge_pnl(
        fx_paths=fx_paths,
        spot_rate=config.get('spot_rate', 83.0),
        hedge_config=optimal_hedge_config,
        r_inr=config.get('r_inr', 0.065),
        r_usd=config.get('r_usd', 0.05),
        sigma=config.get('sigma_annual', 0.08),
        transaction_cost_bps=config.get('transaction_cost_bps', 10)
    )
    
    profitability = compute_profitability(fx_paths, firm, hedge_pnl)
    npm_array = np.array(profitability['npm'])
    final_npm = npm_array[:, -1]
    
    # Generate efficient frontier
    frontier = generate_efficient_frontier(firm, config, fx_paths, n_points=20)
    
    return {
        "optimal_hedge": optimal_hedge,
        "expected_npm": float(np.mean(final_npm)),
        "npm_median": float(np.median(final_npm)),
        "npm_volatility": float(np.std(final_npm)),
        "cvar_95": float(calculate_cvar(final_npm, 0.95)),
        "efficient_frontier": frontier,
        "optimization_success": success,
        "iterations": best_result.nit if best_result else 0
    }


def generate_efficient_frontier(firm: Dict, config: Dict, fx_paths: np.ndarray,
                                n_points: int = 20) -> List[Dict]:
    """
    Generate efficient frontier by varying hedge ratios
    
    Args:
        firm: Firm profile
        config: Configuration
        fx_paths: Pre-generated FX paths
        n_points: Number of points on frontier
    
    Returns:
        List of {risk (CVaR), return (NPM), hedge_ratio} points
    """
    frontier_points = []
    
    # Vary total hedge ratio from 0 to 1
    for total_hedge in np.linspace(0, 1, n_points):
        # Balanced allocation: 60% forward, 30% option, 10% natural
        hedge_config = {
            'forwards': total_hedge * 0.6,
            'options': total_hedge * 0.3,
            'natural': total_hedge * 0.1,
            'tenor_months': config.get('tenor_months', 3)
        }
        
        try:
            hedge_pnl = calculate_hedge_pnl(
                fx_paths=fx_paths,
                spot_rate=config.get('spot_rate', 83.0),
                hedge_config=hedge_config,
                r_inr=config.get('r_inr', 0.065),
                r_usd=config.get('r_usd', 0.05),
                sigma=config.get('sigma_annual', 0.08),
                transaction_cost_bps=config.get('transaction_cost_bps', 10)
            )
            
            profitability = compute_profitability(fx_paths, firm, hedge_pnl)
            npm_array = np.array(profitability['npm'])
            final_npm = npm_array[:, -1]
            
            frontier_points.append({
                'hedge_ratio': float(total_hedge),
                'expected_npm': float(np.mean(final_npm)),
                'npm_volatility': float(np.std(final_npm)),
                'cvar_95': float(calculate_cvar(final_npm, 0.95)),
                'forwards': hedge_config['forwards'],
                'options': hedge_config['options'],
                'natural': hedge_config['natural']
            })
        
        except Exception as e:
            continue
    
    return frontier_points


if __name__ == "__main__":
    # Test optimization
    from paths import generate_fx_paths
    
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
        'transaction_cost_bps': 10
    }
    
    result = optimize_hedge_ratio(firm, config, target_cvar=0.03)
    
    print("Optimization Results:")
    print(f"Optimal hedge: {result['optimal_hedge']}")
    print(f"Expected NPM: {result['expected_npm']:.4f}")
    print(f"NPM volatility: {result['npm_volatility']:.4f}")
    print(f"CVaR (95%): {result['cvar_95']:.4f}")
    print(f"Success: {result['optimization_success']}")
