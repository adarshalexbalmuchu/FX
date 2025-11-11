"""
Parameter Validation and Sanity Checks
Ensures simulation inputs are valid and outputs pass sanity tests
"""
from typing import Dict, List, Optional
import numpy as np


def validate_simulation_params(params: Dict) -> Optional[List[str]]:
    """
    Validate simulation parameters for correctness
    
    Args:
        params: Simulation request dictionary
    
    Returns:
        List of error messages, or None if valid
    """
    errors = []
    
    # Extract nested parameters
    firm = params.get('firm', {})
    config = params.get('config', {})
    
    # Firm validations
    if firm.get('revenue_inr_q', 0) <= 0:
        errors.append("Revenue must be positive")
    
    if firm.get('cost_inr_q', 0) <= 0:
        errors.append("Costs must be positive")
    
    if firm.get('cost_inr_q', 0) >= firm.get('revenue_inr_q', 1):
        errors.append("Costs cannot exceed revenue (would result in negative base profit)")
    
    if firm.get('assets_inr', 0) <= 0:
        errors.append("Assets must be positive")
    
    if not (0 <= firm.get('export_share_theta', 0.5) <= 1):
        errors.append("Export share (θ) must be between 0 and 1")
    
    if not (0 <= firm.get('foreign_cost_share_kappa', 0.2) <= 1):
        errors.append("Foreign cost share (κ) must be between 0 and 1")
    
    if not (0 <= firm.get('pass_through_psi', 0.3) <= 1):
        errors.append("Pass-through (ψ) must be between 0 and 1")
    
    # Config validations
    if config.get('n_paths', 0) < 100:
        errors.append("Number of paths must be at least 100")
    
    if config.get('n_paths', 0) > 20000:
        errors.append("Number of paths cannot exceed 20,000")
    
    if config.get('horizon_quarters', 0) < 1:
        errors.append("Horizon must be at least 1 quarter")
    
    if config.get('sigma_annual', 0) <= 0 or config.get('sigma_annual', 0) > 0.5:
        errors.append("Annual volatility must be between 0 and 0.5 (50%)")
    
    if config.get('spot_rate', 0) <= 0:
        errors.append("Spot rate must be positive")
    
    # Hedge validations
    hedge = config.get('hedge', {})
    if isinstance(hedge, dict):
        total_hedge = hedge.get('forwards', 0) + hedge.get('options', 0) + hedge.get('natural', 0)
        
        if total_hedge > 1.5:
            errors.append("Total hedge ratio should not exceed 1.5 (over-hedging)")
        
        if hedge.get('forwards', 0) < 0 or hedge.get('options', 0) < 0 or hedge.get('natural', 0) < 0:
            errors.append("Hedge ratios cannot be negative")
    
    if config.get('transaction_cost_bps', 0) < 0 or config.get('transaction_cost_bps', 0) > 100:
        errors.append("Transaction costs must be between 0 and 100 bps")
    
    return errors if errors else None


def sanity_test_volatility_impact(unhedged_result: Dict, hedged_result: Dict) -> Dict:
    """
    Sanity test: Higher volatility with no hedge should worsen CVaR
    
    Args:
        unhedged_result: Results with no hedging
        hedged_result: Results with hedging
    
    Returns:
        Test results dictionary
    """
    tests = {}
    
    # Test 1: Hedging should reduce CVaR
    unhedged_cvar = unhedged_result.get('risk_metrics', {}).get('cvar', {}).get('cvar_95', {}).get('npm', 0)
    hedged_cvar = hedged_result.get('risk_metrics', {}).get('cvar', {}).get('cvar_95', {}).get('npm', 0)
    
    tests['hedging_reduces_cvar'] = {
        'passed': hedged_cvar < unhedged_cvar,
        'unhedged_cvar': unhedged_cvar,
        'hedged_cvar': hedged_cvar,
        'improvement': unhedged_cvar - hedged_cvar
    }
    
    # Test 2: Hedging should reduce volatility
    unhedged_vol = unhedged_result.get('risk_metrics', {}).get('volatility', {}).get('npm', {}).get('total', 0)
    hedged_vol = hedged_result.get('risk_metrics', {}).get('volatility', {}).get('npm', {}).get('total', 0)
    
    tests['hedging_reduces_volatility'] = {
        'passed': hedged_vol < unhedged_vol,
        'unhedged_vol': unhedged_vol,
        'hedged_vol': hedged_vol,
        'reduction_pct': ((unhedged_vol - hedged_vol) / unhedged_vol * 100) if unhedged_vol > 0 else 0
    }
    
    return tests


def sanity_test_pass_through(low_psi_result: Dict, high_psi_result: Dict) -> Dict:
    """
    Sanity test: Higher pass-through (ψ→1) should shift exposure from FX revenue to pricing
    
    Args:
        low_psi_result: Results with low pass-through (e.g., 0.2)
        high_psi_result: Results with high pass-through (e.g., 0.8)
    
    Returns:
        Test results
    """
    tests = {}
    
    # Extract revenue volatility
    low_psi_vol = low_psi_result.get('risk_metrics', {}).get('volatility', {}).get('npm', {}).get('total', 0)
    high_psi_vol = high_psi_result.get('risk_metrics', {}).get('volatility', {}).get('npm', {}).get('total', 0)
    
    # Higher pass-through should reduce FX revenue impact, thus lower volatility
    tests['pass_through_reduces_fx_exposure'] = {
        'passed': high_psi_vol < low_psi_vol,
        'low_psi_volatility': low_psi_vol,
        'high_psi_volatility': high_psi_vol,
        'reduction': low_psi_vol - high_psi_vol
    }
    
    return tests


