# Tong Wu — personal website

English-only personal site at [tongwu.network](https://tongwu.network). One page in normal document flow: a profile summary, five career stops, shipped work, the full role list, education and skills, verifiable certificates, interests and contact. A three.js canvas sits behind the content and draws a space scene (stars, nebulae, three planetary systems, shooting stars); scrolling flies the camera forward through it. Designed and coded by Claude (Claude Code) under Tong's direction; credited in the footer.

## Run locally

```sh
python -m http.server 41873 --bind 127.0.0.1
```

Open `http://127.0.0.1:41873`. Serving the site needs no build step. (On Windows, some low ports such as 8765 fall in reserved ranges and fail with WinError 10013.)

## Files

- `index.html`: all content and metadata. Semantic HTML; fully readable without JavaScript or WebGL.
- `assets/main.css`: palette (deep-space navy, cobalt, chalk, yellow), cards, layout, responsive breakpoints (900 / 860 / 560 px) and print styles.
- `assets/backdrop.js`: built bundle of the background scene plus three.js. Do not edit; rebuild it (see below).
- `assets/fonts/`: self-hosted Barlow and Barlow Condensed (`barlow-OFL.txt`), plus the fonts of earlier designs.
- `assets/logos/`: organization logos (see `docs/content-sources.md`).
- `assets/agentrecall-dashboard.png`: preview from the public AgentRecall repository with example data.
- `assets/tong-wu.jpg`: portrait. `assets/social-card.png`: social sharing image (1200×630), rendered from `docs/social-card.html` with headless Edge or Chrome (`--headless=new --force-device-scale-factor=1 --window-size=1200,630 --screenshot=<out.png> <file URL>`); bump the `?v=` on `og:image` when it changes.
- `draft-3d/`: source and build tooling for the background (`scene-b.src.js`, `package.json`). Draft A, an alternative animation-led layout, also lives there on the author's machine but is gitignored and not published.
- `assets/game.css`, `assets/game.js`: styles and script of the September 2026 game design; its page is kept as a local, gitignored copy (`index-2026-09-25-game.html`), like the other archived homepages. `assets/site.css`, `assets/site.js`, the tracked `index-*.html`: older designs, kept for old links.
- `docs/content-sources.md`: content provenance and editorial decisions.

## Rebuilding the background

Only needed after editing `draft-3d/scene-b.src.js`. The built file is committed, so deployment needs no build.

```sh
cd draft-3d
npm install
npm run build:site
```

## Behavior

- Scroll progress (0 at the top, 1 at the bottom) moves the camera forward through the star field. Stars twinkle, nebulae drift, planets orbit and spin, and a shooting star crosses every few seconds, drawn at about 30 frames a second. Suns, planets and rings use procedural shaders (noise surfaces, lighting from each system's own sun), so there are no texture files. The canvas is `position: fixed`, behind everything, and ignores pointer input.
- `prefers-reduced-motion`: nothing animates on its own; the background redraws only on scroll and resize.
- WebGL missing, context lost for more than 3 seconds, or a frame error: the `no-gl` class hides the canvas and the page falls back to a static navy gradient.
- Nothing is stored in the browser, there are no analytics, and the page makes no third-party requests.
- Editorial rules (owner, 25 Sep 2026): position Tong as data analysis and supply chain, not as an AI builder, and show no performance metrics or star counts.

## Deployment

GitHub Pages publishes the root of `main`. `CNAME` retains `tongwu.network`. Publishing is a normal Git push to `main`; no build pipeline, credentials or DNS change is needed.

## Verification (November 2026 redesign)

- Browser checks at 1280, about 620 and 375 CSS px: no horizontal overflow, no console errors, all local links and images resolve.
- Independent code review of the page, styles and scene source; findings applied.
- Not verified: reduced motion, devices without WebGL, and battery behaviour on real phones.
