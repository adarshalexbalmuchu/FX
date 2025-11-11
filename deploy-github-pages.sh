#!/bin/bash

# VolatiSense - GitHub Pages Deployment Helper

echo "🌊 VolatiSense - GitHub Pages Deployment"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if on main branch
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  Warning: You're on branch '$BRANCH', not 'main'${NC}"
    echo "GitHub Pages deploys from 'main' branch"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${BLUE}Step 1: Testing Frontend Build${NC}"
echo "================================"
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Test build
echo "Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend build successful${NC}"
echo ""

cd ..

echo -e "${BLUE}Step 2: Running Backend Tests${NC}"
echo "================================"
cd backend

if [ -d "venv" ]; then
    source venv/bin/activate
    pytest tests/ -v --tb=short
    
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠️  Some tests failed. Continue anyway? (y/n)${NC}"
        read -p "" -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo -e "${GREEN}✅ All tests passed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Backend venv not found. Skipping tests.${NC}"
fi

cd ..

echo ""
echo -e "${BLUE}Step 3: Git Status${NC}"
echo "================================"
git status --short

echo ""
echo -e "${YELLOW}Do you want to commit and push these changes? (y/n)${NC}"
read -p "" -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    read -p "Enter commit message: " COMMIT_MSG
    
    if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="Deploy to GitHub Pages"
    fi
    
    git add .
    git commit -m "$COMMIT_MSG"
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Pushed to GitHub successfully!${NC}"
        echo ""
        echo "⏳ GitHub Actions is now building and deploying..."
        echo ""
        echo "📍 Check deployment progress:"
        echo "   https://github.com/$(git config --get remote.origin.url | sed 's/.*://;s/.git$//')/actions"
        echo ""
        echo "🌐 Your site will be live at:"
        REPO_NAME=$(basename -s .git $(git config --get remote.origin.url))
        USERNAME=$(git config --get remote.origin.url | sed 's/.*://;s/\/.*//')
        echo "   https://${USERNAME}.github.io/${REPO_NAME}/"
        echo ""
        echo -e "${BLUE}📝 Next Steps:${NC}"
        echo "1. Deploy backend to Render.com (see GITHUB_PAGES_DEPLOY.md)"
        echo "2. Update VITE_API_URL in .github/workflows/github-pages.yml"
        echo "3. Push again to trigger deployment with backend connection"
    else
        echo -e "${RED}❌ Push failed!${NC}"
        exit 1
    fi
else
    echo ""
    echo "Deployment cancelled. You can manually commit and push:"
    echo "  git add ."
    echo "  git commit -m 'Deploy to GitHub Pages'"
    echo "  git push origin main"
fi
