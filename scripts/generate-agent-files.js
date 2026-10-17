/**
 * Post-build script: makes the SPA readable by agents and crawlers that don't run JS.
 *
 * Writes into build/:
 *   llms.txt          — index of the site + docs (https://llmstxt.org)
 *   llms-full.txt     — every doc concatenated into one file
 *   docs/<topic>.md   — raw markdown for each doc topic
 *   sitemap.xml       — pages + doc topics
 *   index.html        — gets <link rel="alternate"> hints and static fallback content
 *                       inside #root (React replaces it on load)
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const ROOT = join(import.meta.dirname, '..');
const DOCS_DIR = join(ROOT, 'src/docs');
const BUILD_DIR = join(ROOT, 'build');
const SITE = 'https://belt.dev';

const SUMMARY =
  'Belt is a Rails-inspired framework for serverless Ruby on AWS Lambda. A Ruby DSL ' +
  '(routes.rb) plus the belt CLI and the conveyor-belt Terraform provider turn a Rails-like ' +
  'app into complete AWS serverless infrastructure (API Gateway, Lambda, DynamoDB, Cognito, CloudFront).';

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function loadDocs() {
  return readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const slug = basename(file, '.md');
      const markdown = readFileSync(join(DOCS_DIR, file), 'utf-8');
      const title = (markdown.match(/^#\s+(.+)/m) || [])[1] || slug;
      const intro = markdown
        .replace(/^#\s+.+\n/, '')
        .trim()
        .split(/\n\s*\n/)[0]
        .replace(/\s*\n\s*/g, ' ')
        .replace(/[`*_]/g, '');
      return { slug, title, markdown, intro };
    });
}

function llmsTxt(docs) {
  const lines = [
    '# Belt',
    '',
    `> ${SUMMARY}`,
    '',
    'Documentation is plain markdown, one file per topic. `llms-full.txt` contains all of it in a single file.',
    '',
    '## Docs',
    '',
    ...docs.map((d) => `- [${d.title}](${SITE}/docs/${d.slug}.md): ${d.intro.slice(0, 160)}`),
    '',
    '## Optional',
    '',
    `- [All docs in one file](${SITE}/llms-full.txt)`,
    `- [Search index (JSON)](${SITE}/search-index.json)`,
    `- [Tutorial: build an AI chat app](${SITE}/tutorial)`,
    '- [Belt gem source](https://github.com/stowzilla/belt)',
    '',
  ];
  return lines.join('\n');
}

function llmsFullTxt(docs) {
  const header = `# Belt\n\n> ${SUMMARY}\n\nSource: ${SITE}/docs\n`;
  return [header, ...docs.map((d) => `\n---\n\n<!-- ${SITE}/docs/${d.slug} -->\n\n${d.markdown.trim()}\n`)].join('');
}

function sitemapXml(docs) {
  const urls = ['/', '/tutorial', '/docs', ...docs.map((d) => `/docs/${d.slug}`)];
  const body = urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function fallbackHtml(docs) {
  const items = docs
    .map(
      (d) =>
        `<li><a href="/docs/${d.slug}">${escapeHtml(d.title)}</a> (<a href="/docs/${d.slug}.md">markdown</a>) — ${escapeHtml(d.intro.slice(0, 160))}</li>`
    )
    .join('');
  return (
    '<main><h1>Belt — Cloud Infrastructure for Ruby Programmers</h1>' +
    `<p>${escapeHtml(SUMMARY)}</p>` +
    '<h2>Documentation</h2>' +
    `<ul>${items}</ul>` +
    '<p>Agents: <a href="/llms.txt">/llms.txt</a> indexes the docs; ' +
    '<a href="/llms-full.txt">/llms-full.txt</a> has all of them in one file.</p></main>'
  );
}

function patchIndexHtml(docs) {
  const file = join(BUILD_DIR, 'index.html');
  let html = readFileSync(file, 'utf-8');
  const links =
    `    <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />\n` +
    `    <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="Belt docs (markdown)" />\n`;
  html = html.replace('</head>', `${links}  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${fallbackHtml(docs)}</div>`);
  writeFileSync(file, html);
}

function main() {
  if (!existsSync(join(BUILD_DIR, 'index.html'))) {
    console.error('build/index.html not found — run `vite build` first');
    process.exit(1);
  }
  const docs = loadDocs();
  mkdirSync(join(BUILD_DIR, 'docs'), { recursive: true });
  for (const d of docs) writeFileSync(join(BUILD_DIR, 'docs', `${d.slug}.md`), d.markdown);
  writeFileSync(join(BUILD_DIR, 'llms.txt'), llmsTxt(docs));
  writeFileSync(join(BUILD_DIR, 'llms-full.txt'), llmsFullTxt(docs));
  writeFileSync(join(BUILD_DIR, 'sitemap.xml'), sitemapXml(docs));
  patchIndexHtml(docs);
  console.log(`Agent files generated: ${docs.length} docs → llms.txt, llms-full.txt, docs/*.md, sitemap.xml`);
}

main();
