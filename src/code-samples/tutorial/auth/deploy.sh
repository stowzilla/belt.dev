# Pull Cognito values from Terraform into frontend/.env
$ belt frontend env

# This writes to frontend/.env:
#   VITE_API_URL=https://a0dexkmei6.execute-api.us-east-1.amazonaws.com/dev
#   VITE_COGNITO_USER_POOL_ID=us-east-1_AbCdEfG
#   VITE_COGNITO_CLIENT_ID=1a2b3c4d5e6f7g8h9i
#   VITE_AWS_REGION=us-east-1

# Rebuild and deploy the frontend
$ belt deploy frontend
