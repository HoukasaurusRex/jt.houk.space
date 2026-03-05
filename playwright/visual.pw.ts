import { test, expect } from '@playwright/test'

// Masked regions: dynamic content that changes between runs
const DYNAMIC_MASKS = [
  // Spotify card image (fetches live data)
  { selector: '[data-cy="spotify-card"]' },
  // Footer copyright year (VuePress 2 uses .vp-footer)
  { selector: '.footer' },
  { selector: '.vp-footer' },
  // Notification banner: appears after client-side onMounted (timing varies)
  { selector: '.alert' },
]

async function getMasks(page: import('@playwright/test').Page) {
  const masks = []
  for (const { selector } of DYNAMIC_MASKS) {
    const els = page.locator(selector)
    const count = await els.count()
    for (let i = 0; i < count; i++) {
      masks.push(els.nth(i))
    }
  }
  return masks
}

// Block service worker on all tests to prevent PWA caching from affecting screenshots
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    // Prevent service worker registration
    Object.defineProperty(navigator, 'serviceWorker', { get: () => undefined })
  })
})

test.describe('Visual regression — Landing page', () => {
  test.beforeEach(async ({ page }) => {
    // Stub Spotify card to prevent flakiness
    await page.route('**spotify-github-profile.kittinanx.com/**', route =>
      route.fulfill({ status: 200, contentType: 'image/png', body: Buffer.alloc(0) })
    )
  })

  test('desktop 1280×720', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const masks = await getMasks(page)
    await expect(page).toHaveScreenshot('landing-desktop.png', { mask: masks, fullPage: true })
  })

  test('mobile 375×812', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const masks = await getMasks(page)
    await expect(page).toHaveScreenshot('landing-mobile.png', { mask: masks, fullPage: true })
  })
})

test.describe('Visual regression — Articles listing', () => {
  test('desktop 1280×720', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/articles/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('articles-desktop.png', { fullPage: true })
  })

  test('mobile 375×812', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/articles/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('articles-mobile.png', { fullPage: true })
  })
})

test.describe('Visual regression — Article post page', () => {
  test.beforeEach(async ({ page }) => {
    // Block Disqus to prevent external content from affecting snapshots
    await page.route('**disqus.com/**', route => route.fulfill({ status: 200, body: '' }))
    await page.route('**disquscdn.com/**', route => route.fulfill({ status: 200, body: '' }))
  })

  test('desktop 1280×720', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/articles/agile-cooking/')
    await page.waitForLoadState('networkidle')
    const masks = await getMasks(page)
    await expect(page).toHaveScreenshot('post-desktop.png', { mask: masks, fullPage: true })
  })

  test('mobile 375×812', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/articles/agile-cooking/')
    await page.waitForLoadState('networkidle')
    const masks = await getMasks(page)
    await expect(page).toHaveScreenshot('post-mobile.png', { mask: masks, fullPage: true })
  })
})
