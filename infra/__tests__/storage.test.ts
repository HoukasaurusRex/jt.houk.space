import { Testing, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { KeilaStorage } from "../constructs/storage";

describe("KeilaStorage", () => {
  let synth: Record<string, unknown>;

  beforeAll(() => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    new GoogleProvider(stack, "google", { project: "test-project" });
    new KeilaStorage(stack, "storage", { region: "us-central1" });
    synth = JSON.parse(Testing.synth(stack));
  });

  const resources = () =>
    synth.resource as Record<string, Record<string, unknown>>;

  it("creates a google_storage_bucket resource", () => {
    const buckets = resources().google_storage_bucket;
    expect(buckets).toBeDefined();
    expect(Object.keys(buckets)).toHaveLength(1);
  });

  it("sets uniform_bucket_level_access to true", () => {
    const buckets = resources().google_storage_bucket;
    const bucket = Object.values(buckets)[0] as Record<string, unknown>;
    expect(bucket.uniform_bucket_level_access).toBe(true);
  });

  it("enables versioning", () => {
    const buckets = resources().google_storage_bucket;
    const bucket = Object.values(buckets)[0] as Record<string, unknown>;
    const versioning = bucket.versioning as Record<string, unknown>;
    expect(versioning).toBeDefined();
    expect(versioning.enabled).toBe(true);
  });

  it("sets force_destroy to false", () => {
    const buckets = resources().google_storage_bucket;
    const bucket = Object.values(buckets)[0] as Record<string, unknown>;
    expect(bucket.force_destroy).toBe(false);
  });

  it("uppercases the region for the bucket location", () => {
    const buckets = resources().google_storage_bucket;
    const bucket = Object.values(buckets)[0] as Record<string, unknown>;
    expect(bucket.location).toBe("US-CENTRAL1");
  });

  it("configures a lifecycle rule to abort incomplete multipart uploads after 1 day", () => {
    const buckets = resources().google_storage_bucket;
    const bucket = Object.values(buckets)[0] as Record<string, unknown>;
    const lifecycleRules = bucket.lifecycle_rule as Array<Record<string, unknown>>;
    expect(lifecycleRules).toBeDefined();
    expect(lifecycleRules).toHaveLength(1);
    const rule = lifecycleRules[0];
    const action = rule.action as Record<string, unknown>;
    expect(action.type).toBe("AbortIncompleteMultipartUpload");
    const condition = rule.condition as Record<string, unknown>;
    expect(condition.age).toBe(1);
  });

  it("names the bucket keila-uploads", () => {
    const buckets = resources().google_storage_bucket;
    const bucket = Object.values(buckets)[0] as Record<string, unknown>;
    expect(bucket.name).toBe("keila-uploads");
  });
});
