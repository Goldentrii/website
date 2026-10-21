# tongwu.network — shared content brief (v1, 2026-08-02)

This is the single source of truth for facts and copy. **Do not invent numbers, projects, or claims not listed here.** If a design needs a piece of copy not covered below, write something consistent in tone but do not add unverified stats (star counts, install counts, revenue, client names).

Person: **Tong Wu 吴桐**. Pronouns: he/him.

---

## 0. Round-3 corrections (2026-08-02) — applied to `06-flow-synthesis`, carry forward to any future round

- **De-emphasize the name.** It's not the important thing — hero name should read as a small byline, not the dominant headline. Visual weight goes to capability chips + tagline instead.
- **Don't frame the hero as AI-only.** He is equally strong in logistics/supply chain, program/project management, and process excellence — the AI side is one pillar, not the whole identity.
- **Capability chunks (new hero element):** a chip row, Project Management given lead/largest emphasis ("most importantly"), plus: AI Automation, Supply Chain, Logistics, Last-Mile Delivery, Process Excellence, Multilingual (CN/EN/DE), EU Work Authorization ("license" → EU Blue Card), Team Leadership/100+ FTE ("FTE" → the 100+ associates directed at Amazon), Cross-Border/4 Countries ("traverse").
- **About section ("cross-domain throughline"):** lead with a visualization (a table: Domain | Where | Focus), not paragraphs. Prose still exists but demoted to a `<details>` disclosure for people who want to read more.
- **Education reframe:** M.Sc. Economics and Finance, but the real content was informatics-leaning — computational economics, machine learning, programming — not a plain finance degree. Say this explicitly everywhere education is mentioned.
- **Drop "key accounts" (Deutsche Telekom / Vodafone) naming** from the website specifically — didn't land well, remove it. This is a website-only correction; the job-application CVs elsewhere are a different artifact/audience and are unaffected.
- Building/Products section, Skills section, Certifications: confirmed good as-is, no changes needed.

## 0b. Round-4 corrections (2026-08-02)

- **Hide the phone number entirely.** Don't display it anywhere on the site. Email + LinkedIn + GitHub + location is the contact set.
- **Email should not be an oversized display headline.** Normal text size, still styled as a clickable link (`.link-live` treatment), just not a giant serif hero number.
- **Capability chips are square, not rounded pills.** `border-radius:0`, plus a small square accent-color marker before each label (not a circle — circles are reserved for real clickable links elsewhere on the page, squares signal "capability tag, not a link"). This is a deliberate personalization, not a generic tag-cloud/pill look.

## 0c. Round-5 corrections (2026-08-02) — real credential links found, off-screen fixed

- **Certificates now have real, verified links.** `Zertifizierungen .pdf` in the site repo contains all 5 Coursera certificates with live verification URLs — use these, not plain text:
  - Six Sigma Green Belt → `https://coursera.org/verify/specialization/KNWJNBULCLQP` (Jan 2026, Kennesaw State via Coursera)
  - CBAP → `https://coursera.org/verify/specialization/TEUB5MSCKJXA` (Apr 2024, IIBA/Starweaver via Coursera)
  - Machine Learning → `https://coursera.org/verify/specialization/I3MUOU9SX4AC` (Apr 2025, DeepLearning.AI/Stanford/Andrew Ng via Coursera)
  - Google Data Analytics → `https://coursera.org/verify/professional-cert/QQAPTETGCP4S` (Apr 2023)
  - Google IT Automation with Python → `https://coursera.org/verify/professional-cert/GAAH338HGUG5` (Jun 2023)
