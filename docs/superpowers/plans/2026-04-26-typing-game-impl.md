# Chun-Ga Typing Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-file HTML5 typing game where car-themed words color in sections of a grey city skyline, racing a 90-second global timer.

**Architecture:** A single `index.html` containing inline `<style>`, DOM shell, and `<script>` IIFE. SVG-based city with `data-section-id` rectangles. `requestAnimationFrame` ticker for timers. Vanilla JS, zero dependencies, zero build step.

**Tech Stack:** HTML5, CSS3, vanilla ES2015+ JavaScript, inline SVG. No frameworks, no build tools, no external assets.

---

## Reference

- Spec: `docs/superpowers/specs/2026-04-26-typing-game-design.md`
- All work happens in a single file: `/Users/dio/works/chun-ga/index.html`

## Verification model

The spec opted out of an automated test harness. Each task ends with a **manual smoke check** in a browser. To run any task's verification:

```bash
open /Users/dio/works/chun-ga/index.html      # macOS
# or
xdg-open /Users/dio/works/chun-ga/index.html  # Linux
```

The page reloads on F5 (or Cmd-R). No server is needed.

## DOM hygiene

The implementation never calls `innerHTML` or `insertAdjacentHTML`. All dynamic DOM updates use `textContent`, `createElement`, `appendChild`, `replaceChildren`, and `setAttribute`. There's no user-supplied or remote content, but this keeps the surface trivially XSS-proof.

---

## Task 1: Scaffold `index.html` skeleton

**Files:**
- Create: `/Users/dio/works/chun-ga/index.html`

- [ ] **Step 1: Define the smoke check**

After this task is done, opening `index.html` in a browser must show:
- A page with a sky-blue background filling the viewport
- A header strip showing "90.0s" on the left and "0 / 13" on the right
- A white strip at the bottom (empty word-area)
- The page title in the browser tab reads "Chun-Ga"
- No JavaScript errors in the console

- [ ] **Step 2: Write the file**

Create `/Users/dio/works/chun-ga/index.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
  <title>Chun-Ga</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      background: #87ceeb;
      color: #222;
      overflow: hidden;
    }
    body {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }
    header {
      flex: 0 0 auto;
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(0,0,0,0.15);
      color: #fff;
      font-variant-numeric: tabular-nums;
      font-size: clamp(14px, 3.5vw, 18px);
    }
    main {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
      align-items: stretch;
      justify-content: center;
      padding: 8px;
    }
    #word-area {
      flex: 0 0 auto;
      padding: 12px 16px 16px;
      background: #fff;
      box-shadow: 0 -2px 12px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <header>
    <div id="global-timer">90.0s</div>
    <div id="stats-mini">0 / 13</div>
  </header>
  <main id="city"></main>
  <section id="word-area"></section>
  <script>
    (function () {
      "use strict";
      // Game logic added in later tasks.
    })();
  </script>
</body>
</html>
```

- [ ] **Step 3: Run the smoke check**

Open the file. Confirm: blue background, header shows "90.0s" and "0 / 13", word-area strip at the bottom is white. Console clean.

- [ ] **Step 4: Commit**

```bash
cd /Users/dio/works/chun-ga
git add index.html
git commit -m "scaffold: empty index.html shell with header / main / word-area"
```

---

## Task 2: Build the city SVG with 13 grey sections

**Files:**
- Modify: `/Users/dio/works/chun-ga/index.html` (replace contents of `<main id="city">`, append CSS)

- [ ] **Step 1: Define the smoke check**

After this task, opening the page shows a city skyline of 13 grey buildings of varying heights against the sky. A simple crane outline sits behind one of the taller buildings. A grey ground strip runs along the bottom of the SVG. No buildings are colored yet.

- [ ] **Step 2: Replace `<main id="city">` block**

Find this in `index.html`:

```html
<main id="city"></main>
```

Replace with:

