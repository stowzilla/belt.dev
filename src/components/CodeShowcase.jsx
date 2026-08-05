import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import CodeWindow from './CodeWindow';

SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('bash', bash);

const panels = [
  {
    filename: 'config/routes.rb',
    language: 'ruby',
    code: `Belt.application.routes.draw do
  namespace :api, auth: :cognito do
    resources :conversations do
      resources :messages, only: [:index, :create]
    end
  end
end`,
  },
  {
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
    filename: 'message.rb',
    language: 'ruby',
    code: `class Message < ApplicationRecord
  attr_accessor :role, :body, :sent_at

  belongs_to :conversation

  validates :role, inclusion: { in: %w[user assistant] }
  validates :body, presence: true

  before_create :set_sent_at

  private

  def set_sent_at
    self.sent_at ||= Time.now.utc.iso8601
  end
end`,
  },
];

function CodeShowcase() {
  return (
    <section className="code-showcase">
      <div className="code-showcase-header">
        <h2>Convention over configuration.</h2>
        <p>
          If you've built a Rails app, you already know how Belt works.
          Routes, controllers, models — same patterns, same muscle memory.
          Belt handles the Lambda packaging, API Gateway wiring, IAM, and DynamoDB setup.
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
