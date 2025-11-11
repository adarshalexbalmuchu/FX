"""
Test Suite for Risk Metrics
"""
import pytest
import numpy as np
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from risk import (
    calculate_var,
    calculate_cvar,
    calculate_downside_volatility,
    calculate_sharpe_ratio,
    calculate_sortino_ratio
)


class TestVaR:
    """Test Value at Risk calculation"""
    
    def test_var_normal_distribution(self):
        """Test VaR on normal distribution"""
        np.random.seed(42)
        returns = np.random.normal(0.08, 0.05, 10000)
        
        var_95 = calculate_var(returns, 0.95)
        
        # VaR should be positive and reasonable
        assert var_95 > 0
        assert var_95 < 0.15  # Shouldn't be too extreme
    
    def test_var_percentile_property(self):
        """Test VaR represents correct percentile"""
        np.random.seed(42)
        returns = np.random.normal(0.0, 1.0, 10000)
        
        var_95 = calculate_var(returns, 0.95)
        
        # 5% of returns should be below -VaR
        pct_below = np.mean(returns < -var_95)
        assert abs(pct_below - 0.05) < 0.01  # Within 1%
    
    def test_var_empty_array(self):
        """Test VaR with empty array"""
        var = calculate_var(np.array([]), 0.95)
        assert var == 0.0


class TestCVaR:
    """Test Conditional Value at Risk"""
    
    def test_cvar_greater_than_var(self):
        """Test CVaR >= VaR"""
        np.random.seed(42)
        returns = np.random.normal(0.0, 1.0, 10000)
        
        var_95 = calculate_var(returns, 0.95)
        cvar_95 = calculate_cvar(returns, 0.95)
        
        assert cvar_95 >= var_95
    
    def test_cvar_negative_skew(self):
        """Test CVaR captures tail risk"""
        np.random.seed(42)
        # Create negatively skewed distribution
        returns = np.random.normal(0.08, 0.05, 10000)
        returns = returns - 2.0 * np.abs(np.random.normal(0, 0.01, 10000))
        
        var_95 = calculate_var(returns, 0.95)
        cvar_95 = calculate_cvar(returns, 0.95)
        
        # CVaR should be significantly higher for skewed distribution
        assert cvar_95 > var_95 * 1.1
    
    def test_cvar_empty_array(self):
        """Test CVaR with empty array"""
        cvar = calculate_cvar(np.array([]), 0.95)
        assert cvar == 0.0


class TestDownsideVolatility:
    """Test downside volatility calculation"""
    
    def test_downside_vol_less_than_total(self):
        """Test downside vol <= total vol for symmetric distribution"""
        np.random.seed(42)
        returns = np.random.normal(0.05, 0.08, 10000)
        
        total_vol = np.std(returns)
        downside_vol = calculate_downside_volatility(returns, 0.0)
        
        # Downside should be less for positive mean
        assert downside_vol <= total_vol
    
    def test_downside_vol_zero_for_all_positive(self):
        """Test downside vol is zero when no negative returns"""
        returns = np.abs(np.random.normal(0.1, 0.05, 1000))
        
        downside_vol = calculate_downside_volatility(returns, 0.0)
        
        assert downside_vol == 0.0


class TestSharpeRatio:
    """Test Sharpe ratio calculation"""
    
    def test_sharpe_positive_for_good_returns(self):
        """Test Sharpe is positive for good risk-adjusted returns"""
        np.random.seed(42)
        returns = np.random.normal(0.15, 0.10, 1000)
        
        sharpe = calculate_sharpe_ratio(returns, risk_free_rate=0.05)
        
        assert sharpe > 0
    
    def test_sharpe_negative_for_bad_returns(self):
        """Test Sharpe is negative for returns below risk-free rate"""
        np.random.seed(42)
        returns = np.random.normal(0.02, 0.10, 1000)
        
        sharpe = calculate_sharpe_ratio(returns, risk_free_rate=0.05)
        
        assert sharpe < 0
    
    def test_sharpe_zero_volatility(self):
        """Test Sharpe with zero volatility"""
        returns = np.array([0.08] * 100)
        
        sharpe = calculate_sharpe_ratio(returns)
        
        assert sharpe == 0.0


class TestSortinoRatio:
    """Test Sortino ratio calculation"""
    
    def test_sortino_higher_than_sharpe(self):
        """Test Sortino >= Sharpe for positive returns"""
        np.random.seed(42)
        returns = np.random.normal(0.15, 0.10, 1000)
        
        sharpe = calculate_sharpe_ratio(returns, risk_free_rate=0.05)
        sortino = calculate_sortino_ratio(returns, risk_free_rate=0.05)
        
        # Sortino should be higher (less downside than total vol)
        assert sortino >= sharpe * 0.9  # Allow small tolerance


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
