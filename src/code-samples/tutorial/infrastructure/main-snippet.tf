resource "conveyor_belt" "main" {
  # ... other config ...

  # Resolve ref() markers in config/lambda/*.yml
  lambda_env_refs = {
    bedrock_access_policy_arn = aws_iam_policy.bedrock_access.arn
  }
}
