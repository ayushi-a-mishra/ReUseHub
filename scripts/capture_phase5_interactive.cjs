const http = require('http')
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

const distDir = path.resolve(__dirname, '../dist')
const outputDir = 'C:\\Users\\abhis\\.gemini\\antigravity\\brain\\55e04bc6-afe1-44dd-b10c-d69e8db911ed\\screenshots'

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
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      })
      res.end(content)
    }
  })
})

async function run() {
  const PORT = 4180
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve))
  console.log(`Server listening at http://127.0.0.1:${PORT}`)

  const browser = await chromium.launch({ headless: true })

  try {
    // 1. Desktop 1440px
    const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } })
    await page.goto(`http://127.0.0.1:${PORT}/impact`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await page.screenshot({ path: path.join(outputDir, 'phase5-impact-1440.png'), fullPage: true })
    console.log('Saved phase5-impact-1440.png')

    // Switch metric to inr
    const inrBtn = page.locator('button:has-text("₹ Saved")').first()
    if (await inrBtn.count() > 0) {
      await inrBtn.click()
      await page.waitForTimeout(600)
      await page.screenshot({ path: path.join(outputDir, 'phase5-impact-1440-inr.png') })
      console.log('Saved phase5-impact-1440-inr.png')
    }

    // Switch metric to items
    const itemsBtn = page.locator('button:has-text("Items")').first()
    if (await itemsBtn.count() > 0) {
      await itemsBtn.click()
      await page.waitForTimeout(600)
      await page.screenshot({ path: path.join(outputDir, 'phase5-impact-1440-items.png') })
      console.log('Saved phase5-impact-1440-items.png')
    }

    // Test clicking personal cert
    const certBtn = page.locator('button:has-text("Download My Certificate")')
    if (await certBtn.count() > 0) {
      await certBtn.click()
      await page.waitForTimeout(800)
      console.log('Triggered Download My Certificate successfully')
    }

    // Test clicking campus report
    const reportBtn = page.locator('button:has-text("Campus PDF Report")')
    if (await reportBtn.count() > 0) {
      await reportBtn.click()
      await page.waitForTimeout(800)
      console.log('Triggered Campus PDF Report successfully')
    }

    await page.close()

    // 2. Tablet 768px
    const pageTab = await browser.newPage({ viewport: { width: 768, height: 1024 } })
    await pageTab.goto(`http://127.0.0.1:${PORT}/impact`, { waitUntil: 'networkidle' })
    await pageTab.waitForTimeout(1000)
    await pageTab.screenshot({ path: path.join(outputDir, 'phase5-impact-768.png'), fullPage: true })
    console.log('Saved phase5-impact-768.png')
    await pageTab.close()

    // 3. Mobile 390px
    const pageMob = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await pageMob.goto(`http://127.0.0.1:${PORT}/impact`, { waitUntil: 'networkidle' })
    await pageMob.waitForTimeout(1000)
    await pageMob.screenshot({ path: path.join(outputDir, 'phase5-impact-390.png'), fullPage: true })
    console.log('Saved phase5-impact-390.png')
    await pageMob.close()

  } finally {
    await browser.close()
    server.close()
  }
}

run().catch((err) => {
  console.error('Test execution failed:', err)
  process.exit(1)
})
