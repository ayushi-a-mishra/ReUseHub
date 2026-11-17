const { chromium } = require('playwright')
const path = require('path')
const fs = require('fs')

async function run() {
  const browser = await chromium.launch({ headless: true })
  const outputDir = path.resolve('C:/Users/abhis/.gemini/antigravity/brain/55e04bc6-afe1-44dd-b10c-d69e8db911ed/screenshots')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // 1. Desktop 1440px
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } })
    await page.goto('http://127.0.0.1:5173/impact', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)
    await page.screenshot({ path: path.join(outputDir, 'phase5-impact-1440.png'), fullPage: true })
    console.log('Saved phase5-impact-1440.png')

    // Test interactive metric switch to inr
    const inrBtn = page.locator('button:has-text("₹ Saved")')
    if (await inrBtn.count() > 0) {
      await inrBtn.click()
      await page.waitForTimeout(500)
      await page.screenshot({ path: path.join(outputDir, 'phase5-impact-1440-inr-metric.png') })
      console.log('Saved phase5-impact-1440-inr-metric.png')
    }

    // Test sort by kg avoided
    const kgSort = page.locator('button:has-text("Kg Avoided")')
    if (await kgSort.count() > 0) {
      await kgSort.click()
      await page.waitForTimeout(500)
    }

    // Test PDF generation button click without popup block crash
    const certBtn = page.locator('button:has-text("My Eco Certificate")')
    if (await certBtn.count() > 0) {
      await certBtn.click()
      await page.waitForTimeout(1000)
      console.log('Tested personal cert button')
    }

    await page.close()
  }

  // 2. Tablet 768px
  {
    const page = await browser.newPage({ viewport: { width: 768, height: 1024 } })
    await page.goto('http://127.0.0.1:5173/impact', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)
    await page.screenshot({ path: path.join(outputDir, 'phase5-impact-768.png'), fullPage: true })
    console.log('Saved phase5-impact-768.png')
    await page.close()
  }

  // 3. Mobile 390px
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await page.goto('http://127.0.0.1:5173/impact', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1500)
    await page.screenshot({ path: path.join(outputDir, 'phase5-impact-390.png'), fullPage: true })
    console.log('Saved phase5-impact-390.png')
    await page.close()
  }

  await browser.close()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