def sanity_test_model_outputs(fx_paths: np.ndarray, config: Dict) -> Dict:
    """
    Test FX path generation for statistical properties
    
    Args:
        fx_paths: Generated FX paths
        config: Configuration used
    
    Returns:
        Test results
    """
    tests = {}
    
    # Test 1: All paths should be positive
    tests['all_positive'] = {
        'passed': np.all(fx_paths > 0),
        'min_value': float(np.min(fx_paths)),
        'negative_count': int(np.sum(fx_paths <= 0))
    }
    
    # Test 2: Paths should start at spot rate
    spot_rate = config.get('spot_rate', 83.0)
    tests['correct_initial_value'] = {
        'passed': np.allclose(fx_paths[:, 0], spot_rate, rtol=1e-6),
        'expected': spot_rate,
        'actual_mean': float(np.mean(fx_paths[:, 0])),
        'actual_std': float(np.std(fx_paths[:, 0]))
    }
    
    # Test 3: Final volatility should be roughly consistent with input
    returns = np.diff(np.log(fx_paths), axis=1)
    annualized_vol = np.std(returns) * np.sqrt(4)  # Quarterly to annual
    target_vol = config.get('sigma_annual', 0.08)
    
    tests['volatility_reasonable'] = {
        'passed': abs(annualized_vol - target_vol) < target_vol * 0.5,  # Within 50%
        'target_volatility': target_vol,
        'realized_volatility': float(annualized_vol),
        'deviation_pct': float(abs(annualized_vol - target_vol) / target_vol * 100)
    }
    
    # Test 4: No extreme outliers (> 5 std deviations)
    final_values = fx_paths[:, -1]
    mean_final = np.mean(final_values)
    std_final = np.std(final_values)
    outliers = np.sum(np.abs(final_values - mean_final) > 5 * std_final)
    
    tests['no_extreme_outliers'] = {
        'passed': outliers < len(final_values) * 0.01,  # Less than 1%
        'outlier_count': int(outliers),
        'outlier_pct': float(outliers / len(final_values) * 100)
    }
    
    return tests


def run_comprehensive_validation(simulation_result: Dict, config: Dict) -> Dict:
    """
    Run comprehensive validation on simulation results
    
    Args:
        simulation_result: Complete simulation output
        config: Configuration used
    
    Returns:
        Validation report
    """
    validation_report = {
        'timestamp': None,
        'overall_passed': True,
        'tests': {}
    }
    
    # Test NPM values are reasonable
    npm_stats = simulation_result.get('profitability', {}).get('summary_stats', {}).get('npm', {})
    
    validation_report['tests']['npm_reasonable'] = {
        'passed': -1.0 < npm_stats.get('mean', 0) < 1.0,  # NPM should be between -100% and 100%
        'mean_npm': npm_stats.get('mean', 0),
        'description': 'NPM values should be realistic'
    }
    
    # Test ROA values are reasonable
    roa_stats = simulation_result.get('profitability', {}).get('summary_stats', {}).get('roa', {})
    
    validation_report['tests']['roa_reasonable'] = {
        'passed': -0.5 < roa_stats.get('mean', 0) < 0.5,  # ROA should be reasonable
        'mean_roa': roa_stats.get('mean', 0),
        'description': 'ROA values should be realistic'
    }
    
    # Test CVaR is worse than VaR
    cvar_95 = simulation_result.get('risk_metrics', {}).get('cvar', {}).get('cvar_95', {}).get('npm', 0)
    var_95 = simulation_result.get('risk_metrics', {}).get('var', {}).get('var_95', {}).get('npm', 0)
    
    validation_report['tests']['cvar_worse_than_var'] = {
        'passed': cvar_95 >= var_95,
        'cvar': cvar_95,
        'var': var_95,
        'description': 'CVaR should be >= VaR by definition'
    }
    
    # Update overall status
    validation_report['overall_passed'] = all(
        test['passed'] for test in validation_report['tests'].values()
    )
    
    return validation_report


if __name__ == "__main__":
    # Test validation
    test_params = {
        'firm': {
            'firm': 'Test',
            'revenue_inr_q': 1000,
            'cost_inr_q': 800,
            'assets_inr': 5000,
            'export_share_theta': 0.4,
            'foreign_cost_share_kappa': 0.2,
            'pass_through_psi': 0.3
        },
        'config': {
            'model': 'gbm',
            'n_paths': 5000,
            'horizon_quarters': 4,
            'sigma_annual': 0.08,
            'spot_rate': 83.0,
            'hedge': {'forwards': 0.5, 'options': 0.3}
        }
    }
    
    errors = validate_simulation_params(test_params)
    if errors:
        print("Validation errors:")
        for error in errors:
            print(f"  - {error}")
    else:
        print("✓ All validations passed")
