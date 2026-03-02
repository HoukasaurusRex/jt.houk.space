import { Construct } from "constructs";
import { ServiceAccount } from "@cdktf/provider-google/lib/service-account";
import { SecretManagerSecretIamMember } from "@cdktf/provider-google/lib/secret-manager-secret-iam-member";
import { StorageBucketIamMember } from "@cdktf/provider-google/lib/storage-bucket-iam-member";
import { SecretManagerSecret } from "@cdktf/provider-google/lib/secret-manager-secret";
import { StorageBucket } from "@cdktf/provider-google/lib/storage-bucket";
import { KeilaSecrets } from "./secrets";

export interface KeilaIamConfig {
  secrets: KeilaSecrets;
  storageBucket: StorageBucket;
}

export class KeilaIam extends Construct {
  readonly serviceAccount: ServiceAccount;
  readonly serviceAccountEmail: string;

  constructor(scope: Construct, id: string, config: KeilaIamConfig) {
    super(scope, id);

    this.serviceAccount = new ServiceAccount(this, "sa", {
      accountId: "keila-runner",
      displayName: "Keila Cloud Run Service Account",
    });

    this.serviceAccountEmail = this.serviceAccount.email;

    const allSecrets: [string, SecretManagerSecret][] = [
      ["db-url", config.secrets.dbUrl],
      ["secret-key-base", config.secrets.secretKeyBase],
      ["hashid-salt", config.secrets.hashidSalt],
      ["admin-email", config.secrets.adminEmail],
      ["admin-password", config.secrets.adminPassword],
      ["smtp-host", config.secrets.smtpHost],
      ["smtp-password", config.secrets.smtpPassword],
      ["smtp-from-email", config.secrets.smtpFromEmail],
    ];

    for (const [name, secret] of allSecrets) {
      new SecretManagerSecretIamMember(this, `secret-access-${name}`, {
        secretId: secret.secretId,
        role: "roles/secretmanager.secretAccessor",
        member: `serviceAccount:${this.serviceAccount.email}`,
      });
    }

    new StorageBucketIamMember(this, "storage-access", {
      bucket: config.storageBucket.name,
      role: "roles/storage.objectAdmin",
      member: `serviceAccount:${this.serviceAccount.email}`,
    });
  }
}
