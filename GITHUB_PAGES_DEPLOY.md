# 🚀 GitHub Pages Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Deploy Backend (Choose One)

#### Option A: Render.com (Recommended - Free)
1. Go to https://render.com and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   ```
   Name: volatisense-api
   Root Directory: backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
5. Click **"Create Web Service"**
6. Wait 2-3 minutes for deployment
7. Copy your URL (e.g., `https://volatisense-api.onrender.com`)

#### Option B: Railway.app (Alternative)
1. Go to https://railway.app
2. Click **"Start a New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects Python and deploys
5. Copy your URL

#### Option C: PythonAnywhere (Free tier)
1. Go to https://www.pythonanywhere.com
2. Create account → **"Web"** tab → **"Add new web app"**
3. Choose **"Manual configuration"** → **"Python 3.11"**
4. Upload backend code via **"Files"** tab
5. Configure WSGI file to point to your FastAPI app

---

### Step 2: Deploy Frontend to GitHub Pages

#### Enable GitHub Pages
1. Go to your GitHub repository
2. **Settings** → **Pages** (left sidebar)
3. Under **"Build and deployment"**:
   - Source: **GitHub Actions**
4. That's it! The workflow will auto-deploy on push to `main`

#### Update Backend URL
Edit `.github/workflows/github-pages.yml`:
```yaml
- name: Build
  env:
    VITE_API_URL: https://YOUR-BACKEND-URL.onrender.com  # ← Change this
    GITHUB_PAGES: true
```

#### Push to GitHub
```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

The workflow will automatically:
1. Build your React app
2. Deploy to GitHub Pages
3. Your site will be live at: `https://yourusername.github.io/FX/`

---

## 📋 Configuration Checklist

### Backend (Render/Railway)
- [x] Environment variables set:
  ```
  ENVIRONMENT=production
  CORS_ORIGINS=https://yourusername.github.io
  ```
- [x] Health check endpoint working at `/`
- [x] API docs accessible at `/docs`

### Frontend (GitHub Pages)
- [x] `VITE_API_URL` in workflow points to backend
- [x] GitHub Pages source set to "GitHub Actions"
- [x] Base path set correctly in `vite.config.ts`

---

## 🔧 Local Testing Before Deploy

### Test Backend Locally
```bash
cd backend
source venv/bin/activate
python main.py
# Visit: http://localhost:8000/docs
```

### Test Frontend Build
```bash
cd frontend
npm run build
npm run preview
# Visit: http://localhost:4173
```

---

## 🌐 Custom Domain (Optional)

### For GitHub Pages:
1. Buy domain (Namecheap, Google Domains, etc.)
2. Add CNAME record:
   ```
   Type: CNAME
   Name: www
   Value: yourusername.github.io
   ```
3. In GitHub repo: **Settings** → **Pages** → **Custom domain**
4. Enter: `www.yourdomain.com`
5. Enable **"Enforce HTTPS"**

### Update Backend CORS:
```python
# In backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://www.yourdomain.com",
        "https://yourusername.github.io"
    ],
    ...
)
```

---

## 📊 Monitoring & Logs

### Backend Logs (Render)
```bash
# Via Render Dashboard:
# Services → volatisense-api → Logs tab
```

### Frontend Logs (GitHub Pages)
```bash
# Via GitHub:
# Actions tab → Select workflow run → View logs
```

---

## 🐛 Troubleshooting

### Frontend shows blank page
- Check browser console for errors
- Verify `base` path in `vite.config.ts` matches repo name
- Ensure `VITE_API_URL` is correct

### API calls fail (CORS errors)
- Check backend `CORS_ORIGINS` includes GitHub Pages URL
- Verify backend is running: visit `YOUR_BACKEND_URL/docs`
- Check browser Network tab for actual error

### GitHub Pages build fails
- Check Actions tab for error logs
- Verify `npm install` succeeds locally
- Ensure `package-lock.json` is committed

---

## 💰 Cost Breakdown

| Service | Tier | Cost | Limits |
|---------|------|------|--------|
| **GitHub Pages** | Free | $0/month | 100GB bandwidth/month, 1GB storage |
| **Render** | Free | $0/month | 750 hours/month, sleeps after 15min inactivity |
| **Railway** | Free | $0/month | $5 credit/month (~500 hours) |
| **Total** | - | **$0/month** | Perfect for demos/testing |

### Upgrade Options:
- **Render Standard**: $7/month (always on, no sleep)
- **Railway Pro**: $5/month (better limits)

---

## 🚀 Quick Deploy Commands

### Full Deployment (One-time setup)
```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# 2. Deploy backend to Render
# (Do this via Render dashboard - one-time setup)

# 3. Wait 2-3 minutes
# Frontend: https://yourusername.github.io/FX/
# Backend: https://volatisense-api.onrender.com
```

### Update Deployment (After changes)
```bash
# Just push to main - auto-deploys!
git add .
git commit -m "Update features"
git push origin main
```

---

## ✅ Post-Deployment Checklist

- [ ] Frontend loads at GitHub Pages URL
- [ ] Backend API accessible at `/docs`
- [ ] Dashboard page shows sample data
- [ ] Charts render correctly (Distributions, Sensitivities, etc.)
- [ ] Optimizer runs without errors
- [ ] No CORS errors in browser console
- [ ] Mobile responsive design works

---

## 📞 Support

**Frontend Issues:**
- Check: Actions tab in GitHub repo
- Logs: Click on failed workflow run

**Backend Issues:**
- Check: Render dashboard → Logs
- Test: Visit `/docs` endpoint directly

**General Help:**
- Review: `DEPLOYMENT.md` for Docker/other options
- Check: `README.md` for local development

---

## 🎉 You're Done!

Your VolatiSense app is now live:
- **Frontend**: `https://yourusername.github.io/FX/`
- **Backend**: `https://your-backend.onrender.com`
- **API Docs**: `https://your-backend.onrender.com/docs`

Share the link with others! 🌊
