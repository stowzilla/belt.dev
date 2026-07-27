variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev01, dev02, uat, staging, prod)"
  type        = string
}

variable "dns_state_bucket" {
  description = "S3 bucket containing the DNS terraform state"
  type        = string
}

variable "dns_state_key" {
  description = "S3 key for the DNS terraform state file"
  type        = string
}
