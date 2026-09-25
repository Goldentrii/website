# Tong Wu — personal website

English-only personal site at [tongwu.network](https://tongwu.network). It presents Tong's career as a small single-player game: an intro dialog, five "levels" (career chapters), an inventory of shipped work, a quest log (full experience), a skill tree (education and research), achievements (verifiable certificates) and side quests. Designed and coded by Claude (Claude Code) under Tong's direction; credited in the footer.

## Run locally

```sh
python -m http.server 41873 --bind 127.0.0.1
```

Open `http://127.0.0.1:41873`. No build step or package installation is required. (On Windows, some low ports such as 8765 fall in reserved ranges and fail with WinError 10013.)

## Files

- `index.html`: all content and metadata. Semantic HTML; readable as a plain CV without JavaScript.
- `assets/game.css`: layout, palette, sticker cards, motion, responsive breakpoints (1080 / 860 / 600 px) and print styles.
- `assets/game.js`: the game layer — intro dialog, CV/game mode, XP bar, trophies, level unlocks, guide mascot, toasts, confetti, Konami code, legacy hash aliases and the optional GitHub star count.
- `assets/fonts.css`, `assets/fonts/`: self-hosted DM Sans, IBM Plex Mono and Instrument Serif with their SIL Open Font Licenses.
- `assets/logos/`: organization logos (see `docs/content-sources.md`).
- `assets/agentrecall-dashboard.png`: preview from the public AgentRecall repository with example data.
- `assets/tong-wu.jpg`: portrait. `assets/social-card.png`: social sharing image (1200×630), rendered from `docs/social-card.html` with a headless browser; bump the `?v=` on `og:image` when it changes.
- `assets/site.css`, `assets/site.js`, `index-*.html`: previous designs, kept for reference and old links.
- `docs/content-sources.md`: content provenance and editorial decisions.

## Game behavior

- First visit opens the intro `<dialog>`. Start (or backdrop click, or Enter) = game mode; Skip (or Esc) = CV mode, which hides toasts and the guide's speech bubble. Deep links skip the intro.
- `localStorage`: `tw-intro-seen`, `tw-mode` (`game` | `cv`). Nothing else is stored; no analytics.
- XP bar = scroll progress. Trophies = sections visited. Levels unlock in order; scrolling past the map unlocks any remaining ones.
- `prefers-reduced-motion` disables reveals, confetti and decorative animation.
- The only network request besides the page itself is the public GitHub API star count; the badge stays hidden if it fails.

## Deployment

GitHub Pages publishes the root of `main`. `CNAME` retains `tongwu.network`. Publishing is a normal Git push to `main`; no build pipeline, credentials or DNS change is needed.

## Verification (September 2026 redesign)

- Playwright checks at 1440, 900 and 390 CSS px: no horizontal overflow, no page errors, all images load.
- Full game run: intro, mode switch, 8/8 trophies, LV 5, reveals, live star count.
- Visual review of each section on desktop, tablet and mobile.
