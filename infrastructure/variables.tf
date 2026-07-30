variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (e.g., prod)"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the website (e.g., belt.dev)"
  type        = string
}
