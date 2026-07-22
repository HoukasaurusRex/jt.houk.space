import { Testing, TerraformStack } from "cdktf";
import { CloudflareProvider } from "@cdktf/provider-cloudflare/lib/provider";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { KeilaDomain } from "../constructs/domain";

describe("KeilaDomain", () => {
  let synth: Record<string, unknown>;

  beforeAll(() => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    new CloudflareProvider(stack, "cloudflare");
    new GoogleProvider(stack, "google");
    new KeilaDomain(stack, "domain", {
      domain: "mail.houk.space",
      serviceName: "keila",
      region: "us-central1",
      projectId: "my-project",
      zoneId: "abc123",
    });
    synth = JSON.parse(Testing.synth(stack));
  });

  const resources = () =>
    synth.resource as Record<string, Record<string, unknown>>;

  it("creates a cloudflare_dns_record resource", () => {
    expect(resources().cloudflare_dns_record).toBeDefined();
  });

  it("creates a google_cloud_run_domain_mapping resource", () => {
    expect(resources().google_cloud_run_domain_mapping).toBeDefined();
  });

  it("sets the domain name correctly on the DNS record", () => {
    const record = Object.values(resources().cloudflare_dns_record)[0] as Record<string, unknown>;
    expect(record.name).toBe("mail.houk.space");
  });

  it("creates a CNAME record targeting ghs.googlehosted.com", () => {
    const record = Object.values(resources().cloudflare_dns_record)[0] as Record<string, unknown>;
    expect(record.type).toBe("CNAME");
    expect(record.content).toBe("ghs.googlehosted.com");
  });

  it("enables Cloudflare proxying", () => {
    const record = Object.values(resources().cloudflare_dns_record)[0] as Record<string, unknown>;
    expect(record.proxied).toBe(true);
  });

  it("sets the domain mapping route name to the service name", () => {
    const mapping = Object.values(resources().google_cloud_run_domain_mapping)[0] as Record<string, unknown>;
    const spec = mapping.spec as Record<string, unknown>;
    expect(spec.route_name).toBe("keila");
  });

  const rulesetByPhase = (phase: string) => {
    const rulesets = Object.values(resources().cloudflare_ruleset ?? {}) as Record<string, unknown>[];
    return rulesets.find((r) => r.phase === phase);
  };

  it("creates a Cloudflare ruleset blocking bots/crawlers", () => {
    const ruleset = rulesetByPhase("http_request_firewall_custom");
    expect(ruleset).toBeDefined();
    expect(ruleset!.zone_id).toBe("abc123");
    const rules = ruleset!.rules as Record<string, unknown>[];
    expect(rules[0].action).toBe("block");
    expect(String(rules[0].expression)).toContain("cf.client.bot");
    expect(String(rules[0].expression)).toContain('http.host eq "mail.houk.space"');
  });

  it("blocks known WordPress/PHP/VCS recon paths", () => {
    const ruleset = rulesetByPhase("http_request_firewall_custom");
    const rules = ruleset!.rules as Record<string, unknown>[];
    const pathRule = rules[1];
    expect(pathRule.action).toBe("block");
    expect(String(pathRule.expression)).toContain("wp-includes");
    expect(String(pathRule.expression)).toContain("xmlrpc.php");
    expect(String(pathRule.expression)).toContain("/.git");
    expect(String(pathRule.expression)).toContain("/.env");
  });

  it("rate-limits bursts of requests per IP", () => {
    const ruleset = rulesetByPhase("http_ratelimit");
    expect(ruleset).toBeDefined();
    expect(ruleset!.zone_id).toBe("abc123");
    const rules = ruleset!.rules as Record<string, unknown>[];
    expect(rules[0].action).toBe("block");
    const ratelimit = rules[0].ratelimit as Record<string, unknown>;
    expect(ratelimit.characteristics).toEqual(["ip.src", "cf.colo.id"]);
    expect(ratelimit.requests_per_period).toBe(60);
    expect(ratelimit.period).toBe(10);
  });

  it("enables Cloudflare Bot Fight Mode and AI crawler blocking", () => {
    const botManagement = resources().cloudflare_bot_management;
    expect(botManagement).toBeDefined();
    const bm = Object.values(botManagement)[0] as Record<string, unknown>;
    expect(bm.zone_id).toBe("abc123");
    expect(bm.fight_mode).toBe(true);
    expect(bm.enable_js).toBe(true);
    expect(bm.ai_bots_protection).toBe("block");
  });
});
