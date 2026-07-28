import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import CodeWindow from './CodeWindow';

SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('bash', bash);

const panels = [
  {
    filename: 'routes.tf.rb',
    language: 'ruby',
    code: `Belt.application.routes.draw do
  namespace :api, auth: :cognito do
    resources :posts
    resources :comments
  end
end`,
  },
  {
    filename: 'posts_controller.rb',
    language: 'ruby',
    code: `class PostsController < BeltController::Base
  before_action :authenticate!

  def index
    posts = Post.where(user_id: current_user_id)
    success_response(posts.map(&:attributes))
  end

  def create
    attrs = params.require(:post).permit(:title, :body)
    post = Post.create!(attrs.merge(user_id: current_user_id))
    success_response(post.attributes, 201)
  end
end`,
  },
  {
    filename: 'post.rb',
    language: 'ruby',
    code: `class Post < ActiveItem::Base
  self.primary_key = :id

  attr_accessor :id, :user_id, :title, :body, :created_at

  validates :title, presence: true
  before_create { self.id ||= SecureRandom.uuid }
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
