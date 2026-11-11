# Development rules

- Scope: React + strict TypeScript, React Router framework mode, Vite, Tailwind v4. Keep `ssr: false` and pre-render every public route. No runtime backend.
- Put page composition in `app/routes`, shared layout in `app/components/layout`, purposeful UI in `app/components/ui`, homepage sections in `app/components/home`, theme behavior in `app/theme`, typed business facts and approved prices in `app/content`, and date/selection logic in `app/season`.
- Follow `docs/design-system.md`. Use semantic tokens, Manrope headings, DM Sans body text, restrained motion, and responsive layouts. Seasonal identity and appearance theme are independent.
- Use original supplied branding only. No generated or downloaded stock imagery, invented testimonials, statistics, credentials, guarantees, or business history. Preserve original pamphlets. Record asset provenance.
- Milestone 2 authorizes the prices, inclusions, and acreage/cleanup notes in `app/content/services.ts`. Keep all pricing there, with shared contact/quote configuration in `app/content/business.ts`. Winter response timing, insurance/ownership claims, exact area boundaries, taxes, and add-on billing periods remain unverified; do not invent them. Preserve the source transcription and update the content inventory.
- Use semantic HTML, one page h1, descriptive links, keyboard navigation, visible focus, reduced-motion support, and accessible contrast in both themes. Never hide either seasonal offering by date. Use the centralized Edmonton season rule and pre-paint bootstrap; render stable static markup, independent from light/dark/system mode.
- Keep the header sticky. The mobile menu contains the single appearance control (desktop icon menu / mobile segmented choices), supports Escape/focus exit, and closes on navigation. Keep anchor offsets clear of the header.
- Keep components small and dependencies justified. No fake forms or nonfunctional CTAs. Document material architectural changes.
- Run `npm run check` for milestone changes. Browser tests should cover real risks: static HTML, routes, theme persistence/system behavior, responsive overflow, keyboard access, and accessibility. Report limitations honestly.
- Stop at the requested milestone. Do not publish, commit, or expand remaining pages without an instruction to do so.

- Filled CTAs are arrow-free; quote actions use shared content. Keep ordinary text-link arrows optional.
- Favicon route/featured-season selection belongs in `app/season`. Keep one active icon declaration, independent of appearance. Preserve content-hashed generated assets and manifest; regenerate offline from original logos with `scripts/generate-favicons.mjs`.
