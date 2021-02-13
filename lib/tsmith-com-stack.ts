import * as cdk from '@aws-cdk/core';
import * as amplify from "@aws-cdk/aws-amplify";
import { BasicAuth } from '@aws-cdk/aws-amplify';

export class TSmithComStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, "tsmith-com-static-site", {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "tsmith512",
        repository: "tsmithcreative",
        oauthToken: cdk.SecretValue.secretsManager("github-oauth-token", {
          jsonField: "secret",
        }),
      }),
    });

    const trunk = amplifyApp.addBranch("trunk");

    const stagingCreds = new BasicAuth({
      username: "tsmith",
      password: cdk.SecretValue.secretsManager("github-oauth-token", {
        jsonField: "basicAuthPassword",
      }),
    });

    const staging = amplifyApp.addBranch("dev", {
      basicAuth: stagingCreds,
    });

    // Mapping straight to the staging domain for initial migration to Amplify
    const domain = amplifyApp.addDomain('tsmith.com');
    domain.mapRoot(trunk);
    domain.mapSubDomain(staging, "staging");
  }
}