- **Master's Thesis and Seminar Paper are real files, already in the site repo** — renamed for clean URLs and linked: `masters-thesis-tongwu.pdf` (was `Master's Thesis _ Tong_Wu_5163957.pdf`) and `seminar-paper-gpt-ecosystem.pdf` — "The Rise of the GPT Ecosystem" (was `Big change! Not big enough. The rise of the GPT ecosystem-TongWu, Final.pdf`). Both served directly from the site's own domain once deployed.
- **Certifications + Academic Work presented as small square cards** (`.cred-card`) in the Skills section specifically — by explicit request, this is one deliberate exception to the "no big cards" rule elsewhere on the page.
- **Off-screen list correction:** remove "Tea ceremony" (never did it — was a fabrication carried over from an earlier site version, now fixed). Add Surfing and Skiing. Keep I Ching, Calligraphy, Hiking, Learning Japanese.

---

## 1. Hero

**Identity (primary):** Co-founder & builder, Novada Labs — AI agent infrastructure (RAG, multi-agent orchestration, MCP) that ships to production, not demos.

**One-liner (EN):** I build the AI systems and process discipline that turn proof-of-concept into production.
**一句话 (中文):** 我做能真正落地生产的 AI 系统与流程能力——从概念验证到稳定运行。

**Sub-line (EN):** Co-founder, Novada Labs. Previously: supply-chain & process excellence at Xiaomi, Amazon, Huawei. Econ/Finance → Supply Chain → AI, in that order.
**副标题 (中文):** Novada Labs 联合创始人。此前历经小米、亚马逊、华为的供应链与流程管理。从经济金融，到供应链，再到 AI 系统。

**Stat tiles (verified facts, use as-is):**
- AgentRecall — 313★ on GitHub, 6,400+ installs/month
- 6 published production npm/PyPI packages (Novada MCP, Novada Proxy MCP, AgentRecall family, etc.)
- 3 languages — Chinese (native), English (C2), German (C1)
- 4 countries lived/worked — China, USA (internship), Germany, (EU-wide client work)

**Location / availability line:** Düsseldorf, Germany · EU Blue Card holder — open to select conversations, not actively job-hunting.

**Primary CTA:** Email (tongwu0824@gmail.com) or LinkedIn.
**Secondary CTA:** GitHub (Goldentrii) / View résumé.

---

## 2. About — the cross-domain throughline

**EN (short, ~80 words):**
My path doesn't run in a straight line, and that's the point. I started in Economics & Finance (M.Sc., University of Freiburg), moved into supply-chain and process-excellence roles at Huawei, Xiaomi and Amazon — running KPI systems, root-cause analysis and enterprise account delivery for Deutsche Telekom and Vodafone — and I now co-found and build Novada Labs, where I ship the AI agent infrastructure (RAG memory, multi-agent orchestration, MCP integrations) that companies actually run in production. Every domain shift kept the same instinct: measure it, fix the root cause, then automate it.

**中文 (简短版):**
我的路径不是直线，这正是重点。我从经济金融出发（弗莱堡大学硕士），做过华为、小米、亚马逊的供应链与流程卓越工作——搭建 KPI 体系、根因分析、服务德国电信和沃达丰这样的企业大客户——现在联合创办 Novada Labs，打造真正跑在生产环境里的 AI Agent 基础设施（RAG 记忆系统、多智能体编排、MCP 集成）。每一次跨界都保留了同一个本能：先量化，再找根因，然后自动化。

**Longer variant (for designs with more room, EN):**
I hold an M.Sc. in Economics & Finance from the University of Freiburg, where I also taught and ran behavioral/game-theoretic experiments as a research assistant. From there I moved into operations: EU compliance work at Huawei, an enterprise KPI-and-delivery platform at Xiaomi serving Deutsche Telekom and Vodafone (~€110M/yr fulfilment, 99.5% on-time), and process-excellence work at an Amazon delivery station (16 carrier accounts, 100+ KPIs, structured RCA). Today I co-found Novada Labs, where I design and ship the agent infrastructure — memory systems, orchestration frameworks, MCP servers — that other builders use to take AI from proof-of-concept to something that survives contact with a real business process.

---

## 3. Building — flagship products (Novada Labs)

Use exactly these five, in this order of prominence. Do not add others.

1. **AgentRecall** — Correction-first memory system for AI agents (RAG: embeddings, vector retrieval, RRF fusion). 313 GitHub stars, 6,400+ installs/month. The flagship.
   - EN one-liner: "Persistent memory for AI agents — so corrections actually stick."
   - 中文: "为 AI Agent 打造的持久记忆系统——让纠正真正被记住。"

2. **AAM (Agent Autonomous Mode)** — Multi-agent orchestration framework: orchestrator → parallel workers → independent reviewer → verifier, with guardrails and human-in-the-loop checkpoints.
   - EN: "Orchestration for autonomous agent teams — with a reviewer that isn't the author."
   - 中文: "多智能体编排框架——审阅者永远不是执行者本人。"

3. **Plywood Protocol** — Natural-language-to-pseudocode compiler for workflow automation, validated via a blinded randomized controlled trial.
   - EN: "Turns plain-language instructions into executable SOPs — validated, not just claimed."
   - 中文: "把自然语言指令编译成可执行的标准作业流程——经过盲测验证，不是自吹。"

4. **Novada MCP** — MCP server exposing 40+ tools across 13 platforms, connecting AI agents to real-world APIs and data.
   - EN: "40+ tools, 13 platforms, one MCP server — the integration layer AI agents actually need."
   - 中文: "40+ 工具、覆盖 13 个平台的 MCP 服务器——AI Agent 真正需要的集成层。"

5. **Novada Proxy MCP** — Residential-proxy MCP for agent-driven web access, 464 automated tests.
   - EN: "Reliable web access for agents, backed by 464 automated tests."
   - 中文: "为 Agent 提供稳定的网络访问能力，464 个自动化测试兜底。"

**Optional 6th card (personal/exploratory, use only if a design has room and wants a "personal projects" sub-section — label it clearly as personal, not a Novada product):**
- **TchinTalk (栖音)** — a local-first macOS dictation app, built as a personal side project exploring on-device speech + AI.
  - EN: "A personal experiment in local-first, privacy-respecting dictation."
  - 中文: "一个探索本地优先、隐私友好听写体验的个人项目。"

---

## 4. Path — career timeline (reverse chronological, all real, all verified)

| When | Where | Role | One-line context |
|---|---|---|---|
| Mar 2026 – Present | Novada Labs, Frankfurt/Remote | Co-founder & AI Automation/Infrastructure Engineer | Built & ships AgentRecall, AAM, Plywood, Novada MCP, Novada Proxy MCP; owns the technology function end-to-end. |
| Sep 2025 – Jan 2026 | Amazon, Hamburg (DHH2) | Process Excellence Manager | Ran KPI analysis (100+ metrics) and RCA across 16 delivery-carrier accounts; 99.5% quality, 100% safety compliance. |
| Jun 2024 – Aug 2025 | Xiaomi Technology, Düsseldorf | Supply Chain Delivery Manager | Main point of contact for Deutsche Telekom & Vodafone; built a company-wide KPI/exception-management platform; ~€110M/yr fulfilment at 99.5% on-time. |
| Dec 2023 – Jun 2024 | Huawei, Düsseldorf | EU Certification / Quality Specialist | Managed ISO 9001/14001/45001 compliance across labs, notified bodies and product teams, in three languages. |
| Oct 2022 – Feb 2024 | University of Freiburg | Graduate Teaching & Research Assistant | Taught Finance/Macroeconomics; ran behavioral/game-theoretic experiments at FRIBIS. |
| Oct 2020 – Nov 2023 | University of Freiburg | M.Sc. Economics and Finance | Computational Economics, Econometrics, Time-Series Analysis. Seminar: LangChain + Pinecone RAG assistant (2023) — his first retrieval build. Outstanding Student Representative, commencement speaker. |
| 2018 – 2020 | Arshine Pharmaceutical, Changsha & SEG Automotive, China | Project Management / Business Intern | Overseas B2B client development, cross-border logistics, SAP procurement. |
| Sep 2014 – Jun 2018 | Jishou University, China | B.A. Business English (International Trade & Business) | Foundation in international trade & economics. |

---

## 5. Skills

**AI & Agent Engineering:** RAG (embeddings, vector retrieval, RRF) · Multi-agent orchestration · MCP (server/client) · LLM integration (Claude API, OpenAI) · Evals & benchmarking · Guardrails / quality measurement · Python · TypeScript · PostgreSQL · Docker/CI-CD

**Process & Operations Excellence:** Lean · Six Sigma (Green Belt, full specialization) · Root-cause analysis · KPI design & monitoring · Requirements engineering · Enterprise/key-account management · ISO 9001/14001/45001

**Certifications:** Six Sigma Green Belt · Certified Business Analysis Professional (CBAP) · Google Data Analytics · Google IT Automation with Python

**Languages:** Chinese (Native) · English (C2) · German (C1)

---

## 6. Off-screen — personal (humanizing section, keep as-is from prior site, all real)

I Ching (易经) study · tea ceremony (茶道) · calligraphy (书法) · hiking · learning Japanese

**EN framing line:** "What I read, brew, and practice when I'm not shipping."
**中文:** "不写代码的时候，我在读、在泡茶、在写字。"

---

## 7. Contact

- Email: tongwu0824@gmail.com
- Phone: [phone removed] (optional to display — designer's call whether to show publicly)
- LinkedIn: linkedin.com/in/tongwu3
- GitHub: github.com/Goldentrii
- Location: Düsseldorf, NRW, Germany
- Status line: EU Blue Card holder · open to interesting conversations, not actively job-hunting

---

## 8. Verified real links (v2 addendum, 2026-08-02) — use these exact URLs, nothing else

Live-checked today via GitHub/npm APIs. **Only link what's in this table.** Anything not here (AAM repo, Plywood repo, thesis PDF, certification badges) has no verified public URL — present it as plain text, not a link, or use the fallback noted.

| Item | URL | Verified fact | Notes |
|---|---|---|---|
| AgentRecall (flagship) | `https://github.com/Goldentrii/AgentRecall-X` | 310★ public repo (live-checked, supersedes the 313★ figure elsewhere — use 310★ here) | Primary "view the code" link |
| Novada MCP | `https://www.npmjs.com/package/novada-mcp` | Real npm package, latest 0.9.33 (live-checked via npm registry) | Link to npm, NOT the GitHub source — see privacy note below |
| Novada Proxy MCP | `https://github.com/NovadaLabs/novada-proxy` | Public repo, matches description ("residential proxy MCP... bypass Cloudflare") | |
| GitHub profile | `https://github.com/Goldentrii` | 12 public repos, live-checked | |
| Site source | `https://github.com/Goldentrii/website` | The repo this very site is built from ("about myself") | Nice engineer-to-engineer touch, optional |
| LinkedIn | `https://linkedin.com/in/tongwu3` | As given in all prior CVs | |
| Email | `mailto:tongwu0824@gmail.com` | | |
| AAM | *(no link)* | Repo not confirmed public as of this check | Present as text only, or "npm package in progress" — do not link |
| Plywood Protocol | *(no link)* | Confirmed internal/closed-source | Present as text only — this is consistent with how the current live site already (correctly) handles it; don't invent a repo link |
| Master's thesis / seminar RAG project | *(no link)* | No confirmed public repo found for the LangChain+Pinecone seminar project | Mention in prose (About/Path), don't fabricate a link. If tongwu provides a real repo/PDF URL later, wire it in then |
| Certifications (Six Sigma, CBAP, Google) | *(no link)* | No verified public badge/verification URLs on file | Present as plain credential text, not fake-linked buttons |

