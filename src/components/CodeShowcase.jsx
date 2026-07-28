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
    filename: 'routes.tf.rb',
    language: 'ruby',
    code: `Belt.application.routes.draw do
  namespace :api, auth: :cognito do
    resources :posts
    resources :comments
    resource  :profile, tables: [:users]

    get '/feed', tables: [:posts, :follows]
  end
end`,
  },
  {
    filename: 'main.tf',
    language: 'hcl',
    code: `resource "conveyor_belt" "main" {
  source            = "\${path.module}/../../routes.tf.rb"
  app_name          = "myapp-\${var.environment}"
  lambda_source_dir = "\${path.module}/../../lambda"
  frontend_urls     = var.frontend_urls

  cognito_user_pool_arns = var.cognito_user_pool_arns
  lambda_layer_arns      = var.lambda_layer_arns

  custom_domain_name = "api.\${var.environment}.example.com"
}`,
  },
];

function CodeShowcase() {
  return (
    <section className="code-showcase">
      <div className="code-showcase-header">
        <h2>Convention over configuration.</h2>
        <p>
          Define your routes in a Ruby DSL. Point the Terraform provider at it.
          You get API Gateways, Lambda functions, IAM roles, Cognito auth, custom domains,
          CORS, and CloudWatch alarms — from two files.
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
