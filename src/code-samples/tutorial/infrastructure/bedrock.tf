data "aws_caller_identity" "current" {}

resource "aws_iam_policy" "bedrock_access" {
  name = "${var.app_name}-${var.environment}-bedrock-access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:Converse"
        ]
        Resource = [
          "arn:aws:bedrock:*::foundation-model/anthropic.claude-*",
          "arn:aws:bedrock:us-east-1:${data.aws_caller_identity.current.account_id}:inference-profile/us.anthropic.*"
        ]
      }
    ]
  })
}
