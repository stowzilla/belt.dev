# belt.dev

Product website and tutorial for [Belt](https://github.com/stowzilla/belt) — a Ruby framework and CLI that scaffolds, generates, and deploys complete serverless apps on AWS.

## Development

```bash
npm install
npm run dev    # starts on port 3003
```

## Build

```bash
npm run build  # outputs to build/
```

## Pages

- `/` — Marketing homepage (features, code showcase, how it works, get started)
- `/tutorial` — "Build an AI Chat App in 15 Minutes" step-by-step tutorial

## Tech

- React 18 + Vite
- react-router-dom (client-side routing)
- react-syntax-highlighter (code blocks with copy buttons)
- Dark theme, responsive design
- Collapsible code blocks for large files
- Sticky sidebar TOC for tutorial navigation

## Tutorial Code Samples

Tutorial code lives in `src/code-samples/tutorial/` organized by section. These are curated teaching snippets — the reference implementation is [space-chat](https://github.com/stowzilla/space-chat).

## Deploy

```bash
AWS_PROFILE=beltdev ./scripts/deploy.sh
```

The deploy script builds the site, syncs to S3, and invalidates the CloudFront cache. Deploys to https://belt.dev.

## License

MIT
