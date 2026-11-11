# Milestone 2.1 handoff

Completed locally on November 11, 2026. Deployment artifact: `build/client/`.
No deployment, commit, service/pricing change, backend, dependency, or next-milestone work.

## UI and branding changes

- Shared filled `ActionLink` buttons have no arrows, centered labels, existing
  seasonal accent colors, modest radius, comfortable padding, and visible focus.
  Quote actions read **Request a Quote** and retain `/contact`. The header uses
  this same filled pattern; the homepage’s secondary quote text is arrow-free.
  Ordinary text service links retain their understated arrows.
- Desktop appearance is an icon-only sun/moon button. Its lightweight menu contains
  Light, Dark, and System with icons, radio semantics, and an active checkmark/fill.
  The trigger reflects effective appearance, including OS changes under System.
- Mobile reuses the same options as a compact segmented row inside the hamburger
  menu. No appearance control returns to the compact mobile header.
- Existing preference storage, system detection, pre-paint bootstrap, seasonal
  tokens, reduced motion, sticky navigation, and service-page content remain.

The menu supports Enter/Space, arrows, Home/End, Escape, outside click, and focus
exit. Desktop selection closes it and restores trigger focus; mobile selection
keeps navigation open. Route/history and breakpoint changes dismiss the desktop
popup. Targets are at least 44px high.

## Seasonal favicons

`pageContextForPath` and `seasonForPage` centralize route overrides. Lawn always
uses summer, snow always winter, and Home/About/Contact follow the featured season,
including a manual homepage selection. Appearance preference never selects an icon.

`SeasonalFavicon` renders one active declaration, using the existing feature
subscription and a pre-paint bootstrap. Its head hydration snapshot matches the
already-updated document, avoiding a duplicate React declaration. Direct loads,
client transitions, Back/Forward, and refresh are covered by tests.

The original `logos/*-logo.png` artwork is proportionally downscaled and padded to
16/32/64px squares. Generated content-hashed PNGs live in `public/favicons/`, mapped
by `app/content/favicons.json`. The active tab link uses the 64px PNG. A multi-size
summer `public/favicon.ico` supplies a conventional default fallback. No AI artwork,
recoloring, or logo redesign. Source PNGs are unchanged.

Regenerate offline on macOS with `node scripts/generate-favicons.mjs` (built-in
`sips`). Generated files are project source; production builds require no image
tool. Full details are in the architecture/design documentation and logos README.

## Executed validation

| Check                                     | Actual result                                                                                                                                      |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PLAYWRIGHT_CHANNEL=chrome npm run check` | Passed: strict TypeScript, ESLint, Prettier, production build, **43 browser tests** (18.4 seconds for the test run)                                |
| Responsive/theme audit                    | **60 cases**, widths 320/375/768/1024/1440px, light/dark, both home seasons, all five public routes                                                |
| Audit findings                            | Zero overflow, axe violations, page errors, broken images, duplicate icons, or home season mismatches                                              |
| Expanded controls                         | Desktop appearance menu and mobile navigation each pass axe in light/dark                                                                          |
| Quote actions                             | Every route: correct label/destination, no quote SVG arrows, shared filled header pattern, 44px target, visible focus                              |
| Appearance                                | Persistence, OS changes, System effective icon, pre-hydration icon/theme, blocked storage, keyboard/dismissal, mobile placement/fit                |
| Favicon                                   | Both dates/all routes before and after hydration; fixed service overrides; manual season; client/history/refresh; no React hydration errors        |
| Generated assets                          | All six PNGs return 200, have actual square dimensions and matching content hashes; valid multi-size ICO; static no-JS route icons                 |
| Existing behavior                         | Static HTML, service prices/inclusions, SEO/canonical/crawler files, useful 404, contacts, sticky header/anchor offsets, seasonal layout stability |
| Final source hygiene                      | ESLint, formatting, and `git diff --check` passed after documentation/capture-script updates                                                       |

Local evidence (ignored by Git):

- [Full build/test output](../artifacts/milestone-2.1/checks.log)
- [28 screenshot gallery](../artifacts/milestone-2.1/review/gallery.html)
- [60-case audit details](../artifacts/milestone-2.1/review/report.json)
- [Audit summary](../artifacts/milestone-2.1/audit-summary.json)

Screenshots include all page layouts at desktop/mobile widths in both themes,
both homepage seasons, mobile menus, and desktop appearance menus. Original and
generated logo artwork plus the changed controls were visually reviewed in Chrome.
The capture script uses fresh tabs for long pages to avoid Chrome offscreen raster
artifacts; screenshots are not edited or used as public website imagery.

## Browser limits and remaining decisions

Chrome automation verifies the active favicon declaration and actual asset bytes,
not the operating system’s browser-tab pixels or bookmark cache. Content-hashed
PNG URLs avoid reusing an old asset URL after artwork changes, but an existing tab
or bookmark can retain a browser-managed icon. After deployment, verify in a fresh
tab/profile if needed. The conventional `/favicon.ico` fallback has its own cache.

No Apple touch icon is provided. Safari/iOS home-screen icons and installed shortcuts
have separate behavior/caching and were not tested. No Firefox/Safari or physical
mobile-device result, Lighthouse score, or production/CDN deployment result is claimed.
Automated axe scans supplement keyboard/visual review and do not certify WCAG.

All previously unverified business claims and billing details remain unchanged in
the content inventory. Stop point: **Milestone 2.1**.
