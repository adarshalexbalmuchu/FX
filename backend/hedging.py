"""
Hedging Strategy Calculations
Implements forward contracts, options, and natural hedging with transaction costs
"""
import numpy as np
from scipy.stats import norm
from typing import Dict


def forward_rate(spot: float, r_domestic: float, r_foreign: float, tenor_years: float) -> float:
    """
    Calculate forward rate using Interest Rate Parity (IRP)
    F₀ = S₀ × (1 + r_d·T) / (1 + r_f·T)
    
    Args:
        spot: Current spot rate (INR/USD)
        r_domestic: INR risk-free rate
        r_foreign: USD risk-free rate
        tenor_years: Forward contract tenor in years
    
    Returns:
        Forward rate
    """
    return spot * (1 + r_domestic * tenor_years) / (1 + r_foreign * tenor_years)


def garman_kohlhagen_call(spot: float, strike: float, r_domestic: float, 
                          r_foreign: float, sigma: float, tenor_years: float) -> float:
    """
    Price a currency call option using Garman-Kohlhagen formula
    (Black-Scholes adaptation for FX options)
    
    C = S₀·e^(-r_f·T)·N(d1) - K·e^(-r_d·T)·N(d2)
    
    where:
        d1 = [ln(S₀/K) + (r_d - r_f + 0.5σ²)T] / (σ√T)
        d2 = d1 - σ√T
    
    Args:
        spot: Current spot rate
        strike: Strike price
        r_domestic: Domestic (INR) risk-free rate
        r_foreign: Foreign (USD) risk-free rate
        sigma: Volatility
        tenor_years: Time to maturity
    
    Returns:
        Call option price
    """
    if tenor_years <= 0:
        return max(spot - strike, 0)
    
    sqrt_t = np.sqrt(tenor_years)
    d1 = (np.log(spot / strike) + (r_domestic - r_foreign + 0.5 * sigma**2) * tenor_years) / (sigma * sqrt_t)
    d2 = d1 - sigma * sqrt_t
    
    call_price = (spot * np.exp(-r_foreign * tenor_years) * norm.cdf(d1) - 
                  strike * np.exp(-r_domestic * tenor_years) * norm.cdf(d2))
    
    return call_price


def garman_kohlhagen_put(spot: float, strike: float, r_domestic: float,
                         r_foreign: float, sigma: float, tenor_years: float) -> float:
    """
    Price a currency put option using Garman-Kohlhagen formula
    
    P = K·e^(-r_d·T)·N(-d2) - S₀·e^(-r_f·T)·N(-d1)
    """
    if tenor_years <= 0:
        return max(strike - spot, 0)
    
    sqrt_t = np.sqrt(tenor_years)
    d1 = (np.log(spot / strike) + (r_domestic - r_foreign + 0.5 * sigma**2) * tenor_years) / (sigma * sqrt_t)
    d2 = d1 - sigma * sqrt_t
    
    put_price = (strike * np.exp(-r_domestic * tenor_years) * norm.cdf(-d2) - 
                 spot * np.exp(-r_foreign * tenor_years) * norm.cdf(-d1))
    
    return put_price


def calculate_forward_pnl(fx_paths: np.ndarray, forward_rate: float, 
                          notional_usd: float, hedge_ratio: float) -> np.ndarray:
    """
    Calculate P&L from forward contract hedging
    
    P&L = hedge_ratio × notional × (Forward_rate - Spot_at_maturity)
    
    Args:
        fx_paths: FX rate paths (n_paths × n_steps)
        forward_rate: Contracted forward rate
        notional_usd: Notional exposure in USD
        hedge_ratio: Proportion of exposure hedged (0 to 1)
    
    Returns:
        Forward P&L for each path at each time step
    """
    n_paths, n_steps = fx_paths.shape
    pnl = np.zeros((n_paths, n_steps))
    
    # Forward P&L realized at each time step
    for t in range(1, n_steps):
        spot_t = fx_paths[:, t]
        # Positive when INR weakens (spot > forward) and we're long INR
        pnl[:, t] = hedge_ratio * notional_usd * (spot_t - forward_rate)
    
    return pnl


