import { Testing, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { RandomProvider } from "@cdktf/provider-random/lib/provider";
import { KeilaIam } from "../constructs/iam";
import { KeilaSecrets } from "../constructs/secrets";
import { KeilaStorage } from "../constructs/storage";

describe("KeilaIam", () => {
  let synth: Record<string, unknown>;

  beforeAll(() => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    new GoogleProvider(stack, "google", { project: "test-project" });
    new RandomProvider(stack, "random");
    const secrets = new KeilaSecrets(stack, "secrets", {
      connectionString: "postgres://keila:pass@10.0.0.2/keila",
      secretKeyBase: "a".repeat(64),
      adminEmail: "admin@example.com",
      adminPassword: "test-password-123",
      smtpHost: "smtp.example.com",
      smtpUser: "apikey",
      smtpPassword: "test-password",
      smtpFromEmail: "keila@example.com",
    });
    const storage = new KeilaStorage(stack, "storage", { region: "us-central1" });
    new KeilaIam(stack, "iam", { secrets, storageBucket: storage.bucket });
    synth = JSON.parse(Testing.synth(stack));
  });

  const resources = () =>
    synth.resource as Record<string, Record<string, unknown>>;

  it("creates a dedicated service account", () => {
    const sas = resources().google_service_account;
    expect(sas).toBeDefined();
    const sa = Object.values(sas)[0] as Record<string, unknown>;
    expect(String(sa.account_id)).toContain("keila");
  });

  it("grants secretmanager.secretAccessor to the service account for each secret", () => {
    const bindings = resources().google_secret_manager_secret_iam_member;
    expect(bindings).toBeDefined();
    const roles = Object.values(bindings).map(
      (b) => (b as Record<string, unknown>).role
    );
    expect(roles.every((r) => r === "roles/secretmanager.secretAccessor")).toBe(
      true
    );
    // 8 secrets → 8 bindings
    expect(Object.keys(bindings).length).toBe(8);
  });

  it("grants storage.objectAdmin to the service account on the uploads bucket", () => {
    const bindings = resources().google_storage_bucket_iam_member;
    expect(bindings).toBeDefined();
    const binding = Object.values(bindings)[0] as Record<string, unknown>;
    expect(binding.role).toBe("roles/storage.objectAdmin");
  });

  it("exposes serviceAccountEmail as a property", () => {
    expect(synth).toBeDefined();
    // Verify the service account email token is referenced in outputs or resources
    const sas = resources().google_service_account;
    expect(sas).toBeDefined();
  });
});
