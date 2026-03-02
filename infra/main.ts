import { App, TerraformStack, TerraformVariable } from "cdktf";
import { Construct } from "constructs";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";

export class KeilaStack extends TerraformStack {
  readonly projectId: TerraformVariable;
  readonly region: TerraformVariable;
  readonly domain: TerraformVariable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.projectId = new TerraformVariable(this, "project_id", {
      type: "string",
      description: "GCP project ID",
      nullable: false,
    });

    this.region = new TerraformVariable(this, "region", {
      type: "string",
      default: "us-central1",
      description: "GCP region for all resources",
    });

    this.domain = new TerraformVariable(this, "domain", {
      type: "string",
      description: "Custom domain for Keila (e.g. mail.houk.space)",
      nullable: false,
    });

    new GoogleProvider(this, "google", {
      project: this.projectId.stringValue,
      region: this.region.stringValue,
    });
  }
}

const app = new App();
new KeilaStack(app, "keila");
app.synth();
