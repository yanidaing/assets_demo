@echo off
echo Starting Asset Management System...

echo.
echo 1. Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"

echo.
echo 2. Starting Frontend Server...
cd ../frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul 