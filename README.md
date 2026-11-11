# Kube’s Yard Maintenance

Milestone 1: a responsive, pre-rendered React homepage and shared layout, with
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
document. Unknown URL status codes depend on the host. No production deployment
is configured in Milestone 1; review locally first.

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

Stop point: Milestone 1. Confirm visual direction, actual service boundaries,
rates/policies, claims, and photography before expanding the remaining pages in
Milestone 2. See the content inventory for outstanding owner inputs.
