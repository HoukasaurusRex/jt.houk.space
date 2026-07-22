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
    // below (zone-wide; blocking AI training scrapers doesn't affect search
    // indexing). This rule blocks Cloudflare's broader verified-bot list
    // (search engines included), scoped to just this host since it alone has
    // nothing worth indexing.
    new Ruleset(this, "bot-block", {
      zoneId: config.zoneId,
      name: "block-crawlers",
      description: "Block verified crawlers at the edge; this domain is not meant to be indexed",
      kind: "zone",
      phase: "http_request_firewall_custom",
      rules: [
        {
          action: "block",
          expression: `(http.host eq "${config.domain}") and cf.client.bot`,
          description: "Block verified bots/crawlers on this host only",
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
    // patterns not covered by the named rules above. 60 req/10s per IP gives
    // headroom for a real page load (HTML + JS chunks + images + fonts) while
    // still catching a scanner sweeping a dozen paths in under two seconds.
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
            // cf.colo.id is required: counters are tracked per-colocation,
            // not globally, so Cloudflare rejects characteristics without it.
            characteristics: ["ip.src", "cf.colo.id"],
            period: 10,
            requestsPerPeriod: 60,
            // Free plan is only entitled to a 10s mitigation timeout; a
            // sustained scan just keeps re-tripping this every 10s instead.
            mitigationTimeout: 10,
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
