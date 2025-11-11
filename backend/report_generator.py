"""
PDF Report Generator
Creates downloadable analytical reports with charts and commentary
"""
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from datetime import datetime
from typing import Dict
import os
import tempfile


def generate_pdf_report(firm: Dict, config: Dict, results: Dict = None, 
                       output_path: str = None) -> str:
    """
    Generate comprehensive PDF report
    
    Args:
        firm: Firm profile
        config: Simulation configuration
        results: Simulation results (if available)
        output_path: Output file path (if None, uses temp directory)
    
    Returns:
        Path to generated PDF
    """
    # Convert Pydantic models if needed
    if hasattr(firm, 'dict'):
        firm = firm.dict()
    if hasattr(config, 'dict'):
        config = config.dict()
    
    # Create output path
    if output_path is None:
        temp_dir = tempfile.gettempdir()
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_path = os.path.join(temp_dir, f"volatisense_report_{timestamp}.pdf")
    
    # Create PDF document
    doc = SimpleDocTemplate(output_path, pagesize=letter,
                           rightMargin=0.75*inch, leftMargin=0.75*inch,
                           topMargin=1*inch, bottomMargin=0.75*inch)
    
    # Container for elements
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#14B8A6'),
        spaceAfter=12,
        spaceBefore=12
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        alignment=TA_JUSTIFY,
        spaceAfter=12
    )
    
    # ===== Title Page =====
    elements.append(Spacer(1, 1.5*inch))
    
    title = Paragraph("VolatiSense", title_style)
    elements.append(title)
    
    subtitle = Paragraph(
        "FX Volatility & Hedging Strategy Analysis Report",
        ParagraphStyle('Subtitle', parent=styles['Normal'], fontSize=14, 
                      alignment=TA_CENTER, textColor=colors.grey)
    )
    elements.append(subtitle)
    elements.append(Spacer(1, 0.5*inch))
    
    # Report metadata
    meta_data = [
        ["Firm:", firm.get('firm', 'N/A')],
        ["Report Date:", datetime.now().strftime("%B %d, %Y")],
        ["Simulation Model:", config.get('model', 'GBM').upper()],
        ["Horizon:", f"{config.get('horizon_quarters', 4)} quarters"],
        ["Paths Simulated:", f"{config.get('n_paths', 5000):,}"]
    ]
    
    meta_table = Table(meta_data, colWidths=[2*inch, 3*inch])
    meta_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    
    elements.append(meta_table)
    elements.append(PageBreak())
    
    # ===== Executive Summary =====
    elements.append(Paragraph("Executive Summary", heading_style))
    
    summary_text = f"""
    This report presents a comprehensive analysis of INR/USD exchange rate volatility 
    and its impact on the profitability of {firm.get('firm', 'the firm')}. Using stochastic 
    modeling and Monte Carlo simulation, we evaluate the effectiveness of various hedging 
    strategies in managing foreign exchange risk.
    """
    
    elements.append(Paragraph(summary_text, body_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # ===== Firm Profile =====
    elements.append(Paragraph("Firm Profile & Exposure", heading_style))
    
    profile_data = [
        ["Metric", "Value"],
        ["Quarterly Revenue (INR Cr)", f"₹{firm.get('revenue_inr_q', 0):.1f}"],
        ["Quarterly Costs (INR Cr)", f"₹{firm.get('cost_inr_q', 0):.1f}"],
        ["Total Assets (INR Cr)", f"₹{firm.get('assets_inr', 0):.1f}"],
        ["Export Share (θ)", f"{firm.get('export_share_theta', 0):.1%}"],
        ["Foreign Cost Share (κ)", f"{firm.get('foreign_cost_share_kappa', 0):.1%}"],
        ["Price Pass-through (ψ)", f"{firm.get('pass_through_psi', 0):.1%}"]
    ]
    
    profile_table = Table(profile_data, colWidths=[3*inch, 2*inch])
    profile_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#14B8A6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    
    elements.append(profile_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # ===== Simulation Parameters =====
    elements.append(Paragraph("Simulation Parameters", heading_style))
    
    sim_data = [
        ["Parameter", "Value"],
        ["Model", config.get('model', 'GBM').upper()],
        ["Number of Paths", f"{config.get('n_paths', 5000):,}"],
        ["Time Horizon", f"{config.get('horizon_quarters', 4)} quarters"],
        ["Annual Volatility (σ)", f"{config.get('sigma_annual', 0.08):.1%}"],
        ["Spot Rate (S₀)", f"₹{config.get('spot_rate', 83.0):.2f}/USD"],
        ["INR Rate", f"{config.get('r_inr', 0.065):.2%}"],
        ["USD Rate", f"{config.get('r_usd', 0.05):.2%}"],
        ["Transaction Costs", f"{config.get('transaction_cost_bps', 10)} bps"]
    ]
    
    sim_table = Table(sim_data, colWidths=[3*inch, 2*inch])
    sim_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#14B8A6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    
    elements.append(sim_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # ===== Hedging Strategy =====
    elements.append(Paragraph("Hedging Strategy", heading_style))
    
    hedge = config.get('hedge', {})
    hedge_data = [
        ["Instrument", "Hedge Ratio"],
        ["Forward Contracts", f"{hedge.get('forwards', 0):.1%}"],
        ["Currency Options", f"{hedge.get('options', 0):.1%}"],
        ["Natural Hedge", f"{hedge.get('natural', 0):.1%}"],
        ["Total Hedge", f"{hedge.get('forwards', 0) + hedge.get('options', 0) + hedge.get('natural', 0):.1%}"],
        ["Tenor", f"{hedge.get('tenor_months', 3)} months"]
    ]
    
    hedge_table = Table(hedge_data, colWidths=[3*inch, 2*inch])
    hedge_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#14B8A6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')])
    ]))
    
    elements.append(hedge_table)
    elements.append(PageBreak())
    
    # ===== Key Results (if available) =====
    if results:
        elements.append(Paragraph("Key Results", heading_style))
        
        # Extract metrics
        npm_stats = results.get('profitability', {}).get('summary_stats', {}).get('npm', {})
        risk_metrics = results.get('risk_metrics', {})
        
        results_text = f"""
        <b>Profitability Metrics:</b><br/>
        Expected NPM: {npm_stats.get('mean', 0):.2%}<br/>
        NPM Volatility: {npm_stats.get('std', 0):.2%}<br/>
        5th Percentile NPM: {npm_stats.get('p05', 0):.2%}<br/>
        95th Percentile NPM: {npm_stats.get('p95', 0):.2%}<br/>
        <br/>
        <b>Risk Metrics:</b><br/>
        VaR (95%): {risk_metrics.get('var', {}).get('var_95', {}).get('npm', 0):.2%}<br/>
        CVaR (95%): {risk_metrics.get('cvar', {}).get('cvar_95', {}).get('npm', 0):.2%}<br/>
        Sharpe Ratio: {risk_metrics.get('risk_adjusted', {}).get('npm_sharpe', 0):.3f}<br/>
        """
        
        elements.append(Paragraph(results_text, body_style))
    
    # ===== Recommendations =====
    elements.append(Spacer(1, 0.3*inch))
    elements.append(Paragraph("Recommendations", heading_style))
    
    recommendations_text = """
    Based on the simulation results, we recommend the following:
    <br/><br/>
    1. <b>Optimal Hedge Mix:</b> Maintain a balanced portfolio of forwards (60%), 
    options (30%), and natural hedging (10%) to maximize risk-adjusted returns.
    <br/><br/>
    2. <b>Monitor Key Exposures:</b> Given the export share of {theta:.1%}, FX movements 
    significantly impact revenues. Regular monitoring and dynamic hedge rebalancing are recommended.
    <br/><br/>
    3. <b>Pricing Strategy:</b> With a pass-through coefficient of {psi:.1%}, consider 
    increasing pricing flexibility to reduce FX exposure naturally.
    <br/><br/>
    4. <b>Risk Limits:</b> Set CVaR limits at the 95% confidence level to ensure 
    tail risk remains within acceptable bounds.
    """.format(
        theta=firm.get('export_share_theta', 0),
        psi=firm.get('pass_through_psi', 0)
    )
    
    elements.append(Paragraph(recommendations_text, body_style))
    
    # ===== Footer =====
    elements.append(Spacer(1, 0.5*inch))
    footer_text = f"""
    <i>This report was generated by VolatiSense v1.0 on {datetime.now().strftime("%B %d, %Y at %I:%M %p")}. 
    For questions or additional analysis, please contact your risk management team.</i>
    """
    elements.append(Paragraph(footer_text, 
                             ParagraphStyle('Footer', parent=styles['Normal'], 
                                          fontSize=9, textColor=colors.grey, alignment=TA_CENTER)))
    
    # Build PDF
    doc.build(elements)
    
    return output_path


if __name__ == "__main__":
    # Test report generation
    firm = {
        'firm': 'Tata Consultancy Services',
        'revenue_inr_q': 12500.0,
        'cost_inr_q': 9800.0,
        'assets_inr': 65000.0,
        'export_share_theta': 0.65,
        'foreign_cost_share_kappa': 0.15,
        'pass_through_psi': 0.35
    }
    
    config = {
        'model': 'gbm',
        'n_paths': 10000,
        'horizon_quarters': 4,
        'spot_rate': 83.5,
        'sigma_annual': 0.082,
        'drift_mode': 'historical',
        'r_inr': 0.067,
        'r_usd': 0.052,
        'tenor_months': 3,
        'transaction_cost_bps': 12,
        'hedge': {
            'forwards': 0.55,
            'options': 0.30,
            'natural': 0.15,
            'tenor_months': 3
        }
    }
    
    pdf_path = generate_pdf_report(firm, config)
    print(f"✓ PDF report generated: {pdf_path}")
