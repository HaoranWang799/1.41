@echo off
cd /d "%~dp0"
echo Starting AI backend on 3102...
start "AI Backend" cmd /k "cd /d %~dp0 && set PORT=3102 && node server\index.js"
echo Starting Vite dev server on 5230...
node node_modules\vite\bin\vite.js --force --port 5230
pause