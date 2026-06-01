@echo off
cd /d "%~dp0"

echo Portfolio publish helper
echo.
echo This will commit all changes in this standalone portfolio repository and push to GitHub.
echo.

git remote get-url origin >nul 2>nul
if errorlevel 1 (
  git remote add origin https://github.com/Jesse-Ning/PortfolioWebsite.git
)

set /p msg=Commit message [Update portfolio]: 
if "%msg%"=="" set msg=Update portfolio

git add .
git commit -m "%msg%"
if errorlevel 1 (
  echo.
  echo Nothing committed, or commit failed.
)

git push -u origin main

echo.
echo If push succeeds, GitHub Pages will publish automatically after Actions finishes.
pause
