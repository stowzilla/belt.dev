$ belt generate environment dev
$ belt setup state dev
  ✓ State bucket ready (versioned, encrypted, TLS-only)

$ belt setup tables dev
  ✓ Generated DynamoDB tables for 1 model(s)

$ belt deploy dev
  ⚙ Parsed 5 routes across 1 namespace
  ⚙ Built Lambda package: my_app (2.1 MB)
  ⚙ Created API Gateway with Cognito auth
  ⚙ Applied IAM policies (least-privilege)

Deploy complete! Resources: 18 added.
