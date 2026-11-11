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
  theme/                      Existing preference logic, icon/menu appearance control
  styles/app.css              Tailwind import, semantic tokens, component styles
public/brand/                 Supplied original-source PNG assets
public/favicons/              Generated 16/32/64px seasonal PNGs
public/favicon.ico            Default summer fallback (16/32/64px entries)
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
  five widths, two themes), 24 desktop/mobile page screenshots, two expanded mobile-menu screenshots, and two desktop appearance-menu screenshots. Generated evidence is ignored under `artifacts/`;
  historical findings remain in `docs/milestone-1.5-audit.md`, with Milestone 2 results in `docs/milestone-2-handoff.md` Milestone 2.1 results in `docs/milestone-2.1-handoff.md`, and current service-navigation results in `docs/milestone-2.2-handoff.md`.

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
The single appearance control keeps the existing preference state and storage.
Desktop uses an icon-triggered menu; mobile reuses its options as a segmented row
inside navigation. Keyboard choice, outside click, Escape, focus exit, history
changes, and breakpoint changes dismiss the desktop popup. The selected option
is a menu radio item; arrow keys and Home/End move focus. Selection returns desktop
focus to the trigger and keeps the mobile navigation open.
A CSS three-line hamburger transforms into an X. The nonmodal disclosure supports
Escape to its trigger, closes on focus leaving the header and on every history
entry, and retains native Tab order. Route navigation focuses main. Root scroll
padding accounts for the sticky header, including fragment links and skip links.

## Milestone boundary

Milestone 2 completed both service pages, season behavior, navigation, and shared
page refinement. Milestone 2.1 added CTA, appearance-control, and favicon refinements.
Milestone 2.2 adds bounded service directories and shared active-section tracking.
No backend, CMS, database, deployment, or subsequent milestone features.
Confirm winter response terms, credentials, exact service boundaries, add-on billing,
and owner/photo material before adding claims. Future approved domain changes must
update `site.json` so canonical and crawler output change together.

Hosting references: [Netlify custom 404 handling](https://docs.netlify.com/manage/routing/redirects/redirect-options/#custom-404-page-handling),
[Netlify custom headers](https://docs.netlify.com/manage/routing/headers/).

## Milestone 2.1 favicon and control implementation

`pageContextForPath` and `seasonForPage` in `app/season/season.ts` centralize route
context and seasonal overrides. Layout, header, and favicon reuse that context.
`SeasonalFavicon` owns exactly one `link[rel=icon]`. The static lawn/snow HTML
contains the correct fixed seasonal asset; shared HTML uses summer as its no-JS
fallback. A head script immediately applies the visitor’s featured season using
the same pure rules and manifest. It runs after the declaration, before hydration.

The head consumer of `useFeaturedSeason` opts into the pre-paint document snapshot
when hydrating. This matches the already-updated icon href, so React can claim
that existing node. Body season controls keep the original null server snapshot.
The icon’s error handler opts it out of React’s head-resource hoisting, preventing
independent hoisted declarations; if the browser reports an icon error it tries
`/favicon.ico` once. Route rendering and the shared `seasonchange` subscription
update the existing declaration on client navigation, manual choice, and history.
There is no duplicate icon or connection to appearance preference.

`app/content/favicons.json` maps seasonal sizes to content-hashed paths. The offline
macOS script `node scripts/generate-favicons.mjs` uses built-in `sips` to downscale
the original `logos/*-logo.png` proportionally, pads to 16/32/64px square canvases
with each source backing, and writes PNGs, the manifest, and a multi-size default
summer ICO. Commit generated files; Netlify/Linux builds need no image tool or new
dependency. A content change changes the active PNG URL to avoid stale tab-icon
cache entries. Existing files use normal host revalidation (no immutable favicon
rule). Browser favicon caches can still persist across tabs/bookmarks; verify the
actual href/request in a fresh tab/profile after deployment. `/favicon.ico` is a
static default and may have its own browser cache. No Apple touch icon is provided;
iOS home-screen icon behavior is separate from the tab icon and is not asserted.

`applyThemePreference` centralizes the existing DOM appearance update for preference
selection and OS/storage events. The original theme head bootstrap remains in place;
CSS selects the effective sun/moon before hydration without displaying permanent
Light/Dark/System text in desktop navigation. No separate theme state system.

## Milestone 2.2 service navigation

`ServicePage` wraps only the directory and pricing/FAQ sections in `.service-layout`.
The contact CTA is the next sibling, and the footer remains outside main. Desktop
uses a two-column grid with `ServiceDirectory` as a sticky sidebar. Its containing
block ends with the service content, so CSS naturally releases it before the CTA.
The directory has a viewport-bounded internal scroll area on short desktop windows;
no ancestor creates an overflow scroll container. Pricing remains in its existing
editorial layout, stacking within the content column at 1000–1150px to stay readable.

Below 1000px the same component presents a labelled native select, sticky below
the header within that same service-only parent. Its normal flow space remains
reserved, so it does not obscure prices or move content when sticking/releasing.
The original anchor list is a useful static fallback when JavaScript is disabled;
on narrow no-JS layouts it stays in normal flow. The mobile picker becomes
`visibility: hidden` while the hamburger is expanded, preserving layout space
while preventing competing focus/interaction under the site navigation.

`--header-height` describes the unchanged outer header sizes (107/89/85px across
breakpoints). Header inner height, expanded-menu max-height, root scroll padding,
and service sticky offsets share that token. `--sticky-gap` adds a consistent
16px breathing space. A ResizeObserver measures only header/directory size changes
and writes `--service-nav-height` on the service wrapper, affecting scroll margins
rather than layout. Sections and their h2 targets account for the compact row in
addition to the root header scroll padding.

One IntersectionObserver watches the actual service sections at a narrow activation
band immediately below the sticky stack, with a 4px fractional-pixel allowance.
Its callbacks reconcile the section containing that band; React state changes only
when the section ID changes. Resizing rebuilds the observer. There is no scroll
listener or JavaScript sticky-position calculation. Active desktop links use
`aria-current="location"`, an underline, heavier text, and a side rule. The native
picker exposes the current section through its selected option.

Directory items derive from typed service sections plus the shared typed FAQ target.
React Router Links render real anchors, and the native picker uses the same Router
hash navigation. This gives hash entries distinct history keys and keeps scroll
restoration coordinated with Back/Forward. After hash navigation settles, focus
moves to the corresponding h2 with `preventScroll`; native hash/Router scrolling
uses CSS offsets and respects the existing reduced-motion rule. Initial direct
hashes, reloads, same-page navigation, manual scrolling, and history are covered.
No backend, content/pricing changes, or dependencies.
