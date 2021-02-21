import * as cdk from "@aws-cdk/core";
import * as amplify from "@aws-cdk/aws-amplify";
import { HostedZone } from "@aws-cdk/aws-route53";
import { HttpsRedirect } from "@aws-cdk/aws-route53-patterns";

export class TypesetWithMeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const amplifyApp = new amplify.App(this, "typeset-with-me-static-site", {
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "tsmith512",
        repository: "typesetwith.me",
        oauthToken: cdk.SecretValue.secretsManager("github-oauth-token", {
          jsonField: "secret",
        }),
      }),
    });

    const trunk = amplifyApp.addBranch("trunk");

    const domain = amplifyApp.addDomain("typesetwith.me");
    domain.mapRoot(trunk);

    new HttpsRedirect(this, "typset-with-me-domain-direct", {
      targetDomain: "typesetwith.me",
      zone: HostedZone.fromHostedZoneAttributes(this, "typesetwithme-zone", {
        hostedZoneId: "Z6GVTYNW5861O",
        zoneName: "typesetwith.me",
      }),
      recordNames: ["www.typesetwith.me"],
    });
  }
}
