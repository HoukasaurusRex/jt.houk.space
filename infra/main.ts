import { App, GcsBackend, TerraformStack, TerraformVariable } from "cdktf";
import { Construct } from "constructs";
import { CloudflareProvider } from "@cdktf/provider-cloudflare/lib/provider";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { RandomProvider } from "@cdktf/provider-random/lib/provider";
import { GcpApis } from "./constructs/apis";
import { KeilaSecrets } from "./constructs/secrets";
import { KeilaStorage } from "./constructs/storage";
import { KeilaIam } from "./constructs/iam";
import { KeilaCloudRun } from "./constructs/cloudrun";
import { KeilaDomain } from "./constructs/domain";
import { KeilaMonitoring } from "./constructs/monitoring";

export class KeilaStack extends TerraformStack {
  readonly projectId: TerraformVariable;
  readonly region: TerraformVariable;
  readonly domain: TerraformVariable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.projectId = new TerraformVariable(this, "project_id", {
      type: "string",
      description: "GCP project ID",
      nullable: false,
    });

    this.region = new TerraformVariable(this, "region", {
      type: "string",
      default: "us-central1",
      description: "GCP region for all resources",
    });

    this.domain = new TerraformVariable(this, "domain", {
      type: "string",
      description: "Custom domain for Keila (e.g. mail.houk.space)",
      nullable: false,
    });

    const dbUrl = new TerraformVariable(this, "db_url", {
      type: "string",
      description: "Neon PostgreSQL connection string",
      nullable: false,
      sensitive: true,
    });

    const secretKeyBase = new TerraformVariable(this, "secret_key_base", {
      type: "string",
      description: "Secret key base for Phoenix session encryption (min 64 chars)",
      nullable: false,
      sensitive: true,
    });

    const cloudflareZoneId = new TerraformVariable(this, "cloudflare_zone_id", {
      type: "string",
      description: "Cloudflare zone ID for the domain",
      nullable: false,
    });

    const adminEmail = new TerraformVariable(this, "admin_email", {
      type: "string",
      description: "Keila admin login email address",
      nullable: false,
      sensitive: true,
    });

    const adminPassword = new TerraformVariable(this, "admin_password", {
      type: "string",
      description: "Keila admin login password",
      nullable: false,
      sensitive: true,
    });

    const smtpHost = new TerraformVariable(this, "smtp_host", {
      type: "string",
      description: "SMTP server hostname",
      nullable: false,
    });

    const smtpUser = new TerraformVariable(this, "smtp_user", {
      type: "string",
      description: "SMTP authentication username",
      nullable: false,
      sensitive: true,
    });

    const smtpPassword = new TerraformVariable(this, "smtp_password", {
      type: "string",
      description: "SMTP authentication password",
      nullable: false,
      sensitive: true,
    });

    const smtpFromEmail = new TerraformVariable(this, "smtp_from_email", {
      type: "string",
      description: "From address for outgoing email",
      nullable: false,
    });

    new GcsBackend(this, {
      bucket: "jt-houk-space-tfstate",
      prefix: "keila",
    });

    new CloudflareProvider(this, "cloudflare");

    new GoogleProvider(this, "google", {
      project: this.projectId.stringValue,
      region: this.region.stringValue,
    });

    new RandomProvider(this, "random");

    const apis = new GcpApis(this, "apis");

    const secrets = new KeilaSecrets(this, "secrets", {
      connectionString: dbUrl.stringValue,
      secretKeyBase: secretKeyBase.stringValue,
      adminEmail: adminEmail.stringValue,
      adminPassword: adminPassword.stringValue,
      smtpHost: smtpHost.stringValue,
      smtpUser: smtpUser.stringValue,
      smtpPassword: smtpPassword.stringValue,
      smtpFromEmail: smtpFromEmail.stringValue,
    });
    secrets.node.addDependency(apis);

    const storage = new KeilaStorage(this, "storage", {
      region: this.region.stringValue,
    });
    storage.node.addDependency(apis);

    const iam = new KeilaIam(this, "iam", {
      secrets,
      storageBucket: storage.bucket,
    });
    iam.node.addDependency(secrets);
    iam.node.addDependency(storage);

    const cloudrun = new KeilaCloudRun(this, "cloudrun", {
      region: this.region.stringValue,
      domain: this.domain.stringValue,
      serviceAccountEmail: iam.serviceAccountEmail,
      secrets,
      storageBucket: storage.bucket,
      secretVersions: secrets.versions,
      iamBindings: iam.iamBindings,
    });
    cloudrun.node.addDependency(iam);

    const domain = new KeilaDomain(this, "domain-mapping", {
      domain: this.domain.stringValue,
      serviceName: cloudrun.service.name,
      region: this.region.stringValue,
      projectId: this.projectId.stringValue,
      zoneId: cloudflareZoneId.stringValue,
    });
    domain.node.addDependency(cloudrun);

    new KeilaMonitoring(this, "monitoring", {
      alertEmail: "jt@houk.space",
      serviceName: cloudrun.service.name,
    });
  }
}

if (require.main === module) {
  const app = new App();
  new KeilaStack(app, "keila");
  app.synth();
}
