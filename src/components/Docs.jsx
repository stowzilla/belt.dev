import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { marked } from 'marked';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import ruby from 'react-syntax-highlighter/dist/esm/languages/prism/ruby';
import hcl from 'react-syntax-highlighter/dist/esm/languages/prism/hcl';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from './CopyButton';

SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('hcl', hcl);
SyntaxHighlighter.registerLanguage('bash', bash);

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
    borderRadius: '12px',
    padding: '1.5rem',
    fontSize: '0.85rem',
    lineHeight: '1.65',
    margin: '1rem 0',
    textShadow: 'none',
  },
};

// Topic metadata — order and display names
const TOPICS = [
  { slug: 'routing', title: 'Routing' },
  { slug: 'controllers', title: 'Controllers' },
  { slug: 'models', title: 'Models' },
  { slug: 'lambda_handler', title: 'Lambda Handler' },
  { slug: 'observability', title: 'Observability' },
  { slug: 'deployment', title: 'Deployment' },
  { slug: 'generators', title: 'Generators' },
  { slug: 'console', title: 'Console' },
  { slug: 'backups', title: 'Backups' },
  { slug: 'plugins', title: 'Plugins' },
  { slug: 'structure', title: 'Project Structure' },
];

// Import all markdown files from src/docs/
const docModules = import.meta.glob('../docs/*.md', { query: '?raw', import: 'default' });

function CodeBlock({ language, children }) {
  const lang = language || 'bash';
  return (
    <div className="docs-code-block">
      <div className="docs-code-actions">
        <CopyButton text={children} />
      </div>
      <SyntaxHighlighter language={lang} style={customStyle}>
        {children.trim()}
      </SyntaxHighlighter>
    </div>
  );
}

function DocsContent({ markdown }) {
  const rendered = useMemo(() => {
    if (!markdown) return '';

    // Custom renderer for code blocks with syntax highlighting
    const renderer = new marked.Renderer();

    renderer.code = function ({ text, lang }) {
      // Return a placeholder that we'll replace with React components
      const id = `code-${Math.random().toString(36).slice(2, 10)}`;
      return `<div data-code-block="${id}" data-lang="${lang || ''}">${escapeHtml(text)}</div>`;
    };

    renderer.heading = function ({ text, depth }) {
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return `<h${depth} id="${slug}">${text}</h${depth}>`;
    };

    marked.setOptions({
      renderer,
      gfm: true,
      breaks: false,
    });

    return marked(markdown);
  }, [markdown]);

  // Parse the HTML and inject React code blocks
  const parts = useMemo(() => {
    if (!rendered) return [];

    const result = [];
    const codeBlockRegex = /<div data-code-block="([^"]*)" data-lang="([^"]*)">([\s\S]*?)<\/div>/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(rendered)) !== null) {
      // Add HTML before this code block
      if (match.index > lastIndex) {
        result.push({ type: 'html', content: rendered.slice(lastIndex, match.index) });
      }
      // Add code block
      result.push({ type: 'code', lang: match[2], content: unescapeHtml(match[3]) });
      lastIndex = match.index + match[0].length;
    }

    // Add remaining HTML
    if (lastIndex < rendered.length) {
      result.push({ type: 'html', content: rendered.slice(lastIndex) });
    }

    return result;
  }, [rendered]);

  return (
    <div className="docs-content">
      {parts.map((part, i) =>
        part.type === 'html' ? (
          <div key={i} dangerouslySetInnerHTML={{ __html: part.content }} />
        ) : (
          <CodeBlock key={i} language={part.lang}>
            {part.content}
          </CodeBlock>
        )
      )}
    </div>
  );
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function unescapeHtml(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

export default function Docs() {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeTopic = topic || TOPICS[0].slug;

  useEffect(() => {
    async function loadDoc() {
      setLoading(true);
      const key = `../docs/${activeTopic}.md`;
      const loader = docModules[key];

      if (loader) {
        try {
          const content = await loader();
          setMarkdown(content);
        } catch {
          setMarkdown(`# Not Found\n\nNo documentation found for "${activeTopic}".`);
        }
      } else {
        setMarkdown(`# Not Found\n\nNo documentation found for "${activeTopic}".`);
      }
      setLoading(false);
    }

    loadDoc();
  }, [activeTopic]);

  // Extract headings for in-page TOC
  const headings = useMemo(() => {
    if (!markdown) return [];
    const lines = markdown.split('\n');
    return lines
      .filter(l => l.match(/^#{2,3}\s/))
      .map(l => {
        const level = l.match(/^(#+)/)[1].length;
        const text = l.replace(/^#+\s+/, '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return { level, text, id };
      });
  }, [markdown]);

  return (
    <div className="docs-page">
      <nav className={`docs-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="docs-sidebar-header">
          <Link to="/" className="docs-logo">
            <img src="/belt-icon.svg" alt="Belt" />
            <span>Belt</span>
          </Link>
          <button
            className="docs-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="docs-nav-section">
          <h3>Documentation</h3>
          <ul>
            {TOPICS.map(t => (
              <li key={t.slug} className={activeTopic === t.slug ? 'active' : ''}>
                <Link to={`/docs/${t.slug}`} onClick={() => setSidebarOpen(false)}>
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {headings.length > 0 && (
          <div className="docs-nav-section docs-toc">
            <h3>On this page</h3>
            <ul>
              {headings.map(h => (
                <li key={h.id} className={`toc-level-${h.level}`}>
                  <a href={`#${h.id}`} onClick={() => setSidebarOpen(false)}>
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <main className="docs-main">
        <div className="docs-topbar">
          <button
            className="docs-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <span className="docs-breadcrumb">
            <Link to="/">Belt</Link> / <Link to="/docs">Docs</Link>
            {topic && <> / {TOPICS.find(t => t.slug === topic)?.title || topic}</>}
          </span>
        </div>

        {loading ? (
          <div className="docs-loading">Loading...</div>
        ) : (
          <DocsContent markdown={markdown} />
        )}

        <nav className="docs-prev-next">
          {getPrevNext(activeTopic).prev && (
            <Link to={`/docs/${getPrevNext(activeTopic).prev.slug}`} className="docs-nav-prev">
              ← {getPrevNext(activeTopic).prev.title}
            </Link>
          )}
          {getPrevNext(activeTopic).next && (
            <Link to={`/docs/${getPrevNext(activeTopic).next.slug}`} className="docs-nav-next">
              {getPrevNext(activeTopic).next.title} →
            </Link>
          )}
        </nav>
      </main>

      {sidebarOpen && (
        <div className="docs-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

function getPrevNext(slug) {
  const idx = TOPICS.findIndex(t => t.slug === slug);
  return {
    prev: idx > 0 ? TOPICS[idx - 1] : null,
    next: idx < TOPICS.length - 1 ? TOPICS[idx + 1] : null,
  };
}
