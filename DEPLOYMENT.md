# 🚀 VolatiSense Deployment Guide

This guide covers deploying VolatiSense to various platforms.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Environment Configuration](#environment-configuration)
6. [CI/CD Setup](#cicd-setup)

---

## Prerequisites

- **Docker** (v20.10+) and Docker Compose (v2.0+)
- **Node.js** (v18+) and npm
- **Python** (v3.11+)
- **Git** for version control

---

## Local Development

### Quick Start
```bash
# Clone repository
git clone https://github.com/yourusername/FX.git
cd FX

# Run automated setup
chmod +x quickstart.sh
./quickstart.sh
```

### Manual Setup

#### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
→ API available at http://localhost:8000

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
→ UI available at http://localhost:3000

---

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000

### Individual Containers

#### Backend
```bash
cd backend
docker build -t volatisense-backend .
docker run -d -p 8000:8000 \
  -e ENVIRONMENT=production \
  --name volatisense-api \
  volatisense-backend
```

#### Frontend
```bash
cd frontend
docker build -t volatisense-frontend .
docker run -d -p 80:80 \
  -e VITE_API_URL=http://localhost:8000 \
  --name volatisense-ui \
  volatisense-frontend
```

---

## Cloud Deployment

### Option 1: Render (Backend) + Vercel (Frontend)

#### Backend on Render

1. **Create account** at https://render.com
2. **New Web Service** → Connect Git repository
3. **Configuration:**
   ```
   Name: volatisense-api
   Environment: Python 3.11
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. **Environment Variables:**
   ```
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```
5. Deploy! URL: `https://volatisense-api.onrender.com`

#### Frontend on Vercel

1. **Create account** at https://vercel.com
2. **Import Git repository**
3. **Configuration:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
4. **Environment Variables:**
   ```
   VITE_API_URL=https://volatisense-api.onrender.com
   ```
5. Deploy! URL: `https://volatisense.vercel.app`

---

### Option 2: AWS (Full Stack)

#### Backend on AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init -p python-3.11 volatisense-api

# Create environment
eb create volatisense-prod

# Deploy
eb deploy

# Open in browser
eb open
```

#### Frontend on AWS S3 + CloudFront

```bash
# Build frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://volatisense-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

### Option 3: Google Cloud Platform

#### Backend on Cloud Run

```bash
# Build and push to GCR
cd backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/volatisense-backend

# Deploy to Cloud Run
gcloud run deploy volatisense-api \
  --image gcr.io/YOUR_PROJECT_ID/volatisense-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ENVIRONMENT=production
```

#### Frontend on Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
cd frontend
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

---

### Option 4: Kubernetes (Production Scale)

```bash
# Apply configurations
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml

# Check status
kubectl get pods -n volatisense
kubectl get services -n volatisense
```

See `/k8s` folder for Kubernetes manifests.

---

## Environment Configuration

### Backend (.env)

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
ENVIRONMENT=production
DEBUG=False
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=https://your-frontend-domain.com
LOG_LEVEL=INFO
```

### Frontend (.env)

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```env
VITE_API_URL=https://your-backend-api.com
VITE_APP_NAME=VolatiSense
VITE_ENABLE_ANALYTICS=true
```

---

## CI/CD Setup

### GitHub Actions (Automated)

1. **Set up secrets** in GitHub repository settings:
   ```
   DOCKER_USERNAME
   DOCKER_PASSWORD
   RENDER_DEPLOY_HOOK_BACKEND
   VERCEL_TOKEN
   VERCEL_ORG_ID
   VERCEL_PROJECT_ID
   ```

2. **Push to main branch** → Automatic deployment
   - Runs tests
   - Builds Docker images
   - Deploys to production

### Manual Deployment Triggers

```bash
# Trigger backend deployment
curl -X POST https://api.render.com/deploy/srv-xxxxx?key=YOUR_KEY

# Trigger frontend deployment
cd frontend
vercel --prod
```

---

## Health Checks

### Backend
```bash
curl http://localhost:8000/
# Response: {"status": "healthy", "message": "VolatiSense API"}
```

### Frontend
```bash
curl http://localhost:3000/health
# Response: healthy
```

### Docker
```bash
docker ps
# Check HEALTH status
```

---

## Monitoring & Logs

### View Backend Logs
```bash
# Docker
docker logs -f volatisense-api

# Kubernetes
kubectl logs -f deployment/backend -n volatisense

# Render
render logs -s volatisense-api --tail 100
```

### View Frontend Logs
```bash
# Vercel
vercel logs YOUR_DEPLOYMENT_URL

# Docker
docker logs -f volatisense-ui
```

---

## Performance Optimization

### Backend
- Enable **Gunicorn** with multiple workers:
  ```bash
  gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
  ```
- Use **Redis** for caching simulation results
- Implement **database connection pooling**

### Frontend
- Enable **Brotli compression** in nginx
- Use **CDN** for static assets
- Implement **lazy loading** for routes
- Enable **service worker** for offline support

---

## Scaling

### Horizontal Scaling
```bash
# Docker Compose
docker-compose up -d --scale backend=3

# Kubernetes
kubectl scale deployment backend --replicas=5 -n volatisense
```

### Load Balancing
- Use **nginx** or **HAProxy** for load balancing
- Configure **AWS Application Load Balancer**
- Use **Google Cloud Load Balancer**

---

## Security

### SSL/TLS Certificates
```bash
# Let's Encrypt (Certbot)
certbot --nginx -d volatisense.yourdomain.com

# Cloudflare (Free SSL)
# Enable SSL/TLS in Cloudflare dashboard
```

### Firewall Rules
```bash
# Allow only necessary ports
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw allow 22/tcp   # SSH
ufw enable
```

### Environment Security
- Never commit `.env` files
- Use **secrets management** (AWS Secrets Manager, GCP Secret Manager)
- Rotate API keys regularly
- Enable **2FA** on cloud accounts

---

## Troubleshooting

### Backend won't start
```bash
# Check logs
docker logs volatisense-api

# Common issues:
# - Missing dependencies: pip install -r requirements.txt
# - Port conflict: Change API_PORT in .env
# - CORS errors: Update CORS_ORIGINS
```

### Frontend build fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

### Database connection errors
```bash
# Check database is running
docker ps | grep postgres

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

---

## Rollback Procedures

### Docker
```bash
# List images
docker images

# Rollback to previous version
docker run -d -p 8000:8000 volatisense-backend:previous-tag
```

### Vercel
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote DEPLOYMENT_URL
```

### Kubernetes
```bash
# Rollback deployment
kubectl rollout undo deployment/backend -n volatisense

# Check rollout status
kubectl rollout status deployment/backend -n volatisense
```

---

## Cost Optimization

### Free Tier Options
- **Render**: Free tier for backend (with sleep on inactivity)
- **Vercel**: Free tier for frontend (100GB bandwidth/month)
- **Supabase**: Free PostgreSQL database
- **Cloudflare**: Free CDN and SSL

### Paid Recommendations
- **Backend**: AWS EC2 t3.medium ($30/month) or Render Standard ($7/month)
- **Frontend**: Vercel Pro ($20/month) or Netlify Pro ($19/month)
- **Database**: AWS RDS t3.micro ($15/month)

---

## Support

- **Documentation**: `/README.md`, `/IMPLEMENTATION_SUMMARY.md`
- **Issues**: https://github.com/yourusername/FX/issues
- **Email**: support@volatisense.com

---

**🎉 Happy Deploying!**
