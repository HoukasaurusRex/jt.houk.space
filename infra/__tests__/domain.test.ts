import { Testing, TerraformStack } from "cdktf";
import { CloudflareProvider } from "@cdktf/provider-cloudflare/lib/provider";
import { KeilaDomain } from "../constructs/domain";

describe("KeilaDomain", () => {
  let synth: Record<string, unknown>;

  beforeAll(() => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    new CloudflareProvider(stack, "cloudflare");
    new KeilaDomain(stack, "domain", {
      domain: "mail.houk.space",
      serviceUrl: "https://keila-xxxx-uc.a.run.app",
      zoneId: "abc123",
    });
    synth = JSON.parse(Testing.synth(stack));
  });

  const resources = () =>
    synth.resource as Record<string, Record<string, unknown>>;

  it("creates a cloudflare_dns_record resource", () => {
    expect(resources().cloudflare_dns_record).toBeDefined();
  });

  it("sets the domain name correctly", () => {
    const record = Object.values(resources().cloudflare_dns_record)[0] as Record<string, unknown>;
    expect(record.name).toBe("mail.houk.space");
  });

  it("creates a CNAME record with https:// stripped from the Cloud Run URL", () => {
    const record = Object.values(resources().cloudflare_dns_record)[0] as Record<string, unknown>;
    expect(record.type).toBe("CNAME");
    // Fn.trimprefix renders as a Terraform expression token, not a plain string
    expect(JSON.stringify(record.content)).toContain("trimprefix");
  });

  it("enables Cloudflare proxying", () => {
    const record = Object.values(resources().cloudflare_dns_record)[0] as Record<string, unknown>;
    expect(record.proxied).toBe(true);
  });
});
