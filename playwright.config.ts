import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './playwright',
  testMatch: '**/*.pw.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000',
    // Pixel-level comparison threshold (0–1); 0.1 allows minor antialiasing diffs
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
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
