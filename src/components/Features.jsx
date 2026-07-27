import React from 'react';

const features = [
  {
    icon: '💎',
    title: 'Ruby-Forged DSL',
    description: 'Define routes with resources, namespaces, scopes, and custom paths. A familiar Rails-like DSL — forged in the heart of a dying star, tempered for the frontier.',
  },
  {
    icon: '⚙️',
    title: 'Belt-Driven Architecture',
    description: 'Each namespace spins up a separate API Gateway with its own Lambda, IAM roles, and DynamoDB permissions — fully isolated, running in tandem like steam-driven gears on a brass conveyor.',
  },
  {
    icon: '🔐',
    title: 'Buckled-Down Auth',
    description: 'Cognito authorizers, Stripe signature verification, or no auth — declared per-namespace or per-route. Your API stays holstered tight.',
  },
  {
    icon: '📦',
    title: 'Smart Cargo',
    description: 'Builds optimized Lambda packages via Docker, including only the controllers and dependencies each function needs. Ship light, fly fast — no dead weight on this boat.',
  },
  {
    icon: '🌐',
    title: 'Custom Domain Routing',
    description: 'Automatic base path mappings route traffic from a single domain to the correct API Gateway — like cargo sorted through airlocks on a transport freighter.',
  },
  {
    icon: '🗃️',
    title: 'Table Auto-Inference',
    description: 'DynamoDB table permissions inferred from resource names. The belt knows what cargo it carries. Override with explicit tables: [...] when you reckon otherwise.',
  },
  {
    icon: '📊',
    title: 'Request & Response Models',
    description: 'Attach JSON Schema models to routes for automatic validation and OpenAPI-compatible documentation. Quality control on the assembly line — no contraband gets through.',
  },
  {
    icon: '☄️',
    title: 'Scales to Zero',
    description: 'Pure serverless — no running costs when idle. Like asteroids drifting in the black: dormant until called upon, then blazing across the sky.',
  },
  {
    icon: '🔄',
    title: 'Surgical Deploys',
    description: 'Change one route, redeploy one Lambda. The belt only moves what needs moving — tracks dependencies and rebuilds with the precision of a frontier surgeon.',
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="features-header">
        <h2>Everything on the belt, Captain.</h2>
        <p>
          Conveyor Belt is a full-stack infrastructure provider. Define your API surface once and get
          production-ready serverless architecture — gateways, functions, permissions,
          monitoring, and domains. All buckled in and ready for the black.
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
