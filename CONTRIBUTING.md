# Project Development Guidelines

## Project Setup
- Node version: >v20.19.4
- Use nvm to manage Node versions
- VuePress v2 (2.0.0-rc.24) with Vue 3
- Vite bundler for fast HMR
- Vuetify 3 for Material Design components

## Theme Colors

### CSS Variables (Light Theme)
All colors are defined in `content/.vuepress/theme/styles/dynamic.scss`:

```scss
--accent-color: hsla(327, 76%, 64%, 1);      // Pink accent (#eb8da7)
--background-color: hsla(0, 0%, 94%, 1);      // Light gray background
--foreground-color: hsla(0, 0%, 97%, 1);      // White-ish foreground
--text-color: hsla(180, 33%, 10%, 1);         // Dark teal text
--red: hsl(327, 70%, 75%);                    // Light pink/red
--green: hsl(83, 70%, 75%);                   // Light green
--blue: hsl(202, 70%, 75%);                   // Light blue
--border-color: hsla(0, 0%, 85%, 1);          // Border gray
--shadow-color: hsla(0, 0%, 13%, 1);          // Shadow dark
--btn-color-secondary: hsla(0, 0%, 90%, 1);   // Button secondary
--box-shadow-back: 0px 1px 2px rgba(0, 0, 0, 0.15);
--box-shadow-mid: 0px 3px 5px rgba(0, 0, 0, 0.15);
```

### Dark Theme
Dark theme colors automatically apply via `@media (prefers-color-scheme: dark)`.

### Vuetify Theme Colors
Defined in `content/.vuepress/theme/client.ts`:
- **Primary:** #eb8da7 (matches --accent-color)
- **Secondary:** #424242 (dark gray)
- **Error:** #f09cb8 (matches --red)
- **Success:** #d5eb8d (matches --green)
- **Info:** #8dd5eb (matches --blue)
- **Background:** #f0f0f0 / #1a1a1a (light/dark)
- **Surface:** #f7f7f7 / #212121 (light/dark)

### Usage in Components
Always use CSS variables for colors:
```scss
color: var(--text-color);
background-color: var(--foreground-color);
border: 1px solid var(--border-color);
box-shadow: var(--box-shadow-back);
filter: drop-shadow(2px 5px 5px var(--shadow-color));
```

## Commands
```bash
# Development
yarn run dev                 # Start development server (Vite)
yarn run build               # Build production site
yarn run fetch               # Fetch external content
yarn run lint                # Run linter
yarn run lint --fix          # Auto-fix linting issues

# Testing
yarn run test:visual         # Run Playwright visual tests
yarn run test:visual:ui      # Run tests in interactive UI mode
yarn run test:visual:update  # Update visual baselines
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
- Use Vuetify components (auto-imported): `v-alert`, `v-btn`, `v-card`, etc.
- Vuetify theme colors: primary (#eb8da7), secondary (#424242)

### Vuetify SSR Compatibility
- **Always wrap Vuetify components in `<ClientOnly>`** to prevent SSR errors
- Example:
  ```vue
  <template>
    <ClientOnly>
      <v-card>
        <v-card-title>My Card</v-card-title>
      </v-card>
    </ClientOnly>
  </template>
  ```
- SSR mode enabled in client.ts: `ssr: true`
- Vuetify externalized in Vite config: `ssr: { noExternal: ['vuetify'] }`

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
  - `@vuepress/plugin-comment` - Comments with Giscus (GitHub Discussions)

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
- Review changes with `yarn run test:visual:ui`
- Update baselines with `yarn run test:visual:update`
- Always commit updated snapshots after intentional UI changes

## Code Style
### Package Management
- Use Yarn for package management
- Run `yarn install` after pulling changes
- Add new dependencies with `yarn add <package>` or `yarn add -D <package>` for dev dependencies

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

## Commit Messages
- Use conventional commit format: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore
- Avoid adding "Generated with" or "Co-Authored-By" lines
- Only commit when explicitly instructed