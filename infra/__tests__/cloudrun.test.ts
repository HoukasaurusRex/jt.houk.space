import { Testing, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { RandomProvider } from "@cdktf/provider-random/lib/provider";
import { KeilaCloudRun } from "../constructs/cloudrun";
import { KeilaSecrets } from "../constructs/secrets";
import { KeilaStorage } from "../constructs/storage";
import { KeilaIam } from "../constructs/iam";

describe("KeilaCloudRun", () => {
  let synth: Record<string, unknown>;

  beforeAll(() => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    new GoogleProvider(stack, "google", { project: "test-project" });
    new RandomProvider(stack, "random");
    const secrets = new KeilaSecrets(stack, "secrets", {
      connectionString: "postgres://keila:pass@10.0.0.2/keila",
    });
    const storage = new KeilaStorage(stack, "storage", { region: "us-central1" });
    const iam = new KeilaIam(stack, "iam", { secrets, storageBucket: storage.bucket });
    new KeilaCloudRun(stack, "cloudrun", {
      region: "us-central1",
      domain: "mail.houk.space",
      serviceAccountEmail: iam.serviceAccountEmail,
      secrets,
      storageBucket: storage.bucket,
    });
    synth = JSON.parse(Testing.synth(stack));
  });

  const resources = () =>
    synth.resource as Record<string, Record<string, unknown>>;

  it("creates a Cloud Run V2 service", () => {
    const services = resources().google_cloud_run_v2_service;
    expect(services).toBeDefined();
  });

  it("uses the pentacent/keila image", () => {
    const services = resources().google_cloud_run_v2_service;
    const svc = Object.values(services)[0] as Record<string, unknown>;
    const template = svc.template as Record<string, unknown>;
    const containers = template.containers as Record<string, unknown>[];
    expect(String(containers[0].image)).toContain("pentacent/keila");
  });

  it("does not set PORT env var (reserved by Cloud Run V2)", () => {
    const services = resources().google_cloud_run_v2_service;
    const svc = Object.values(services)[0] as Record<string, unknown>;
    const template = svc.template as Record<string, unknown>;
    const containers = template.containers as Record<string, unknown>[];
    const envs = containers[0].env as Record<string, unknown>[];
    const portEnv = envs.find((e) => e.name === "PORT");
    expect(portEnv).toBeUndefined();
  });

  it("injects SECRET_KEY_BASE from Secret Manager", () => {
    const services = resources().google_cloud_run_v2_service;
    const svc = Object.values(services)[0] as Record<string, unknown>;
    const template = svc.template as Record<string, unknown>;
    const containers = template.containers as Record<string, unknown>[];
    const envs = containers[0].env as Record<string, unknown>[];
    const secretEnv = envs.find((e) => e.name === "SECRET_KEY_BASE");
    expect(secretEnv).toBeDefined();
    expect(
      (secretEnv!.value_source as Record<string, unknown>).secret_key_ref
    ).toBeDefined();
  });

  it("mounts the GCS uploads bucket as a volume", () => {
    const services = resources().google_cloud_run_v2_service;
    const svc = Object.values(services)[0] as Record<string, unknown>;
    const template = svc.template as Record<string, unknown>;
    const volumes = template.volumes as Record<string, unknown>[];
    const uploadsVol = volumes?.find((v) => v.name === "uploads");
    expect(uploadsVol).toBeDefined();
    expect(
      (uploadsVol!.gcs as Record<string, unknown>).bucket
    ).toBeDefined();
  });

  it("enables SSL for Neon database connection", () => {
    const services = resources().google_cloud_run_v2_service;
    const svc = Object.values(services)[0] as Record<string, unknown>;
    const template = svc.template as Record<string, unknown>;
    const containers = template.containers as Record<string, unknown>[];
    const envs = containers[0].env as Record<string, unknown>[];
    const sslEnv = envs.find((e) => e.name === "DB_ENABLE_SSL");
    expect(sslEnv).toBeDefined();
    expect(sslEnv!.value).toBe("true");
  });

  it("grants public invoker access to allUsers", () => {
    const iamMembers = resources().google_cloud_run_v2_service_iam_member;
    expect(iamMembers).toBeDefined();
    const invoker = Object.values(iamMembers).find(
      (m) => (m as Record<string, unknown>).role === "roles/run.invoker"
    );
    expect(invoker).toBeDefined();
    expect((invoker as Record<string, unknown>).member).toBe("allUsers");
  });

  it("exposes the service URL as an output", () => {
    const outputs = synth.output as Record<string, unknown>;
    const urlOutput = Object.entries(outputs ?? {}).find(([k]) =>
      k.toLowerCase().includes("url")
    );
    expect(urlOutput).toBeDefined();
  });
});
