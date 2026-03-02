import { App, TerraformStack, TerraformVariable } from "cdktf";
import { Construct } from "constructs";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { RandomProvider } from "@cdktf/provider-random/lib/provider";
import { GcpApis } from "./constructs/apis";
import { KeilaNetworking } from "./constructs/networking";
import { KeilaDatabase } from "./constructs/database";
import { KeilaSecrets } from "./constructs/secrets";
import { KeilaStorage } from "./constructs/storage";
import { KeilaIam } from "./constructs/iam";

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

    new RandomProvider(this, "random");

    const apis = new GcpApis(this, "apis");

    const networking = new KeilaNetworking(this, "networking", {
      region: this.region.stringValue,
    });
    networking.node.addDependency(apis);

    const database = new KeilaDatabase(this, "database", {
      region: this.region.stringValue,
      networkId: networking.network.id,
    });
    database.node.addDependency(networking);

    const secrets = new KeilaSecrets(this, "secrets", {
      connectionString: database.connectionString,
    });
    secrets.node.addDependency(database);

    const storage = new KeilaStorage(this, "storage", {
      region: this.region.stringValue,
    });
    storage.node.addDependency(apis);

    const iam = new KeilaIam(this, "iam", {
      secrets,
      storageBucket: storage.bucket,
    });
    iam.node.addDependency(secrets);
    iam.node.addDependency(storage);
  }
}

const app = new App();
new KeilaStack(app, "keila");
app.synth();
