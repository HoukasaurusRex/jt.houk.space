# jt.houk.space

[![Netlify Status](https://api.netlify.com/api/v1/badges/db1500c5-d307-4fa7-acd0-60543ece4624/deploy-status)](https://app.netlify.com/sites/houkspace/deploys)
[![Playwright](https://github.com/HoukasaurusRex/jt.houk.space/actions/workflows/playwright.yml/badge.svg)](https://github.com/HoukasaurusRex/jt.houk.space/actions/workflows/playwright.yml)
[![Infra Deploy](https://github.com/HoukasaurusRex/jt.houk.space/actions/workflows/infra-deploy.yml/badge.svg)](https://github.com/HoukasaurusRex/jt.houk.space/actions/workflows/infra-deploy.yml)

Personal blog and portfolio for [JT Houk](https://jt.houk.space), built with [VuePress 2](https://v2.vuepress.vuejs.org/) and deployed on Netlify.

## Tech Stack

- **Framework**: VuePress 2 (rc.26) with `@vuepress/theme-default`
- **Bundler**: Vite via `@vuepress/bundler-vite`
- **Styling**: Tailwind CSS v4, PT Serif typography
- **Plugins**: Blog (tags, article listing), PWA (offline support), SEO (Open Graph), Search
- **Testing**: Playwright (structural + mobile viewport assertions)
- **Deployment**: Netlify with security headers, cache control, and 404 detection
- **Node.js**: 22+ (LTS/Jod)
- **Package Manager**: Yarn Berry (via Corepack)

## Getting Started

```bash
nvm use lts/jod
corepack enable
yarn install
yarn dev
```

## Scripts

```bash
yarn dev                # Start VuePress dev server
yarn build              # Build to content/.vuepress/dist/
yarn lint               # Lint with ESLint
yarn fetch              # Fetch content from CMS API
yarn new-journal-entry  # Create a new dev-log entry
yarn pw:test            # Run Playwright tests (requires site served on :3000)
yarn pw:update          # Update Playwright baselines
```

## Project Structure

```
content/
├── .vuepress/
│   ├── config.ts           # VuePress config (defineUserConfig)
│   ├── client.ts           # Client config (layouts, global components)
│   ├── theme/
│   │   ├── components/     # FloatingToc, Notification, Card, RightArrow, Laser
│   │   ├── global-components/  # Landing, Cards, Newsletter, Comments
│   │   ├── layouts/        # Layout.vue, Post.vue, BlogArticles.vue
│   │   └── styles/         # Tailwind v4, CSS variables, typewriter animation
│   └── public/             # Static assets, manifest, icons
├── articles/               # Blog posts (markdown with frontmatter)
│   └── dev-log/            # Daily dev journal entries
├── projects/               # Portfolio projects
└── about/                  # About page

src/                        # Build-time scripts (TypeScript, runs via Node 22)
netlify/functions/          # Serverless functions (newsletter subscribe)
infra/                      # GCP infrastructure (CDKTF)
playwright/                 # Structural regression tests
```

## Content

Articles use frontmatter with these fields:

```yaml
title: "Article Title"
created_at: "2026-01-01"
updated_at: "2026-01-15"        # optional, shown if different from created_at
tags: [cloud, tutorial]          # used for /tag/ routes and filtering
summary: "Short description"
author: "JT Houk"
location: "Montreal"             # optional
image: "https://..."             # cover image URL, used for OG meta
```

Draft articles use the `.draft.md` suffix and are excluded from builds.

## Testing

Playwright runs 40 structural assertions across desktop (1280x720) and mobile (iPhone 12) viewports:

```bash
# Build and serve first
yarn build && npx serve content/.vuepress/dist -l 3000

# Run tests
yarn pw:test
```

## Infrastructure

Self-hosted email marketing via [Keila](https://www.keila.io/) on Google Cloud Run, managed with [CDKTF](infra/README.md).

To deploy infrastructure: merge to `master` with a commit message containing `deploy`.

## Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `CMS_API` | `https://cms.houk.space` | External CMS endpoint for `yarn fetch` |
| `PLAYWRIGHT_BASE_URL` | `http://localhost:3000` | Base URL for Playwright tests |

## License

Code is [MIT](LICENSE) licensed. Written content in `content/articles/` and `content/about/` is [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
