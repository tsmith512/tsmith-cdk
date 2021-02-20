import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as amplify from "@aws-cdk/aws-amplify";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { BasicAuth, RedirectStatus } from '@aws-cdk/aws-amplify';
import { HostedZone } from "@aws-cdk/aws-route53";
import { HttpsRedirect } from "@aws-cdk/aws-route53-patterns";
import { AssetStorageConsumerProps } from "./website-asset-storage";


export class TSmithComStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: AssetStorageConsumerProps) {
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

    // Define the lambda function that handles the contact form. Doing this
    // first so we can give the endpoint URL to Amplify by env var.
    const emailHandler = new lambda.Function(this, 'tsmith-com-emailhandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/tsmith-com-emailhandler')),
      environment: {
        EMAIL_DESTINATION: cdk.SecretValue.secretsManager("github-oauth-token", { jsonField: "email-form-destination" }).toString(),
        EMAIL_SOURCE: cdk.SecretValue.secretsManager("github-oauth-token", { jsonField: "email-form-source" }).toString(),
      }
    });

    // And give that lambda function permission to send me emails
    const emailSendingPolicy = new iam.Policy(this, 'tsmith-com-emailhandler-policy');
    emailSendingPolicy.addStatements(iam.PolicyStatement.fromJson({
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail"
      ],
      "Resource": [
        "*"
      ]
    }));
    emailHandler.role && emailHandler.role.attachInlinePolicy(emailSendingPolicy)

    const apiEndpoint = new apigateway.LambdaRestApi(this, 'tsmith-com-emailapi', {
      handler: emailHandler,
      proxy: false,
      deploy: true,
      deployOptions: {
        stageName: "tsmith-com-email"
      },
    });

    apiEndpoint.root.addMethod("POST");
    apiEndpoint.root.addCorsPreflight({
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: ['POST']
    })

    amplifyApp.addEnvironment("EMAIL_HANDLER_ENDPOINT", apiEndpoint.url);

    // Get the assets folder location and pass it in as an env var to Amplify
    const assetFolder = props.assetBucket.bucketRegionalDomainName;
    amplifyApp.addEnvironment("ASSETS_FOLDER", `https://${assetFolder}/tsmith-com`);

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
