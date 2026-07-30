terraform {
  backend "s3" {
    bucket  = "belt-site-terraform-state"
    key     = "belt-site/prod/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}
