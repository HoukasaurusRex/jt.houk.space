import { Construct } from "constructs";
import { TerraformOutput } from "cdktf";
import { CloudRunV2Service } from "@cdktf/provider-google/lib/cloud-run-v2-service";
import { CloudRunV2ServiceIamMember } from "@cdktf/provider-google/lib/cloud-run-v2-service-iam-member";
import { StorageBucket } from "@cdktf/provider-google/lib/storage-bucket";
import { KeilaSecrets } from "./secrets";

export interface KeilaCloudRunConfig {
  region: string;
  domain: string;
  serviceAccountEmail: string;
  secrets: KeilaSecrets;
  storageBucket: StorageBucket;
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

    this.service = new CloudRunV2Service(this, "service", {
      name: "keila",
      location: config.region,
      template: {
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
            resources: { limits: { cpu: "1", memory: "512Mi" } },
            volumeMounts: [{ name: "uploads", mountPath: "/app/uploads" }],
            env: [
              { name: "PORT", value: "4000" },
              { name: "URL_HOST", value: config.domain },
              { name: "URL_SCHEMA", value: "https" },
              { name: "DB_ENABLE_SSL", value: "true" },
              { name: "MAILER_SMTP_PORT", value: "587" },
              { name: "MAILER_ENABLE_STARTTLS", value: "true" },
              { name: "USER_CONTENT_DIR", value: "/app/uploads" },
              { name: "DISABLE_REGISTRATION", value: "true" },
              { name: "LOG_LEVEL", value: "info" },
              { name: "SECRET_KEY_BASE", ...secretRef(config.secrets.secretKeyBase.secretId) },
              { name: "HASHID_SALT", ...secretRef(config.secrets.hashidSalt.secretId) },
              { name: "DB_URL", ...secretRef(config.secrets.dbUrl.secretId) },
              { name: "KEILA_USER", ...secretRef(config.secrets.adminEmail.secretId) },
              { name: "KEILA_PASSWORD", ...secretRef(config.secrets.adminPassword.secretId) },
              { name: "MAILER_SMTP_FROM_EMAIL", ...secretRef(config.secrets.smtpFromEmail.secretId) },
              { name: "MAILER_SMTP_HOST", ...secretRef(config.secrets.smtpHost.secretId) },
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
