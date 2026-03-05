import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playwright',
  testMatch: '**/*.pw.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    // 5% diff ratio allows minor hydration/antialiasing differences between runs
    toHaveScreenshot: { maxDiffPixelRatio: 0.05 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Snapshots live next to each spec file (committed to git)
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
})
