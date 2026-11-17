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
  const PORT = 4182
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve))
  console.log(`Server listening at http://127.0.0.1:${PORT}`)

  const browser = await chromium.launch({ headless: true })

  try {
    // 1. First test non-admin restricted view at 1440px
    const pageRestricted = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await pageRestricted.goto(`http://127.0.0.1:${PORT}/admin`, { waitUntil: 'domcontentloaded' })
    await pageRestricted.waitForTimeout(1200)
    await pageRestricted.screenshot({ path: path.join(outputDir, 'phase7-admin-restricted-1440.png') })
    console.log('Saved phase7-admin-restricted-1440.png')

    // Click "Continue as Dr. Rajesh Verma (Admin Demo)"
    const switchBtn = pageRestricted.locator('button:has-text("Continue as Dr. Rajesh Verma")')
    if (await switchBtn.count() > 0) {
      await switchBtn.click()
      await pageRestricted.waitForTimeout(1200)
      await pageRestricted.screenshot({ path: path.join(outputDir, 'phase7-admin-1440.png'), fullPage: true })
      console.log('Saved phase7-admin-1440.png')

      // Switch to Members tab
      const membersTab = pageRestricted.locator('button:has-text("Members")')
      if (await membersTab.count() > 0) {
        await membersTab.click()
        await pageRestricted.waitForTimeout(600)
        await pageRestricted.screenshot({ path: path.join(outputDir, 'phase7-admin-users-1440.png') })
        console.log('Saved phase7-admin-users-1440.png')
      }

      // Switch to Flags tab
      const flagsTab = pageRestricted.locator('button:has-text("Flags")')
      if (await flagsTab.count() > 0) {
        await flagsTab.click()
        await pageRestricted.waitForTimeout(600)
        await pageRestricted.screenshot({ path: path.join(outputDir, 'phase7-admin-reports-1440.png') })
        console.log('Saved phase7-admin-reports-1440.png')
      }

      // Switch to Tickets tab
      const ticketsTab = pageRestricted.locator('button:has-text("Tickets")')
      if (await ticketsTab.count() > 0) {
        await ticketsTab.click()
        await pageRestricted.waitForTimeout(600)
        await pageRestricted.screenshot({ path: path.join(outputDir, 'phase7-admin-inquiries-1440.png') })
        console.log('Saved phase7-admin-inquiries-1440.png')
      }
    }
    await pageRestricted.close()

    // 2. Tablet 768px (using admin state stored in localStorage)
    const contextTab = await browser.newContext({ viewport: { width: 768, height: 1024 } })
    const pageTab = await contextTab.newPage()
    // Pre-populate active user as admin in localStorage
    await pageTab.goto(`http://127.0.0.1:${PORT}/admin`, { waitUntil: 'domcontentloaded' })
    await pageTab.evaluate(() => {
      const adminUser = {
        id: 'u-faculty-01',
        email: 'rajesh.verma@slrtce.in',
        full_name: 'Dr. Rajesh Verma',
        role: 'admin',
        department: { id: 'd-comp', name: 'Computer Engineering', code: 'COMP', building: 'Academic Block A' },
        college_domain: 'slrtce.in',
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('reusehub_active_user', JSON.stringify(adminUser))
    })
    await pageTab.goto(`http://127.0.0.1:${PORT}/admin`, { waitUntil: 'domcontentloaded' })
    await pageTab.waitForTimeout(1200)
    await pageTab.screenshot({ path: path.join(outputDir, 'phase7-admin-768.png'), fullPage: true })
    console.log('Saved phase7-admin-768.png')
    await pageTab.close()

    // 3. Mobile 390px
    const contextMob = await browser.newContext({ viewport: { width: 390, height: 844 } })
    const pageMob = await contextMob.newPage()
    await pageMob.goto(`http://127.0.0.1:${PORT}/admin`, { waitUntil: 'domcontentloaded' })
    await pageMob.evaluate(() => {
      const adminUser = {
        id: 'u-faculty-01',
        email: 'rajesh.verma@slrtce.in',
        full_name: 'Dr. Rajesh Verma',
        role: 'admin',
        department: { id: 'd-comp', name: 'Computer Engineering', code: 'COMP', building: 'Academic Block A' },
        college_domain: 'slrtce.in',
        is_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('reusehub_active_user', JSON.stringify(adminUser))
    })
    await pageMob.goto(`http://127.0.0.1:${PORT}/admin`, { waitUntil: 'domcontentloaded' })
    await pageMob.waitForTimeout(800)
    await pageMob.screenshot({ path: path.join(outputDir, 'phase7-admin-390.png'), timeout: 8000 })
    console.log('Saved phase7-admin-390.png')
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
