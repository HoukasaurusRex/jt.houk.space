import { Construct } from "constructs";
import { StorageBucket } from "@cdktf/provider-google/lib/storage-bucket";

export interface KeilaStorageConfig {
  region: string;
}

export class KeilaStorage extends Construct {
  readonly bucket: StorageBucket;

  constructor(scope: Construct, id: string, config: KeilaStorageConfig) {
    super(scope, id);

    this.bucket = new StorageBucket(this, "keila-uploads", {
      name: "keila-uploads",
      location: config.region,
      uniformBucketLevelAccess: true,
      forceDestroy: false,
      lifecycleRule: [
        {
          action: { type: "AbortIncompleteMultipartUpload" },
          condition: { age: 1 },
        },
      ],
    });
  }
}