```html
<main id="city">
  <svg id="city-svg" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMax meet" aria-label="city skyline">
    <!-- ground strip -->
    <rect x="0" y="380" width="1000" height="20" fill="#7d8a96" />

    <!-- decorative crane behind tall building 5 -->
    <line x1="430" y1="380" x2="430" y2="40" stroke="#445566" stroke-width="3" />
    <line x1="430" y1="50" x2="560" y2="50" stroke="#445566" stroke-width="3" />
    <line x1="540" y1="50" x2="540" y2="90" stroke="#445566" stroke-width="2" />

    <!-- 13 building sections, all grey -->
    <rect data-section-id="0"  x="20"  y="240" width="70"  height="140" fill="#aaaaaa" stroke="#333" stroke-width="2" />
    <rect data-section-id="1"  x="90"  y="180" width="80"  height="200" fill="#aaaaaa" stroke="#333" stroke-width="2" />
    <rect data-section-id="2"  x="170" y="220" width="60"  height="160" fill="#aaaaaa" stroke="#333" stroke-width="2" />
    <rect data-section-id="3"  x="230" y="140" width="90"  height="240" fill="#aaaaaa" stroke="#333" stroke-width="2" />
    <rect data-section-id="4"  x="320" y="200" width="70"  height="180" fill="#aaaaaa" stroke="#333" stroke-width="2" />
    <rect data-section-id="5"  x="390" y="100" width="80"  height="280" fill="#aaaaaa" stroke="#333" stroke-width="2" />
    <rect data-section-id="6"  x="470" y="160" width="80"  height="220" fill="#aaaaaa" stroke="#333" stroke-width="2" />
    <rect data-section-id="7"  x="550" y="220" width="70"  height="160" fill="#aaaaaa" stroke="#333" stroke-width="2" />
    <rect data-section-id="8"  x="620" y="180" width="80"  height="200" fill="#aaaaaa" stroke="#333" stroke-width="2" />
    <rect data-section-id="9"  x="700" y="120" width="85"  height="260" fill="#aaaaaa" stroke="#333" stroke-width="2" />
    <rect data-section-id="10" x="785" y="200" width="70"  height="180" fill="#aaaaaa" stroke="#333" stroke-width="2" />
    <rect data-section-id="11" x="855" y="240" width="70"  height="140" fill="#aaaaaa" stroke="#333" stroke-width="2" />
    <rect data-section-id="12" x="925" y="180" width="55"  height="200" fill="#aaaaaa" stroke="#333" stroke-width="2" />

    <!-- decorative window dots (purely visual, never colored) -->
    <g fill="#ffffff" opacity="0.45">
      <circle cx="55"  cy="280" r="3" /><circle cx="55"  cy="305" r="3" /><circle cx="55"  cy="330" r="3" />
      <circle cx="265" cy="200" r="3" /><circle cx="265" cy="230" r="3" /><circle cx="285" cy="200" r="3" /><circle cx="285" cy="230" r="3" />
      <circle cx="430" cy="180" r="3" /><circle cx="430" cy="220" r="3" /><circle cx="430" cy="260" r="3" />
      <circle cx="660" cy="220" r="3" /><circle cx="660" cy="250" r="3" /><circle cx="680" cy="220" r="3" />
      <circle cx="745" cy="180" r="3" /><circle cx="745" cy="220" r="3" /><circle cx="745" cy="260" r="3" />
    </g>
  </svg>
</main>
```

Append inside the existing `<style>` block (before `</style>`):

```css
#city-svg {
  width: 100%;
  height: 100%;
  max-height: 100%;
  display: block;
}
[data-section-id] {
  transition: fill 280ms ease-out;
}
```

- [ ] **Step 3: Run the smoke check**

Reload the page. You should see 13 distinct grey buildings of varied heights silhouetted against the sky, the crane behind the tall building, ground at the bottom. Resize the window — SVG scales smoothly.

- [ ] **Step 4: Commit**

```bash
cd /Users/dio/works/chun-ga
git add index.html
git commit -m "feat: add city skyline SVG with 13 grey sections"
```

---

## Task 3: Build the word-area UI (display, timer bar, input)

**Files:**
- Modify: `/Users/dio/works/chun-ga/index.html` (replace `<section id="word-area">`, append CSS)

- [ ] **Step 1: Define the smoke check**

After this task, the bottom strip shows a centered word placeholder, a thin progress bar beneath it, and an input field. The input is auto-focused on page load. Tapping the input on a phone brings up the virtual keyboard. Text inside the input is monospace and large enough to read on mobile.

- [ ] **Step 2: Replace `<section id="word-area">` and add an end-screen**

Find:

```html
<section id="word-area"></section>
```

Replace with:

