# 🚀 FRESH START DEPLOYMENT GUIDE

Follow this guide step-by-step to deploy VolatiSense with a clean Render service.

---

## ⚠️ WHAT'S WRONG WITH CURRENT SETUP

The old Render service has:
- ❌ Cached Python 3.13 (can't change easily)
- ❌ Wrong Root Directory setting
- ❌ Old commit being deployed
- ❌ Conflicting configuration

**Solution:** Delete everything and start fresh!

---

## 📋 QUICK START (Copy-Paste Ready)

### 1. Delete Old Render Service
https://dashboard.render.com → Find `volatisense-api` → Settings → Delete Service

### 2. Create New Service
Click "New +" → Web Service → Connect GitHub: `adarshalexbalmuchu/FX`

### 3. Copy These EXACT Settings:

**Name:** `volatisense-backend`  
**Region:** Oregon (US West)  
**Branch:** `main`  
**Runtime:** Python 3  
**Root Directory:** `[LEAVE EMPTY]` ⚠️ CRITICAL!

**Build Command:**
```
pip install --upgrade pip setuptools wheel && pip install -r backend/requirements.txt
```

**Start Command:**
```
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Environment Variables (click "Advanced"):**
```
PYTHON_VERSION = 3.11.9
ENVIRONMENT = production  
CORS_ORIGINS = https://adarshalexbalmuchu.github.io
PYTHONUNBUFFERED = 1
```

### 4. Deploy & Wait
Click "Create Web Service" → Wait 3-5 minutes → Watch for "Your service is live 🎉"

### 5. Test Backend
```bash
# Replace YOUR-URL with actual Render URL
curl https://YOUR-URL.onrender.com/
curl https://YOUR-URL.onrender.com/docs
```

### 6. Update Frontend
Replace `YOUR-NEW-RENDER-URL` below, then run:
```bash
cd /workspaces/FX
sed -i 's|VITE_API_URL:.*|VITE_API_URL: YOUR-NEW-RENDER-URL|g' .github/workflows/github-pages.yml
git add .github/workflows/github-pages.yml
git commit -m "Update backend URL to new Render service"
git push origin main
```

### 7. Enable GitHub Pages
https://github.com/adarshalexbalmuchu/FX/settings/pages → Source: GitHub Actions

### 8. Open Your App!
https://adarshalexbalmuchu.github.io/FX/

---

## ✅ SUCCESS INDICATORS (in Build Logs)

```
✅ Installing Python version 3.11.9
✅ Successfully installed pandas-2.1.4
✅ Successfully installed fastapi-0.104.1
✅ Your service is live 🎉
```

## ❌ FAILURE INDICATORS (STOP if you see)

```
❌ Installing Python version 3.13
❌ pandas compilation error
❌ Root directory 'backend' not found
```

---

## 🎯 KEY POINTS

1. **Root Directory MUST be empty** - Don't put "backend" there!
2. **Build command handles the path** - `pip install -r backend/requirements.txt`
3. **Start command changes directory** - `cd backend && uvicorn ...`
4. **PYTHON_VERSION env var is critical** - Forces Python 3.11.9
5. **Fresh service = no cache** - Clean Python install

---

## 📞 NEED HELP?

Run the interactive guide:
```bash
chmod +x /workspaces/FX/fresh-deploy.sh
/workspaces/FX/fresh-deploy.sh
```

It will walk you through each step with prompts!

---

**Estimated Time:** 15-20 minutes total  
**Difficulty:** Easy (just copy-paste settings)  
**Success Rate:** 99% if you follow exactly ✅
