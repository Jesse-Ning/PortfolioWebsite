# PlayStation Library Sync

This is a semi-automatic workflow because PlayStation library pages require your private login session and do not expose a Steam-like public library API.

## Export from PlayStation

1. Open https://library.playstation.com/recently-purchased in your own browser and log in.
2. Scroll down until the games you want are loaded.
3. Press F12, open Console, paste the content of `tools/playstation-export-snippet.js`, then press Enter.
4. The page downloads `playstation-library.json`.
5. Put `playstation-library.json` in this website folder: `C:\MYAPP\PortfolioWebsite`.

## Import into the website

Double-click `ImportPlayStationLibrary.bat`.

The importer merges by game name, so existing manually entered type, play time, or cover data is preserved when the exported file does not include it.
