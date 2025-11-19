npm run dev          # Vite dev server (fast HMR)
npm run build        # Production build
npm run test:visual  # Run Playwright tests
````

**Vite Configuration:**
{Any custom vite config patterns}

### Testing Patterns

**Component Visual Tests:**
- Location: tests/visual/components/
- Helper utilities: tests/visual/utils/component-helpers.ts
- Baseline storage: tests/visual/screenshots/
- Run time: <2 minutes

**Adding New Tests:**
{Pattern to follow}

### Deferred Work

**Components to re-implement:**
- {Chakra UI components} - Need new component library
- {Other deferred items}

**Future Improvements:**
- [ ] Evaluate v2 compatible component library
- [ ] Re-add comment system
- [ ] Consider alternative sidebar automation
- [ ] Update to stable 2.0 when released

### Dependencies

**Core:**
- vuepress: 2.0.0-rc.26
- @vuepress/bundler-vite: ^2.0.0-rc.24
- @vuepress/theme-default: ^2.0.0-rc.112

**Plugins:**
- @vuepress/plugin-blog: ^2.0.0-rc.112
- @vuepress/plugin-pwa: ^2.0.0-rc.112

**Styling:**
- sass: ^1.93.2

### Known Issues / Gotchas
{Document any quirks discovered}

