import { Construct } from "constructs";
import { ComputeNetwork } from "@cdktf/provider-google/lib/compute-network";
import { ComputeSubnetwork } from "@cdktf/provider-google/lib/compute-subnetwork";
import { ComputeGlobalAddress } from "@cdktf/provider-google/lib/compute-global-address";
import { ServiceNetworkingConnection } from "@cdktf/provider-google/lib/service-networking-connection";
import { VpcAccessConnector } from "@cdktf/provider-google/lib/vpc-access-connector";

export interface KeilaNetworkingConfig {
  region: string;
}

export class KeilaNetworking extends Construct {
  readonly network: ComputeNetwork;
  readonly subnet: ComputeSubnetwork;
  readonly connector: VpcAccessConnector;

  constructor(scope: Construct, id: string, config: KeilaNetworkingConfig) {
    super(scope, id);

    this.network = new ComputeNetwork(this, "network", {
      name: "keila-vpc",
      autoCreateSubnetworks: false,
    });

    this.subnet = new ComputeSubnetwork(this, "subnet", {
      name: "keila-subnet",
      region: config.region,
      network: this.network.id,
      ipCidrRange: "10.0.0.0/24",
    });

    const privateIpRange = new ComputeGlobalAddress(this, "private-ip-range", {
      name: "keila-private-ip-range",
      purpose: "VPC_PEERING",
      addressType: "INTERNAL",
      prefixLength: 16,
      network: this.network.id,
    });

    new ServiceNetworkingConnection(this, "private-service-connection", {
      network: this.network.id,
      service: "servicenetworking.googleapis.com",
      reservedPeeringRanges: [privateIpRange.name],
    });

    this.connector = new VpcAccessConnector(this, "connector", {
      name: "keila-connector",
      region: config.region,
      subnet: {
        name: this.subnet.name,
      },
      minInstances: 2,
      maxInstances: 3,
    });
  }
}
