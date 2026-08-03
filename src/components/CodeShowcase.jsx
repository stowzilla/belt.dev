import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import CodeWindow from './CodeWindow';

import routesCode from '../code-samples/showcase/routes.rb?raw';
import postsControllerCode from '../code-samples/showcase/posts_controller.rb?raw';
import postModelCode from '../code-samples/showcase/post.rb?raw';

SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('bash', bash);

const panels = [
  { filename: 'routes.rb', language: 'ruby', code: routesCode },
  { filename: 'posts_controller.rb', language: 'ruby', code: postsControllerCode },
  { filename: 'post.rb', language: 'ruby', code: postModelCode },
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
