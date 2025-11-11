"""
FX Stochastic Path Generators
Implements GBM, Regime-Switching, Jump-Diffusion, and GARCH(1,1) models
Optimized for Python 3.12+ using vectorized NumPy operations
"""
import numpy as np
from typing import Literal, Optional


def _gbm_paths_vectorized(n_paths: int, n_steps: int, S0: float, mu: float, sigma: float, dt: float, seed: int):
    """
    Vectorized Geometric Brownian Motion path generator
    dS_t = μS_t dt + σS_t dW_t
    
    Uses NumPy vectorization for fast computation (comparable to Numba for large arrays)
    """
    np.random.seed(seed)
    
    # Generate all random numbers at once for vectorization
    z = np.random.randn(n_paths // 2, n_steps)
    
    # Apply antithetic variates for variance reduction
    z_anti = np.vstack([z, -z])[:n_paths, :]
    
    # Vectorized GBM calculation
    drift = (mu - 0.5 * sigma**2) * dt
    diffusion = sigma * np.sqrt(dt) * z_anti
    
    # Cumulative product for path generation
    log_returns = drift + diffusion
    paths = np.zeros((n_paths, n_steps + 1))
    paths[:, 0] = S0
    paths[:, 1:] = S0 * np.exp(np.cumsum(log_returns, axis=1))
    
    return paths


def generate_gbm_paths(n_paths: int, horizon_quarters: int, spot_rate: float, 
                       mu: float, sigma: float, seed: int = 42) -> np.ndarray:
    """
    Generate FX paths using Geometric Brownian Motion
    
    Args:
        n_paths: Number of simulation paths
        horizon_quarters: Simulation horizon in quarters
        spot_rate: Current spot rate S₀
        mu: Drift rate (annualized)
        sigma: Volatility (annualized)
        seed: Random seed
    
    Returns:
        Array of shape (n_paths, horizon_quarters + 1)
    """
    dt = 0.25  # Quarterly time step
    n_steps = horizon_quarters
    
    paths = _gbm_paths_vectorized(n_paths, n_steps, spot_rate, mu, sigma, dt, seed)
    return paths


def generate_regime_switch_paths(n_paths: int, horizon_quarters: int, spot_rate: float,
                                  mu_low: float, sigma_low: float, 
                                  mu_high: float, sigma_high: float,
                                  p_low_to_high: float = 0.1, p_high_to_low: float = 0.2,
                                  seed: int = 42) -> np.ndarray:
    """
    Generate FX paths with regime switching (low/high volatility states)
    
    Args:
        n_paths: Number of simulation paths
        horizon_quarters: Simulation horizon
        spot_rate: Current spot rate
        mu_low, sigma_low: Low volatility regime parameters
        mu_high, sigma_high: High volatility regime parameters
        p_low_to_high: Transition probability from low to high volatility
        p_high_to_low: Transition probability from high to low volatility
        seed: Random seed
    
    Returns:
        Array of shape (n_paths, horizon_quarters + 1)
    """
    np.random.seed(seed)
    dt = 0.25
    n_steps = horizon_quarters
    paths = np.zeros((n_paths, n_steps + 1))
    paths[:, 0] = spot_rate
    
    # Initialize regime states (0 = low vol, 1 = high vol)
    states = np.zeros(n_paths, dtype=int)
    
    for t in range(n_steps):
        # Update regime states
        for i in range(n_paths):
            if states[i] == 0:  # Low volatility
                if np.random.rand() < p_low_to_high:
                    states[i] = 1
            else:  # High volatility
                if np.random.rand() < p_high_to_low:
                    states[i] = 0
        
        # Generate returns based on current regime
        z = np.random.randn(n_paths)
        for i in range(n_paths):
            mu = mu_low if states[i] == 0 else mu_high
            sigma = sigma_low if states[i] == 0 else sigma_high
            
            drift = (mu - 0.5 * sigma**2) * dt
            diffusion = sigma * np.sqrt(dt) * z[i]
            paths[i, t + 1] = paths[i, t] * np.exp(drift + diffusion)
    
    return paths


def generate_jump_diffusion_paths(n_paths: int, horizon_quarters: int, spot_rate: float,
                                   mu: float, sigma: float,
                                   jump_intensity: float = 2.0,  # λ (jumps per year)
                                   jump_mean: float = -0.02,      # Mean jump size
                                   jump_std: float = 0.05,        # Jump volatility
                                   seed: int = 42) -> np.ndarray:
    """
    Generate FX paths with jump-diffusion (Merton model)
    dS_t = μS_t dt + σS_t dW_t + S_t dJ_t
    
    Args:
        n_paths: Number of simulation paths
        horizon_quarters: Simulation horizon
        spot_rate: Current spot rate
        mu: Drift rate
        sigma: Continuous diffusion volatility
        jump_intensity: Expected number of jumps per year (λ)
        jump_mean: Mean jump size (μ_J)
        jump_std: Jump size volatility (σ_J)
        seed: Random seed
    
    Returns:
        Array of shape (n_paths, horizon_quarters + 1)
    """
    np.random.seed(seed)
    dt = 0.25
    n_steps = horizon_quarters
    paths = np.zeros((n_paths, n_steps + 1))
    paths[:, 0] = spot_rate
    
    for i in range(n_paths):
        for t in range(n_steps):
            # Diffusion component
            z = np.random.randn()
            drift = (mu - 0.5 * sigma**2) * dt
            diffusion = sigma * np.sqrt(dt) * z
            
            # Jump component (Poisson process)
            n_jumps = np.random.poisson(jump_intensity * dt)
            jump_total = 0.0
            if n_jumps > 0:
                jump_sizes = np.random.normal(jump_mean, jump_std, n_jumps)
                jump_total = np.sum(jump_sizes)
            
            paths[i, t + 1] = paths[i, t] * np.exp(drift + diffusion + jump_total)
    
    return paths


def generate_garch_paths(n_paths: int, horizon_quarters: int, spot_rate: float,
                         mu: float, omega: float = 0.0001, alpha: float = 0.1, 
                         beta: float = 0.85, seed: int = 42) -> np.ndarray:
    """
    Generate FX paths with GARCH(1,1) volatility clustering
    r_t = μ + ε_t, ε_t = σ_t z_t, z_t ~ N(0,1)
    σ²_t = ω + α·ε²_{t-1} + β·σ²_{t-1}
    
    Args:
        n_paths: Number of simulation paths
        horizon_quarters: Simulation horizon
        spot_rate: Current spot rate
        mu: Mean return
        omega: GARCH constant (ω)
        alpha: ARCH parameter (α)
        beta: GARCH parameter (β)
        seed: Random seed
    
    Returns:
        Array of shape (n_paths, horizon_quarters + 1)
    """
    np.random.seed(seed)
    dt = 0.25
    n_steps = horizon_quarters
    paths = np.zeros((n_paths, n_steps + 1))
    paths[:, 0] = spot_rate
    
    # Initial variance (long-run variance)
    var_0 = omega / (1 - alpha - beta)
    
    for i in range(n_paths):
        variance = var_0
        epsilon_prev = 0.0
        
        for t in range(n_steps):
            # Update variance using GARCH(1,1)
            variance = omega + alpha * epsilon_prev**2 + beta * variance
            sigma_t = np.sqrt(variance)
            
            # Generate return
            z = np.random.randn()
            epsilon = sigma_t * z
            r_t = (mu - 0.5 * variance) * dt + epsilon * np.sqrt(dt)
            
            paths[i, t + 1] = paths[i, t] * np.exp(r_t)
            epsilon_prev = epsilon * np.sqrt(dt)
    
    return paths


def generate_fx_paths(model: Literal["gbm", "regime", "jump", "garch"],
                      n_paths: int, horizon_quarters: int, spot_rate: float,
                      sigma_annual: float, drift_mode: str = "historical",
                      custom_drift: Optional[float] = None,
                      r_inr: float = 0.065, r_usd: float = 0.05,
                      seed: int = 42) -> np.ndarray:
    """
    Main interface for generating FX paths with different models
    
    Args:
        model: Model type ('gbm', 'regime', 'jump', 'garch')
        n_paths: Number of simulation paths
        horizon_quarters: Simulation horizon in quarters
        spot_rate: Current INR/USD spot rate
        sigma_annual: Annual volatility
        drift_mode: 'historical', 'zero', or 'custom'
        custom_drift: Custom drift if drift_mode='custom'
        r_inr: INR risk-free rate
        r_usd: USD risk-free rate
        seed: Random seed
    
    Returns:
        FX paths array of shape (n_paths, horizon_quarters + 1)
    """
    # Calculate drift
    if drift_mode == "zero":
        mu = 0.0
    elif drift_mode == "custom" and custom_drift is not None:
        mu = custom_drift
    else:  # historical or default - use interest rate differential
        mu = r_inr - r_usd  # Covered interest rate parity
    
    # Generate paths based on model
    if model == "gbm":
        return generate_gbm_paths(n_paths, horizon_quarters, spot_rate, mu, sigma_annual, seed)
    
    elif model == "regime":
        # Low volatility regime (60% of sigma) and high volatility (140%)
        sigma_low = sigma_annual * 0.6
        sigma_high = sigma_annual * 1.4
        return generate_regime_switch_paths(
            n_paths, horizon_quarters, spot_rate,
            mu, sigma_low, mu, sigma_high,
            seed=seed
        )
    
    elif model == "jump":
        return generate_jump_diffusion_paths(
            n_paths, horizon_quarters, spot_rate,
            mu, sigma_annual,
            jump_intensity=2.0,
            jump_mean=-0.02,
            jump_std=0.05,
            seed=seed
        )
    
    elif model == "garch":
        return generate_garch_paths(
            n_paths, horizon_quarters, spot_rate,
            mu, seed=seed
        )
    
    else:
        raise ValueError(f"Unknown model: {model}")


if __name__ == "__main__":
    # Test path generation
    paths = generate_fx_paths(
        model="gbm",
        n_paths=1000,
        horizon_quarters=4,
        spot_rate=83.0,
        sigma_annual=0.08
    )
    print(f"Generated {paths.shape[0]} paths over {paths.shape[1]} time steps")
    print(f"Final spot rates - Mean: {paths[:, -1].mean():.2f}, Std: {paths[:, -1].std():.2f}")
