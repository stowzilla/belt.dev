# Deploy to create the Cognito user pool
$ belt deploy

# Create your account (admin-only — no one else can sign up)
$ aws cognito-idp admin-create-user \
  --user-pool-id $(terraform -chdir=infrastructure/dev output -raw cognito_user_pool_id) \
  --username your@email.com \
  --temporary-password TempPass123 \
  --message-action SUPPRESS

# You'll be prompted to set a permanent password on first login
