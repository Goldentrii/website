// tongwu.network — game layer. Progressive enhancement: without this file the
// page is a complete, readable CV. No framework, no tracking, one optional
// request (public GitHub star count).
(() => {
  "use strict";
  try {
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
    const root = document.documentElement;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const store = {
      get(k) {
        try {
          return localStorage.getItem(k);
        } catch {
          return null;
        }
      },
      set(k, v) {
        try {
          localStorage.setItem(k, v);
        } catch {
          /* private mode: the game just forgets */
        }
      },
    };
    const INTRO_KEY = "tw-intro-seen";
    const MODE_KEY = "tw-mode"; // "game" | "cv"

    // Old URLs from previous versions of the site keep working.
    const HASH_ALIASES = {
      "#experience": "#quests",
      "#path": "#quests",
      "#projects": "#loot",
      "#building": "#loot",
      "#credentials": "#achievements",
      "#focus": "#map",
    };
    const followAlias = () => {
      const alias = HASH_ALIASES[location.hash];
      if (!alias) return;
      try {
        history.replaceState(null, "", alias);
      } catch {
        location.hash = alias; // sandboxed frames block replaceState
        return;
      }
      const target = $(alias);
      if (target) target.scrollIntoView();
    };
    followAlias();
    addEventListener("hashchange", followAlias);

    // ── Guide (Claude) ──
    const guide = $("#guide");
    const bubble = $("#guideBubble");
    const guideBtn = $("#guideBtn");
    let bubbleTimer = 0;

    const ZONE_LINES = {
      player: "That’s Tong. Scroll down — every section is a level.",
      map: "Five levels so far. Each one unlocks as you reach it.",
      loot: "Loot! Things Tong actually shipped. Open one to inspect it.",
      quests: "The full quest log. Short on purpose — details live on LinkedIn.",
      skills: "Economics first, code later. Honestly, a good order.",
      achievements: "Click any badge to verify it. No trust required.",
      side: "Side quests. Even builders need slow hobbies.",
      save: "You finished the game! One quest left: say hi. 👋",
    };
    const CHATTER = [
      "I’m Claude. I wrote every line of this page.",
      "No framework here. Just HTML, CSS and a little JavaScript.",
      "Psst: try ↑ ↑ ↓ ↓ ← → ← → B A.",
      "Tong gave the direction. I did the pixels.",
      "Fun fact: the XP bar is just your scroll position.",
      "Everything here is real work. I checked the receipts.",
    ];
    let chatterIdx = 0;

    const say = (text, ms = 4200) => {
      if (root.classList.contains("cv-mode")) return;
      bubble.textContent = text;
      bubble.classList.add("show");
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => bubble.classList.remove("show"), ms);
    };

    guideBtn.addEventListener("click", () => {
      if (root.classList.contains("cv-mode")) {
        // Clicking the guide in CV mode switches the game back on.
        setMode("game");
        say("Game mode back on. Hi again!");
        return;
      }
      say(CHATTER[chatterIdx++ % CHATTER.length]);
    });

    // ── Toasts ──
    const toasts = $("#toasts");
    const toast = (label, text) => {
      if (root.classList.contains("cv-mode")) return;
      const el = document.createElement("div");
      el.className = "toast";
      const b = document.createElement("b");
      b.textContent = label;
      el.append(b, document.createTextNode(text));
      toasts.append(el);
      // Keep the stack short so it never covers the page.
      while (toasts.children.length > 2) toasts.firstElementChild.remove();
      setTimeout(() => el.remove(), 3000);
    };

    // ── Mode + boot dialog ──
    const boot = $("#boot");
    const setMode = (mode) => {
      root.classList.toggle("cv-mode", mode === "cv");
      store.set(MODE_KEY, mode);
    };

    const closeBoot = (mode) => {
      store.set(INTRO_KEY, "1");
      setMode(mode);
      if (boot.open) boot.close();
      guide.hidden = false;
      if (mode === "game") {
        setTimeout(() => say(ZONE_LINES.player), 450);
      }
    };

    const openBoot = () => {
      if (typeof boot.showModal !== "function") {
        closeBoot("game");
        return;
      }
      if (!boot.open) boot.showModal();
      $("#startGame").focus();
    };

    $("#startGame").addEventListener("click", () => closeBoot("game"));
    $("#skipGame").addEventListener("click", () => closeBoot("cv"));
    // Esc fires "cancel" on a modal dialog: treat it as "skip".
    boot.addEventListener("cancel", (e) => {
      e.preventDefault();
      closeBoot("cv");
    });
    // Click on the backdrop = start (the friendlier default).
    boot.addEventListener("click", (e) => {
      if (e.target === boot) closeBoot("game");
    });
    $("#replayIntro").addEventListener("click", openBoot);

    if (store.get(MODE_KEY) === "cv") root.classList.add("cv-mode");
    const deepLinked = location.hash && location.hash !== "#player";
    if (!store.get(INTRO_KEY) && !deepLinked) {
      openBoot();
    } else {
      guide.hidden = false;
    }

    // ── XP bar ──
    const xpFill = $("#xpFill");
    let xpQueued = false;
    const updateXp = () => {
      xpQueued = false;
      const max = root.scrollHeight - innerHeight;
      const pct = max > 0 ? Math.min(100, (scrollY / max) * 100) : 100;
      xpFill.style.width = pct.toFixed(1) + "%";
    };
    addEventListener(
      "scroll",
      () => {
        if (!xpQueued) {
          xpQueued = true;
          requestAnimationFrame(updateXp);
        }
      },
      { passive: true },
    );
    addEventListener("resize", updateXp, { passive: true });
    updateXp();

    // ── Zones → trophies, guide lines ──
    const zones = $$("[data-zone]");
    const trophyCount = $("#trophyCount");
    const trophyWrap = $(".hud-trophy");
    $("#trophyTotal").textContent = zones.length;
    const zoneOrder = zones.map((z) => z.dataset.zone);
    const visited = new Set();
    let gameDone = false;

    const visitZone = (name) => {
      if (visited.has(name)) return;
      visited.add(name);
      trophyCount.textContent = visited.size;
      trophyWrap.classList.remove("bump");
      void trophyWrap.offsetWidth; // restart the animation
      trophyWrap.classList.add("bump");
      if (ZONE_LINES[name] && !(boot && boot.open)) say(ZONE_LINES[name]);
      // Scrolled (or deep-linked) past the map without it registering: catch up.
      let pending = 0;
      if (zoneOrder.indexOf(name) > zoneOrder.indexOf("map")) {
        const locked = $$("[data-level]").filter((li) => !unlocked.has(Number(li.dataset.level)));
        pending = locked.length;
        locked.forEach((li, i) => setTimeout(() => unlockLevel(li), i * 180));
      }
      if (name === "save" && !gameDone) {
        gameDone = true;
        // Wait for any catch-up level toasts so this one is not pushed out.
        setTimeout(() => {
          const all = visited.size === zones.length;
          toast("★ " + visited.size + "/" + zones.length, all ? " game complete — thanks for playing" : " you reached the end — thanks for playing");
          confetti();
        }, pending * 180 + 200);
      }
    };

    // ── Levels → unlock + LV ──
    const hudLevel = $("#hudLevel");
    const unlocked = new Set();
    const unlockLevel = (li) => {
      const n = Number(li.dataset.level);
      if (unlocked.has(n)) return;
      unlocked.add(n);
      li.classList.add("unlocked");
      hudLevel.textContent = "LV " + Math.max(...unlocked);
      const world = $(".level-world", li);
      toast("LV " + n, " unlocked · " + (world ? (world.textContent.split("·")[1] ?? "").trim() : ""));
    };

    // ── Reveal-on-scroll for cards ──
    const revealables = $$(".level-card, .item, .quest, .edu-card, .badge, .side-item, .stat");
    if (!reduceMotion) revealables.forEach((el) => el.setAttribute("data-reveal", ""));

    if ("IntersectionObserver" in window) {
      const zoneObs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) visitZone(e.target.dataset.zone);
        },
        // A zone counts once it fills the middle band of the viewport.
        { rootMargin: "-35% 0px -35% 0px" },
      );
      zones.forEach((z) => zoneObs.observe(z));

      const levelObs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            // Unlock in order so the path fills left → right.
            const n = Number(e.target.dataset.level);
            $$("[data-level]")
              .filter((li) => Number(li.dataset.level) <= n)
              .forEach((li, i) => setTimeout(() => unlockLevel(li), i * 180));
            levelObs.unobserve(e.target);
          }
        },
        { threshold: 0.55 },
      );
      $$("[data-level]").forEach((li) => levelObs.observe(li));

      const revealObs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const el = e.target;
            el.classList.add("in");
            revealObs.unobserve(el);
            // Hand the element back to its own hover transitions once revealed.
            setTimeout(() => el.removeAttribute("data-reveal"), 700);
          }
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      revealables.forEach((el) => revealObs.observe(el));

      const sheet = $(".sheet");
      const sheetObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          sheet.classList.add("ready");
          sheetObs.disconnect();
        }
      });
      sheetObs.observe(sheet);
    } else {
      zones.forEach((z) => visitZone(z.dataset.zone));
      $$("[data-level]").forEach(unlockLevel);
      revealables.forEach((el) => el.classList.add("in"));
      $(".sheet").classList.add("ready");
    }

    // ── Confetti ──
    function confetti() {
      if (reduceMotion) return;
      const colors = ["#e65b39", "#d97757", "#e8b93a", "#3f8a5b", "#2f6fb0", "#272721"];
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 70; i++) {
        const p = document.createElement("i");
        p.className = "confetti";
        p.style.left = Math.random() * 100 + "vw";
        p.style.background = colors[i % colors.length];
        p.style.setProperty("--dx", (Math.random() * 200 - 100).toFixed(0) + "px");
        p.style.setProperty("--rot", (Math.random() * 900 - 450).toFixed(0) + "deg");
        p.style.animationDuration = (1.8 + Math.random() * 1.8).toFixed(2) + "s";
        p.style.animationDelay = (Math.random() * 0.4).toFixed(2) + "s";
        frag.append(p);
        setTimeout(() => p.remove(), 4800);
      }
      document.body.append(frag);
    }

    // ── Konami code ──
    const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let kPos = 0;
    addEventListener("keydown", (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      kPos = key === KONAMI[kPos] ? kPos + 1 : key === KONAMI[0] ? 1 : 0;
      if (kPos < KONAMI.length) return;
      kPos = 0;
      guide.hidden = false;
      if (root.classList.contains("cv-mode")) setMode("game");
      guide.classList.remove("dance");
      void guide.offsetWidth;
      guide.classList.add("dance");
      toast("+30 lives", " cheat code accepted");
      say("You found the secret. Tong owes you a tea. 🍵", 6000);
      confetti();
    });

    // ── Live GitHub stars (hidden unless the request succeeds) ──
    $$(".stars[data-repo]").forEach((el) => {
      const repo = el.dataset.repo;
      if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) return;
      fetch("https://api.github.com/repos/" + repo, { headers: { Accept: "application/vnd.github+json" } })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((d) => {
          if (typeof d.stargazers_count !== "number" || d.stargazers_count < 1) return;
          $("b", el).textContent = d.stargazers_count.toLocaleString("en");
          el.hidden = false;
        })
        .catch(() => {
          /* offline or rate-limited: keep the badge hidden */
        });
    });
  } catch (err) {
    console.error("game layer disabled:", err);
    // Any failure falls back to the plain CV: drop the JS-gated states.
    const boot = document.getElementById("boot");
    if (boot && boot.open) boot.close();
    document.documentElement.classList.remove("js", "cv-mode");
  }
})();
