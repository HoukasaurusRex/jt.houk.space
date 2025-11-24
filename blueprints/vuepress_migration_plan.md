# VuePress v1→v2 Migration with TypeScript Conversion

## Mission
Migrate VuePress ^1.9.10 (Vue 2, JavaScript) to 2.0.0-rc.26 (Vue 3, TypeScript) with Playwright visual regression testing. Document everything for resumability and knowledge capture.

## Core Constraints

### Dependencies
**Install v2 packages:**
- vuepress@2.0.0-rc.26
- @vuepress/bundler-vite@^2.0.0-rc.24
- @vuepress/theme-default@^2.0.0-rc.112
- @vuepress/plugin-blog@^2.0.0-rc.112
- @vuepress/plugin-pwa@^2.0.0-rc.112
- @vuepress/plugin-register-components@^2.0.0-rc.112
- sass@^1.93.2

**Remove deprecated:**
- @chakra-ui/vue, vue-disqus (defer)
- vuepress-bar (needs alternative)
- vuepress-plugin-mailchimp, vuepress-plugin-seo (drop)
- sass-loader (replaced by sass)

### Code Requirements
- Convert all .js → .ts
- Vue components: add `lang="ts"` to script tags
- Type everything properly (no `any` unless documented)
- Follow existing CONTRIBUTING.md patterns

### Deferred
- Chakra UI components (comment out, mark with TODO)
- Disqus comments
- Non-essential features blocking migration

## Documentation Requirements

### blueprints/vuepress_migration_log.md (Create immediately)
Living log of all progress. Update after every significant action.

**Essential sections:**
```markdown
# VuePress v1→v2 Migration

**Started:** {timestamp}
**Status:** {current phase}

## Pre-Migration State
- VuePress: v1.9.10
- Node.js: {version}
- Last commit: {hash}

## Timeline
### {DateTime} - {Phase Name}
**Objective:** {what you're doing}
**Changes:** {bullet list}
**Decisions made:** {any choices}
**Blockers:** {issues if any}
**Status:** {complete/blocked}
**Next:** {immediate next step}

## Breaking Changes Log
{Track all v1→v2 changes encountered}

## Plugin Migration Tracker
{v1 plugin → v2 solution status}

## TypeScript Conversion Tracker
{Files converted, complexity, status}

## Visual Test Results
{Component reviews and approvals}

## Rollback Info
**Last stable:** {commit}
**Command:** git checkout {hash}

## Next Steps
{Always current - for interrupt recovery}
```

### CONTRIBUTING.md (Append patterns as learned)
Add architectural patterns discovered during migration:
```markdown
## [VuePress Migration - {Date}]

### TypeScript Patterns
{Config typing, component patterns, plugin types}

### VuePress v2 Architecture
{Structure, bundler config, theme customization}

### Testing Patterns
{Playwright setup, component helpers, best practices}
```

## Execution Framework

### Phase 1: Setup & Baseline (1-2 hours)
1. Create blueprints/vuepress_migration_log.md and initial CONTRIBUTING.md entry
2. Analyze site: inventory files, components, dependencies
3. **DECISION POINT:** vuepress-bar replacement strategy
   - Manual sidebar (quick, maintainable)
   - Custom generation script (automated, 2-3hr effort)
   - Research community alternatives
4. Install Playwright: `yarn add -D @playwright/test`
5. Create `playwright.config.ts` with:
   - Desktop + mobile viewports
   - 5% pixel tolerance
   - Component-level tests for: header, nav, blog list, post layout, code blocks, footer
6. Capture v1 baselines: `npx playwright test`

### Phase 2: TypeScript Conversion (3-5 hours)
**Convert in dependency order:** utilities → config → components → theme

**For each file:**
1. Log in blueprints/vuepress_migration_log.md: file path, complexity, dependencies
2. Convert: rename .js→.ts, add types, fix errors
3. Verify: `npx tsc --noEmit`
4. Commit with descriptive message
5. Update CONTRIBUTING.md with patterns every 5 files

**Quality gates:**
- No implicit `any`
- Proper imports with types
- Vue 3 Composition API where applicable
- Config uses VuePress v2 type imports

### Phase 3: Migration (4-8 hours)
1. **Checkpoint:** `git commit -m "Pre-migration: TS complete" && git tag v1-complete`
2. Remove v1 deps: `yarn remove vuepress @chakra-ui/vue vuepress-bar ...`
3. Add v2 deps: `yarn add -D vuepress@2.0.0-rc.26 ...`
4. Update config.ts: viteBundler, defaultTheme, v2 plugin APIs
5. Update components: remove Chakra (mark TODO), fix v2 APIs
6. Clean: `rm -rf .vuepress/.temp .vuepress/.cache`
7. Build: `yarn build`

**Error protocol:**
- Document every error in blueprints/vuepress_migration_log.md
- Attempt fix from docs/changelog
- Max 3 attempts per error before asking
- Commit after each successful fix

