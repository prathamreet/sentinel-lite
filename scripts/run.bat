@echo off
echo ================================================================
echo =          LogWatch Sentinel - Launch Script                  =
echo ================================================================
echo.
echo Starting all services...
echo.
echo This will open 3 terminal windows:
echo   1. Backend Server (Python Flask)
echo   2. Frontend Server (React)
echo   3. Mock Log Generator (Python)
echo.
echo Press any key to continue...
pause >nul

echo.
echo [1/3] Starting Backend Server...
start "LogWatch Backend" cmd /k "cd /d %~dp0..\backend && echo Starting LogWatch Backend Server... && python app.py"

echo [2/3] Starting Frontend Server...
start "LogWatch Frontend" cmd /k "cd /d %~dp0..\frontend && echo Starting LogWatch Frontend Server... && npm start"

echo [3/3] Starting Mock Log Generator...
start "LogWatch Mock Logs" cmd /k "cd /d %~dp0..\log && echo Starting Mock Log Generator... && python mock-log-server.py demo"

echo.
echo ================================================================
echo =                 ALL SERVICES STARTED!                       =
echo ================================================================
echo.
echo Services running:
echo   ✓ Backend:  http://localhost:5000
echo   ✓ Frontend: http://localhost:3000
echo   ✓ Mock Logs: Generating live attack simulations
echo.
echo Open your browser to: http://localhost:3000
echo.
echo To stop all services:
echo   - Close all terminal windows
echo   - Or press Ctrl+C in each terminal
echo   - Or run 'scripts\stop.bat'
echo.
echo Press any key to exit this launcher...
pause >nul