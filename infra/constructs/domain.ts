import { Construct } from "constructs";
import { TerraformOutput } from "cdktf";
import { CloudRunDomainMapping } from "@cdktf/provider-google/lib/cloud-run-domain-mapping";

export interface KeilaDomainConfig {
  domain: string;
  serviceId: string;
  region: string;
}

export class KeilaDomain extends Construct {
  readonly domainMapping: CloudRunDomainMapping;

  constructor(scope: Construct, id: string, config: KeilaDomainConfig) {
    super(scope, id);

    this.domainMapping = new CloudRunDomainMapping(this, "domain-mapping", {
      name: config.domain,
      location: config.region,
      spec: {
        routeName: config.serviceId,
      },
    });

    new TerraformOutput(this, "dns_instructions", {
      value: `Add a CNAME record for ${config.domain} pointing to ghs.googlehosted.com`,
      description: "DNS records to configure for the custom domain",
    });
  }
}
