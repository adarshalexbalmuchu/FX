# RENDER DASHBOARD SETTINGS - EXACT CONFIGURATION

## Service: volatisense-api
**URL:** https://dashboard.render.com/web/srv-d49hca8dl3ps739kd35g

---

## SETTINGS TAB

### Basic Settings
- **Name:** volatisense-api
- **Region:** Oregon (US West)
- **Branch:** main
- **Root Directory:** *(LEAVE EMPTY - DO NOT SET)*

### Build & Deploy
**Build Command:**
```bash
pip install --upgrade pip setuptools wheel && pip install -r backend/requirements.txt
```

**Start Command:**
```bash
cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Advanced
- **Auto-Deploy:** Yes (Enable)
- **Build Filters:** *(Leave default)*

---

## ENVIRONMENT TAB

Add these environment variables:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11.9` |
| `ENVIRONMENT` | `production` |
| `CORS_ORIGINS` | `https://adarshalexbalmuchu.github.io` |
| `PYTHONUNBUFFERED` | `1` |

---

## WHY YOU'RE GETTING ERRORS

### Current Problem:
1. ❌ Build command is: `pip install -r requirements.txt`
   - Should be: `pip install -r backend/requirements.txt`
   
2. ❌ Deploying old commit: `1417056c`
   - Should be: `88a8eb03` (latest)
   
3. ❌ Root Directory might be set to `backend`
   - Should be: *(empty)* - Let build command handle it

4. ❌ PYTHON_VERSION not set in dashboard
   - Should be: `3.11.9`

### What's Happening:
- Render is ignoring your `render.yaml` file
- Using old manual configuration from dashboard
- Old commit doesn't have `runtime.txt` in root
- Build command looking in wrong directory

---

## IMMEDIATE FIX - DO THIS NOW:

### Fix 1: Update Build Command (CRITICAL)
```
Settings → Build Command → Change to:
pip install --upgrade pip setuptools wheel && pip install -r backend/requirements.txt
```

### Fix 2: Clear Root Directory (CRITICAL)
```
Settings → Root Directory → DELETE the value (make it empty)
```

### Fix 3: Add Python Version (CRITICAL)
```
Environment → Add Variable:
PYTHON_VERSION = 3.11.9
```

### Fix 4: Deploy Latest Commit (CRITICAL)
```
Manual Deploy → Select commit 88a8eb03 → Deploy
```

---

## VERIFICATION

After deploying, check build logs for:
- ✅ `Using Python version 3.11.9` (not 3.13!)
- ✅ `pip install -r backend/requirements.txt` (not just requirements.txt)
- ✅ `Successfully installed pandas-2.1.4`
- ✅ `Your service is live`

---

## IF STILL FAILS

### Nuclear Option: Delete & Recreate Service

1. **Export your environment variables** (write them down)
2. Delete the service completely
3. Create new service:
   - Select GitHub repo: adarshalexbalmuchu/FX
   - Branch: main
   - Root Directory: *(leave empty)*
   - Build Command: `pip install --upgrade pip setuptools wheel && pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add all environment variables
   - Deploy

This will force Render to read runtime.txt from scratch.
