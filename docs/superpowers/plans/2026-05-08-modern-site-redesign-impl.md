# WiGa Modern Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand the catalog as **WiGa**, add a four-section top navigation (Single Player, Multi-Player, High Scores, Donate) with shared chrome across four pages, a kid-friendly pastel hero on the home page, and ship the first multi-player game (*Memory Match Duel* — pass-and-play turn-taking).

**Architecture:** Multi-page static site, no build step. Shared chrome (header, nav, footer, hero, palette tokens) lives in two new files: `assets/site.css` and `assets/site.js`. Each chrome page (`index.html`, `multiplayer.html`, `high-scores.html`, `donate.html`) duplicates the header/footer markup but references the shared assets. The active nav link is marked at runtime by `site.js` based on `location.pathname`. Game pages are unchanged. *Memory Match Duel* is a new fully-self-contained game forked from `games/memory-match.html`.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla ES2015+ JavaScript, inline SVG. No frameworks, no package manager, no build, no third-party runtime deps beyond the existing `zoomy-car` Three.js CDN import.

---

## Reference

- Spec: `docs/superpowers/specs/2026-05-08-modern-site-redesign-design.md`
- Project rules: `CLAUDE.md`
- Source to fork for the duel: `games/memory-match.html`
- Shared high-score helper: `games/high-scores.js` (unchanged — reused by `high-scores.html`)

## Verification model

The project has no test suite (per `CLAUDE.md`). Each task ends with a **manual smoke check** in a browser served by `./run.sh`. To run any verification:

```bash
cd /Users/dio/works/chun-games
./run.sh 8000
# In a browser, visit http://localhost:8000/<page>
```

Reload after every save. Check the DevTools console for errors after each task — there should be none.

## DOM hygiene

The new chrome pages and the duel game never call `innerHTML` or `insertAdjacentHTML`. All dynamic DOM updates use `textContent`, `createElement`, `appendChild`, `replaceChildren`, and `setAttribute`. Inline SVGs in the static HTML are fine (they ship with the document, not constructed from strings).

## Canonical games list

The single-player catalog order, used on `index.html` and `high-scores.html`. Preserve this exact ordering in both places:

```js
const SINGLE_PLAYER_GAMES = [
  { id: "type2build",      name: "Type2Build",            scoreLabel: "pts" },
  { id: "zoomy-car",       name: "Zoomy Cars",            scoreLabel: "pts" },
  { id: "child-feeder",    name: "Child Feeder",          scoreLabel: "pts" },
  { id: "dragon",          name: "Dragon Eating Cheese",  scoreLabel: "pts" },
  { id: "car-memory",      name: "Car Memory",            scoreLabel: "pts" },
  { id: "engine-memory",   name: "Engine Memory",         scoreLabel: "pts" },
  { id: "pit-stop-crew",   name: "Pit Stop Crew",         scoreLabel: "rounds" },
  { id: "memory-match",    name: "Memory Match Cards",    scoreLabel: "pts" },
  { id: "guess-who",       name: "Guess Who Detective",   scoreLabel: "pts" },
  { id: "tangram-puzzles", name: "Tangram Puzzles",       scoreLabel: "pts" },
];
```

## File structure summary

```
/Users/dio/works/chun-games/
├── index.html                                          ← Task 5 (heavy modify)
├── multiplayer.html                                    ← Task 3 (NEW)
├── high-scores.html                                    ← Task 4 (NEW)
├── donate.html                                         ← Task 2 (NEW)
├── README.md                                           ← Task 8 (modify)
├── assets/                                             ← NEW directory
│   ├── site.css                                        ← Task 1 (NEW)
│   └── site.js                                         ← Task 1 (NEW)
└── games/
    ├── memory-match-duel.html                          ← Tasks 6-7 (NEW)
    ├── high-scores.js                                  ← unchanged
    ├── memory-match.html                               ← unchanged (fork source)
    └── <existing>.html                                 ← unchanged
```

---

## Task 1: Create shared chrome assets (`site.css` + `site.js`)

**Files:**
- Create: `/Users/dio/works/chun-games/assets/site.css`
- Create: `/Users/dio/works/chun-games/assets/site.js`

This task ships the entire shared chrome stylesheet plus the active-nav helper. The CSS includes palette tokens, body/typography baseline, sticky header + 4-pill nav, footer, page-title block, hero band, and a shared card-grid style used by every chrome page (so the home grid, multiplayer grid, etc. all look identical).

The CSS does not yet have any consumer — verification at the end of this task is just "no syntax errors when loaded by a smoke-test page". The first real consumer is `donate.html` in Task 2.

- [ ] **Step 1: Create the assets directory and `site.css`**

Create `/Users/dio/works/chun-games/assets/site.css` with this content:

```css
/* ===== WiGa shared site chrome ===== */
/* Loaded by index.html, multiplayer.html, high-scores.html, donate.html */
/* Game pages keep their own self-contained styles. */

:root {
  --bg: #fff8f0;
  --bg-end: #d6f0ff;
  --mint: #b8e8d4;
  --mint-ink: #2f6b54;
  --peach: #ffd6b3;
  --peach-ink: #8a4f1d;
  --sky: #a4d8f5;
  --butter: #fff2a6;
  --coral: #ffb3c1;
  --coral-ink: #b13a55;
  --ink: #2a2a3a;
  --ink-soft: #5b6072;
  --card: #ffffff;
  --outline: rgba(42, 42, 58, 0.18);
  --shadow: 0 6px 18px rgba(15, 23, 42, 0.10);
  --shadow-lg: 0 12px 26px rgba(15, 23, 42, 0.16);
  --inset: inset 0 1px 0 rgba(255, 255, 255, 0.7);
  --radius-card: 24px;
  --radius-btn: 16px;
  --radius-pill: 999px;
  --font-rounded: "SF Pro Rounded", "Avenir Next", "Quicksand",
                  system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

html, body {
  margin: 0;
  font-family: var(--font-rounded);
  color: var(--ink);
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg-end) 100%);
  min-height: 100vh;
}
@supports (height: 100dvh) {
  html, body { min-height: 100dvh; }
}
body {
  display: flex;
  flex-direction: column;
}

a { color: inherit; }

/* ===== Sticky header + nav ===== */

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--bg);
  border-bottom: 1px solid var(--coral);
  backdrop-filter: saturate(140%) blur(6px);
}
.site-header__inner {
  max-width: 1040px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.site-logo {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  font-weight: 800;
  font-size: clamp(20px, 4vw, 26px);
  text-decoration: none;
  letter-spacing: 0.01em;
}
.site-logo__sub {
  display: none;
  font-weight: 600;
  font-size: 14px;
  color: var(--ink-soft);
  letter-spacing: 0.02em;
}
@media (min-width: 768px) {
  .site-logo__sub { display: inline; }
}
.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.site-nav__link {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: transparent;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  border: 2px solid transparent;
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
}
.site-nav__link:hover,
.site-nav__link:focus-visible {
  background: var(--peach);
  outline: none;
}
.site-nav__link.is-active {
  background: var(--mint);
  border-color: var(--mint-ink);
  color: var(--mint-ink);
}

/* ===== Page main + content container ===== */

.site-main {
  flex: 1 1 auto;
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: 20px 16px 48px;
}

/* ===== Hero band (only on index.html) ===== */

.hero {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  align-items: center;
  background: var(--card);
  border: 3px solid var(--mint);
  border-radius: var(--radius-card);
  padding: 24px;
  margin: 12px 0 28px;
  box-shadow: var(--shadow), var(--inset);
}
@media (min-width: 768px) {
  .hero { grid-template-columns: 1.1fr 1fr; padding: 32px; gap: 32px; }
}
.hero__eyebrow {
  display: inline-block;
  font-size: 14px;
  font-weight: 700;
  color: var(--coral-ink);
  background: var(--butter);
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  margin-bottom: 10px;
}
.hero__title {
  margin: 0 0 8px;
  font-size: clamp(38px, 9vw, 64px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.01em;
}
.hero__tagline {
  margin: 0 0 20px;
  font-size: clamp(15px, 3.4vw, 19px);
  color: var(--ink-soft);
  line-height: 1.45;
}
.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.hero__art {
  width: 100%;
  height: auto;
  display: block;
}

/* ===== Buttons ===== */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 22px;
  border-radius: var(--radius-btn);
  border: 2px solid var(--ink);
  background: var(--card);
  color: var(--ink);
  font: inherit;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: transform 120ms ease, box-shadow 140ms ease, background 140ms ease;
}
.btn:hover { background: var(--butter); }
.btn:active { transform: translateY(1px); box-shadow: 0 3px 8px rgba(15,23,42,0.12); }
.btn--mint { background: var(--mint); }
.btn--peach { background: var(--peach); }
.btn--coral { background: var(--coral); border-color: var(--coral-ink); color: var(--coral-ink); }
.btn--coral:hover { background: #ffa1b3; }
.btn--lg { padding: 14px 26px; font-size: 18px; }

/* ===== Page title block (used by multiplayer / high-scores / donate) ===== */

.page-title {
  text-align: center;
  margin: 8px 0 24px;
}
.page-title__heading {
  margin: 0 0 6px;
  font-size: clamp(30px, 7vw, 46px);
  font-weight: 800;
  line-height: 1.1;
}
.page-title__sub {
  margin: 0;
  font-size: clamp(14px, 3.4vw, 18px);
  color: var(--ink-soft);
}

.section-heading {
  font-size: clamp(22px, 5vw, 28px);
  font-weight: 800;
  margin: 8px 0 16px;
}

/* ===== Card grid (shared by index.html and multiplayer.html) ===== */

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}
.card {
  background: var(--card);
  border: 3px solid var(--mint);
  border-radius: var(--radius-card);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow), var(--inset);
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg), var(--inset);
}
.card--placeholder {
  border-style: dashed;
  border-color: var(--outline);
  background: rgba(255, 255, 255, 0.5);
  align-items: center;
  justify-content: center;
  min-height: 280px;
  text-align: center;
  padding: 24px;
  color: var(--ink-soft);
  font-weight: 700;
  font-size: 16px;
  box-shadow: none;
}
.card--placeholder:hover { transform: none; box-shadow: none; }

.card__thumb-link {
  display: block;
  line-height: 0;
}
.card__thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: block;
}
.card__body {
  padding: 14px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.card__title {
  margin: 0;
  font-size: clamp(18px, 4vw, 22px);
  font-weight: 800;
}
.card__desc {
  margin: 0;
  flex: 1;
  color: var(--ink-soft);
  font-size: clamp(13px, 3vw, 15px);
  line-height: 1.45;
}
.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 11px;
  color: var(--ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
}
.card__tag {
  background: var(--butter);
  padding: 3px 9px;
  border-radius: var(--radius-pill);
}
.card__play {
  align-self: flex-start;
  margin-top: 4px;
  padding: 8px 16px;
  border-radius: var(--radius-pill);
  background: var(--coral);
  color: var(--coral-ink);
  font-weight: 800;
  text-decoration: none;
  border: 2px solid var(--coral-ink);
}
.card__play:hover { background: #ffa1b3; }

/* ===== Footer ===== */

.site-footer {
  width: 100%;
  margin-top: auto;
  border-top: 1px solid var(--coral);
}
.site-footer__inner {
  max-width: 1040px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--ink-soft);
}
.site-footer__links {
  display: flex;
  gap: 16px;
}
.site-footer__links a {
  color: var(--ink-soft);
  text-decoration: none;
  font-weight: 700;
  border-bottom: 2px dashed var(--outline);
}
.site-footer__links a:hover { color: var(--coral-ink); border-bottom-color: var(--coral-ink); }

/* ===== Responsive: nav wrap ===== */

@media (max-width: 640px) {
  .site-header__inner { gap: 8px; }
  .site-nav { width: 100%; justify-content: center; }
  .site-nav__link { padding: 7px 12px; font-size: 14px; }
}
```

