import { Construct } from "constructs";
import { Fn, ITerraformDependable, TerraformOutput } from "cdktf";
import { CloudRunV2Service } from "@cdktf/provider-google/lib/cloud-run-v2-service";
import { CloudRunV2ServiceIamMember } from "@cdktf/provider-google/lib/cloud-run-v2-service-iam-member";
import { SecretManagerSecretVersion } from "@cdktf/provider-google/lib/secret-manager-secret-version";
import { StorageBucket } from "@cdktf/provider-google/lib/storage-bucket";
import { KeilaSecrets } from "./secrets";

export interface KeilaCloudRunConfig {
  region: string;
  domain: string;
  serviceAccountEmail: string;
  secrets: KeilaSecrets;
  storageBucket: StorageBucket;
  secretVersions: SecretManagerSecretVersion[];
  iamBindings: ITerraformDependable[];
  // Non-secret config, injected as plain env vars (not Secret Manager):
  // public SMTP settings plus the admin login email (its password stays secret).
  adminEmail: string;
  smtpHost: string;
  smtpUser: string;
  smtpFromEmail: string;
}

export class KeilaCloudRun extends Construct {
  readonly service: CloudRunV2Service;

  constructor(scope: Construct, id: string, config: KeilaCloudRunConfig) {
    super(scope, id);

    const secretRef = (secretId: string) => ({
      valueSource: {
        secretKeyRef: { secret: secretId, version: "latest" },
      },
    });

    const secretVersionHash = Fn.substr(
      Fn.sha256(Fn.join(",", config.secretVersions.map((v) => v.id))),
      0,
      63
    );

    this.service = new CloudRunV2Service(this, "service", {
      dependsOn: [...config.secretVersions, ...config.iamBindings],
      name: "keila",
      location: config.region,
      deletionProtection: false,
      template: {
        labels: { "secret-version-hash": secretVersionHash },
        serviceAccount: config.serviceAccountEmail,
        volumes: [
          {
            name: "uploads",
            gcs: { bucket: config.storageBucket.name, readOnly: false },
          },
        ],
        scaling: { minInstanceCount: 0, maxInstanceCount: 1 },
        containers: [
          {
            image: "pentacent/keila:latest",
            // cpuIdle: true => request-based (throttled) CPU billing. CPU is only
            // allocated while a request is in flight, so the instance costs nothing
            // when idle. Trade-off: Keila's Oban background jobs will not run while
            // idle, so scheduled/queued sends only progress when the app is hit.
            resources: {
              limits: { cpu: "1", memory: "512Mi" },
              cpuIdle: true,
            },
            volumeMounts: [{ name: "uploads", mountPath: "/app/uploads" }],
            env: [
              { name: "URL_HOST", value: config.domain },
              { name: "URL_SCHEMA", value: "https" },
              { name: "DB_ENABLE_SSL", value: "true" },
              { name: "DB_VERIFY_SSL_HOST", value: "false" },
              { name: "MAILER_SMTP_PORT", value: "587" },
              { name: "MAILER_ENABLE_STARTTLS", value: "true" },
              { name: "DISABLE_UPDATE_CHECKS", value: "true" },
              { name: "USER_CONTENT_DIR", value: "/app/uploads" },
              { name: "DISABLE_REGISTRATION", value: "true" },
              { name: "LOG_LEVEL", value: "info" },
              { name: "SECRET_KEY_BASE", ...secretRef(config.secrets.secretKeyBase.secretId) },
              { name: "HASHID_SALT", ...secretRef(config.secrets.hashidSalt.secretId) },
              { name: "DB_URL", ...secretRef(config.secrets.dbUrl.secretId) },
              { name: "KEILA_USER", value: config.adminEmail },
              { name: "KEILA_PASSWORD", ...secretRef(config.secrets.adminPassword.secretId) },
              { name: "MAILER_SMTP_FROM_EMAIL", value: config.smtpFromEmail },
              { name: "MAILER_SMTP_HOST", value: config.smtpHost },
              { name: "MAILER_SMTP_USER", value: config.smtpUser },
              { name: "MAILER_SMTP_PASSWORD", ...secretRef(config.secrets.smtpPassword.secretId) },
            ],
          },
        ],
      },
    });

    new CloudRunV2ServiceIamMember(this, "public-invoker", {
      name: this.service.name,
      location: this.service.location,
      role: "roles/run.invoker",
      member: "allUsers",
    });

    new TerraformOutput(this, "keila_service_url", {
      value: this.service.uri,
      description: "Cloud Run service URL for Keila",
    });
  }
}
