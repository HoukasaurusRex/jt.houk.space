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

  constructor(scope: Construct, id: string, config: KeilaSecretsConfig) {
    super(scope, id);

    const hashidSaltPassword = new Password(this, "hashid-salt-pwd", {
      length: 32,
      special: false,
    });

this.dbUrl = new SecretManagerSecret(this, "keila-db-url", {
      secretId: "keila-db-url",
      replication: { auto: {} },
    });
    new SecretManagerSecretVersion(this, "keila-db-url-version", {
      secret: this.dbUrl.id,
      secretData: config.connectionString,
    });

    this.secretKeyBase = new SecretManagerSecret(this, "keila-secret-key-base", {
      secretId: "keila-secret-key-base",
      replication: { auto: {} },
    });
    new SecretManagerSecretVersion(this, "keila-secret-key-base-version", {
      secret: this.secretKeyBase.id,
      secretData: config.secretKeyBase,
    });

    this.hashidSalt = new SecretManagerSecret(this, "keila-hashid-salt", {
      secretId: "keila-hashid-salt",
      replication: { auto: {} },
    });
    new SecretManagerSecretVersion(this, "keila-hashid-salt-version", {
      secret: this.hashidSalt.id,
      secretData: hashidSaltPassword.result,
    });

    this.adminEmail = new SecretManagerSecret(this, "keila-admin-email", {
      secretId: "keila-admin-email",
      replication: { auto: {} },
    });
    new SecretManagerSecretVersion(this, "keila-admin-email-version", {
      secret: this.adminEmail.id,
      secretData: config.adminEmail,
    });

    this.adminPassword = new SecretManagerSecret(this, "keila-admin-password", {
      secretId: "keila-admin-password",
      replication: { auto: {} },
    });
    new SecretManagerSecretVersion(this, "keila-admin-password-version", {
      secret: this.adminPassword.id,
      secretData: config.adminPassword,
    });

    this.smtpHost = new SecretManagerSecret(this, "keila-smtp-host", {
      secretId: "keila-smtp-host",
      replication: { auto: {} },
    });
    new SecretManagerSecretVersion(this, "keila-smtp-host-version", {
      secret: this.smtpHost.id,
      secretData: config.smtpHost,
    });

    this.smtpUser = new SecretManagerSecret(this, "keila-smtp-user", {
      secretId: "keila-smtp-user",
      replication: { auto: {} },
    });
    new SecretManagerSecretVersion(this, "keila-smtp-user-version", {
      secret: this.smtpUser.id,
      secretData: config.smtpUser,
    });

    this.smtpPassword = new SecretManagerSecret(this, "keila-smtp-password", {
      secretId: "keila-smtp-password",
      replication: { auto: {} },
    });
    new SecretManagerSecretVersion(this, "keila-smtp-password-version", {
      secret: this.smtpPassword.id,
      secretData: config.smtpPassword,
    });

    this.smtpFromEmail = new SecretManagerSecret(this, "keila-smtp-from-email", {
      secretId: "keila-smtp-from-email",
      replication: { auto: {} },
    });
    new SecretManagerSecretVersion(this, "keila-smtp-from-email-version", {
      secret: this.smtpFromEmail.id,
      secretData: config.smtpFromEmail,
    });
  }
}
