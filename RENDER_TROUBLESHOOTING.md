# Render Deployment Troubleshooting Guide

## Current Configuration

**Service URL:** https://volatisense-api.onrender.com
**Service ID:** srv-d49hca8dl3ps739kd35g
**Repository:** adarshalexbalmuchu/FX
**Branch:** main

## Files Configured

✅ `/runtime.txt` - Specifies Python 3.11.9
✅ `/backend/runtime.txt` - Backup runtime specification
✅ `/render.yaml` - Complete Render service configuration
✅ `/backend/requirements.txt` - Updated dependencies

## Python Version Fix

### Problem
Render was using Python 3.13.4, but pandas 2.1.x doesn't support Python 3.13 yet (Cython compilation errors).

### Solution Applied
1. Created `runtime.txt` with `python-3.11.9` in repository root
2. Created `render.yaml` with explicit `PYTHON_VERSION: 3.11.9`
3. Updated pandas from 2.1.3 to 2.1.4 (better Python 3.11 compatibility)
4. Removed matplotlib (not used in backend, only frontend needs charts)

## Render Dashboard Configuration

If the build still fails, manually configure in Render dashboard:

1. **Go to:** https://dashboard.render.com/web/srv-d49hca8dl3ps739kd35g

2. **Environment Tab:**
   Add these environment variables:
   ```
   PYTHON_VERSION = 3.11.9
   ENVIRONMENT = production
   CORS_ORIGINS = https://adarshalexbalmuchu.github.io
   PYTHONUNBUFFERED = 1
   ```

3. **Settings Tab:**
   - Build Command: `pip install --upgrade pip && pip install -r backend/requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Root Directory: `backend` (or leave blank if using cd command)

## Expected Build Process

1. Render clones repository from GitHub
2. Reads `runtime.txt` → installs Python 3.11.9
3. Runs build command → installs all dependencies
4. Pandas compiles successfully with Python 3.11
5. Starts uvicorn server on dynamic $PORT

## Verification After Deploy

Once deployed, test these endpoints:

1. **Health Check:**
   ```
   curl https://volatisense-api.onrender.com/
   ```
   Expected: `{"message": "VolatiSense API is running"}`

2. **API Documentation:**
   ```
   https://volatisense-api.onrender.com/docs
   ```
   Expected: FastAPI Swagger UI

3. **Test Simulation:**
   ```bash
   curl -X POST https://volatisense-api.onrender.com/api/simulate \
     -H "Content-Type: application/json" \
     -d '{
       "export_share": 0.4,
       "import_share": 0.3,
       "fx_volatility": 0.15,
       "hedge_ratio": 0.5
     }'
   ```

## Common Issues & Solutions

### Issue 1: Still using Python 3.13
**Solution:** Delete the service and recreate it, or contact Render support to clear cache

### Issue 2: Module not found errors
**Solution:** Verify `requirements.txt` is in `backend/` folder

### Issue 3: Port binding errors
**Solution:** Ensure start command uses `$PORT` variable (case-sensitive)

### Issue 4: CORS errors
**Solution:** Update `CORS_ORIGINS` to match your GitHub Pages URL exactly

## Deployment Command Summary

```bash
# Commit and push changes
git add -A
git commit -m "Update deployment configuration"
git push origin main

# Render will auto-deploy (if enabled) or manually trigger:
# Dashboard → Manual Deploy → Deploy latest commit
```

## Success Indicators

✅ Build logs show: "Installing Python 3.11.9"
✅ Build logs show: "Successfully installed pandas-2.1.4"
✅ Service status shows: "Live"
✅ Health endpoint responds with 200 OK
✅ /docs page loads successfully

## Support Resources

- Render Docs: https://render.com/docs
- Render Status: https://status.render.com
- Build Logs: Dashboard → Service → Logs tab
