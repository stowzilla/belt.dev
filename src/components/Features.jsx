import React, { useState } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import hcl from 'react-syntax-highlighter/dist/esm/languages/prism/hcl';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('hcl', hcl);

const codeStyle = {
  ...oneDark,
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'none',
    textShadow: 'none',
  },
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: '#0d1117',
    borderRadius: '8px',
    padding: '1.25rem',
    fontSize: '0.8rem',
    lineHeight: '1.5',
    margin: 0,
    textShadow: 'none',
  },
};

const features = [
  {
    icon: '💎',
    title: 'Ruby DSL',
    description: 'Define routes with resources, namespaces, scopes, and custom paths. A familiar Rails-like DSL that compiles to real AWS infrastructure.',
    detail: {
      type: 'code',
      text: 'Write routes the way you already know — resources, namespaces, member/collection routes. Belt compiles this into API Gateway routes and Lambda integrations via the Conveyor Belt Terraform provider.',
      code: `Belt.application.routes.draw do
  namespace :api, auth: :cognito do
    resources :posts do
      get '/search', on: :collection
      post '/publish', on: :member
    end
    resources :comments, only: [:index, :create]
  end

  namespace :webhooks, auth: :stripe do
    post '/payment'
    post '/subscription'
  end
end`,
      language: 'ruby',
      filename: 'routes.tf.rb',
    },
  },
  {
    icon: '⚙️',
    title: 'Isolated Namespaces',
    description: 'Each namespace gets a separate API Gateway with its own Lambda, IAM roles, and DynamoDB permissions — fully isolated, deployed independently.',
    detail: {
      type: 'text',
      text: 'Namespaces aren\'t just URL prefixes — each one compiles to its own API Gateway, its own Lambda function, and its own IAM role. Blast radius is contained: a failing deploy in your webhooks namespace can\'t take down your customer-facing API.',
      highlights: [
        { label: 'Separate API Gateway', desc: 'Independent rate limits, throttling, and stages per namespace' },
        { label: 'Own Lambda function', desc: 'Isolated cold starts, memory, and timeout configuration' },
        { label: 'Scoped IAM roles', desc: 'Each namespace only has access to the DynamoDB tables it actually uses' },
        { label: 'Independent deploys', desc: 'Change one namespace, redeploy only that Lambda + Gateway pair' },
      ],
    },
  },
  {
    icon: '🔐',
    title: 'Flexible Auth',
    description: 'Cognito authorizers, Stripe signature verification, or no auth — declared per-namespace or per-route. Simple, explicit access control.',
    detail: {
      type: 'code',
      text: 'Auth is declared right in the routes file. Cognito JWT validation, Stripe webhook signature verification, or open endpoints — one keyword per namespace or route. No middleware configuration files.',
      code: `Belt.application.routes.draw do
  # JWT auth via Cognito
  namespace :api, auth: :cognito do
    resources :posts
  end

  # Stripe signature verification
  namespace :webhooks, auth: :stripe do
    post '/payment'
  end

  # Public — no auth
  namespace :public, auth: :none do
    get '/health'
    post '/contact'
  end
end`,
      language: 'ruby',
      filename: 'routes.tf.rb',
    },
  },
  {
    icon: '📦',
    title: 'Smart Packaging',
    description: 'Builds optimized Lambda packages via Docker, including only the controllers and dependencies each function needs. Minimal cold starts.',
    detail: {
      type: 'text',
      text: 'Belt builds Lambda packages in Docker with a shared gem bundle (built once), then creates per-Lambda zip files containing only the controllers, models, and lib files that Lambda actually needs. The result: small packages, fast cold starts, and parallel builds.',
      highlights: [
        { label: 'Shared gem layer', desc: 'Gems are bundled once and shared — no duplicate installs across Lambdas' },
        { label: 'Tree-shaken code', desc: 'Each package includes only controllers + shared dirs relevant to that Lambda' },
        { label: 'Parallel Docker builds', desc: 'Concurrency scales to CPU count by default' },
        { label: 'Hash-based caching', desc: 'Unchanged Lambdas skip the build entirely on subsequent deploys' },
      ],
    },
  },
  {
    icon: '🌐',
    title: 'Custom Domain Routing',
    description: 'Automatic base path mappings route traffic from a single domain to the correct API Gateway. One domain, many services.',
    detail: {
      type: 'code',
      text: 'Point a single custom domain at multiple API Gateways via base path mappings. Each namespace gets its own path prefix automatically — no manual API Gateway configuration needed.',
      code: `resource "conveyor_belt" "main" {
  source            = "\${path.module}/routes.tf.rb"
  app_name          = "myapp"
  lambda_source_dir = "\${path.module}/lambda"

  # One domain for all your APIs
  custom_domain_name = "api.example.com"

  frontend_urls = [
    "https://app.example.com"
  ]
}

# Result:
# api.example.com/api/*      → api gateway
# api.example.com/webhooks/* → webhooks gateway
# api.example.com/admin/*    → admin gateway`,
      language: 'hcl',
      filename: 'main.tf',
      link: { url: 'https://registry.terraform.io/providers/stowzilla/conveyor-belt/latest', label: 'Conveyor Belt on Terraform Registry →' },
    },
  },
  {
    icon: '🗃️',
    title: 'Table Auto-Inference',
    description: 'DynamoDB table permissions inferred from resource names. Override with explicit tables when you need custom access patterns.',
    detail: {
      type: 'code',
      text: 'Belt infers which DynamoDB tables each route needs based on the resource name. A posts controller gets access to the posts table automatically. Need cross-table access? Declare it explicitly in the routes DSL.',
      code: `Belt.application.routes.draw do
  namespace :api, auth: :cognito do
    # Auto-inferred: posts table
    resources :posts

    # Explicit: items + inventory + containers
    resources :items, tables: [:inventory, :containers] do
      get '/search', on: :collection
    end
  end
end`,
      language: 'ruby',
      filename: 'routes.tf.rb',
    },
  },
  {
    icon: '📊',
    title: 'Request & Response Models',
    description: 'Attach JSON Schema models to routes for automatic validation and OpenAPI-compatible documentation.',
    detail: {
      type: 'code',
      text: 'Define request and response models in a schema file. Belt generates API Gateway request validators and model definitions — giving you automatic input validation and OpenAPI-compatible documentation with no extra work.',
      code: `Belt.application.schema.define do
  model :post do
    partition_key :id, :string
    global_secondary_index :UserIndex,
      partition_key: :user_id
  end

  request_model :CreatePost do
    property :title, :string, required: true
    property :body, :string
    property :tags, :array, items: :string
  end
end`,
      language: 'ruby',
      filename: 'schema.tf.rb',
    },
  },
  {
    icon: '☄️',
    title: 'Scales to Zero',
    description: 'Pure serverless — no running costs when idle. Pay only for what you use, with no infrastructure to manage.',
    detail: {
      type: 'text',
      text: 'No EC2 instances, no ECS tasks, no minimum capacity. Everything Belt generates is event-driven: Lambda functions that spin up on request and API Gateways that only charge per-call. Your staging environment costs literally nothing when nobody\'s using it.',
      highlights: [
        { label: 'Lambda', desc: 'Billed per-millisecond of execution — $0 when idle' },
        { label: 'API Gateway', desc: 'Per-request pricing, no baseline cost' },
        { label: 'DynamoDB', desc: 'On-demand mode: pay per read/write, no provisioned capacity' },
        { label: 'CloudWatch', desc: 'Logs and metrics only for actual invocations' },
      ],
    },
  },
  {
    icon: '🔄',
    title: 'Surgical Deploys',
    description: 'Change one route, redeploy one Lambda. Belt tracks dependencies and rebuilds only what changed.',
    detail: {
      type: 'text',
      text: 'Conveyor Belt uses content hashing to detect exactly what changed. Source and config changes are tracked separately — updating an environment variable skips the Docker build entirely. Multiple Lambdas update in parallel, and failures in one don\'t block the others.',
      highlights: [
        { label: 'Source hash', desc: 'Changed controller? Rebuild that Lambda only' },
        { label: 'Config hash', desc: 'Changed env vars or timeout? Skip Docker, update config directly' },
        { label: 'Parallel updates', desc: 'All changed Lambdas deploy simultaneously' },
        { label: 'Failure isolation', desc: 'One failed Lambda doesn\'t rollback the others' },
      ],
      link: { url: 'https://registry.terraform.io/providers/stowzilla/conveyor-belt/latest', label: 'See how Conveyor Belt handles deploys →' },
    },
  },
];

