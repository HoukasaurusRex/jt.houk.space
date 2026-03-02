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
    });
    synth = JSON.parse(Testing.synth(stack));
  });

  const resources = () =>
    synth.resource as Record<string, Record<string, unknown>>;

  it("creates 8 google_secret_manager_secret resources", () => {
    const secrets = resources().google_secret_manager_secret;
    expect(secrets).toBeDefined();
    expect(Object.keys(secrets)).toHaveLength(8);
  });

  it("creates 8 google_secret_manager_secret_version resources", () => {
    const versions = resources().google_secret_manager_secret_version;
    expect(versions).toBeDefined();
    expect(Object.keys(versions)).toHaveLength(8);
  });

  it("creates random_password resources for generated secrets", () => {
    const passwords = resources().random_password;
    expect(passwords).toBeDefined();
    expect(Object.keys(passwords)).toHaveLength(3);
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

  it("creates the keila-secret-key-base secret with a 64-char password", () => {
    const secrets = resources().google_secret_manager_secret;
    const keyBaseSecret = Object.values(secrets).find(
      (s) =>
        (s as Record<string, unknown>).secret_id === "keila-secret-key-base"
    );
    expect(keyBaseSecret).toBeDefined();

    const passwords = resources().random_password;
    const keyBasePwd = Object.values(passwords).find(
      (p) => (p as Record<string, unknown>).length === 64
    );
    expect(keyBasePwd).toBeDefined();
    expect((keyBasePwd as Record<string, unknown>).special).toBe(false);
  });

  it("creates the keila-hashid-salt secret with a 32-char password", () => {
    const passwords = resources().random_password;
    const hashidPwd = Object.values(passwords).find(
      (p) => (p as Record<string, unknown>).length === 32
    );
    expect(hashidPwd).toBeDefined();
    expect((hashidPwd as Record<string, unknown>).special).toBe(false);
  });

  it("creates the keila-admin-password secret with a 16-char password", () => {
    const passwords = resources().random_password;
    const adminPwd = Object.values(passwords).find(
      (p) => (p as Record<string, unknown>).length === 16
    );
    expect(adminPwd).toBeDefined();
    expect((adminPwd as Record<string, unknown>).special).toBe(false);
  });

  it("creates placeholder secrets for smtp and admin email", () => {
    const secrets = resources().google_secret_manager_secret;
    const secretIds = Object.values(secrets).map(
      (s) => (s as Record<string, unknown>).secret_id
    );
    expect(secretIds).toContain("keila-admin-email");
    expect(secretIds).toContain("keila-smtp-host");
    expect(secretIds).toContain("keila-smtp-password");
    expect(secretIds).toContain("keila-smtp-from-email");
  });
});
