#!/bin/bash

echo "Starting Asset Management System..."

echo ""
echo "1. Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!

echo ""
echo "2. Starting Frontend Server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both servers are starting..."
echo "Backend: http://localhost:4000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers..."

# Wait for user to stop
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 