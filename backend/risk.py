"""
Risk Metrics Calculation
Computes VaR, CVaR, and volatility statistics
"""
import numpy as np
from typing import Dict, List


def calculate_var(returns: np.ndarray, confidence_level: float = 0.95) -> float:
    """
    Calculate Value at Risk (VaR) using empirical percentile
    
    VaR = -percentile(returns, 1 - confidence_level)
    
    Args:
        returns: Array of returns or profit values
        confidence_level: Confidence level (e.g., 0.95 for 95% VaR)
    
    Returns:
        VaR value (positive number indicating potential loss)
    """
    if len(returns) == 0:
        return 0.0
    
    percentile_level = (1 - confidence_level) * 100
    var = -np.percentile(returns, percentile_level)
    
    return float(var)


def calculate_cvar(returns: np.ndarray, confidence_level: float = 0.95) -> float:
    """
    Calculate Conditional Value at Risk (CVaR / Expected Shortfall)
    
    CVaR = -E[returns | returns <= -VaR]
    
    Average of all returns worse than VaR threshold
    
    Args:
        returns: Array of returns or profit values
        confidence_level: Confidence level
    
    Returns:
        CVaR value
    """
    if len(returns) == 0:
        return 0.0
    
    var = -calculate_var(returns, confidence_level)  # Get as negative for comparison
    
    # Find all returns worse than VaR
    tail_returns = returns[returns <= var]
    
    if len(tail_returns) == 0:
        return float(var)
    
    cvar = -np.mean(tail_returns)
    
    return float(cvar)


def calculate_downside_volatility(returns: np.ndarray, threshold: float = 0.0) -> float:
    """
    Calculate downside volatility (semi-deviation)
    Only considers returns below threshold
    
    Args:
        returns: Array of returns
        threshold: Return threshold (default 0 for downside only)
    
    Returns:
        Downside volatility
    """
    downside_returns = returns[returns < threshold]
    
    if len(downside_returns) == 0:
        return 0.0
    
    downside_vol = np.std(downside_returns)
    
    return float(downside_vol)


def calculate_sharpe_ratio(returns: np.ndarray, risk_free_rate: float = 0.0) -> float:
    """
    Calculate Sharpe ratio
    
    Sharpe = (E[R] - R_f) / σ(R)
    
    Args:
        returns: Array of returns
        risk_free_rate: Risk-free rate
    
    Returns:
        Sharpe ratio
    """
    if len(returns) == 0:
        return 0.0
    
    std_dev = np.std(returns, ddof=1)  # Use sample std deviation
    
    # Handle zero or near-zero volatility case
    if std_dev < 1e-8 or np.isclose(std_dev, 0.0):
        return 0.0
    
    excess_return = np.mean(returns) - risk_free_rate
    sharpe = excess_return / std_dev
    
    # Handle potential infinity or NaN
    if not np.isfinite(sharpe):
        return 0.0
    
    return float(sharpe)


def calculate_sortino_ratio(returns: np.ndarray, risk_free_rate: float = 0.0,
                            target_return: float = 0.0) -> float:
    """
    Calculate Sortino ratio (uses downside deviation instead of total volatility)
    
    Sortino = (E[R] - R_f) / σ_downside(R)
    
    Args:
        returns: Array of returns
        risk_free_rate: Risk-free rate
        target_return: Target/threshold return
    
    Returns:
        Sortino ratio
    """
    if len(returns) == 0:
        return 0.0
    
    downside_vol = calculate_downside_volatility(returns, target_return)
    
    # Handle zero or near-zero downside volatility case
    if downside_vol < 1e-8 or np.isclose(downside_vol, 0.0):
        return 0.0
    
    excess_return = np.mean(returns) - risk_free_rate
    sortino = excess_return / downside_vol
    
    # Handle potential infinity or NaN
    if not np.isfinite(sortino):
        return 0.0
    
    return float(sortino)


