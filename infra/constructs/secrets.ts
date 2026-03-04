import { Construct } from "constructs";
import { SecretManagerSecret } from "@cdktf/provider-google/lib/secret-manager-secret";
import { SecretManagerSecretVersion } from "@cdktf/provider-google/lib/secret-manager-secret-version";
import { Password } from "@cdktf/provider-random/lib/password";

export interface KeilaSecretsConfig {
  connectionString: string;
  secretKeyBase: string;
  adminEmail: string;
  adminPassword: string;
  smtpHost: string;
  smtpUser: string;
  smtpPassword: string;
  smtpFromEmail: string;
}

export class KeilaSecrets extends Construct {
  readonly dbUrl: SecretManagerSecret;
  readonly secretKeyBase: SecretManagerSecret;
  readonly hashidSalt: SecretManagerSecret;
  readonly adminEmail: SecretManagerSecret;
  readonly adminPassword: SecretManagerSecret;
  readonly smtpHost: SecretManagerSecret;
  readonly smtpUser: SecretManagerSecret;
  readonly smtpPassword: SecretManagerSecret;
  readonly smtpFromEmail: SecretManagerSecret;
  readonly versions: SecretManagerSecretVersion[];

  constructor(scope: Construct, id: string, config: KeilaSecretsConfig) {
    super(scope, id);
    this.versions = [];

    const hashidSaltPassword = new Password(this, "hashid-salt-pwd", {
      length: 32,
      special: false,
    });

    const mkSecret = (name: string, secretId: string, data: string) => {
      const secret = new SecretManagerSecret(this, name, {
        secretId,
        replication: { auto: {} },
      });
      this.versions.push(
        new SecretManagerSecretVersion(this, `${name}-version`, {
          secret: secret.id,
          secretData: data,
        })
      );
      return secret;
    };

    this.dbUrl = mkSecret("keila-db-url", "keila-db-url", config.connectionString);
    this.secretKeyBase = mkSecret("keila-secret-key-base", "keila-secret-key-base", config.secretKeyBase);
    this.hashidSalt = mkSecret("keila-hashid-salt", "keila-hashid-salt", hashidSaltPassword.result);
    this.adminEmail = mkSecret("keila-admin-email", "keila-admin-email", config.adminEmail);
    this.adminPassword = mkSecret("keila-admin-password", "keila-admin-password", config.adminPassword);
    this.smtpHost = mkSecret("keila-smtp-host", "keila-smtp-host", config.smtpHost);
    this.smtpUser = mkSecret("keila-smtp-user", "keila-smtp-user", config.smtpUser);
    this.smtpPassword = mkSecret("keila-smtp-password", "keila-smtp-password", config.smtpPassword);
    this.smtpFromEmail = mkSecret("keila-smtp-from-email", "keila-smtp-from-email", config.smtpFromEmail);
  }
}
