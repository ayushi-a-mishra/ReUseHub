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
  const PORT = 4181
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve))
  console.log(`Server listening at http://127.0.0.1:${PORT}`)

  const browser = await chromium.launch({ headless: true })

  try {
    // 1. Desktop 1440px
    const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } })
    await page.goto(`http://127.0.0.1:${PORT}/support`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await page.screenshot({ path: path.join(outputDir, 'phase6-support-1440.png'), fullPage: true })
    console.log('Saved phase6-support-1440.png')

    // Test FAQ expansion and category filter
    const safetyFilter = page.locator('button:has-text("Safety & Policies")').first()
    if (await safetyFilter.count() > 0) {
      await safetyFilter.click()
      await page.waitForTimeout(500)
      await page.screenshot({ path: path.join(outputDir, 'phase6-support-1440-filtered.png') })
      console.log('Saved phase6-support-1440-filtered.png')
    }

    // Reset filter
    const allFilter = page.locator('button:has-text("All")').first()
    if (await allFilter.count() > 0) {
      await allFilter.click()
      await page.waitForTimeout(400)
    }

    // Test ticket submission form
    const messageInput = page.locator('textarea[name="message"]')
    if (await messageInput.count() > 0) {
      await messageInput.fill('Need a campus drop-off locker near the 4th floor IT Lab. We have multiple Arduino kits to exchange.')
      const submitBtn = page.locator('button:has-text("Submit Support Ticket")')
      await submitBtn.click()
      await page.waitForTimeout(1000)
      await page.screenshot({ path: path.join(outputDir, 'phase6-support-1440-ticket-submitted.png') })
      console.log('Saved phase6-support-1440-ticket-submitted.png')
    }

    await page.close()

    // 2. Tablet 768px
    const pageTab = await browser.newPage({ viewport: { width: 768, height: 1024 } })
    await pageTab.goto(`http://127.0.0.1:${PORT}/support`, { waitUntil: 'networkidle' })
    await pageTab.waitForTimeout(1000)
    await pageTab.screenshot({ path: path.join(outputDir, 'phase6-support-768.png'), fullPage: true })
    console.log('Saved phase6-support-768.png')
    await pageTab.close()

    // 3. Mobile 390px
    const pageMob = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await pageMob.goto(`http://127.0.0.1:${PORT}/support`, { waitUntil: 'networkidle' })
    await pageMob.waitForTimeout(1000)
    await pageMob.screenshot({ path: path.join(outputDir, 'phase6-support-390.png'), fullPage: true })
    console.log('Saved phase6-support-390.png')
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
