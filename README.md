# README

Welcome to project "Trying to clean up my AWS mess and know how the pieces all
fit together." It's half learning CDK/CloudFormation and half cleaning up AWS
because that's more fun than cleaning up my room.

## Static Sites

- tsmith.com
  - :white_check_mark: Site build and host (Amplify)
  - :white_check_mark: Domain-level redirects (CDK-able 53, ACM, S3, CloudFront)
  - :white_check_mark: HCO typeface packages (S3)
  - :x: Contact form (Lambda + SES)
- :white_check_mark: storypoints.info
  - Site build and host (Amplify)
  - Domain-level redirects
  - HCo typeface packages (S3)
- :white_check_mark: grabtimewith.me
  - Site build and host (Amplify)
  - HCo typeface packages (S3)
- :white_check_mark: typesetwith.me
  - Site build and host (Amplify)

## Applications

- :x: Route Not Found
  - WordPress production and staging (Lightsail: Alfa)
  - Location tracker (Lightsail: Akela 4)
  - API Proxy/filter (API Gateway + Lambda)
  - Content bakcups (S3)
  - HCo typeface package (S3)
  - Pre-deploy header graphics (S3)
- :x: NextCloud
  - EC2
  - EBS Snapshots + Lifecycle

## Not in CF/CDK

- Domain reigstration
- Route 53 zones
- Home Assistant / Haaska bridge
- SES Verifications (verify sending domain and address) _in `us-east-2`_
- Secrets Manager. Create this:

A secret called `github-oauth-token` in Ohio with these JSON fields:

| Field | Value |
| ----- | ----- |
| `secret` | GitHub application token with the repo scope on @tsmith512 |
| `basicAuthPassword` | Whatever plaintext password for staging environments |
| `email-form-destination` | My email address for sending contact form replies |
| `email-form-source` | Webmaster/no-reply for addressing contact form replies |
