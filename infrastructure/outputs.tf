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
