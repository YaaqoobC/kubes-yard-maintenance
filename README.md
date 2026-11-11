# Kube’s Yard Maintenance

Milestone 1.5: a responsive, pre-rendered React homepage and shared layout, with
useful initial lawn care, snow removal, About, and Contact pages. Static hosting
only; no runtime server or contact-form backend.

## Run locally

Use Node **22.22+** (Node 24 LTS recommended) and npm.

```sh
npm ci
npm run dev
```

Open the Local URL printed by Vite. Contact CTAs use real `tel:` and `mailto:`
links. Theme preference supports light, dark, and system and persists locally.

## Commands

```sh
npm run typecheck
npm run lint
npm run format:check
npm run format
npm run build
npm run preview
```

Browser tests run against the production static build:

```sh
npx playwright install chromium
npm run build
npm test
# Or use installed Google Chrome:
PLAYWRIGHT_CHANNEL=chrome npm test
```

`npm run check` runs typechecking, lint, formatting, production build, and browser
tests in order. Install a test browser first (or set `PLAYWRIGHT_CHANNEL=chrome`).
Tests cover pre-rendered text without JavaScript, routes/contact links, theme
persistence and OS changes, mobile navigation, keyboard focus, requested widths,
and axe scans in light/dark. Reports are generated on failures.

## Build and deploy

```sh
npm run build
```

Deploy **`build/client/`** to static hosting. Enable clean URLs/directory indexes
for `/lawn-care`, `/snow-removal`, `/about`, and `/contact`. Each route has an HTML
document for direct requests. Preserve hashed asset filenames. If the host needs
a client fallback, use `__spa-fallback.html` after existing files, not the home
document. The build also generates `404.html`, `sitemap.xml`, and `robots.txt`.
Netlify automatically serves `404.html` for missing pages with HTTP 404.
`netlify.toml` sets the build command, static publish directory, and Node version;
`public/_headers` caches only hashed assets immutably. No server function is needed.
On another host, configure the same directory-index and 404 behavior.

The canonical origin is `https://kubes-yard-maintenance.netlify.app`. Update
`app/content/site.json` when an approved custom domain is introduced, then rebuild
to update metadata and crawler files together. No publish is performed by these commands.

## Developer guidance

Read [AGENTS.md](AGENTS.md), [design system](docs/design-system.md),
[architecture](docs/architecture.md), and [content inventory](docs/content-inventory.md).
Business content is centralized in `app/content/business.ts`. Original source
rates are provisional and excluded from public pricing. Original pamphlets and
[transcription](pamphlet-content.md) are retained for owner review.

Temporary logos come from the supplied `logos/` package and are copied unchanged
to `public/brand`. Sync them with `node scripts/sync-brand.mjs`. Swap the supplied
files and sync them without restructuring sections.
All visible headings and business names are HTML. No stock or AI imagery is used.

Stop point: Milestone 1.5. Confirm visual direction, actual service boundaries,
rates/policies, claims, and photography before expanding the remaining pages in
Milestone 2. See the content inventory for outstanding owner inputs.

## Milestone 1.5 review

See [audit and results](docs/milestone-1.5-audit.md). To reproduce screenshots and
the 50-case viewport/theme/axe audit, build the site, run `npm run preview --
--port 4174`, then in another terminal:

```sh
PLAYWRIGHT_CHANNEL=chrome node scripts/audit-site.mjs http://127.0.0.1:4174 artifacts/milestone-1.5/review
```

Omit `PLAYWRIGHT_CHANNEL=chrome` to use installed Playwright Chromium. Generated
screenshots and JSON stay in ignored `artifacts/`; no captures enter public assets.
The audit captures evidence and reports findings; `npm run check` supplies the
asserting regression suite. Actual production hosting status must be rechecked
after the owner deploys the build.
