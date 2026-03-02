import { Testing, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { RandomProvider } from "@cdktf/provider-random/lib/provider";
import { KeilaDatabase } from "../constructs/database";

describe("KeilaDatabase", () => {
  let synth: Record<string, unknown>;

  beforeAll(() => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    new GoogleProvider(stack, "google", { project: "test-project" });
    new RandomProvider(stack, "random");
    new KeilaDatabase(stack, "database", {
      region: "us-central1",
      networkId: "projects/test-project/global/networks/keila-vpc",
    });
    synth = JSON.parse(Testing.synth(stack));
  });

  const resources = () =>
    synth.resource as Record<string, Record<string, unknown>>;

  it("creates a PostgreSQL Cloud SQL instance", () => {
    const instances = resources().google_sql_database_instance;
    expect(instances).toBeDefined();
    const instance = Object.values(instances)[0] as Record<string, unknown>;
    expect(String(instance.database_version)).toMatch(/POSTGRES/);
  });

  it("disables public IPv4 on the SQL instance", () => {
    const instances = resources().google_sql_database_instance;
    const instance = Object.values(instances)[0] as Record<string, unknown>;
    const settings = instance.settings as Record<string, unknown>;
    const ipConfig = settings.ip_configuration as Record<string, unknown>;
    expect(ipConfig.ipv4_enabled).toBe(false);
  });

  it("creates a database named keila", () => {
    const dbs = resources().google_sql_database;
    expect(dbs).toBeDefined();
    const db = Object.values(dbs)[0] as Record<string, unknown>;
    expect(db.name).toBe("keila");
  });

  it("creates a SQL user", () => {
    const users = resources().google_sql_user;
    expect(users).toBeDefined();
  });

  it("generates a random password for the SQL user", () => {
    const passwords = resources().random_password;
    expect(passwords).toBeDefined();
  });

  it("exposes a sensitive DB connection string output", () => {
    const outputs = synth.output as Record<string, unknown>;
    const connStringOutput = Object.entries(outputs ?? {}).find(([k]) =>
      k.includes("keila_db_connection_string")
    );
    expect(connStringOutput).toBeDefined();
    expect(
      (connStringOutput![1] as Record<string, unknown>).sensitive
    ).toBe(true);
  });
});
