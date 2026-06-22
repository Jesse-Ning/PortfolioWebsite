@echo off
cd /d "%~dp0"
echo Starting portfolio editor...
echo.
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":4173" ^| findstr "LISTENING"') do (
  echo Closing existing portfolio server on port 4173, PID %%P...
  taskkill /PID %%P /F >nul 2>nul
)
echo.
start "Portfolio Server" cmd /k "cd /d ""%~dp0"" && node serve.mjs"
timeout /t 1 /nobreak >nul
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
  start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" "http://127.0.0.1:4173/?dev=1"
) else (
  start "" "http://127.0.0.1:4173/?dev=1"
)
