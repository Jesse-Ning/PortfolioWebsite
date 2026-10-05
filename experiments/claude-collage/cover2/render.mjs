import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import http from 'http'; import fs from 'fs'; import path from 'path';
const root = path.resolve(process.cwd(), '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => {
  const f = path.join(root, decodeURIComponent(q.url.split('?')[0]));
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); });
}).listen(8768);
const b = await chromium.launch();
const p = await b.newPage();
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto(`http://localhost:8768/cover2/index.html?scale=2&seed=${process.argv[3] || 77}`);
await p.waitForSelector('body[data-ready="1"]', { timeout: 30000 });
const data = await p.evaluate(() => document.getElementById('c').toDataURL('image/png'));
fs.writeFileSync(process.argv[2] || 'cover.png', Buffer.from(data.split(',')[1], 'base64'));
await b.close(); srv.close();
