# Tong Wu — personal website

Bilingual personal portfolio at [tongwu.network](https://tongwu.network). The site presents AI product work, agent infrastructure, and operational experience in one narrative.

## Run locally

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765`. No build step or package installation is required.

## Edit

- `index.html`: semantic HTML, English/Chinese copy, project evidence, experience and metadata.
- `assets/site.css`: responsive layouts, colors, typography, motion and print styles.
- `assets/site.js`: language preference and legacy anchor aliases. Content and native disclosures remain usable without JavaScript.
- `assets/fonts.css`, `assets/fonts/`: self-hosted Google Fonts and their SIL Open Font Licenses.
- `assets/agentrecall-dashboard.png`: preview from the public AgentRecall repository; its example figures are not portfolio performance claims.
- `assets/tong-wu.jpg`: original color portrait.
- `assets/logos/`: organization logos sourced from their official websites.
- The homepage highlights project management, product growth and FDE, followed by the expanded project catalogue, nine career entries, two degrees and seven certificate records.
- `assets/social-card.png`: social sharing image.
- `docs/content-sources.md`: content provenance and editorial decisions.

English and Chinese copy use `.en` and `.zh` spans. Update both when changing facts. Keep the dated GitHub count explicit; do not turn historical counts into undated live metrics.

## Deployment

GitHub Pages publishes the root of `main`. `CNAME` retains `tongwu.network`. Publishing is a normal fast-forward Git push to `main`; no new hosting service, credentials, DNS change, or build pipeline is needed.

Previous HTML designs, research papers and the historical operations demo remain at their existing URLs. Git history is the source for rolling back the homepage.

## Verification

For the September 2026 redesign:

- Desktop and mobile visual review, including Chinese typography.
- Both languages checked at 320, 390, 768 and 1440 CSS pixels; no document-level horizontal overflow.
- Language toggle, persisted preference, native project disclosure and navigation checked in the browser.
- Local images, font files, relative links and section targets validated.
- JavaScript syntax and formatting checked.
- Reduced-motion and no-JavaScript fallbacks are included in the implementation.