### Phase 4: Visual Validation (1-2 hours)
1. Update playwright.config.ts: baseURL → `http://localhost:5173`
2. Run: `yarn dev` then `npx playwright test` (will "fail" - expected)
3. Review: `npx playwright show-report`
4. For each component:
   - Check: content present, layout functional, interactions work
   - Classify: <5% cosmetic = approve, >5% or broken = fix
   - Document decision in blueprints/vuepress_migration_log.md
5. **DECISION POINT:** After all reviews complete, await "update baselines" confirmation
6. Archive v1: `mv tests/visual/screenshots/v1-reference tests/visual/screenshots/archived-v1/`
7. Update: `npx playwright test --update-snapshots`

### Phase 5: Finalization (30-60 min)
1. Complete blueprints/vuepress_migration_log.md summary
2. Finalize CONTRIBUTING.md with all patterns
3. Update package.json scripts
4. Create tests/visual/README.md
5. Final commit: "Migration complete: v2.0.0-rc.26"

## Decision-Making Framework

### Proceed Autonomously
- Installing known dependencies
- Converting JS→TS following patterns
- Updating imports/syntax per v2 docs
- Fixing type/lint errors
- Committing incremental progress
- Updating blueprints/vuepress_migration_log.md factually
- Following official VuePress v2 documentation

### Request Decision When
**Format:**
```
DECISION: {Title}
Context: {1-2 sentences}
Options:
A) {Option} - Pros: {X} Cons: {Y} Effort: {Z}
B) {Option} - Pros: {X} Cons: {Y} Effort: {Z}
Recommendation: {Your choice with reasoning}
Awaiting: {Explicit confirmation needed}
```

**Triggers:**
- No clear v2 equivalent exists
- Same error after 3 fix attempts
- Multiple valid approaches with different tradeoffs
- Feature removal affecting UX
- Visual baseline approval

### Interruption Recovery
Read blueprints/vuepress_migration_log.md "Next Steps" section → verify last commit → resume from documented point.

### Record Keeping
Every deferred decision result is logged in blueprints/vuepress_migration_deferred_decisions.md

## Success Criteria
- [ ] Site builds: `yarn build` succeeds
- [ ] Site runs: `yarn dev` starts, no console errors
- [ ] Tests pass: `npx playwright test` 100%
- [ ] Docs complete: blueprints/vuepress_migration_log.md + CONTRIBUTING.md comprehensive
- [ ] Types clean: `npx tsc --noEmit` passes
- [ ] Rollback documented: can revert if needed

## Resources
- v2 Docs: https://v2.vuepress.vuejs.org/
- Changelog: https://github.com/vuepress/core/blob/main/CHANGELOG.md
- Playwright: https://playwright.dev/
- Vue 3 Composition API: https://v3.vuejs.org/guide/composition-api-introduction.html
- TypeScript: https://www.typescriptlang.org/docs/
- VuePress v2 Migration Guide: https://v2.vuepress.vuejs.org/guide/migration.html
- Vuetify Docs: https://next.vuetifyjs.com/en/getting-started/installation/

## Start
1. Create blueprints/vuepress_migration_log.md
2. Analyze current site
3. Present inventory + vuepress-bar decision
4. Await approval to capture baselines

**First log entry:**
```markdown
### {Timestamp} - Migration Initiated
**Status:** Analyzing site
**Next:** Present inventory and vuepress-bar options
```

---

## Phase 6: Blog Theme Feature Parity (Post-Migration Enhancement)

### Overview
After completing the core v1→v2 migration, extend the default theme to replicate @vuepress/theme-blog features that were present in the v1 implementation.

### Current State (Post-Migration)
**Implemented:**
- ✅ Custom theme extending default theme
- ✅ Blog plugin with article filtering and metadata extraction
- ✅ Custom ArticleList component
- ✅ Giscus comments integration
- ✅ PWA plugin
- ✅ Vuetify 3 components

**Missing from v1 Blog Theme:**
- ❌ Footer with contact links and copyright
- ❌ RSS/Atom feed generation
- ❌ Tag/Category pages
- ❌ Pagination on article listings
- ❌ Custom permalinks (/articles/:slug)
- ❌ SEO meta tags automation
- ❌ Tag filtering UI
- ❌ Author/Location display in post metadata

### Implementation Strategy

#### Task 1: Essential Blog Features (4-6 hours)

**1.1 Custom Footer Component**
- Create `content/.vuepress/theme/components/Footer.vue`
- Add social media links (GitHub, Twitter, LinkedIn, Email)
- Dynamic copyright with current year
- Integrate via Layout.vue `#page-bottom` slot

**1.2 RSS Feed Generation**
- Install `@vuepress/plugin-feed`
- Configure for articles directory
- Set up Atom and JSON feeds
- Add feed links to head section

**1.3 Category/Tag Pages**
- Create `content/.vuepress/theme/layouts/BlogCategory.vue`
- Use `useBlogCategory()` composable from blog plugin
- Create dynamic routes for `/tag/:tag` and `/category/:category`
- List articles filtered by tag/category
- Add breadcrumb navigation

