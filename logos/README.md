# Kube’s temporary site assets

All PNGs are **extractions from the supplied pamphlets**, not AI redraws.

- `logos/summer-logo.png` — transparent summer logo, native crop resolution
- `logos/summer-logo-2x.png` — same source enlarged 2× using Lanczos (not additional detail)
- `logos/winter-logo.png` — winter shield with outside pamphlet background removed
- `logos/winter-logo-2x.png` — 2× enlarged version
- `logos/summer-wordmark-source.png` — transparent crop of original summer logo and business name together
- `logos/summer-wordmark-source-2x.png` — enlarged version
- `reference-crops/` — original crops retaining brochure backgrounds for fidelity checks
- `pamphlet-content.md` — editable brochure transcription (do not embed prices as images)
- `logo-preview-light-dark.png` — simple contrast preview

The user-supplied images are raster pamphlet graphics. Re-exporting at 2× cannot create real vector detail. For a future high-resolution logo, request the original SVG/AI/PDF from the designer. Verify rates and business claims before publishing.

## Generated favicons (Milestone 2.1)

`node scripts/generate-favicons.mjs` (macOS `sips`) proportionally downscales the
native `summer-logo.png` and `winter-logo.png`, then pads square 16/32/64px canvases.
No source is edited, enlarged, redrawn, or recolored. Generated PNGs are in
`public/favicons`; content hashes are recorded in `app/content/favicons.json`.
`public/favicon.ico` wraps the three summer PNG sizes as the default fallback.
No Apple touch artwork or generated business imagery is added.
