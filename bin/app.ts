#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import * as stacks from "../lib";

const app = new cdk.App();

// Website Asset Storage -- an S3 Bucket that has files like
// H&Co webfonts packages or resize-required images that get pulled in
// and processed during site deployments. For now, not using aws-s3-assets
// because the whole point is keeping them out of project repos. I may
// change my mind on that later?
const WebsiteAssets = new stacks.WebsiteAssetStorage(
  app,
  "WebsiteAssetStorageStack"
);
cdk.Tags.of(WebsiteAssets).add("project", "utility");

// tsmith.com -- Static Site (Jekyll + Sass/JS/Images) on Amplify
const TSmithCom = new stacks.TSmithComStack(app, "TSmithComStack", {
  assetBucket: WebsiteAssets.theBucket,
});
TSmithCom.addDependency(WebsiteAssets);
cdk.Tags.of(TSmithCom).add("project", "tsmithcreative");

// grabtimewith.me -- React SPA on Amplify
const GrabTimeWithMe = new stacks.GrabTimeWithMeStack(
  app,
  "GrabTimeWithMeStack",
  {
    assetBucket: WebsiteAssets.theBucket,
  }
);
GrabTimeWithMe.addDependency(WebsiteAssets);
cdk.Tags.of(GrabTimeWithMe).add("project", "experiments");

// storypoints.info -- Static Site (HTML + Sass) on Amplify
const StoryPointsInfo = new stacks.StoryPointsInfoStack(
  app,
  "StoryPointsInfoStack",
  {
    assetBucket: WebsiteAssets.theBucket,
  }
);
StoryPointsInfo.addDependency(WebsiteAssets);
cdk.Tags.of(StoryPointsInfo).add("project", "experiments");

// typesetwith.me -- Static Site (HTML + JS + Sass) on Amplify
const TypestWithMe = new stacks.TypesetWithMeStack(app, "TypesetWithMeStack");
cdk.Tags.of(TypestWithMe).add("project", "experiments");
