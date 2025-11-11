"""
Test Suite for Hedging Calculations
"""
import pytest
import numpy as np
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from hedging import (
    forward_rate,
    garman_kohlhagen_call,
    garman_kohlhagen_put,
    calculate_forward_pnl,
    calculate_option_pnl,
    calculate_hedge_pnl
)


class TestForwardRate:
    """Test forward rate calculation"""
    
    def test_forward_rate_irp(self):
        """Test interest rate parity"""
        spot = 83.0
        r_inr = 0.065
        r_usd = 0.05
        tenor = 0.25
        
        fwd = forward_rate(spot, r_inr, r_usd, tenor)
        
        # Forward should be higher when INR rate > USD rate
        assert fwd > spot
    
    def test_forward_rate_symmetry(self):
        """Test symmetry property"""
        spot = 83.0
        r_inr = 0.065
        r_usd = 0.05
        tenor = 0.25
        
        fwd = forward_rate(spot, r_inr, r_usd, tenor)
        
        # Reversing should give reciprocal
        spot_inv = 1 / spot
        fwd_inv = forward_rate(spot_inv, r_usd, r_inr, tenor)
        
        assert abs(fwd * fwd_inv - 1.0) < 1e-10


class TestGarmanKohlhagen:
    """Test option pricing"""
    
    def test_call_put_parity(self):
        """Test put-call parity"""
        spot = 83.0
        strike = 83.0
        r_inr = 0.065
        r_usd = 0.05
        sigma = 0.08
        tenor = 0.25
        
        call = garman_kohlhagen_call(spot, strike, r_inr, r_usd, sigma, tenor)
        put = garman_kohlhagen_put(spot, strike, r_inr, r_usd, sigma, tenor)
        
        # Put-Call Parity: C - P = S*e^(-r_f*T) - K*e^(-r_d*T)
        parity_lhs = call - put
        parity_rhs = spot * np.exp(-r_usd * tenor) - strike * np.exp(-r_inr * tenor)
        
        assert abs(parity_lhs - parity_rhs) < 1e-6
    
    def test_option_prices_positive(self):
        """Test option prices are positive"""
        call = garman_kohlhagen_call(83.0, 83.0, 0.065, 0.05, 0.08, 0.25)
        put = garman_kohlhagen_put(83.0, 83.0, 0.065, 0.05, 0.08, 0.25)
        
        assert call > 0
        assert put > 0
    
    def test_atm_call_put_similar(self):
        """Test ATM call and put have similar prices"""
        call = garman_kohlhagen_call(83.0, 83.0, 0.065, 0.05, 0.08, 0.25)
        put = garman_kohlhagen_put(83.0, 83.0, 0.065, 0.05, 0.08, 0.25)
        
        # Should be similar but not exactly equal due to interest rate differential
        assert abs(call - put) < 1.0  # Within 1 rupee
    
    def test_deep_itm_call(self):
        """Test deep in-the-money call"""
        call = garman_kohlhagen_call(90.0, 80.0, 0.065, 0.05, 0.08, 0.25)
        intrinsic = 90.0 - 80.0
        
        # Should be close to intrinsic value
        assert call > intrinsic
        assert call < intrinsic + 2.0
    
    def test_deep_otm_call(self):
        """Test deep out-of-the-money call"""
        call = garman_kohlhagen_call(80.0, 90.0, 0.065, 0.05, 0.08, 0.25)
        
        # Should be small but positive
        assert 0 < call < 1.0


class TestHedgePnL:
    """Test hedge P&L calculations"""
    
    def test_forward_pnl_shape(self):
        """Test forward P&L output shape"""
        fx_paths = np.random.uniform(80, 86, (100, 5))
        
        pnl = calculate_forward_pnl(
            fx_paths=fx_paths,
            forward_rate=83.0,
            notional_usd=100_000_000,
            hedge_ratio=0.5
        )
        
        assert pnl.shape == fx_paths.shape
    
    def test_forward_pnl_zero_at_start(self):
        """Test forward P&L is zero at t=0"""
        fx_paths = np.random.uniform(80, 86, (100, 5))
        
        pnl = calculate_forward_pnl(
            fx_paths=fx_paths,
            forward_rate=83.0,
            notional_usd=100_000_000,
            hedge_ratio=0.5
        )
        
        assert np.all(pnl[:, 0] == 0)
    
    def test_option_pnl_shape(self):
        """Test option P&L output shape"""
        fx_paths = np.random.uniform(80, 86, (100, 5))
        
        pnl = calculate_option_pnl(
            fx_paths=fx_paths,
            strike=83.0,
            premium=1.5,
            notional_usd=100_000_000,
            hedge_ratio=0.3,
            option_type="put"
        )
        
        assert pnl.shape == fx_paths.shape
    
    def test_calculate_hedge_pnl_structure(self):
        """Test complete hedge P&L calculation returns correct structure"""
        fx_paths = np.random.uniform(80, 86, (100, 5))
        
        hedge_config = {
            'forwards': 0.5,
            'options': 0.3,
            'natural': 0.2,
            'tenor_months': 3
        }
        
        result = calculate_hedge_pnl(
            fx_paths=fx_paths,
            spot_rate=83.0,
            hedge_config=hedge_config,
            r_inr=0.065,
            r_usd=0.05,
            sigma=0.08
        )
        
        assert 'total_pnl' in result
        assert 'forward_pnl' in result
        assert 'option_pnl' in result
        assert 'natural_hedge_benefit' in result
        assert 'transaction_costs' in result
        assert 'forward_rate' in result
        assert 'option_premium' in result


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
