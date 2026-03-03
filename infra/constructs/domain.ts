import { Construct } from "constructs";
import { DnsRecord } from "@cdktf/provider-cloudflare/lib/dns-record";

export interface KeilaDomainConfig {
  domain: string;
  serviceUrl: string;
  zoneId: string;
}

export class KeilaDomain extends Construct {
  readonly record: DnsRecord;

  constructor(scope: Construct, id: string, config: KeilaDomainConfig) {
    super(scope, id);

    this.record = new DnsRecord(this, "record", {
      zoneId: config.zoneId,
      name: config.domain,
      content: config.serviceUrl,
      type: "CNAME",
      proxied: true,
      ttl: 1, // 1 = automatic when proxied
    });
  }
}
