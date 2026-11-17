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

// Minimal robust SPA static server
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

const PORT = 4173

server.listen(PORT, async () => {
  console.log(`SPA Server running at http://127.0.0.1:${PORT}`)

  try {
    const browser = await chromium.launch({ headless: true })

    const viewports = [
      { name: '1440', width: 1440, height: 900 },
      { name: '768', width: 768, height: 1024 },
      { name: '390', width: 390, height: 844 },
    ]

    for (const vp of viewports) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
      })

      // 1. Capture Design System
      console.log(`Capturing Design System at ${vp.width}x${vp.height}...`)
      await page.goto(`http://127.0.0.1:${PORT}/design-system`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1000)
      const dsPath = path.join(outputDir, `phase1-design-system-${vp.name}.png`)
      await page.screenshot({ path: dsPath, fullPage: true })
      console.log(`Saved: ${dsPath}`)

      // 2. Capture Home
      console.log(`Capturing Home at ${vp.width}x${vp.height}...`)
      await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' })
      await page.waitForTimeout(1000)
      const homePath = path.join(outputDir, `phase1-home-${vp.name}.png`)
      await page.screenshot({ path: homePath, fullPage: false })
      console.log(`Saved: ${homePath}`)

      await page.close()
    }

    await browser.close()
    console.log('All screenshots captured successfully!')
  } catch (err) {
    console.error('Screenshot capture error:', err)
  } finally {
    server.close()
    process.exit(0)
  }
})
