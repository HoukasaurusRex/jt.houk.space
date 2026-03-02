import { Testing } from "cdktf";
import { KeilaStack } from "../main";

describe("KeilaStack", () => {
  let synthOutput: string;

  beforeAll(() => {
    const app = Testing.app();
    const stack = new KeilaStack(app, "keila-test");
    synthOutput = Testing.synth(stack);
  });

  it("synthesizes without errors", () => {
    expect(synthOutput).toBeTruthy();
  });

  it("includes the Google provider", () => {
    const synth = JSON.parse(synthOutput);
    expect(synth.provider?.google).toBeDefined();
  });

  it("defines project_id as a required string variable", () => {
    const synth = JSON.parse(synthOutput);
    expect(synth.variable?.project_id).toMatchObject({
      type: "string",
    });
  });

  it("defines region variable with default us-central1", () => {
    const synth = JSON.parse(synthOutput);
    expect(synth.variable?.region).toMatchObject({
      default: "us-central1",
    });
  });

  it("defines domain as a required string variable", () => {
    const synth = JSON.parse(synthOutput);
    expect(synth.variable?.domain).toMatchObject({
      type: "string",
    });
  });
});
