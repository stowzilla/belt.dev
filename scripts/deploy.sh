#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Usage
usage() {
    echo "Usage: ./scripts/deploy.sh <environment>"
    echo ""
    echo "Environments: dev01, dev02, dev03, dev04, uat, staging, prod"
    echo ""
    echo "Examples:"
    echo "  ./scripts/deploy.sh dev01"
    echo "  ./scripts/deploy.sh uat"
    exit 1
}

ENV="${1:-}"
if [ -z "$ENV" ]; then
    usage
fi

# Validate environment
case "$ENV" in
    dev01|dev02|dev03|dev04|uat|staging|prod)
        ;;
    *)
        echo "❌ Invalid environment: $ENV"
        usage
        ;;
esac

# Check AWS credentials
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS credentials not configured. Run: aws sso login --profile <profile>"
    exit 1
fi

echo "🚀 Deploying beltruby.com to $ENV..."

# --- Build ---
echo ""
echo "⚙️  Building website..."
cd "$PROJECT_ROOT"
npm ci --silent
npm run build

# --- Get Terraform outputs ---
echo ""
echo "📡 Reading infrastructure outputs..."

INFRA_DIR="$PROJECT_ROOT/infrastructure"
ENV_DIR="$INFRA_DIR/$ENV"

if [ ! -f "$ENV_DIR/backend.tfvars" ]; then
    echo "❌ No backend config found at $ENV_DIR/backend.tfvars"
    echo "   Create environment config first. See infrastructure/dev01/ for reference."
    exit 1
fi

cd "$INFRA_DIR"

# Initialize if needed
if [ ! -d ".terraform" ]; then
    terraform init -backend-config="$ENV_DIR/backend.tfvars" -reconfigure > /dev/null
else
    # Re-init with correct backend for this env
    terraform init -backend-config="$ENV_DIR/backend.tfvars" -reconfigure > /dev/null
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
    echo "   terraform init -backend-config=$ENV/backend.tfvars"
    echo "   terraform apply -var-file=$ENV/terraform.tfvars"
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
