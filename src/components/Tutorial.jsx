import React, { useState, useEffect, useRef } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import hcl from 'react-syntax-highlighter/dist/esm/languages/prism/hcl';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from './CopyButton';

// Code samples - prerequisites
import installCode from '../code-samples/tutorial/prerequisites/install.sh?raw';

// Code samples - belt-new
import beltNewCode from '../code-samples/tutorial/belt-new/scaffold.sh?raw';

// Code samples - generate
import generateScaffoldCode from '../code-samples/tutorial/generate/scaffold.sh?raw';

// Code samples - models
import conversationModelCode from '../code-samples/tutorial/models/conversation.rb?raw';
import messageModelCode from '../code-samples/tutorial/models/message.rb?raw';

// Code samples - controllers
import messagesControllerCode from '../code-samples/tutorial/controllers/messages_controller.rb?raw';
import routesCode from '../code-samples/tutorial/controllers/routes.rb?raw';

// Code samples - infrastructure
import bedrockTfCode from '../code-samples/tutorial/infrastructure/bedrock.tf?raw';
import lambdaConfigCode from '../code-samples/tutorial/infrastructure/api.yml?raw';
import mainSnippetCode from '../code-samples/tutorial/infrastructure/main-snippet.tf?raw';
import gemfileCode from '../code-samples/tutorial/infrastructure/Gemfile?raw';
import bundleInstallCode from '../code-samples/tutorial/infrastructure/bundle.sh?raw';

// Code samples - deploy
import deployCode from '../code-samples/tutorial/deploy/deploy.sh?raw';

// Code samples - console
import consoleSessionCode from '../code-samples/tutorial/console/session.sh?raw';

// Code samples - frontend
import appJsxCode from '../code-samples/tutorial/frontend/App.jsx?raw';
import indexCssCode from '../code-samples/tutorial/frontend/index.css?raw';
import appCssCode from '../code-samples/tutorial/frontend/App.css?raw';

// Code samples - auth
import authGenerateCode from '../code-samples/tutorial/auth/generate.sh?raw';
import authRoutesCode from '../code-samples/tutorial/auth/routes.rb?raw';
import createUserCode from '../code-samples/tutorial/auth/create-user.sh?raw';
import authEnvYmlCode from '../code-samples/tutorial/auth/env.yml?raw';

// Code samples - whats-next
import cliReferenceCode from '../code-samples/tutorial/whats-next/cli-reference.sh?raw';

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

// Extract shell commands (lines starting with $) for copying
function extractShellCommands(code) {
  return code
    .split('\n')
    .filter(line => line.trimStart().startsWith('$'))
    .map(line => line.trimStart().replace(/^\$\s*/, ''))
    .filter(cmd => cmd.trim().length > 0)
    .join('\n');
}

