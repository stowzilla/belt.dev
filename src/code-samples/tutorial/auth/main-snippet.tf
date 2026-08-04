resource "conveyor_belt" "main" {
  # ... existing config ...

  # Protect API with Cognito authentication
  cognito_user_pool_arns = [aws_cognito_user_pool.main.arn]
}
