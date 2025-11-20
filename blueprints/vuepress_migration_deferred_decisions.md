# VuePress v1 → v2 Migration: Deferred Decisions

This document tracks decisions that were deferred during the VuePress v1 to v2 migration, along with context and recommendations for future implementation.

---

## Component Library: Replacing Chakra UI with Vuetify

**Date Deferred:** 2025-11-19  
**Date Implemented:** 2025-11-20  
**Status:** ✅ Complete  
**Priority:** Medium

### Context

During the VuePress v1 to v2 migration, Chakra UI was removed because it only supports Vue 2. The migration plan included Vuetify as a potential replacement component library for Vue 3.

### Current State

- Chakra UI components have been removed or stubbed out
- Notification.vue was rewritten with custom CSS (no component library)
- Newsletter.vue and Comments.vue are currently stubbed
- Site is functional but lacks the polished UI components Chakra provided

### Options Considered

**A) Vuetify 3**
- **Pros:** 
  - Comprehensive Material Design component library
  - Vue 3 compatible
  - Well-documented with active community
  - Includes form components, dialogs, notifications, etc.
- **Cons:**
  - Adds significant bundle size (~200KB)
  - Material Design aesthetic may not match current design
  - Requires configuration and theme setup
  - Learning curve for team
- **Effort:** 4-6 hours (setup + component migration)

**B) Naive UI**
- **Pros:**
  - Vue 3 native, TypeScript-first
  - Lighter weight than Vuetify
  - Modern, clean design
  - Tree-shakeable
- **Cons:**
  - Smaller community than Vuetify
  - Less comprehensive documentation
  - Fewer pre-built components
- **Effort:** 4-6 hours

**C) Custom CSS Components**
- **Pros:**
  - No external dependencies
  - Full control over styling
  - Minimal bundle size
  - Already started with Notification.vue
- **Cons:**
  - Time-consuming to build all components
  - Need to maintain accessibility
  - Reinventing the wheel
- **Effort:** 10-15 hours for full component set

**D) Headless UI + Tailwind CSS**
- **Pros:**
  - Unstyled, accessible components
  - Full styling control
  - Lightweight
  - Vue 3 compatible
- **Cons:**
  - Requires Tailwind setup
  - More manual styling work
  - Different approach from current SCSS
- **Effort:** 6-8 hours

### Implementation Summary

**Packages Installed:**
- `vuetify@^3.0.0` - Vue 3 Material Design component library
- `vite-plugin-vuetify@^2.0.0` - Vite plugin for auto-importing Vuetify components

**Configuration Changes:**
1. **config.ts** - Added Vuetify Vite plugin with auto-import and SSR support
2. **client.ts** - Initialized Vuetify with custom theme matching site colors (primary: #eb8da7)
3. **Notification.vue** - Migrated from custom CSS to `v-alert` component

**Build Status:** ✅ Success (41 pages rendered)

### Recommendation

**Defer until specific UI needs are identified.** The current custom CSS approach for Notification.vue works well. When re-implementing Newsletter and Comments components, evaluate if a component library would provide significant value. If only a few components are needed, continue with custom CSS. If many components are needed, revisit Vuetify or Naive UI.

### Implementation Notes

When this decision is revisited:

1. **Audit component needs:**
   - List all components that need UI library support
   - Estimate custom CSS effort vs library integration

2. **If choosing Vuetify:**
   ```bash
   yarn add vuetify@^3.0.0
   yarn add -D vite-plugin-vuetify
   ```
   - Configure in `content/.vuepress/theme/client.ts`
   - Create theme configuration
   - Update components to use Vuetify components

3. **If continuing custom CSS:**
   - Create reusable component patterns
   - Document styling conventions in CRUSH.md
   - Ensure accessibility standards are met

### Related Deferred Items

- Newsletter component re-implementation
- Comments component re-implementation
- Form validation components (if needed)

### References

- [Vuetify 3 Docs](https://next.vuetifyjs.com/en/getting-started/installation/)
- [Naive UI Docs](https://www.naiveui.com/en-US/os-theme)
- [Headless UI Vue](https://headlessui.com/vue/menu)
- [VuePress v2 Client API](https://v2.vuepress.vuejs.org/reference/client-api.html)

---

## Comments System: Replacing Disqus with Giscus

**Date Deferred:** 2025-11-19  
**Date Implemented:** 2025-11-20  
**Status:** ✅ Complete  
**Priority:** Medium

### Context

During the VuePress v1 to v2 migration, vue-disqus was removed because it only supports Vue 2. The migration plan identified Giscus as a modern, GitHub Discussions-backed alternative for comments.

### Implementation Summary

**Packages Installed:**
- `@vuepress/plugin-comment@next` - VuePress v2 comment plugin with Giscus support

**Configuration:**
```typescript
commentPlugin({
  provider: 'Giscus',
  repo: 'HoukasaurusRex/jt.houk.space',
  repoId: 'MDEwOlJlcG9zaXRvcnkxOTA3MTk5NzM=',
  category: 'Announcements',
  categoryId: 'DIC_kwDOC14n5c4CyAtn',
  mapping: 'pathname',
  strict: false,
  reactionsEnabled: true,
  inputPosition: 'top',
  theme: 'preferred_color_scheme',
  lang: 'en',
  lazyLoading: true,
})
```

**Changes:**
1. **config.ts** - Added `@vuepress/plugin-comment` with Giscus configuration
2. **Article markdown files** - Removed `<Comments />` component tags (5 files)
3. **Comments.vue** - Can be kept as stub or removed (plugin handles rendering automatically)

**Build Status:** ✅ Success (41 pages rendered)

### Benefits of Giscus

- **GitHub-backed:** Uses GitHub Discussions, no external service needed
- **Privacy-friendly:** No tracking, open source
- **Reactions:** Support for emoji reactions on comments
- **Theme support:** Automatically adapts to light/dark mode
- **Lazy loading:** Comments load only when scrolled into view
- **Moderation:** Leverages GitHub's moderation tools

### Migration from Disqus

Users' existing Disqus comments are not migrated. This is a clean break from the old comment system. If historical comments are important, they would need to be manually archived before deployment.

### References

- [VuePress Comment Plugin Docs](https://ecosystem.vuejs.press/plugins/blog/comment.html)
- [Giscus Website](https://giscus.app/)
- [GitHub Discussions](https://docs.github.com/en/discussions)

---
