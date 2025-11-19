# Project Development Guidelines

## Project Setup
- Node version: >v14.17.0
- Use nvm to manage Node versions
- Always use `npm ci` for clean installs
- VuePress v2 (2.0.0-rc.24) with Vue 3
- Vite bundler for fast HMR

## Commands
```bash
# Development
npm run dev                 # Start development server (Vite)
npm run build               # Build production site
npm run fetch               # Fetch external content
npm run lint                # Run linter
npm run lint --fix          # Auto-fix linting issues

# Testing
npm run test:visual         # Run Playwright visual tests
npm run test:visual:ui      # Run tests in interactive UI mode
npm run test:visual:update  # Update visual baselines
```

## VuePress v2 Patterns

### Component Development
- Use Vue 3 Composition API with `<script lang="ts">`
- Import VuePress composables from 'vuepress/client':
  - `usePageData()` - Access current page data
  - `usePageFrontmatter()` - Access page frontmatter
  - `useSiteData()` - Access site configuration
  - `useRouteLocale()` - Access current locale
- Use `defineComponent()` from 'vue'
- Always add `.vue` extension to component imports

### Theme Configuration
- Theme defined in `content/.vuepress/theme/index.ts`
- Use `getDirname(import.meta.url)` for __dirname
- Extend default theme with custom layouts
- Client-side enhancements in `theme/client.ts`

### Plugin Configuration
- Plugins configured in `config.ts`
- Available plugins:
  - `@vuepress/plugin-blog` - Blog functionality
  - `@vuepress/plugin-pwa` - Progressive Web App
  - `@vuepress/plugin-register-components` - Auto-register components

### Sidebar Configuration
- Manual sidebar configuration in `config.ts`
- Structure: `sidebar: { '/path/': [{ text: 'Title', children: [...] }] }`
- No automatic sidebar generation (vuepress-bar removed)

## Testing

### Visual Regression Testing
- Use Playwright for visual regression tests
- Tests located in `tests/visual/`
- Run on Desktop Chrome and Mobile iPhone 12 viewports
- Helper utilities in `tests/visual/utils/component-helpers.ts`

### Test Structure
```typescript
import { test, expect } from '@playwright/test'

test('should render correctly', async ({ page }) => {
  await page.goto('/path/')
  await expect(page.locator('h1')).toBeVisible()
})
```

### Baseline Management
- Visual baselines stored in `tests/visual/screenshots/`
- Review changes with `npm run test:visual:ui`
- Update baselines with `npm run test:visual:update`
- Always commit updated snapshots after intentional UI changes

## Code Style
### TypeScript
- Use strict TypeScript mode
- Prefer `const` over `let`
- Use arrow functions
- Avoid `any` type
- Use type inference when possible

### Formatting
- Use Prettier for automatic formatting
- No semicolons
- Single quotes
- 2-space indentation
- Max line length: 80 characters

### Imports
- Organize imports: external libs → internal modules → relative imports
- Use absolute imports when possible
- Group and sort imports alphabetically

### Error Handling
- Use explicit error types
- Prefer throwing typed errors
- Log errors with context
- Handle async errors with try/catch

### Vue Components
- Use Vue 3 Composition API with TypeScript
- Use `defineComponent()` from 'vue'
- Use prop type validation
- Minimize component complexity
- Import VuePress composables for page/site data

## Commit Guidelines
- Use conventional commit messages
- Prefix commits: feat/fix/docs/refactor/test/chore
- Keep commits small and focused
- Reference issue numbers when applicable

## Performance
- Use lazy loading for components
- Minimize bundle size
- Profile and optimize render performance

## Security
- Never commit secrets or credentials
- Use environment variables
- Validate and sanitize all inputs
- Keep dependencies updated