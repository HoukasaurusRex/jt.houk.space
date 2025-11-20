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
- Follow existing CRUSH.md patterns

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

### CRUSH.md (Append patterns as learned)
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
1. Create blueprints/vuepress_migration_log.md and initial CRUSH.md entry
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
5. Update CRUSH.md with patterns every 5 files

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
2. Finalize CRUSH.md with all patterns
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
- [ ] Docs complete: blueprints/vuepress_migration_log.md + CRUSH.md comprehensive
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