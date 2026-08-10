import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import CodeWindow from './CodeWindow';

import routesCode from '../code-samples/showcase/routes.rb?raw';
import controllerCode from '../code-samples/showcase/messages_controller.rb?raw';
import modelCode from '../code-samples/showcase/message.rb?raw';

SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('bash', bash);

const panels = [
  {
    filename: 'config/routes.rb',
    language: 'ruby',
    code: routesCode,
  },
  {
    filename: 'messages_controller.rb',
    language: 'ruby',
    code: controllerCode,
  },
  {
    filename: 'message.rb',
    language: 'ruby',
    code: modelCode,
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
