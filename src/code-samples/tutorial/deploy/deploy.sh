$ belt deploy

# belt deploy → init + plan + apply (in infrastructure/dev/)
#
# Conveyor Belt will create:
#   ⚙ 1 API Gateway (space_chat)
#   ⚙ 1 Lambda function (space_chat) + Bedrock IAM policy
#   ⚙ 2 DynamoDB tables (conversations, messages)
#   ⚙ 1 S3 bucket (frontend)
#   ⚙ 1 CloudFront distribution
#
# Apply complete! Resources: 11 added, 0 changed, 0 destroyed.
#
# Outputs:
#   api_url      = "https://a0dexkmei6.execute-api.us-east-1.amazonaws.com/dev"
#   frontend_url = "https://d2tzs58mzfvmlv.cloudfront.net"
