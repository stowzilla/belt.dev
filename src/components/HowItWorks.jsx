import React from 'react';
import CodeWindow from './CodeWindow';

import scaffoldCode from '../code-samples/how-it-works/01-scaffold.sh?raw';
import itemsControllerCode from '../code-samples/how-it-works/02-items_controller.rb?raw';
import deployCode from '../code-samples/how-it-works/03-deploy.sh?raw';

const steps = [
  {
    number: '01',
    title: 'Scaffold your app',
    description: 'One command scaffolds your entire serverless app — routes, contracts, controllers, models, Gemfile. Then generate resources with typed fields and Belt wires everything together. No boilerplate, no hand-wiring.',
    filename: 'terminal',
    language: 'bash',
    code: scaffoldCode,
  },
  {
    number: '02',
    title: 'Write your logic',
    description: 'Belt generates CRUD controllers that match your routes. Customize the logic — the framework handles params, auth, CORS, and error responses. Your controllers speak Rails.',
    filename: 'items_controller.rb',
    language: 'ruby',
    code: itemsControllerCode,
  },
  {
    number: '03',
    title: 'Deploy',
    description: 'Belt wraps Terraform with environment awareness. Setup your state bucket, generate table definitions, and deploy — all from the CLI. One flow, zero context switching.',
    filename: 'terminal',
    language: 'bash',
    code: deployCode,
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works-header">
        <h2>Three steps to production.</h2>
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
              <div className="step-heading">
                <span className="step-number">{step.number}</span>
                <h3 className="step-title">{step.title}</h3>
              </div>
              <p className="step-description">{step.description}</p>
            </div>
            <CodeWindow
              code={step.code}
              language={step.language}
              filename={step.filename}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
