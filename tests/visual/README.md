# Visual Regression Tests

This directory contains Playwright-based visual regression tests for the VuePress site.

## Setup

Tests are automatically configured via `playwright.config.ts` in the project root.

## Running Tests

```bash
# Run all tests
npm run test:visual

# Run tests in UI mode (interactive)
npm run test:visual:ui

# Update baseline snapshots
npm run test:visual:update
```

## Test Structure

- `basic.spec.ts` - Basic page rendering and navigation tests
- `components/` - Component-specific visual tests
- `utils/component-helpers.ts` - Shared test utilities
- `screenshots/` - Visual baseline snapshots

## Writing Tests

Tests use Playwright's testing framework. Example:

```typescript
import { test, expect } from '@playwright/test'

test('should render page correctly', async ({ page }) => {
  await page.goto('/path/')
  await expect(page.locator('h1')).toBeVisible()
})
```

## Viewports

Tests run on:
- Desktop Chrome (1280x720)
- Mobile iPhone 12 (390x844)

## Baseline Management

Visual baselines are stored in `screenshots/`. When the UI changes intentionally:

1. Review changes with `npm run test:visual:ui`
2. Update baselines with `npm run test:visual:update`
3. Commit updated snapshots

## CI/CD

Tests run automatically in CI with:
- 2 retries on failure
- Single worker for consistency
- HTML report generation
