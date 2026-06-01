@echo off
cd /d "%~dp0"
echo Starting portfolio preview...
echo.
echo Edit mode:
echo http://127.0.0.1:4173/?dev=1
echo.
echo Public preview:
echo http://127.0.0.1:4173/
echo.
echo Keep this window open while editing. Press Ctrl+C to stop.
echo.
node serve.mjs
pause
