import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'serviceWorker', { get: () => undefined })
  })
})

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.route('**spotify-github-profile.kittinanx.com/**', route =>
      route.fulfill({ status: 200, contentType: 'image/png', body: Buffer.alloc(0) })
    )
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('navbar is 80px with theme colors and subtle shadow', async ({ page }) => {
    const nav = await page.evaluate(() => {
      const el = document.querySelector('.vp-navbar')
      const s = el ? getComputedStyle(el) : null
      return { height: s?.height, shadow: s?.boxShadow, bg: s?.backgroundColor }
    })
    expect(nav.height).toBe('80px')
    expect(nav.shadow).not.toBe('none')
    expect(nav.bg).not.toBe('rgb(255, 255, 255)')
  })

  test('no horizontal overflow', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(scrollWidth).toBeLessThanOrEqual(1280)
  })

  test('fills viewport without scrolling', async ({ page }) => {
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight)
    expect(scrollHeight).toBeLessThanOrEqual(720)
  })

  test('notification banner not visible on landing', async ({ page }) => {
    await expect(page.locator('.alert')).toHaveCount(0)
  })

  test('uses PT Serif font', async ({ page }) => {
    const styles = await page.evaluate(() => {
      const body = getComputedStyle(document.body)
      const h1 = document.querySelector('h1')
      return {
        bodyFont: body.fontFamily,
        bodySize: body.fontSize,
        h1Font: h1 ? getComputedStyle(h1).fontFamily : '',
      }
    })
    expect(styles.bodyFont).toContain('PT Serif')
    expect(parseFloat(styles.bodySize)).toBeGreaterThanOrEqual(17)
    expect(styles.h1Font).toContain('PT Serif')
  })

  test('search input exists in navbar', async ({ page }) => {
    await expect(page.locator('.search-box, [class*=search]')).toBeVisible()
  })

  test('CTA arrow is visible with accent background', async ({ page }) => {
    const arrow = page.locator('[data-cy="cta-arrow"]')
    await expect(arrow).toBeVisible()
    const bg = await arrow.evaluate(el => getComputedStyle(el).backgroundColor)
    expect(bg).not.toBe('rgba(0, 0, 0, 0)')
  })

  test('links have no underlines', async ({ page }) => {
    const decor = await page.evaluate(() => {
      const link = document.querySelector('[data-cy="cta-arrow"] a')
      return link ? getComputedStyle(link).textDecorationLine : 'none'
    })
    expect(decor).toBe('none')
  })
})

test.describe('Articles listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/articles/')
    await page.waitForLoadState('networkidle')
  })

  test('hero article card is visible with title', async ({ page }) => {
    await expect(page.locator('.article-hero')).toBeVisible()
    const title = page.locator('.hero-title')
    await expect(title).toBeVisible()
    const text = await title.textContent()
    expect(text?.length).toBeGreaterThan(0)
  })

  test('article cards have clickable title links', async ({ page }) => {
    const cards = page.locator('.article-card')
    expect(await cards.count()).toBeGreaterThan(0)
    const firstLink = cards.first().locator('.card-title-link')
    await expect(firstLink).toHaveAttribute('href', /\/articles\//)
  })

  test('tags are individually clickable links to tag pages', async ({ page }) => {
    const pill = page.locator('.pill').first()
    await expect(pill).toBeVisible()
    const href = await pill.getAttribute('href')
    expect(href).toMatch(/\/tag\//)
  })

  test('notification banner not visible on listing page', async ({ page }) => {
    await expect(page.locator('.alert')).toHaveCount(0)
  })
})

test.describe('Article post page', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/articles/agile-cooking')
    await page.waitForLoadState('networkidle')
  })

  test('post header renders with title', async ({ page }) => {
    const header = page.locator('.post-header')
    await expect(header).toBeVisible()
    const title = page.locator('.post-title')
    const text = await title.textContent()
    expect(text?.toLowerCase()).toContain('agile cooking')
  })

  test('post content has non-zero height', async ({ page }) => {
    const height = await page.evaluate(() => {
      const content = document.querySelector('[vp-content]')
      return content?.scrollHeight ?? 0
    })
    expect(height).toBeGreaterThan(200)
  })

  test('notification banner visible on article page', async ({ page }) => {
    await expect(page.locator('.alert')).toBeVisible()
  })

  test('post has tag links', async ({ page }) => {
    const tag = page.locator('.post-tag').first()
    await expect(tag).toBeVisible()
    const href = await tag.getAttribute('href')
    expect(href).toMatch(/\/tag\//)
  })
})

test.describe('Dark mode', () => {
  test('toggle switches data-theme and CSS variables', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 })
    await page.goto('/articles/agile-cooking')
    await page.waitForLoadState('networkidle')

    const initial = await page.evaluate(() => document.documentElement.dataset.theme)

    await page.click('.vp-toggle-color-mode-button')
    await page.waitForTimeout(300)

    const toggled = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      bg: getComputedStyle(document.documentElement).getPropertyValue('--background-color').trim(),
    }))

    expect(toggled.theme).not.toBe(initial)
    await page.click('.vp-toggle-color-mode-button')
    await page.waitForTimeout(300)
    const restoredBg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--background-color').trim()
    )
    expect(restoredBg).not.toBe(toggled.bg)
  })
})

test.describe('Mobile viewport', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.route('**spotify-github-profile.kittinanx.com/**', route =>
      route.fulfill({ status: 200, contentType: 'image/png', body: Buffer.alloc(0) })
    )
  })

  test('landing page fills viewport without scroll', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const scrollHeight = await page.evaluate(() => document.body.scrollHeight)
    const viewport = page.viewportSize()
    expect(scrollHeight).toBeLessThanOrEqual(viewport!.height + 1)
  })

  test('hamburger button is vertically centered in navbar', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const navbar = page.locator('.vp-navbar')
    const button = page.locator('.vp-toggle-sidebar-button')
    const navbarBox = await navbar.boundingBox()
    const buttonBox = await button.boundingBox()
    const navbarCenter = navbarBox!.y + navbarBox!.height / 2
    const buttonCenter = buttonBox!.y + buttonBox!.height / 2
    expect(Math.abs(navbarCenter - buttonCenter)).toBeLessThan(5)
  })
})

test.describe('Typography', () => {
  test('h2 has no border-bottom', async ({ page }) => {
    await page.goto('/articles/agile-cooking')
    await page.waitForLoadState('networkidle')
    const border = await page.evaluate(() => {
      const h2 = document.querySelector('h2')
      return h2 ? getComputedStyle(h2).borderBottomStyle : 'none'
    })
    expect(border).toBe('none')
  })
})
