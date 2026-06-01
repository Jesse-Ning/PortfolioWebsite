@echo off
cd /d "%~dp0"

echo Portfolio publish helper
echo.
echo Step 1/3: checking local changes...
echo.

git remote get-url origin >nul 2>nul
if errorlevel 1 (
  git remote add origin https://github.com/Jesse-Ning/PortfolioWebsite.git
)

git status --short
if errorlevel 1 goto end

echo.
set /p msg=Commit message [Update portfolio]: 
if "%msg%"=="" set msg=Update portfolio

echo.
echo Step 2/3: committing changes if there are any...
git add .
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "%msg%"
) else (
  echo Nothing new to commit. Existing local commits will still be pushed.
)

echo.
echo Step 3/3: pushing to GitHub...
git push -u origin main
if errorlevel 1 (
  echo.
  echo Push failed. Check the error above.
  goto end
)

echo.
echo Done. GitHub Actions will publish the site automatically.

:end
echo.
pause
