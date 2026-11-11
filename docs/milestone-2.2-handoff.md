# Milestone 2.2 handoff

Completed locally on November 11, 2026. Static deployment artifact: `build/client/`.
No deployment, commit, backend, dependency, or subsequent milestone work.

## Changes and containment

Both service pages now use the same `ServiceDirectory` component. The existing
service labels/IDs come from typed service sections, with the existing FAQ target
centralized alongside them. Service copy, inclusions, pricing, seasonal identity,
homepage composition, theme controls, favicons, and quote behavior are preserved.

At 1000px and above, the directory is a sticky sidebar. Below 1000px it becomes a
compact labelled native “Jump to service” select. The sidebar can scroll internally
on short screens; long labels wrap. At smaller desktop widths the pricing content
stacks inside its available column, preserving readable labels and amounts.

The directory and pricing/FAQ sections share a `.service-layout` containing block.
The contact CTA is its following sibling; the footer is outside it. Native CSS
`position: sticky` therefore releases at the end of the services, rather than
floating over the contact band or footer. The compact row keeps its normal flow
space. No ancestor introduces overflow clipping. The directory uses a lower
stacking level than the main header and becomes hidden, without losing its space,
while the mobile hamburger is expanded. A regression test covers resizing out of
that expanded menu into the wider compact-picker layout.

`--header-height` now supplies the existing outer header sizes to the header,
expanded main menu, root scroll padding, and sticky service offsets. A
ResizeObserver updates the compact row’s contribution to section/h2 scroll margins,
without changing document flow. IntersectionObserver tracks the section at an
activation band below the sticky stack; only section-ID changes update React state.
There are no per-scroll listeners or JavaScript sticky-position calculations.

Active sidebar links use `aria-current="location"`, underline, weight, and a side
rule, so selection does not depend only on color. The native picker exposes the
current section as its selected option. Router Links render real anchor URLs;
the picker uses the same Router hash navigation, preserving distinct history keys
and scroll restoration. After navigation settles, focus moves to the target h2
without an additional scroll. Direct hashes, refresh, Back/Forward, manual scrolling,
and the static no-JavaScript anchor fallback are covered.

## Actual verification

| Check                                     | Result                                                                                                                                                                       |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PLAYWRIGHT_CHANNEL=chrome npm run check` | Passed: strict TypeScript, ESLint, formatting, production build, **57 Playwright tests** (25.7 seconds for the test run)                                                     |
| Service scrolling matrix                  | **20 cases**: both service routes × 320/375/768/1024/1440px × light/dark                                                                                                     |
| Actual 200% browser zoom                  | **4 cases**: both service routes in light/dark, using Chrome’s own appearance setting in temporary profiles                                                                  |
| Zoom measurement                          | 1440px outer window → 720px CSS viewport, device pixel ratio 2; no viewport-scale substitution                                                                               |
| Audit assertions                          | Zero horizontal overflow, axe violations, or directory overlap with the contact CTA across all 24 cases                                                                      |
| Navigation                                | Real typed targets, intended sticky threshold, active tracking, clear headings, focus rings, hash/reload/history behavior, unchanged layout height on mobile-menu open/close |
| Keyboard/static fallback                  | Desktop Enter activation, target-heading focus, native picker focus/Tab exit, committed native selection, useful no-JS links                                                 |
| Existing regressions                      | All prior route, static HTML, SEO, pricing, theme, favicon, contact, responsive, and accessibility tests passed                                                              |
| Final hygiene                             | ESLint, formatting, and `git diff --check` passed after the documentation/capture updates                                                                                    |

Evidence remains local under ignored `artifacts/`:

- [Full check output](../artifacts/milestone-2.2/checks.log)
- [24 screenshot gallery](../artifacts/milestone-2.2/review/gallery.html)
- [Measurements and axe results](../artifacts/milestone-2.2/review/report.json)
- [Audit summary](../artifacts/milestone-2.2/audit-summary.json)

Screenshots show reading and contact-boundary states for both service pages in both
themes at desktop/mobile widths and actual 200% zoom. The zoom audit changes only
isolated temporary Chrome profiles through `chrome://settings/appearance`; profiles
are removed afterward. Zoom images use Chrome’s native screenshot surface because
Playwright’s viewport normalization produced blank captures at real browser zoom.
No screenshot is edited or used as website imagery. Reproduction commands are in README.

## Limits and remaining decisions

Chrome automation on this macOS host did not emit a native select change event from
popup-key simulation. Keyboard link activation and native select focus/Tab exit
were executed; committed selection was tested through Playwright’s native-select
API. The application retains the browser’s native keyboard behavior without custom
key handlers. A physical-device/native-popup review and Safari/Firefox were not run.
Automated axe scans supplement visual/keyboard review rather than certify WCAG.

No Lighthouse score or production-hosting result is claimed. Existing unverified
business details remain unchanged in the content inventory. Stop point:
**Milestone 2.2**.
