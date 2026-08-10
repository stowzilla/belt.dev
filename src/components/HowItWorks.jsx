import React from 'react';
import CodeWindow from './CodeWindow';

const steps = [
  {
    number: '01',
    title: 'Scaffold your app',
    description: 'One command scaffolds your entire serverless app — routes, controllers, models, frontend, environments, and git. Then generate resources with typed fields and associations.',
    filename: 'terminal',
    language: 'bash',
    code: `$ belt new space-chat --frontend react
✓ space-chat created successfully!

$ belt generate scaffold conversation title last_message_at:datetime
  create  lambda/models/conversation.rb
  create  lambda/controllers/api/conversations_controller.rb
  update  config/routes.rb
  update  config/contracts.rb
  create  infrastructure/modules/app/dynamodb.tf`,
  },
  {
    number: '02',
    title: 'Write your logic',
    description: 'Belt generates controllers with before_action, implicit JSON responses, and association traversal. Fat models, skinny controllers — just like Rails.',
    filename: 'messages_controller.rb',
    language: 'ruby',
    code: `class MessagesController < ApplicationController
  before_action :set_conversation

  def index
    @messages = @conversation.messages
  end

  def create
    @assistant_reply = @conversation.reply(params[:body])
  end

  private

  def set_conversation
    @conversation = Conversation.find(params[:conversation_id])
  end
end`,
  },
  {
    number: '03',
    title: 'Deploy',
    description: 'One command deploys Lambda, API Gateway, DynamoDB, CloudFront, and Cognito. Preflight checks catch issues before they hit AWS.',
    filename: 'terminal',
    language: 'bash',
    code: `$ belt generate auth
  create  infrastructure/modules/app/cognito.tf
  create  frontend/src/lib/auth.js
  create  frontend/src/pages/auth/Login.jsx

$ belt deploy
  ⚙ 1 API Gateway (api) + Cognito authorizer
  ⚙ 1 Lambda function (api)
  ⚙ 2 DynamoDB tables (conversations, messages)
  ⚙ 1 CloudFront distribution

Apply complete! Resources: 14 added.`,
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
