@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Steam library import helper
echo.
echo This reads your Steam Web API Key locally and writes game data to content.json.
echo The API Key is not saved into the website.
echo.
node tools\import-steam-library.mjs
echo.
pause
