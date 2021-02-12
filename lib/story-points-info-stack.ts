import * as cdk from '@aws-cdk/core';
import * as amplify from "@aws-cdk/aws-amplify";
import { HostedZone } from "@aws-cdk/aws-route53";
import { HttpsRedirect } from "@aws-cdk/aws-route53-patterns";

export class StoryPointsInfoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, "story-points-info-static-site", {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "tsmith512",
        repository: "story-points",
        oauthToken: cdk.SecretValue.secretsManager("github-oauth-token", {
          jsonField: "secret",
        }),
      }),
    });

    const trunk = amplifyApp.addBranch("trunk");

    const domain = amplifyApp.addDomain('storypoints.info');
    domain.mapRoot(trunk);

    const wwwRedirect = new HttpsRedirect(this, "story-points-domain-direct", {
      targetDomain: "www.storypoints.info",
      zone: HostedZone.fromHostedZoneAttributes(this, "storypointsinfo-zone", {
        hostedZoneId: "Z9JQAQNOXZ7VA",
        zoneName: "storypoints.info",
      }),
      recordNames: ["www.storypoints.info"],
    });
  }
}
