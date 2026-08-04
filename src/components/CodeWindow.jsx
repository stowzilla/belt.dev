import React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from './CopyButton';

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
    padding: '1.25rem',
    fontSize: '0.875rem',
    lineHeight: '1.6',
    margin: 0,
    textShadow: 'none',
  },
};

function CodeWindow({ code, language, filename }) {
  return (
    <div className="code-panel">
      <div className="code-panel-header">
        <span className="code-panel-dot red" />
        <span className="code-panel-dot yellow" />
        <span className="code-panel-dot green" />
        <span className="code-panel-filename">{filename}</span>
        <CopyButton text={code} />
      </div>
      <SyntaxHighlighter language={language} style={customStyle}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeWindow;
