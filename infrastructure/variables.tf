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

variable "contact_recipient" {
  description = "Email address that receives contact form submissions"
  type        = string
}

variable "contact_sender" {
  description = "From address for contact form emails. Must be on the verified SES domain."
  type        = string
  default     = null
}