- [ ] **Step 2: Create `site.js`**

Create `/Users/dio/works/chun-games/assets/site.js` with this content:

```js
/* WiGa shared chrome helpers — loaded by every chrome page (not games). */
(function () {
  "use strict";

  function markActiveNavLink() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return;
    var path = window.location.pathname.replace(/\/+$/, "");
    if (path === "" || /\/$/.test(window.location.pathname)) path += "/index.html";
    var current = path.split("/").pop() || "index.html";

    var links = nav.querySelectorAll(".site-nav__link");
    for (var i = 0; i < links.length; i++) {
      var href = (links[i].getAttribute("href") || "").split("/").pop();
      if (href === current) {
        links[i].classList.add("is-active");
        links[i].setAttribute("aria-current", "page");
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markActiveNavLink);
  } else {
    markActiveNavLink();
  }
})();
```

- [ ] **Step 3: Smoke check — both files load without syntax errors**

The shared assets have no consumer yet, so create a throwaway file at the repo root, open it, and check the console. **Then delete it before committing this task.**

```bash
cat > /Users/dio/works/chun-games/_chrome-smoke.html <<'EOF'
<!DOCTYPE html>
<html><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
<title>chrome smoke</title>
<link rel="stylesheet" href="assets/site.css" />
</head><body>
<header class="site-header"><div class="site-header__inner">
  <a class="site-logo" href="index.html">🎮 WiGa <span class="site-logo__sub">— William's Games</span></a>
  <nav class="site-nav">
    <a class="site-nav__link" href="index.html">Single Player</a>
    <a class="site-nav__link" href="multiplayer.html">Multi-Player</a>
    <a class="site-nav__link" href="high-scores.html">High Scores</a>
    <a class="site-nav__link" href="donate.html">Donate</a>
  </nav>
</div></header>
<main class="site-main"><p>Chrome smoke check.</p></main>
<footer class="site-footer"><div class="site-footer__inner">
  <span>Made by William with ❤️ and AI coding agents.</span>
</div></footer>
<script src="assets/site.js"></script>
</body></html>
EOF
./run.sh 8000 &  # leave running for the next tasks
```

