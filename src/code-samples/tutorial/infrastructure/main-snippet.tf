resource "conveyor_belt" "main" {
  # ... other config ...

  # Attach Bedrock permissions to the Lambda role
  shared_iam_policy_arns = [aws_iam_policy.bedrock_access.arn]
}