```html
<section id="word-area">
  <div id="word-display" aria-live="polite">&mdash;</div>
  <div id="word-timer-bar"><div id="word-timer-fill"></div></div>
  <input
    id="word-input"
    type="text"
    inputmode="latin"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
    autofocus
    aria-label="type the word"
  />
</section>
<section id="end-screen" hidden>
  <h2 id="end-headline"></h2>
  <ul id="end-stats"></ul>
  <button id="play-again" type="button">Play Again</button>
</section>
```

- [ ] **Step 3: Append CSS**

Append the following inside the existing `<style>` block (before `</style>`):

```css
#word-area {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
}
#word-display {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: clamp(28px, 8vw, 44px);
  letter-spacing: 0.08em;
  text-align: center;
  font-weight: 700;
  user-select: none;
  min-height: 1.2em;
  transition: transform 120ms ease;
}
#word-display .typed { color: #16a34a; }
#word-display .untyped { color: #888; }
#word-display.flash-red { animation: flashRed 220ms ease; }
@keyframes flashRed {
  0%   { color: #dc2626; transform: translateX(0); }
  25%  { transform: translateX(-4px); }
  50%  { transform: translateX(4px); }
  100% { transform: translateX(0); }
}
#word-timer-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}
#word-timer-fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #16a34a, #facc15, #ef4444);
  transition: width 120ms linear;
}
#word-input {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  font-size: clamp(20px, 5.5vw, 28px);
  padding: 12px 14px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  text-align: center;
  letter-spacing: 0.08em;
  width: 100%;
}
#word-input:focus {
  border-color: #2563eb;
}
#end-screen {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.85);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  z-index: 10;
}
#end-screen[hidden] { display: none !important; }
#end-headline { font-size: clamp(28px, 8vw, 48px); margin: 0; }
#end-stats {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: clamp(16px, 4vw, 22px);
  text-align: center;
  font-variant-numeric: tabular-nums;
}
#end-stats li { padding: 4px 0; }
#play-again {
  font-size: clamp(18px, 5vw, 24px);
  padding: 12px 28px;
  border: none;
  border-radius: 999px;
  background: #2563eb;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  min-height: 48px;
}
#play-again:active { transform: translateY(1px); }
```

- [ ] **Step 4: Run the smoke check**

Reload. Bottom strip: large word placeholder ("—"), thin gradient bar, then a centered text input that's auto-focused. Type some letters — they appear in the input. Resize to 360px width: layout still readable, no horizontal scrollbar.

- [ ] **Step 5: Commit**

```bash
cd /Users/dio/works/chun-ga
git add index.html
git commit -m "feat: add word-area UI (display, timer bar, input) and end-screen markup"
```

---

## Task 4: Add constants and game state

**Files:**
- Modify: `/Users/dio/works/chun-ga/index.html` (inside the existing IIFE)

- [ ] **Step 1: Define the smoke check**

After this task, the IIFE defines `WORDS`, `PALETTE`, and a `state` object. We expose them temporarily to `window` for inspection: opening DevTools and typing `__chunga.WORDS.length` returns `48`, `__chunga.PALETTE.length` returns `8`, `__chunga.state.phase` returns `"idle"`.

- [ ] **Step 2: Replace the IIFE body**

Find:

```html
  <script>
    (function () {
      "use strict";
      // Game logic added in later tasks.
    })();
  </script>
```

Replace with:

```html
  <script>
    (function () {
      "use strict";

      const SECTION_COUNT = 13;
      const WORD_TIMER_PER_CHAR = 1.2;   // seconds per character
      const GLOBAL_TIMER_START = 90;     // seconds
      const TYPO_PENALTY = 2;            // seconds deducted from global timer per typo

      const WORDS = [
        "sedan","coupe","wagon","truck","tires","turbo","motor","drift","rally","viper",
        "hybrid","engine","piston","brakes","clutch","wheels","bumper","fender","mirror",
        "carbon","diesel","petrol","garage","tunnel","airbag","camaro","beetle","jaguar",
        "gasket","gearbox","chassis","exhaust","highway","traffic","license","mileage",
        "battery","sunroof","ferrari","mustang","porsche","shifter","muffler","antenna",
        "ignition","radiator","seatbelt","steering"
      ];

      const PALETTE = [
        "#e74c3c", "#3498db", "#f1c40f", "#27ae60",
        "#9b59b6", "#e67e22", "#1abc9c", "#e84393"
      ];

      const state = {
        phase: "idle",            // "idle" | "playing" | "ended"
        endReason: null,          // null | "win" | "timeout"
        wordQueue: [],
        sectionQueue: [],
        currentWord: null,
        wordTimer: 0,
        globalTimer: GLOBAL_TIMER_START,
        typos: 0,
        correctChars: 0,
        sectionsCompleted: 0,
        lastFrameMs: 0,
      };

      // Expose for manual smoke checks during development. Removed in Task 10.
      window.__chunga = { WORDS, PALETTE, state };
    })();
  </script>
```

