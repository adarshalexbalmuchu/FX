"""
VolatiSense Backend API
FastAPI application for FX volatility simulation and hedging optimization
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Literal
import uvicorn

from paths import generate_fx_paths
from hedging import calculate_hedge_pnl
from pnl import compute_profitability
from optimizer import optimize_hedge_ratio
from risk import calculate_risk_metrics
from validation import validate_simulation_params
from report_generator import generate_pdf_report

app = FastAPI(
    title="VolatiSense API",
    description="FX Volatility & Hedging Optimization Platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure based on deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============= Data Models =============

class FirmProfile(BaseModel):
    """Firm financial profile"""
    firm: str = Field(..., description="Company name")
    revenue_inr_q: float = Field(..., gt=0, description="Quarterly revenue in INR (millions)")
    cost_inr_q: float = Field(..., gt=0, description="Quarterly costs in INR (millions)")
    assets_inr: float = Field(..., gt=0, description="Total assets in INR (millions)")
    export_share_theta: float = Field(..., ge=0, le=1, description="Export revenue share (θ)")
    foreign_cost_share_kappa: float = Field(..., ge=0, le=1, description="Foreign cost share (κ)")
    pass_through_psi: float = Field(..., ge=0, le=1, description="Price pass-through coefficient (ψ)")


class HedgeConfig(BaseModel):
    """Hedging strategy configuration"""
    forwards: float = Field(0.0, ge=0, le=1, description="Forward contract ratio")
    options: float = Field(0.0, ge=0, le=1, description="Option hedge ratio")
    natural: float = Field(0.0, ge=0, le=1, description="Natural hedge ratio")
    tenor_months: int = Field(3, ge=1, le=12, description="Hedge tenor in months")


class SimulationConfig(BaseModel):
    """Simulation parameters"""
    model: Literal["gbm", "regime", "jump", "garch"] = Field(..., description="FX model type")
    n_paths: int = Field(5000, ge=100, le=20000, description="Number of simulation paths")
    horizon_quarters: int = Field(4, ge=1, le=20, description="Simulation horizon in quarters")
    sigma_annual: float = Field(0.08, gt=0, le=0.5, description="Annual volatility")
    drift_mode: Literal["historical", "zero", "custom"] = Field("historical", description="Drift calculation mode")
    custom_drift: Optional[float] = Field(None, description="Custom drift (if drift_mode=custom)")
    spot_rate: float = Field(83.0, gt=0, description="Current INR/USD spot rate")
    r_inr: float = Field(0.065, description="INR risk-free rate")
    r_usd: float = Field(0.05, description="USD risk-free rate")
    hedge: HedgeConfig = Field(default_factory=HedgeConfig)
    transaction_cost_bps: int = Field(10, ge=0, le=100, description="Transaction costs in basis points")


class SimulationRequest(BaseModel):
    """Complete simulation request"""
    firm: FirmProfile
    config: SimulationConfig


class OptimizationRequest(BaseModel):
    """Hedge optimization request"""
    firm: FirmProfile
    config: SimulationConfig
    target_cvar: Optional[float] = Field(None, description="Target CVaR threshold")
    objective: Literal["maximize_npm", "minimize_variance"] = Field("maximize_npm")


# ============= API Endpoints =============

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "VolatiSense API",
        "version": "1.0.0",
        "status": "operational"
    }


@app.post("/api/simulate")
async def simulate(request: SimulationRequest):
    """
    Run FX simulation and compute profitability metrics
    
    Returns:
        - FX paths
        - NPM and ROA distributions
        - Risk metrics (VaR, CVaR)
        - Hedge P&L breakdown
    """
    try:
        # Validate parameters
        validation_errors = validate_simulation_params(request.dict())
        if validation_errors:
            raise HTTPException(status_code=400, detail=validation_errors)
        
        # Generate FX paths
        fx_paths = generate_fx_paths(
            model=request.config.model,
            n_paths=request.config.n_paths,
            horizon_quarters=request.config.horizon_quarters,
            spot_rate=request.config.spot_rate,
            sigma_annual=request.config.sigma_annual,
            drift_mode=request.config.drift_mode,
            custom_drift=request.config.custom_drift,
            r_inr=request.config.r_inr,
            r_usd=request.config.r_usd
        )
        
        # Calculate hedge P&L
        hedge_pnl = calculate_hedge_pnl(
            fx_paths=fx_paths,
            spot_rate=request.config.spot_rate,
            hedge_config=request.config.hedge,
            r_inr=request.config.r_inr,
            r_usd=request.config.r_usd,
            sigma=request.config.sigma_annual,
            transaction_cost_bps=request.config.transaction_cost_bps
        )
        
        # Compute profitability
        profitability = compute_profitability(
            fx_paths=fx_paths,
            firm=request.firm,
            hedge_pnl=hedge_pnl
        )
        
        # Calculate risk metrics
        risk_metrics = calculate_risk_metrics(profitability)
        
        return {
            "success": True,
            "fx_paths": fx_paths.tolist(),
            "profitability": profitability,
            "risk_metrics": risk_metrics,
            "hedge_pnl": hedge_pnl
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/optimize")
async def optimize(request: OptimizationRequest):
    """
    Optimize hedge ratios using CVaR constraints
    
    Returns:
        - Optimal hedge mix
        - Expected NPM, ROA improvements
        - Efficient frontier data
    """
    try:
        # Run optimization
        result = optimize_hedge_ratio(
            firm=request.firm,
            config=request.config,
            target_cvar=request.target_cvar,
            objective=request.objective
        )
        
        return {
            "success": True,
            **result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/sensitivity")
async def sensitivity_analysis(request: SimulationRequest):
    """
    Perform sensitivity analysis on key parameters
    
    Returns heatmaps for:
        - Export share (θ) × Hedge ratio
        - Pass-through (ψ) × Volatility (σ)
    """
    try:
        from sensitivity import generate_sensitivity_heatmaps
        
        heatmaps = generate_sensitivity_heatmaps(
            firm=request.firm,
            config=request.config
        )
        
        return {
            "success": True,
            "heatmaps": heatmaps
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/report/generate")
async def generate_report(request: SimulationRequest):
    """
    Generate comprehensive PDF report
    
    Returns:
        PDF file with assumptions, visuals, and recommendations
    """
    try:
        pdf_path = generate_pdf_report(
            firm=request.firm,
            config=request.config
        )
        
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename="volatisense_report.pdf"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/presets")
async def get_presets():
    """
    Get predefined simulation presets
    """
    presets = {
        "conservative": {
            "description": "Low volatility, high hedging",
            "sigma_annual": 0.05,
            "hedge": {"forwards": 0.7, "options": 0.2, "natural": 0.1}
        },
        "moderate": {
            "description": "Medium volatility, balanced hedging",
            "sigma_annual": 0.08,
            "hedge": {"forwards": 0.5, "options": 0.3, "natural": 0.2}
        },
        "aggressive": {
            "description": "High volatility, minimal hedging",
            "sigma_annual": 0.12,
            "hedge": {"forwards": 0.2, "options": 0.1, "natural": 0.1}
        }
    }
    return presets


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
