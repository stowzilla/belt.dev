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

# --- Build ---
echo ""
echo "⚙️  Building website..."
cd "$PROJECT_ROOT"
npm ci --silent
npm run build

# --- Get Terraform outputs ---
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

if [ -z "$S3_BUCKET" ]; then
    echo "❌ Could not read S3 bucket from Terraform outputs."
    echo "   Have you run 'terraform apply' for this environment?"
    echo ""
    echo "   cd infrastructure"
    echo "   terraform init"
    echo "   terraform apply"
    exit 1
fi

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
