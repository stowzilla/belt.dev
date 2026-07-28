import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import hcl from 'react-syntax-highlighter/dist/esm/languages/prism/hcl';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import CodeWindow from './CodeWindow';

SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('hcl', hcl);
SyntaxHighlighter.registerLanguage('bash', bash);

const panels = [
  {
    filename: 'terminal — belt cli',
    language: 'bash',
    code: `$ gem install belt
$ belt new my-app --frontend react
✓ my-app created successfully!

$ cd my-app
$ belt generate resource post title:string body:text status:string
  create  lambda/models/post.rb
  create  lambda/controllers/my_app/posts_controller.rb
  update  config/routes.tf.rb
  update  config/schema.tf.rb
✓ Resource 'post' generated!

$ belt generate environment dev
$ belt setup state dev
✓ State bucket ready (versioned, encrypted, TLS-only)

$ belt setup tables dev
✓ Generated DynamoDB tables for 1 model(s)

$ belt deploy dev
  ⚙ Parsed 5 routes across 1 namespace
  ⚙ Built Lambda package (2.1 MB)
  ⚙ Created API Gateway + Cognito auth
Deploy complete! Resources: 18 added.`,
  },
  {
    filename: 'routes.tf.rb',
    language: 'ruby',
    code: `Belt.application.routes.draw do
  namespace :customer, auth: :cognito do
    resources :items
    resources :pickups
    resource  :profile, tables: [:customers]

    post '/items/:id/upload-image'
    get  '/billing/summary', tables: [:invoices, :payments]
  end

  namespace :ops, auth: :cognito do
    resources :containers
    resources :employees
    resources :availability_slots

    scope module: :inventory do
      get  '/search'
      post '/bulk-assign'
    end
  end

  namespace :onboarding, auth: :none do
    post '/signup', tables: [:customers, :containers]
    post '/schedule', tables: [:pickups, :availability_slots]
    get  '/check-zip/:zip', controller: 'landing', action: 'check_zip'
  end
end`,
  },
  {
    filename: 'main.tf',
    language: 'hcl',
    code: `# That's it. One resource. The belt does the rest.
resource "conveyor_belt" "main" {
  source            = "\${path.module}/../../routes.tf.rb"
  app_name          = "myapp-\${var.environment}"
  lambda_source_dir = "\${path.module}/../../lambda"
  frontend_urls     = var.frontend_urls

  cognito_user_pool_arns = var.cognito_user_pool_arns
  lambda_layer_arns      = var.lambda_layer_arns

  custom_domain_name = "api.\${var.environment}.example.com"
}`,
  },
  {
    filename: 'outputs.tf',
    language: 'hcl',
    code: `# The belt forges all of this automatically:
#
# ⚙ 3 API Gateways (customer, ops, onboarding)
# ⚙ 3 Lambda functions with optimized packages
# ⚙ IAM roles with least-privilege DynamoDB access
# ⚙ Cognito authorizers on protected routes
# ⚙ Custom domain with base path mappings
# ⚙ CORS configuration
# ⚙ CloudWatch alarms
# ⚙ Route manifests for the Lambda router

output "api_url" {
  value = conveyor_belt.main.custom_domain_url
  # => "https://api.prod.example.com"
}

output "gateways" {
  value = conveyor_belt.main.gateway_names
  # => ["customer", "ops", "onboarding"]
}`,
  },
];

function CodeShowcase() {
  return (
    <section className="code-showcase">
      <div className="code-showcase-header">
        <h2>Convention over configuration.</h2>
        <p>
          The Belt CLI scaffolds, generates, and deploys. The routes DSL defines your API.
          Belt handles the rest — infrastructure, permissions, packaging, and deployment.
        </p>
      </div>

      <div className="code-panels">
        {panels.map((panel) => (
          <CodeWindow
            key={panel.filename}
            code={panel.code}
            language={panel.language}
            filename={panel.filename}
          />
        ))}
      </div>
    </section>
  );
}

export default CodeShowcase;
