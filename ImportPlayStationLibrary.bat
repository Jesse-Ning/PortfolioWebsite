@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo PlayStation library import helper
echo.
echo Put playstation-library.json in this folder, or drag a JSON/TXT/CSV file onto this window.
echo This writes imported games into the PlayStation module in content.json.
echo.
set /p SOURCE=Source file [playstation-library.json]:
if "%SOURCE%"=="" set SOURCE=playstation-library.json
node tools\import-platform-library.mjs playstation "%SOURCE%"
echo.
pause
