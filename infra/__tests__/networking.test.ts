import { Testing, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { KeilaNetworking } from "../constructs/networking";

describe("KeilaNetworking", () => {
  let synth: Record<string, unknown>;

  beforeAll(() => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    new GoogleProvider(stack, "google", { project: "test-project" });
    new KeilaNetworking(stack, "networking", { region: "us-central1" });
    synth = JSON.parse(Testing.synth(stack));
  });

  const resources = () => synth.resource as Record<string, Record<string, unknown>>;

  it("creates a custom-mode VPC network", () => {
    const networks = resources().google_compute_network;
    expect(networks).toBeDefined();
    const network = Object.values(networks)[0] as Record<string, unknown>;
    expect(network.auto_create_subnetworks).toBe(false);
  });

  it("creates a subnet in the specified region", () => {
    const subnets = resources().google_compute_subnetwork;
    expect(subnets).toBeDefined();
    const subnet = Object.values(subnets)[0] as Record<string, unknown>;
    expect(subnet.region).toBe("us-central1");
    expect(subnet.ip_cidr_range).toBeDefined();
  });

  it("allocates a private IP range for Cloud SQL peering", () => {
    const addresses = resources().google_compute_global_address;
    expect(addresses).toBeDefined();
    const addr = Object.values(addresses)[0] as Record<string, unknown>;
    expect(addr.purpose).toBe("VPC_PEERING");
    expect(addr.address_type).toBe("INTERNAL");
  });

  it("creates a service networking connection for Cloud SQL", () => {
    const connections = resources().google_service_networking_connection;
    expect(connections).toBeDefined();
  });

  it("creates a Serverless VPC Access connector", () => {
    const connectors = resources().google_vpc_access_connector;
    expect(connectors).toBeDefined();
    const connector = Object.values(connectors)[0] as Record<string, unknown>;
    expect(connector.region).toBe("us-central1");
  });
});
