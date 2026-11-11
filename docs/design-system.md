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
before styles paint. An icon-only desktop disclosure opens Light/Dark/System choices; mobile shows
a compact segmented row inside the hamburger menu. The trigger’s sun/moon follows
the effective appearance, including System. OS changes
and storage changes in another tab are observed. Storage failure must not break the site.

## Typography and composition

Self-hosted variable Manrope headings and DM Sans body text, packaged by Fontsource
with their upstream OFL licenses. Font files are served locally; no Google Fonts requests.
Display type uses `clamp(3.1rem, 6.1vw, 6rem)` (mobile overrides); section headings
use `clamp(2rem, 3.5vw, 3.25rem)`. Heading weight 600; tight negative tracking,
1.07 display / 1.2 section line height. Body text generally 0.85–1rem, line height 1.65.
Small uppercase labels support hierarchy; do not place essential instructions only in tiny labels.

Milestone 1.5 adds `--text-caption` (12px at the default root size) for service
names, labels, notes, controls, and footer details. Only the compact logo's HTML
descriptor uses `--text-brand-detail` (10px); the accessible link name includes the
full business name. These sizes are readability choices, not a claimed WCAG
minimum font-size requirement. Captions wrap rather than being clipped.
Original summer hero artwork is capped at its 263px native width. Service-page
logos are capped at 246px high; mobile supporting art panels are at most 260px wide.

The homepage pairs the existing editorial headline with an original seasonal brand
plate, two concise service panels, a short introduction, and one closing contact
band. Detailed pricing lives on service pages as editorial rows with section
headings, short inclusion lists, notes, and native disclosure FAQs. Avoid repeated
pricing cards and wide tables.
Avoid repeated floating cards, shadows, gradients, stock-photo filler, and pill styling.

## Spacing and responsiveness

Base spacing rhythm: 4, 8, 12, 16, 24, 32, 48, 64px. Section spacing scales from
72–120px. Container max-width 1280px; gutters 56px desktop, 40px below 1150,
24px below 800, 20px below 600. Breakpoints follow content requirements.

Header navigation becomes an expandable menu at 800px; it supports Escape and
returns focus to its trigger. The theme selector belongs inside the expanded
mobile menu; the compact header contains only the brand and hamburger. Hero and services stack at 600px. Both seasonal
panels always appear. Avoid fixed content heights and do not mask overflow.
The menu resets on every history entry, including brand links and Back/Forward.
Client route changes focus the main landmark without overriding scroll restoration.
Validate at 320, 375, 768, 1024, and 1440px, plus enlarged text/zoom where practical.

## Components, access, and motion

Use `ActionLink` for substantial CTAs and underlined inline actions. All links have
real destinations. Primary actions, appearance options, and menu triggers have at least
44px target height. Focus uses an offset 2px ring. The skip link precedes navigation.
Use one h1, labelled sections, descriptive accessible names, native controls, and
decorative SVGs hidden from assistive technology. Body contact details stay selectable.

CSS transitions are limited to color, 3px arrow movement, and the hamburger
transform/opacity at 180ms. No animation
library. `prefers-reduced-motion: reduce` removes transitions and smooth scrolling.

## Milestone 2 seasonal tokens

Season and appearance remain independent. Summer uses the existing evergreen,
pine, sage, and ivory anchors. Winter adds midnight `#10172C`, navy `#16243A`,
slate `#607C92`, ice `#C8E1F2`, and restrained orange `#E5814F` (dark focus ring).
All anchors and semantic overrides live in `app/styles/app.css`; components never
scatter seasonal hex values. The original logos retain their source colors.

| Winter semantic role    | Light     | Dark         |
| ----------------------- | --------- | ------------ |
| Canvas / header         | Ivory     | Midnight     |
| Raised surface          | `#E8EDF1` | Navy         |
| Primary text            | Midnight  | Ivory        |
| Secondary text          | `#4D6072` | `#B4C6D5`    |
| Accent / primary action | Navy      | Ice          |
| Border                  | `#CBD4DC` | `#405367`    |
| Contact band            | Navy      | Navy         |
| Band secondary text     | Ice       | Ice          |
| Focus                   | `#90502E` | Muted orange |

`body[data-page='winter']` applies winter identity throughout the snow route,
including header/contact band/footer. On home, `html[data-featured-season]`
selects the same overrides and the featured logo/link. Summer and winter panels
retain their own surfaces to show both offerings. About and Contact keep shared
evergreen identity. No winter green bands, weather effects, or fake imagery.

The homepage logo frame reserves height for either original emblem before hydration;
manual season buttons use native pressed state and a minimum 44px height. The
header stays in flow with `position: sticky; top: 0`, solid semantic background,
stacking level 30, and a thin full-width border. Scroll padding is 128px desktop /
112px mobile, exceeding the 106px / 88px (84px narrow) header. Expanded navigation
is nonmodal and scrollable on short screens. Reduced motion removes the hamburger
transition as well as other motion. Keep pricing and FAQs readable without horizontal
scrolling; at narrow widths price moves below its label.

## Milestone 2.1 controls and tab identity

Filled `ActionLink` buttons share the seasonal accent/background tokens, modest
3px radius, comfortable padding, and existing color/focus transitions. Filled
buttons carry no arrows. Request a Quote actions use the shared label/destination;
the homepage’s secondary quote text is also arrow-free. Ordinary text service
navigation retains the understated arrow. Header quote actions now use the same
filled button style at a compact 44px minimum height.

The desktop appearance trigger has a 44px target with an 18px sun/moon. Its menu
uses icons, a checkmark, and a contrasting active background. It supports native
Enter/Space, arrow keys, Home/End, Escape, outside click, and focus exit. Mobile
reuses the same options as a three-part row; the active segment has a contrasting
fill and underline. No new entrance animation or menu library.

Favicon identity is independent of appearance. Lawn always uses summer, snow always
winter; shared pages follow the current featured season, including a manual choice.
Original artwork is downscaled proportionally and padded to square canvases; it
is never recolored or redrawn. Browser tab icons use the generated 64px PNG. See
architecture documentation for bootstrap, caching, and fallback behavior.