- [ ] **Step 3: Run the smoke check**

Reload the page, open DevTools console:

```
__chunga.WORDS.length          // 48
__chunga.PALETTE.length        // 8
__chunga.state.phase           // "idle"
__chunga.state.globalTimer     // 90
__chunga.WORDS.every(w => w.length >= 5 && w.length <= 8)   // true
__chunga.WORDS.length === new Set(__chunga.WORDS).size       // true (no duplicates)
```

- [ ] **Step 4: Commit**

```bash
cd /Users/dio/works/chun-ga
git add index.html
git commit -m "feat: add WORDS, PALETTE, and game state constants"
```

---

## Task 5: Implement `startGame()` and `loadNextWord()`

**Files:**
- Modify: `/Users/dio/works/chun-ga/index.html` (extend IIFE)

- [ ] **Step 1: Define the smoke check**

After this task, calling `__chunga.startGame()` from the console:
- Picks 13 unique words from the list
- Sets `state.phase` to `"playing"`
- The word display shows the first word in grey untyped letters
- The input is empty and focused
- The header still shows `90.0s` (the timer hasn't started ticking yet — that's Task 8)
- The header shows `0 / 13`

- [ ] **Step 2: Add helpers, render functions, `startGame()`, and `loadNextWord()`**

Inside the IIFE, **after** the `state` declaration and **before** the `window.__chunga` line, add:

```javascript
      // ----- DOM lookups (cached once) -----
      const els = {
        globalTimer: document.getElementById("global-timer"),
        statsMini:   document.getElementById("stats-mini"),
        wordDisplay: document.getElementById("word-display"),
        wordFill:    document.getElementById("word-timer-fill"),
        input:       document.getElementById("word-input"),
        wordArea:    document.getElementById("word-area"),
        endScreen:   document.getElementById("end-screen"),
        endHeadline: document.getElementById("end-headline"),
        endStats:    document.getElementById("end-stats"),
        playAgain:   document.getElementById("play-again"),
        citySvg:     document.getElementById("city-svg"),
      };

      // ----- Pure helpers -----
      function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }

      function pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      function formatSeconds(s) {
        return (Math.max(0, s)).toFixed(1) + "s";
      }

      // ----- Render helpers (no innerHTML; build DOM nodes explicitly) -----
      function renderWordDisplay(typedLen) {
        const target = state.currentWord || "";
        const frag = document.createDocumentFragment();
        if (target.length === 0) {
          frag.appendChild(document.createTextNode("\u2014")); // em dash
        } else {
          for (let i = 0; i < target.length; i++) {
            const span = document.createElement("span");
            span.className = i < typedLen ? "typed" : "untyped";
            span.textContent = target[i];
            frag.appendChild(span);
          }
        }
        els.wordDisplay.replaceChildren(frag);
      }

      function renderTimers() {
        els.globalTimer.textContent = formatSeconds(state.globalTimer);
        els.statsMini.textContent = state.sectionsCompleted + " / " + SECTION_COUNT;
        const total = (state.currentWord ? state.currentWord.length : 1) * WORD_TIMER_PER_CHAR;
        const pct = Math.max(0, Math.min(100, (state.wordTimer / total) * 100));
        els.wordFill.style.width = pct + "%";
      }

      function resetCityToGrey() {
        const sections = els.citySvg.querySelectorAll("[data-section-id]");
        sections.forEach(s => s.setAttribute("fill", "#aaaaaa"));
      }

      // ----- Game lifecycle -----
      function startGame() {
        state.phase = "playing";
        state.endReason = null;
        state.wordQueue = shuffle(WORDS).slice(0, SECTION_COUNT);
        state.sectionQueue = shuffle(
          Array.from({ length: SECTION_COUNT }, (_, i) => i)
        );
        state.globalTimer = GLOBAL_TIMER_START;
        state.typos = 0;
        state.correctChars = 0;
        state.sectionsCompleted = 0;

        resetCityToGrey();
        els.endScreen.hidden = true;
        els.wordArea.hidden = false;
        els.input.value = "";

        loadNextWord();
        renderTimers();
        els.input.focus();
      }

      function loadNextWord() {
        if (state.wordQueue.length === 0) {
          // All sections completed — endGame is wired in Task 9.
          state.currentWord = null;
          renderWordDisplay(0);
          return;
        }
        state.currentWord = state.wordQueue.shift();
        state.wordTimer = state.currentWord.length * WORD_TIMER_PER_CHAR;
        els.input.value = "";
        renderWordDisplay(0);
        renderTimers();
      }
```

