#!/bin/bash

echo "🧬 Starting Huberman Protocol Optimizer..."
echo ""

# Kill any existing processes on ports 3000 and 5000
echo "🔄 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

# Start backend server
echo "🚀 Starting backend server..."
cd server
node server-json.js &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Test backend
echo "🔍 Testing backend connection..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:5000"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Start frontend
echo "🎨 Starting frontend..."
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Both servers are running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
