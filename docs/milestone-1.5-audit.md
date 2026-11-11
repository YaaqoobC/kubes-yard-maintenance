# Milestone 1.5 audit and refinement

Audit date: November 11, 2026. Baseline commit: `47b99f1`.
This report was written before product changes. Baseline observations below are
retained; implementation results will be appended after verification.

## Scope and evidence

Reviewed every route, shared/home/UI component, theme module, content file, CSS,
tool configuration, supplied logos, source transcription, and existing documentation.
Inspected desktop (1440px) and mobile (375px) screenshots for all five routes in
both themes. Chrome/Playwright measured all 50 route × width × theme combinations
at 320, 375, 768, 1024, and 1440px; axe ran on each combination.

Evidence is under `artifacts/milestone-1.5/before/` (`report.json`, `assets.json`,
20 full-page PNGs). Live HTTP responses and a deployed homepage capture are under
`artifacts/milestone-1.5/live/`. Artifacts are local generated evidence; the audit
script is retained to reproduce them. Public URL:
<https://kubes-yard-maintenance.netlify.app/>.

## Verified issues and reproduction

File references below identify the baseline code; line numbers may move after fixes.

| ID  | Finding and reproduction                                                                                                                                                                                                                                                                               | Source                                                                                          | Impact / effort   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------- |
| A1  | At 375px, open the menu on `/lawn-care`, then click the header brand. The homepage loads with `aria-expanded="true"`; the menu remains open. Only navigation-list clicks close it.                                                                                                                     | `app/components/layout/header.tsx:33`                                                           | High / small      |
| A2  | At 375px, keyboard-open the menu and activate Snow removal. The clicked link becomes hidden and focus falls to `body#top`, rather than the new page's content.                                                                                                                                         | `app/components/layout/header.tsx:33`, `app/root.tsx:39`                                        | High / small      |
| S1  | All five live documents lack a canonical link. View source or inspect `link[rel=canonical]`. Home and About also share the same description, despite unique titles.                                                                                                                                    | `app/content/pages.ts:4`, `app/routes/about.tsx:6`, `app/routes/home.tsx:12`                    | High / small      |
| S2  | Live `/sitemap.xml` and `/robots.txt` both return 404. Neither exists under `public/`.                                                                                                                                                                                                                 | `public/`, `package.json:12`                                                                    | Medium / small    |
| S3  | Live `/missing-audit-page` returns Netlify's generic 404. Local static preview returns an empty 404. A branded React error boundary exists, but no static 404 document exposes it on direct unknown URLs.                                                                                              | `app/root.tsx:56`, `vite.preview.config.ts:11`, absent hosting/404 output                       | Medium / moderate |
| C1  | Homepage's “Let’s talk yard care” starts a phone call without saying so and suggests summer only. Header “Let’s talk” has the same ambiguity.                                                                                                                                                          | `app/components/home/hero.tsx:29`, `app/components/layout/header.tsx:50`                        | High / small      |
| C2  | “Whatever’s outside, we’re on it,” “Good things start at ground level,” and the introduction repeat broad marketing instead of identifying the work, location caveat, and quote process.                                                                                                               | `app/components/home/seasons-section.tsx:19`, `selected-services.tsx:20`, `introduction.tsx:22` | Medium / small    |
| V1  | Supporting copy is unnecessarily small: mobile winter-strip label computes to 7.68px; service-list labels 8.96px; seasonal service names 10.56px; footer area note 10.24px. Inspect `smallText` in the baseline report. This is a readability concern, not an asserted WCAG minimum-font-size failure. | `app/styles/app.css:452`, `:570`, mobile overrides                                              | Medium / small    |
| V2  | The 263px-wide original summer logo is enlarged to roughly 306px in the desktop hero. Supporting-page brand panels consume roughly 300px vertically on mobile before another contact band. Cap original display size and modestly reduce mobile supporting art.                                        | `app/styles/app.css:397`, `:751`, `app/components/ui/service-overview.tsx:37`                   | Low / small       |

