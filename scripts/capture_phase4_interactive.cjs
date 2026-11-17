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
      return
    }
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(content)
  })
})

const PORT = 4192

server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`)

  try {
    const browser = await chromium.launch({ headless: true })

    // 1. Desktop 1440px
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await page.goto(`http://127.0.0.1:${PORT}/requests`, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await page.waitForTimeout(1500)

    // Switch to Active Meetups tab
    console.log('Switching to Active Meetups...')
    const activeTab = await page.$('button:has-text("Active Meetups")')
    if (activeTab) {
      await activeTab.click()
      await page.waitForTimeout(1000)
      await page.screenshot({ path: path.join(outputDir, 'phase4-active-meetups-1440.png'), fullPage: false })
      console.log('Saved phase4-active-meetups-1440.png')
    }

    // Click Chat
    const chatBtn = await page.$('button:has-text("Chat")')
    if (chatBtn) {
      console.log('Opening chat...')
      await chatBtn.click()
      await page.waitForTimeout(1200)
      await page.screenshot({ path: path.join(outputDir, 'phase4-chat-modal-1440.png'), fullPage: false })
      console.log('Saved phase4-chat-modal-1440.png')
      await page.keyboard.press('Escape')
      await page.waitForTimeout(600)
    }

    // Click QR Code
    const qrBtn = await page.$('button:has-text("QR Code")')
    if (qrBtn) {
      console.log('Opening QR code modal...')
      await qrBtn.click()
      await page.waitForTimeout(1200)
      await page.screenshot({ path: path.join(outputDir, 'phase4-qr-modal-1440.png'), fullPage: false })
      console.log('Saved phase4-qr-modal-1440.png')
      await page.keyboard.press('Escape')
      await page.waitForTimeout(600)
    }

    // Switch to Sent Requests to see Outgoing
    const sentTab = await page.$('button:has-text("Sent Requests")')
    if (sentTab) {
      await sentTab.click()
      await page.waitForTimeout(1000)
      await page.screenshot({ path: path.join(outputDir, 'phase4-sent-requests-1440.png'), fullPage: false })
      console.log('Saved phase4-sent-requests-1440.png')
    }

    await page.close()

    // 2. Mobile 390px Active Meetups & Chat
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
    await mobilePage.goto(`http://127.0.0.1:${PORT}/requests`, { waitUntil: 'domcontentloaded', timeout: 20000 })
    await mobilePage.waitForTimeout(1500)

    const mobileActiveTab = await mobilePage.$('button:has-text("Active Meetups")')
    if (mobileActiveTab) {
      await mobileActiveTab.click()
      await mobilePage.waitForTimeout(1000)
      await mobilePage.screenshot({ path: path.join(outputDir, 'phase4-active-meetups-390.png'), fullPage: false })
      console.log('Saved phase4-active-meetups-390.png')

      const mobileChatBtn = await mobilePage.$('button:has-text("Chat")')
      if (mobileChatBtn) {
        await mobileChatBtn.click()
        await mobilePage.waitForTimeout(1200)
        await mobilePage.screenshot({ path: path.join(outputDir, 'phase4-chat-modal-390.png'), fullPage: false })
        console.log('Saved phase4-chat-modal-390.png')
      }
    }

    await mobilePage.close()
    await browser.close()
    console.log('Interactive captures completed!')
  } catch (err) {
    console.error('Interactive capture error:', err)
  } finally {
    server.close()
    process.exit(0)
  }
})
