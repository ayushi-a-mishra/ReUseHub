const http = require('http')
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

const distDir = path.resolve(__dirname, '../dist')
const outputDir = 'C:\\Users\\abhis\\.gemini\\antigravity\\brain\\55e04bc6-afe1-44dd-b10c-d69e8db911ed\\screenshots'

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
}

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0]
  let filePath = path.join(distDir, reqPath)

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html')
  }

  if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html')
  }

  const ext = path.extname(filePath)
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500)
      res.end('Error loading ' + reqPath)
      return
    }
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content)
  })
})

const PORT = 4180

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`)

  try {
    const browser = await chromium.launch({ headless: true })

    const targets = [
      { name: 'phase3-browse-1440.png', url: '/browse', width: 1440, height: 900 },
      { name: 'phase3-browse-768.png', url: '/browse', width: 768, height: 1024 },
      { name: 'phase3-browse-390.png', url: '/browse', width: 390, height: 844, isMobile: true },
      { name: 'phase3-item-detail-1440.png', url: '/items/item-01', width: 1440, height: 900 },
      { name: 'phase3-item-detail-768.png', url: '/items/item-01', width: 768, height: 1024 },
      { name: 'phase3-item-detail-390.png', url: '/items/item-01', width: 390, height: 844, isMobile: true },
      { name: 'phase3-add-item-1440.png', url: '/add-item', width: 1440, height: 900 },
      { name: 'phase3-add-item-390.png', url: '/add-item', width: 390, height: 844, isMobile: true },
    ]

    for (const t of targets) {
      console.log(`Capturing ${t.name} at ${t.width}x${t.height}...`)
      const page = await browser.newPage({
        viewport: { width: t.width, height: t.height },
        isMobile: t.isMobile || false,
        hasTouch: t.isMobile || false,
      })

      await page.goto(`http://127.0.0.1:${PORT}${t.url}`, {
        waitUntil: 'domcontentloaded',
        timeout: 10000,
      })

      // Wait a moment for layout to settle
      await page.waitForTimeout(1500)

      const dest = path.join(outputDir, t.name)
      await page.screenshot({ path: dest, fullPage: false })
      console.log(`Saved: ${dest}`)
      await page.close()
    }

    await browser.close()
    console.log('All Phase 3 captures done!')
  } catch (err) {
    console.error('Capture error:', err)
  } finally {
    server.close()
    process.exit(0)
  }
})
