import { test, expect, Page } from '@playwright/test'

test.describe('Homepage', () => {
  test('should render landing page correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/JT's Space/)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('.landing')).toBeVisible()
  })

  test('should have navigation menu', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Articles' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Portfolio' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible()
  })
})

test.describe('Articles Page', () => {
  test('should render articles list', async ({ page }) => {
    await page.goto('/articles/')
    await expect(page.locator('h1')).toContainText(/articles/i)
  })
})

test.describe('Projects Page', () => {
  test('should render projects list', async ({ page }) => {
    await page.goto('/projects/')
    await expect(page.locator('h1')).toContainText(/projects/i)
  })
})

test.describe('About Page', () => {
  test('should render about page', async ({ page }) => {
    await page.goto('/about/')
    await expect(page.locator('h1')).toBeVisible()
  })
})