### Resources
- [VuePress v2 Docs](https://v2.vuepress.vuejs.org/)
- [Migration Changelog](https://github.com/vuepress/core/blob/main/CHANGELOG.md)
- [Vite Bundler Docs](https://v2.vuepress.vuejs.org/reference/bundler/vite.html)
````

### MIGRATION.md Final Update
````markdown
## ✅ Migration Complete

**Completed:** {timestamp}
**Duration:** {total time}
**Final versions:**
- VuePress: 2.0.0-rc.26 (Vue 3)
- TypeScript: {version}
- Bundler: Vite

---

## Summary

**Conversions:**
- {N} JavaScript files → TypeScript
- Vue 2 → Vue 3
- Webpack → Vite

**Dependencies:**
- Migrated: blog plugin, PWA plugin
- Dropped: mailchimp, SEO, vuepress-bar
- Deferred: Chakra UI components, Disqus

**Testing:**
- ✓ Visual baselines established for v2
- ✓ All component tests passing
- ✓ Build successful

**Documentation:**
- ✓ MIGRATION.md complete record
- ✓ CRUSH.md updated with patterns

---

## Key Changes from v1

### Build System
- Webpack → Vite (faster dev/build)
- HMR significantly faster
- Build output structure different

### Configuration
- config.js → config.ts
- New plugin API
- Vite bundler configuration

### Styling
- node-sass/sass-loader → sass
- Same SCSS files, updated tooling

### Sidebar
{Document chosen approach: manual or alternative}

### Dropped Features (Non-Essential)
- Mailchimp newsletter signup
- SEO plugin (can re-add if needed)
- Chakra UI components (to re-implement)

---

## Architecture Patterns

**See CRUSH.md for comprehensive patterns established during migration.**

Key patterns:
- TypeScript config typing
- Component prop typing
- Plugin API usage
- Visual testing approach

---

## Maintenance

### Visual Regression Tests
```bash
npm run test:visual              # Run tests
npm run test:visual:update       # Update baselines
npx playwright test --ui         # Interactive mode
```

### Development
```bash
npm run dev    # Vite dev server (port 5173)
npm run build  # Production build
```

### TypeScript
```bash
npx tsc --noEmit  # Type check without build
```

---

## Future Work

### Short Term
- [ ] Evaluate component libraries for Chakra replacement
- [ ] Re-add comment system (find v3 compatible solution)
- [ ] Consider sidebar automation alternatives

### Long Term
- [ ] Monitor for stable 2.0 release
- [ ] Update to stable when available
- [ ] Revisit SEO plugin options for v2

---

## Rollback

**If critical issues:**
```bash
git checkout {pre-migration-commit}
npm install
```

**v1 visual baselines preserved:** tests/visual/screenshots/archived-v1/

---

## Lessons Learned

### What Went Well
{Add notes}

### Challenges
{Add notes}

### Time Sinks
{Add notes}

### Recommendations for Future Migrations
{Add notes}
````

### Repository Finalization
- [ ] Update package.json scripts:
````json
  {
    "scripts": {
      "dev": "vuepress dev",
      "build": "vuepress build",
      "test:visual": "playwright test",
      "test:visual:ui": "playwright test --ui",
      "test:visual:update": "playwright test --update-snapshots"
    }
  }
````
- [ ] Update .gitignore for Playwright
- [ ] Create/update tests/visual/README.md
- [ ] Update main README.md with:
  - New build commands
  - TypeScript note
  - Testing info
  - Deferred features
- [ ] Clean up temporary files
- [ ] Final commit: "Migration complete: v2.0.0-rc.26 with TypeScript"

---

## Success Criteria

### Must Complete
- [x] All JS files converted to TypeScript
- [x] Site builds successfully with v2
- [x] Visual tests pass with approved baselines
- [x] MIGRATION.md complete
- [x] CRUSH.md updated with patterns
- [x] Core functionality working
- [x] No console errors in browser

### Quality Gates
- TypeScript: No `any` types unless documented
- Build: No warnings in production build
- Tests: <2 minute runtime
- Documentation: Both logs complete and accurate

---

## Execution Protocol

### Self-Sufficient Actions (No Approval Needed)
- Installing dependencies from known list
- Converting JS → TS following patterns
- Updating imports/syntax for v2 APIs
- Fixing type errors
- Following v2 documentation
- Committing incremental progress
- Updating MIGRATION.md factually
- Updating CRUSH.md with patterns

### Decision Points (Require Approval)
- vuepress-bar replacement approach
- Build errors after 3 fix attempts
- Alternative plugin choices
- Visual baseline approval
- Any feature removals beyond agreed scope

### Communication Format
**Status updates every hour or major phase:**
````markdown
[PHASE]: {current phase}
[PROGRESS]: {specific milestone completed}
[TIME]: {elapsed} / {estimated remaining}
[BLOCKERS]: {none or description}
[NEXT]: {immediate next action}
````

**For decisions:**
````markdown
DECISION REQUIRED: {Title}

Context: {1-2 sentences}

Options:
A) {Option}
   Pros: {specific benefits}
   Cons: {specific drawbacks}
   Effort: {time estimate}

B) {Option}
   Pros: ...
   Cons: ...
   Effort: ...

Recommendation: {Your choice with reasoning}
Awaiting: {Explicit action needed}
````

### Error Handling
**If stuck on same issue for 45 minutes:**
1. Document everything in MIGRATION.md
2. Present simplified problem
3. Offer 2-3 solutions with tradeoffs
4. Stop and await guidance

### Interruption Recovery
**If process interrupted:**
1. Read MIGRATION.md "Next Steps"
2. Verify last commit state
3. Check if last build succeeded
4. Resume from documented point
5. Brief status summary before continuing

---

## Timeline Estimate

**Based on scope and complexity:**

- **Phase 0 (Setup):** 30-60 min
  - MIGRATION.md creation
  - Playwright setup
  - Site inventory
  
- **Phase 1 (Baselines):** 30-45 min
  - Test generation
  - Baseline capture
  
- **Phase 2 (TypeScript):** 3-5 hours
  - File-by-file conversion
  - Type checking
  - CRUSH.md updates
  
- **Phase 3 (Migration):** 4-8 hours
  - Dependency updates
  - Config migration
  - Component updates
  - Build debugging
  
- **Phase 4 (Validation):** 1-2 hours
  - Visual review
  - Baseline approval
  
- **Phase 5 (Finalization):** 30-60 min
  - Documentation
  - Cleanup

**Total:** 10-16 hours over multiple sessions

**Checkpoints for natural breaks:**
- After TypeScript conversion
- After successful first v2 build
- After visual validation

---

## Initial Actions

**Starting now:**

1. Create MIGRATION.md from template
2. Create initial CRUSH.md entry
3. Analyze current site structure
4. Present:
   - Site inventory
   - TypeScript conversion scope
   - vuepress-bar replacement options
   - Component test coverage plan

**Await approval for:**
- vuepress-bar replacement choice
- Test coverage scope
- Proceeding to baseline capture

**First MIGRATION.md entry:**
````markdown
### {Timestamp} - Migration Initiated

**Status:** Analyzing current site
**Scope confirmed:**
- Core theme migration
- JS → TS conversion
- Chakra UI components deferred
- Mailchimp/SEO dropped

**Next:** Present site inventory and decisions needed
````

---

Ready to begin. Confirm and I'll start with site analysis and present the first round of decisions.