**⚠️ Flag, don't silently resolve:** memory notes that `NovadaLabs/Novada-mcp` (the GitHub *source* monorepo, capital N) was flagged as "should be private" after a prior incident (leak reference NOV-809), even though it currently shows as public. Because of that unresolved flag, **do not link the raw GitHub source repo** for Novada MCP — link the npm package page instead (see table above). This was a judgment call, not a user instruction — mention it back to the user so they can override if the concern is already resolved.

---

## 9. Design synthesis brief (round 2) — "water flow" merge

The user reviewed designs 01–05 and wants ONE new synthesis, not another isolated exploration. Read `03-dashboard/index.html`, `04-minimalist/index.html`, and `05-bold-grid/index.html` in this same directory directly — study their actual code, don't rely on descriptions — then build something new that takes real, specific inspiration from each:

- **From 03 (dashboard):** the visual *richness* — real stat/KPI treatments, a sense that "a lot has been built here," data made visible rather than just claimed. Bring that density of visualization forward.
- **From 04 (minimalist):** the *flow* — content reads as one continuous thing, not disconnected boxes.
- **From 05 (bold grid):** permission to be *non-standard* — this does not need to look like a conventional stacked-section resume page. Asymmetry, scale contrast, and confident visual moments are welcome.

**The explicit brief from tongwu himself (verbatim intent, translate into design):**
- **No cards.** Whatever visual richness 03 had, re-express it without boxed/bordered card containers. Sections should feel like continuous terrain, full-bleed, not tiled panels.
- **"Water flow"**: the page should feel like a current the visitor can float down — organic, connected, not rigid grid boxes. Consider an actual visual thread/line/gradient-river motif connecting sections top to bottom (subtle, not gimmicky) as a literal expression of "water flow," if it can be done tastefully.
- **Two navigation modes, both real:**
  1. A persistent way to jump directly to ANY section (e.g. a slim side-rail nav with section dots/labels, or a fixed minimal top nav) — visitor goes wherever they want.
  2. A "next" affordance at the end of each section (e.g. a down-arrow / "continue" cue) for a visitor who just wants to keep scrolling/clicking through linearly and absorb everything in order.
  - Both must coexist — this is not either/or.
