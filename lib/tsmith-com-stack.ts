import * as cdk from '@aws-cdk/core';
import * as amplify from "@aws-cdk/aws-amplify";
import { BasicAuth, RedirectStatus } from '@aws-cdk/aws-amplify';
import { HostedZone } from "@aws-cdk/aws-route53";
import { HttpsRedirect } from "@aws-cdk/aws-route53-patterns";
import { AssetStorageConsumerProps } from "./website-asset-storage";


export class TSmithComStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: AssetStorageConsumerProps) {
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

    // Get the assets folder location and pass it in as an env var to Amplify
    const assetFolder = props?.assetBucket.bucketRegionalDomainName;
    assetFolder && amplifyApp.addEnvironment("ASSETS_FOLDER", `https://${assetFolder}/tsmith-com`);

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

    // Pull in the legacy redirect map (how many more times will I migrate this...)
    const legacyRedirects = [
      ["/email-me", "/contact/"],
      ["/article/custom-styles-wordpress-visual-editor", "/blog/2013/wordpress-theme-editor/"],
      ["/file/theatrical-resume", "/assets/pdf/taylor-smith-resume-theatrical.pdf/"],
      ["/article/gittin-started-pantheon-multidev-fk", "/blog/2013/pantheon-multidev/"],
      ["/article/change-page-template-based-panels-layout", "/blog/2013/panels-page-tpl/"],
      ["/article/nodejs-rpi-ikea-trophy-lighting", "/blog/2013/ikea-raspberry-pi-light/"],
      ["/article/building-personalized-portfolio-experience-drupal-7", "/blog/2013/drupal-7-portfolio-experience/"],
      ["/article/rescuing-myself-email-monster-javascript-fk", "/blog/2014/scripting-gmail/"],
      ["/article/callboard", "/blog/2014/callboard-theatre-js/"],
      ["/article/nth-child-mathematics", "/blog/2014/nth-child-math/"],
      ["/article/cleaner-history-interactive-commit-building-git", "/blog/2016/git-interactive-adding/"],
    ];

    legacyRedirects.forEach((page) => {
      amplifyApp.addCustomRule({source: page[0], target: page[1], status: RedirectStatus.PERMANENT_REDIRECT});
    });

    // Add custom 404 page
    // NOTE: This path has to be exact to the resource (i.e. index.html) to
    // be rendered, otherwise you just get a zero-content HTTP 404 error.
    amplifyApp.addCustomRule({source: "/<*>", target: "/404/index.html", status: RedirectStatus.NOT_FOUND_REWRITE });


    const wwwRedirect = new HttpsRedirect(this, "tsmith-com-domain-direct", {
      targetDomain: "tsmith.com",
      zone: HostedZone.fromHostedZoneAttributes(this, "tsmithcom-zone", {
        hostedZoneId: "Z303DPVNWQ2JYE",
        zoneName: "tsmith.com",
      }),
      recordNames: ["www.tsmith.com"],
    });

    const tsmithcreativeRedirect = new HttpsRedirect(this, "tsmithcreative-com-domain-direct", {
      targetDomain: "tsmith.com",
      zone: HostedZone.fromHostedZoneAttributes(this, "tsmithcreativecom-zone", {
        hostedZoneId: "ZQ0T9AUIN7FT4",
        zoneName: "tsmithcreative.com",
      }),
      recordNames: ["tsmithcreative.com", "www.tsmithcreative.com"],
    });
  }
}
