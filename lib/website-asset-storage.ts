import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import { RemovalPolicy } from "@aws-cdk/core";

export class WebsiteAssetStorage extends cdk.Stack {
  public readonly theBucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // This bucket is full of manually uploaded stuff. One time, I had CDK
    // actually put something there and when I removed that object. CDK tried to
    // deprovision the whole bucket. Turning on RETAIN and off autoDeleteObjects
    // should prevent this, but I'm worried the bucket might get reprovisioned
    // and the new referenced passed around would be an empty bucket...
    const s3bucket = new s3.Bucket(this, "WebsiteAssetStorage", {
      autoDeleteObjects: false,
      removalPolicy: RemovalPolicy.RETAIN,
      publicReadAccess: true,
    });
    this.theBucket = s3bucket;
  }
}

export interface AssetStorageConsumerProps extends cdk.StackProps {
  assetBucket: s3.IBucket;
}
