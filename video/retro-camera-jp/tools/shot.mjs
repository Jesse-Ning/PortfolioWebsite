// Screenshot a local HTML page at 1080x1920. Usage: node tools/shot.mjs page.html out.png
import { chromium } from 'playwright';
import path from 'node:path';
const [, , page, out] = process.argv;
const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await p.goto('file://' + path.resolve(page));
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(400);
await p.screenshot({ path: out });
await browser.close();
