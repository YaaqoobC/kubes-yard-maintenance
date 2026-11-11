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
    ui/                       Action link, seasonal hero, pricing, service page
    home/                     Homepage sections
  content/                    Typed business facts, approved prices, metadata helper
  season/                     Edmonton date rule, head bootstrap, manual switcher
  theme/                      Preference logic and native select
  styles/app.css              Tailwind import, semantic tokens, component styles
public/brand/                 Supplied original-source PNG assets
panflits/                     Unmodified original pamphlets
scripts/                      Brand copy, static finalizer, browser audit
tests/                        Browser, static rendering, accessibility checks
docs/                         Design, architecture, content inventory
pamphlet-content.md           Source transcription and provenance
```

## Routing and static hosting

`react-router.config.ts` explicitly sets `ssr: false` and pre-renders `/`,
`/lawn-care`, `/snow-removal`, `/about`, and `/contact`. React Router renders HTML
at build time, then hydrates for client navigation. No production runtime server,
database, actions, or form backend is needed. Each route has its own title and
description. `app/content/site.json` centralizes the user-supplied public origin
(`https://kubes-yard-maintenance.netlify.app`) and public paths. Metadata emits
route-specific canonicals and Open Graph URLs; the post-build script uses the
same data for `sitemap.xml` and `robots.txt`. No street address is invented.

Publish **only `build/client/`**. Public routes contain meaningful `index.html`
documents. Configure the static host to resolve clean paths to directory index
files (or explicit rewrites for these five routes). Serve existing files first. A wildcard route provides the branded not-found screen during
client navigation and is pre-rendered at `/404`. `scripts/finalize-static.mjs`
copies its HTML to `404.html`, which Netlify serves automatically with status 404
for unknown URLs. The screen includes real recovery links and `noindex, follow`;
it is excluded from the sitemap. Do not add a blanket 200 rewrite to the homepage.
Other static hosts must be configured to serve `404.html` with a 404 status.
React Router's `__spa-fallback.html` is still emitted but is not the Netlify error
document. Test direct visits and reloads after deployment.

`netlify.toml` declares the static build command, `build/client` publish directory,
and Node 24. `public/_headers` sets immutable year-long caching only for hashed
files under `/assets/`. Logos and documents keep normal revalidation behavior.
Milestone work prepares local artifacts; deployment remains a separate owner action.

Vite preview serves the static build for QA, not as a production runtime. Its
separate `vite.preview.config.ts` uses `appType: mpa` so clean paths resolve to
their actual pre-rendered documents instead of Vite's default SPA home fallback.
Its preview middleware also serves the generated 404 document for unknown page
requests with status 404, allowing direct static error-page verification.
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
- Business contact details and quote action live in `business.ts`. Approved pricing,
  units, limits, inclusions, notes, and FAQs live in `services.ts`. `ServicePage`,
  `SeasonalHero`, and `ServicePricing` compose both seasonal routes without duplicating
  amounts in JSX. The owner approved public pricing in the Milestone 2 brief.
- The homepage contains hero, two concise service choices, introduction, and contact
  band. Detailed inclusions, pricing, and FAQs live on the corresponding service route.
  About contains verified facts only; Contact uses phone/email and quote guidance.
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
- `RouteFocus` restores keyboard context to main after pathname changes. Header
  menu state is reset during rendering when the router history key changes, keeping
  theme controls mounted and avoiding a stale expanded menu on Back or logo navigation.
- `scripts/audit-site.mjs` captures a 60-case responsive/axe matrix (five routes plus a summer-home variant,
  five widths, two themes), 24 desktop/mobile page screenshots, and two expanded-menu screenshots. Generated evidence is ignored under `artifacts/`;
  historical findings remain in `docs/milestone-1.5-audit.md`, with current results in `docs/milestone-2-handoff.md`.

## Season and appearance architecture

`app/season/season.ts` centralizes `America/Edmonton` and winter months November–March.
April–October features summer. `seasonForDate` is pure and configurable. The head
bootstrap serializes the same function with its configuration, so client and test
rules cannot drift. It reads the visitor's current date before styles paint, never
the build date, weather, browser timezone, geolocation, or a network API.

Static HTML always contains both homepage variants and one shared h1. CSS driven
by `html[data-featured-season]` exposes the selected logo and primary service link.
The logo frame has stable dimensions across both seasons. Hydration renders the same
markup as the build; React does not replace a guessed build-time seasonal subtree.
`SeasonSwitcher` uses `useSyncExternalStore` only for `aria-pressed`, with a null
server snapshot; the pre-paint CSS controls the initial visual state. A manual
choice updates the document attribute and an event, remains for client navigation,
and resets to the date rule on a full reload. No persistent season preference hides
current seasonal emphasis. Both service destinations remain available year-round.
With JavaScript fully disabled, CSS falls back to summer and both service links work.

`body[data-page]` identifies home/summer/winter/shared using the route pathname.
Winter and a winter-featured homepage override semantic color tokens. Shared About
and Contact retain the evergreen brand. `html[data-theme]` separately controls
light/dark appearance and persists via the existing theme storage/bootstrap.
No duplicated seasonal theme system or new dependencies are introduced.

The header is sticky in document flow. Desktop links and tools share one nav; at
800px and below it expands below the header, with bounded viewport height/scrolling.
The single theme control moves with CSS into that menu, preserving its state.
A CSS three-line hamburger transforms into an X. The nonmodal disclosure supports
Escape to its trigger, closes on focus leaving the header and on every history
entry, and retains native Tab order. Route navigation focuses main. Root scroll
padding accounts for the sticky header, including fragment links and skip links.

## Milestone boundary

Milestone 2 completes both service pages, season behavior, navigation, and shared
page refinement. No backend, CMS, database, deployment, or Milestone 3 features.
Confirm winter response terms, credentials, exact service boundaries, add-on billing,
and owner/photo material before adding claims. Future approved domain changes must
update `site.json` so canonical and crawler output change together.

Hosting references: [Netlify custom 404 handling](https://docs.netlify.com/manage/routing/redirects/redirect-options/#custom-404-page-handling),
[Netlify custom headers](https://docs.netlify.com/manage/routing/headers/).
