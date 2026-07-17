import { Construct } from "constructs";
import { CloudRunDomainMapping } from "@cdktf/provider-google/lib/cloud-run-domain-mapping";
import { DnsRecord } from "@cdktf/provider-cloudflare/lib/dns-record";
import { Ruleset } from "@cdktf/provider-cloudflare/lib/ruleset";
import { BotManagement } from "@cdktf/provider-cloudflare/lib/bot-management";

// Matches Cloudflare's own verified-bot detection plus the UA tokens used by
// crawlers that don't register for reverse-DNS verification (mail.houk.space
// has no content worth indexing or training on).
const BOT_BLOCK_EXPRESSION = [
  "(cf.client.bot)",
  '(http.user_agent contains "ClaudeBot")',
  '(http.user_agent contains "Claude-Web")',
  '(http.user_agent contains "anthropic-ai")',
  '(http.user_agent contains "GPTBot")',
  '(http.user_agent contains "CCBot")',
  '(http.user_agent contains "Bytespider")',
  '(http.user_agent contains "PerplexityBot")',
].join(" or ");

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

    new Ruleset(this, "bot-block", {
      zoneId: config.zoneId,
      name: "block-crawlers",
      description: "Block search/AI crawlers and bots at the edge; this domain is not meant to be indexed",
      kind: "zone",
      phase: "http_request_firewall_custom",
      rules: [
        {
          action: "block",
          expression: BOT_BLOCK_EXPRESSION,
          description: "Block known crawlers/bots",
          enabled: true,
        },
      ],
    });

    // Bot Fight Mode uses behavioral/fingerprint heuristics rather than
    // self-declared user-agents, so it catches crawlers that spoof a normal
    // browser UA to evade the named-bot rule above. Available on all plans,
    // unlike Super Bot Fight Mode (sbfm_*), which requires Pro+.
    new BotManagement(this, "bot-fight-mode", {
      zoneId: config.zoneId,
      fightMode: true,
    });
  }
}