function FeatureDetail({ detail }) {
  if (detail.type === 'code') {
    return (
      <div className="feature-detail">
        <p className="feature-detail-text">{detail.text}</p>
        <div className="feature-detail-code">
          <div className="feature-detail-code-header">
            <span className="feature-detail-code-filename">{detail.filename}</span>
          </div>
          <SyntaxHighlighter language={detail.language} style={codeStyle}>
            {detail.code}
          </SyntaxHighlighter>
        </div>
        {detail.link && (
          <a href={detail.link.url} target="_blank" rel="noopener noreferrer" className="feature-detail-link">
            {detail.link.label}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="feature-detail">
      <p className="feature-detail-text">{detail.text}</p>
      <div className="feature-detail-highlights">
        {detail.highlights.map((h) => (
          <div key={h.label} className="feature-highlight">
            <span className="feature-highlight-label">{h.label}</span>
            <span className="feature-highlight-desc">{h.desc}</span>
          </div>
        ))}
      </div>
      {detail.link && (
        <a href={detail.link.url} target="_blank" rel="noopener noreferrer" className="feature-detail-link">
          {detail.link.label}
        </a>
      )}
    </div>
  );
}

function Features() {
  const [expanded, setExpanded] = useState(null);

  const toggleCard = (title) => {
    setExpanded(expanded === title ? null : title);
  };

  return (
    <section className="features" id="features">
      <div className="features-header">
        <h2>Everything you need to ship.</h2>
        <p>
          Define your API surface once in a Ruby DSL and get production-ready serverless
          architecture — gateways, functions, permissions, monitoring, and domains.
          Belt handles the scaffolding, generation, and deployment.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature) => {
          const isExpanded = expanded === feature.title;
          return (
            <div
              key={feature.title}
              className={`feature-card ${isExpanded ? 'feature-card--expanded' : ''}`}
              onClick={() => toggleCard(feature.title)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard(feature.title); } }}
              aria-expanded={isExpanded}
            >
              <div className="feature-card-summary">
                <span className="feature-icon">{feature.icon}</span>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <span className="feature-expand-hint">{isExpanded ? '−' : '+'}</span>
              </div>
              {isExpanded && <FeatureDetail detail={feature.detail} />}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Features;
