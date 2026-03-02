import { Testing, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { GcpApis, REQUIRED_APIS } from "../constructs/apis";

describe("GcpApis", () => {
  let synth: Record<string, unknown>;

  beforeAll(() => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    new GoogleProvider(stack, "google", { project: "test-project" });
    new GcpApis(stack, "apis");
    synth = JSON.parse(Testing.synth(stack));
  });

  const services = () =>
    (synth.resource as Record<string, Record<string, unknown>>)
      .google_project_service;

  it("enables all required APIs", () => {
    expect(services()).toBeDefined();
    for (const api of REQUIRED_APIS) {
      const found = Object.values(services()).some(
        (v) => (v as Record<string, unknown>).service === api
      );
      expect(found).toBe(true);
    }
  });

  it("sets disable_on_destroy to false for all API resources", () => {
    for (const resource of Object.values(services())) {
      expect((resource as Record<string, unknown>).disable_on_destroy).toBe(false);
    }
  });
});
