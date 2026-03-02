import { Construct } from "constructs";
import { TerraformOutput } from "cdktf";
import { SqlDatabaseInstance } from "@cdktf/provider-google/lib/sql-database-instance";
import { SqlDatabase } from "@cdktf/provider-google/lib/sql-database";
import { SqlUser } from "@cdktf/provider-google/lib/sql-user";
import { Password } from "@cdktf/provider-random/lib/password";

export interface KeilaDatabaseConfig {
  region: string;
  networkId: string;
}

export class KeilaDatabase extends Construct {
  readonly instance: SqlDatabaseInstance;
  readonly connectionString: string;

  constructor(scope: Construct, id: string, config: KeilaDatabaseConfig) {
    super(scope, id);

    const dbPassword = new Password(this, "db-password", {
      length: 32,
      special: false,
    });

    this.instance = new SqlDatabaseInstance(this, "instance", {
      name: "keila-postgres",
      databaseVersion: "POSTGRES_15",
      region: config.region,
      deletionProtection: true,
      settings: {
        tier: "db-f1-micro",
        ipConfiguration: {
          ipv4Enabled: false,
          privateNetwork: config.networkId,
        },
        backupConfiguration: {
          enabled: true,
          pointInTimeRecoveryEnabled: true,
        },
      },
    });

    new SqlDatabase(this, "db", {
      name: "keila",
      instance: this.instance.name,
    });

    const user = new SqlUser(this, "user", {
      name: "keila",
      instance: this.instance.name,
      password: dbPassword.result,
    });

    // postgres://user:password@host/database
    this.connectionString = `postgres://${user.name}:${dbPassword.result}@${this.instance.privateIpAddress}/keila`;

    new TerraformOutput(this, "keila_db_connection_string", {
      value: this.connectionString,
      sensitive: true,
    });
  }
}
