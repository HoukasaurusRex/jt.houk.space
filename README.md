# jt.houk.space

[![Infra Deploy](https://github.com/HoukasaurusRex/jt.houk.space/actions/workflows/infra-deploy.yml/badge.svg)](https://github.com/HoukasaurusRex/jt.houk.space/actions/workflows/infra-deploy.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/db1500c5-d307-4fa7-acd0-60543ece4624/deploy-status)](https://app.netlify.com/sites/houkspace/deploys)

Personal blog and portfolio for [JT Houk](https://jt.houk.space), built with VuePress 1.x and deployed on Netlify.

## Development

```bash
yarn install

# Start dev server
yarn dev

# Build for production
yarn build

# Lint
yarn lint

# Create a new journal entry
yarn new-journal-entry

# Fetch content from CMS
yarn fetch
```

## Structure

```
content/          # Site content (markdown)
├── articles/     # Blog posts
│   └── dev-log/  # Daily dev journal
├── projects/     # Portfolio projects
└── about/        # About page

src/              # Build-time scripts (TypeScript)
infra/            # GCP infrastructure (CDKTF)
.github/          # CI/CD workflows
```

## Infrastructure

Self-hosted email marketing via [Keila](https://www.keila.io/) on Google Cloud Run, managed with [CDKTF](infra/README.md).

To deploy: merge to `master` with a commit message containing `deploy`

## License

MIT
