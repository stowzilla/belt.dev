import React from 'react';
import CopyButton from './CopyButton';

const step1Code = `gem install belt

belt new my-app --frontend react

# ✓ my-app created successfully!
# Gemfile, routes, schema, controllers,
# frontend — all scaffolded and ready.`;

const step2Code = `cd my-app

belt generate resource post title:string body:text author:string
belt generate resource comment body:text post_id:string

# Models, controllers, routes, schema —
# generated and wired together.`;

const step3Code = `belt generate environment dev
belt setup state dev
belt setup tables dev
belt deploy dev

# You're flyin'. API is live in AWS.
# belt deploy frontend dev  ← bonus round`;

function GetStarted() {
  return (
    <section className="get-started" id="get-started">
      <div className="get-started-content">
        <h2>Ready to ride in three ticks.</h2>
        <p className="get-started-subtitle">
          Install Belt, scaffold a project, and deploy. The CLI carries the weight —
          you just point and shoot.
        </p>

        <div className="get-started-steps">
          <div className="get-started-step">
            <h3>⚙ 1. Draw your iron</h3>
            <div className="get-started-code-wrapper">
              <CopyButton text={step1Code} />
              <pre><code>{step1Code}</code></pre>
            </div>
          </div>

          <div className="get-started-step">
            <h3>💎 2. Forge your resources</h3>
            <div className="get-started-code-wrapper">
              <CopyButton text={step2Code} />
              <pre><code>{step2Code}</code></pre>
            </div>
          </div>

          <div className="get-started-step">
            <h3>🚀 3. Burn hard</h3>
            <div className="get-started-code-wrapper">
              <CopyButton text={step3Code} />
              <pre><code>{step3Code}</code></pre>
            </div>
          </div>
        </div>

        <div className="get-started-links">
          <a href="https://github.com/stowzilla/terraform-provider-conveyor-belt" className="btn btn-primary">
            ⚙ View Documentation
          </a>
          <a href="https://registry.terraform.io/providers/stowzilla/conveyor-belt" className="btn btn-secondary">
            Terraform Registry
          </a>
        </div>
      </div>
    </section>
  );
}

export default GetStarted;
