# beltruby.com

Product website and tutorial for [Conveyor Belt](https://github.com/stowzilla/belt) — a Terraform provider that turns a Rails-like Ruby DSL into complete AWS serverless infrastructure.

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
- `/tutorial` — "Build a Chat App in 15 Minutes" step-by-step tutorial

## Tech

- React 18 + Vite
- react-router-dom (client-side routing)
- react-syntax-highlighter (code blocks with copy buttons)
- Dark theme, responsive design

## Deployment

Built output is a static site deployed to S3 + CloudFront.

## License

MIT
