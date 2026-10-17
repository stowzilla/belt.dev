output "website_url" {
  description = "URL for the belt website"
  value       = "https://${var.domain_name}"
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (for cache invalidation)"
  value       = aws_cloudfront_distribution.website.id
}

output "s3_bucket_name" {
  description = "S3 bucket name for website files"
  value       = aws_s3_bucket.website.bucket
}

output "nameservers" {
  description = "Nameservers to configure at your domain registrar (name.com)"
  value       = aws_route53_zone.main.name_servers
}

output "contact_api_url" {
  description = "Contact form API endpoint (POST here from the frontend)"
  value       = "https://${local.api_domain_name}${local.contact_route_path}"
}

output "contact_sender" {
  description = "SES From address used for contact emails"
  value       = local.contact_sender
}

output "ses_domain_verification_token" {
  description = "If SES domain isn't verified via DKIM automatically, add this TXT record"
  value       = aws_ses_domain_identity.main.verification_token
}
