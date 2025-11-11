#!/bin/bash

# VolatiSense - Run Both Servers
# Starts backend and frontend in parallel

echo "🚀 Starting VolatiSense..."
echo ""

# Check if setup was done
if [ ! -d "backend/venv" ]; then
    echo "⚠️  Backend not set up. Run ./start.sh first!"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Frontend not set up. Run ./start.sh first!"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend in background
echo "🔧 Starting Backend API..."
cd backend
source venv/bin/activate
python main.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

# Start frontend in background
echo "🎨 Starting Frontend..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers started!"
echo ""
echo "📡 Backend API:  http://localhost:8000"
echo "   API Docs:     http://localhost:8000/docs"
echo "🌐 Frontend:     http://localhost:3000"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
wait
