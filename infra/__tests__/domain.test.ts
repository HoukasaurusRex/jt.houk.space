import { Testing, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { KeilaDomain } from "../constructs/domain";

describe("KeilaDomain", () => {
  let synth: Record<string, unknown>;

  beforeAll(() => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    new GoogleProvider(stack, "google", { project: "test-project" });
    new KeilaDomain(stack, "domain", {
      domain: "mail.houk.space",
      serviceId: "projects/p/locations/us-central1/services/keila",
      region: "us-central1",
    });
    synth = JSON.parse(Testing.synth(stack));
  });

  const resources = () =>
    synth.resource as Record<string, Record<string, unknown>>;

  it("creates a google_cloud_run_domain_mapping resource", () => {
    const mappings = resources().google_cloud_run_domain_mapping;
    expect(mappings).toBeDefined();
  });

  it("sets the domain name correctly", () => {
    const mappings = resources().google_cloud_run_domain_mapping;
    const mapping = Object.values(mappings)[0] as Record<string, unknown>;
    expect(mapping.name).toBe("mail.houk.space");
  });

  it("references the Cloud Run service", () => {
    const mappings = resources().google_cloud_run_domain_mapping;
    const mapping = Object.values(mappings)[0] as Record<string, unknown>;
    const spec = mapping.spec as Record<string, unknown>;
    expect(spec).toBeDefined();
    expect(String(spec.route_name)).toContain("keila");
  });

  it("exposes a DNS instructions output", () => {
    const outputs = synth.output as Record<string, unknown>;
    const dnsOutput = Object.entries(outputs ?? {}).find(([k]) =>
      k.toLowerCase().includes("dns")
    );
    expect(dnsOutput).toBeDefined();
    const outputVal = dnsOutput![1] as Record<string, unknown>;
    expect(String(outputVal.value)).toContain("ghs.googlehosted.com");
  });
});
