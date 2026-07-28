#!/usr/bin/env bash
set -euo pipefail

# Bootstrap script for belt.dev infrastructure
# Run this once before terraform init to create the state bucket

BUCKET_NAME="belt-site-terraform-state"
REGION="us-east-1"

# Check AWS credentials
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS credentials not configured. Run: aws sso login --profile <profile>"
    exit 1
fi

echo "🪣 Creating Terraform state bucket..."

# Create bucket
if aws s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
    echo "   Bucket $BUCKET_NAME already exists, skipping creation"
else
    aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
    echo "   Created bucket: $BUCKET_NAME"
fi

# Enable versioning
aws s3api put-bucket-versioning \
    --bucket "$BUCKET_NAME" \
    --versioning-configuration Status=Enabled

echo "   Enabled versioning"

# Block public access
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

echo "   Blocked public access"

echo ""
echo "✅ Bootstrap complete!"
echo ""
echo "Next steps:"
echo "  cd infrastructure"
echo "  terraform init"
echo "  terraform apply"
