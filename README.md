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
- Secrets Manager
- Home Assistant / Haaska bridge
