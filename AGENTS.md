# Development rules

- Scope: React + strict TypeScript, React Router framework mode, Vite, Tailwind v4. Keep `ssr: false` and pre-render every public route. No runtime backend.
- Put page composition in `app/routes`, shared layout in `app/components/layout`, purposeful UI in `app/components/ui`, homepage sections in `app/components/home`, theme behavior in `app/theme`, and typed business facts in `app/content`.
- Follow `docs/design-system.md`. Use semantic tokens, Manrope headings, DM Sans body text, restrained motion, and responsive layouts. Seasonal identity and appearance theme are independent.
- Use original supplied branding only. No generated or downloaded stock imagery, invented testimonials, statistics, credentials, guarantees, or business history. Preserve original pamphlets. Record asset provenance.
- Treat pamphlet prices and policies as provisional until owner approval. Keep source transcription and content inventory current. Contact details must come from typed business content.
- Use semantic HTML, one page h1, descriptive links, keyboard navigation, visible focus, reduced-motion support, and accessible contrast in both themes. Never hide either seasonal offering by date.
- Keep components small and dependencies justified. No fake forms or nonfunctional CTAs. Document material architectural changes.
- Run `npm run check` for milestone changes. Browser tests should cover real risks: static HTML, routes, theme persistence/system behavior, responsive overflow, keyboard access, and accessibility. Report limitations honestly.
- Stop at the requested milestone. Do not publish, commit, or expand remaining pages without an instruction to do so.
