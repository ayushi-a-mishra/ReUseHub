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

const PORT = 4190

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`)

  try {
    const browser = await chromium.launch({ headless: true })

    // 1. Requests page at 1440px
    console.log('Capturing phase4-requests-1440.png...')
    const page1440 = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await page1440.goto(`http://127.0.0.1:${PORT}/requests`, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page1440.waitForTimeout(1500)
    await page1440.screenshot({ path: path.join(outputDir, 'phase4-requests-1440.png'), fullPage: false })
    console.log('Saved phase4-requests-1440.png')

    // 2. Open Chat Modal on 1440px
    const chatBtn = await page1440.$('button:has-text("Chat")')
    if (chatBtn) {
      console.log('Opening chat modal...')
      await chatBtn.click()
      await page1440.waitForTimeout(1000)
      await page1440.screenshot({ path: path.join(outputDir, 'phase4-chat-modal-1440.png'), fullPage: false })
      console.log('Saved phase4-chat-modal-1440.png')
      // close dialog via Escape
      await page1440.keyboard.press('Escape')
      await page1440.waitForTimeout(600)
    }

    // 3. Open QR Code Modal on 1440px
    const qrBtn = await page1440.$('button:has-text("QR Code")')
    if (qrBtn) {
      console.log('Opening QR code modal...')
      await qrBtn.click()
      await page1440.waitForTimeout(1000)
      await page1440.screenshot({ path: path.join(outputDir, 'phase4-qr-modal-1440.png'), fullPage: false })
      console.log('Saved phase4-qr-modal-1440.png')
      await page1440.keyboard.press('Escape')
      await page1440.waitForTimeout(600)
    }

    // 4. Open Review Modal if present or simulate review
    const reviewBtn = await page1440.$('button:has-text("Review")')
    if (reviewBtn) {
      console.log('Opening review modal...')
      await reviewBtn.click()
      await page1440.waitForTimeout(1000)
      await page1440.screenshot({ path: path.join(outputDir, 'phase4-review-modal-1440.png'), fullPage: false })
      console.log('Saved phase4-review-modal-1440.png')
      await page1440.keyboard.press('Escape')
      await page1440.waitForTimeout(600)
    }
    await page1440.close()

    // 5. Requests page at 768px (Tablet)
    console.log('Capturing phase4-requests-768.png...')
    const page768 = await browser.newPage({ viewport: { width: 768, height: 1024 } })
    await page768.goto(`http://127.0.0.1:${PORT}/requests`, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page768.waitForTimeout(1500)
    await page768.screenshot({ path: path.join(outputDir, 'phase4-requests-768.png'), fullPage: false })
    console.log('Saved phase4-requests-768.png')
    await page768.close()

    // 6. Requests page at 390px (Mobile)
    console.log('Capturing phase4-requests-390.png...')
    const page390 = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
    await page390.goto(`http://127.0.0.1:${PORT}/requests`, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page390.waitForTimeout(1500)
    await page390.screenshot({ path: path.join(outputDir, 'phase4-requests-390.png'), fullPage: false })
    console.log('Saved phase4-requests-390.png')

    // 7. Mobile Chat Modal
    const mobileChatBtn = await page390.$('button:has-text("Chat")')
    if (mobileChatBtn) {
      await mobileChatBtn.click()
      await page390.waitForTimeout(1000)
      await page390.screenshot({ path: path.join(outputDir, 'phase4-chat-modal-390.png'), fullPage: false })
      console.log('Saved phase4-chat-modal-390.png')
    }
    await page390.close()

    await browser.close()
    console.log('All Phase 4 captures completed!')
  } catch (err) {
    console.error('Phase 4 capture error:', err)
  } finally {
    server.close()
    process.exit(0)
  }
})
