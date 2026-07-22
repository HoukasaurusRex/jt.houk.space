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
        {
          // Keila is Elixir/Phoenix; none of these paths can ever exist here.
          // Scanners probing for them are pure noise (WordPress/PHP/VCS recon).
          action: "block",
          expression: [
            'http.request.uri.path contains "wp-includes"',
            'http.request.uri.path contains "wp-admin"',
            'http.request.uri.path contains "wp-content"',
            'http.request.uri.path contains "xmlrpc.php"',
            'http.request.uri.path contains "wlwmanifest"',
            'http.request.uri.path contains "/.git"',
            'http.request.uri.path contains "/.env"',
          ].join(" or "),
          description: "Block WordPress/PHP/VCS recon paths (no such stack here)",
          enabled: true,
        },
      ],
    });

    // Free-tier rate limit: a generic burst-of-requests catch-all for scanner
    // patterns not covered by the named rules above. 20 req/10s per IP is well
    // above any normal page load (a handful of requests) but well below a
    // scanner sweeping a dozen paths in under two seconds.
    new Ruleset(this, "rate-limit", {
      zoneId: config.zoneId,
      name: "rate-limit-scanners",
      description: "Block IPs bursting requests (automated scanning)",
      kind: "zone",
      phase: "http_ratelimit",
      rules: [
        {
          action: "block",
          expression: "true",
          description: "Block burst traffic from a single IP",
          enabled: true,
          ratelimit: {
            characteristics: ["ip.src"],
            period: 10,
            requestsPerPeriod: 20,
            mitigationTimeout: 600,
          },
        },
      ],
    });

    new BotManagement(this, "bot-fight-mode", {
      zoneId: config.zoneId,
      // Fight Mode: behavioral/fingerprint heuristics that catch crawlers
      // spoofing a normal browser UA to evade the rules above. Requires
      // enableJs (Cloudflare rejects Fight Mode without it).
      fightMode: true,
      enableJs: true,
      // Cloudflare-maintained blocklist of known AI scraper/training crawlers;
      // stays current without us hand-maintaining a user-agent list.
      aiBotsProtection: "block",
    });
  }
}
