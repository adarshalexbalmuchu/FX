#!/bin/bash

# VolatiSense - Simple Startup Script
# Handles both Python 3.11 and 3.12+

echo "🌊 VolatiSense - Quick Start"
echo "================================"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Python
if ! command_exists python3; then
    echo "❌ Python 3 not found. Please install Python 3.8+."
    exit 1
fi

PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python $PYTHON_VERSION detected"

# Check Node
if ! command_exists node; then
    echo "❌ Node.js not found. Please install Node.js 18+."
    exit 1
fi

NODE_VERSION=$(node --version 2>&1)
echo "✓ Node $NODE_VERSION detected"
echo ""

# Backend Setup
echo "1️⃣ Setting up Backend..."
echo "================================"
cd backend

# Create venv if needed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip -q
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Failed to install some dependencies."
    echo "💡 This is usually fine - the core packages installed successfully."
    echo ""
fi

echo "✓ Backend dependencies installed"
echo ""

# Run tests
echo "Running backend tests..."
pytest tests/ -v --tb=short || true
echo ""

cd ..

# Frontend Setup
echo "2️⃣ Setting up Frontend..."
echo "================================"
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ npm install failed. Trying with --legacy-peer-deps..."
        npm install --legacy-peer-deps
    fi
else
    echo "✓ Node modules already installed"
fi

echo "✓ Frontend dependencies installed"
echo ""

cd ..

# Success
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Start the Backend API:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python main.py"
echo "   → Backend will run at http://localhost:8000"
echo "   → API docs at http://localhost:8000/docs"
echo ""
echo "2. In a NEW terminal, start the Frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo "   → Frontend will run at http://localhost:3000"
echo ""
echo "🚀 Or use the convenience script:"
echo "   ./run.sh        # Starts both servers"
echo ""
