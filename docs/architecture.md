# Architecture

## Stack and directories

React + strict TypeScript, React Router framework mode, Vite, and Tailwind CSS v4.
Use Node >=22.22.0 (Node 24 LTS recommended); package-lock.json pins the installed tree.

```text
app/
  root.tsx                    Document, theme bootstrap, layout, error boundary
  routes.ts                   Public route configuration
  routes/                     Page metadata and composition
  components/
    layout/                   Header, brand, footer, closing contact band
    ui/                       Action link, arrow, initial service overview
    home/                     Homepage sections
  content/                    Typed facts, provisional source rates, metadata helper
  theme/                      Preference logic and native select
  styles/app.css              Tailwind import, semantic tokens, component styles
public/brand/                 Supplied original-source PNG assets
panflits/                     Unmodified original pamphlets
scripts/                      Copies supplied logos to public assets
tests/                        Browser, static rendering, accessibility checks
docs/                         Design, architecture, content inventory
pamphlet-content.md           Source transcription and provenance
```

## Routing and static hosting

`react-router.config.ts` explicitly sets `ssr: false` and pre-renders `/`,
`/lawn-care`, `/snow-removal`, `/about`, and `/contact`. React Router renders HTML
at build time, then hydrates for client navigation. No production runtime server,
database, actions, or form backend is needed. Each route has its own title and
description. No canonical domain, sitemap origin, or address is invented.

Publish **only `build/client/`**. Public routes contain meaningful `index.html`
documents. Configure the static host to resolve clean paths to directory index
files (or explicit rewrites for these five routes). Serve existing files first;
for optional client routing fallback use React Router's `__spa-fallback.html`,
not the homepage. If supported, map unknown URLs to that fallback with HTTP 404;
the client shows the error boundary. The host controls HTTP status for unknown
paths. Test direct visits and reloads on all routes on the selected host.

Vite preview serves the static build for QA, not as a production runtime. Its
separate `vite.preview.config.ts` uses `appType: mpa` so clean paths resolve to
their actual pre-rendered documents instead of Vite's default SPA home fallback.
React Router emits an intermediate server build during pre-rendering; it is not
a deployment artifact. There is no loader or external data dependency.

Official references consulted during setup:
[React Router pre-rendering](https://reactrouter.com/how-to/pre-rendering),
[Tailwind Vite installation](https://tailwindcss.com/docs/installation/using-vite).

## Decisions and boundaries

- The repo initially contained only a README and four original pamphlet PNGs.
  The supplied logo package subsequently became available under `logos/`. Exact
  PNGs are copied to `public/brand`; source artwork remains unchanged. The source
  transcription was created from the original pamphlets.
- `Brand` renders live HTML lettering beside the replaceable summer emblem.
  The source wordmark raster is retained for reference; no heading or pricing is
  rendered from it. Winter's supplied badge necessarily includes its original lettering.
- All facts, links, service lists, and source rates live in typed content. Source
  rates are not imported by public rendering. Public pages request current quotes.
- The four supporting routes intentionally contain only useful initial content;
  homepage and shared layout are the completed Milestone 1 scope.
- Fonts are local. No imagery service, analytics, tracking, CMS, backend, or fake form.
- CSS provides all transitions. Tailwind v4 is integrated through its Vite plugin;
  semantic component CSS handles editorial compositions alongside utility primitives.
- TypeScript 6 is selected for compatible stable peer ranges; current
  TypeScript 7 exceeds typescript-eslint's supported range at setup time. ESLint 10
  is current and compatible. A minimatch 11 override patches a development-only
  glob denial-of-service advisory; lint and type generation verify compatibility.
- Browser tests use Playwright and axe against the actual static production build.
  Chromium can use local Google Chrome via `PLAYWRIGHT_CHANNEL=chrome`; otherwise
  install Playwright Chromium. Automated checks supplement manual review, not certify WCAG.

## Milestone 2

Review visual direction with the owner, confirm rates, snow thresholds/response
policy, insurance/ownership wording, service boundaries, and original photograph
provenance. Expand service pages and About using approved details. Confirm a
production domain and static host, then add domain-specific SEO and deployment
configuration. A hosted contact form is a separate future scope decision.