- **Progressive disclosure — "if they want more, they click more."** Default view per section is concise/scannable. Deeper material (longer About paragraph, full project detail, full timeline detail) sits behind an explicit expand/"read more" interaction, not deleted, not dumped all at once.
- **Clickable links must be highlighted, not buried.** Every real link in section 8 above should look and behave like an obviously interactive element — real hover/focus states, real visual weight (don't rely on default blue-underline browser styling, but don't hide the fact that it's clickable either). This is the single most important thing per tongwu's own words: make it unmistakable what's clickable, and make clicking it easy and inviting.
- Keep the bilingual EN/中文 toggle and all other hard rules from section "Hard rules" below.

Output target for this round: `/Users/tongwu/Projects/tongwu-website-redesign/06-flow-synthesis/index.html`

---

## Hard rules for every design

1. Do not fabricate stats. Only use numbers from this file.
2. Do not claim client names or revenue figures beyond what's listed (Deutsche Telekom, Vodafone are real and fine to name — they were named accounts on real projects).
3. Founder framing is real and should be present (co-founder, Novada Labs) — don't undersell it, don't inflate it into "CEO" (his co-founder Ethan is CEO; Tong is the technical co-founder/builder).
4. Bilingual EN/中文 is a signature of this site — implement a lang toggle (persist choice in localStorage) using the EN/中文 copy given above at minimum for Hero, About (short version), section headers, and Off-screen. Where Chinese copy isn't provided for a specific line, English-only is fine.
5. Self-contained: one static `index.html` per design, inline `<style>`/`<script>`, Google Fonts via CDN link is fine, no build step, no framework, no external JS libraries unless CDN-linked and essential.
6. Favicon: reuse the inline SVG "吴" monogram idea from the previous site, or design your own simple one — no broken asset references.
7. Include `prefers-reduced-motion` support if the design uses any animation.
8. This is a LOCAL PREVIEW ONLY. Do not add deploy scripts, do not reference GitHub Pages push, do not add analytics/tracking scripts.