Then update the `window.__chunga` line to expose the new functions:

```javascript
      window.__chunga = { WORDS, PALETTE, state, startGame, loadNextWord };
```

- [ ] **Step 3: Run the smoke check**

Reload. Open console, run:

```
__chunga.startGame()
__chunga.state.phase                // "playing"
__chunga.state.wordQueue.length     // 12 (one popped into currentWord)
__chunga.state.currentWord          // some 5-8 char word
__chunga.state.sectionQueue.length  // 13
```

The word display shows a word in grey letters, the timer-fill bar is full, and the input is focused. (Header still shows 90.0s — RAF tick is Task 8.)

- [ ] **Step 4: Commit**

```bash
cd /Users/dio/works/chun-ga
git add index.html
git commit -m "feat: startGame and loadNextWord with render helpers"
```

---

## Task 6: Handle correct typing and complete sections

**Files:**
- Modify: `/Users/dio/works/chun-ga/index.html` (extend IIFE)

- [ ] **Step 1: Define the smoke check**

After this task, calling `__chunga.startGame()` from the console then typing the displayed word into the input:
- Each correct keystroke turns that letter green
- On the last correct keystroke, a randomly chosen grey building turns a colored fill from the palette
- The next word loads, input clears, header shows `1 / 13`
- `__chunga.state.correctChars` reflects the chars typed so far

- [ ] **Step 2: Add `completeSection()`, `onInput()`, and wire the input event**

Inside the IIFE, **after** `loadNextWord()` and **before** the `window.__chunga` line, add:

```javascript
      function completeSection() {
        if (state.sectionQueue.length === 0) return;
        const id = state.sectionQueue.shift();
        const el = els.citySvg.querySelector('[data-section-id="' + id + '"]');
        if (el) el.setAttribute("fill", pickRandom(PALETTE));
        state.sectionsCompleted += 1;
      }

      function onInput() {
        if (state.phase !== "playing" || !state.currentWord) return;
        const current = els.input.value;
        const target = state.currentWord;

        // Find longest valid prefix.
        let validLen = 0;
        while (
          validLen < current.length &&
          validLen < target.length &&
          current[validLen] === target[validLen]
        ) {
          validLen++;
        }

        if (validLen < current.length) {
          // Mistype handling lands in Task 7. For now, just truncate to keep
          // the input value consistent with what we display.
          els.input.value = current.slice(0, validLen);
          renderWordDisplay(validLen);
          return;
        }

        renderWordDisplay(current.length);

        if (current === target) {
          state.correctChars += target.length;
          completeSection();
          loadNextWord();
        }
      }

      // ----- Wire up DOM events -----
      els.input.addEventListener("input", onInput);
```

Update the `window.__chunga` line:

```javascript
      window.__chunga = { WORDS, PALETTE, state, startGame, loadNextWord, completeSection };
```

- [ ] **Step 3: Run the smoke check**

Reload. In console: `__chunga.startGame()`. Look at the displayed word, type it correctly into the input. As you type, letters turn green. On the final letter, a grey building turns colored, the word display swaps to the next word, header shows `1 / 13`. Type the next word too — another building colors in.

- [ ] **Step 4: Commit**

```bash
cd /Users/dio/works/chun-ga
git add index.html
git commit -m "feat: handle correct typing and color completed sections"
```

---

## Task 7: Mistype penalty (red flash + -2s on global timer)

**Files:**
- Modify: `/Users/dio/works/chun-ga/index.html` (replace mistype branch in `onInput`, add `flashRed`)

- [ ] **Step 1: Define the smoke check**

