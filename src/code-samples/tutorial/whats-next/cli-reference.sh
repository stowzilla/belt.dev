belt new <app> [--frontend react]           # Scaffold a new Belt app
belt generate scaffold <name> [fields...]   # Model + controller + routes + contracts
belt generate model <name> [fields...]      # Model only
belt generate controller <name>             # Controller only
belt generate environment <name>            # New Terraform environment
belt generate frontend <react|vue|svelte>   # Frontend app scaffold
belt generate views <resource> [fields...]  # React CRUD pages
belt setup state                            # S3 state bucket (secured)
belt setup tables <env>                     # DynamoDB from models
belt setup frontend <env>                   # S3 + CloudFront hosting
belt deploy [env]                           # Deploy everything (init → plan → apply)
belt deploy frontend <env>                  # Build + deploy frontend
belt server                                 # Start local frontend dev server
belt routes [-g PATTERN]                    # Show route definitions
belt console                                # Interactive IRB console
belt init <env>                             # terraform init
belt plan <env>                             # terraform plan
belt apply <env>                            # terraform apply
belt destroy <env>                          # terraform destroy
belt output <env>                           # terraform output
