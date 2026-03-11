# jt.houk.space

[![Netlify Status](https://api.netlify.com/api/v1/badges/db1500c5-d307-4fa7-acd0-60543ece4624/deploy-status)](https://app.netlify.com/sites/houkspace/deploys)
[![Playwright](https://github.com/HoukasaurusRex/jt.houk.space/actions/workflows/playwright.yml/badge.svg)](https://github.com/HoukasaurusRex/jt.houk.space/actions/workflows/playwright.yml)
[![Infra Deploy](https://github.com/HoukasaurusRex/jt.houk.space/actions/workflows/infra-deploy.yml/badge.svg)](https://github.com/HoukasaurusRex/jt.houk.space/actions/workflows/infra-deploy.yml)

Personal blog and portfolio for [JT Houk](https://jt.houk.space), built with [VuePress 2](https://v2.vuepress.vuejs.org/) and deployed on Netlify.

## Tech Stack

- **Framework**: VuePress 2 (rc.26 core, rc.124 ecosystem) with `@vuepress/theme-default`
- **Bundler**: Vite 7 via `@vuepress/bundler-vite`
- **Styling**: Tailwind CSS v4 with CSS-first config, PT Serif typography
- **Animations**: GSAP (lazy-loaded per page)
- **Comments**: Giscus (GitHub Discussions)
- **Newsletter**: Keila email marketing via Netlify serverless function
- **Plugins**: Blog (tags, pagination), PWA (offline), SEO (Open Graph/Twitter), Search
- **Testing**: Playwright structural assertions, Cypress E2E
- **Deployment**: Netlify with security headers, cache control, and 404 detection
- **Infrastructure**: Keila on Google Cloud Run, managed with CDKTF
- **Node.js**: 22+ (LTS/Jod)
- **Package Manager**: Yarn 4 (via Corepack)

## Getting Started

```bash
nvm use lts/jod
corepack enable
yarn install
yarn dev
```

## Scripts

| Command | Description |
| --- | --- |
| `yarn dev` | Start VuePress dev server |
| `yarn build` | Build to `content/.vuepress/dist/` |
| `yarn lint` | Lint and auto-fix with ESLint |
| `yarn lint:md` | Lint markdown files with markdownlint |
| `yarn wrap:md` | Auto-wrap long markdown lines at 150 chars |
| `yarn fetch` | Fetch content from CMS API |
| `yarn new-entry` | Create a new content entry |
| `yarn format-journal` | Convert draft journal notes to prose with AI |
| `yarn pw:test` | Run Playwright tests (requires site on :3000) |
| `yarn pw:update` | Update Playwright snapshots |

## Project Structure

```
content/
├── .vuepress/
│   ├── config.ts               # VuePress config (defineUserConfig)
│   ├── client.ts               # Client config (layouts, global components)
│   ├── theme/
│   │   ├── components/         # FloatingToc, Notification, RecommendedReads,
│   │   │                       # Card, TerminalOutput, Laser, RightArrow
│   │   ├── composables/        # useLetterAnimation, useTerminal,
│   │   │                       # useRecommendedArticles, useJournalUnlock
│   │   ├── data/               # showerThoughts (404 page content)
│   │   ├── global-components/  # Landing, Cards, Newsletter, Comments, Toast
│   │   ├── layouts/            # Post, BlogArticles, NotFound
│   │   ├── styles/             # Tailwind v4 entry, CSS vars, pills, typewriter
│   │   └── utils/              # formatDate, slugify
│   └── public/                 # Static assets, manifest, icons
├── articles/                   # Blog posts (markdown with frontmatter)
│   └── dev-log/                # Daily dev journal entries
├── projects/                   # Portfolio projects
└── about/                      # About page

src/                            # Build-time scripts (TypeScript via Node 22)
netlify/functions/              # Serverless functions (newsletter subscribe)
infra/                          # GCP infrastructure (CDKTF)
playwright/                     # Structural regression tests
```

## Content

Articles use frontmatter with these fields:

```yaml
title: "Article Title"
created_at: "2026-01-01"
updated_at: "2026-01-15"        # optional, shown if different from created_at
tags: [cloud, tutorial]          # used for /tag/ routes and recommended reads
summary: "Short description"
author: "JT Houk"
location: "Montreal"             # optional
image: "https://..."             # cover image, used in cards and OG meta
```

Draft articles use the `.draft.md` suffix and are excluded from builds.

## Testing

Playwright runs 27 structural assertions across desktop (1280x720) and mobile (iPhone 12) viewports:

```bash
yarn build && npx serve content/.vuepress/dist -l 3000
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
| `ANTHROPIC_API_KEY` | (none) | API key for `yarn format-journal` AI prose conversion |

## License

Code is [MIT](LICENSE) licensed. Written content in `content/articles/` and `content/about/` is [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