After this task, while playing: typing a wrong letter triggers a red shake/flash on the word display, the global timer in the header drops by exactly 2 seconds, `__chunga.state.typos` increments by 1, and the input value rolls back to the last correct prefix so you can retry the wrong letter without backspacing.

- [ ] **Step 2: Replace the mistype branch in `onInput`**

In the existing `onInput` function, find this block:

```javascript
        if (validLen < current.length) {
          // Mistype handling lands in Task 7. For now, just truncate to keep
          // the input value consistent with what we display.
          els.input.value = current.slice(0, validLen);
          renderWordDisplay(validLen);
          return;
        }
```

Replace with:

```javascript
        if (validLen < current.length) {
          els.input.value = current.slice(0, validLen);
          state.typos += 1;
          state.globalTimer = Math.max(0, state.globalTimer - TYPO_PENALTY);
          flashRed();
          renderWordDisplay(validLen);
          renderTimers();
          return;
        }
```

Add a `flashRed()` helper inside the IIFE near the other render helpers (e.g. after `renderTimers`):

```javascript
      function flashRed() {
        els.wordDisplay.classList.remove("flash-red");
        // Force reflow so the animation can replay if triggered rapidly.
        void els.wordDisplay.offsetWidth;
        els.wordDisplay.classList.add("flash-red");
      }
```

- [ ] **Step 3: Run the smoke check**

Reload. `__chunga.startGame()`. Note the global timer (e.g. `90.0s`). Type one wrong letter. Observe: word display flashes red and shakes, header global timer is now `88.0s`, `__chunga.state.typos === 1`. Type the correct letter — it lands as green normally.

Type many wrong letters in a row — each one drops the timer by 2s and the animation re-plays.

- [ ] **Step 4: Commit**

```bash
cd /Users/dio/works/chun-ga
git add index.html
git commit -m "feat: penalize mistypes with red flash and -2s on global timer"
```

---

## Task 8: Per-word timer + global timer ticker

**Files:**
- Modify: `/Users/dio/works/chun-ga/index.html` (add `tick()` and start RAF in `startGame`)

- [ ] **Step 1: Define the smoke check**

After this task: as soon as `__chunga.startGame()` is called, the header global timer starts counting down from 90.0s in real time. The thin word-timer bar below the word display shrinks from full to empty over the word's allotted time (`length × 1.2s`). If you stop typing and let the word timer hit zero, the next word loads automatically (the section stays grey). If the global timer reaches zero, the loop stops (end screen comes in Task 9 — for now confirm the loop halts).

- [ ] **Step 2: Add `tick()`**

Inside the IIFE, after `loadNextWord()` and before `completeSection()`, add:

```javascript
      function tick(now) {
        if (state.phase !== "playing") return;
        const dt = state.lastFrameMs ? (now - state.lastFrameMs) / 1000 : 0;
        state.lastFrameMs = now;

        state.globalTimer = Math.max(0, state.globalTimer - dt);
        state.wordTimer   = Math.max(0, state.wordTimer - dt);
        renderTimers();

        if (state.globalTimer <= 0) {
          state.phase = "ended";
          state.endReason = "timeout";
          // Full end-screen rendering lands in Task 9.
          return;
        }

        if (state.wordTimer <= 0 && state.currentWord) {
          loadNextWord();
        }

        requestAnimationFrame(tick);
      }
```

- [ ] **Step 3: Kick off the loop in `startGame()`**

In `startGame()`, find:

```javascript
        loadNextWord();
        renderTimers();
        els.input.focus();
      }
```

Replace with:

```javascript
        loadNextWord();
        renderTimers();
        state.lastFrameMs = 0;
        requestAnimationFrame(tick);
        els.input.focus();
      }
```

Update the `window.__chunga` line:

```javascript
      window.__chunga = { WORDS, PALETTE, state, startGame, loadNextWord, completeSection, tick };
```

- [ ] **Step 4: Run the smoke check**

Reload. `__chunga.startGame()`. Watch:
- Header global timer counts down from `90.0s` smoothly
- Word timer bar shrinks from full to empty over the word's `length × 1.2s` window
- Stop typing — when the bar empties, the next word loads (header still shows `0 / 13` because the section stayed grey)
- Mistype a few times — global timer drops by 2s per typo on top of the regular tick
- Let the global timer hit zero — `__chunga.state.phase` becomes `"ended"`, `__chunga.state.endReason` is `"timeout"`, the loop halts (timer bar stops moving)

