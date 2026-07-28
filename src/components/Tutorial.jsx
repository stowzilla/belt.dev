import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import hcl from 'react-syntax-highlighter/dist/esm/languages/prism/hcl';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from './CopyButton';

SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('hcl', hcl);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('javascript', javascript);

const customStyle = {
  ...oneDark,
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: 'none',
    textShadow: 'none',
  },
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: '#0d1117',
    borderRadius: '0 0 12px 12px',
    padding: '1.5rem',
    fontSize: '0.85rem',
    lineHeight: '1.65',
    margin: 0,
    textShadow: 'none',
  },
};

function CodeBlock({ filename, language, children }) {
  return (
    <div className="tutorial-code">
      <div className="tutorial-code-header">
        <span className="tutorial-code-dot red" />
        <span className="tutorial-code-dot yellow" />
        <span className="tutorial-code-dot green" />
        <span className="tutorial-code-filename">{filename}</span>
        <CopyButton text={children} />
      </div>
      <SyntaxHighlighter language={language} style={customStyle}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

function Callout({ children }) {
  return (
    <div className="tutorial-callout">
      <p>{children}</p>
    </div>
  );
}

function Tutorial() {
  return (
    <div className="app">
      <nav className="tutorial-nav">
        <div className="nav-brand">
          <a href="/">
            <img className="nav-logo" src="/ruby-belt.png" alt="Belt" />
            <span className="nav-name">Belt</span>
          </a>
        </div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="https://github.com/stowzilla/belt">GitHub</a>
        </div>
      </nav>

      <article className="tutorial">
        <header className="tutorial-hero">
          <span className="tutorial-badge">Tutorial</span>
          <h1>
            Build an AI Chat App<br />
            <span className="hero-highlight">in 15 Minutes</span>
          </h1>
          <p>
            From an empty directory to a fully deployed AI assistant powered by Amazon Bedrock —
            complete with conversation history, streaming-style UX, and zero boilerplate.
            All through the Belt CLI. Let's ride.
          </p>
        </header>

        <nav className="tutorial-toc">
          <h3>⚙ Manifest</h3>
          <ol>
            <li><a href="#prerequisites">Provisions & Prerequisites</a></li>
            <li><a href="#belt-new">Belt New — Scaffold the Ship</a></li>
            <li><a href="#generate">Belt Generate — Forge Your Resources</a></li>
            <li><a href="#models">Active Item — The Models</a></li>
            <li><a href="#controllers">Belt Controllers — Wire the AI</a></li>
            <li><a href="#infrastructure">Infrastructure — Bedrock Permissions</a></li>
            <li><a href="#deploy">Belt Deploy — Let It Rip</a></li>
            <li><a href="#frontend">Belt Frontend — The ChatGPT Experience</a></li>
            <li><a href="#whats-next">What's Next</a></li>
          </ol>
        </nav>

        {/* Section 1: Prerequisites */}
        <section className="tutorial-section" id="prerequisites">
          <h2>01 — Provisions & Prerequisites</h2>
          <span className="tutorial-timer">⏱ 2 minutes</span>
          <p>
            Before we break atmo, make sure your hold's stocked with the right gear:
          </p>
          <ul>
            <li><strong>Ruby</strong> 3.4 (for Lambda functions and the Belt CLI)</li>
            <li><strong>Terraform</strong> ≥ 1.0 installed</li>
            <li><strong>AWS CLI</strong> configured with valid credentials</li>
            <li>An AWS account with permissions for Lambda, API Gateway, DynamoDB, IAM, and <strong>Amazon Bedrock</strong></li>
            <li>Bedrock model access enabled for <strong>Claude Haiku 4.5</strong> (us-east-1)</li>
          </ul>
          <p>Install Belt:</p>
          <CodeBlock filename="terminal" language="bash">
{`gem install belt

# Verify it's loaded in the holster
belt --version
# Belt 0.2.9`}
          </CodeBlock>
          <Callout>
            <strong>Bedrock access:</strong> In the AWS Console, go to Amazon Bedrock → Model access
            and request access to Anthropic Claude models. Approval is usually instant.
          </Callout>
        </section>

        {/* Section 2: belt new */}
        <section className="tutorial-section" id="belt-new">
          <h2>02 — Belt New — Scaffold the Ship</h2>
          <span className="tutorial-timer">⏱ 1 minute</span>
          <p>
            One command builds your entire project structure — routes file, schema file,
            Lambda entry point, controllers directory, models, Gemfile, environments, and git repo.
            No <code>mkdir</code> chains, no boilerplate copying.
          </p>
          <CodeBlock filename="terminal" language="bash">
{`belt new space-chat --frontend react

# Creating new Belt application: space-chat
#   create  space-chat/lambda/controllers/api/
#   create  space-chat/lambda/models/
#   create  space-chat/lambda/lib/routes/
#   create  space-chat/lambda/config/
#   create  space-chat/infrastructure/modules/app/
#   create  space-chat/frontend/src/
#   create  space-chat/config/
#   create  space-chat/Gemfile
#   create  space-chat/Rakefile
#   create  space-chat/lambda/api.rb
#   create  space-chat/lambda/config/environment.rb
#   create  space-chat/lambda/models/application_record.rb
#   create  space-chat/lambda/controllers/api/application_controller.rb
#   create  space-chat/frontend/src/App.jsx
#   create  space-chat/frontend/src/lib/apiClient.js
#   create  space-chat/frontend/vite.config.js
#   create  space-chat/frontend/package.json
#   create  space-chat/config/routes.tf.rb
#   create  space-chat/config/schema.tf.rb
#   create  space-chat/config/lambda/api.yml
#   create  space-chat/infrastructure/modules/app/main.tf
#   create  space-chat/infrastructure/modules/app/frontend.tf
#   create  space-chat/README.md
#   create  space-chat/AGENTS.md
# Creating environment: dev
#   ...
# ✓ Environment 'dev' created!
# Creating environment: prod
#   ...
# ✓ Environment 'prod' created!
#   init    space-chat/.git/
#   Running bundle install...
#   ✓ Bundle installed
#
# ✓ space-chat created successfully!
#
# Next steps:
#   belt setup state              # Create the S3 state bucket
#   belt deploy                   # Deploy to AWS

cd space-chat`}
          </CodeBlock>
          <Callout>
            <strong>What just happened?</strong> Belt scaffolded a complete serverless project with
            a React frontend, dev and prod environments, a Lambda entry point, application controller,
            routes and schema files in <code>config/</code>, infrastructure modules, and a git repo.
            It's like <code>rails new</code> but for the serverless frontier.
          </Callout>
        </section>

        {/* Section 3: belt generate */}
        <section className="tutorial-section" id="generate">
          <h2>03 — Belt Generate — Forge Your Resources</h2>
          <span className="tutorial-timer">⏱ 2 minutes</span>
          <p>
            Here's where the Belt CLI shines. Instead of hand-writing models,
            controllers, routes, and schema — one command generates all four and wires
            them together. For our AI chat, we need conversations and messages.
          </p>
          <CodeBlock filename="terminal" language="bash">
{`# Generate conversations (stores chat history)
belt generate scaffold conversation title:string last_message_at:datetime last_message:string

#   create  lambda/models/conversation.rb
#   create  lambda/controllers/api/conversations_controller.rb
#   update  config/routes.tf.rb
#   update  lambda/lib/routes/api_routes.rb
#   update  config/schema.tf.rb
#
# ✓ Scaffold 'conversation' generated!

# Generate messages (user + AI messages)
belt generate scaffold message conversation_id:string role:string body:string sent_at:datetime

#   create  lambda/models/message.rb
#   create  lambda/controllers/api/messages_controller.rb
#   update  config/routes.tf.rb
#   update  lambda/lib/routes/api_routes.rb
#   update  config/schema.tf.rb
#
# ✓ Scaffold 'message' generated!`}
          </CodeBlock>
          <Callout>
            <strong>Note the <code>role</code> field.</strong> Every message is either
            <code>"user"</code> or <code>"assistant"</code> — this maps directly to
            Bedrock's Converse API format. Belt handles storage; Bedrock handles intelligence.
          </Callout>
        </section>

        {/* Section 4: Models */}
        <section className="tutorial-section" id="models">
          <h2>04 — Active Item — The Models</h2>
          <span className="tutorial-timer">⏱ 2 minutes</span>
          <p>
            <strong>Active Item</strong> is an ActiveRecord-style ORM for DynamoDB.
            Belt's generator gave us working models. Let's look at what we've got:
          </p>
          <CodeBlock filename="lambda/models/conversation.rb" language="ruby">
{`class Conversation < ApplicationRecord
  # Table: space-chat-{env}-conversations

  attr_accessor :title
  attr_accessor :last_message_at
  attr_accessor :last_message

  def to_h
    {
      id: id,
      title: title,
      last_message_at: last_message_at,
      last_message: last_message,
      created_at: created_at,
      updated_at: updated_at
    }
  end
end`}
          </CodeBlock>
          <CodeBlock filename="lambda/models/message.rb" language="ruby">
{`class Message < ApplicationRecord
  # Table: space-chat-{env}-messages

  attr_accessor :conversation_id
  attr_accessor :role          # "user" or "assistant"
  attr_accessor :body
  attr_accessor :sent_at

  def to_h
    {
      id: id,
      conversation_id: conversation_id,
      role: role,
      body: body,
      sent_at: sent_at,
      created_at: created_at,
      updated_at: updated_at
    }
  end
end`}
          </CodeBlock>
          <p>
            Clean and simple. Active Item models are just classes with accessors and validations —
            no migration files, no schema boilerplate. DynamoDB handles the rest.
          </p>
        </section>

        {/* Section 5: Controllers */}
        <section className="tutorial-section" id="controllers">
          <h2>05 — Belt Controllers — Wire the AI</h2>
          <span className="tutorial-timer">⏱ 3 minutes</span>
          <p>
            This is where the magic happens. We need a <strong>completions</strong> endpoint that
            takes the user's message, loads conversation history, sends it to Amazon Bedrock,
            and stores the AI's response. One command scaffolds the controller and wires the route:
          </p>
          <CodeBlock filename="terminal" language="bash">
{`belt generate controller completions

#   create  lambda/controllers/api/completions_controller.rb
#   update  config/routes.tf.rb
#   update  lambda/lib/routes/api_routes.rb
#
# ✓ Controller 'completions' generated!`}
          </CodeBlock>
          <p>
            Belt generated the controller file and added a route. Now customize it to call Bedrock.
            Replace the generated controller with our AI logic:
          </p>
          <CodeBlock filename="lambda/controllers/api/completions_controller.rb" language="ruby">
{`require 'aws-sdk-bedrockruntime'
require_relative 'application_controller'

module ApiControllers
  class CompletionsController < ApplicationController
    MODEL_ID = 'us.anthropic.claude-haiku-4-5-20251001-v1:0'

    # POST /completions
    def create
      conversation_id = params[:conversation_id]
      user_message = params[:message]

      # Save the user's message
      user_msg = Message.new(
        conversation_id: conversation_id,
        role: 'user',
        body: user_message,
        sent_at: Time.now.utc.iso8601
      )
      user_msg.save

      # Load conversation history for context
      history = Message.where(conversation_id: conversation_id)
                       .sort_by { |m| m.sent_at || m.created_at }
                       .last(20)

      # Build the Bedrock messages array
      messages = history.map do |msg|
        { role: msg.role, content: [{ text: msg.body }] }
      end

      # Call Bedrock's Converse API
      client = Aws::BedrockRuntime::Client.new(region: 'us-east-1')
      response = client.converse(
        model_id: MODEL_ID,
        messages: messages,
        system: [{ text: "You are a helpful AI assistant." }],
        inference_config: { max_tokens: 2048, temperature: 0.7 }
      )

      assistant_text = response.output.message.content.first.text

      # Save the AI response
      assistant_msg = Message.new(
        conversation_id: conversation_id,
        role: 'assistant',
        body: assistant_text,
        sent_at: Time.now.utc.iso8601
      )
      assistant_msg.save

      # Update conversation metadata
      conversation = Conversation.find_by(id: conversation_id)
      if conversation
        conversation.update(
          last_message_at: assistant_msg.sent_at,
          last_message: assistant_text&.slice(0, 100)
        )
      end

      success_response(
        assistant_message: assistant_msg.to_h
      )
    end
  end
end`}
          </CodeBlock>
          <p>
            One small tweak to the scaffolded messages controller — the frontend fetches messages
            by conversation, so we need to filter on <code>conversation_id</code>:
          </p>
          <CodeBlock filename="lambda/controllers/api/messages_controller.rb" language="ruby">
{`module ApiControllers
  class MessagesController < ApplicationController
    # GET /messages?conversation_id=xxx
    def index
      if params[:conversation_id]
        messages = Message.where(conversation_id: params[:conversation_id])
      else
        messages = Message.all
      end
      success_response(messages: messages.map(&:to_h))
    end
  end
end`}
          </CodeBlock>
          <p>
            Finally, update the route to give the completions endpoint access to both tables:
          </p>
          <CodeBlock filename="config/routes.tf.rb" language="ruby">
{`Belt.application.routes.draw do
  namespace :api do
    resources :conversations, tables: [:conversations]
    resources :messages, tables: [:messages]

    post "/completions", action: :create,
                         controller: :completions,
                         tables: [:messages, :conversations]
  end
end`}
          </CodeBlock>
          <Callout>
            <strong>That's the entire backend.</strong> One controller, 50 lines of Ruby, and you've got
            an AI chat API with persistent conversation history. Active Item handles storage;
            Belt handles the plumbing. All that's left is granting Bedrock permissions.
          </Callout>
        </section>

        {/* Section 6: Infrastructure */}
        <section className="tutorial-section" id="infrastructure">
          <h2>06 — Infrastructure — Bedrock Permissions</h2>
          <span className="tutorial-timer">⏱ 2 minutes</span>
          <p>
            The Lambda needs permission to call Bedrock. Conveyor Belt creates the Lambda's IAM role
            automatically — we just create a policy and pass it via <code>shared_iam_policy_arns</code>:
          </p>
          <CodeBlock filename="infrastructure/modules/app/bedrock.tf" language="hcl">
{`data "aws_caller_identity" "current" {}

resource "aws_iam_policy" "bedrock_access" {
  name = "\${var.app_name}-\${var.environment}-bedrock-access"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:Converse"
        ]
        Resource = [
          "arn:aws:bedrock:*::foundation-model/anthropic.claude-*",
          "arn:aws:bedrock:us-east-1:\${data.aws_caller_identity.current.account_id}:inference-profile/us.anthropic.*"
        ]
      }
    ]
  })
}`}
          </CodeBlock>
          <p>
            Then reference it in your <code>conveyor_belt</code> resource (in <code>main.tf</code>):
          </p>
          <CodeBlock filename="infrastructure/modules/app/main.tf (snippet)" language="hcl">
{`resource "conveyor_belt" "main" {
  # ... other config ...

  # Attach Bedrock permissions to the Lambda role
  shared_iam_policy_arns = [aws_iam_policy.bedrock_access.arn]
}`}
          </CodeBlock>
          <p>
            Add the Bedrock SDK to your Gemfile:
          </p>
          <CodeBlock filename="Gemfile" language="ruby">
{`source 'https://rubygems.org'

gem 'activeitem'
gem 'belt'
gem 'lambda_loadout'
gem 'aws-sdk-bedrockruntime', '~> 1.0'`}
          </CodeBlock>
          <CodeBlock filename="terminal" language="bash">
{`bundle install`}
          </CodeBlock>
          <Callout>
            <strong>Security note:</strong> The <code>shared_iam_policy_arns</code> attribute attaches
            additional policies to the Lambda's role. Conveyor Belt handles DynamoDB and CloudWatch
            permissions automatically — Bedrock is extra because it's not inferred from routes.
          </Callout>
        </section>

        {/* Section 7: Deploy */}
        <section className="tutorial-section" id="deploy">
          <h2>07 — Belt Deploy — Let It Rip</h2>
          <span className="tutorial-timer">⏱ 2 minutes</span>
          <p>
            Two scaffold fixes before we deploy. First, fix the routes source path — it
            resolves one level too shallow:
          </p>
          <CodeBlock filename="infrastructure/modules/app/main.tf" language="hcl">
{`resource "conveyor_belt" "main" {
  # ...

  # Fix: change ../../config to ../../../config (3 levels up from modules/app/)
  source            = "\${path.module}/../../../config/routes.tf.rb"

  # lambda_source_dir is already correct at ../../../lambda
}`}
          </CodeBlock>
          <p>
            Second, fix CORS. The scaffold only allows <code>http://localhost:3000</code> in the
            CORS allowlist, so your deployed CloudFront URL will be blocked. Add the CloudFront
            domain to <code>frontend_urls</code> automatically:
          </p>
          <CodeBlock filename="infrastructure/modules/app/main.tf" language="hcl">
{`resource "conveyor_belt" "main" {
  # ... other config ...

  # Fix: include the CloudFront domain so CORS works when deployed
  frontend_urls = concat(var.frontend_urls, ["https://\${aws_cloudfront_distribution.frontend.domain_name}"])
}`}
          </CodeBlock>
          <Callout>
            <strong>Why this matters:</strong> Without this fix, the API Gateway will reject
            browser requests from your CloudFront URL with a CORS error — the preflight
            response only allows <code>localhost:3000</code>. This <code>concat</code> pattern
            keeps localhost working for development while automatically allowing production traffic.
          </Callout>
          <p>
            Now set up the remote state bucket and deploy the full stack:
          </p>
          <CodeBlock filename="terminal" language="bash">
{`# Create the S3 state bucket (one-time setup)
belt setup state --bucket space-chat-tfstate-dev01

# Deploy everything
belt deploy dev

# belt deploy → init + plan + apply  (in infrastructure/dev/)
#
# Conveyor Belt will create:
#   ⚙ 1 API Gateway (space_chat)
#   ⚙ 1 Lambda function (space_chat) + Bedrock IAM policy
#   ⚙ 2 DynamoDB tables (conversations, messages)
#   ⚙ 1 S3 bucket (frontend)
#   ⚙ 1 CloudFront distribution
#
# Apply complete! Resources: 11 added, 0 changed, 0 destroyed.
#
# Outputs:
#   api_url      = "https://a0dexkmei6.execute-api.us-east-1.amazonaws.com/dev"
#   frontend_url = "https://d2tzs58mzfvmlv.cloudfront.net"

# Test the API directly
curl -X POST https://a0dexkmei6.execute-api.us-east-1.amazonaws.com/dev/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "conversation_id": "test-123",
    "message": "What is serverless computing?"
  }'

# Response:
# {
#   "assistant_message": { "id": "...", "role": "assistant", "body": "Serverless computing is..." }
# }`}
          </CodeBlock>
          <p>
            Your AI is live. One HTTP call and Claude responds through your Lambda, with
            the conversation persisted in DynamoDB. Now let's give it a proper UI.
          </p>
        </section>

        {/* Section 8: Frontend */}
        <section className="tutorial-section" id="frontend">
          <h2>08 — Belt Frontend — The ChatGPT Experience</h2>
          <span className="tutorial-timer">⏱ 5 minutes</span>
          <p>
            The scaffolded CRUD pages won't cut it here — we want a ChatGPT-style interface
            with a conversation sidebar, message thread, and input area.
          </p>
          <Callout>
            <strong>Already scaffolded:</strong> <code>belt new --frontend react</code> generated
            <code>frontend/src/lib/apiClient.js</code> — a lightweight fetch wrapper that reads
            <code>VITE_API_URL</code> from your environment. The <code>App.jsx</code> below imports
            it directly. No extra setup needed.
          </Callout>
          <p>
            Here's what Belt generated — a simple API client that points at your deployed Lambda
            (or localhost during development):
          </p>
          <CodeBlock filename="frontend/src/lib/apiClient.js (scaffolded by Belt)" language="javascript">
{`const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function apiClient(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options

  const config = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers }
  }

  if (body) config.body = JSON.stringify(body)

  const response = await fetch(\`\${API_URL}\${path}\`, config)
  const data = await response.json()

  if (!response.ok) throw new Error(data.error || \`Request failed: \${response.status}\`)

  return data
}`}
          </CodeBlock>
          <p>
            Replace the entire contents of <code>frontend/src/App.jsx</code>:
          </p>
          <CodeBlock filename="frontend/src/App.jsx" language="javascript">
{`import { useState, useEffect, useRef } from 'react'
import { apiClient } from './lib/apiClient'
import './App.css'

function App() {
  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const sendingRef = useRef(false)

  useEffect(() => { loadConversations() }, [])

  useEffect(() => {
    if (activeConvId && !sendingRef.current) loadMessages(activeConvId)
    else if (!activeConvId) setMessages([])
  }, [activeConvId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  async function loadConversations() {
    const data = await apiClient('/conversations')
    const convs = data.conversations || data
    setConversations(Array.isArray(convs) ? convs.sort((a, b) =>
      (b.updated_at || '').localeCompare(a.updated_at || '')) : [])
  }

  async function loadMessages(convId) {
    const data = await apiClient(\`/messages?conversation_id=\${convId}\`)
    const msgs = data.messages || data
    setMessages(Array.isArray(msgs) ? msgs.sort((a, b) =>
      (a.sent_at || a.created_at || '').localeCompare(b.sent_at || b.created_at || '')) : [])
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!input.trim() || thinking) return

    const userMessage = input.trim()
    setInput('')

    // Create conversation on first message
    let convId = activeConvId
    if (!convId) {
      sendingRef.current = true
      const data = await apiClient('/conversations', {
        method: 'POST', body: { title: userMessage.slice(0, 60) }
      })
      convId = data.conversation?.id || data.id
      setActiveConvId(convId)
      loadConversations()
    }

    // Optimistic UI — show user message immediately
    const tempId = \`temp-\${Date.now()}\`
    setMessages(prev => [...prev, { id: tempId, role: 'user', body: userMessage }])
    setThinking(true)

    // Call completions → Bedrock → response
    const data = await apiClient('/completions', {
      method: 'POST',
      body: { conversation_id: convId, message: userMessage }
    })

    setMessages(prev => [...prev, data.assistant_message])
    setThinking(false)
    sendingRef.current = false
    loadConversations()
  }

  function handleNewChat() {
    setActiveConvId(null)
    setMessages([])
    inputRef.current?.focus()
  }

  return (
    <div className="chat-app">
      <aside className={\`sidebar \${sidebarOpen ? 'open' : 'closed'}\`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={handleNewChat}>
            + New Chat
          </button>
        </div>
        <div className="conversation-list">
          {conversations.map(conv => (
            <div key={conv.id}
              className={\`conversation-item \${conv.id === activeConvId ? 'active' : ''}\`}
              onClick={() => setActiveConvId(conv.id)}>
              {conv.title || 'Untitled'}
            </div>
          ))}
        </div>
      </aside>

      <main className="chat-main">
        <div className="messages-container">
          {messages.length === 0 && !thinking && (
            <div className="empty-state">
              <h2>🤖 SpaceChat</h2>
              <p>Send a message to start a conversation</p>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={\`message \${msg.role}\`}>
              <div className="message-avatar">
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-body">{msg.body}</div>
            </div>
          ))}
          {thinking && (
            <div className="message assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-body thinking">● ● ●</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-area" onSubmit={handleSend}>
          <textarea ref={inputRef} value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); handleSend(e)
              }
            }}
            placeholder="Send a message..." rows={1} disabled={thinking}
          />
          <button type="submit" disabled={!input.trim() || thinking}>↑</button>
        </form>
      </main>
    </div>
  )
}

export default App`}
          </CodeBlock>
          <p>
            Now replace <code>frontend/src/index.css</code> — the scaffold generates a light theme,
            but we need a dark base:
          </p>
          <CodeBlock filename="frontend/src/index.css" language="bash">
{`* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0d0d0d;
  color: #ececec;
  height: 100vh;
  overflow: hidden;
}

#root { height: 100vh; }`}
          </CodeBlock>
          <p>
            Now create <code>frontend/src/App.css</code> with the full dark ChatGPT-style theme:
          </p>
          <CodeBlock filename="frontend/src/App.css" language="bash">
{`:root {
  --bg-primary: #0d0d0d;
  --bg-secondary: #171717;
  --bg-tertiary: #212121;
  --text-primary: #ececec;
  --text-secondary: #a0a0a0;
  --border: #2e2e2e;
  --accent: #6e56cf;
  --accent-hover: #7c6bd6;
  --user-bg: #2a2a2a;
  --assistant-bg: transparent;
}

.chat-app {
  display: flex;
  height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: width 0.2s ease;
}

.sidebar.closed { width: 0; overflow: hidden; }

.sidebar-header {
  padding: 12px;
  border-bottom: 1px solid var(--border);
}

.new-chat-btn {
  width: 100%;
  padding: 10px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.new-chat-btn:hover { background: #2a2a2a; }

.conversation-list { flex: 1; overflow-y: auto; padding: 8px; }

.conversation-item {
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background 0.1s;
}

.conversation-item:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.conversation-item.active {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* Main chat area */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 24px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 8px;
  color: var(--text-secondary);
}

.empty-state h2 {
  font-size: 24px;
  color: var(--text-primary);
}

/* Messages */
.message {
  display: flex;
  gap: 16px;
  padding: 16px 24px;
  max-width: 768px;
  margin: 0 auto;
  width: 100%;
}

.message.user {
  background: var(--user-bg);
  border-radius: 12px;
  max-width: 720px;
  margin: 8px auto;
}

.message-avatar {
  font-size: 20px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-body {
  line-height: 1.6;
  font-size: 15px;
  white-space: pre-wrap;
  word-break: break-word;
  padding-top: 3px;
}

.message-body.thinking {
  color: var(--text-secondary);
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* Input area */
.input-area {
  padding: 16px 24px 24px;
  max-width: 768px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.input-area textarea {
  flex: 1;
  padding: 12px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 15px;
  font-family: inherit;
  resize: none;
  outline: none;
  line-height: 1.5;
  max-height: 200px;
}

.input-area textarea:focus { border-color: var(--accent); }
.input-area textarea::placeholder { color: var(--text-secondary); }

.input-area button {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: var(--accent);
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.input-area button:hover:not(:disabled) { background: var(--accent-hover); }
.input-area button:disabled { opacity: 0.4; cursor: not-allowed; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* Responsive */
@media (max-width: 768px) {
  .sidebar { position: absolute; z-index: 10; height: 100vh; }
  .sidebar.closed { display: none; }
}`}
          </CodeBlock>
          <p>Deploy the frontend:</p>
          <CodeBlock filename="terminal" language="bash">
{`belt deploy frontend dev

# 📦 Installing dependencies...
# 🏗️  Building frontend...
# ☁️  Deploying to S3...
# 🔄 Invalidating CloudFront cache...
#
# ✅ Frontend deployed to dev!
#    https://d2tzs58mzfvmlv.cloudfront.net`}
          </CodeBlock>
          <Callout>
            <strong>The full ChatGPT experience.</strong> Conversation sidebar on the left,
            AI message thread in the center, auto-resizing input at the bottom. New conversations
            auto-title from the first message. Thinking dots while Bedrock processes. All
            backed by DynamoDB for persistent history.
          </Callout>
          <div className="tutorial-demo-link">
            <span className="demo-note">Follow the steps above to deploy your own SpaceChat — takes about 15 minutes end to end.</span>
          </div>
        </section>

        {/* Section 9: What's Next */}
        <section className="tutorial-section" id="whats-next">
          <h2>09 — What's Next</h2>
          <p>
            You've got a running AI assistant. Here's where you might take it from here:
          </p>
          <ul>
            <li><strong>Swap models</strong> — change <code>MODEL_ID</code> to Claude Sonnet 4 for smarter responses</li>
            <li><strong>System prompts</strong> — customize the AI's personality per conversation</li>
            <li><strong>Streaming</strong> — use <code>converse_stream</code> for token-by-token output</li>
            <li><strong>Image understanding</strong> — send images to Claude's vision capability</li>
            <li><strong>Rate limiting</strong> — add token/request limits per user</li>
            <li><strong>Authentication</strong> — add Cognito auth with <code>auth: :cognito</code> in routes</li>
            <li><strong>More environments</strong> — <code>belt generate environment staging</code></li>
            <li><strong>CI/CD</strong> — run <code>belt deploy prod</code> from GitHub Actions on merge to main</li>
          </ul>

          <h3>Belt CLI Quick Reference</h3>
          <CodeBlock filename="terminal" language="bash">
{`belt new <app> [--frontend react]           # Scaffold a new Belt app
belt generate scaffold <name> [fields...]   # Model + controller + routes + schema
belt generate model <name> [fields...]      # Model only
belt generate controller <name>             # Controller only
belt generate environment <name>            # New Terraform environment
belt generate frontend <react|vue|svelte>   # Frontend app scaffold
belt generate views <resource> [fields...]  # React CRUD pages
belt setup state                            # S3 state bucket (secured)
belt setup tables <env>                     # DynamoDB from models
belt setup frontend <env>                   # S3 + CloudFront hosting
belt deploy [env]                           # Deploy everything (init → plan → apply)
belt deploy frontend <env>                  # Build + deploy frontend
belt server                                 # Start local frontend dev server
belt routes [-g PATTERN]                    # Show route definitions
belt console                                # Interactive IRB console
belt init <env>                             # terraform init
belt plan <env>                             # terraform plan
belt apply <env>                            # terraform apply
belt destroy <env>                          # terraform destroy
belt output <env>                           # terraform output`}
          </CodeBlock>
        </section>

        <div className="tutorial-divider" />

        <section className="tutorial-final">
          <h2>You're flyin' now.</h2>
          <p>
            Conveyor Belt, Belt, Active Item, and Lambda Loadout — four gems that turn
            a single CLI command into a production AI application. No boilerplate. No YAML.
            Just <code>belt new</code>, add Bedrock, and ride.
          </p>
          <div className="hero-actions">
            <a href="https://github.com/stowzilla/terraform-provider-conveyor-belt" className="btn btn-primary">
              ⚙ Full Documentation
            </a>
            <a href="/" className="btn btn-secondary">
              ← Back to Home
            </a>
          </div>
        </section>
      </article>
    </div>
  );
}

export default Tutorial;
