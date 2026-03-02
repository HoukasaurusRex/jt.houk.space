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
yarn install

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
yarn diff

# Deploy
yarn deploy

# Destroy all resources
yarn destroy
```

## Testing

```bash
yarn test
```

## SMTP Configuration (issue #72)

After deployment, update the SMTP secrets in GCP Secret Manager with real values:

```bash
# Set SMTP host
echo -n "smtp.postmarkapp.com" | \
  gcloud secrets versions add keila-smtp-host --data-file=-

# Set SMTP password (server API token)
echo -n "YOUR_SMTP_TOKEN" | \
  gcloud secrets versions add keila-smtp-password --data-file=-

# Set sender address
echo -n "keila@yourdomain.com" | \
  gcloud secrets versions add keila-smtp-from-email --data-file=-

# Set admin email and trigger a new Cloud Run revision to pick up changes
echo -n "admin@yourdomain.com" | \
  gcloud secrets versions add keila-admin-email --data-file=-
```

Recommended SMTP providers: [Postmark](https://postmarkapp.com),
[SendGrid](https://sendgrid.com), [Mailgun](https://mailgun.com).
Configure SPF and DKIM on your sending domain before sending campaigns.

## CI/CD (issue #73)

GitHub Actions workflow at `.github/workflows/infra-deploy.yml`:

- **PRs**: runs tests + `cdktf diff` (plan only)
- **Merges to `master`**: runs tests + `cdktf deploy --auto-approve`

Required GitHub secrets and variables:

| Name | Type | Description |
| --- | --- | --- |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Secret | WIF provider resource name |
| `GCP_DEPLOY_SERVICE_ACCOUNT` | Secret | Deploy SA email |
| `GCP_PROJECT_ID` | Variable | GCP project ID |
| `GCP_REGION` | Variable | GCP region (e.g. `us-central1`) |
| `KEILA_DOMAIN` | Variable | Custom domain (e.g. `mail.houk.space`) |

Set up Workload Identity Federation:

```bash
gcloud iam workload-identity-pools create github-pool \
  --location=global --display-name="GitHub Actions Pool"

gcloud iam workload-identity-pools providers create-oidc github-provider \
  --workload-identity-pool=github-pool --location=global \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository"
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
