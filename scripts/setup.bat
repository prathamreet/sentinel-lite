@echo off
echo ================================================================
echo =          LogWatch Sentinel - Setup Script                   =
echo ================================================================
echo.

echo [1/4] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)
echo ✓ Python found

echo.
echo [2/4] Installing Python dependencies...
cd /d "%~dp0..\backend"
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
echo ✓ Python dependencies installed
cd /d "%~dp0.."

echo.
echo [3/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
echo ✓ Node.js found

echo.
echo [4/4] Installing Node.js dependencies...
cd /d "%~dp0..\frontend"
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo ✓ Node.js dependencies installed
cd /d "%~dp0.."

echo.
echo ================================================================
echo =                    SETUP COMPLETE!                          =
echo ================================================================
echo.
echo Next steps:
echo   1. Run 'scripts\run.bat' to start all services
echo   2. Open http://localhost:3000 in your browser
echo   3. LogWatch Sentinel will be ready for monitoring
echo.
echo Press any key to exit...
pause >nul