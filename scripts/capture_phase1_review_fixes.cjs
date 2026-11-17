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

const PORT = 4176

server.listen(PORT, async () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`)

  try {
    const browser = await chromium.launch({ headless: true })

    // 1. Capture Design System at 1440px
    console.log('Capturing Design System at 1440px...')
    const pageDS = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await pageDS.goto(`http://127.0.0.1:${PORT}/design-system`, { waitUntil: 'domcontentloaded' })
    await pageDS.waitForTimeout(1500)
    const dsPath1440 = path.join(outputDir, 'phase1-fixes-design-system-1440.png')
    await pageDS.screenshot({ path: dsPath1440, fullPage: false })
    console.log(`Saved: ${dsPath1440}`)

    // Scroll down to Motion Demos section
    await pageDS.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
    await pageDS.waitForTimeout(1000)
    const dsMotionPath = path.join(outputDir, 'phase1-fixes-ds-motion-demos-1440.png')
    await pageDS.screenshot({ path: dsMotionPath, fullPage: false })
    console.log(`Saved: ${dsMotionPath}`)
    await pageDS.close()

    // 2. Capture Home at 1440px (Desktop Hero with Floating Cluster)
    console.log('Capturing Home at 1440px...')
    const pageHome1440 = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await pageHome1440.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' })
    await pageHome1440.waitForTimeout(1500)
    const home1440Path = path.join(outputDir, 'phase1-fixes-home-1440.png')
    await pageHome1440.screenshot({ path: home1440Path, fullPage: false })
    console.log(`Saved: ${home1440Path}`)

    // Scroll down to Pinned Story & Marquee
    await pageHome1440.evaluate(() => window.scrollTo({ top: 650, behavior: 'instant' }))
    await pageHome1440.waitForTimeout(1000)
    const story1440Path = path.join(outputDir, 'phase2-story-1440.png')
    await pageHome1440.screenshot({ path: story1440Path, fullPage: false })
    console.log(`Saved: ${story1440Path}`)
    await pageHome1440.close()

    // 3. Capture Home at 768px (Tablet)
    console.log('Capturing Home at 768px...')
    const pageHome768 = await browser.newPage({ viewport: { width: 768, height: 1024 } })
    await pageHome768.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' })
    await pageHome768.waitForTimeout(1500)
    const home768Path = path.join(outputDir, 'phase1-fixes-home-768.png')
    await pageHome768.screenshot({ path: home768Path, fullPage: false })
    console.log(`Saved: ${home768Path}`)
    await pageHome768.close()

    // 4. Capture Home at 390px (Mobile)
    console.log('Capturing Home at 390px...')
    const pageHome390 = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    })
    await pageHome390.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' })
    await pageHome390.waitForTimeout(1500)
    const home390Path = path.join(outputDir, 'phase1-fixes-home-390.png')
    await pageHome390.screenshot({ path: home390Path, fullPage: false })
    console.log(`Saved: ${home390Path}`)
    await pageHome390.close()

    // 5. Capture About page at 1440px
    console.log('Capturing About page at 1440px...')
    const pageAbout = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await pageAbout.goto(`http://127.0.0.1:${PORT}/about`, { waitUntil: 'domcontentloaded' })
    await pageAbout.waitForTimeout(1200)
    const aboutPath = path.join(outputDir, 'phase2-about-1440.png')
    await pageAbout.screenshot({ path: aboutPath, fullPage: false })
    console.log(`Saved: ${aboutPath}`)
    await pageAbout.close()

    // 6. Capture How It Works page at 1440px
    console.log('Capturing How It Works page at 1440px...')
    const pageHow = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await pageHow.goto(`http://127.0.0.1:${PORT}/how-it-works`, { waitUntil: 'domcontentloaded' })
    await pageHow.waitForTimeout(1200)
    const howPath = path.join(outputDir, 'phase2-how-it-works-1440.png')
    await pageHow.screenshot({ path: howPath, fullPage: false })
    console.log(`Saved: ${howPath}`)
    await pageHow.close()

    await browser.close()
    console.log('All verification captures completed successfully!')
  } catch (err) {
    console.error('Capture error:', err)
  } finally {
    server.close()
    process.exit(0)
  }
})
