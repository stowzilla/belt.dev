/**
 * Post-build script: makes the SPA readable by agents and crawlers that don't run JS.
 *
 * Writes into build/:
 *   llms.txt          — index of the site + docs (https://llmstxt.org)
 *   llms-full.txt     — every doc concatenated into one file
 *   docs/<topic>.md   — raw markdown for each doc topic
 *   sitemap.xml       — pages + doc topics
 *   index.html        — gets <link rel="alternate"> hints and static fallback content
 *                       inside #root (React replaces it on load; hidden from JS-enabled
 *                       browsers so humans don't see an unstyled flash before React mounts)
 *   docs/<topic>.html, docs.html, tutorial.html
 *                     — per-route copies of index.html with their own <title>, description,
 *                       canonical URL and rendered content. CloudFront can't map /docs/x to a
 *                       directory index, so scripts/publish-prerendered.sh uploads each one to
 *                       the extensionless S3 key (docs/x) as text/html.
 */
import { marked } from 'marked';
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

// Static fallback is for clients that don't run JS (agents, crawlers). Browsers that do run JS
// hide it until React replaces #root, so humans don't see a flash of unstyled HTML first.
const HIDE_FALLBACK_HEAD =
  `    <script>document.documentElement.classList.add('js')</script>\n` +
  `    <style>.js [data-static-fallback]{display:none}</style>\n`;

const withFallback = (html, body) =>
  html
    .replace('</head>', `${HIDE_FALLBACK_HEAD}  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root"><div data-static-fallback>${body}</div></div>`);

function patchIndexHtml(docs) {
  const file = join(BUILD_DIR, 'index.html');
  let html = readFileSync(file, 'utf-8');
  const links =
    `    <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />\n` +
    `    <link rel="alternate" type="text/markdown" href="/llms-full.txt" title="Belt docs (markdown)" />\n`;
  html = html.replace('</head>', `${links}  </head>`);
  html = withFallback(html, fallbackHtml(docs));
  writeFileSync(file, html);
}

const pageTitle = (t) => `${t} — Belt`;

// Per-route copy of the built index.html with its own head tags and rendered #root content.
function routePage(template, { path, title, description, body }) {
  const url = `${SITE}${path}`;
  const head =
    `  <link rel="canonical" href="${url}" />\n` +
    `    <meta property="og:type" content="article" />\n` +
    `    <meta property="og:title" content="${escapeHtml(title)}" />\n` +
    `    <meta property="og:description" content="${escapeHtml(description)}" />\n` +
    `    <meta property="og:url" content="${url}" />\n`;
  const html = template
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace('</head>', `${head}  </head>`);
  return withFallback(html, body);
}

function writeRoutePages(docs) {
  const template = readFileSync(join(BUILD_DIR, 'index.html'), 'utf-8');
  const write = (file, page) => {
    mkdirSync(join(BUILD_DIR, file, '..'), { recursive: true });
    writeFileSync(join(BUILD_DIR, file), routePage(template, page));
  };
  const nav = `<nav><a href="/">Belt</a> · <a href="/docs">Docs</a> · <a href="/llms.txt">llms.txt</a></nav>`;

  for (const d of docs) {
    write(`docs/${d.slug}.html`, {
      path: `/docs/${d.slug}`,
      title: pageTitle(d.title),
      description: d.intro.slice(0, 160),
      body: `${nav}<main>${marked.parse(d.markdown)}<p><a href="/docs/${d.slug}.md">Raw markdown</a></p></main>`,
    });
  }
  write('docs.html', {
    path: '/docs',
    title: pageTitle('Documentation'),
    description: SUMMARY,
    body: `${nav}<main><h1>Belt Documentation</h1><ul>${docs
      .map((d) => `<li><a href="/docs/${d.slug}">${escapeHtml(d.title)}</a> — ${escapeHtml(d.intro.slice(0, 160))}</li>`)
      .join('')}</ul></main>`,
  });
  write('tutorial.html', {
    path: '/tutorial',
    title: pageTitle('Tutorial: build an AI chat app'),
    description: 'Step-by-step tutorial: build and deploy an AI chat app on AWS Lambda with Belt.',
    body: `${nav}<main><h1>Tutorial: build an AI chat app</h1><p>Step-by-step: build and deploy an AI chat app on AWS Lambda with Belt. See the <a href="/docs">docs</a> for reference.</p></main>`,
  });
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
  writeRoutePages(docs); // from the pristine index.html, before the home fallback is patched in
  patchIndexHtml(docs);
  console.log(`Agent files generated: ${docs.length} docs → llms.txt, llms-full.txt, docs/*.md, sitemap.xml`);
}

main();
