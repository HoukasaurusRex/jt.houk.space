import { Testing, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { RandomProvider } from "@cdktf/provider-random/lib/provider";
import { KeilaSecrets } from "../constructs/secrets";

describe("KeilaSecrets", () => {
  let synth: Record<string, unknown>;

  beforeAll(() => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    new GoogleProvider(stack, "google", { project: "test-project" });
    new RandomProvider(stack, "random");
    new KeilaSecrets(stack, "secrets", {
      connectionString: "postgres://keila:pass@localhost/keila",
      secretKeyBase: "a".repeat(64),
      adminPassword: "test-password-123",
      smtpPassword: "test-password",
    });
    synth = JSON.parse(Testing.synth(stack));
  });

  const resources = () =>
    synth.resource as Record<string, Record<string, unknown>>;

  it("creates 5 google_secret_manager_secret resources", () => {
    const secrets = resources().google_secret_manager_secret;
    expect(secrets).toBeDefined();
    expect(Object.keys(secrets)).toHaveLength(5);
  });

  it("creates 5 google_secret_manager_secret_version resources", () => {
    const versions = resources().google_secret_manager_secret_version;
    expect(versions).toBeDefined();
    expect(Object.keys(versions)).toHaveLength(5);
  });

  it("creates random_password resources for generated secrets", () => {
    const passwords = resources().random_password;
    expect(passwords).toBeDefined();
    expect(Object.keys(passwords)).toHaveLength(1);
  });

  it("all secrets use automatic replication", () => {
    const secrets = resources().google_secret_manager_secret;
    for (const secret of Object.values(secrets)) {
      const s = secret as Record<string, unknown>;
      const replication = s.replication as Record<string, unknown>;
      expect(replication).toBeDefined();
      expect(replication.auto).toBeDefined();
    }
  });

  it("creates the keila-db-url secret", () => {
    const secrets = resources().google_secret_manager_secret;
    const dbUrlSecret = Object.values(secrets).find(
      (s) => (s as Record<string, unknown>).secret_id === "keila-db-url"
    );
    expect(dbUrlSecret).toBeDefined();
  });

  it("creates the keila-secret-key-base secret", () => {
    const secrets = resources().google_secret_manager_secret;
    const keyBaseSecret = Object.values(secrets).find(
      (s) =>
        (s as Record<string, unknown>).secret_id === "keila-secret-key-base"
    );
    expect(keyBaseSecret).toBeDefined();
  });

it("creates the keila-hashid-salt secret with a 32-char password", () => {
    const passwords = resources().random_password;
    const hashidPwd = Object.values(passwords).find(
      (p) => (p as Record<string, unknown>).length === 32
    );
    expect(hashidPwd).toBeDefined();
    expect((hashidPwd as Record<string, unknown>).special).toBe(false);
  });

it("keeps only the genuinely-sensitive secrets", () => {
    const secrets = resources().google_secret_manager_secret;
    const secretIds = Object.values(secrets).map(
      (s) => (s as Record<string, unknown>).secret_id
    );
    // Sensitive values stay in Secret Manager
    expect(secretIds).toContain("keila-db-url");
    expect(secretIds).toContain("keila-admin-password");
    expect(secretIds).toContain("keila-smtp-password");
    // Non-secret config is NOT stored here (plain env vars instead)
    expect(secretIds).not.toContain("keila-admin-email");
    expect(secretIds).not.toContain("keila-smtp-host");
    expect(secretIds).not.toContain("keila-smtp-user");
    expect(secretIds).not.toContain("keila-smtp-from-email");
  });
});