- [ ] **Step 5: Commit**

```bash
cd /Users/dio/works/chun-ga
git add index.html
git commit -m "feat: requestAnimationFrame ticker for global and per-word timers"
```

---

## Task 9: End screen with stats and Play Again

**Files:**
- Modify: `/Users/dio/works/chun-ga/index.html` (add `endGame`, hook up Play Again, auto-start on load)

- [ ] **Step 1: Define the smoke check**

After this task:
- Loading the page automatically starts the first round (no console call needed)
- When the global timer hits 0, the dark overlay appears with "Time's up!", a list of stats (time used, words completed, typos, accuracy), and a "Play Again" button
- When all 13 sections complete (typing all 13 words correctly), the overlay says "City complete!" with the same stats
- Clicking "Play Again" hides the overlay, resets the city to grey, resets the timer to 90.0s, and starts a fresh round

- [ ] **Step 2: Add `endGame()` (no `innerHTML`)**

Inside the IIFE, after `tick()` and before `completeSection()`, add:

```javascript
      function endGame(reason) {
        state.phase = "ended";
        state.endReason = reason;
        const totalTime = (GLOBAL_TIMER_START - state.globalTimer).toFixed(1);
        const denom = state.correctChars + state.typos;
        const accuracy = denom === 0 ? 100 : Math.round((state.correctChars / denom) * 100);

        els.endHeadline.textContent =
          reason === "win" ? "City complete!" : "Time's up!";

        const stats = [
          "Time used: " + totalTime + "s",
          "Words completed: " + state.sectionsCompleted + " / " + SECTION_COUNT,
          "Typos: " + state.typos,
          "Accuracy: " + accuracy + "%",
        ];
        const frag = document.createDocumentFragment();
        for (const line of stats) {
          const li = document.createElement("li");
          li.textContent = line;
          frag.appendChild(li);
        }
        els.endStats.replaceChildren(frag);

        els.endScreen.hidden = false;
        els.playAgain.focus();
      }
```

- [ ] **Step 3: Wire `tick`'s timeout branch to `endGame`**

In `tick()`, find:

```javascript
        if (state.globalTimer <= 0) {
          state.phase = "ended";
          state.endReason = "timeout";
          // Full end-screen rendering lands in Task 9.
          return;
        }
```

Replace with:

```javascript
        if (state.globalTimer <= 0) {
          endGame("timeout");
          return;
        }
```

- [ ] **Step 4: Wire `loadNextWord`'s queue-empty branch to `endGame`**

In `loadNextWord()`, find:

```javascript
      function loadNextWord() {
        if (state.wordQueue.length === 0) {
          // All sections completed — endGame is wired in Task 9.
          state.currentWord = null;
          renderWordDisplay(0);
          return;
        }
```

Replace with:

```javascript
      function loadNextWord() {
        if (state.wordQueue.length === 0) {
          state.currentWord = null;
          renderWordDisplay(0);
          if (state.phase === "playing") endGame("win");
          return;
        }
```

- [ ] **Step 5: Wire Play Again, click-to-refocus, paste-prevention, and auto-start**

After the existing `els.input.addEventListener("input", onInput);` line, add:

```javascript
      els.playAgain.addEventListener("click", () => {
        startGame();
      });

      // Re-focus the input on any tap inside the page during play.
      document.addEventListener("click", (e) => {
        if (state.phase !== "playing") return;
        if (e.target === els.input) return;
        if (e.target === els.playAgain) return;
        els.input.focus();
      });

      // Prevent paste cheating.
      els.input.addEventListener("paste", (e) => e.preventDefault());

      // Auto-start on load.
      startGame();
```

Update the `window.__chunga` line:

```javascript
      window.__chunga = { WORDS, PALETTE, state, startGame, loadNextWord, completeSection, tick, endGame };
```

- [ ] **Step 6: Run the smoke check — win path**

Reload. The game starts automatically. Type all 13 words correctly. After the 13th word, the dark overlay appears with "City complete!" and stats. Click "Play Again" — the city is grey again, timer back at 90.0s, fresh first word.

- [ ] **Step 7: Run the smoke check — timeout path**

Reload. Don't type anything. Wait ~90 seconds. The overlay appears with "Time's up!" and stats showing 0 words completed, 0 typos. Click "Play Again" — fresh round.

