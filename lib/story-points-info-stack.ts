import * as cdk from '@aws-cdk/core';
import * as amplify from "@aws-cdk/aws-amplify";

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

    amplifyApp.addCustomRule(amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT);

    const domain = amplifyApp.addDomain('storypoints.info');
    domain.mapRoot(trunk);
  }
}
