import { Testing, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { KeilaMonitoring } from "../constructs/monitoring";

describe("KeilaMonitoring", () => {
  let synth: Record<string, unknown>;

  beforeAll(() => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    new GoogleProvider(stack, "google", { project: "test-project" });
    new KeilaMonitoring(stack, "monitoring", {
      alertEmail: "ops@example.com",
      serviceName: "keila",
    });
    synth = JSON.parse(Testing.synth(stack));
  });

  const resources = () =>
    synth.resource as Record<string, Record<string, unknown>>;

  it("creates a notification channel of type email", () => {
    const channels = resources().google_monitoring_notification_channel;
    expect(channels).toBeDefined();
    const channel = Object.values(channels)[0] as Record<string, unknown>;
    expect(channel.type).toBe("email");
  });

  it("sets the alert email address on the notification channel", () => {
    const channels = resources().google_monitoring_notification_channel;
    const channel = Object.values(channels)[0] as Record<string, unknown>;
    const labels = channel.labels as Record<string, string>;
    expect(labels.email_address).toBe("ops@example.com");
  });

  it("creates an alert policy with 5xx in the display name", () => {
    const policies = resources().google_monitoring_alert_policy;
    expect(policies).toBeDefined();
    const policy = Object.values(policies)[0] as Record<string, unknown>;
    expect(String(policy.display_name)).toContain("5xx");
  });

  it("alert policy references the notification channel", () => {
    const policies = resources().google_monitoring_alert_policy;
    const policy = Object.values(policies)[0] as Record<string, unknown>;
    const channels = policy.notification_channels as unknown[];
    expect(channels).toBeDefined();
    expect(channels.length).toBeGreaterThan(0);
  });
});
