# gpui-ce.github.io

Marketing site for GPUI-CE, built with Next.js and exported as static HTML for GitHub Pages.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Static output is written to `out/`.

## Deploy

Pushing to `main` runs [.github/workflows/deploy.yml](.github/workflows/deploy.yml), which builds the site and publishes `out/` via GitHub Pages.

Before the first deploy, set the repository's Pages source to **GitHub Actions**: Settings → Pages → Build and deployment → Source.

## Content

Links (GitHub org, repo, discussions, etc.) are centralized in [lib/site.ts](lib/site.ts) — update them there once the real project URLs exist.
