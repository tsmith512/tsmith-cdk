# README

Welcome to project "Trying to clean up my AWS mess and know how the pieces all
fit together." It's half learning CDK/CloudFormation and half cleaning up AWS
because that's more fun than cleaning up my room.

## Static Sites

- :white_check_mark: [tsmith.com](https://tsmith.com)
  - Site build and host (Amplify)
  - Domain-level redirects ([CDK-able](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-route53-patterns-readme.html): 53, ACM, S3, CloudFront)
  - HCO typeface packages (S3)
  - :x: Contact form (Lambda + SES)
- :white_check_mark: [storypoints.info](https://storypoints.info)
  - Site build and host (Amplify)
  - Domain-level redirects
  - HCo typeface packages (S3)
- :white_check_mark: [grabtimewith.me](https://grabtimewith.me)
  - Site build and host (Amplify)
  - HCo typeface packages (S3)
- :white_check_mark: [typesetwith.me](https://typesetwith.me)
  - Site build and host (Amplify)
  - _This is ancient history, I should consider if this has a future..._

## Applications

- :x: Route Not Found
  - WordPress production and staging (Lightsail: Alfa)
  - Location tracker (Lightsail: Akela 4)
  - API Proxy/filter (API Gateway + Lambda)
  - Content bakcups (S3, needs lifecycling)
  - HCo typeface package (S3)
  - Pre-deploy header graphics (S3)
- :x: NextCloud
  - EC2
  - EBS Snapshots + Lifecycle
  - _This should come home... like... to the apartment._

## Not in CF/CDK

- Domain reigstration
- Route 53 zones
- Certificate Manager (anything not created with the above can be revoked, check all regions)
- Home Assistant / Haaska bridge
- SES Verifications (verify sending domain and address) _in `us-east-2`_
  - Relatedly, hard-spec a region in this repo somewhere
- Secrets Manager. Create this:

A secret called `github-oauth-token` in Ohio with these JSON fields:

| Field | Value |
| ----- | ----- |
| `secret` | GitHub application token with the repo scope on @tsmith512 |
| `basicAuthPassword` | Whatever plaintext password for staging environments |
| `email-form-destination` | My email address for sending contact form replies |
| `email-form-source` | Webmaster/no-reply for addressing contact form replies |
