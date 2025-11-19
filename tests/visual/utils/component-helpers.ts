import { Page } from '@playwright/test'

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle')
}

export async function takeScreenshot(page: Page, name: string) {
  return await page.screenshot({ 
    path: `tests/visual/screenshots/${name}.png`,
    fullPage: true 
  })
}

export async function scrollToBottom(page: Page) {
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight)
  })
  await page.waitForTimeout(500)
}
