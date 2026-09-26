const { chromium } = require('playwright-core')
const fs = require('fs')

const BASE = 'http://localhost:5173'
const OUT = 'shots'

const PAGES = [
  ['home', '/'],
  ['people', '/people'],
  ['meetups', '/meetups'],
  ['explore', '/explore'],
  ['login', '/login'],
]

;(async () => {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT)
  const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  const browser = await chromium.launch({ executablePath: chrome, headless: true })

  for (const [theme, vp] of [
    ['light', { width: 1440, height: 900 }],
    ['dark', { width: 1440, height: 900 }],
  ]) {
    const ctx = await browser.newContext({ viewport: vp })
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text())
    })

    for (const [name, route] of PAGES) {
      await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 25000 })
      await page.evaluate((t) => {
        localStorage.setItem('snt-theme', t)
        document.documentElement.setAttribute('data-theme', t)
      }, theme)
      await page.waitForTimeout(600)
      await page.screenshot({ path: `${OUT}/${name}-${theme}.png` })
      console.log(`  ${name}-${theme}.png`)
    }
    if (errors.length) console.log('  Fehler:', errors.slice(0, 3))
    await ctx.close()
  }

  await browser.close()
  process.exit(0)
})()