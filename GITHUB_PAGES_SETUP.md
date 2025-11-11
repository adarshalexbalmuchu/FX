# GitHub Pages Deployment Guide

## What Was Fixed

The 404 errors for assets like `react-vendor-*.js`, `chart-vendor-*.js`, etc. were caused by a mismatch between:
- Where Vite built the assets to be served from (root `/`)
- Where GitHub Pages serves them from (under `/FX/` subpath)

## Changes Made

### 1. **Updated `frontend/index.html`**
- Changed asset paths from absolute (`/vite.svg`) to relative (`vite.svg`)
- This allows Vite's `base` configuration to properly prefix paths

### 2. **Added `build:gh` npm script** (`frontend/package.json`)
```json
"build:gh": "cross-env GITHUB_PAGES=true npm run build"
```
- Sets `GITHUB_PAGES=true` environment variable during build
- This triggers the base path `/FX/` in `vite.config.ts`

### 3. **Added `cross-env` package**
- Enables cross-platform environment variable setting
- Works on Windows, macOS, and Linux

### 4. **Created GitHub Actions Workflow** (`.github/workflows/gh-pages.yml`)
- Automatically builds and deploys on push to `main`
- Uses `npm run build:gh` to build with correct base path
- Deploys `frontend/dist` to `gh-pages` branch

## How It Works

1. **Push to `main`** triggers the GitHub Actions workflow
2. **Workflow installs** dependencies with `npm ci`
3. **Builds with** `GITHUB_PAGES=true` → Vite uses `base: '/FX/'`
4. **All asset URLs** in the build output use `/FX/` prefix
5. **Deploys to** `gh-pages` branch
6. **GitHub Pages** serves from `https://adarshalexbalmuchu.github.io/FX/`

## Verify Deployment

### 1. Check GitHub Actions
Visit: https://github.com/adarshalexbalmuchu/FX/actions

- Look for "Deploy Frontend to GitHub Pages" workflow
- Should show green checkmark when complete (takes ~2-3 minutes)

### 2. Enable GitHub Pages (if not already)
Go to: https://github.com/adarshalexbalmuchu/FX/settings/pages

- **Source**: Deploy from a branch
- **Branch**: `gh-pages` / `(root)`
- Click **Save**

### 3. Visit Your Site
After workflow completes: https://adarshalexbalmuchu.github.io/FX/

## Local Development

### Development Server (with API proxy)
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000 with /api proxy to backend
```

### Build for GitHub Pages (local test)
```bash
cd frontend
npm run build:gh
# Output in frontend/dist/ with /FX/ base paths
```

### Preview Production Build Locally
```bash
cd frontend
npm run build:gh
npm run preview
# Note: preview serves from root, not /FX/, so routing may differ
```

## Troubleshooting

### Assets still 404 after deploy?

1. **Check the workflow succeeded**
   - Visit https://github.com/adarshalexbalmuchu/FX/actions
   - Ensure latest run has green checkmark

2. **Verify gh-pages branch exists**
   ```bash
   git fetch origin
   git branch -r | grep gh-pages
   ```

3. **Check GitHub Pages settings**
   - Go to repo Settings → Pages
   - Should show: "Your site is live at https://adarshalexbalmuchu.github.io/FX/"

4. **Hard refresh browser**
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (macOS)

### Want to use custom domain instead of /FX/?

Edit `vite.config.ts`:
```typescript
base: '/',  // Instead of process.env.GITHUB_PAGES check
```

Then rebuild and add CNAME file to `frontend/public/`.

## Files Modified

- `frontend/index.html` - Relative asset paths
- `frontend/package.json` - Added `build:gh` script and `cross-env`
- `frontend/Dockerfile` - Added build arg (not used for Pages deployment)
- `.github/workflows/gh-pages.yml` - New CI/CD workflow

## Next Steps

1. Wait for GitHub Actions workflow to complete (~2-3 min)
2. Check https://adarshalexbalmuchu.github.io/FX/
3. If backend API needed, configure CORS or use separate API hosting
