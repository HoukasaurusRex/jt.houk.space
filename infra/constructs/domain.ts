import { Construct } from "constructs";
import { CloudRunDomainMapping } from "@cdktf/provider-google/lib/cloud-run-domain-mapping";
import { DnsRecord } from "@cdktf/provider-cloudflare/lib/dns-record";

export interface KeilaDomainConfig {
  domain: string;
  serviceName: string;
  region: string;
  projectId: string;
  zoneId: string;
}

export class KeilaDomain extends Construct {
  readonly record: DnsRecord;
  readonly domainMapping: CloudRunDomainMapping;

  constructor(scope: Construct, id: string, config: KeilaDomainConfig) {
    super(scope, id);

    this.domainMapping = new CloudRunDomainMapping(this, "mapping", {
      name: config.domain,
      location: config.region,
      metadata: { namespace: config.projectId },
      spec: { routeName: config.serviceName },
    });

    // Cloud Run domain mappings always use ghs.googlehosted.com as the CNAME target
    this.record = new DnsRecord(this, "record", {
      zoneId: config.zoneId,
      name: config.domain,
      content: "ghs.googlehosted.com",
      type: "CNAME",
      proxied: true,
      ttl: 1,
    });
  }
}