function CodeBlock({ filename, language, children, collapsible }) {
  const [expanded, setExpanded] = React.useState(!collapsible);
  // For terminal/shell blocks, copy only the commands, not the output
  const isTerminal = filename === 'terminal' || language === 'bash';
  const copyText = isTerminal ? extractShellCommands(children) || children : children;

  const lineCount = children.split('\n').length;
  const shouldCollapse = collapsible && lineCount > 40;
  const isCollapsed = shouldCollapse && !expanded;

  return (
    <div className={`tutorial-code ${isCollapsed ? 'tutorial-code-collapsed' : ''}`}>
      <div className="tutorial-code-header">
        <span className="tutorial-code-dot red" />
        <span className="tutorial-code-dot yellow" />
        <span className="tutorial-code-dot green" />
        <span className="tutorial-code-filename">{filename}</span>
        <div className="tutorial-code-actions">
          {shouldCollapse && (
            <button
              className="tutorial-code-toggle"
              onClick={() => setExpanded(!expanded)}
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? '▼ Collapse' : '▶ Expand'}
            </button>
          )}
          <CopyButton text={copyText} />
        </div>
      </div>
      <div className={`tutorial-code-body ${isCollapsed ? 'collapsed' : ''}`}>
        <SyntaxHighlighter language={language} style={customStyle}>
          {children}
        </SyntaxHighlighter>
        {isCollapsed && (
          <div className="tutorial-code-fade" onClick={() => setExpanded(true)} />
        )}
      </div>
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

const TOC_SECTIONS = [
  { id: 'prerequisites', label: '01 — Prerequisites' },
  { id: 'belt-new', label: '02 — Belt New' },
  { id: 'generate', label: '03 — Generate' },
  { id: 'models', label: '04 — Models' },
  { id: 'controllers', label: '05 — Controllers' },
  { id: 'infrastructure', label: '06 — Infrastructure' },
  { id: 'deploy', label: '07 — Deploy' },
  { id: 'console', label: '08 — Console' },
  { id: 'auth', label: '09 — Auth' },
  { id: 'frontend', label: '10 — Frontend' },
  { id: 'whats-next', label: '11 — What\'s Next' },
  { id: 'teardown', label: '12 — Tear It Down' },
];

function SidebarTOC({ activeSection }) {
  return (
    <nav className="tutorial-sidebar-toc" aria-label="Tutorial sections">
      <ul>
        {TOC_SECTIONS.map(({ id, label }) => (
          <li key={id} className={activeSection === id ? 'active' : ''}>
            <a href={`#${id}`}>{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Tutorial() {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    TOC_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app">
      <SidebarTOC activeSection={activeSection} />
      <nav className="tutorial-nav">
        <div className="nav-brand">
          <a href="/">
            {/* <img className="nav-logo" src="/ruby-belt.png" alt="Belt" /> */}
            <span className="nav-name">Ruby Belt</span>
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
            <li><a href="#console">Belt Console — Explore Your Data</a></li>
            <li><a href="#auth">Authentication — Lock It Down</a></li>
            <li><a href="#frontend">Belt Frontend — The ChatGPT Experience</a></li>
            <li><a href="#whats-next">What's Next</a></li>
            <li><a href="#teardown">Tear It Down</a></li>
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
            {installCode}
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
            One command builds your entire project structure — routes file, contracts file,
            Lambda entry point, controllers directory, models, Gemfile, environments, and git repo.
            No <code>mkdir</code> chains, no boilerplate copying.
          </p>
          <CodeBlock filename="terminal" language="bash">
            {beltNewCode}
          </CodeBlock>
          <Callout>
            <strong>What just happened?</strong> Belt scaffolded a complete serverless project with
            a React frontend, dev and prod environments, a Lambda entry point, application controller,
            routes and contracts files in <code>config/</code>, infrastructure modules, and a git repo.
            It's like <code>rails new</code> but for the serverless frontier.
          </Callout>
        </section>

        {/* Section 3: belt generate */}
        <section className="tutorial-section" id="generate">
          <h2>03 — Belt Generate — Forge Your Resources</h2>
          <span className="tutorial-timer">⏱ 2 minutes</span>
          <p>
            Here's where the Belt CLI shines. Instead of hand-writing models,
            controllers, routes, and contracts — one command generates all four and wires
            them together. For our AI chat, we need conversations and messages.
          </p>
          <CodeBlock filename="terminal" language="bash">
            {generateScaffoldCode}
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
          <span className="tutorial-timer">⏱ 3 minutes</span>
          <p>
            <strong>Active Item</strong> is an ActiveRecord-style ORM for DynamoDB.
            Belt's generator gave us working models — now we'll flesh them out with
            validations and business logic. Fat models, skinny controllers.
          </p>
          <CodeBlock filename="lambda/models/message.rb" language="ruby">
            {messageModelCode}
          </CodeBlock>
          <p>
            Standard ActiveModel validations — <code>presence</code>, <code>inclusion</code> —
            they all work. The <code>role</code> field must be <code>"user"</code> or <code>"assistant"</code>,
            mapping directly to Bedrock's Converse API format.
          </p>
          <CodeBlock filename="lambda/models/conversation.rb" language="ruby">
            {conversationModelCode}
          </CodeBlock>
          <p>
            The <code>reply</code> method is the heart of the app. It uses <code>messages.create!</code> to
            build messages through the association (foreign key set automatically), calls Bedrock with
            the conversation history, and updates the conversation metadata. All the business logic
            lives in the model where it belongs.
          </p>
          <Callout>
            <strong>Rails patterns, DynamoDB power.</strong> Validations, associations with
            <code>.create!</code>, callbacks — Active Item brings the full ActiveRecord
            developer experience to a serverless database. No migrations, no schema files.
          </Callout>
        </section>

        {/* Section 5: Controllers */}
        <section className="tutorial-section" id="controllers">
          <h2>05 — Belt Controllers — Wire the AI</h2>
          <span className="tutorial-timer">⏱ 2 minutes</span>
          <p>
            With the business logic in our models, the controller is just a thin wrapper.
            The scaffold already generated a messages controller — we just need to
            customize it. Replace the generated code with:
          </p>
          <CodeBlock filename="lambda/controllers/api/messages_controller.rb" language="ruby">
            {messagesControllerCode}
          </CodeBlock>
          <p>
            <code>before_action</code> loads the conversation, <code>index</code> returns its messages,
            and <code>create</code> calls <code>reply</code> which handles saving the user message,
            calling Bedrock, and returning the AI response. Belt's implicit response serializes
            the instance variables to JSON automatically.
          </p>
          <p>
            Update the routes — nest messages under conversations with only the actions we need:
          </p>
          <CodeBlock filename="config/routes.rb" language="ruby">
            {routesCode}
          </CodeBlock>
          <Callout>
            <strong>That's the entire backend.</strong> One controller, two actions, and you've got
            an AI chat API with persistent conversation history. <code>POST /conversations/:id/messages</code> to
            chat, <code>GET /conversations/:id/messages</code> to load history. Fat models do the work;
            the controller just wires things together.
          </Callout>
        </section>

        {/* Section 6: Infrastructure */}
        <section className="tutorial-section" id="infrastructure">
          <h2>06 — Infrastructure — Bedrock Permissions</h2>
          <span className="tutorial-timer">⏱ 2 minutes</span>
          <p>
            The Lambda needs permission to call Bedrock. Conveyor Belt creates the Lambda's IAM role
            automatically — we just need to define a Bedrock policy and wire it through the
            lambda config.
          </p>
          <p>
            First, create the IAM policy:
          </p>
          <CodeBlock filename="infrastructure/modules/app/bedrock.tf" language="hcl">
            {bedrockTfCode}
          </CodeBlock>
          <p>
            Each lambda has a config file at <code>config/lambda/[name].yml</code> — like
            Rails' <code>database.yml</code>, it lets you configure timeout, memory, environment
            variables, and IAM policies per environment. Add <code>iam_policy_arns</code> to
            give just this lambda Bedrock access:
          </p>
          <CodeBlock filename="config/lambda/api.yml" language="bash">
            {lambdaConfigCode}
          </CodeBlock>
          <p>
            The <code>ref()</code> marker gets resolved at deploy time via <code>lambda_env_refs</code>.
            The generated <code>main.tf</code> already has a <code>lambda_env_refs</code> attribute —
            update it to pass in the Bedrock policy ARN:
          </p>
          <CodeBlock filename="infrastructure/modules/app/main.tf (snippet)" language="hcl">
            {mainSnippetCode}
          </CodeBlock>
          <p>
            Add the Bedrock SDK to your Gemfile:
          </p>
          <CodeBlock filename="Gemfile" language="ruby">
            {gemfileCode}
          </CodeBlock>
          <CodeBlock filename="terminal" language="bash">
            {bundleInstallCode}
          </CodeBlock>
          <Callout>
            <strong>Convention over configuration.</strong> DynamoDB and CloudWatch permissions are
            handled automatically by Conveyor Belt (inferred from routes). Bedrock is extra —
            but it's scoped to just this lambda via the YAML config rather than applied globally.
          </Callout>
        </section>

        {/* Section 7: Deploy */}
        <section className="tutorial-section" id="deploy">
          <h2>07 — Belt Deploy — Let It Rip</h2>
          <span className="tutorial-timer">⏱ 2 minutes</span>
          <p>
            One command deploys the full stack — Lambda, API Gateway, DynamoDB tables,
            frontend hosting, and the Bedrock IAM policy:
          </p>
          <CodeBlock filename="terminal" language="bash">
            {deployCode}
          </CodeBlock>
          <p>
            Your backend is live. Next we'll verify it works by dropping into the console.
          </p>
          <Callout>
            <strong>State bucket already set up.</strong> <code>belt new</code> created the S3 state bucket
            during project scaffolding. If you see a state error, run <code>belt doctor</code> to
            diagnose, then <code>belt setup state</code> to fix it.
          </Callout>
        </section>

        {/* Section 8: Console */}
        <section className="tutorial-section" id="console">
          <h2>08 — Belt Console — Explore Your Data</h2>
          <span className="tutorial-timer">⏱ 2 minutes</span>
          <p>
            Your backend is live. Let's verify it works by dropping into the console —
            just like <code>rails console</code>. If you've used Rails, this will feel like home.
          </p>
          <CodeBlock filename="terminal" language="bash">
            {consoleSessionCode}
          </CodeBlock>
          <p>
            One call to <code>reply</code> saves the user message, calls Bedrock, saves the
            assistant response, and updates the conversation — all behind a single method.
            Timestamps are set automatically via a <code>before_create</code> callback.
            Validations reject bad data just like ActiveRecord.
          </p>
          <Callout>
            <strong>Same patterns, different engine.</strong> Active Item uses ActiveModel under
            the hood — validations, callbacks, associations with <code>.create!</code>.
            Everything you know from Rails works here.
          </Callout>
        </section>

        {/* Section 9: Authentication */}
        <section className="tutorial-section" id="auth">
          <h2>09 — Authentication — Lock It Down</h2>
          <span className="tutorial-timer">⏱ 3 minutes</span>
          <p>
            Before we deploy the frontend, let's lock down the API. Right now anyone with
            the URL could call it — adding Cognito ensures only you can use it. No self-signup,
            admin-created accounts only.
          </p>
          <p>
            One command scaffolds Cognito infrastructure, generates frontend auth files,
            and installs the SDK:
          </p>
          <CodeBlock filename="terminal" language="bash">
            {authGenerateCode}
          </CodeBlock>
          <p>
            That generated:
          </p>
          <ul>
            <li><code>infrastructure/modules/app/cognito.tf</code> — user pool (admin-only signup) + client</li>
            <li><code>infrastructure/modules/app/cognito_outputs.tf</code> — pool ID, client ID outputs</li>
            <li><code>frontend/src/lib/auth.js</code> — sign-in, password change, token storage</li>
            <li><code>frontend/src/lib/apiClient.js</code> — updated with Authorization header</li>
            <li><code>frontend/src/pages/auth/Login.jsx</code> — login page with first-login password change</li>
            <li><code>frontend/src/components/ProtectedRoute.jsx</code> — route guard</li>
          </ul>
          <p>
            Now tell your routes to require authentication:
          </p>
          <CodeBlock filename="config/routes.rb" language="ruby">
            {authRoutesCode}
          </CodeBlock>
          <p>
            Deploy to create the user pool, then create your account:
          </p>
          <CodeBlock filename="terminal" language="bash">
            {createUserCode}
          </CodeBlock>
          <Callout>
            <strong>Admin-only signup.</strong> The generated pool uses <code>allow_admin_create_user_only = true</code>.
            Nobody can sign up through the app — only you (via the CLI) can create accounts.
            Your API is locked down even if someone discovers the URL.
            When you're ready for public signup, run <code>belt g auth --signup</code> to add
            registration and email verification pages.
          </Callout>
          <p>
            Finally, create <code>frontend/env.yml</code> to map Terraform outputs to your
            frontend environment variables. This tells <code>belt frontend env</code> what to inject:
          </p>
          <CodeBlock filename="frontend/env.yml" language="bash">
            {authEnvYmlCode}
          </CodeBlock>
        </section>

        {/* Section 10: Frontend */}
        <section className="tutorial-section" id="frontend">
          <h2>10 — Belt Frontend — The ChatGPT Experience</h2>
          <span className="tutorial-timer">⏱ 5 minutes</span>
          <p>
            The scaffolded CRUD pages won't cut it here — we want a ChatGPT-style interface
            with a conversation sidebar, message thread, and input area.
          </p>
          <p>
            Replace the entire contents of <code>frontend/src/App.jsx</code> with the chat UI.
            It uses the nested REST routes we defined — <code>/conversations/:id/messages</code> for
            both loading history and sending new messages:
          </p>
          <CodeBlock filename="frontend/src/App.jsx" language="javascript" collapsible>
            {appJsxCode}
          </CodeBlock>
          <p>
            Now replace <code>frontend/src/index.css</code> — the scaffold generates a light theme,
            but we need a dark base:
          </p>
          <CodeBlock filename="frontend/src/index.css" language="bash" collapsible>
            {indexCssCode}
          </CodeBlock>
          <p>
            Now create <code>frontend/src/App.css</code> with the full dark ChatGPT-style theme:
          </p>
          <CodeBlock filename="frontend/src/App.css" language="bash" collapsible>
            {appCssCode}
          </CodeBlock>
          <p>
            Deploy the frontend:
          </p>
          <CodeBlock filename="terminal" language="bash">
{`$ belt frontend env
$ belt deploy frontend`}
          </CodeBlock>
          <Callout>
            <strong>The full ChatGPT experience.</strong> Conversation sidebar on the left,
            AI message thread in the center, auto-resizing input at the bottom. New conversations
            auto-title from the first message. Thinking dots while Bedrock processes. All
            backed by DynamoDB for persistent history — and locked behind your Cognito login.
          </Callout>
        </section>

        {/* Section 11: What's Next */}
        <section className="tutorial-section" id="whats-next">
          <h2>11 — What's Next</h2>
          <p>
            You've got a running AI assistant. Here's where you might take it from here:
          </p>
          <ul>
            <li><strong>Swap models</strong> — change <code>MODEL_ID</code> to Claude Sonnet 4 for smarter responses</li>
            <li><strong>System prompts</strong> — customize the AI's personality per conversation</li>
            <li><strong>Streaming</strong> — use <code>converse_stream</code> for token-by-token output</li>
            <li><strong>Image understanding</strong> — send images to Claude's vision capability</li>
            <li><strong>Rate limiting</strong> — add token/request limits per user</li>
            <li><strong>More environments</strong> — <code>belt generate environment staging</code></li>
            <li><strong>CI/CD</strong> — run <code>belt deploy prod</code> from GitHub Actions on merge to main</li>
          </ul>

          <h3>Belt CLI Quick Reference</h3>
          <CodeBlock filename="terminal" language="bash">
            {cliReferenceCode}
          </CodeBlock>
        </section>

        {/* Section 12: Teardown */}
        <section className="tutorial-section" id="teardown">
          <h2>12 — Tear It Down</h2>
          <p>
            Done experimenting? One command destroys all AWS resources created by this tutorial —
            Lambda, API Gateway, DynamoDB tables, S3 buckets, CloudFront, Cognito, and IAM roles.
            Nothing left running, nothing left billing.
          </p>
          <CodeBlock filename="terminal" language="bash">
{`$ belt destroy dev

# Terraform will destroy all resources:
#   - 1 API Gateway
#   - 1 Lambda function
#   - 2 DynamoDB tables (conversations, messages)
#   - 1 S3 bucket (frontend)
#   - 1 CloudFront distribution
#   - 1 Cognito user pool
#   - IAM roles and policies
#
# Destroy complete! Resources: 0 added, 0 changed, 14 destroyed.`}
          </CodeBlock>
          <Callout>
            <strong>Clean slate.</strong> All infrastructure is gone. No ongoing charges.
            The S3 state bucket remains (it stores Terraform state for all environments) —
            delete it manually if you're done for good: <code>aws s3 rb s3://your-state-bucket --force</code>
          </Callout>
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
            <a href="https://github.com/stowzilla/belt" className="btn btn-primary">
              View on GitHub
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
