@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Nintendo library import helper
echo.
echo Put nintendo-library.json in this folder, or drag a JSON/TXT/CSV file onto this window.
echo This writes imported games into the Nintendo module in content.json.
echo.
set /p SOURCE=Source file [nintendo-library.json]:
if "%SOURCE%"=="" set SOURCE=nintendo-library.json
node tools\import-platform-library.mjs nintendo "%SOURCE%"
echo.
pause
