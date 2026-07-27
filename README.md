# beltruby.com

Product website and tutorial for [Conveyor Belt](https://github.com/stowzilla/belt) — a Terraform provider that turns a Rails-like Ruby DSL into complete AWS serverless infrastructure.

## Development

```bash
npm install
npm run dev    # starts on port 3003
```

## Build

```bash
npm run build  # outputs to build/
```

## Pages

- `/` — Marketing homepage (features, code showcase, how it works, get started)
- `/tutorial` — "Build a Chat App in 15 Minutes" step-by-step tutorial

## Tech

- React 18 + Vite
- react-router-dom (client-side routing)
- react-syntax-highlighter (code blocks with copy buttons)
- Dark theme, responsive design

## Infrastructure

Static site hosted on AWS: S3 + CloudFront + Route53.

### Prerequisites

- AWS CLI configured (`aws sso login --profile devzilla`)
- Terraform >= 1.0

### First-time setup

```bash
cd infrastructure
terraform init -backend-config=dev01/backend.tfvars
terraform apply -var-file=dev01/terraform.tfvars
```

### Deploy

```bash
./scripts/deploy.sh dev01
```

The deploy script builds the site, reads Terraform outputs (S3 bucket name, CloudFront distribution ID), syncs to S3, and invalidates the CDN cache.

### Environments

| Environment | URL | AWS Profile |
|---|---|---|
| dev01 | https://belt.dev01.stowzilla.com | `devzilla` |
| dev02 | https://belt.dev02.stowzilla.com | `devzilla` |
| uat | https://belt.uat.stowzilla.com | `uatzilla` |
| prod | https://belt.stowzilla.com | `prodzilla` |

### Adding a new environment

1. Create `infrastructure/<env>/backend.tfvars` and `infrastructure/<env>/terraform.tfvars`
2. Run `terraform init` and `terraform apply`
3. Deploy with `./scripts/deploy.sh <env>`

## CI/CD

Push to `main` auto-deploys to dev01 via GitHub Actions. Manual deploys to other environments via workflow dispatch.

## License

MIT