## Visual assessment and recommendations

- Preserve “Good yards. Clear paths. Every season.” It has a clear hierarchy and
  holds together at both widths; the sage/ivory and slate panels read as one brand.
- Keep the existing section sequence, rules, palette, Manrope/DM Sans, and restrained
  motion. No added sections, imagery, or major composition changes are warranted.
- Use “Request a quote” linked to the existing contact page, with phone/email options
  there. Keep both named seasonal links prominent. Make the winter strip name snow
  removal explicitly. The headline can stay editorial while service headings become concrete.
- Increase small service names, labels, and service-area notes with a compact type
  token. Allow captions and the header to wrap/reflow where necessary at 320px.
- Preserve white/dark logo backing; cap enlargement, correct intrinsic dimensions,
  and modestly reduce supporting mobile panels rather than redesigning artwork.
- Large photographic hero replacements, new logos, reordering sections, and a fully
  expanded About story require a separate visual/content review and are deferred.

## Accessibility, SEO, performance, and architecture

Baseline `PLAYWRIGHT_CHANNEL=chrome npm run check` passed type generation,
TypeScript, ESLint, Prettier, build, and all 13 existing tests. The expanded audit
found zero horizontal overflow, zero broken images, and zero axe WCAG A/AA
violations in 50 combinations. Keyboard/route-focus problems A1/A2 require manual
interaction checks beyond axe. Existing focus indicators, skip link, semantic
landmarks, one h1 per page, decorative empty alt text, meaningful service-logo alt
text, theme persistence/system changes, and reduced-motion behavior are sound.

Five live public routes return 200 with route-specific pre-rendered content.
Direct HTTP inspection additionally confirmed Netlify redirects `/lawn-care` to
`/lawn-care/` with 301. Canonicals and sitemap entries will therefore use trailing
slashes for directory pages, matching the host's final URLs rather than redirect sources.
Static build output contains all five documents. Titles are unique; descriptions
need the About correction, and canonical/crawler/404 work remains as listed above.
Do not add structured data with an invented street address, operating hours, or ratings.

Measured build assets: 378,918 bytes of JS across all route chunks (not a single
page transfer), 29,321 bytes of CSS (9,294 bytes with local gzip), and seven font
subset files. Fonts are local and only matching Unicode subsets are requested.
No tracking, third-party image requests, animation framework, or backend is present.
No Lighthouse or field Core Web Vitals score was run or inferred. Static caching
for hashed assets is a small hosting improvement; broad bundle refactoring is not justified.

Content matches `docs/content-inventory.md` and `pamphlet-content.md`: no prices,
insurance assertions, owner history, ratings, or snow-response guarantees are
published. Edmonton is the target market, not a verified coverage boundary;
the service-address confirmation must remain prominent. Package versions and
component boundaries need no general refactor.

## Prioritized implementation

1. Fix menu state on all route changes and focus the new main content (A1/A2).
2. Clarify quote/contact CTAs and concrete service copy without adding content
   sections or expanding the service pages (C1/C2).
3. Add centralized public origin/path data, canonical and Open Graph URLs, unique
   descriptions, generated sitemap/robots, and a branded static 404 (S1–S3).
4. Make limited text-size/logo refinements and maintain both theme treatments
   (V1/V2); add hashed-asset caching configuration for the known Netlify host.
5. Add regression coverage, repeat all 50 responsive/axe cases, capture matching
   after screenshots, and document actual results and deployment limitations.

No production publish or Milestone 2 expansion is included in this work.

## Implemented refinements and final results

All scoped fixes above are implemented locally:

- A1/A2: Header state resets for each router history entry; link activation,
  brand navigation, and Back do not leave the menu expanded. Pathname changes
  focus `main#main-content` without overriding scroll restoration. Escape still
  returns focus to the menu button.
- C1/C2: The homepage and service-page primary actions say “Request a quote” and
  open Contact's working phone/email choices. Header says “Call us”; winter strip
  explicitly names snow removal. Seasonal/service headings and introduction copy
  describe the work and contact process. About's repeated service/address copy
  was reduced. The original homepage headline and section order are preserved.
