@echo off
echo ================================================================
echo =          LogWatch Sentinel - Stop Script                    =
echo ================================================================
echo.
echo Stopping all LogWatch services...
echo.

echo [1/3] Stopping Backend Server...
taskkill /f /im python.exe /fi "WINDOWTITLE eq LogWatch Backend*" >nul 2>&1

echo [2/3] Stopping Frontend Server...
taskkill /f /im node.exe /fi "WINDOWTITLE eq LogWatch Frontend*" >nul 2>&1

echo [3/3] Stopping Mock Log Generator...
taskkill /f /im python.exe /fi "WINDOWTITLE eq LogWatch Mock Logs*" >nul 2>&1

echo.
echo ================================================================
echo =                 ALL SERVICES STOPPED!                       =
echo ================================================================
echo.
echo All LogWatch Sentinel services have been terminated.
echo.
echo Press any key to exit...
pause >nul