def calculate_option_pnl(fx_paths: np.ndarray, strike: float, premium: float,
                        notional_usd: float, hedge_ratio: float, 
                        option_type: str = "put") -> np.ndarray:
    """
    Calculate P&L from option hedging
    
    For a put option (protection against INR weakening):
        P&L = hedge_ratio × notional × max(Strike - Spot, 0) - Premium
    
    For a call option:
        P&L = hedge_ratio × notional × max(Spot - Strike, 0) - Premium
    
    Args:
        fx_paths: FX rate paths
        strike: Option strike price
        premium: Option premium paid upfront
        notional_usd: Notional exposure in USD
        hedge_ratio: Proportion hedged
        option_type: 'put' or 'call'
    
    Returns:
        Option P&L for each path at each time step
    """
    n_paths, n_steps = fx_paths.shape
    pnl = np.zeros((n_paths, n_steps))
    
    # Option P&L realized at maturity
    for t in range(1, n_steps):
        spot_t = fx_paths[:, t]
        
        if option_type == "put":
            intrinsic_value = np.maximum(strike - spot_t, 0)
        else:  # call
            intrinsic_value = np.maximum(spot_t - strike, 0)
        
        # P&L = Intrinsic value - Premium
        pnl[:, t] = hedge_ratio * notional_usd * intrinsic_value - premium
    
    return pnl


def calculate_hedge_pnl(fx_paths: np.ndarray, spot_rate: float, hedge_config: Dict,
                       r_inr: float, r_usd: float, sigma: float,
                       transaction_cost_bps: int = 10) -> Dict:
    """
    Calculate total hedge P&L from all hedging instruments
    
    Args:
        fx_paths: FX rate paths (n_paths × n_steps)
        spot_rate: Current spot rate
        hedge_config: Dict with 'forwards', 'options', 'natural', 'tenor_months'
        r_inr: INR risk-free rate
        r_usd: USD risk-free rate
        sigma: Volatility
        transaction_cost_bps: Transaction costs in basis points
    
    Returns:
        Dictionary containing:
            - total_pnl: Combined P&L from all hedges
            - forward_pnl: P&L from forwards
            - option_pnl: P&L from options
            - natural_hedge_benefit: Benefit from natural hedging
            - transaction_costs: Total transaction costs
    """
    n_paths, n_steps = fx_paths.shape
    tenor_years = hedge_config.get('tenor_months', 3) / 12.0
    
    # Assume $100M USD exposure for calculation
    notional_usd = 100_000_000
    
    # Forward hedge
    forward_ratio = hedge_config.get('forwards', 0.0)
    fwd_rate = forward_rate(spot_rate, r_inr, r_usd, tenor_years)
    forward_pnl = calculate_forward_pnl(fx_paths, fwd_rate, notional_usd, forward_ratio)
    
    # Transaction cost for forwards (on notional)
    forward_tc = forward_ratio * notional_usd * spot_rate * (transaction_cost_bps / 10000)
    
    # Option hedge (ATM put to protect against INR weakening)
    option_ratio = hedge_config.get('options', 0.0)
    strike = spot_rate  # ATM option
    premium = garman_kohlhagen_put(spot_rate, strike, r_inr, r_usd, sigma, tenor_years)
    option_pnl = calculate_option_pnl(fx_paths, strike, premium, notional_usd, option_ratio, "put")
    
    # Transaction cost for options (on premium)
    option_tc = option_ratio * premium * (transaction_cost_bps / 10000)
    
    # Natural hedge (offsetting foreign costs)
    natural_ratio = hedge_config.get('natural', 0.0)
    # Natural hedge reduces effective exposure
    natural_benefit = np.zeros((n_paths, n_steps))
    for t in range(1, n_steps):
        # Benefit from having foreign costs when INR weakens
        fx_change = fx_paths[:, t] - spot_rate
        natural_benefit[:, t] = natural_ratio * notional_usd * fx_change * 0.5  # Partial offset
    
    # Total hedge P&L
    total_pnl = forward_pnl + option_pnl + natural_benefit
    
    # Total transaction costs (subtract from P&L)
    total_tc = forward_tc + option_tc
    total_pnl -= total_tc / n_steps  # Amortize across time steps
    
    return {
        "total_pnl": total_pnl,
        "forward_pnl": forward_pnl,
        "option_pnl": option_pnl,
        "natural_hedge_benefit": natural_benefit,
        "transaction_costs": total_tc,
        "forward_rate": fwd_rate,
        "option_strike": strike,
        "option_premium": premium
    }


if __name__ == "__main__":
    # Test hedging calculations
    spot = 83.0
    r_inr = 0.065
    r_usd = 0.05
    sigma = 0.08
    tenor = 0.25  # 3 months
    
    fwd = forward_rate(spot, r_inr, r_usd, tenor)
    print(f"Forward rate: {fwd:.4f}")
    
    call_price = garman_kohlhagen_call(spot, spot, r_inr, r_usd, sigma, tenor)
    put_price = garman_kohlhagen_put(spot, spot, r_inr, r_usd, sigma, tenor)
    print(f"ATM Call: {call_price:.4f}, ATM Put: {put_price:.4f}")
    
    # Put-Call Parity check
    parity = call_price - put_price - (spot * np.exp(-r_usd * tenor) - spot * np.exp(-r_inr * tenor))
    print(f"Put-Call Parity deviation: {parity:.6f} (should be ~0)")
