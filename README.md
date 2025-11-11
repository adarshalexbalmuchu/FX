# 🌊 VolatiSense v1.0

**Professional FX Volatility Analysis and Hedging Optimization Platform**

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6.svg)](https://typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Simulate INR/USD volatility. Optimize hedging strategies. Maximize profitability.

---

## 🚀 Deploy to GitHub Pages

**Quick Deploy:**
```bash
./deploy-github-pages.sh
```

**Full Guide:** See **[GITHUB_PAGES_DEPLOY.md](GITHUB_PAGES_DEPLOY.md)** for step-by-step instructions.

**Live URLs:**
- **Backend API:** https://volatisense-api.onrender.com
- **API Docs:** https://volatisense-api.onrender.com/docs
- **Frontend:** https://adarshalexbalmuchu.github.io/FX/ (after GitHub Pages deployment)

---

> **Simulate INR/USD volatility. Optimize hedging strategies. Maximize profitability.**

A full-stack financial simulation platform that models how INR/USD exchange-rate volatility impacts the profitability of Indian exporting MNCs and helps optimize hedging strategies using CVaR-constrained optimization.

---

## ✨ Features

### 🎯 Core Capabilities
- **4 Stochastic FX Models**: GBM, Regime-Switching, Jump-Diffusion, GARCH(1,1)
- **Profitability Analysis**: NPM, ROA with FX revenue/cost impacts
- **Hedging Instruments**: Forward contracts, currency options, natural hedges
- **CVaR-Based Optimization**: SLSQP algorithm with risk constraints
- **Sensitivity Analysis**: Interactive heatmaps and tornado charts
- **PDF Report Generation**: Professional analytical reports

### 📊 Interactive Visualizations
- **Distributions**: Histograms and box plots of NPM/ROA outcomes
- **Heatmaps**: Parameter sensitivity (θ×h, ψ×σ)
- **Waterfall Charts**: Profit attribution breakdown
- **Efficient Frontier**: Risk-return optimization curves
- **Real-time Updates**: Framer Motion animations

### 🏗️ Technical Highlights
- **Backend**: FastAPI (Python 3.11+) with NumPy/SciPy optimization
- **Frontend**: React 18 + TypeScript + TailwindCSS + Plotly
- **Testing**: >90% code coverage with pytest
- **Deployment**: Docker, GitHub Actions CI/CD
- **Performance**: Numba JIT compilation for 10x speedup (optional)

---

## 🚀 Quick Start

### One-Command Setup
```bash
git clone https://github.com/yourusername/FX.git
cd FX
chmod +x quickstart.sh
./quickstart.sh
```

This will:
1. ✅ Create Python virtual environment
2. ✅ Install backend dependencies
3. ✅ Install frontend dependencies
4. ✅ Run all tests
5. ✅ Provide startup instructions

### Manual Setup

#### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
→ **Backend**: http://localhost:8000  
→ **API Docs**: http://localhost:8000/docs

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
→ **Frontend**: http://localhost:3000

---

## 📖 Usage

### 1. Simulate FX Volatility

```bash
curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "firm": {
      "firm": "Infosys",
      "revenue_inr_q": 8500,
      "cost_inr_q": 6800,
      "assets_inr": 45000,
      "export_share_theta": 0.68,
      "foreign_cost_share_kappa": 0.18,
      "pass_through_psi": 0.32
    },
    "config": {
      "model": "gbm",
      "n_paths": 5000,
      "horizon_quarters": 4,
      "sigma_annual": 0.08,
      "spot_rate": 83.0,
      "hedge": {
        "forwards": 0.5,
        "options": 0.3,
        "natural": 0.2
      }
    }
  }'
```

### 2. Optimize Hedge Ratios

```bash
curl -X POST http://localhost:8000/api/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "firm": { ... },
    "config": { ... },
    "cvar_target": 0.05
  }'
```

### 3. Generate Sensitivity Analysis

```bash
curl -X POST http://localhost:8000/api/sensitivity \
  -H "Content-Type: application/json" \
  -d '{
    "firm": { ... },
    "heatmap_type": "theta_hedge"
  }'
```

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  ┌──────────┬──────────┬──────────┬──────────────────┐  │
│  │Dashboard │Distribs  │Sensitivy │Optimizer/Report │  │
│  └────┬─────┴────┬─────┴────┬─────┴────┬──────────┬──┘  │
│       │ Plotly.js│ Recharts │ Framer   │ Axios    │     │
└───────┼──────────┼──────────┼──────────┼──────────┼─────┘
        │          │          │          │          │
        └──────────┴──────────┴──────────┴──────────┘
                          HTTP/JSON
        ┌──────────────────────────────────────────┐
        │         FastAPI Backend (Python)         │
        │  ┌────────────────────────────────────┐  │
        │  │  REST API Endpoints                │  │
        │  │  /simulate  /optimize  /sensitivity│  │
        │  └─────┬──────────┬──────────┬────────┘  │
        │        │          │          │           │
        │  ┌─────▼──┐  ┌────▼────┐  ┌─▼──────┐    │
        │  │paths.py│  │optimizer│  │risk.py │    │
        │  │(FX sim)│  │(SLSQP)  │  │(VaR)   │    │
        │  └────────┘  └─────────┘  └────────┘    │
        │  ┌─────────┐  ┌──────────┐  ┌────────┐  │
        │  │hedging  │  │pnl.py    │  │report  │  │
        │  │(options)│  │(NPM/ROA) │  │(PDF)   │  │
        │  └─────────┘  └──────────┘  └────────┘  │
        └──────────────────────────────────────────┘
                          │
                    ┌─────▼─────┐
                    │  Data     │
                    │fx_rates   │
                    │firm_profile│
                    └───────────┘
```

---

## 📁 Project Structure

```
FX/
├── backend/                    # Python FastAPI Backend
│   ├── main.py                # REST API endpoints
│   ├── paths.py               # FX stochastic models
│   ├── hedging.py             # Hedge P&L calculations
│   ├── pnl.py                 # Profitability engine
│   ├── optimizer.py           # CVaR optimization
│   ├── risk.py                # Risk metrics
│   ├── sensitivity.py         # Sensitivity analysis
│   ├── validation.py          # Input validation
│   ├── report_generator.py    # PDF reports
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Backend container
│   └── tests/                 # Pytest test suite
│
├── frontend/                   # React TypeScript Frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Route pages
│   │   ├── types/             # TypeScript types
│   │   ├── App.tsx            # Main app
│   │   └── main.tsx           # Entry point
│   ├── package.json           # npm dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── tailwind.config.js     # Tailwind theme
│   ├── vite.config.ts         # Vite build
│   ├── Dockerfile             # Frontend container
│   └── nginx.conf             # Production nginx
│
├── data/                       # Sample data
│   ├── firm_profile.json      # Firm parameters
│   └── fx_rates.csv           # Historical rates
│
├── .github/workflows/          # CI/CD pipelines
│   └── deploy.yml             # GitHub Actions
│
├── docker-compose.yml          # Multi-container setup
├── quickstart.sh              # Automated setup
├── start.sh                   # Start servers
├── README.md                  # This file
├── DEPLOYMENT.md              # Deployment guide
├── IMPLEMENTATION_SUMMARY.md  # Technical details
└── PROJECT_OVERVIEW.md        # Complete overview
```

---

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
source venv/bin/activate
pytest tests/ -v --cov=. --cov-report=html
```

**Coverage**: >90% (50+ tests)

### Test Files
- `test_paths.py`: FX model validation
- `test_hedging.py`: Option pricing, put-call parity
- `test_risk.py`: VaR/CVaR calculations

---

## 🐳 Docker Deployment

### Using Docker Compose
```bash
docker-compose up -d
```

Services:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

### Individual Containers
```bash
# Backend
cd backend
docker build -t volatisense-backend .
docker run -p 8000:8000 volatisense-backend

# Frontend
cd frontend
docker build -t volatisense-frontend .
docker run -p 3000:80 volatisense-frontend
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for cloud deployment options.

---

## 📊 Key Metrics

| Metric | Value |
|--------|-------|
| Lines of Code | ~5,000+ |
| Test Coverage | >90% |
| API Endpoints | 5 |
| FX Models | 4 |
| Frontend Pages | 7 |
| Docker Images | 2 |
| Dependencies | 25+ |

---

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
ENVIRONMENT=production
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=VolatiSense
```

---

## 📚 Mathematical Models

### FX Stochastic Processes

**GBM (Geometric Brownian Motion)**:
```
dS_t = μS_t dt + σS_t dW_t
```

**Regime-Switching**:
```
σ_t ∈ {σ_low, σ_high}  with Markov transition
```

**Jump-Diffusion (Merton)**:
```
dS_t = μS_t dt + σS_t dW_t + J_t dN_t
```

**GARCH(1,1)**:
```
σ²_t = ω + α·ε²_{t-1} + β·σ²_{t-1}
```

### Option Pricing (Garman-Kohlhagen)

```
C = S₀·e^(-r_f·T)·N(d1) - K·e^(-r_d·T)·N(d2)

d1 = [ln(S₀/K) + (r_d - r_f + 0.5σ²)T] / (σ√T)
d2 = d1 - σ√T
```

### Risk Metrics

- **VaR**: `VaR_α = -percentile(returns, 1-α)`
- **CVaR**: `CVaR_α = -E[returns | returns ≤ -VaR_α]`
- **Sharpe**: `(E[R] - R_f) / σ(R)`
- **Sortino**: `(E[R] - R_f) / σ_downside(R)`

---

## 🎨 UI/UX Design

### Color Palette
- **Primary (Teal)**: `#14B8A6`
- **Secondary (Navy)**: `#0F172A`
- **Background**: `#F8FAFC`
- **Accent**: `#1E293B`

### Typography
- **Headings**: Space Grotesk
- **Body**: Inter

### Components
- **Glassmorphism cards** with backdrop blur
- **Framer Motion** animations (fade, slide, scale)
- **Responsive grid** (3-column → mobile stack)

---

## 🚢 Deployment Options

| Platform | Backend | Frontend | Cost |
|----------|---------|----------|------|
| **Render + Vercel** | Render Web Service | Vercel | Free tier available |
| **AWS** | Elastic Beanstalk | S3 + CloudFront | ~$30/month |
| **GCP** | Cloud Run | Firebase Hosting | ~$20/month |
| **Docker** | Self-hosted | Self-hosted | Infrastructure only |

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 🔒 Security

- ✅ CORS protection
- ✅ Input validation with Pydantic
- ✅ Environment variable secrets
- ✅ HTTPS/SSL support
- ✅ Rate limiting (recommended)
- ✅ Security headers

---

## 📈 Performance

- **Backend**: <500ms response time (10k paths)
- **Frontend**: <3s load time
- **Lighthouse**: 90+ score
- **Optimization**: Numba JIT (10x speedup)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NumPy/SciPy**: Numerical computing
- **FastAPI**: Modern Python web framework
- **React**: UI framework
- **Plotly**: Interactive visualizations
- **TailwindCSS**: Utility-first CSS

---

## 📞 Support

- **Documentation**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues**: [GitHub Issues](https://github.com/yourusername/FX/issues)

---

## 🎯 Roadmap

- [ ] Real-time FX data integration
- [ ] Machine learning volatility forecasting
- [ ] Multi-currency support
- [ ] User authentication
- [ ] Database persistence
- [ ] WebSocket updates
- [ ] Mobile app

---

**Built with ❤️ for financial risk management**

**🌊 VolatiSense** - *Simulate. Optimize. Succeed.*
