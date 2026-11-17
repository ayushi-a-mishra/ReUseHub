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

const PORT = 4174

server.listen(PORT, async () => {
  console.log(`Mobile Audit Server running at http://127.0.0.1:${PORT}`)

  try {
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    })

    const page = await context.newPage()
    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)

    // 1. Initial Hero Viewport (showing top bar, badge pill, balance text headline, search)
    const p1 = path.join(outputDir, 'mobile-390-1-hero-initial.png')
    await page.screenshot({ path: p1, fullPage: false })
    console.log(`Saved: ${p1}`)

    // 2. Viewport showing 3 live impact counters + Just Listed carousel
    await page.evaluate(() => window.scrollBy({ top: 220, behavior: 'instant' }))
    await page.waitForTimeout(500)
    const p2 = path.join(outputDir, 'mobile-390-2-counters-carousel.png')
    await page.screenshot({ path: p2, fullPage: false })
    console.log(`Saved: ${p2}`)

    // 3. Scroll carousel horizontally
    await page.evaluate(() => {
      const carousels = document.querySelectorAll('.snap-x')
      // The second snap-x container is the items carousel (first is category chips)
      if (carousels.length >= 2) {
        carousels[1].scrollBy({ left: 300, behavior: 'instant' })
      }
    })
    await page.waitForTimeout(500)
    const p3 = path.join(outputDir, 'mobile-390-3-carousel-scrolled.png')
    await page.screenshot({ path: p3, fullPage: false })
    console.log(`Saved: ${p3}`)

    // 4. Click a category chip (e.g. 2nd button in chips)
    await page.evaluate(() => {
      const chips = document.querySelectorAll('.snap-x button')
      if (chips.length > 2) {
        chips[2].click()
      }
    })
    await page.waitForTimeout(600)
    const p4 = path.join(outputDir, 'mobile-390-4-chip-clicked.png')
    await page.screenshot({ path: p4, fullPage: false })
    console.log(`Saved: ${p4}`)

    // 5. Scroll down to show Discovery Grid + Bottom Nav
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'instant' }))
    await page.waitForTimeout(500)
    const p5 = path.join(outputDir, 'mobile-390-5-discovery-scrolled.png')
    await page.screenshot({ path: p5, fullPage: false })
    console.log(`Saved: ${p5}`)

    // 6. Full page screenshot
    const pFull = path.join(outputDir, 'mobile-390-full.png')
    await page.screenshot({ path: pFull, fullPage: true })
    console.log(`Saved: ${pFull}`)

    await browser.close()
    console.log('Mobile audit capture complete!')
  } catch (err) {
    console.error('Audit capture error:', err)
  } finally {
    server.close()
    process.exit(0)
  }
})
