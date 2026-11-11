# Modern Evergreen

## Color and themes

Brand anchors: evergreen `#194B35`, deep pine `#10291F`, sage `#94AD89`, warm ivory
`#F6F5EF`, golden sand `#D6AA69`, winter slate `#607C92`. Definitions and semantic
mappings live in `app/styles/app.css`; Tailwind v4 exposes them through `@theme`.

| Role                         | Light      | Dark        |
| ---------------------------- | ---------- | ----------- |
| Canvas                       | Warm ivory | `#101E18`   |
| Raised surface               | `#EEEEE5`  | `#192A21`   |
| Primary text                 | Deep pine  | `#F0F1E8`   |
| Secondary text               | `#58635A`  | `#B6C2B5`   |
| Accent text / primary action | Evergreen  | `#B0C7A4`   |
| Border                       | `#D6D9CD`  | `#3B4D3F`   |
| Summer surface               | `#E4EADC`  | `#243C2E`   |
| Summer text                  | Deep pine  | `#E7EDDF`   |
| Winter surface               | `#E3EAF0`  | `#233745`   |
| Winter text                  | `#233E52`  | `#E1EAF0`   |
| Focus                        | `#91601F`  | Golden sand |

Use semantic variables for components, not arbitrary color literals. Summer and
winter keep their own surfaces, copy, symbols, and original logos year-round.
Appearance selection never changes service visibility. Original raster artwork
keeps its white/dark backing in both themes; do not recolor the logos.

The default theme is system. An inline head script resolves storage and OS preference
before styles paint. A native labelled select exposes all three options; OS changes
and storage changes in another tab are observed. Storage failure must not break the site.

## Typography and composition

Self-hosted variable Manrope headings and DM Sans body text, packaged by Fontsource
with their upstream OFL licenses. Font files are served locally; no Google Fonts requests.
Display type uses `clamp(3.1rem, 6.1vw, 6rem)` (mobile overrides); section headings
use `clamp(2rem, 3.5vw, 3.25rem)`. Heading weight 600; tight negative tracking,
1.07 display / 1.2 section line height. Body text generally 0.85–1rem, line height 1.65.
Small uppercase labels support hierarchy; do not place essential instructions only in tiny labels.

The composition pairs an editorial headline with an original brand plate, then
two seasonal panels, an indexed service list, a restrained introduction, and one
closing contact band. Indexes are service ordering, never business statistics.
Avoid repeated floating cards, shadows, gradients, stock-photo filler, and pill styling.

## Spacing and responsiveness

Base spacing rhythm: 4, 8, 12, 16, 24, 32, 48, 64px. Section spacing scales from
72–120px. Container max-width 1280px; gutters 56px desktop, 40px below 1150,
24px below 800, 20px below 600. Breakpoints follow content requirements.

Header navigation becomes an expandable menu at 800px; it supports Escape and
returns focus to its trigger. Hero and services stack at 600px. Both seasonal
panels always appear. Avoid fixed content heights and do not mask overflow.
Validate at 320, 375, 768, 1024, and 1440px, plus enlarged text/zoom where practical.

## Components, access, and motion

Use `ActionLink` for substantial CTAs and underlined inline actions. All links have
real destinations. Primary actions, theme select, and menu trigger have at least
44px target height. Focus uses an offset 2px ring. The skip link precedes navigation.
Use one h1, labelled sections, descriptive accessible names, native controls, and
decorative SVGs hidden from assistive technology. Body contact details stay selectable.

CSS transitions are limited to color and 3px arrow movement at 180ms. No animation
library. `prefers-reduced-motion: reduce` removes transitions and smooth scrolling.
