/**
 * content-server.js
 * Tiny local file-write server for the admin editor (dev only).
 * Listens on port 3001. Angular dev-server proxies /api/content/* here.
 *
 * GET  /content/<path>   – reads the file, returns the questions array
 * PUT  /content/<path>   – receives questions array, writes back (preserves
 *                          wrapper objects like { id, questions: [...] })
 */

'use strict';

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT        = 3001;
const CONTENT_DIR = path.resolve(__dirname, 'src', 'assets', 'content');

function setJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  // CORS (only reached via localhost proxy anyway)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (!req.url.startsWith('/content/')) {
    return setJson(res, 404, { error: 'Not found' });
  }

  // Strip query string
  const urlPath    = req.url.split('?')[0];
  const relative   = urlPath.slice('/content/'.length);
  const filePath   = path.join(CONTENT_DIR, relative);

  // Prevent path traversal
  if (!filePath.startsWith(CONTENT_DIR + path.sep) && filePath !== CONTENT_DIR) {
    return setJson(res, 403, { error: 'Forbidden' });
  }

  // ── GET ─────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const raw    = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      const arr    = Array.isArray(parsed) ? parsed
                   : (Array.isArray(parsed?.questions) ? parsed.questions : []);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(arr));
    } catch (err) {
      if (err.code === 'ENOENT') { res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('[]'); }
      else setJson(res, 500, { error: err.message });
    }
    return;
  }

  // ── PUT ─────────────────────────────────────────────────────────────────
  if (req.method === 'PUT') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const newQuestions = JSON.parse(body);
        if (!Array.isArray(newQuestions)) {
          return setJson(res, 400, { error: 'Body must be a JSON array' });
        }

        // Preserve wrapper if file already uses one
        let existing = null;
        try { existing = JSON.parse(fs.readFileSync(filePath, 'utf8')); } catch { /* new file */ }

        const toWrite = (existing !== null && !Array.isArray(existing) && typeof existing === 'object')
          ? { ...existing, questions: newQuestions }
          : newQuestions;

        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, JSON.stringify(toWrite, null, 2) + '\n', 'utf8');
        setJson(res, 200, { ok: true, count: newQuestions.length });
      } catch (err) {
        setJson(res, 400, { error: err.message });
      }
    });
    return;
  }

  setJson(res, 405, { error: 'Method not allowed' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`  Content server  →  http://127.0.0.1:${PORT}`);
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error(`  Port ${PORT} already in use. Is content-server already running?`);
  } else {
    console.error('  Content server error:', err.message);
  }
  process.exit(1);
});