def calculate_risk_metrics(profitability: Dict, confidence_levels: List[float] = [0.90, 0.95, 0.99]) -> Dict:
    """
    Calculate comprehensive risk metrics from profitability data
    
    Args:
        profitability: Output from compute_profitability function
        confidence_levels: List of confidence levels for VaR/CVaR
    
    Returns:
        Dictionary with all risk metrics
    """
    # Extract final period profitability
    npm_array = np.array(profitability['npm'])
    roa_array = np.array(profitability['roa'])
    profit_array = np.array(profitability['net_profit'])
    
    # Focus on final period
    final_npm = npm_array[:, -1]
    final_roa = roa_array[:, -1]
    final_profit = profit_array[:, -1]
    
    # Calculate VaR and CVaR at different confidence levels
    var_metrics = {}
    cvar_metrics = {}
    
    for cl in confidence_levels:
        cl_str = f"{int(cl*100)}"
        var_metrics[f"var_{cl_str}"] = {
            "npm": calculate_var(final_npm, cl),
            "roa": calculate_var(final_roa, cl),
            "profit": calculate_var(final_profit, cl)
        }
        cvar_metrics[f"cvar_{cl_str}"] = {
            "npm": calculate_cvar(final_npm, cl),
            "roa": calculate_cvar(final_roa, cl),
            "profit": calculate_cvar(final_profit, cl)
        }
    
    # Volatility metrics
    volatility = {
        "npm": {
            "total": float(np.std(final_npm)),
            "downside": calculate_downside_volatility(final_npm)
        },
        "roa": {
            "total": float(np.std(final_roa)),
            "downside": calculate_downside_volatility(final_roa)
        },
        "profit": {
            "total": float(np.std(final_profit)),
            "downside": calculate_downside_volatility(final_profit)
        }
    }
    
    # Risk-adjusted returns
    risk_adjusted = {
        "npm_sharpe": calculate_sharpe_ratio(final_npm),
        "npm_sortino": calculate_sortino_ratio(final_npm),
        "roa_sharpe": calculate_sharpe_ratio(final_roa),
        "roa_sortino": calculate_sortino_ratio(final_roa)
    }
    
    # Percentile distribution
    percentiles = {
        "npm": {
            "p01": float(np.percentile(final_npm, 1)),
            "p05": float(np.percentile(final_npm, 5)),
            "p10": float(np.percentile(final_npm, 10)),
            "p25": float(np.percentile(final_npm, 25)),
            "p50": float(np.percentile(final_npm, 50)),
            "p75": float(np.percentile(final_npm, 75)),
            "p90": float(np.percentile(final_npm, 90)),
            "p95": float(np.percentile(final_npm, 95)),
            "p99": float(np.percentile(final_npm, 99))
        },
        "roa": {
            "p01": float(np.percentile(final_roa, 1)),
            "p05": float(np.percentile(final_roa, 5)),
            "p10": float(np.percentile(final_roa, 10)),
            "p25": float(np.percentile(final_roa, 25)),
            "p50": float(np.percentile(final_roa, 50)),
            "p75": float(np.percentile(final_roa, 75)),
            "p90": float(np.percentile(final_roa, 90)),
            "p95": float(np.percentile(final_roa, 95)),
            "p99": float(np.percentile(final_roa, 99))
        }
    }
    
    # Probability metrics
    probability = {
        "npm_negative": float(np.mean(final_npm < 0)),
        "npm_below_5pct": float(np.mean(final_npm < 0.05)),
        "roa_negative": float(np.mean(final_roa < 0)),
        "roa_below_5pct": float(np.mean(final_roa < 0.05))
    }
    
    return {
        "var": var_metrics,
        "cvar": cvar_metrics,
        "volatility": volatility,
        "risk_adjusted": risk_adjusted,
        "percentiles": percentiles,
        "probability": probability
    }


def calculate_hedge_effectiveness(unhedged_metrics: Dict, hedged_metrics: Dict) -> Dict:
    """
    Calculate hedge effectiveness by comparing unhedged vs hedged scenarios
    
    Args:
        unhedged_metrics: Risk metrics without hedging
        hedged_metrics: Risk metrics with hedging
    
    Returns:
        Hedge effectiveness metrics
    """
    # CVaR reduction (95% level)
    unhedged_cvar = unhedged_metrics['cvar']['cvar_95']['npm']
    hedged_cvar = hedged_metrics['cvar']['cvar_95']['npm']
    cvar_reduction_pct = ((unhedged_cvar - hedged_cvar) / unhedged_cvar * 100) if unhedged_cvar != 0 else 0
    
    # Volatility reduction
    unhedged_vol = unhedged_metrics['volatility']['npm']['total']
    hedged_vol = hedged_metrics['volatility']['npm']['total']
    vol_reduction_pct = ((unhedged_vol - hedged_vol) / unhedged_vol * 100) if unhedged_vol != 0 else 0
    
    # Expected return impact
    unhedged_mean = unhedged_metrics['percentiles']['npm']['p50']
    hedged_mean = hedged_metrics['percentiles']['npm']['p50']
    mean_change_bps = (hedged_mean - unhedged_mean) * 10000
    
    return {
        "cvar_reduction_pct": float(cvar_reduction_pct),
        "volatility_reduction_pct": float(vol_reduction_pct),
        "mean_npm_change_bps": float(mean_change_bps),
        "unhedged_cvar": float(unhedged_cvar),
        "hedged_cvar": float(hedged_cvar),
        "unhedged_volatility": float(unhedged_vol),
        "hedged_volatility": float(hedged_vol)
    }


if __name__ == "__main__":
    # Test risk metrics
    np.random.seed(42)
    
    # Simulate returns with negative skew
    returns = np.random.normal(0.08, 0.05, 10000)
    returns = returns - 0.5 * np.abs(np.random.normal(0, 0.02, 10000))  # Add negative skew
    
    print(f"Mean return: {np.mean(returns):.4f}")
    print(f"Std: {np.std(returns):.4f}")
    print(f"VaR (95%): {calculate_var(returns, 0.95):.4f}")
    print(f"CVaR (95%): {calculate_cvar(returns, 0.95):.4f}")
    print(f"Sharpe: {calculate_sharpe_ratio(returns):.4f}")
    print(f"Sortino: {calculate_sortino_ratio(returns):.4f}")
