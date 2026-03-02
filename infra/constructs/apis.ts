import { Construct } from "constructs";
import { ProjectService } from "@cdktf/provider-google/lib/project-service";

export const REQUIRED_APIS = [
  "run.googleapis.com",
  "sqladmin.googleapis.com",
  "secretmanager.googleapis.com",
  "vpcaccess.googleapis.com",
  "servicenetworking.googleapis.com",
  "compute.googleapis.com",
  "iam.googleapis.com",
] as const;

export type RequiredApi = (typeof REQUIRED_APIS)[number];

export class GcpApis extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    for (const api of REQUIRED_APIS) {
      const resourceId = api.replace(/\./g, "-");
      new ProjectService(this, resourceId, {
        service: api,
        disableOnDestroy: false,
      });
    }
  }
}
