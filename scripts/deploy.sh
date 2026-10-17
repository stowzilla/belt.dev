#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
INFRA_DIR="$PROJECT_ROOT/infrastructure"

# Check AWS credentials
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS credentials not configured. Run: aws sso login --profile <profile>"
    exit 1
fi

echo "🚀 Deploying belt site to prod..."

# --- Get Terraform outputs (before building, so the API URL can be baked in) ---
echo ""
echo "📡 Reading infrastructure outputs..."

cd "$INFRA_DIR"

# Initialize if needed
if [ ! -d ".terraform" ]; then
    terraform init > /dev/null
fi

TF_OUTPUTS=$(terraform output -json 2>/dev/null || echo "{}")

S3_BUCKET=$(echo "$TF_OUTPUTS" | jq -r '.s3_bucket_name.value // empty')
CF_DISTRIBUTION_ID=$(echo "$TF_OUTPUTS" | jq -r '.cloudfront_distribution_id.value // empty')
WEBSITE_URL=$(echo "$TF_OUTPUTS" | jq -r '.website_url.value // empty')
CONTACT_API_URL=$(echo "$TF_OUTPUTS" | jq -r '.contact_api_url.value // empty')

if [ -z "$S3_BUCKET" ]; then
    echo "❌ Could not read S3 bucket from Terraform outputs."
    echo "   Have you run 'terraform apply' for this environment?"
    echo ""
    echo "   cd infrastructure"
    echo "   terraform init"
    echo "   terraform apply"
    exit 1
fi

if [ -z "$CONTACT_API_URL" ]; then
    echo "⚠️  Warning: contact_api_url output is empty."
    echo "   The contact form will fall back to opening a mail client."
    echo "   Run 'terraform apply' in infrastructure/ to create the contact API."
fi

# --- Build (with the contact API URL baked in) ---
echo ""
echo "⚙️  Building website..."
cd "$PROJECT_ROOT"
npm ci --silent
VITE_CONTACT_API_URL="$CONTACT_API_URL" npm run build

# --- Deploy to S3 ---
echo ""
echo "📦 Uploading to S3 ($S3_BUCKET)..."
aws s3 sync "$PROJECT_ROOT/build/" "s3://$S3_BUCKET" --delete --quiet

# --- Invalidate CloudFront ---
if [ -n "$CF_DISTRIBUTION_ID" ]; then
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id "$CF_DISTRIBUTION_ID" \
        --paths "/*" > /dev/null 2>&1
    echo "✅ CloudFront cache invalidated"
fi

echo ""
echo "✅ Deployment complete!"
echo "🌐 $WEBSITE_URL"
