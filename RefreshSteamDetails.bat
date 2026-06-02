@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Steam game details refresh helper
echo.
echo This fills missing genres and store details from Steam app pages.
echo It does not need or save your Steam Web API Key.
echo.
node tools\refresh-steam-details.mjs
echo.
pause
