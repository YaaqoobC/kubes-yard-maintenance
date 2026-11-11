# Milestone 2 handoff

Implemented locally on November 11, 2026. No deployment, commit, or Milestone 3 work.
The static deployment artifact is `build/client/`.

## Result

- Preserved the original headline, fonts, Modern Evergreen foundation, editorial
  compositions, and supplied logos. No stock/generated imagery or new dependencies.
- Shortened home to hero, two concise service choices, introduction, contact band,
  and footer. Detailed service breakdowns now belong to their service pages.
- Added summer/winter visual identities independently of light/dark/system appearance.
  Winter uses navy/slate/ice, including the contact band; shared pages retain evergreen.
- Home automatically features winter November–March and summer April–October in
  Edmonton time, with a manual selector and permanent access to both service routes.
- Completed lawn pricing for mowing, spring cleanup, acreage, bagging, aeration,
  and additional services. Aeration tier boundaries do not overlap.
- Completed snow pricing, included areas, add-ons, and useful service questions.
  The page requests confirmation of add-on billing frequency and response terms.
- Made the header sticky, replaced Menu + with an animated hamburger/X, and moved
  the single mobile theme control inside the expanded menu beside a quote action.
  Escape, focus exit, route/brand navigation, history changes, and reduced motion work.
- Refined About with verified service facts and a structure that can accept authentic
  owner material later. Contact now explains what information helps with a quote.

## Architectural decisions

[Approved service content](../app/content/services.ts) owns numeric amounts, billing
units, inclusions, limits, notes, and FAQs. Shared service components compose both
routes; no price is duplicated in route JSX. [Business content](../app/content/business.ts)
owns phone/email, navigation, and the shared quote action.

[Season configuration](../app/season/season.ts) owns the Edmonton timezone and month
mapping. The same pure function is serialized into the head bootstrap to select the
season before paint. Static markup contains both visual variants, with CSS choosing
one; React hydrates unchanged markup. The original-logo frame and primary action
reserve consistent space. Tests compare document positions with hydration blocked,
after hydration, and after a manual selection at all five requested widths.
Manual selection lasts for client navigation; a full reload applies the date rule.
JavaScript-disabled home falls back to summer, with both service routes accessible.

[Semantic CSS tokens](../app/styles/app.css) provide seasonal overrides; theme
preference remains the existing independent persisted setting. No weather API,
geolocation, runtime service, menu library, database, or form backend was introduced.

Existing unique metadata, canonicals, crawler files, original assets, route focus,
and native static 404 handling remain. All five public routes plus technical 404
are pre-rendered. Deployment configuration is unchanged.

## Executed validation

| Check                                     | Actual result                                                                                                                                                 |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PLAYWRIGHT_CHANNEL=chrome npm run check` | Passed: strict TypeScript, ESLint, Prettier, production build, **32 Playwright tests** (15.2 seconds for the test run)                                        |
| Requested widths                          | 320, 375, 768, 1024, 1440px                                                                                                                                   |
| Production-build audit                    | **60 route/season/width/theme cases**, no horizontal overflow, axe violations, broken images, or page errors                                                  |
| Expanded mobile menu                      | Axe scans in both light/dark: no violations                                                                                                                   |
| Date rule                                 | Every month, Edmonton midnight at April/November boundaries, configurable rules, and browser timezone independent of Edmonton                                 |
| Seasonal bootstrap                        | Both dates, all five widths; correct primary service before hydration, stable logo-frame geometry during hydration/manual choice, no hydration console errors |
| Navigation and appearance                 | Sticky header while scrolling; fragment targets clear header; menu keyboard/Escape/focus exit; theme persistence/system/storage failure; reduced motion       |
| Content and links                         | Exact approved price list and aeration labels; spring/cleanup/acreage details; all discovered internal page/fragment links resolve; phone/email hrefs present |
| Static/SEO                                | Useful HTML without JavaScript; unique metadata; production canonicals; sitemap/robots; useful noindex 404 with HTTP 404 and recovery links                   |
| `git diff --check`                        | Passed                                                                                                                                                        |

Evidence is local and ignored by Git:

- [32-test and build output](../artifacts/milestone-2/checks.log)
- [Screenshot gallery](../artifacts/milestone-2/review/gallery.html)
- [60-case detailed report](../artifacts/milestone-2/review/report.json)
- [Audit summary](../artifacts/milestone-2/audit-summary.json)

The gallery contains 24 full-page desktop/mobile captures: all routes, both themes,
and both homepage seasons, plus two expanded-menu captures. Screenshots use Chrome,
375/1440px widths, and reduced motion. The audit pins a November date for winter
and manually selects summer, so reproduction does not depend on the current month.
Page captures use a fresh browser tab at full-document height to avoid incomplete
offscreen Chrome raster tiles and sticky-header ghosts. Menu captures use the
normal mobile viewport.
Reproduce using the command in README after building and starting static preview.

Automated axe scans and keyboard checks supplement visual inspection; they do not
certify WCAG compliance. No Lighthouse score, production-speed improvement, Safari/
Firefox result, real mobile-device test, delivered email, or completed phone call is
claimed. The hosting/CDN configuration was not deployed or reverified in production.

## Outstanding business decisions

The supplied Milestone 2 prices and inclusions are approved for public display.
Still unverified: exact service boundaries, tax treatment/effective dates, add-on
billing periods, double-cut surcharge amounts, owner history/credentials, and
photography provenance. No details were invented to fill those gaps.

The original winter pamphlet's 24-hour response after snowfall over 0.5 cm and
daily return visits during multi-day storms remain only in source documentation
and the content inventory, pending approval as binding service guarantees.
Insurance and ownership credentials also remain unpublished.

AGENTS.md, README, design system, architecture, content inventory, and the
transcription's approval note have been updated. Stop point: **Milestone 2**.
