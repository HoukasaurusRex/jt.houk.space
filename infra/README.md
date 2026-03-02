# Keila on Cloud Run — CDKTF Infrastructure

Terraform CDK (TypeScript) infrastructure for deploying [Keila](https://www.keila.io/) on Google Cloud Run.

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | ≥18 | [nvm](https://github.com/nvm-sh/nvm) |
| Terraform | ≥1.5 | `brew install terraform` |
| CDKTF CLI | ≥0.21 | `npm install -g cdktf-cli` |
| gcloud CLI | latest | [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) |

## Setup

```bash
# Install dependencies
cd infra/
npm install

# Generate provider bindings
npm run get

# Authenticate with GCP
gcloud auth application-default login
```

## Configuration

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your GCP project ID and domain
```

## Usage

```bash
# Preview changes
npm run diff

# Deploy
npm run deploy

# Destroy all resources
npm run destroy
```

## Testing

```bash
npm test
```

## Stack Structure

Each feature is a separate construct file in `constructs/`:

| File | Description |
|---|---|
| `main.ts` | Root `KeilaStack` — provider + variables |
| `constructs/apis.ts` | GCP API enablement |
| `constructs/networking.ts` | VPC, subnets, VPC connector |
| `constructs/database.ts` | Cloud SQL PostgreSQL |
| `constructs/secrets.ts` | Secret Manager entries |
| `constructs/storage.ts` | GCS bucket for uploads |
| `constructs/iam.ts` | Service account + IAM bindings |
| `constructs/cloudrun.ts` | Cloud Run service definition |
| `constructs/domain.ts` | Domain mapping + HTTPS |
| `constructs/monitoring.ts` | Alerts and notification channels |

## GitHub Project

Issues tracked in [Keila on Cloud Run (CDKTF)](https://github.com/users/HoukasaurusRex/projects/12) — issues #63–#74.
