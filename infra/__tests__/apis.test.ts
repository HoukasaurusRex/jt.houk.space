import { Testing } from "cdktf";
import { KeilaStack } from "../main";
import { GcpApis, REQUIRED_APIS } from "../constructs/apis";

describe("GcpApis", () => {
  let synthOutput: Record<string, unknown>;

  beforeAll(() => {
    const app = Testing.app();
    const stack = new KeilaStack(app, "keila-test");
    new GcpApis(stack, "apis");
    synthOutput = JSON.parse(Testing.synth(stack));
  });

  it("enables all required APIs", () => {
    const services = synthOutput.resource as Record<string, unknown>;
    const googleProjectService = services?.google_project_service as Record<string, unknown>;
    expect(googleProjectService).toBeDefined();

    for (const api of REQUIRED_APIS) {
      const resourceId = api.replace(/\./g, "_").replace(/googleapis_com$/, "api");
      const found = Object.values(googleProjectService).some(
        (v) => (v as Record<string, unknown>).service === api
      );
      expect(found).toBe(true);
    }
  });

  it("sets disable_on_destroy to false for all API resources", () => {
    const services = synthOutput.resource as Record<string, unknown>;
    const googleProjectService = services?.google_project_service as Record<string, unknown>;
    for (const resource of Object.values(googleProjectService)) {
      expect((resource as Record<string, unknown>).disable_on_destroy).toBe(false);
    }
  });
});
