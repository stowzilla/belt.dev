import React from 'react';

const features = [
  {
    icon: '💎',
    title: 'Ruby DSL',
    description: 'Define routes with resources, namespaces, scopes, and custom paths. A familiar Rails-like DSL that compiles to real AWS infrastructure.',
  },
  {
    icon: '⚙️',
    title: 'Isolated Namespaces',
    description: 'Each namespace gets a separate API Gateway with its own Lambda, IAM roles, and DynamoDB permissions — fully isolated, deployed independently.',
  },
  {
    icon: '🔐',
    title: 'Flexible Auth',
    description: 'Cognito authorizers, Stripe signature verification, or no auth — declared per-namespace or per-route. Simple, explicit access control.',
  },
  {
    icon: '📦',
    title: 'Smart Packaging',
    description: 'Builds optimized Lambda packages via Docker, including only the controllers and dependencies each function needs. Minimal cold starts.',
  },
  {
    icon: '🌐',
    title: 'Custom Domain Routing',
    description: 'Automatic base path mappings route traffic from a single domain to the correct API Gateway. One domain, many services.',
  },
  {
    icon: '🗃️',
    title: 'Table Auto-Inference',
    description: 'DynamoDB table permissions inferred from resource names. Override with explicit tables: [...] when you need custom access patterns.',
  },
  {
    icon: '📊',
    title: 'Request & Response Models',
    description: 'Attach JSON Schema models to routes for automatic validation and OpenAPI-compatible documentation.',
  },
  {
    icon: '☄️',
    title: 'Scales to Zero',
    description: 'Pure serverless — no running costs when idle. Pay only for what you use, with no infrastructure to manage.',
  },
  {
    icon: '🔄',
    title: 'Surgical Deploys',
    description: 'Change one route, redeploy one Lambda. Belt tracks dependencies and rebuilds only what changed.',
  },
];

function Features() {
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
        {features.map((feature) => (
          <div key={feature.title} className="feature-card">
            <span className="feature-icon">{feature.icon}</span>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
