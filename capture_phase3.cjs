const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('C:\\Users\\abhis\\.gemini\\antigravity\\scratch\\reusehub\\node_modules\\playwright');

const DIST_DIR = path.resolve(__dirname, 'dist');
const SCREENSHOT_DIR = path.resolve('C:\\Users\\abhis\\.gemini\\antigravity\\brain\\55e04bc6-afe1-44dd-b10c-d69e8db911ed\\screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

// Create basic SPA static server
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(DIST_DIR, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

const PORT = 4173;

server.listen(PORT, async () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });

    const targets = [
      { name: 'phase3-browse-1440.png', url: '/browse', width: 1440, height: 900 },
      { name: 'phase3-browse-768.png', url: '/browse', width: 768, height: 1024 },
      { name: 'phase3-browse-390.png', url: '/browse', width: 390, height: 844 },
      { name: 'phase3-item-detail-1440.png', url: '/items/item-01', width: 1440, height: 900 },
      { name: 'phase3-item-detail-768.png', url: '/items/item-01', width: 768, height: 1024 },
      { name: 'phase3-item-detail-390.png', url: '/items/item-01', width: 390, height: 844 },
      { name: 'phase3-add-item-1440.png', url: '/add-item', width: 1440, height: 900 },
      { name: 'phase3-add-item-390.png', url: '/add-item', width: 390, height: 844 },
    ];

    for (const target of targets) {
      const page = await browser.newPage({
        viewport: { width: target.width, height: target.height }
      });

      console.log(`Navigating to http://localhost:${PORT}${target.url} at ${target.width}x${target.height}...`);
      await page.goto(`http://localhost:${PORT}${target.url}`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000,
      });

      // Wait for animations and render stabilization
      await page.waitForTimeout(2000);

      const dest = path.join(SCREENSHOT_DIR, target.name);
      await page.screenshot({ path: dest, fullPage: false });
      console.log(`Captured ${target.name}`);
      await page.close();
    }

    console.log('All Phase 3 captures completed successfully!');
  } catch (err) {
    console.error('Error during capture:', err);
  } finally {
    if (browser) await browser.close();
    server.close();
    process.exit(0);
  }
});
