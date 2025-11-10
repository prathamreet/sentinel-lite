@echo off
echo 🛡️  Starting LogWatch Sentinel...

echo 📡 Starting Python backend...
start cmd /k "cd backend && python app.py"

timeout /t 3

echo 🎨 Starting React frontend...
start cmd /k "cd frontend && npm start"

echo ✅ LogWatch Sentinel is running!
pause