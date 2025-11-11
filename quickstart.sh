#!/bin/bash

# VolatiSense Quick Start Script
# This script sets up and runs both backend and frontend

set -e

echo "🌊 VolatiSense - Quick Start"
echo "================================"

# Check Python version
echo "Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python $python_version"

# Check Node version
echo "Checking Node version..."
node_version=$(node --version)
echo "✓ Node $node_version"

echo ""
echo "1️⃣ Setting up Backend..."
echo "================================"

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

echo "✓ Backend setup complete"

echo ""
echo "2️⃣ Setting up Frontend..."
echo "================================"

cd ../frontend

# Install npm dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies (this may take a few minutes)..."
    npm install
else
    echo "✓ npm dependencies already installed"
fi

echo "✓ Frontend setup complete"

echo ""
echo "3️⃣ Running Tests..."
echo "================================"

cd ../backend
source venv/bin/activate

echo "Running backend tests..."
python -m pytest tests/ -v --tb=short

cd ..

echo ""
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "To start the application:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend"
echo "    source venv/bin/activate"
echo "    python main.py"
echo "    → http://localhost:8000"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend"
echo "    npm run dev"
echo "    → http://localhost:3000"
echo ""
echo "  API Documentation:"
echo "    http://localhost:8000/docs"
echo ""