- [ ] **Step 8: Run the smoke check — accuracy math**

Reload. Type one wrong letter then complete one word correctly (e.g. the displayed word is "TURBO" — type "TURBO" with one wrong key first). After the round ends, verify the accuracy is `correctChars / (correctChars + typos)` rounded to a whole percent.

- [ ] **Step 9: Commit**

```bash
cd /Users/dio/works/chun-ga
git add index.html
git commit -m "feat: end screen with stats, play-again button, and auto-start"
```

---

## Task 10: Mobile polish + drop dev handle

**Files:**
- Modify: `/Users/dio/works/chun-ga/index.html` (CSS additions, input placeholder, remove `window.__chunga`)

- [ ] **Step 1: Define the smoke check**

After this task:
- In Chrome DevTools' device toolbar set to "iPhone SE" (375×667), the layout fits the viewport with no horizontal scroll, the city occupies most of the screen, the word area sits cleanly above where the keyboard would be
- The OS keyboard appears on tap on the input on a real phone (no autocorrect, no autocapitalization)
- Tapping the city area refocuses the input
- Trying to paste into the input does nothing
- The "Play Again" button is at least 48px tall
- `window.__chunga` is `undefined`

- [ ] **Step 2: Add mobile-friendly CSS**

Append inside the existing `<style>` block (before `</style>`):

```css
@media (max-width: 480px) {
  header { padding: 6px 10px; }
  main { padding: 4px; }
  #word-area { padding: 10px 12px 12px; }
}
@supports (height: 100dvh) {
  body { min-height: 100dvh; height: 100dvh; }
}
#word-input::placeholder { color: #9ca3af; }
```

- [ ] **Step 3: Add a placeholder to the input**

Find:

```html
  <input
    id="word-input"
    type="text"
    inputmode="latin"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
    autofocus
    aria-label="type the word"
  />
```

Replace with:

```html
  <input
    id="word-input"
    type="text"
    inputmode="latin"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
    autofocus
    placeholder="type here"
    aria-label="type the word"
  />
```

- [ ] **Step 4: Remove the dev handle**

Find:

```javascript
      window.__chunga = { WORDS, PALETTE, state, startGame, loadNextWord, completeSection, tick, endGame };
```

Delete that line entirely.

- [ ] **Step 5: Run the smoke check on a desktop browser**

Reload. Resize the window down to 360px width — layout adapts, no clipping. Game still auto-starts and plays through. Tap (click) anywhere on the city → input refocuses. Try to paste (Cmd-V / Ctrl-V) into the input — nothing happens. In console: `typeof window.__chunga` returns `"undefined"`.

- [ ] **Step 6: Run the smoke check in DevTools mobile view**

Open DevTools, toggle device toolbar (Cmd-Shift-M / Ctrl-Shift-M), set device to "iPhone SE". The viewport scales the city, the word area is anchored at the bottom with the input visible. Layout looks reasonable in portrait and landscape.

- [ ] **Step 7: (Optional) Run the smoke check on a real phone**

If you have a phone on the same network, run a local server and hit it from the phone:

```bash
cd /Users/dio/works/chun-ga
python3 -m http.server 8080 --bind 0.0.0.0
```

Find your machine's LAN IP (`ipconfig getifaddr en0` on macOS) and open `http://<ip>:8080/` on the phone. Confirm: keyboard pops up automatically, no autocorrect interference, you can play through.

- [ ] **Step 8: Commit**

```bash
cd /Users/dio/works/chun-ga
git add index.html
git commit -m "polish: mobile layout, paste-prevention, click-to-refocus, drop dev handle"
```

---

## Final verification — full spec walk-through

After all 10 tasks:

- [ ] Reload `index.html`. Game auto-starts, city fully grey, first car-themed word displayed
- [ ] Type the word fast and correctly → a random grey building turns a random palette color, header `1 / 13`
- [ ] Type a wrong letter → red shake, global timer drops by 2.0s, input rolls back to last correct prefix
- [ ] Stop typing on a word → word timer empties → that section stays grey, next word loads
- [ ] Complete all 13 words → overlay "City complete!" with stats and Play Again
- [ ] Click Play Again → fresh round
- [ ] Sit on the start screen → after ~90s overlay "Time's up!" with stats
- [ ] Resize to mobile width → layout adapts cleanly
- [ ] DevTools console clean (no warnings, no errors)