**1.4 Pagination Component**
- Enhance ArticleList.vue with pagination
- Support `lengthPerPage` configuration
- Add page navigation controls
- Preserve scroll position between pages

#### Task 2: Enhanced Blog Features (3-4 hours)

**2.1 Tag Filtering UI**
- Add tag cloud component to articles index
- Implement client-side filtering
- Show active tag filters
- Display article count per tag

**2.2 Blog Post Metadata Display**
- Enhance Post.vue layout
- Show author, location, date, reading time
- Display tags with links to tag pages
- Add social sharing buttons

**2.3 SEO Optimization**
- Install `@vuepress/plugin-seo` or use manual meta tags
- Configure Open Graph tags
- Add Twitter Card support
- Implement structured data (JSON-LD)

**2.4 Custom Permalinks**
- Configure blog plugin `permalink` option
- Use `/articles/:slug` pattern
- Add redirects for old URLs (if needed)
- Update internal links

#### Task 3: Advanced Features (Optional, 2-3 hours)

**3.1 Featured Posts**
- Configure blog plugin `type` for featured articles
- Create featured posts section on homepage
- Use frontmatter `featured: true`
- Implement in ArticleList component

**3.2 Related Articles**
- Create RelatedArticles.vue component
- Match articles by shared tags
- Display in Post.vue sidebar
- Limit to 3-5 related articles

**3.3 Reading Time Estimation**
- Create utility function for word count
- Calculate average reading time
- Display in article metadata
- Show progress indicator (optional)

**3.4 Archive Page**
- Create archive layout organized by year/month
- Group articles chronologically
- Add navigation between archives
- Generate dynamic routes

### Configuration Examples

#### Footer Configuration (config.ts)
```typescript
theme: defaultTheme({
  // ... existing config
  footer: {
    contact: [
      { type: 'github', link: 'https://github.com/HoukasaurusRex' },
      { type: 'twitter', link: 'https://twitter.com/HoukasaurusRex' },
      { type: 'linkedin', link: 'https://linkedin.com/in/jt-houk' },
      { type: 'mail', link: 'mailto:jt@houk.space' }
    ],
    copyright: `JT Houk © ${new Date().getFullYear()}`
  }
})
```

#### Blog Plugin Category Configuration
```typescript
blogPlugin({
  // ... existing filter and getInfo
  category: [
    {
      key: 'category',
      getter: (page) => page.frontmatter.category || [],
      layout: 'BlogCategory',
      itemLayout: 'Post',
      frontmatter: () => ({ title: 'Categories' }),
      itemPermalink: '/category/:key',
    },
    {
      key: 'tag',
      getter: (page) => page.frontmatter.tags || [],
      layout: 'BlogCategory',
      itemLayout: 'Post',
      frontmatter: () => ({ title: 'Tags' }),
      itemPermalink: '/tag/:key',
    },
  ],
  type: [
    {
      key: 'featured',
      filter: (page) => page.frontmatter.featured === true,
      layout: 'Layout',
      frontmatter: () => ({ title: 'Featured Articles' }),
      permalink: '/featured/',
    },
  ],
})
```

#### Feed Plugin Configuration
```typescript
import { feedPlugin } from '@vuepress/plugin-feed'

plugins: [
  feedPlugin({
    hostname: 'https://jt.houk.space',
    atom: true,
    json: true,
    rss: true,
    count: 20,
    filter: (page) => page.path.startsWith('/articles/'),
    sorter: (a, b) => {
      return new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
    },
  })
]
```

### Testing Plan
1. Verify footer appears on all pages
2. Test RSS feed in feed reader
3. Navigate to tag/category pages
4. Test pagination controls
5. Verify SEO meta tags in page source
6. Check custom permalinks resolve correctly
7. Visual regression tests for new components

### Decision Points
**Required for parity:** Footer, RSS feed, category/tag pages, pagination
**Optional enhancements:** Featured posts, related articles, reading time, archive

### Rollback Strategy
Each feature should be:
- Implemented in separate component/file
- Committed independently
- Toggleable via config (if possible)
- Documented in CONTRIBUTING.md

### Success Criteria
- [ ] Footer with contact links renders on all pages
- [ ] RSS feed accessible at `/rss.xml` or `/feed.xml`
- [ ] Tag pages list filtered articles at `/tag/:tag`
- [ ] Category pages list filtered articles at `/category/:category`
- [ ] Articles list shows 5 items per page with navigation
- [ ] Custom permalinks work: `/articles/:slug`
- [ ] SEO meta tags present in page head
- [ ] Visual tests pass for all new layouts

### Resources
- [VuePress v2 Blog Plugin](https://ecosystem.vuejs.press/plugins/blog/blog.html)
- [VuePress v2 Feed Plugin](https://ecosystem.vuejs.press/plugins/blog/feed.html)
- [VuePress v2 SEO Plugin](https://ecosystem.vuejs.press/plugins/seo/seo.html)
- [Default Theme Extending Guide](https://v2.vuepress.vuejs.org/reference/default-theme/extending.html)