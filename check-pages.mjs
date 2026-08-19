import { chromium } from 'playwright';
import { createServer } from 'http';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const DIST = 'docs/.vitepress/dist';
const BASE = process.env.VITEPRESS_BASE ?? '/Almanach/';
const STRICT = process.argv.includes('--strict');
const CONCURRENCY = 4;
const PORT_START = 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json'
};

if (!existsSync(DIST)) {
  console.error(`No build output found at ${DIST}. Run "npm run build" first.`);
  process.exit(2);
}

const collectHtmlFiles = (dir, acc = []) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectHtmlFiles(full, acc);
    else if (entry.endsWith('.html')) acc.push(full);
  }
  return acc;
};

const startServer = async () => {
  for (let port = PORT_START; port < PORT_START + 20; port++) {
    const server = createServer((req, res) => {
      let url;
      try {
        url = decodeURIComponent(req.url.split('?')[0]);
      } catch {
        res.writeHead(400);
        res.end();
        return;
      }
      if (url.startsWith(BASE)) url = url.slice(BASE.length - 1);
      let filePath = join(DIST, url);
      if (filePath.endsWith('/')) filePath += 'index.html';
      if (!extname(filePath)) filePath += '.html';
      if (!filePath.startsWith(DIST) || !existsSync(filePath) || statSync(filePath).isDirectory()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(readFileSync(filePath));
    });
    try {
      await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, resolve);
      });
      return { server, port };
    } catch {
      server.close();
    }
  }
  throw new Error('No available port');
};

const { server, port } = await startServer();
const htmlFiles = collectHtmlFiles(DIST).sort();
const pages = htmlFiles.map(file => {
  const rel = file.slice(DIST.length + 1).replace(/\.html$/, '').replace(/(^|\/)index$/, '$1');
  return { url: `http://localhost:${port}${BASE}${rel}`, name: rel === '' ? '(home)' : rel };
});

process.stderr.write(`Checking ${pages.length} pages at http://localhost:${port}${BASE}\n`);

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const context = await browser.newContext();
const results = [];
let done = 0;

const checkPage = async ({ url, name }) => {
  const page = await context.newPage();
  const seen = new Set();
  const issues = [];
  const record = (type, text) => {
    const key = `${type}:${text}`;
    if (seen.has(key)) return;
    seen.add(key);
    issues.push({ type, text });
  };

  page.on('console', msg => {
    if (msg.type() === 'error') record('console.error', msg.text());
    else if (msg.type() === 'warning') record('console.warn', msg.text());
  });
  page.on('pageerror', err => record('pageerror', err.message));
  page.on('requestfailed', req => {
    if (!req.failure()?.errorText?.includes('ERR_ABORTED')) {
      record('requestfailed', `${req.method()} ${req.url()} — ${req.failure()?.errorText}`);
    }
  });
  page.on('response', res => {
    if (res.status() >= 400) record('http', `${res.status()} ${res.url()}`);
  });

  try {
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 20000 });
    if (!resp || resp.status() >= 400) {
      record('http', `document: ${resp ? resp.status() : 'no response'}`);
    }
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(750);
  } catch (e) {
    record('navigation', e.message);
  }

  await page.close();
  done++;
  if (done % 25 === 0 || done === pages.length) {
    process.stderr.write(`  ${done}/${pages.length}\n`);
  }
  return { name, url, issues };
};

const queue = [...pages];
const workers = Array.from({ length: Math.min(CONCURRENCY, pages.length) }, async () => {
  while (queue.length) {
    const next = queue.shift();
    if (next) results.push(await checkPage(next));
  }
});
await Promise.all(workers);

await browser.close();
await new Promise(resolve => server.close(resolve));

const withIssues = results.filter(r => r.issues.length > 0);
const counts = {};
for (const r of withIssues) {
  for (const i of r.issues) counts[i.type] = (counts[i.type] ?? 0) + 1;
}
const fatalTypes = new Set(['console.error', 'pageerror', 'requestfailed', 'http', 'navigation']);
const fatalCount = Object.entries(counts).filter(([t]) => fatalTypes.has(t)).reduce((a, [, n]) => a + n, 0);
const warnCount = counts['console.warn'] ?? 0;

if (withIssues.length === 0) {
  console.log(`OK: all ${pages.length} pages loaded with no console errors, warnings, or failed requests.`);
} else {
  console.log(`Found issues on ${withIssues.length} of ${pages.length} pages:\n`);
  for (const { name, issues } of withIssues) {
    console.log(`--- ${name}`);
    for (const i of issues) console.log(`  [${i.type}] ${i.text.replace(/\s+/g, ' ').slice(0, 300)}`);
    console.log();
  }
  console.log(`Summary: ${fatalCount} error(s), ${warnCount} warning(s) across ${withIssues.length} page(s).`);
}

if (fatalCount > 0 || (STRICT && warnCount > 0)) {
  process.exit(1);
}
