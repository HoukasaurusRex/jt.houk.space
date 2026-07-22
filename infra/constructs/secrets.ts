import { Construct } from "constructs";
import { SecretManagerSecret } from "@cdktf/provider-google/lib/secret-manager-secret";
import { SecretManagerSecretVersion } from "@cdktf/provider-google/lib/secret-manager-secret-version";
import { Password } from "@cdktf/provider-random/lib/password";

export interface KeilaSecretsConfig {
  connectionString: string;
  secretKeyBase: string;
  adminPassword: string;
  smtpPassword: string;
}

export class KeilaSecrets extends Construct {
  readonly dbUrl: SecretManagerSecret;
  readonly secretKeyBase: SecretManagerSecret;
  readonly hashidSalt: SecretManagerSecret;
  readonly adminPassword: SecretManagerSecret;
  readonly smtpPassword: SecretManagerSecret;
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
    this.adminPassword = mkSecret("keila-admin-password", "keila-admin-password", config.adminPassword);
    this.smtpPassword = mkSecret("keila-smtp-password", "keila-smtp-password", config.smtpPassword);
    // Note: MAILER_SMTP_HOST / _USER / _FROM_EMAIL and KEILA_USER (admin login
    // email) are NOT stored here. The SMTP values are public; the admin email
    // is a login identifier (the password stays secret). All are set as plain
    // Cloud Run env vars to keep active secret versions within the free tier.
  }
}
