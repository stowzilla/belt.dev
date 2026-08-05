import React, { useState, useEffect } from 'react';
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
    description: 'Define routes with resources, namespaces, and nested resources. A familiar Rails-like DSL that compiles to real AWS infrastructure.',
    detail: {
      type: 'code',
      text: 'Write routes the way you already know — resources, namespaces, nested routes. Belt compiles this into API Gateway routes, Lambda integrations, and IAM policies automatically.',
      code: `Belt.application.routes.draw do
  namespace :api, auth: :cognito do
    resources :conversations do
      resources :messages, only: [:index, :create]
    end
  end
end`,
      language: 'ruby',
      filename: 'config/routes.rb',
    },
  },
  {
    icon: '⚡',
    title: 'Belt Generate',
    description: 'Scaffold models, controllers, routes, indexes, and auth with one command. Like rails generate but for serverless.',
    detail: {
      type: 'code',
      text: 'Belt generators wire everything together — models with associations, controllers with before_action, routes with nested resources, DynamoDB tables with GSI indexes, and Cognito auth. One command, fully working.',
      code: `$ belt generate scaffold message conversation:belongs_to role body sent_at:datetime
  create  lambda/models/message.rb
  create  lambda/controllers/api/messages_controller.rb
  update  config/routes.rb
  update  config/contracts.rb
  create  infrastructure/modules/app/dynamodb.tf

$ belt generate auth
  create  infrastructure/modules/app/cognito.tf
  create  frontend/src/lib/auth.js
  create  frontend/src/pages/auth/Login.jsx`,
      language: 'bash',
      filename: 'terminal',
    },
  },
  {
    icon: '🔐',
    title: 'Cognito Auth',
    description: 'One command generates user pools, frontend login pages, and wires JWT validation into your routes. Admin-only or public signup.',
    detail: {
      type: 'code',
      text: 'belt g auth scaffolds the entire auth stack — Cognito user pool, client, IAM wiring, frontend Login page, auth module, and API client with token injection. Admin-only by default, --signup for public registration.',
      code: `Belt.application.routes.draw do
  # All routes require valid Cognito JWT
  namespace :api, auth: :cognito do
    resources :conversations do
      resources :messages, only: [:index, :create]
    end
  end

  # Public — no auth required
  namespace :public, auth: :none do
    get '/health'
  end
end`,
      language: 'ruby',
      filename: 'config/routes.rb',
    },
  },
  {
    icon: '🛤️',
    title: 'Belt Console',
    description: 'Interactive REPL connected to your live DynamoDB data. Create, query, and test — just like rails console.',
    detail: {
      type: 'code',
      text: 'Drop into a live console connected to your deployed environment. Full ActiveRecord-style querying, association traversal, and validations — all against real DynamoDB data.',
      code: `$ belt console

irb> convo = Conversation.create!(title: "My chat")
=> #<Conversation id: "abc123..." title: "My chat">

irb> convo.messages.create!(role: "user", body: "Hello!")
=> #<Message id: "def456..." conversation_id: "abc123...">

irb> convo.messages.count
=> 1

irb> Message.where(conversation_id: convo.id).first
=> #<Message role: "user" body: "Hello!">`,
      language: 'bash',
      filename: 'terminal',
    },
  },
  {
    icon: '🚀',
    title: 'Belt Deploy',
    description: 'One command deploys Lambda, API Gateway, DynamoDB, CloudFront, and Cognito. Preflight checks catch issues before they hit AWS.',
    detail: {
      type: 'code',
      text: 'belt deploy runs preflight checks (credentials, indexes), then init → plan → apply. Surgical deploys only rebuild what changed. Source and config changes tracked separately.',
      code: `$ belt deploy

Preflight checks passed.
belt → deploying dev (in infrastructure/dev/)

Conveyor Belt will create:
  ⚙ 1 API Gateway (api)
  ⚙ 1 Lambda function (api) + Bedrock IAM policy
  ⚙ 2 DynamoDB tables (conversations, messages)
  ⚙ 1 CloudFront distribution
  ⚙ 1 Cognito user pool

Apply complete! Resources: 11 added, 0 changed, 0 destroyed.`,
      language: 'bash',
      filename: 'terminal',
    },
  },
  {
    icon: '🗺️',
    title: 'Belt Routes',
    description: 'See exactly what API Gateway, Lambda, and controller each route maps to. Full visibility into your serverless routing.',
    detail: {
      type: 'code',
      text: 'belt routes shows every route with its gateway, lambda, and controller mapping. Like rails routes but shows the infrastructure too.',
      code: `$ belt routes

VERB    PATH                                       GATEWAY  LAMBDA  CONTROLLER#ACTION
---------------------------------------------------------------------------------------
GET     /conversations                             api      api     conversations#index
POST    /conversations                             api      api     conversations#create
GET     /conversations/{conversation_id}/messages  api      api     messages#index
POST    /conversations/{conversation_id}/messages  api      api     messages#create
GET     /conversations/{conversation_id}           api      api     conversations#show
DELETE  /conversations/{conversation_id}           api      api     conversations#destroy`,
      language: 'bash',
      filename: 'terminal',
    },
  },
  {
    icon: '📦',
    title: 'Smart Packaging',
    description: 'Builds optimized Lambda packages via Docker, including only the code each function needs. Hash-based caching skips unchanged builds.',
    detail: {
      type: 'text',
      text: 'Belt builds Lambda packages in Docker with a shared gem bundle (built once), then creates per-Lambda zip files containing only the relevant controllers and models. Unchanged Lambdas skip the build entirely.',
      highlights: [
        { label: 'Shared gem layer', desc: 'Gems are bundled once and shared — no duplicate installs across Lambdas' },
        { label: 'Tree-shaken code', desc: 'Each package includes only controllers + shared dirs relevant to that Lambda' },
        { label: 'Parallel Docker builds', desc: 'Concurrency scales to CPU count by default' },
        { label: 'Hash-based caching', desc: 'Source hash + config hash tracked separately — env var change skips Docker' },
      ],
    },
  },
  {
    icon: '☄️',
    title: 'Scales to Zero',
    description: 'Pure serverless — no running costs when idle. Lambda + API Gateway + DynamoDB on-demand. Your staging env costs $0 at rest.',
    detail: {
      type: 'text',
      text: 'No EC2 instances, no ECS tasks, no minimum capacity. Everything Belt generates is event-driven: Lambda functions that spin up on request and API Gateways that only charge per-call.',
      highlights: [
        { label: 'Lambda', desc: 'Billed per-millisecond of execution — $0 when idle' },
        { label: 'API Gateway', desc: 'Per-request pricing, no baseline cost' },
        { label: 'DynamoDB', desc: 'On-demand mode: pay per read/write, no provisioned capacity' },
        { label: 'CloudFront', desc: 'Pay per request — free tier covers most dev/staging traffic' },
      ],
    },
  },
];

