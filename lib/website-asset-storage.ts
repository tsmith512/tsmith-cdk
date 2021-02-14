import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import { RemovalPolicy } from "@aws-cdk/core";

export class WebsiteAssetStorage extends cdk.Stack {
  public readonly theBucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // @TODO: Once this is set up and working, set to false/RETAIN
    // so these don't get blown away accidentally and break builds.
    const s3bucket = new s3.Bucket(this, 'WebsiteAssetStorage', {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      publicReadAccess: true,
    });
    this.theBucket = s3bucket;
  }

}

export interface AssetStorageConsumerProps extends cdk.StackProps {
  assetBucket: s3.IBucket;
}
