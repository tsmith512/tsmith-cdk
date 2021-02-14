import * as cdk from '@aws-cdk/core';
import * as amplify from "@aws-cdk/aws-amplify";
import { AssetStorageConsumerProps } from "./website-asset-storage";

export class GrabTimeWithMeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: AssetStorageConsumerProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, "grab-time-with-me-spa", {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "tsmith512",
        repository: "grab-time-with-me",
        oauthToken: cdk.SecretValue.secretsManager("github-oauth-token", {
          jsonField: "secret",
        }),
      }),
    });

    // Get the assets folder location and pass it in as an env var to Amplify
    const assetFolder = props?.assetBucket.bucketRegionalDomainName;
    assetFolder && amplifyApp.addEnvironment("ASSETS_FOLDER", `https://${assetFolder}/grab-time-with-me`);

    const trunk = amplifyApp.addBranch("trunk");

    amplifyApp.addCustomRule(amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT);

    const domain = amplifyApp.addDomain('grabtimewith.me');
    domain.mapRoot(trunk);
  }
}
