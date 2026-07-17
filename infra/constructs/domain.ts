import { Construct } from "constructs";
import { CloudRunDomainMapping } from "@cdktf/provider-google/lib/cloud-run-domain-mapping";
import { DnsRecord } from "@cdktf/provider-cloudflare/lib/dns-record";
import { Ruleset } from "@cdktf/provider-cloudflare/lib/ruleset";
import { BotManagement } from "@cdktf/provider-cloudflare/lib/bot-management";

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

    // AI-specific crawlers are handled by Cloudflare's managed ai_bots_protection
    // below; this rule covers Cloudflare's broader verified-bot list (search
    // engines, etc.) since mail.houk.space has nothing worth indexing.
    new Ruleset(this, "bot-block", {
      zoneId: config.zoneId,
      name: "block-crawlers",
      description: "Block verified crawlers at the edge; this domain is not meant to be indexed",
      kind: "zone",
      phase: "http_request_firewall_custom",
      rules: [
        {
          action: "block",
          expression: "cf.client.bot",
          description: "Block verified bots/crawlers",
          enabled: true,
        },
      ],
    });

    new BotManagement(this, "bot-fight-mode", {
      zoneId: config.zoneId,
      // Fight Mode: behavioral/fingerprint heuristics that catch crawlers
      // spoofing a normal browser UA to evade the rules above.
      fightMode: true,
      // Cloudflare-maintained blocklist of known AI scraper/training crawlers;
      // stays current without us hand-maintaining a user-agent list.
      aiBotsProtection: "block",
    });
  }
}
