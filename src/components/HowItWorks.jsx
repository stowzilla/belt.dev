import React from 'react';
import CopyButton from './CopyButton';

const steps = [
  {
    number: '01',
    title: 'Draw your iron',
    description: 'One command scaffolds your entire serverless app — routes, schema, controllers, models, Gemfile. Then generate resources with typed fields and Belt wires everything together. No boilerplate, no hand-wiring.',
    code: `$ belt new my-app
✓ my-app created successfully!

$ cd my-app
$ belt generate resource item name:string status:string owner:string

  create  lambda/models/item.rb
  create  lambda/controllers/my_app/items_controller.rb
  update  config/routes.tf.rb
  update  config/schema.tf.rb
  update  lambda/lib/routes/my_app_routes.rb

✓ Resource 'item' generated!`,
  },
  {
    number: '02',
    title: 'Wire up the ship',
    description: 'Belt generates CRUD controllers that match your routes. Customize the logic — the framework handles params, auth, CORS, and error responses. Your controllers speak Rails.',
    code: `class MyAppControllers::ItemsController < ApplicationController
  def index
    items = Item.where(owner: current_user_id)
    success_response(items: items.map(&:to_h))
  end

  def create
    item = Item.create!(
      name: params[:name],
      status: 'active',
      owner: current_user_id
    )
    success_response(item: item.to_h, status: 201)
  end
end`,
  },
  {
    number: '03',
    title: 'Punch it',
    description: 'Belt wraps Terraform with environment awareness. Setup your state bucket, generate table definitions, and deploy — all from the CLI. One flow, zero context switching.',
    code: `$ belt generate environment dev
$ belt setup state dev
  ✓ State bucket ready (versioned, encrypted, TLS-only)

$ belt setup tables dev
  ✓ Generated DynamoDB tables for 1 model(s)

$ belt deploy dev
  ⚙ Parsed 5 routes across 1 namespace
  ⚙ Built Lambda package: my_app (2.1 MB)
  ⚙ Created API Gateway with Cognito auth
  ⚙ Applied IAM policies (least-privilege)

Deploy complete! Resources: 18 added.`,
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works-header">
        <h2>Three steps to the black.</h2>
        <p>
          No CloudFormation templates. No hand-wired API Gateway configurations.
          No IAM policy guesswork. Just <code>belt new</code>, <code>belt generate</code>,
          and <code>belt deploy</code>.
        </p>
      </div>

      <div className="steps">
        {steps.map((step) => (
          <div key={step.number} className="step">
            <div className="step-info">
              <span className="step-number">⚙ {step.number}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
            <div className="step-code">
              <CopyButton text={step.code} />
              <pre><code>{step.code}</code></pre>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
