import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import http from 'http'; import fs from 'fs'; import path from 'path';
const root = path.resolve(process.cwd(), '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.woff2': 'font/woff2', '.json': 'application/json', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); r.end(d); }); }).listen(8770);
const mode = process.argv[2] || 'all';
const b = await chromium.launch();
const p = await b.newPage();
p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => console.log('console:', m.text()));
await p.goto('http://localhost:8770/intro16/index.html?scale=1');
await p.waitForSelector('body[data-ready="1"]', { timeout: 120000 });
const meta = await p.evaluate(() => window.META);
const grab = async (t, file, fmt) => { const data = await p.evaluate(([t, fmt]) => { window.renderFrame(t); return document.getElementById('c').toDataURL(fmt, 0.92); }, [t, fmt]); fs.writeFileSync(file, Buffer.from(data.split(',')[1], 'base64')); };
if (mode === 'all') {
  fs.mkdirSync('frames', { recursive: true });
  const n = Math.round(meta.FPS * meta.DURATION);
  for (let i = 0; i < n; i++) await grab(i / meta.FPS, `frames/f${String(i).padStart(4, '0')}.png`, 'image/png');
  console.log('frames', n);
} else { fs.mkdirSync('test', { recursive: true }); for (const t of mode.split(',')) await grab(+t, `test/t${t}.jpg`, 'image/jpeg'); }
await b.close(); srv.close();