- S1/S2: All five pages have unique titles/descriptions, canonical and Open Graph
  URLs. The known Netlify origin and trailing-slash public URLs are centralized
  in `app/content/site.json`. Build-generated robots and sitemap share that source.
- S3: A wildcard route renders a useful branded 404. Its pre-rendered HTML is
  copied to `404.html` for Netlify; preview verifies real 404 status with meaningful
  HTML, including without JavaScript. Error documents carry `noindex, follow` and
  are excluded from the sitemap.
- V1/V2: Small informational labels now use a 12px caption token. The compact
  logo descriptor remains 10px and has a full accessible business-name link.
  Hero enlargement is capped at the original asset width; supporting artwork is
  modestly reduced. Palette, typography families, surfaces, transitions, and
  year-round seasonal access are retained. No imagery or dependencies were added.
- Prepared static Netlify build/Node configuration and immutable caching for
  hashed assets only. Updated design, architecture, content inventory, and README.

| Executed check                                      | Actual final result                                                                                               |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `PLAYWRIGHT_CHANNEL=chrome npm run check`           | Passed: route types, strict TypeScript, ESLint, Prettier, static build, **18 browser tests**                      |
| `npm audit --audit-level=moderate`                  | **0 known vulnerabilities**                                                                                       |
| `node scripts/audit-site.mjs` with installed Chrome | **50/50 cases**, zero horizontal overflow, zero broken images, zero browser page errors, zero axe A/AA violations |
| Primary actions, menu button, theme select          | All measured visible controls at least 44px high in the matrix                                                    |
| Menu and route focus reproduction                   | Menu after logo navigation: `false`; focus after menu navigation: `main-content`                                  |
| Metadata and crawler files                          | Five unique canonical URLs/descriptions; robots/sitemap 200 locally; sitemap lists exactly five public URLs       |
| Direct unknown URL, both themes                     | Useful HTML with status 404, noindex, recovery links; verified with and without JavaScript                        |
| `git diff --check`                                  | Passed                                                                                                            |

Final all-route JS assets total 381,203 bytes, up 2,285 bytes for the focus/404/SEO
changes. CSS totals 30,096 bytes (9,329 local gzip), versus 29,321 (9,294 gzip)
before. These are artifact measurements, not page transfer sizes or a speed score.
No Lighthouse score or field performance claim is made.

The matching **40 before/after screenshots** cover every public route at 375/1440px
in light/dark. Four extra captures show the menu and 404 at 320px in both themes.
Manual screenshot review confirmed the retained hierarchy, seasonal distinction,
wrapping, readable supporting details, and section transitions. Keyboard checks
covered Tab, Enter, Escape, skip link, route focus, and visible focus styles.

Open the local [before/after gallery](../artifacts/milestone-1.5/comparison.html),
[final matrix report](../artifacts/milestone-1.5/after/report.json), or
[full check log](../artifacts/milestone-1.5/checks.log). These generated files are
intentionally ignored by Git; the report and audit script remain project source.

## Remaining limits and stop point

- The live site was checked as the baseline; **the refinements have not been
  deployed**. After the owner deploys `build/client`, recheck Netlify's actual
  canonical/crawler responses, clean paths, custom 404 status, and cache headers.
  Local preview does not emulate Netlify's CDN or apply its `_headers` file.
- Chrome was used for screenshots/automated interaction. Physical-device,
  Safari/Firefox, full assistive-technology, and field performance testing were
  not performed; automated axe results do not certify full WCAG conformance.
- Current pricing, exact service boundaries, owner history, insurance wording,
  winter trigger/response policies, and photo provenance still need owner approval.
  No unconfirmed prices, coverage guarantees, or credentials were published.
- Major visual redesign, new photography, and full service/About expansion remain
  deferred for review and Milestone 2. Stop after Milestone 1.5.