function FeatureDetail({ detail }) {
  if (detail.type === 'code') {
    return (
      <div className="feature-detail-panel">
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
    <div className="feature-detail-panel">
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
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openCard = (index) => {
    setSelectedIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeCard = () => {
    setSelectedIndex(null);
    document.body.style.overflow = '';
  };

  const goNext = () => {
    setSelectedIndex((prev) => (prev + 1) % features.length);
  };

  const goPrev = () => {
    setSelectedIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) closeCard();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeCard();
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
  };

  const selectedFeature = selectedIndex !== null ? features[selectedIndex] : null;

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
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="feature-card"
            onClick={() => openCard(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCard(index); } }}
            aria-expanded={selectedIndex === index}
          >
            <span className="feature-icon">{feature.icon}</span>
            <div className="feature-card-text">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
            <span className="feature-expand-hint">→</span>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="feature-modal-backdrop"
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          ref={(el) => el && el.focus()}
          role="dialog"
          aria-modal="true"
          aria-label={selectedFeature.title}
        >
          <div className="feature-modal">
            <div className="feature-modal-nav">
              <button
                className="feature-modal-close"
                onClick={closeCard}
                aria-label="Close"
              >
                ✕
              </button>
              <div className="feature-modal-arrows">
                <button
                  className="features-nav-btn features-nav-btn--arrow"
                  onClick={goPrev}
                  aria-label="Previous feature"
                >
                  ‹
                </button>
                <span className="features-nav-counter">
                  {selectedIndex + 1} / {features.length}
                </span>
                <button
                  className="features-nav-btn features-nav-btn--arrow"
                  onClick={goNext}
                  aria-label="Next feature"
                >
                  ›
                </button>
              </div>
            </div>
            <div className="feature-modal-body" key={selectedFeature.title}>
              <div className="features-content-header">
                <span className="feature-content-icon">{selectedFeature.icon}</span>
                <h3 className="feature-content-title">{selectedFeature.title}</h3>
              </div>
              <FeatureDetail detail={selectedFeature.detail} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Features;