Visit `http://localhost:8000/_chrome-smoke.html`. Verify:
- Header sticks at the top with logo on the left, four pills on the right.
- "Single Player" pill is highlighted in mint (active link inferred from `index.html` not matching — wait, this page is `_chrome-smoke.html` so no link is active; that's expected, no error).
- Footer shows the credit line at the bottom.
- DevTools console is empty.
- On a 375px viewport (DevTools iPhone preset), the nav wraps below the logo and is centered.

- [ ] **Step 4: Delete the smoke file**

```bash
rm /Users/dio/works/chun-games/_chrome-smoke.html
```

- [ ] **Step 5: Commit**

```bash
cd /Users/dio/works/chun-games
git add assets/site.css assets/site.js
git commit -m "$(cat <<'EOF'
feat(site): add shared chrome stylesheet + active-nav helper

assets/site.css holds palette tokens, sticky header + 4-pill nav,
hero band, page title, card grid, button system, and footer used by
the four chrome pages. assets/site.js marks the active nav link based
on location.pathname so every page can ship identical header markup.

Game pages keep their own self-contained styles per the per-game contract.
EOF
)"
```

Expected: one commit, two new files (`assets/site.css`, `assets/site.js`).

---

## Task 2: Build `donate.html`

**Files:**
- Create: `/Users/dio/works/chun-games/donate.html`

This is the simplest chrome consumer — no card grid, no JS state — so it makes the cleanest first verification of the shared chrome.

- [ ] **Step 1: Create `donate.html`**

Create `/Users/dio/works/chun-games/donate.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>WiGa · Donate</title>
  <link rel="stylesheet" href="assets/site.css" />
  <style>
    .donate-card {
      max-width: 640px;
      margin: 16px auto 32px;
      padding: 32px 28px;
      background: var(--card);
      border: 3px solid var(--peach);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow), var(--inset);
      text-align: center;
    }
    .donate-art {
      width: min(220px, 60%);
      height: auto;
      margin: 0 auto 12px;
      display: block;
    }
    .donate-card h1 {
      margin: 8px 0 12px;
      font-size: clamp(28px, 6vw, 40px);
      font-weight: 800;
    }
    .donate-card p {
      margin: 0 0 20px;
      color: var(--ink-soft);
      font-size: clamp(15px, 3.4vw, 18px);
      line-height: 1.55;
    }
    .donate-card .btn { width: min(280px, 100%); }
  </style>
</head>
<body>

<header class="site-header"><div class="site-header__inner">
  <a class="site-logo" href="index.html">🎮 WiGa <span class="site-logo__sub">— William's Games</span></a>
  <nav class="site-nav" aria-label="Primary">
    <a class="site-nav__link" href="index.html">Single Player</a>
    <a class="site-nav__link" href="multiplayer.html">Multi-Player</a>
    <a class="site-nav__link" href="high-scores.html">High Scores</a>
    <a class="site-nav__link" href="donate.html">Donate</a>
  </nav>
</div></header>

<main class="site-main">
  <section class="donate-card" aria-labelledby="donate-title">
    <svg class="donate-art" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A heart inside a cloud with sparkles">
      <!-- cloud bubble -->
      <path d="M40 100 C20 100 20 70 42 70 C46 50 80 46 88 64 C100 50 130 56 132 76 C156 72 162 102 142 108 L46 108 Z"
            fill="#fff8f0" stroke="#2a2a3a" stroke-width="3" stroke-linejoin="round"/>
      <!-- heart -->
      <path d="M100 96 C84 80 68 80 68 92 C68 106 100 124 100 124 C100 124 132 106 132 92 C132 80 116 80 100 96 Z"
            fill="#ffb3c1" stroke="#b13a55" stroke-width="3" stroke-linejoin="round"/>
      <!-- sparkles -->
      <path d="M30 50 L34 58 L42 60 L34 62 L30 70 L26 62 L18 60 L26 58 Z" fill="#fff2a6" stroke="#2a2a3a" stroke-width="2" stroke-linejoin="round"/>
      <path d="M170 40 L173 46 L179 48 L173 50 L170 56 L167 50 L161 48 L167 46 Z" fill="#a4d8f5" stroke="#2a2a3a" stroke-width="2" stroke-linejoin="round"/>
      <path d="M165 120 L168 126 L174 128 L168 130 L165 136 L162 130 L156 128 L162 126 Z" fill="#b8e8d4" stroke="#2a2a3a" stroke-width="2" stroke-linejoin="round"/>
    </svg>
    <h1 id="donate-title">Thanks for Playing! 🙏</h1>
    <p>WiGa is free and open source. If our games made you smile, you can buy William a treat — it helps fund more games (and ice cream).</p>
    <!-- TODO: replace with your real donation URL (e.g. https://buymeacoffee.com/<your-handle>) -->
    <a class="btn btn--coral btn--lg" href="https://example.com/REPLACE-ME-WITH-REAL-DONATION-URL" target="_blank" rel="noopener noreferrer">Buy us a coffee ☕</a>
  </section>
</main>

<footer class="site-footer"><div class="site-footer__inner">
  <span>Made by William with ❤️ and AI coding agents.</span>
  <span class="site-footer__links">
    <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a href="README.md">README</a>
  </span>
</div></footer>

<script src="assets/site.js"></script>
</body>
</html>
```

- [ ] **Step 2: Smoke check**

With `./run.sh 8000` running, visit `http://localhost:8000/donate.html`. Verify:
- Sticky header with **Donate** pill highlighted in mint.
- Centered card with peach border, SVG cloud-with-heart, headline, body copy, single coral "Buy us a coffee ☕" button.
- Hovering the button changes its background.
- Clicking the button opens the placeholder URL in a new tab (will load example.com — expected).
- Footer at the bottom shows the credit line + GitHub/README links.
- DevTools console is empty.
- Click "Single Player" in the nav — it navigates to `index.html` (currently the old layout — that's fine, it gets replaced in Task 5).
- 375px viewport: card stays centered, nav wraps below the logo, no horizontal scrollbar.

- [ ] **Step 3: Commit**

```bash
cd /Users/dio/works/chun-games
git add donate.html
git commit -m "$(cat <<'EOF'
feat(donate): add Donate page with placeholder coffee link

A kid-friendly thank-you page with a single chunky CTA. The donation
URL is a clearly-marked placeholder; replace it with the real link
(e.g. Buy Me a Coffee, Ko-fi) before shipping.
EOF
)"
```

---

## Task 3: Build `multiplayer.html`

**Files:**
- Create: `/Users/dio/works/chun-games/multiplayer.html`

The multiplayer page has one real game card (Memory Match Duel) and one placeholder "Coming soon" card. The duel game itself doesn't exist yet — the link will 404 until Task 6. That's intentional.

- [ ] **Step 1: Create `multiplayer.html`**

Create `/Users/dio/works/chun-games/multiplayer.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>WiGa · Multi-Player Games</title>
  <link rel="stylesheet" href="assets/site.css" />
</head>
<body>

<header class="site-header"><div class="site-header__inner">
  <a class="site-logo" href="index.html">🎮 WiGa <span class="site-logo__sub">— William's Games</span></a>
  <nav class="site-nav" aria-label="Primary">
    <a class="site-nav__link" href="index.html">Single Player</a>
    <a class="site-nav__link" href="multiplayer.html">Multi-Player</a>
    <a class="site-nav__link" href="high-scores.html">High Scores</a>
    <a class="site-nav__link" href="donate.html">Donate</a>
  </nav>
</div></header>

<main class="site-main">
  <header class="page-title">
    <h1 class="page-title__heading">Multi-Player 👬</h1>
    <p class="page-title__sub">Two players, one screen — no internet needed.</p>
  </header>

  <section class="card-grid" aria-label="Multi-player games">
    <article class="card">
      <a class="card__thumb-link" href="games/memory-match-duel.html" aria-label="Play Memory Match Duel">
        <svg class="card__thumb" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Two memory cards facing off">
          <rect width="320" height="180" fill="#fff8f0"/>
          <!-- left mint card -->
          <g transform="translate(56 36) rotate(-8 60 54)">
            <rect x="0" y="0" width="120" height="108" rx="14" fill="#b8e8d4" stroke="#2f6b54" stroke-width="4"/>
            <text x="60" y="68" text-anchor="middle" font-size="48" font-family="system-ui">🐉</text>
            <text x="60" y="96" text-anchor="middle" font-size="13" font-weight="800" fill="#2f6b54" letter-spacing="2">P1</text>
          </g>
          <!-- right peach card -->
          <g transform="translate(160 36) rotate(8 60 54)">
            <rect x="0" y="0" width="120" height="108" rx="14" fill="#ffd6b3" stroke="#8a4f1d" stroke-width="4"/>
            <text x="60" y="68" text-anchor="middle" font-size="48" font-family="system-ui">🚀</text>
            <text x="60" y="96" text-anchor="middle" font-size="13" font-weight="800" fill="#8a4f1d" letter-spacing="2">P2</text>
          </g>
          <!-- VS bubble -->
          <circle cx="160" cy="90" r="22" fill="#ffb3c1" stroke="#b13a55" stroke-width="3"/>
          <text x="160" y="97" text-anchor="middle" font-size="20" font-weight="900" fill="#b13a55">VS</text>
        </svg>
      </a>
      <div class="card__body">
        <h2 class="card__title">Memory Match Duel</h2>
        <p class="card__desc">A 4×4 memory grid for two players, taking turns. Whoever finds more pairs wins.</p>
        <div class="card__tags">
          <span class="card__tag">2 Players</span>
          <span class="card__tag">Pass-and-Play</span>
          <span class="card__tag">Cards</span>
        </div>
        <a class="card__play" href="games/memory-match-duel.html">Play →</a>
      </div>
    </article>

    <article class="card card--placeholder" aria-label="More games coming soon">
      <div>
        <div style="font-size: 38px; margin-bottom: 8px;">🛠️</div>
        <strong>More multi-player games are on the way!</strong>
      </div>
    </article>
  </section>
</main>

<footer class="site-footer"><div class="site-footer__inner">
  <span>Made by William with ❤️ and AI coding agents.</span>
  <span class="site-footer__links">
    <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a href="README.md">README</a>
  </span>
</div></footer>

<script src="assets/site.js"></script>
</body>
</html>
```

- [ ] **Step 2: Smoke check**

Visit `http://localhost:8000/multiplayer.html`. Verify:
- Sticky header with **Multi-Player** pill highlighted.
- Page title block shows "Multi-Player 👬" and the tagline.
- One real card with the VS thumbnail, "Memory Match Duel" title, three tags, and a coral "Play →" pill.
- One placeholder card with dashed outline, hammer emoji, "More multi-player games are on the way!"
- Hovering the real card lifts it (-3px); the placeholder doesn't lift.
- Clicking "Play →" goes to `games/memory-match-duel.html` — it 404s. **Expected** — game is built in Task 6. Confirm the 404 is the only failure mode here.
- DevTools console is empty (no errors before the 404 click).
- 375px viewport: cards stack vertically, nav wraps cleanly.

- [ ] **Step 3: Commit**

```bash
cd /Users/dio/works/chun-games
git add multiplayer.html
git commit -m "$(cat <<'EOF'
feat(multiplayer): add Multi-Player catalog page

One card for the upcoming Memory Match Duel (game file built in a
follow-up commit) plus a "more coming soon" placeholder so the grid
doesn't look lonely. Reuses the shared card-grid styles from site.css.
EOF
)"
```

---

## Task 4: Build `high-scores.html`

**Files:**
- Create: `/Users/dio/works/chun-games/high-scores.html`

This page renders 10 score boards (one per single-player game) using `ChunHighScores.render()`. *Memory Match Duel* is not listed (pass-and-play, no personal best). A "Clear all scores" link at the bottom wipes every `chun-ga.high-scores.*` key from `localStorage` after a `confirm()` dialog.

- [ ] **Step 1: Create `high-scores.html`**

Create `/Users/dio/works/chun-games/high-scores.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>WiGa · High Scores</title>
  <link rel="stylesheet" href="assets/site.css" />
  <style>
    .score-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .score-tile {
      background: var(--card);
      border: 3px solid var(--sky);
      border-radius: var(--radius-card);
      padding: 16px 18px;
      box-shadow: var(--shadow), var(--inset);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .score-tile h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 800;
      color: var(--ink);
    }
    .score-tile .empty {
      margin: 0;
      color: var(--ink-soft);
      font-size: 14px;
    }
    .score-tile .empty a {
      color: var(--coral-ink);
      font-weight: 700;
    }
    /* Override the inline styles from high-scores.js render() so its
       internal box looks at home in our tile. */
    .score-tile .high-score-box {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
    }
    .score-tile .high-score-box h3 { display: none !important; }
    .clear-row {
      text-align: center;
      margin: 32px 0 12px;
      color: var(--ink-soft);
      font-size: 14px;
    }
    .clear-row button {
      background: none;
      border: none;
      color: var(--ink-soft);
      font: inherit;
      font-weight: 700;
      text-decoration: underline dashed;
      text-underline-offset: 3px;
      cursor: pointer;
      padding: 0;
    }
    .clear-row button:hover { color: var(--coral-ink); }
  </style>
</head>
<body>

<header class="site-header"><div class="site-header__inner">
  <a class="site-logo" href="index.html">🎮 WiGa <span class="site-logo__sub">— William's Games</span></a>
  <nav class="site-nav" aria-label="Primary">
    <a class="site-nav__link" href="index.html">Single Player</a>
    <a class="site-nav__link" href="multiplayer.html">Multi-Player</a>
    <a class="site-nav__link" href="high-scores.html">High Scores</a>
    <a class="site-nav__link" href="donate.html">Donate</a>
  </nav>
</div></header>

<main class="site-main">
  <header class="page-title">
    <h1 class="page-title__heading">High Scores 🏆</h1>
    <p class="page-title__sub">Top 5 runs saved on this device.</p>
  </header>

  <section class="score-grid" id="score-grid" aria-label="Single-player leaderboards"></section>

  <p class="clear-row">
    <button type="button" id="clear-all">Clear all scores on this device</button>
  </p>
</main>

<footer class="site-footer"><div class="site-footer__inner">
  <span>Made by William with ❤️ and AI coding agents.</span>
  <span class="site-footer__links">
    <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a href="README.md">README</a>
  </span>
</div></footer>

<script src="games/high-scores.js"></script>
<script src="assets/site.js"></script>
<script>
  (function () {
    "use strict";

    var GAMES = [
      { id: "type2build",      name: "Type2Build",            scoreLabel: "pts" },
      { id: "zoomy-car",       name: "Zoomy Cars",            scoreLabel: "pts" },
      { id: "child-feeder",    name: "Child Feeder",          scoreLabel: "pts" },
      { id: "dragon",          name: "Dragon Eating Cheese",  scoreLabel: "pts" },
      { id: "car-memory",      name: "Car Memory",            scoreLabel: "pts" },
      { id: "engine-memory",   name: "Engine Memory",         scoreLabel: "pts" },
      { id: "pit-stop-crew",   name: "Pit Stop Crew",         scoreLabel: "rounds" },
      { id: "memory-match",    name: "Memory Match Cards",    scoreLabel: "pts" },
      { id: "guess-who",       name: "Guess Who Detective",   scoreLabel: "pts" },
      { id: "tangram-puzzles", name: "Tangram Puzzles",       scoreLabel: "pts" },
    ];

    function renderAll() {
      var grid = document.getElementById("score-grid");
      var frag = document.createDocumentFragment();
      for (var i = 0; i < GAMES.length; i++) {
        var g = GAMES[i];
        var tile = document.createElement("section");
        tile.className = "score-tile";

        var heading = document.createElement("h2");
        heading.textContent = g.name;
        tile.appendChild(heading);

        var scores = (window.ChunHighScores && window.ChunHighScores.load(g.id)) || [];
        if (scores.length === 0) {
          var empty = document.createElement("p");
          empty.className = "empty";
          empty.appendChild(document.createTextNode("No scores yet — "));
          var playLink = document.createElement("a");
          playLink.href = "games/" + g.id + ".html";
          playLink.textContent = "go play a round!";
          empty.appendChild(playLink);
          tile.appendChild(empty);
        } else if (window.ChunHighScores) {
          window.ChunHighScores.render(tile, g.id, { scoreLabel: g.scoreLabel });
        }
        frag.appendChild(tile);
      }
      grid.replaceChildren(frag);
    }

    function clearAll() {
      var ok = window.confirm("This will delete every saved high score on this device. Continue?");
      if (!ok) return;
      var prefix = "chun-ga.high-scores.";
      var keysToRemove = [];
      for (var i = 0; i < window.localStorage.length; i++) {
        var key = window.localStorage.key(i);
        if (key && key.indexOf(prefix) === 0) keysToRemove.push(key);
      }
      for (var j = 0; j < keysToRemove.length; j++) {
        window.localStorage.removeItem(keysToRemove[j]);
      }
      renderAll();
    }

    document.getElementById("clear-all").addEventListener("click", clearAll);
    renderAll();
  })();
</script>
</body>
</html>
```

- [ ] **Step 2: Smoke check — empty state**

Open a fresh browser (or DevTools → Application → Storage → Clear site data) so `localStorage` is empty for `localhost:8000`. Visit `http://localhost:8000/high-scores.html`. Verify:
- Sticky header with **High Scores** pill highlighted.
- Page title block shows "High Scores 🏆" and the tagline.
- 10 tiles render in the order from `GAMES`. Each tile shows the game name + "No scores yet — go play a round!" (the link goes to `games/<id>.html`).
- Bottom shows "Clear all scores on this device" as a dashed-underline link.
- Console empty.

- [ ] **Step 3: Smoke check — populated state**

In a new tab, play a single round of one game and let it record a score (e.g., open `games/dragon.html`, play, lose, enter a name when prompted). Reload `high-scores.html` — that game's tile now shows the top-5 ordered list (rendered by `ChunHighScores.render`); the other 9 still show the empty state.

- [ ] **Step 4: Smoke check — clear all**

Click "Clear all scores on this device". Confirm the dialog. The board re-renders — all 10 tiles back to empty. Reload the page — still empty (`localStorage` actually wiped).

- [ ] **Step 5: Commit**

```bash
cd /Users/dio/works/chun-games
git add high-scores.html
git commit -m "$(cat <<'EOF'
feat(high-scores): add dedicated High Scores page

Renders one tile per single-player game using ChunHighScores.render(),
with an empty-state fallback that links to the game. Memory Match Duel
is excluded (pass-and-play, no personal best). Clear-all link wipes
chun-ga.high-scores.* localStorage keys after a confirm() dialog.
EOF
)"
```

---

## Task 5: Refactor `index.html` to use shared chrome + hero

**Files:**
- Modify: `/Users/dio/works/chun-games/index.html`

The home page keeps its 10 game cards but loses the inline chrome styles, gains the shared header/footer/hero, and drops the floating high-scores sidebar (now replaced by the dedicated High Scores page). Card content (thumbnails, titles, descriptions, tags, links) is preserved verbatim — only the wrapper classes change to match the shared `.card`/`.card-grid`/`.card__*` system.

This is the largest task because it touches the existing 888-line file. The transformation is mechanical: replace the `<head>` styles with `<link rel="stylesheet" href="assets/site.css" />` + a small page-specific `<style>` block, replace the `<header class="hero">` block with the new hero, keep all `<article class="card">` markup but rename the class chains (`.thumb-link` → `.card__thumb-link`, `.thumb` → `.card__thumb`, `.body` → `.card__body`, `.body h2` → `.card__title`, `.desc` → `.card__desc`, `.tags`/`.tag` → `.card__tags`/`.card__tag`, `.play` → `.card__play`), and remove the floating `<aside class="scoreboard">` and its driving script.

- [ ] **Step 1: Replace the entire `<head>` block**

Open `/Users/dio/works/chun-games/index.html`. Lines 1–212 (the `<head>` and inline `<style>`) are replaced. New `<head>`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>WiGa · William's Games</title>
  <link rel="stylesheet" href="assets/site.css" />
  <style>
    /* Page-specific tweak: tighten the gap above the games grid since
       the hero already provides generous breathing room. */
    .home-grid { margin-top: 4px; }
  </style>
</head>
```

Replace from line 1 through `</head>` (line 212).

- [ ] **Step 2: Replace the body open + hero**

Lines 213–219 currently are:
```html
<body>
  <div class="container">
    <header class="hero">
      <h1>William learning to code with games 🎮</h1>
      <p>A playground of small, self-contained browser games created by William P, with Claude Code.</p>
    </header>
```

Replace with:
```html
<body>

<header class="site-header"><div class="site-header__inner">
  <a class="site-logo" href="index.html">🎮 WiGa <span class="site-logo__sub">— William's Games</span></a>
  <nav class="site-nav" aria-label="Primary">
    <a class="site-nav__link" href="index.html">Single Player</a>
    <a class="site-nav__link" href="multiplayer.html">Multi-Player</a>
    <a class="site-nav__link" href="high-scores.html">High Scores</a>
    <a class="site-nav__link" href="donate.html">Donate</a>
  </nav>
</div></header>

<main class="site-main">
  <section class="hero" aria-labelledby="hero-title">
    <div>
      <span class="hero__eyebrow">William's Games</span>
      <h1 class="hero__title" id="hero-title">WiGa 🎮</h1>
      <p class="hero__tagline">Tiny browser games for kids and families.</p>
      <div class="hero__ctas">
        <a class="btn btn--mint btn--lg" href="#games">Play Single-Player ▶</a>
        <a class="btn btn--peach btn--lg" href="multiplayer.html">Try Multi-Player 👬</a>
      </div>
    </div>
    <svg class="hero__art" viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cartoon scene with kids, a cat, a tiny car, and a tiny dragon">
      <!-- sky background -->
      <rect width="360" height="280" fill="#fff8f0"/>
      <!-- clouds -->
      <ellipse cx="60"  cy="40" rx="28" ry="10" fill="#a4d8f5" opacity="0.55"/>
      <ellipse cx="280" cy="56" rx="34" ry="11" fill="#a4d8f5" opacity="0.45"/>
      <!-- sun -->
      <circle cx="320" cy="40" r="22" fill="#fff2a6" stroke="#2a2a3a" stroke-width="3"/>
      <!-- ground -->
      <path d="M0 218 C 90 198, 270 240, 360 210 L 360 280 L 0 280 Z" fill="#b8e8d4" stroke="#2f6b54" stroke-width="3"/>
      <!-- tiny dragon (left) -->
      <g transform="translate(34 180)">
        <ellipse cx="22" cy="22" rx="22" ry="14" fill="#b8e8d4" stroke="#2f6b54" stroke-width="3"/>
        <path d="M10 14 L4 4 L18 12 Z" fill="#fff2a6" stroke="#2f6b54" stroke-width="2.5"/>
        <circle cx="30" cy="18" r="3" fill="#2a2a3a"/>
        <path d="M44 24 C 56 22, 56 32, 44 30" fill="#ffb3c1" stroke="#b13a55" stroke-width="2"/>
      </g>
      <!-- cat (center-left) -->
      <g transform="translate(110 168)">
        <circle cx="20" cy="22" r="20" fill="#ffd6b3" stroke="#8a4f1d" stroke-width="3"/>
        <path d="M5 8 L10 18 L18 14 Z M35 8 L30 18 L22 14 Z" fill="#ffd6b3" stroke="#8a4f1d" stroke-width="2.5"/>
        <circle cx="14" cy="22" r="2.5" fill="#2a2a3a"/>
        <circle cx="26" cy="22" r="2.5" fill="#2a2a3a"/>
        <path d="M16 30 Q20 33 24 30" stroke="#2a2a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M9 26 L4 25 M9 28 L4 30 M31 26 L36 25 M31 28 L36 30" stroke="#2a2a3a" stroke-width="1.5" stroke-linecap="round"/>
      </g>
      <!-- two kids (center) -->
      <g transform="translate(170 130)">
        <!-- kid 1 -->
        <circle cx="22" cy="22" r="16" fill="#ffd6b3" stroke="#8a4f1d" stroke-width="3"/>
        <path d="M8 22 C 8 8, 36 8, 36 22 L 30 14 L 14 14 Z" fill="#2a2a3a"/>
        <circle cx="17" cy="24" r="2" fill="#2a2a3a"/>
        <circle cx="27" cy="24" r="2" fill="#2a2a3a"/>
        <path d="M18 30 Q22 33 26 30" stroke="#2a2a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
        <rect x="6" y="38" width="32" height="38" rx="8" fill="#ffb3c1" stroke="#b13a55" stroke-width="3"/>
      </g>
      <g transform="translate(230 138)">
        <!-- kid 2 -->
        <circle cx="22" cy="22" r="16" fill="#ffd6b3" stroke="#8a4f1d" stroke-width="3"/>
        <path d="M8 18 C 10 4, 34 4, 36 18 L 32 14 Q 22 6, 12 14 Z" fill="#a05a2c"/>
        <circle cx="17" cy="24" r="2" fill="#2a2a3a"/>
        <circle cx="27" cy="24" r="2" fill="#2a2a3a"/>
        <path d="M18 30 Q22 33 26 30" stroke="#2a2a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
        <rect x="6" y="38" width="32" height="34" rx="8" fill="#a4d8f5" stroke="#3a6e90" stroke-width="3"/>
      </g>
      <!-- tiny car (right) -->
      <g transform="translate(290 196)">
        <rect x="0" y="6" width="48" height="20" rx="6" fill="#ffb3c1" stroke="#b13a55" stroke-width="3"/>
        <path d="M8 6 L14 -4 L34 -4 L40 6 Z" fill="#ffd6b3" stroke="#8a4f1d" stroke-width="3"/>
        <circle cx="12" cy="28" r="6" fill="#2a2a3a"/>
        <circle cx="12" cy="28" r="2" fill="#fff8f0"/>
        <circle cx="36" cy="28" r="6" fill="#2a2a3a"/>
        <circle cx="36" cy="28" r="2" fill="#fff8f0"/>
      </g>
    </svg>
  </section>

  <h2 class="section-heading" id="games">All Games</h2>
  <section class="card-grid home-grid" aria-label="Single-player games">
```

Note: the existing file uses `<main class="grid">` to wrap the cards, but a page can only have one `<main>` per accessibility guidelines, and the new outer `<main class="site-main">` already provides the page's main landmark. So the inner wrapper becomes a `<section>` (with `aria-label`) instead of a nested `<main>`. The opening tag is replaced as part of the snippet above; the matching closing tag is updated in Step 4.

The line currently at line 220 is `    <main class="grid">` — that line is replaced by the snippet's last line `<section class="card-grid home-grid" aria-label="Single-player games">`. The closing `</main>` further down (currently line ~841, just before the existing `<footer>`) is replaced in Step 4 with `</section>`.

- [ ] **Step 3: Rename card class names throughout the existing 10 cards**

The existing card markup uses these class names:
- `<a class="thumb-link">` → `<a class="card__thumb-link">`
- `<svg class="thumb">` → `<svg class="card__thumb">`
- `<div class="body">` → `<div class="card__body">`
- inside `.body`, `<h2>` (no class) → `<h2 class="card__title">`
- `<p class="desc">` → `<p class="card__desc">`
- `<div class="tags">` → `<div class="card__tags">`
- `<span class="tag">` → `<span class="card__tag">`
- `<a class="play">` → `<a class="card__play">`

Apply these renames consistently across **all 10 `<article class="card">` blocks** (the `.card` class itself stays). Use Find-and-Replace on the whole file.

A quick way to apply these renames in bulk via terminal:

```bash
cd /Users/dio/works/chun-games
# Use your editor's project-wide find-and-replace, or:
# (sed -i differs across BSD/GNU; do this in your editor instead.)
```

Recommended: open the file in your editor and apply each rename pair-by-pair. Save when done. Verify with a grep:

```bash
grep -nE '"(thumb-link|thumb|body|desc|tags|tag|play)"' /Users/dio/works/chun-games/index.html
```

Expected: the only remaining matches should be inside SVG `<text>` content or comments — not as `class=` values on the card-related elements. (The thumbnail SVGs use `<rect>`, `<path>`, etc., which don't trigger the grep.)

- [ ] **Step 4: Replace the closing `</main>` of the grid + the existing footer + the floating sidebar + the catalog script**

After the last `</article>` (line ~841 in the original file) the existing markup is:

```html
    </main>

    <footer>
      <p>Built with AI coding agents — see <a href="README.md">README</a> for details.</p>
    </footer>
  </div>

  <aside class="scoreboard" aria-label="local high scores">
    <h2>High Scores</h2>
    <div class="scoreboard-list" id="catalog-high-scores"></div>
  </aside>

  <script src="games/high-scores.js"></script>
  <script>
    (function () {
      "use strict";
      const games = [ /* ... 10 entries ... */ ];
      const wrap = document.getElementById("catalog-high-scores");
      /* ... builds tiles ... */
    })();
  </script>
</body>
</html>
```

Replace the entire block (from the closing `</main>` through `</html>`) with:

```html
  </section>
</main>

<footer class="site-footer"><div class="site-footer__inner">
  <span>Made by William with ❤️ and AI coding agents.</span>
  <span class="site-footer__links">
    <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a href="README.md">README</a>
  </span>
</div></footer>

<script src="assets/site.js"></script>
</body>
</html>
```

This drops:
- The wrapping `<div class="container">` (the new chrome handles centering via `.site-main`).
- The old `<footer>` (replaced by `.site-footer`).
- The floating `<aside class="scoreboard">` and its inline driver script (now lives at `high-scores.html`).
- The `<script src="games/high-scores.js">` import (no longer needed on the home page; was only used by the floating sidebar).

- [ ] **Step 5: Smoke check**

Visit `http://localhost:8000/index.html`. Verify:
- Sticky header with **Single Player** pill highlighted in mint.
- Hero band with peach-bordered hero card (or mint — actually mint per the stylesheet). It shows the eyebrow "William's Games", big "WiGa 🎮" title, tagline, two CTA buttons, and the cartoon SVG illustration on the right (or below on mobile).
- Clicking "Play Single-Player ▶" smooth-jumps down to the `#games` section.
- Clicking "Try Multi-Player 👬" navigates to `multiplayer.html`.
- The "All Games" section heading appears below the hero.
- All 10 cards render in their original order with thumbnails, titles, descriptions, tags, and "Play →" links.
- Hovering a card lifts it (-3px).
- No floating high-scores sidebar.
- Footer is the new shared one.
- DevTools console empty.
- 375px viewport: hero stacks (text above SVG), nav wraps, cards stack vertically.
- Click each card's "Play →" link — every game still loads correctly (their pages are unchanged).

- [ ] **Step 6: Commit**

```bash
cd /Users/dio/works/chun-games
git add index.html
git commit -m "$(cat <<'EOF'
refactor(index): rebrand as WiGa, adopt shared chrome + hero band

- Replace inline header/footer with shared site-header/site-footer
- Add WiGa pastel hero with eyebrow, title, tagline, two CTAs, and an
  inline SVG illustration of kids + cat + tiny car + tiny dragon
- Rename card classes to the shared .card__* system (preserves all
  10 existing game cards verbatim — same thumbnails, titles, copy)
- Drop the floating high-scores sidebar and its driver script — that
  function now lives on the dedicated high-scores.html page
- Update <title> to "WiGa · William's Games"
EOF
)"
```

---

## Task 6: Build `games/memory-match-duel.html` — setup screen + play screen

**Files:**
- Create: `/Users/dio/works/chun-games/games/memory-match-duel.html`

This task ships the duel game's full chrome: setup screen (two name inputs + Start), play screen (score bar, peek, 4×4 grid with the 8 idea pairs from `memory-match.html`), turn-taking logic, and the locked face-up overlay in the current player's color. The end screen + confetti land in Task 7.

The game keeps the per-game contract: one self-contained HTML file, inline `<style>`, one inline `<script>`, no shared CSS imports. (It's a game page, not a chrome page.) The card art and animations are forked from `memory-match.html` so visuals stay consistent with the solo version.

- [ ] **Step 1: Create `games/memory-match-duel.html`**

Create `/Users/dio/works/chun-games/games/memory-match-duel.html` with this content. It is long because it embeds the 8-pair card-art SVG palette from the solo game; that's intentional per the per-game contract (no shared art module).

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
  <title>WiGa · Memory Match Duel</title>
  <style>
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    html, body {
      margin: 0;
      padding: 0;
      min-height: 100%;
      font-family: "SF Pro Rounded", "Avenir Next", "Quicksand",
                   system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(180deg, #fff8f0 0%, #d6f0ff 100%);
      color: #2a2a3a;
    }
    body {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 12px;
    }
    @supports (height: 100dvh) {
      body { min-height: 100dvh; }
    }
    #app {
      width: 100%;
      max-width: 760px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ===== Setup screen ===== */

    #setup {
      background: #fff;
      border: 3px solid #b8e8d4;
      border-radius: 24px;
      padding: 28px 24px;
      box-shadow: 0 6px 18px rgba(15,23,42,0.10);
      text-align: center;
    }
    #setup h1 {
      margin: 0 0 14px;
      font-size: clamp(26px, 6vw, 38px);
      font-weight: 800;
    }
    #setup .duel-art {
      width: min(160px, 50%);
      height: auto;
      margin: 0 auto 12px;
      display: block;
    }
    #setup .row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
      max-width: 420px;
      margin: 18px auto 22px;
    }
    @media (min-width: 520px) {
      #setup .row { grid-template-columns: 1fr 1fr; }
    }
    .name-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-align: left;
    }
    .name-field label {
      font-weight: 800;
      font-size: 14px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .name-field input {
      font: inherit;
      font-size: 16px;
      padding: 10px 14px;
      border-radius: 14px;
      border: 2px solid #2a2a3a;
      background: #fff;
    }
    .name-field--p1 label { color: #2f6b54; }
    .name-field--p1 input { border-color: #2f6b54; background: #f0fbf5; }
    .name-field--p2 label { color: #8a4f1d; }
    .name-field--p2 input { border-color: #8a4f1d; background: #fff5ea; }

    /* ===== Buttons ===== */

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 26px;
      border-radius: 16px;
      border: 2px solid #2a2a3a;
      background: #fff;
      color: #2a2a3a;
      font: inherit;
      font-weight: 800;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 6px 18px rgba(15,23,42,0.10);
    }
    .btn:active { transform: translateY(1px); }
    .btn--coral { background: #ffb3c1; border-color: #b13a55; color: #b13a55; }
    .btn--mint { background: #b8e8d4; }
    .btn--peach { background: #ffd6b3; }
    .btn--lg { padding: 14px 30px; font-size: 18px; }

    /* ===== Play screen ===== */

    #play[hidden] { display: none !important; }

    .scorebar {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 10px;
      align-items: center;
      padding: 12px;
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 6px 18px rgba(15,23,42,0.10);
    }
    .scoreplayer {
      padding: 10px 14px;
      border-radius: 18px;
      border: 3px solid transparent;
      text-align: center;
      transition: box-shadow 200ms ease, border-color 200ms ease;
    }
    .scoreplayer--p1 { background: #b8e8d4; }
    .scoreplayer--p2 { background: #ffd6b3; }
    .scoreplayer.is-turn { box-shadow: 0 0 0 4px rgba(177, 58, 85, 0.35); }
    .scoreplayer--p1.is-turn { border-color: #2f6b54; }
    .scoreplayer--p2.is-turn { border-color: #8a4f1d; }
    .scoreplayer__name {
      display: block;
      font-weight: 800;
      font-size: clamp(14px, 3.4vw, 17px);
      line-height: 1.2;
    }
    .scoreplayer__pairs {
      display: block;
      font-weight: 900;
      font-size: clamp(22px, 5vw, 32px);
      font-variant-numeric: tabular-nums;
    }
    .scoreplayer__caption {
      display: block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-top: 2px;
      min-height: 1em;
      color: #b13a55;
    }
    .vs {
      font-size: clamp(13px, 3vw, 16px);
      font-weight: 900;
      letter-spacing: 0.18em;
      color: #5b6072;
    }

    .toolbar {
      display: flex;
      justify-content: center;
      gap: 8px;
      flex-wrap: wrap;
    }
    .toolbar a, .toolbar button {
      font: inherit;
      font-size: 14px;
      font-weight: 800;
      color: #2a2a3a;
      text-decoration: none;
      border: none;
      background: transparent;
      border-bottom: 2px dashed rgba(42,42,58,0.35);
      cursor: pointer;
      padding: 0 4px;
    }
    .toolbar a:hover, .toolbar button:hover { color: #b13a55; border-bottom-color: #b13a55; }

    /* ===== Board (forked from memory-match.html) ===== */

    #board {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      perspective: 1000px;
      width: 100%;
    }
    .card {
      position: relative;
      aspect-ratio: 3 / 4;
      border: none;
      background: transparent;
      padding: 0;
      cursor: pointer;
      border-radius: 16px;
    }
    .card:focus-visible {
      outline: 4px solid #ef476f;
      outline-offset: 3px;
    }
    .card-inner {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 460ms cubic-bezier(.35,.2,.2,1.25);
    }
    .card.revealed .card-inner,
    .card.matched .card-inner {
      transform: rotateY(180deg);
    }
    .face {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border-radius: 16px;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      box-shadow: 0 10px 20px rgba(31,41,55,0.2);
      overflow: hidden;
    }
    .back {
      background:
        radial-gradient(circle at 26% 22%, rgba(255,255,255,0.35), transparent 28%),
        repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0 8px, transparent 8px 16px),
        linear-gradient(135deg, #7c3aed, #06b6d4);
      border: 3px solid rgba(255,255,255,0.75);
      color: #fff;
    }
    .back-icon {
      font-size: clamp(34px, 10vw, 58px);
      filter: drop-shadow(0 4px 3px rgba(0,0,0,0.22));
    }
    .back span:last-child {
      font-size: clamp(11px, 2.8vw, 14px);
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .front {
      transform: rotateY(180deg);
      padding: 8px;
      color: #fff;
      text-align: center;
      border: 3px solid rgba(255,255,255,0.8);
    }
    .front[data-light="1"] { color: #1f2937; }
    .picture {
      width: min(58%, 72px);
      aspect-ratio: 1;
      filter: drop-shadow(0 4px 4px rgba(0,0,0,0.18));
    }
    .name {
      font-size: clamp(14px, 3.5vw, 18px);
      font-weight: 900;
      letter-spacing: 0.02em;
    }
    .hint {
      font-size: clamp(10px, 2.6vw, 13px);
      font-weight: 700;
      line-height: 1.2;
      opacity: 0.92;
    }
    .check {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 28px;
      height: 28px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background: #16a34a;
      color: #fff;
      font-weight: 900;
      opacity: 0;
      transform: scale(0.4);
      transition: opacity 180ms ease, transform 220ms cubic-bezier(.2,1.7,.4,1);
      box-shadow: 0 3px 8px rgba(0,0,0,0.28);
      z-index: 2;
      pointer-events: none;
    }
    .card.matched { cursor: default; }
    .card.matched .check { opacity: 1; transform: scale(1); }
    /* Tint matched cards in the winning player's color */
    .card.matched--p1 .front { box-shadow: 0 0 0 4px #2f6b54, 0 10px 20px rgba(31,41,55,0.2); }
    .card.matched--p1 .front::after {
      content: "";
      position: absolute; inset: 0;
      background: rgba(184, 232, 212, 0.45);
      pointer-events: none;
    }
    .card.matched--p2 .front { box-shadow: 0 0 0 4px #8a4f1d, 0 10px 20px rgba(31,41,55,0.2); }
    .card.matched--p2 .front::after {
      content: "";
      position: absolute; inset: 0;
      background: rgba(255, 214, 179, 0.45);
      pointer-events: none;
    }
    .card.shake .card-inner { animation: shake 360ms ease; }
    @keyframes shake {
      0%, 100% { transform: rotateY(180deg) translateX(0); }
      25% { transform: rotateY(180deg) translateX(-7px); }
      75% { transform: rotateY(180deg) translateX(7px); }
    }

    /* ===== Preview overlay (forked from memory-match.html) ===== */

    #preview-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 50;
      pointer-events: none;
    }
    #preview-overlay[hidden] { display: none !important; }
    #preview-counter {
      font-size: clamp(96px, 24vw, 200px);
      font-weight: 900;
      color: #b13a55;
      background: rgba(255,255,255,0.92);
      border-radius: 28px;
      padding: 6px 38px;
      border: 4px solid rgba(177, 58, 85, 0.55);
      line-height: 1.05;
      font-variant-numeric: tabular-nums;
      box-shadow: 0 8px 28px rgba(31,41,55,0.22);
      animation: preview-pulse 1s ease-in-out infinite;
    }
    #preview-hint {
      font-size: clamp(13px, 3.6vw, 17px);
      font-weight: 800;
      color: #2a2a3a;
      background: rgba(255,255,255,0.94);
      padding: 9px 22px;
      border-radius: 999px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      box-shadow: 0 6px 18px rgba(31,41,55,0.18);
    }
    @keyframes preview-pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(1.06); }
    }

    /* ===== End screen — content lives here, confetti added in Task 7 ===== */

    #end-screen[hidden] { display: none !important; }

    @media (max-width: 520px) {
      body { padding: 8px; }
      #board { gap: 7px; }
      .face { border-radius: 12px; }
      .front, .back { border-width: 2px; }
      .check { width: 22px; height: 22px; font-size: 13px; top: 5px; right: 5px; }
    }
  </style>
</head>
<body>

<main id="app">

  <!-- ===== Setup screen ===== -->
  <section id="setup" aria-labelledby="setup-title">
    <svg class="duel-art" viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="translate(40 18) rotate(-10 40 40)">
        <rect x="0" y="0" width="80" height="92" rx="12" fill="#b8e8d4" stroke="#2f6b54" stroke-width="4"/>
        <text x="40" y="58" text-anchor="middle" font-size="34" font-family="system-ui">🐉</text>
      </g>
      <g transform="translate(110 18) rotate(10 40 40)">
        <rect x="0" y="0" width="80" height="92" rx="12" fill="#ffd6b3" stroke="#8a4f1d" stroke-width="4"/>
        <text x="40" y="58" text-anchor="middle" font-size="34" font-family="system-ui">🚀</text>
      </g>
      <circle cx="100" cy="64" r="18" fill="#ffb3c1" stroke="#b13a55" stroke-width="3"/>
      <text x="100" y="71" text-anchor="middle" font-size="16" font-weight="900" fill="#b13a55">VS</text>
    </svg>
    <h1 id="setup-title">Memory Match Duel 👬</h1>
    <p style="margin: 0 0 6px; color: #5b6072;">Two players, one screen. Find more pairs than your opponent!</p>
    <form id="setup-form" novalidate>
      <div class="row">
        <div class="name-field name-field--p1">
          <label for="p1-name">Player 1 (mint)</label>
          <input id="p1-name" name="p1" type="text" maxlength="24" placeholder="Player 1" autocomplete="off" />
        </div>
        <div class="name-field name-field--p2">
          <label for="p2-name">Player 2 (peach)</label>
          <input id="p2-name" name="p2" type="text" maxlength="24" placeholder="Player 2" autocomplete="off" />
        </div>
      </div>
      <button class="btn btn--coral btn--lg" type="submit">Start Duel ▶</button>
    </form>
  </section>

  <!-- ===== Play screen (hidden until Start) ===== -->
  <section id="play" hidden>
    <div class="scorebar" aria-label="Score">
      <div class="scoreplayer scoreplayer--p1" id="score-p1">
        <span class="scoreplayer__name" id="name-p1">Player 1</span>
        <span class="scoreplayer__pairs" id="pairs-p1">0</span>
        <span class="scoreplayer__caption" id="caption-p1"></span>
      </div>
      <div class="vs">VS</div>
      <div class="scoreplayer scoreplayer--p2" id="score-p2">
        <span class="scoreplayer__name" id="name-p2">Player 2</span>
        <span class="scoreplayer__pairs" id="pairs-p2">0</span>
        <span class="scoreplayer__caption" id="caption-p2"></span>
      </div>
    </div>

    <section id="board" aria-label="Memory match board"></section>

    <div class="toolbar">
      <a href="../index.html">Home</a>
      <button type="button" id="restart-btn">Restart round</button>
      <button type="button" id="reset-btn">New players</button>
    </div>
  </section>

  <!-- End screen lives in this same #app and is filled in Task 7 -->
  <section id="end-screen" hidden></section>
</main>

<div id="preview-overlay" hidden aria-live="polite">
  <div id="preview-counter">3</div>
  <div id="preview-hint">Memorize the cards · click anywhere to start</div>
</div>

<script>
(function () {
  "use strict";

  // 8 idea pairs forked from games/memory-match.html — keep in sync if
  // the source ever changes (per-game contract: no shared art module).
  var ITEMS = [
    { name: "Dragon", art: "dragon", color: "#16a34a" },
    { name: "Rocket", art: "rocket", color: "#2563eb" },
    { name: "Paint",  art: "paint",  color: "#f97316" },
    { name: "Robot",  art: "robot",  color: "#64748b" },
    { name: "Castle", art: "castle", color: "#9333ea" },
    { name: "Music",  art: "music",  color: "#db2777" },
    { name: "Puzzle", art: "puzzle", color: "#0d9488" },
    { name: "Star",   art: "star",   color: "#facc15", light: true },
  ];

  var FLIP_BACK_DELAY = 900;
  var PAIR_COUNT = ITEMS.length;
  var PREVIEW_SECONDS = 3;
  var FLIP_TRANSITION_MS = 460;

  var state = {
    phase: "setup",        // "setup" | "preview" | "playing" | "ended"
    players: ["Player 1", "Player 2"],
    current: 0,            // 0 or 1
    pairs: [0, 0],
    revealed: [],          // up to 2 entries: { card, item }
    locked: false,
    previewInterval: null,
    previewClickHandler: null,
  };

  var els = {
    setup: document.getElementById("setup"),
    setupForm: document.getElementById("setup-form"),
    p1Input: document.getElementById("p1-name"),
    p2Input: document.getElementById("p2-name"),
    play: document.getElementById("play"),
    board: document.getElementById("board"),
    nameP1: document.getElementById("name-p1"),
    nameP2: document.getElementById("name-p2"),
    pairsP1: document.getElementById("pairs-p1"),
    pairsP2: document.getElementById("pairs-p2"),
    captionP1: document.getElementById("caption-p1"),
    captionP2: document.getElementById("caption-p2"),
    scoreP1: document.getElementById("score-p1"),
    scoreP2: document.getElementById("score-p2"),
    restartBtn: document.getElementById("restart-btn"),
    resetBtn: document.getElementById("reset-btn"),
    endScreen: document.getElementById("end-screen"),
    previewOverlay: document.getElementById("preview-overlay"),
    previewCounter: document.getElementById("preview-counter"),
  };

  function shuffle(items) {
    var copy = items.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = copy[i]; copy[i] = copy[j]; copy[j] = t;
    }
    return copy;
  }

  function svgEl(name) {
    return document.createElementNS("http://www.w3.org/2000/svg", name);
  }

  function addShape(parent, name, attrs) {
    var el = svgEl(name);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) el.setAttribute(k, attrs[k]);
    parent.appendChild(el);
    return el;
  }

  function createPicture(kind) {
    var svg = svgEl("svg");
    svg.classList.add("picture");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("aria-hidden", "true");

    if (kind === "dragon") {
      addShape(svg, "path", { d: "M20 61 C22 37 45 24 69 35 C83 41 88 55 80 69 C69 86 36 83 20 61 Z", fill: "#bbf7d0", stroke: "#14532d", "stroke-width": "5" });
      addShape(svg, "path", { d: "M37 36 L29 16 L48 30 Z M62 35 L73 17 L76 41 Z", fill: "#fef08a", stroke: "#14532d", "stroke-width": "4" });
      addShape(svg, "circle", { cx: "58", cy: "52", r: "6", fill: "#fff" });
      addShape(svg, "circle", { cx: "60", cy: "52", r: "3", fill: "#111827" });
      addShape(svg, "path", { d: "M77 58 C91 55 95 47 98 38 C89 42 84 38 77 58 Z", fill: "#fb923c" });
      addShape(svg, "path", { d: "M26 62 C11 70 12 86 27 81", fill: "none", stroke: "#14532d", "stroke-width": "6", "stroke-linecap": "round" });
    } else if (kind === "rocket") {
      addShape(svg, "path", { d: "M50 8 C68 24 74 48 62 74 L38 74 C26 48 32 24 50 8 Z", fill: "#dbeafe", stroke: "#1e3a8a", "stroke-width": "5" });
      addShape(svg, "circle", { cx: "50", cy: "39", r: "11", fill: "#93c5fd", stroke: "#1e3a8a", "stroke-width": "4" });
      addShape(svg, "path", { d: "M38 65 L20 84 L35 83 Z M62 65 L80 84 L65 83 Z", fill: "#f43f5e", stroke: "#7f1d1d", "stroke-width": "4" });
      addShape(svg, "path", { d: "M42 76 L50 96 L58 76 Z", fill: "#facc15", stroke: "#92400e", "stroke-width": "4" });
    } else if (kind === "paint") {
      addShape(svg, "path", { d: "M23 30 C39 11 75 17 82 42 C88 62 69 80 48 77 C42 76 42 67 49 66 C55 65 56 58 50 55 C39 50 12 54 23 30 Z", fill: "#fed7aa", stroke: "#7c2d12", "stroke-width": "5" });
      addShape(svg, "circle", { cx: "41", cy: "33", r: "6", fill: "#ef4444" });
      addShape(svg, "circle", { cx: "60", cy: "32", r: "6", fill: "#22c55e" });
      addShape(svg, "circle", { cx: "69", cy: "48", r: "6", fill: "#3b82f6" });
      addShape(svg, "circle", { cx: "33", cy: "51", r: "6", fill: "#a855f7" });
      addShape(svg, "path", { d: "M58 73 L88 43", stroke: "#78350f", "stroke-width": "8", "stroke-linecap": "round" });
      addShape(svg, "path", { d: "M82 38 L92 28", stroke: "#f8fafc", "stroke-width": "10", "stroke-linecap": "round" });
    } else if (kind === "robot") {
      addShape(svg, "rect", { x: "24", y: "27", width: "52", height: "46", rx: "10", fill: "#e2e8f0", stroke: "#1f2937", "stroke-width": "5" });
      addShape(svg, "path", { d: "M50 27 V13", stroke: "#1f2937", "stroke-width": "5", "stroke-linecap": "round" });
      addShape(svg, "circle", { cx: "50", cy: "11", r: "6", fill: "#facc15", stroke: "#1f2937", "stroke-width": "3" });
      addShape(svg, "circle", { cx: "40", cy: "47", r: "7", fill: "#38bdf8" });
      addShape(svg, "circle", { cx: "60", cy: "47", r: "7", fill: "#38bdf8" });
      addShape(svg, "path", { d: "M39 61 H61", stroke: "#1f2937", "stroke-width": "5", "stroke-linecap": "round" });
      addShape(svg, "path", { d: "M24 50 H12 M76 50 H88", stroke: "#1f2937", "stroke-width": "6", "stroke-linecap": "round" });
    } else if (kind === "castle") {
      addShape(svg, "rect", { x: "22", y: "43", width: "56", height: "38", fill: "#e9d5ff", stroke: "#581c87", "stroke-width": "5" });
      addShape(svg, "rect", { x: "17", y: "31", width: "18", height: "50", fill: "#c4b5fd", stroke: "#581c87", "stroke-width": "5" });
      addShape(svg, "rect", { x: "65", y: "31", width: "18", height: "50", fill: "#c4b5fd", stroke: "#581c87", "stroke-width": "5" });
      addShape(svg, "path", { d: "M17 31 L26 16 L35 31 Z M65 31 L74 16 L83 31 Z M38 43 L50 23 L62 43 Z", fill: "#fef08a", stroke: "#581c87", "stroke-width": "4" });
      addShape(svg, "path", { d: "M42 81 V66 C42 56 58 56 58 66 V81 Z", fill: "#7c2d12" });
    } else if (kind === "music") {
      addShape(svg, "path", { d: "M36 20 V68", stroke: "#fce7f3", "stroke-width": "9", "stroke-linecap": "round" });
      addShape(svg, "path", { d: "M36 20 L72 13 V61", stroke: "#fce7f3", "stroke-width": "9", "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" });
      addShape(svg, "ellipse", { cx: "28", cy: "72", rx: "16", ry: "11", fill: "#fce7f3", transform: "rotate(-20 28 72)" });
      addShape(svg, "ellipse", { cx: "64", cy: "65", rx: "16", ry: "11", fill: "#fce7f3", transform: "rotate(-20 64 65)" });
      addShape(svg, "path", { d: "M18 29 C28 16 43 15 53 27", fill: "none", stroke: "#f9a8d4", "stroke-width": "5", "stroke-linecap": "round" });
    } else if (kind === "puzzle") {
      addShape(svg, "path", { d: "M22 24 H42 C42 15 58 15 58 24 H78 V44 C88 44 88 60 78 60 V78 H58 C58 68 42 68 42 78 H22 V58 C32 58 32 44 22 44 Z", fill: "#ccfbf1", stroke: "#134e4a", "stroke-width": "5", "stroke-linejoin": "round" });
      addShape(svg, "path", { d: "M50 25 V77 M23 51 H79", stroke: "#134e4a", "stroke-width": "4", "stroke-linecap": "round" });
      addShape(svg, "circle", { cx: "38", cy: "38", r: "5", fill: "#0f766e" });
      addShape(svg, "circle", { cx: "64", cy: "66", r: "5", fill: "#0f766e" });
    } else {
      addShape(svg, "path", { d: "M50 10 L61 36 L90 39 L68 58 L75 87 L50 72 L25 87 L32 58 L10 39 L39 36 Z", fill: "#fff7ad", stroke: "#92400e", "stroke-width": "5", "stroke-linejoin": "round" });
      addShape(svg, "path", { d: "M34 48 L48 57 L69 35", fill: "none", stroke: "#f97316", "stroke-width": "6", "stroke-linecap": "round", "stroke-linejoin": "round" });
    }
    return svg;
  }

  function buildCard(item, pairId) {
    var card = document.createElement("button");
    card.className = "card";
    card.type = "button";
    card.dataset.pairId = String(pairId);
    card.setAttribute("aria-label", "Hidden card");

    var inner = document.createElement("span");
    inner.className = "card-inner";

    var back = document.createElement("span");
    back.className = "face back";
    var backIcon = document.createElement("span");
    backIcon.className = "back-icon";
    backIcon.textContent = "?";
    var backLabel = document.createElement("span");
    backLabel.textContent = "Memory";
    back.appendChild(backIcon);
    back.appendChild(backLabel);

    var front = document.createElement("span");
    front.className = "face front";
    front.style.background = item.color;
    if (item.light) front.dataset.light = "1";

    var picture = createPicture(item.art);
    var name = document.createElement("span");
    name.className = "name";
    name.textContent = item.name;
    var hint = document.createElement("span");
    hint.className = "hint";
    hint.textContent = "Remember me";

    var check = document.createElement("span");
    check.className = "check";
    check.textContent = "✓";

    front.appendChild(picture);
    front.appendChild(name);
    front.appendChild(hint);
    inner.appendChild(back);
    inner.appendChild(front);
    card.appendChild(inner);
    card.appendChild(check);

    card.addEventListener("click", function () { revealCard(card, item); });
    return card;
  }

  function cleanName(value, fallback) {
    var v = String(value || "").replace(/\s+/g, " ").trim().slice(0, 24);
    return v || fallback;
  }

  function renderScores() {
    els.nameP1.textContent = state.players[0];
    els.nameP2.textContent = state.players[1];
    els.pairsP1.textContent = String(state.pairs[0]);
    els.pairsP2.textContent = String(state.pairs[1]);
    els.scoreP1.classList.toggle("is-turn", state.current === 0 && state.phase === "playing");
    els.scoreP2.classList.toggle("is-turn", state.current === 1 && state.phase === "playing");
    els.captionP1.textContent = (state.current === 0 && state.phase === "playing") ? "Your turn" : "";
    els.captionP2.textContent = (state.current === 1 && state.phase === "playing") ? "Your turn" : "";
  }

  function startPreview() {
    state.phase = "preview";
    state.locked = true;
    var secondsLeft = PREVIEW_SECONDS;
    els.previewCounter.textContent = String(secondsLeft);
    els.previewOverlay.hidden = false;

    state.previewInterval = setInterval(function () {
      secondsLeft -= 1;
      els.previewCounter.textContent = String(Math.max(0, secondsLeft));
      if (secondsLeft <= 0) endPreview();
    }, 1000);

    state.previewClickHandler = function () { endPreview(); };
    setTimeout(function () {
      if (state.phase === "preview" && state.previewClickHandler) {
        document.addEventListener("click", state.previewClickHandler);
      }
    }, 150);
  }

  function cancelPreview() {
    if (state.previewInterval) {
      clearInterval(state.previewInterval);
      state.previewInterval = null;
    }
    if (state.previewClickHandler) {
      document.removeEventListener("click", state.previewClickHandler);
      state.previewClickHandler = null;
    }
    els.previewOverlay.hidden = true;
  }

  function endPreview() {
    if (state.phase !== "preview") return;
    cancelPreview();
    var revealed = els.board.querySelectorAll(".card.revealed");
    revealed.forEach(function (c) { c.classList.remove("revealed"); });
    state.phase = "playing";
    setTimeout(function () {
      state.locked = false;
      renderScores();
    }, FLIP_TRANSITION_MS);
  }

  function startRound() {
    cancelPreview();
    state.phase = "preview";
    state.current = 0;
    state.pairs = [0, 0];
    state.revealed = [];
    state.locked = true;
    els.endScreen.hidden = true;

    var deck = shuffle(
      ITEMS.flatMap(function (item, idx) {
        return [{ item: item, pairId: idx }, { item: item, pairId: idx }];
      })
    );

    var frag = document.createDocumentFragment();
    for (var i = 0; i < deck.length; i++) {
      var cardEl = buildCard(deck[i].item, deck[i].pairId);
      cardEl.classList.add("revealed"); // peek face-up
      frag.appendChild(cardEl);
    }
    els.board.replaceChildren(frag);
    renderScores();
    startPreview();
  }

  function revealCard(card, item) {
    if (state.phase !== "playing") return;
    if (state.locked) return;
    if (card.classList.contains("revealed") || card.classList.contains("matched")) return;

    card.classList.add("revealed");
    card.setAttribute("aria-label", item.name + " card");
    state.revealed.push({ card: card, item: item });

    if (state.revealed.length === 2) {
      checkPair();
    }
  }

  function checkPair() {
    var first = state.revealed[0];
    var second = state.revealed[1];
    var matched = first.card.dataset.pairId === second.card.dataset.pairId;

    if (matched) {
      var winnerClass = state.current === 0 ? "matched--p1" : "matched--p2";
      first.card.classList.add("matched", winnerClass);
      second.card.classList.add("matched", winnerClass);
      first.card.disabled = true;
      second.card.disabled = true;
      state.revealed = [];
      state.pairs[state.current] += 1;
      renderScores();
      if (state.pairs[0] + state.pairs[1] === PAIR_COUNT) {
        // End game — handled in Task 7
        endGame();
      }
    } else {
      state.locked = true;
      first.card.classList.add("shake");
      second.card.classList.add("shake");
      setTimeout(function () {
        first.card.classList.remove("revealed", "shake");
        second.card.classList.remove("revealed", "shake");
        first.card.setAttribute("aria-label", "Hidden card");
        second.card.setAttribute("aria-label", "Hidden card");
        state.revealed = [];
        state.current = 1 - state.current; // switch turn
        state.locked = false;
        renderScores();
      }, FLIP_BACK_DELAY);
    }
  }

  // Stub — full implementation lands in Task 7
  function endGame() {
    state.phase = "ended";
    renderScores();
  }

  els.setupForm.addEventListener("submit", function (ev) {
    ev.preventDefault();
    state.players = [
      cleanName(els.p1Input.value, "Player 1"),
      cleanName(els.p2Input.value, "Player 2"),
    ];
    els.setup.hidden = true;
    els.play.hidden = false;
    startRound();
  });

  els.restartBtn.addEventListener("click", startRound);
  els.resetBtn.addEventListener("click", function () {
    state.phase = "setup";
    els.endScreen.hidden = true;
    els.play.hidden = true;
    els.setup.hidden = false;
  });

  // First load — show setup
})();
</script>
</body>
</html>
```

- [ ] **Step 2: Smoke check — setup screen**

Visit `http://localhost:8000/games/memory-match-duel.html`. Verify:
- Setup card centered, with the two-cards-vs SVG, "Memory Match Duel 👬" title, two name inputs (mint and peach borders), and a coral "Start Duel ▶" button.
- Both inputs are empty with placeholder "Player 1" / "Player 2".
- Type "Alice" in P1 and leave P2 blank. Click Start Duel.
- Setup hides; play screen appears. Score bar shows "Alice — 0  vs  Player 2 — 0" (P2 fell back to default).

- [ ] **Step 3: Smoke check — peek + first turn**

After clicking Start:
- All 16 cards face-up for 3s under the pulsing 3-counter overlay.
- Click anywhere → peek ends early; cards flip face-down.
- Score bar shows P1 (mint) glowing with "Your turn"; P2 has no glow.
- Tap a card → it flips. Tap a second card.
  - **Match:** ✓ check icon appears; both cards lock with mint tint; P1 score → 1; P1 still glowing ("Your turn" still on P1); able to pick another two cards.
  - **No match:** both cards shake; ~900ms later they flip back; turn switches — P2 (peach) is now glowing with "Your turn".

- [ ] **Step 4: Smoke check — toolbar**

- "Restart round" → resets to a fresh peek with the same names; scores back to 0–0; current turn back to P1.
- "New players" → returns to the setup screen with the names you entered still in the inputs.
- "Home" → returns to `index.html`.

- [ ] **Step 5: Smoke check — completing the game**

Play through to all 8 pairs matched. The end-screen stub fires; nothing visible changes (the stub just sets phase to "ended" — the real end screen is Task 7). Confirm no JS errors in the console after the last match. The score bar's "Your turn" caption disappears (because phase is no longer "playing").

- [ ] **Step 6: Commit**

```bash
cd /Users/dio/works/chun-games
git add games/memory-match-duel.html
git commit -m "$(cat <<'EOF'
feat(memory-match-duel): add 2-player setup + play screen

Forks the card art and animations from games/memory-match.html, drops
the solo timer/moves/best-score logic, and adds:
- Setup screen with two name inputs (defaults: Player 1 / Player 2)
- Score bar with mint pill (P1) vs peach pill (P2), glowing the
  current player's pill with a "Your turn" caption
- 3-second peek countdown (skip on tap), 4x4 grid, flip + shake
  animations preserved from the solo game
- Turn-taking: match keeps the turn and tints locked cards in the
  player's color; mismatch flips back and switches the turn after
  900ms with input lockout during the animation

End screen stub fires on game-over; full end screen + confetti land
in a follow-up commit.
EOF
)"
```

---

## Task 7: Memory Match Duel — end screen + confetti

**Files:**
- Modify: `/Users/dio/works/chun-games/games/memory-match-duel.html`

Replace the `endGame()` stub with the real end screen. Add CSS-only confetti that bursts on a win (no confetti on tie).

- [ ] **Step 1: Add end-screen CSS + confetti keyframes**

In the `<style>` block of `games/memory-match-duel.html`, find this line:

```css
    /* ===== End screen — content lives here, confetti added in Task 7 ===== */

    #end-screen[hidden] { display: none !important; }
```

Replace with:

```css
    /* ===== End screen ===== */

    #end-screen {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 18px;
      padding: 24px;
      background: rgba(42, 42, 58, 0.9);
      color: #fff;
      text-align: center;
    }
    #end-screen[hidden] { display: none !important; }
    #end-screen h2 {
      margin: 0;
      font-size: clamp(32px, 9vw, 54px);
      font-weight: 900;
    }
    #end-score {
      font-size: clamp(22px, 5vw, 32px);
      font-weight: 800;
      font-variant-numeric: tabular-nums;
      display: flex;
      gap: 10px;
      align-items: baseline;
      flex-wrap: wrap;
      justify-content: center;
    }
    #end-score .p1 { color: #b8e8d4; }
    #end-score .p2 { color: #ffd6b3; }
    #end-score .em-dash { color: #fff; opacity: 0.6; }
    #end-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }

    /* Confetti — 24 colored squares fall + spin */
    #confetti {
      position: fixed;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 60;
    }
    #confetti[hidden] { display: none !important; }
    .confetti-piece {
      position: absolute;
      top: -20px;
      width: 12px;
      height: 16px;
      animation-name: confetti-fall;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
      will-change: transform, opacity;
    }
    @keyframes confetti-fall {
      0%   { transform: translate3d(0, -10vh, 0) rotate(0deg); opacity: 1; }
      100% { transform: translate3d(var(--drift, 0px), 110vh, 0) rotate(720deg); opacity: 0.9; }
    }
```

- [ ] **Step 2: Add the end-screen markup placeholder**

Find the existing `<section id="end-screen" hidden></section>` line in the file. Replace it with:

```html
  <section id="end-screen" hidden role="dialog" aria-labelledby="end-headline">
    <h2 id="end-headline">🎉 Winner!</h2>
    <p id="end-score" aria-live="polite">
      <span class="p1" id="end-name-p1">Player 1</span>
      <strong id="end-pairs-p1">0</strong>
      <span class="em-dash">—</span>
      <strong id="end-pairs-p2">0</strong>
      <span class="p2" id="end-name-p2">Player 2</span>
    </p>
    <div id="end-buttons">
      <button class="btn btn--mint btn--lg" type="button" id="end-play-again">Play Again</button>
      <button class="btn btn--peach btn--lg" type="button" id="end-new-players">New Players</button>
    </div>
  </section>
</main>

<div id="confetti" hidden aria-hidden="true"></div>
```

(Replacing the previous `<section id="end-screen" hidden></section>` and inserting the confetti container after the closing `</main>`.)

- [ ] **Step 3: Wire the new elements into the JS**

In the `els` object (inside the IIFE), find:

```js
    endScreen: document.getElementById("end-screen"),
```

Replace with:

```js
    endScreen: document.getElementById("end-screen"),
    endHeadline: document.getElementById("end-headline"),
    endNameP1: document.getElementById("end-name-p1"),
    endNameP2: document.getElementById("end-name-p2"),
    endPairsP1: document.getElementById("end-pairs-p1"),
    endPairsP2: document.getElementById("end-pairs-p2"),
    endPlayAgain: document.getElementById("end-play-again"),
    endNewPlayers: document.getElementById("end-new-players"),
    confetti: document.getElementById("confetti"),
```

- [ ] **Step 4: Replace the `endGame()` stub with the real implementation, and add `launchConfetti()`**

Find:

```js
  // Stub — full implementation lands in Task 7
  function endGame() {
    state.phase = "ended";
    renderScores();
  }
```

Replace with:

```js
  function launchConfetti() {
    var palette = ["#b8e8d4", "#ffd6b3", "#a4d8f5", "#fff2a6", "#ffb3c1"];
    var pieces = 36;
    els.confetti.replaceChildren();
    for (var i = 0; i < pieces; i++) {
      var piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = (Math.random() * 100) + "vw";
      piece.style.background = palette[i % palette.length];
      var drift = (Math.random() * 200 - 100).toFixed(0);
      piece.style.setProperty("--drift", drift + "px");
      var duration = (2.4 + Math.random() * 1.6).toFixed(2);
      var delay = (Math.random() * 0.5).toFixed(2);
      piece.style.animationDuration = duration + "s";
      piece.style.animationDelay = delay + "s";
      piece.style.transform = "rotate(" + (Math.random() * 360).toFixed(0) + "deg)";
      els.confetti.appendChild(piece);
    }
    els.confetti.hidden = false;
    setTimeout(function () { els.confetti.hidden = true; }, 4500);
  }

  function endGame() {
    state.phase = "ended";
    renderScores(); // clears "Your turn" captions

    var p1 = state.pairs[0];
    var p2 = state.pairs[1];
    var winner = -1;
    if (p1 > p2) winner = 0;
    else if (p2 > p1) winner = 1;

    els.endNameP1.textContent = state.players[0];
    els.endNameP2.textContent = state.players[1];
    els.endPairsP1.textContent = String(p1);
    els.endPairsP2.textContent = String(p2);

    if (winner === -1) {
      els.endHeadline.textContent = "🤝 It's a tie!";
    } else {
      els.endHeadline.textContent = "🎉 " + state.players[winner] + " wins!";
      launchConfetti();
    }

    els.endScreen.hidden = false;
    els.endPlayAgain.focus();
  }
```

- [ ] **Step 5: Wire the end-screen buttons**

Find the existing event-listener block at the bottom of the IIFE:

```js
  els.restartBtn.addEventListener("click", startRound);
  els.resetBtn.addEventListener("click", function () {
    state.phase = "setup";
    els.endScreen.hidden = true;
    els.play.hidden = true;
    els.setup.hidden = false;
  });
```

Replace with:

```js
  els.restartBtn.addEventListener("click", startRound);
  els.resetBtn.addEventListener("click", function () {
    state.phase = "setup";
    els.endScreen.hidden = true;
    els.confetti.hidden = true;
    els.play.hidden = true;
    els.setup.hidden = false;
  });

  els.endPlayAgain.addEventListener("click", function () {
    els.endScreen.hidden = true;
    els.confetti.hidden = true;
    startRound();
  });
  els.endNewPlayers.addEventListener("click", function () {
    state.phase = "setup";
    els.endScreen.hidden = true;
    els.confetti.hidden = true;
    els.play.hidden = true;
    els.setup.hidden = false;
  });
```

- [ ] **Step 6: Smoke check — winning end screen**

Play a full duel and engineer a win for one player (e.g., let P1 match all 8 pairs). Verify:
- Dark overlay covers the page.
- Headline reads `"🎉 Alice wins!"` (or whichever name P1 was).
- Score line reads `"Alice 8 — 0 Bob"` with Alice's name in mint, Bob's in peach.
- Confetti pieces fall from the top, drifting and spinning, then disappear after ~4–5 seconds.
- Two buttons below the score: "Play Again" (mint) and "New Players" (peach).
- "Play Again" → end screen and confetti hide; new round starts with the same names.
- "New Players" → returns to setup screen.

- [ ] **Step 7: Smoke check — tie end screen**

Engineer a 4–4 game (each player finds exactly four pairs alternately). Verify:
- Headline reads `"🤝 It's a tie!"`
- Score line reads `"<P1> 4 — 4 <P2>"` with the two player colors.
- **No confetti.**
- Both buttons present and working.

- [ ] **Step 8: Smoke check — focus + accessibility**

After the end screen appears, the "Play Again" button has focus (visible focus ring). Pressing Tab cycles through "Play Again" → "New Players". Pressing Enter on either fires the action.

- [ ] **Step 9: Commit**

```bash
cd /Users/dio/works/chun-games
git add games/memory-match-duel.html
git commit -m "$(cat <<'EOF'
feat(memory-match-duel): add winner end screen + confetti

- End screen shows the final score with each player's name in their
  pill color, plus a winner headline ("🎉 <name> wins!") or a tie
  message ("🤝 It's a tie!")
- 36 falling/spinning CSS-only confetti pieces on a win, no confetti
  on a tie
- Play Again resets the round with the same names; New Players
  returns to the setup screen
EOF
)"
```

---

## Task 8: Update README + add Multi-Player Games section

**Files:**
- Modify: `/Users/dio/works/chun-games/README.md`

The existing README has a "Games" table and per-game sections, plus a "Run Locally" block listing all the game files. Add a new top-level "Multi-Player Games" section, mention the new chrome pages, and add a row for *Memory Match Duel* in a new table.

- [ ] **Step 1: Update the top description block**

Find the very top of `README.md` (lines 1–9):

```markdown
# Chun-Ga 🎮

A small playground of browser games built **to learn coding and have fun — using AI coding agents** (Claude Code + the Superpowers plugin) as collaborators.

Every game is static HTML with a shared local high-score helper: zero build step, no dependencies to install. Open in any modern browser and play.

The home page ([`index.html`](./index.html)) is a catalog with thumbnails linking to each game:

![Game catalog home page](docs/screenshots/catalog.png)
```

Replace with:

```markdown
# WiGa — William's Games 🎮

A small playground of browser games built **to learn coding and have fun — using AI coding agents** (Claude Code + the Superpowers plugin) as collaborators.

Every game is static HTML with a shared local high-score helper: zero build step, no dependencies to install. Open in any modern browser and play.

The site is split into four sections, all reachable from the top nav on every chrome page:

- **[Single Player](./index.html)** — the main games catalog (10 games today)
- **[Multi-Player](./multiplayer.html)** — pass-and-play games for two on one screen
- **[High Scores](./high-scores.html)** — best runs saved on this device, one tile per game
- **[Donate](./donate.html)** — a thank-you page with a coffee-tip link

![Game catalog home page](docs/screenshots/catalog.png)
```

- [ ] **Step 2: Insert the Multi-Player Games section**

Find the "Local High Scores" header in the README (the `## Local High Scores` heading near the bottom). Immediately **before** that heading, insert this new section:

```markdown
## Multi-Player Games

| Game | File | Style |
| --- | --- | --- |
| [Memory Match Duel](#memory-match-duel) | [`games/memory-match-duel.html`](./games/memory-match-duel.html) | 2D · CSS · Pass-and-Play |

---

### Memory Match Duel

A two-player twist on the Memory Match grid: same 4×4 board, same 8 idea pairs, but you take turns and whoever finds more pairs wins.

**Controls:** mouse / touch — both players share one device. Hand it back and forth on each turn switch.

**Highlights**
- Two name inputs at the start (defaults: "Player 1", "Player 2"); each player gets a color (mint vs peach)
- Score bar with a glowing "Your turn" pill shows whose move it is
- Match → keep the turn and tint the locked cards in your color; miss → flip back and pass the device
- 3-second peek at the start of every round so both players can plan
- Confetti shower on a win, special "It's a tie!" message on 4–4
- No leaderboard — pass-and-play results aren't saved as personal bests

▶ [Open `games/memory-match-duel.html`](./games/memory-match-duel.html)

---
```

- [ ] **Step 3: Update the "Run Locally" block**

Find the existing "Run Locally" block (the `## Run Locally` section near the bottom). Replace its `open` snippet with the updated list including the new pages and game:

```markdown
## Run Locally

No build step — just open the HTML files:

```sh
open index.html                        # game catalog (start here)
open multiplayer.html                  # 2-player games
open high-scores.html                  # leaderboards
open donate.html                       # thank-you page

open games/type2build.html             # typing game
open games/zoomy-car.html              # racing game
open games/child-feeder.html           # child-feeder game
open games/dragon.html                 # dragon snake game
open games/car-memory.html             # memory game
open games/engine-memory.html          # engine-sound memory game
open games/pit-stop-crew.html          # pit-crew sequence memory game
open games/memory-match.html           # creative memory game
open games/guess-who.html              # deduction game
open games/tangram-puzzles.html        # tangram puzzle game
open games/memory-match-duel.html      # 2-player memory match
```

Or serve the directory with any static file server, e.g.:

```sh
python3 -m http.server
```
```

- [ ] **Step 4: Smoke check**

Open `README.md` in a Markdown previewer (or on GitHub once pushed). Verify:
- The new title is "WiGa — William's Games 🎮"
- The four-section nav block at the top is present with relative links.
- A "Multi-Player Games" section exists with the table, the Memory Match Duel sub-section, and the "Open" link.
- The "Run Locally" block lists all four chrome pages and the duel game.

- [ ] **Step 5: Commit**

```bash
cd /Users/dio/works/chun-games
git add README.md
git commit -m "$(cat <<'EOF'
docs(readme): rebrand as WiGa, document the new 4-section site

- Rename top-level title to WiGa — William's Games
- Add a top nav-summary block linking to all four chrome pages
- Add a new Multi-Player Games section + Memory Match Duel entry
- Update the "Run Locally" snippet with the new pages and game
EOF
)"
```

---

## Task 9: Cross-page verification + cleanup

**Files:**
- (none expected to change — this task is a final walk-through)

This is the spec's full verification plan run end-to-end. If anything is off, fix it inline in this task and commit a small follow-up.

- [ ] **Step 1: Chrome present and consistent on every page**

For each of `index.html`, `multiplayer.html`, `high-scores.html`, `donate.html`:
1. Sticky header at the top.
2. Active nav pill highlighted in mint with darker border.
3. Other three nav pills hover to peach.
4. Footer present at the bottom with the credit line + GitHub/README links.
5. Page background is the cream → sky-blue gradient.
6. No DevTools console errors.
7. At 375px viewport, all four nav pills visible without horizontal scroll.

- [ ] **Step 2: Inter-page navigation**

From any chrome page, click each nav link in turn. The page changes; the new active link is highlighted; the URL bar reflects the new file name.

- [ ] **Step 3: Home page hero CTAs**

On `index.html`:
1. Click "Play Single-Player ▶" → page scrolls down to the "All Games" heading.
2. Click "Try Multi-Player 👬" → navigates to `multiplayer.html` (Multi-Player pill active).

- [ ] **Step 4: All 10 single-player games still load**

From `index.html`, click "Play →" on every card. Each game's existing page loads without modification. (No regression — the games are unchanged.) Hit Back to return to the home page; the home page still renders correctly.

- [ ] **Step 5: Memory Match Duel — happy path**

Open `multiplayer.html`, click "Play →" on the duel card. Play a full game (8 pairs). Verify:
- Setup → play → end screen (winner or tie) → confetti only on win.
- "Play Again" works with same names.
- "New Players" returns to setup.
- "Home" link returns to `index.html`.
- "Restart round" mid-game resets scores and shuffles new positions.

- [ ] **Step 6: High Scores page round-trip**

1. Use the "Clear all scores" link on `high-scores.html` to start clean — confirm the prompt → all 10 tiles say "No scores yet".
2. Open three different solo games (e.g., dragon, type2build, memory-match), play each, and let each record a high score.
3. Return to `high-scores.html` — those three tiles now show populated top-5 lists; the other 7 still show the empty state.

- [ ] **Step 7: Donate page**

Visit `donate.html`. Verify:
- The "Buy us a coffee ☕" button has the placeholder URL with the `<!-- TODO ... -->` comment intact above it (view source to confirm).
- Clicking the button opens the placeholder URL in a new tab.

- [ ] **Step 8: Optional fix-up commit**

If any small issues surfaced during the walk-through, fix them and commit:

```bash
cd /Users/dio/works/chun-games
git add -A
git status        # confirm only the intended files
git commit -m "fix(site): minor polish from final cross-page walk-through"
```

If nothing needs fixing, skip this step — the plan is done.

- [ ] **Step 9: Stop the dev server**

If `./run.sh 8000` is still running in the background, stop it (`Ctrl-C` in its terminal, or `kill %1` if it was started with `&`).

---

## Done

After Task 9, the new site is live locally:

- **WiGa** branding across the top of every page.
- Four reachable sections: Single Player (catalog), Multi-Player (with Memory Match Duel), High Scores (10 leaderboards), Donate (placeholder coffee link).
- Memory Match Duel is a fully working pass-and-play 2-player game.
- README documents the new structure.

Total commits: **8** (one per Task 1–8) plus an optional polish commit from Task 9.

The donation URL in `donate.html` is still a placeholder — replace it with the real link when you have it.
