"""
Test Suite for FX Path Generation
"""
import pytest
import numpy as np
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from paths import (
    generate_gbm_paths,
    generate_regime_switch_paths,
    generate_jump_diffusion_paths,
    generate_garch_paths,
    generate_fx_paths
)


class TestGBMPaths:
    """Test Geometric Brownian Motion path generation"""
    
    def test_gbm_shape(self):
        """Test output array has correct shape"""
        paths = generate_gbm_paths(
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            mu=0.015,
            sigma=0.08
        )
        assert paths.shape == (100, 5)  # n_paths × (horizon + 1)
    
    def test_gbm_initial_value(self):
        """Test all paths start at spot rate"""
        spot = 83.0
        paths = generate_gbm_paths(
            n_paths=100,
            horizon_quarters=4,
            spot_rate=spot,
            mu=0.015,
            sigma=0.08
        )
        assert np.allclose(paths[:, 0], spot)
    
    def test_gbm_positive_values(self):
        """Test all path values are positive"""
        paths = generate_gbm_paths(
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            mu=0.015,
            sigma=0.08
        )
        assert np.all(paths > 0)
    
    def test_gbm_volatility_reasonable(self):
        """Test realized volatility is close to input"""
        n_paths = 10000
        sigma_target = 0.08
        
        paths = generate_gbm_paths(
            n_paths=n_paths,
            horizon_quarters=4,
            spot_rate=83.0,
            mu=0.0,
            sigma=sigma_target
        )
        
        # Calculate realized volatility
        returns = np.diff(np.log(paths), axis=1)
        realized_vol = np.std(returns) * np.sqrt(4)  # Annualized
        
        # Should be within 10% of target
        assert abs(realized_vol - sigma_target) < sigma_target * 0.15


class TestRegimeSwitchPaths:
    """Test regime-switching model"""
    
    def test_regime_shape(self):
        """Test output shape"""
        paths = generate_regime_switch_paths(
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            mu_low=0.01,
            sigma_low=0.05,
            mu_high=0.02,
            sigma_high=0.12
        )
        assert paths.shape == (100, 5)
    
    def test_regime_initial_value(self):
        """Test initial value"""
        spot = 83.0
        paths = generate_regime_switch_paths(
            n_paths=100,
            horizon_quarters=4,
            spot_rate=spot,
            mu_low=0.01,
            sigma_low=0.05,
            mu_high=0.02,
            sigma_high=0.12
        )
        assert np.allclose(paths[:, 0], spot)
    
    def test_regime_positive_values(self):
        """Test all values positive"""
        paths = generate_regime_switch_paths(
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            mu_low=0.01,
            sigma_low=0.05,
            mu_high=0.02,
            sigma_high=0.12
        )
        assert np.all(paths > 0)


class TestJumpDiffusionPaths:
    """Test jump-diffusion model"""
    
    def test_jump_shape(self):
        """Test output shape"""
        paths = generate_jump_diffusion_paths(
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            mu=0.015,
            sigma=0.08,
            jump_intensity=2.0
        )
        assert paths.shape == (100, 5)
    
    def test_jump_initial_value(self):
        """Test initial value"""
        spot = 83.0
        paths = generate_jump_diffusion_paths(
            n_paths=100,
            horizon_quarters=4,
            spot_rate=spot,
            mu=0.015,
            sigma=0.08
        )
        assert np.allclose(paths[:, 0], spot)
    
    def test_jump_positive_values(self):
        """Test all values positive"""
        paths = generate_jump_diffusion_paths(
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            mu=0.015,
            sigma=0.08
        )
        assert np.all(paths > 0)


class TestGARCHPaths:
    """Test GARCH(1,1) model"""
    
    def test_garch_shape(self):
        """Test output shape"""
        paths = generate_garch_paths(
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            mu=0.015
        )
        assert paths.shape == (100, 5)
    
    def test_garch_initial_value(self):
        """Test initial value"""
        spot = 83.0
        paths = generate_garch_paths(
            n_paths=100,
            horizon_quarters=4,
            spot_rate=spot,
            mu=0.015
        )
        assert np.allclose(paths[:, 0], spot)
    
    def test_garch_positive_values(self):
        """Test all values positive"""
        paths = generate_garch_paths(
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            mu=0.015
        )
        assert np.all(paths > 0)


class TestGenerateFXPaths:
    """Test main interface function"""
    
    def test_generate_fx_paths_gbm(self):
        """Test GBM model selection"""
        paths = generate_fx_paths(
            model="gbm",
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            sigma_annual=0.08
        )
        assert paths.shape == (100, 5)
    
    def test_generate_fx_paths_regime(self):
        """Test regime model selection"""
        paths = generate_fx_paths(
            model="regime",
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            sigma_annual=0.08
        )
        assert paths.shape == (100, 5)
    
    def test_generate_fx_paths_jump(self):
        """Test jump-diffusion model selection"""
        paths = generate_fx_paths(
            model="jump",
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            sigma_annual=0.08
        )
        assert paths.shape == (100, 5)
    
    def test_generate_fx_paths_garch(self):
        """Test GARCH model selection"""
        paths = generate_fx_paths(
            model="garch",
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            sigma_annual=0.08
        )
        assert paths.shape == (100, 5)
    
    def test_drift_mode_zero(self):
        """Test zero drift mode"""
        paths = generate_fx_paths(
            model="gbm",
            n_paths=1000,
            horizon_quarters=4,
            spot_rate=83.0,
            sigma_annual=0.08,
            drift_mode="zero"
        )
        
        # Mean should be close to spot with zero drift
        final_mean = np.mean(paths[:, -1])
        assert abs(final_mean / 83.0 - 1.0) < 0.05  # Within 5%
    
    def test_drift_mode_custom(self):
        """Test custom drift mode"""
        paths = generate_fx_paths(
            model="gbm",
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            sigma_annual=0.08,
            drift_mode="custom",
            custom_drift=0.10
        )
        assert paths.shape == (100, 5)
    
    def test_invalid_model_raises_error(self):
        """Test invalid model name raises ValueError"""
        with pytest.raises(ValueError):
            generate_fx_paths(
                model="invalid_model",
                n_paths=100,
                horizon_quarters=4,
                spot_rate=83.0,
                sigma_annual=0.08
            )
    
    def test_reproducibility_with_seed(self):
        """Test same seed produces same results"""
        paths1 = generate_fx_paths(
            model="gbm",
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            sigma_annual=0.08,
            seed=42
        )
        
        paths2 = generate_fx_paths(
            model="gbm",
            n_paths=100,
            horizon_quarters=4,
            spot_rate=83.0,
            sigma_annual=0.08,
            seed=42
        )
        
        assert np.allclose(paths1, paths2)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
