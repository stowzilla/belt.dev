import React from 'react';
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
import generateControllerCode from '../code-samples/tutorial/controllers/generate.sh?raw';
import completionsControllerCode from '../code-samples/tutorial/controllers/completions_controller.rb?raw';
import messagesControllerCode from '../code-samples/tutorial/controllers/messages_controller.rb?raw';
import routesCode from '../code-samples/tutorial/controllers/routes.rb?raw';

// Code samples - infrastructure
import bedrockTfCode from '../code-samples/tutorial/infrastructure/bedrock.tf?raw';
import mainSnippetCode from '../code-samples/tutorial/infrastructure/main-snippet.tf?raw';
import gemfileCode from '../code-samples/tutorial/infrastructure/Gemfile?raw';
import bundleInstallCode from '../code-samples/tutorial/infrastructure/bundle.sh?raw';

// Code samples - deploy
import deployCode from '../code-samples/tutorial/deploy/deploy.sh?raw';

// Code samples - console
import consoleSessionCode from '../code-samples/tutorial/console/session.sh?raw';

// Code samples - frontend
import apiClientCode from '../code-samples/tutorial/frontend/apiClient.js?raw';
import appJsxCode from '../code-samples/tutorial/frontend/App.jsx?raw';
import indexCssCode from '../code-samples/tutorial/frontend/index.css?raw';
import appCssCode from '../code-samples/tutorial/frontend/App.css?raw';
import deployFrontendCode from '../code-samples/tutorial/frontend/deploy.sh?raw';

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

function CodeBlock({ filename, language, children }) {
  // For terminal/shell blocks, copy only the commands, not the output
  const isTerminal = filename === 'terminal' || language === 'bash';
  const copyText = isTerminal ? extractShellCommands(children) || children : children;

  return (
    <div className="tutorial-code">
      <div className="tutorial-code-header">
        <span className="tutorial-code-dot red" />
        <span className="tutorial-code-dot yellow" />
        <span className="tutorial-code-dot green" />
        <span className="tutorial-code-filename">{filename}</span>
        <CopyButton text={copyText} />
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
            Generate it and wire the route:
          </p>
          <CodeBlock filename="terminal" language="bash">
            {generateControllerCode}
          </CodeBlock>
          <p>
            Replace the generated controller with our completions logic — find the conversation,
            call <code>reply</code>, return the result:
          </p>
          <CodeBlock filename="lambda/controllers/api/completions_controller.rb" language="ruby">
            {completionsControllerCode}
          </CodeBlock>
          <Callout>
            <strong>Three lines.</strong> Find the conversation, call <code>reply</code>,
            assign the result. Belt's implicit response serializes <code>@assistant_reply</code> into
            JSON automatically — no <code>success_response</code> call needed.
          </Callout>
          <p>
            One small tweak to the scaffolded messages controller — the frontend fetches messages
            by conversation, so we need to filter on <code>conversation_id</code>:
          </p>
          <CodeBlock filename="lambda/controllers/api/messages_controller.rb" language="ruby">
            {messagesControllerCode}
          </CodeBlock>
          <p>
            Finally, update the route to give the completions endpoint access to both tables:
          </p>
          <CodeBlock filename="config/routes.rb" language="ruby">
            {routesCode}
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
            {bedrockTfCode}
          </CodeBlock>
          <p>
            Then reference it in your <code>conveyor_belt</code> resource (in <code>main.tf</code>):
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
            Set up the remote state bucket and deploy the full stack:
          </p>
          <CodeBlock filename="terminal" language="bash">
            {deployCode}
          </CodeBlock>
          <p>
            Your AI is live. One HTTP call and Claude responds through your Lambda, with
            the conversation persisted in DynamoDB. Now let's give it a proper UI.
          </p>
        </section>

        {/* Section 8: Console */}
        <section className="tutorial-section" id="console">
          <h2>08 — Belt Console — Explore Your Data</h2>
          <span className="tutorial-timer">⏱ 2 minutes</span>
          <p>
            Your backend is live. Before we build the frontend, let's drop into the
            console and interact with it directly — just like <code>rails console</code>.
            If you've used Rails, this will feel like home.
          </p>
          <CodeBlock filename="terminal" language="bash">
            {consoleSessionCode}
          </CodeBlock>
          <p>
            Association building with <code>messages.create!</code>, validations rejecting bad
            data, the <code>reply</code> method calling Bedrock — all from an interactive console.
            Same workflow as <code>rails console</code>, same muscle memory.
          </p>
          <Callout>
            <strong>Same patterns, different engine.</strong> Active Item uses ActiveModel under
            the hood, so every validation you know from Rails works here.
            The only addition is <code>validates_uniqueness_of</code> which queries DynamoDB
            instead of SQL.
          </Callout>
        </section>

        {/* Section 9: Frontend */}
        <section className="tutorial-section" id="frontend">
          <h2>09 — Belt Frontend — The ChatGPT Experience</h2>
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
            {apiClientCode}
          </CodeBlock>
          <p>
            Replace the entire contents of <code>frontend/src/App.jsx</code>:
          </p>
          <CodeBlock filename="frontend/src/App.jsx" language="javascript">
            {appJsxCode}
          </CodeBlock>
          <p>
            Now replace <code>frontend/src/index.css</code> — the scaffold generates a light theme,
            but we need a dark base:
          </p>
          <CodeBlock filename="frontend/src/index.css" language="bash">
            {indexCssCode}
          </CodeBlock>
          <p>
            Now create <code>frontend/src/App.css</code> with the full dark ChatGPT-style theme:
          </p>
          <CodeBlock filename="frontend/src/App.css" language="bash">
            {appCssCode}
          </CodeBlock>
          <p>Deploy the frontend:</p>
          <CodeBlock filename="terminal" language="bash">
            {deployFrontendCode}
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

        {/* Section 10: What's Next */}
        <section className="tutorial-section" id="whats-next">
          <h2>10 — What's Next</h2>
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
            {cliReferenceCode}
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
