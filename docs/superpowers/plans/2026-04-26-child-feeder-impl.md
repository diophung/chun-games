# Chun-Ga Child Feeder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-file HTML5 game where the player raises a cartoon child from age 3 to 18 by feeding them food, picking activities, and managing rest. Healthy choices grow the child; junk food brings on crying that only sleep can resolve.

**Architecture:** A single `index.html` containing inline `<style>`, DOM shell, and `<script>` IIFE. Four hand-coded inline SVGs (one per visual stage). All actions flow through a single `applyAction()` mutation, then a single `render()` rebuilds the screen. Vanilla JS, zero dependencies, zero build step.

**Tech Stack:** HTML5, CSS3, vanilla ES2015+ JavaScript, inline SVG. No frameworks, no build tools, no external assets.

---

## Reference

- Spec: `docs/superpowers/specs/2026-04-26-child-feeder-design.md`
- All work happens in a single file: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html`

## Verification model

The spec opted out of an automated test harness. Each task ends with a **manual smoke check** in a browser. To run any task's verification:

```bash
open /Users/dio/works/chun-ga/.worktrees/child-feeder/index.html      # macOS
# or
xdg-open /Users/dio/works/chun-ga/.worktrees/child-feeder/index.html  # Linux
```

The page reloads on F5 (or Cmd-R). No server is needed.

## DOM hygiene

The implementation never calls `innerHTML` or `insertAdjacentHTML`. All dynamic DOM updates use `textContent`, `createElement`, `appendChild`, `replaceChildren`, and `setAttribute`. There's no user-supplied or remote content, but this keeps the surface trivially XSS-proof.

---

## Task 1: Scaffold `index.html` skeleton

**Files:**
- Create: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html`

- [ ] **Step 1: Define the smoke check**

After this task, opening `index.html` in a browser must show:
- A page with a soft pastel background filling the viewport
- Header strip showing "Age 3 · Stage: Toddler"
- An empty centered area where the baby will live
- An empty stat-bars section
- An empty foods section
- An empty activities section
- A visible "😴 Sleep" button at the bottom
- The page title in the browser tab reads "Chun-Ga · Child Feeder"
- No JavaScript errors in the console

- [ ] **Step 2: Write the file**

Create `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
  <title>Chun-Ga · Child Feeder</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      min-height: 100%;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(180deg, #ffe7f0 0%, #fff5db 100%);
      color: #2a2a3a;
    }
    body {
      display: flex;
      justify-content: center;
      padding: 12px;
    }
    #app {
      width: 100%;
      max-width: 520px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    #age-stage {
      text-align: center;
      font-size: clamp(16px, 4vw, 20px);
      font-weight: 600;
      padding: 8px 0;
      background: rgba(255,255,255,0.6);
      border-radius: 12px;
    }
    #hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 220px;
      background: rgba(255,255,255,0.45);
      border-radius: 16px;
      padding: 12px;
    }
    #status-text {
      margin: 8px 0 0;
      min-height: 1.3em;
      font-style: italic;
      color: #555;
      text-align: center;
    }
    #bars {
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: rgba(255,255,255,0.6);
      padding: 12px;
      border-radius: 12px;
    }
    section.actions {
      background: rgba(255,255,255,0.6);
      padding: 12px;
      border-radius: 12px;
    }
    section.actions h3 {
      margin: 0 0 8px;
      font-size: 14px;
      font-weight: 600;
      color: #555;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .btn-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    button {
      font: inherit;
      cursor: pointer;
      border: 1px solid rgba(0,0,0,0.15);
      background: #fff;
      border-radius: 10px;
      padding: 8px 10px;
      min-height: 44px;
      min-width: 56px;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      font-size: 14px;
      transition: transform 80ms ease, background 120ms ease;
    }
    button:hover:not(:disabled) { background: #fafaff; transform: translateY(-1px); }
    button:active:not(:disabled) { transform: translateY(0); }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    button .emoji { font-size: 22px; line-height: 1; }
    button .label { font-size: 11px; color: #444; }
    #sleep-btn {
      align-self: stretch;
      min-height: 56px;
      font-size: 16px;
      background: #d8e8ff;
      flex-direction: row;
      gap: 8px;
    }
  </style>
</head>
<body>
  <main id="app">
    <header id="age-stage">Age 3 · Stage: Toddler</header>
    <div id="hero">
      <div id="hero-stage"></div>
      <p id="status-text"></p>
    </div>
    <section id="bars"></section>
    <section id="foods" class="actions">
      <h3>Foods</h3>
      <div class="btn-grid" id="foods-grid"></div>
    </section>
    <section id="activities" class="actions">
      <h3>Activities</h3>
      <div class="btn-grid" id="activities-grid"></div>
    </section>
    <button id="sleep-btn"><span class="emoji">😴</span><span>Sleep</span></button>
    <section id="end-screen" hidden></section>
  </main>
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

Open the file. Confirm: pastel background, header reads "Age 3 · Stage: Toddler", empty hero area, empty stat-bars area, empty foods/activities sections with their headers, and a blue "😴 Sleep" button at the bottom. Console clean.

- [ ] **Step 4: Commit**

```bash
cd /Users/dio/works/chun-ga/.worktrees/child-feeder
git add index.html
git commit -m "scaffold: empty child-feeder index.html shell"
```

---

## Task 2: Add data tables, constants, and initial state

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — inside the IIFE in `<script>`

- [ ] **Step 1: Define the smoke check**

After this task, opening the page should still show the same shell as before. Open DevTools console; nothing visible has changed. There are no errors. (Task 2 only adds in-memory data and helpers — no DOM changes yet.)

- [ ] **Step 2: Replace the IIFE body with constants and state**

Find this block in `index.html`:

```js
    (function () {
      "use strict";
      // Game logic added in later tasks.
    })();
```

Replace with:

```js
    (function () {
      "use strict";

      // ---------- Constants ----------

      const XP_PER_AGE = 6;
      const MAX_STAT = 100;
      const TIRED_THRESHOLD = 25;
      const MAX_AGE = 18;

      const FOODS = [
        { id: "apple",    emoji: "🍎", name: "Apple",    healthy: true,  stamina:  5, strength:  2, happiness:  3, xp:  1 },
        { id: "broccoli", emoji: "🥦", name: "Broccoli", healthy: true,  stamina:  3, strength:  6, happiness: -2, xp:  1 },
        { id: "milk",     emoji: "🥛", name: "Milk",     healthy: true,  stamina:  4, strength:  5, happiness:  2, xp:  1 },
        { id: "egg",      emoji: "🥚", name: "Egg",      healthy: true,  stamina:  5, strength:  5, happiness:  1, xp:  1 },
        { id: "bread",    emoji: "🍞", name: "Bread",    healthy: true,  stamina:  6, strength:  1, happiness:  1, xp:  1 },
        { id: "fish",     emoji: "🐟", name: "Fish",     healthy: true,  stamina:  3, strength:  6, happiness:  2, xp:  1 },
        { id: "carrot",   emoji: "🥕", name: "Carrot",   healthy: true,  stamina:  3, strength:  3, happiness:  1, xp:  1 },
        { id: "cookie",   emoji: "🍪", name: "Cookie",   healthy: false, stamina:  1, strength: -2, happiness:  6, xp: -1 },
        { id: "fries",    emoji: "🍟", name: "Fries",    healthy: false, stamina: -2, strength: -3, happiness:  5, xp: -1 },
        { id: "burger",   emoji: "🍔", name: "Burger",   healthy: false, stamina:  1, strength: -3, happiness:  4, xp: -1 },
        { id: "soda",     emoji: "🥤", name: "Soda",     healthy: false, stamina: -3, strength: -4, happiness:  6, xp: -1 },
        { id: "cake",     emoji: "🍰", name: "Cake",     healthy: false, stamina: -1, strength: -4, happiness:  7, xp: -1 },
      ];

      const ACTIVITIES = [
        { id: "toys",   emoji: "🧸",  name: "Toys",    unlock:  3, stamina: -10, strength:  0, happiness: 8, xp: 1 },
        { id: "draw",   emoji: "🎨",  name: "Draw",    unlock:  5, stamina:  -5, strength:  0, happiness: 6, xp: 1 },
        { id: "bike",   emoji: "🚲",  name: "Bike",    unlock:  6, stamina: -20, strength:  5, happiness: 6, xp: 1 },
        { id: "read",   emoji: "📚",  name: "Read",    unlock:  8, stamina:  -5, strength:  1, happiness: 4, xp: 1 },
        { id: "sports", emoji: "⚽",  name: "Sports",  unlock: 11, stamina: -25, strength: 10, happiness: 7, xp: 1 },
        { id: "gym",    emoji: "🏋️", name: "Workout", unlock: 14, stamina: -30, strength: 14, happiness: 3, xp: 1 },
      ];

      const STAGES = [
        { index: 0, min:  3, max:  5, name: "Toddler", svgId: "stage-0" },
        { index: 1, min:  6, max:  9, name: "Kid",     svgId: "stage-1" },
        { index: 2, min: 10, max: 13, name: "Tween",   svgId: "stage-2" },
        { index: 3, min: 14, max: 18, name: "Teen",    svgId: "stage-3" },
      ];

      const INITIAL_STATE = Object.freeze({
        phase: "playing",
        age: 3,
        stage: 0,
        stats: { stamina: 60, strength: 50, happiness: 70 },
        xp: 0,
        crying: false,
        history: { meals: 0, healthyMeals: 0, junkMeals: 0, activities: 0, sleeps: 0, cryEpisodes: 0 },
      });

      // Mutable game state. Filled in by reset().
      let state;

      // ---------- Helpers ----------

      function clamp(n, lo, hi) {
        return Math.max(lo, Math.min(hi, n));
      }

      function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
      }

      function computeStage(age) {
        for (const s of STAGES) if (age >= s.min && age <= s.max) return s.index;
        return STAGES.length - 1;
      }

      function reset() {
        state = clone(INITIAL_STATE);
      }

      // ---------- Init ----------

      reset();
      // Render and listeners attached in later tasks.

      // Expose for in-browser debugging.
      window.__game = {
        get state() { return state; },
        FOODS, ACTIVITIES, STAGES,
      };
    })();
```

- [ ] **Step 3: Run the smoke check**

Open the page. UI unchanged. In DevTools console run:

```js
__game.state
__game.FOODS.length
__game.ACTIVITIES.length
__game.STAGES.length
```

Expected: state object with `age: 3`, FOODS length `12`, ACTIVITIES length `6`, STAGES length `4`.

- [ ] **Step 4: Commit**

```bash
cd /Users/dio/works/chun-ga/.worktrees/child-feeder
git add index.html
git commit -m "feat: add foods, activities, stages, and initial state"
```

---

## Task 3: Render stat bars and XP bar

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — append CSS, add `renderBars()` and `render()`, call from init

- [ ] **Step 1: Define the smoke check**

After this task, the page shows four bars stacked in `#bars`, in this order:
- XP — gold fill, label "XP", value text "0 / 6"
- Stamina — green fill (≥ 70 tier), label "Stamina", value text "60"
- Strength — yellow fill (30-69 tier), label "Strength", value text "50"
- Happiness — green fill (≥ 70 tier), label "Happiness", value text "70"

Each bar is a horizontal track with a colored fill at the proportional width. Each bar has a left label, the colored fill, and a right value.

- [ ] **Step 2: Append CSS for bars**

Inside `<style>`, before `</style>`, append:

```css
.bar {
  display: grid;
  grid-template-columns: 80px 1fr 50px;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #444;
  font-variant-numeric: tabular-nums;
}
.bar-track {
  position: relative;
  height: 14px;
  background: #eee;
  border-radius: 7px;
  overflow: hidden;
}
.bar-fill {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 0%;
  border-radius: 7px;
  transition: width 220ms ease, background 220ms ease;
}
.bar-fill.tier-high { background: #4caf50; }
.bar-fill.tier-mid  { background: #f1c40f; }
.bar-fill.tier-low  { background: #e74c3c; }
.bar-fill.tier-xp   { background: #f3a712; }
.bar-value { text-align: right; font-weight: 600; }
```

- [ ] **Step 3: Add render helpers inside the IIFE**

After the `// ---------- Helpers ----------` section and before `// ---------- Init ----------`, insert:

```js
      // ---------- DOM lookups ----------

      const $ageStage = document.getElementById("age-stage");
      const $bars = document.getElementById("bars");
      const $statusText = document.getElementById("status-text");
      const $foodsGrid = document.getElementById("foods-grid");
      const $activitiesGrid = document.getElementById("activities-grid");
      const $sleepBtn = document.getElementById("sleep-btn");
      const $endScreen = document.getElementById("end-screen");

      // ---------- Render: bars ----------

      function buildBarRow(id, label) {
        const row = document.createElement("div");
        row.className = "bar";
        row.id = `bar-${id}`;
        const lbl = document.createElement("span");
        lbl.className = "bar-label";
        lbl.textContent = label;
        const track = document.createElement("div");
        track.className = "bar-track";
        const fill = document.createElement("div");
        fill.className = "bar-fill";
        fill.dataset.role = "fill";
        track.appendChild(fill);
        const val = document.createElement("span");
        val.className = "bar-value";
        val.dataset.role = "value";
        row.appendChild(lbl);
        row.appendChild(track);
        row.appendChild(val);
        return row;
      }

      function ensureBars() {
        if ($bars.childElementCount > 0) return;
        $bars.appendChild(buildBarRow("xp", "XP"));
        $bars.appendChild(buildBarRow("stamina", "Stamina"));
        $bars.appendChild(buildBarRow("strength", "Strength"));
        $bars.appendChild(buildBarRow("happiness", "Happiness"));
      }

      function tierClass(value, isXp) {
        if (isXp) return "tier-xp";
        if (value >= 70) return "tier-high";
        if (value >= 30) return "tier-mid";
        return "tier-low";
      }

      function setBar(rowId, fillPct, valueText, isXp) {
        const row = document.getElementById(`bar-${rowId}`);
        const fill = row.querySelector('[data-role="fill"]');
        const val = row.querySelector('[data-role="value"]');
        fill.style.width = `${clamp(fillPct, 0, 100)}%`;
        fill.classList.remove("tier-high", "tier-mid", "tier-low", "tier-xp");
        fill.classList.add(tierClass(fillPct, isXp));
        val.textContent = valueText;
      }

      function renderBars() {
        const { stats, xp } = state;
        setBar("xp", (xp / XP_PER_AGE) * 100, `${xp} / ${XP_PER_AGE}`, true);
        setBar("stamina",   stats.stamina,   `${stats.stamina}`,   false);
        setBar("strength",  stats.strength,  `${stats.strength}`,  false);
        setBar("happiness", stats.happiness, `${stats.happiness}`, false);
      }

      // ---------- Render: top-level ----------

      function render() {
        ensureBars();
        renderBars();
        $ageStage.textContent = `Age ${state.age} · Stage: ${STAGES[state.stage].name}`;
      }
```

Then change the init section so it calls render:

```js
      // ---------- Init ----------

      reset();
      render();
      // Listeners attached in later tasks.

      window.__game = {
        get state() { return state; },
        FOODS, ACTIVITIES, STAGES,
        render, reset,
      };
```

- [ ] **Step 4: Run the smoke check**

Open the page. Bars appear in the bars section, populated as described. In console:

```js
__game.state.stats.happiness = 20; __game.render();
```

Expected: happiness bar fill width shrinks and turns red. Reload to reset.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: render xp and stat bars from state"
```

---

## Task 4: Render food buttons from FOODS data

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — add `renderFoods()`, call from `render()`, attach delegated click handler

- [ ] **Step 1: Define the smoke check**

After this task, the Foods section shows 12 buttons in two rows (or wraps to fit), each with the food's emoji on top and its name below: 🍎 Apple, 🥦 Broccoli, 🥛 Milk, 🥚 Egg, 🍞 Bread, 🐟 Fish, 🥕 Carrot, 🍪 Cookie, 🍟 Fries, 🍔 Burger, 🥤 Soda, 🍰 Cake. Hovering a button shows a hover background. Clicking does nothing yet (action wiring is Task 6).

- [ ] **Step 2: Add `renderFoods()` and a stub `feed()`**

Inside the IIFE, after `// ---------- Render: top-level ----------` (before the `render()` definition), insert:

```js
      // ---------- Render: foods ----------

      function buildActionButton({ id, emoji, name }, kind) {
        const btn = document.createElement("button");
        btn.dataset.kind = kind;
        btn.dataset.id = id;
        const emoji_ = document.createElement("span");
        emoji_.className = "emoji";
        emoji_.textContent = emoji;
        const label = document.createElement("span");
        label.className = "label";
        label.textContent = name;
        btn.appendChild(emoji_);
        btn.appendChild(label);
        return btn;
      }

      function ensureFoodButtons() {
        if ($foodsGrid.childElementCount > 0) return;
        for (const f of FOODS) $foodsGrid.appendChild(buildActionButton(f, "food"));
      }

      function renderFoods() {
        ensureFoodButtons();
        for (const btn of $foodsGrid.children) {
          btn.disabled = false; // enabled state refined in Task 10
        }
      }
```

Add a click delegator near the bottom of the IIFE, between `render();` and the `window.__game` block:

```js
      $foodsGrid.addEventListener("click", function (e) {
        const btn = e.target.closest("button[data-kind='food']");
        if (!btn || btn.disabled) return;
        feed(btn.dataset.id);
      });

      function feed(foodId) {
        // Wired up in Task 6.
        console.log("feed", foodId);
      }
```

Update `render()` to also call `renderFoods()`:

```js
      function render() {
        ensureBars();
        renderBars();
        renderFoods();
        $ageStage.textContent = `Age ${state.age} · Stage: ${STAGES[state.stage].name}`;
      }
```

- [ ] **Step 3: Run the smoke check**

Open the page. Foods section now shows 12 buttons. Click any food button — console logs `feed apple` (or whatever id). Buttons hover/press with subtle motion. Layout wraps cleanly.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: render food buttons with click logging"
```

---

## Task 5: Render activity buttons with age and stamina gates

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — add `renderActivities()`, lock styling, click delegator stub

- [ ] **Step 1: Define the smoke check**

After this task, the Activities section shows 6 buttons:
- 🧸 Toys (enabled — unlocks at age 3)
- 🎨 Draw (locked — overlay shows "🔒5")
- 🚲 Bike (locked — "🔒6")
- 📚 Read (locked — "🔒8")
- ⚽ Sports (locked — "🔒11")
- 🏋️ Workout (locked — "🔒14")

The locked overlay sits over the emoji. Locked buttons are visually dimmed and `disabled`. In console:

```js
__game.state.age = 12; __game.render();
```

Now Toys, Draw, Bike, Read, Sports are enabled; only Workout is locked. Reload to reset.

- [ ] **Step 2: Append CSS for locks**

Inside `<style>`, before `</style>`:

```css
button.locked .emoji::after {
  content: attr(data-lock);
  display: block;
  font-size: 10px;
  margin-top: 2px;
  color: #b00;
  font-weight: 700;
}
button.too-tired { opacity: 0.5; }
```

- [ ] **Step 3: Add `renderActivities()` and a stub `doActivity()`**

Inside the IIFE, after `renderFoods()` and before `function render()`, insert:

```js
      // ---------- Render: activities ----------

      function ensureActivityButtons() {
        if ($activitiesGrid.childElementCount > 0) return;
        for (const a of ACTIVITIES) {
          const btn = buildActionButton(a, "activity");
          $activitiesGrid.appendChild(btn);
        }
      }

      function renderActivities() {
        ensureActivityButtons();
        for (const btn of $activitiesGrid.children) {
          const a = ACTIVITIES.find(x => x.id === btn.dataset.id);
          const emojiSpan = btn.querySelector(".emoji");
          const locked = state.age < a.unlock;
          const tooTired = !locked && state.stats.stamina < Math.abs(a.stamina);
          btn.classList.toggle("locked", locked);
          btn.classList.toggle("too-tired", tooTired);
          if (locked) emojiSpan.dataset.lock = `🔒${a.unlock}`;
          else delete emojiSpan.dataset.lock;
          btn.disabled = locked || tooTired;
          btn.title = locked ? `Unlocks at age ${a.unlock}` : tooTired ? "Too tired" : "";
        }
      }
```

Add an activity click delegator (next to the food one) and a stub `doActivity`:

```js
      $activitiesGrid.addEventListener("click", function (e) {
        const btn = e.target.closest("button[data-kind='activity']");
        if (!btn || btn.disabled) return;
        doActivity(btn.dataset.id);
      });

      function doActivity(actId) {
        // Wired up in Task 7.
        console.log("activity", actId);
      }
```

Update `render()` to call `renderActivities()`:

```js
      function render() {
        ensureBars();
        renderBars();
        renderFoods();
        renderActivities();
        $ageStage.textContent = `Age ${state.age} · Stage: ${STAGES[state.stage].name}`;
      }
```

- [ ] **Step 4: Run the smoke check**

Open the page. Activities section shows the six activity buttons. Only Toys is enabled; the rest are locked with red 🔒 + age. Click Toys — console logs `activity toys`. Click locked buttons — nothing happens. Run the console age override; verify behavior matches the smoke check description.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: render activity buttons with age and stamina gates"
```

---

## Task 6: Implement `applyAction()` and wire `feed()`

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — replace stub `feed`, add `applyAction`

- [ ] **Step 1: Define the smoke check**

After this task, clicking food buttons updates the bars:
- Click 🍎 Apple — happiness bar grows, stamina/strength bars grow, XP bar grows by 1/6.
- Click 🥦 Broccoli — happiness bar shrinks slightly (−2 + −1 decay), strength grows, stamina grows.
- Click 🍰 Cake — XP shrinks by 1, but XP can't go below 0.
- After enough healthy clicks, XP fills, age advances to 4, XP resets to 0. (Stage stays "Toddler" until age 6.)
- Click 7 healthy foods in a row — confirm the bars settle in expected ranges and history counters track via `__game.state.history`.

- [ ] **Step 2: Replace the `feed` stub and add `applyAction`**

Find:

```js
      function feed(foodId) {
        // Wired up in Task 6.
        console.log("feed", foodId);
      }
```

Replace with:

```js
      function feed(foodId) {
        if (state.phase !== "playing" || state.crying) return;
        const f = FOODS.find(x => x.id === foodId);
        if (!f) return;
        applyAction({
          stamina: f.stamina,
          strength: f.strength,
          happiness: f.happiness,
          xp: f.xp,
          isMeal: true,
          isHealthy: f.healthy,
        });
      }

      function applyAction(deltas) {
        // 1. Apply deltas
        state.stats.stamina   += deltas.stamina   || 0;
        state.stats.strength  += deltas.strength  || 0;
        state.stats.happiness += deltas.happiness || 0;
        state.xp              += deltas.xp        || 0;

        // 2. Per-turn decay (skipped for sleep, which calls its own path)
        state.stats.stamina   -= 1;
        state.stats.happiness -= 1;

        // 3. Clamp
        state.stats.stamina   = clamp(state.stats.stamina,   0, MAX_STAT);
        state.stats.strength  = clamp(state.stats.strength,  0, MAX_STAT);
        state.stats.happiness = clamp(state.stats.happiness, 0, MAX_STAT);
        state.xp              = clamp(state.xp,              0, XP_PER_AGE);

        // 4. History
        if (deltas.isMeal) {
          state.history.meals++;
          if (deltas.isHealthy) state.history.healthyMeals++;
          else                  state.history.junkMeals++;
        }
        if (deltas.isActivity) state.history.activities++;

        // 5. Age-up
        if (state.xp >= XP_PER_AGE && state.age < MAX_AGE) {
          state.age++;
          state.xp = 0;
          state.stage = computeStage(state.age);
        }

        // 6. Crying check
        if (!state.crying && state.stats.happiness <= 0) {
          state.crying = true;
          state.history.cryEpisodes++;
        }

        // 7. End check
        if (state.age >= MAX_AGE) state.phase = "ended";

        render();
      }
```

- [ ] **Step 3: Run the smoke check**

Reload the page. Click 🍎 Apple. Bars should update visibly: stamina, strength, happiness all rise; XP fills 1/6.

Click 🍪 Cookie. XP drops to 0/6 (clamped — was 1/6 then −1).

Click 🍰 Cake five more times. Eventually happiness hits 0 — `__game.state.crying` becomes `true` (verify in console). UI doesn't yet visually lock the buttons; that's Task 8.

Reload. Click healthy foods (🍎 🥦 🥛 🥚 🍞 🐟) one by one — XP should fill to 6, age advances to 4, XP resets to 0. `__game.state.age === 4` confirms age-up. Stage remains 0 (Toddler).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: implement feed() through applyAction with decay and age-up"
```

---

## Task 7: Wire `doActivity()`

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — replace stub `doActivity`

- [ ] **Step 1: Define the smoke check**

After this task, clicking an unlocked activity updates the bars:
- Toys at age 3: stamina drops by ~10 + 1 decay = 11, happiness rises by 8 − 1 = 7, XP +1.
- After clicking Toys ~5-6 times, stamina drops below 10 → button shows "too-tired" greyed and is disabled.
- A subsequent food click with positive stamina restores stamina, re-enables Toys.

- [ ] **Step 2: Replace the `doActivity` stub**

Find:

```js
      function doActivity(actId) {
        // Wired up in Task 7.
        console.log("activity", actId);
      }
```

Replace with:

```js
      function doActivity(actId) {
        if (state.phase !== "playing" || state.crying) return;
        const a = ACTIVITIES.find(x => x.id === actId);
        if (!a) return;
        if (state.age < a.unlock) return;
        if (state.stats.stamina < Math.abs(a.stamina)) return;
        applyAction({
          stamina: a.stamina,
          strength: a.strength,
          happiness: a.happiness,
          xp: a.xp,
          isActivity: true,
        });
      }
```

- [ ] **Step 3: Run the smoke check**

Reload. Click 🧸 Toys repeatedly. Stamina drops; happiness rises; XP fills. After several clicks, Toys greys out (stamina too low). Click 🍞 Bread — stamina recovers; Toys re-enables. `__game.state.history.activities` counts up.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: implement doActivity with stamina gate"
```

---

## Task 8: Implement `sleep()` (special path, no decay)

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — wire sleep button, define `sleep()`

- [ ] **Step 1: Define the smoke check**

After this task, clicking the 😴 Sleep button:
- Sets stamina to 100 (regardless of prior value)
- Adds 30 to happiness (clamped to 100)
- Does NOT change XP
- Clears crying state
- Increments `state.history.sleeps`

To force the cry-and-recover path: in console run `__game.state.stats.happiness = 0; __game.state.crying = true; __game.render();` then click Sleep — stamina goes to 100, happiness to 30 (or higher), `__game.state.crying === false`.

- [ ] **Step 2: Wire the sleep button and define `sleep()`**

Add a click listener for the sleep button near the other listeners:

```js
      $sleepBtn.addEventListener("click", function () {
        if ($sleepBtn.disabled) return;
        sleep();
      });
```

Add `sleep()` near `applyAction()`:

```js
      function sleep() {
        if (state.phase !== "playing") return;

        // Special path — no per-turn decay.
        state.stats.stamina = MAX_STAT;
        state.stats.happiness += 30;
        state.stats.happiness = clamp(state.stats.happiness, 0, MAX_STAT);
        state.crying = false;
        state.history.sleeps++;

        // No XP gain. No age advance from sleep alone.
        if (state.age >= MAX_AGE) state.phase = "ended";

        render();
      }
```

- [ ] **Step 3: Run the smoke check**

Reload. Click 🍰 Cake about 7 times — happiness drops to 0; `__game.state.crying === true`. Click 😴 Sleep — stamina becomes 100, happiness becomes 30, `__game.state.crying === false`, `__game.state.history.sleeps === 1`.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: implement sleep() as special non-decay action"
```

---

## Task 9: Crying state — disable food/activity buttons and show status text

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — append CSS pulse, update `render()`

- [ ] **Step 1: Define the smoke check**

After this task, when `state.crying` is true:
- All 12 food buttons are visually disabled (greyed)
- All 6 activity buttons are visually disabled
- The status text under the hero reads "Baby is crying. Help them rest."
- The Sleep button has a slow pulsing animation
After clicking Sleep, the lock clears and the pulse stops.

- [ ] **Step 2: Append CSS for the pulse**

Inside `<style>`, before `</style>`:

```css
@keyframes sleep-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(85, 145, 255, 0.55); }
  50%      { box-shadow: 0 0 0 12px rgba(85, 145, 255, 0); }
}
#sleep-btn.pulse { animation: sleep-pulse 1.4s ease-in-out infinite; }
```

- [ ] **Step 3: Update `renderFoods`, `renderActivities`, `render` to react to crying**

Replace the body of `renderFoods`:

```js
      function renderFoods() {
        ensureFoodButtons();
        for (const btn of $foodsGrid.children) {
          btn.disabled = state.phase !== "playing" || state.crying;
        }
      }
```

Replace the body of `renderActivities`:

```js
      function renderActivities() {
        ensureActivityButtons();
        for (const btn of $activitiesGrid.children) {
          const a = ACTIVITIES.find(x => x.id === btn.dataset.id);
          const emojiSpan = btn.querySelector(".emoji");
          const locked = state.age < a.unlock;
          const tooTired = !locked && state.stats.stamina < Math.abs(a.stamina);
          const blocked = state.crying || state.phase !== "playing";
          btn.classList.toggle("locked", locked);
          btn.classList.toggle("too-tired", tooTired);
          if (locked) emojiSpan.dataset.lock = `🔒${a.unlock}`;
          else delete emojiSpan.dataset.lock;
          btn.disabled = locked || tooTired || blocked;
          btn.title = locked ? `Unlocks at age ${a.unlock}` : tooTired ? "Too tired" : "";
        }
      }
```

Replace the body of `render`:

```js
      function render() {
        ensureBars();
        renderBars();
        renderFoods();
        renderActivities();
        $ageStage.textContent = `Age ${state.age} · Stage: ${STAGES[state.stage].name}`;
        $sleepBtn.classList.toggle("pulse", state.crying);
        $sleepBtn.disabled = state.phase !== "playing";
        $statusText.textContent = state.crying ? "Baby is crying. Help them rest." : "";
      }
```

- [ ] **Step 4: Run the smoke check**

Reload. Click 🍰 Cake until happiness hits 0. Confirm:
- Status text appears under the hero: "Baby is crying. Help them rest."
- All food and activity buttons are disabled (greyed; clicks ignored)
- Sleep button is pulsing
Click Sleep — pulse stops, status text clears, food and activity buttons re-enable.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: crying state hard-locks food/activity buttons and pulses sleep"
```

---

## Task 10: Inline SVG stage 0 (Toddler) with mood faces

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — add SVG markup, append CSS for moods

- [ ] **Step 1: Define the smoke check**

After this task, the hero area shows a hand-drawn SVG cartoon of a toddler: tiny body, big round head, sparse hair tuft, a diaper, holding a teddy bear. The toddler shows the happy face by default (smile + open eyes). Force tired/crying via console:

```js
document.getElementById("stage-0").classList.remove("mood-happy");
document.getElementById("stage-0").classList.add("mood-tired");
```

The eyes get droopy. Switch to `mood-cry` and tears appear. Reset by reloading.

- [ ] **Step 2: Append CSS for mood overlays**

Inside `<style>`, before `</style>`:

```css
#hero-stage svg {
  width: clamp(150px, 40vw, 200px);
  height: auto;
  display: block;
}
.stage-svg .face-happy,
.stage-svg .face-tired,
.stage-svg .face-cry {
  display: none;
}
.stage-svg.mood-happy .face-happy { display: inline; }
.stage-svg.mood-tired .face-tired { display: inline; }
.stage-svg.mood-cry   .face-cry   { display: inline; }
@keyframes age-up-bump {
  0% { transform: scale(1.0); }
  35% { transform: scale(1.18); }
  100% { transform: scale(1.0); }
}
.stage-svg.age-up { animation: age-up-bump 600ms ease; transform-origin: 50% 100%; }
```

- [ ] **Step 3: Insert toddler SVG inside `#hero-stage`**

Find:

```html
    <div id="hero">
      <div id="hero-stage"></div>
      <p id="status-text"></p>
    </div>
```

Replace `<div id="hero-stage"></div>` with:

```html
      <div id="hero-stage">
        <svg id="stage-0" class="stage-svg mood-happy" viewBox="0 0 150 200" aria-label="toddler">
          <!-- legs -->
          <rect x="60" y="150" width="12" height="30" rx="6" fill="#f6c89f" />
          <rect x="78" y="150" width="12" height="30" rx="6" fill="#f6c89f" />
          <!-- diaper -->
          <rect x="50" y="120" width="50" height="40" rx="14" fill="#ffffff" stroke="#bcbccd" stroke-width="2" />
          <!-- body -->
          <rect x="55" y="90" width="40" height="40" rx="14" fill="#ffd6e0" />
          <!-- arms -->
          <rect x="35" y="95" width="22" height="10" rx="5" fill="#f6c89f" />
          <rect x="93" y="95" width="22" height="10" rx="5" fill="#f6c89f" />
          <!-- head -->
          <circle cx="75" cy="60" r="32" fill="#f6c89f" />
          <!-- hair tuft -->
          <path d="M58,32 Q75,22 92,32 Q88,40 75,38 Q62,40 58,32 Z" fill="#5a3b25" />
          <!-- cheeks -->
          <circle cx="58" cy="68" r="4" fill="#f7a8a8" opacity="0.7" />
          <circle cx="92" cy="68" r="4" fill="#f7a8a8" opacity="0.7" />
          <!-- happy face -->
          <g class="face-happy">
            <circle cx="65" cy="58" r="3" fill="#222" />
            <circle cx="85" cy="58" r="3" fill="#222" />
            <path d="M65,72 Q75,82 85,72" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
          <!-- tired face -->
          <g class="face-tired">
            <path d="M61,58 Q65,62 69,58" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <path d="M81,58 Q85,62 89,58" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <path d="M65,76 Q75,72 85,76" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
          <!-- crying face -->
          <g class="face-cry">
            <path d="M61,56 L69,60 M61,60 L69,56" stroke="#222" stroke-width="2" stroke-linecap="round" />
            <path d="M81,56 L89,60 M81,60 L89,56" stroke="#222" stroke-width="2" stroke-linecap="round" />
            <ellipse cx="63" cy="74" rx="4" ry="6" fill="#7ec8ff" />
            <ellipse cx="87" cy="74" rx="4" ry="6" fill="#7ec8ff" />
            <path d="M65,82 Q75,76 85,82" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
          <!-- teddy bear (held in left arm) -->
          <g transform="translate(20,110)">
            <circle cx="10" cy="14" r="10" fill="#a47148" />
            <circle cx="4" cy="6"  r="4"  fill="#a47148" />
            <circle cx="16" cy="6"  r="4"  fill="#a47148" />
            <circle cx="8"  cy="13" r="1.5" fill="#222" />
            <circle cx="12" cy="13" r="1.5" fill="#222" />
            <path d="M8,17 Q10,19 12,17" stroke="#222" stroke-width="1" fill="none" />
          </g>
        </svg>
      </div>
```

- [ ] **Step 4: Run the smoke check**

Reload. Hero shows the toddler with a teddy. Run the console mood toggle from Step 1 — confirm tired and crying expressions render.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add stage 0 toddler SVG with happy/tired/cry faces"
```

---

## Task 11: Inline SVG stage 1 (Kid)

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — append SVG inside `#hero-stage`

- [ ] **Step 1: Define the smoke check**

After this task, a second SVG (`#stage-1`) exists in the hero — a kid wearing a t-shirt and shorts, with full hair, shoes, and a big grin. By default it's hidden because it has the `hidden` attribute. Toggling visibility in console:

```js
document.getElementById("stage-0").hidden = true;
document.getElementById("stage-1").hidden = false;
```

The kid SVG appears (replacing the toddler) with its happy face. Mood class swaps work as in Task 10. Reload to reset.

- [ ] **Step 2: Append the kid SVG**

Inside `#hero-stage`, after the closing `</svg>` of stage-0, insert:

```html
        <svg id="stage-1" class="stage-svg mood-happy" viewBox="0 0 150 220" aria-label="kid" hidden>
          <!-- legs (shorts -> bare leg -> shoes) -->
          <rect x="60" y="160" width="12" height="20" fill="#f6c89f" />
          <rect x="78" y="160" width="12" height="20" fill="#f6c89f" />
          <rect x="56" y="178" width="20" height="10" rx="3" fill="#3a3a3a" />
          <rect x="74" y="178" width="20" height="10" rx="3" fill="#3a3a3a" />
          <!-- shorts -->
          <rect x="55" y="135" width="40" height="28" rx="6" fill="#3a6ea5" />
          <!-- t-shirt -->
          <rect x="50" y="95" width="50" height="45" rx="8" fill="#ffd56b" />
          <!-- arms -->
          <rect x="32" y="100" width="22" height="12" rx="6" fill="#f6c89f" />
          <rect x="96" y="100" width="22" height="12" rx="6" fill="#f6c89f" />
          <!-- neck -->
          <rect x="68" y="85" width="14" height="10" fill="#f6c89f" />
          <!-- head -->
          <circle cx="75" cy="60" r="28" fill="#f6c89f" />
          <!-- hair (full cap) -->
          <path d="M48,55 Q50,30 75,28 Q100,30 102,55 Q98,40 75,40 Q52,40 48,55 Z" fill="#5a3b25" />
          <!-- cheeks -->
          <circle cx="58" cy="66" r="3" fill="#f7a8a8" opacity="0.7" />
          <circle cx="92" cy="66" r="3" fill="#f7a8a8" opacity="0.7" />
          <!-- happy face -->
          <g class="face-happy">
            <circle cx="66" cy="58" r="2.5" fill="#222" />
            <circle cx="84" cy="58" r="2.5" fill="#222" />
            <path d="M64,70 Q75,82 86,70" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
          <g class="face-tired">
            <path d="M62,58 Q66,62 70,58" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <path d="M80,58 Q84,62 88,58" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <path d="M66,74 Q75,71 84,74" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
          <g class="face-cry">
            <path d="M62,56 L70,60 M62,60 L70,56" stroke="#222" stroke-width="2" stroke-linecap="round" />
            <path d="M80,56 L88,60 M80,60 L88,56" stroke="#222" stroke-width="2" stroke-linecap="round" />
            <ellipse cx="64" cy="72" rx="3" ry="5" fill="#7ec8ff" />
            <ellipse cx="86" cy="72" rx="3" ry="5" fill="#7ec8ff" />
            <path d="M66,80 Q75,74 84,80" stroke="#222" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
        </svg>
```

- [ ] **Step 3: Run the smoke check**

Reload. Console toggle from Step 1 reveals the kid SVG; toddler hides. Mood swap works.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add stage 1 kid SVG"
```

---

## Task 12: Inline SVG stage 2 (Tween)

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — append SVG inside `#hero-stage`

- [ ] **Step 1: Define the smoke check**

After this task, a third SVG (`#stage-2`) exists — a tween: lankier proportions, jeans, plain t-shirt, longer hair, neutral expression by default. Hidden initially. Toggle in console as in Task 11 (using `stage-2`) to verify rendering and mood swap.

- [ ] **Step 2: Append the tween SVG**

Inside `#hero-stage`, after the closing `</svg>` of stage-1, insert:

```html
        <svg id="stage-2" class="stage-svg mood-happy" viewBox="0 0 150 240" aria-label="tween" hidden>
          <!-- legs (jeans + sneakers) -->
          <rect x="58" y="155" width="14" height="40" fill="#3556a4" />
          <rect x="78" y="155" width="14" height="40" fill="#3556a4" />
          <rect x="54" y="193" width="22" height="8" rx="3" fill="#222" />
          <rect x="74" y="193" width="22" height="8" rx="3" fill="#222" />
          <!-- t-shirt -->
          <rect x="50" y="98" width="50" height="60" rx="8" fill="#aac7ff" />
          <!-- arms -->
          <rect x="32" y="102" width="22" height="14" rx="6" fill="#f6c89f" />
          <rect x="96" y="102" width="22" height="14" rx="6" fill="#f6c89f" />
          <!-- neck -->
          <rect x="68" y="88" width="14" height="10" fill="#f6c89f" />
          <!-- head -->
          <ellipse cx="75" cy="60" rx="26" ry="30" fill="#f6c89f" />
          <!-- longer hair -->
          <path d="M48,52 Q48,22 75,22 Q102,22 102,52 Q102,68 96,72 Q98,46 75,42 Q52,46 54,72 Q48,68 48,52 Z" fill="#5a3b25" />
          <!-- cheeks (subtle) -->
          <circle cx="58" cy="68" r="2" fill="#f7a8a8" opacity="0.5" />
          <circle cx="92" cy="68" r="2" fill="#f7a8a8" opacity="0.5" />
          <!-- happy face -->
          <g class="face-happy">
            <circle cx="66" cy="60" r="2.5" fill="#222" />
            <circle cx="84" cy="60" r="2.5" fill="#222" />
            <path d="M67,75 Q75,80 83,75" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round" />
          </g>
          <g class="face-tired">
            <path d="M62,60 Q66,64 70,60" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round" />
            <path d="M80,60 Q84,64 88,60" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round" />
            <line x1="66" y1="76" x2="84" y2="76" stroke="#222" stroke-width="2" stroke-linecap="round" />
          </g>
          <g class="face-cry">
            <path d="M62,58 L70,62 M62,62 L70,58" stroke="#222" stroke-width="2" stroke-linecap="round" />
            <path d="M80,58 L88,62 M80,62 L88,58" stroke="#222" stroke-width="2" stroke-linecap="round" />
            <ellipse cx="64" cy="74" rx="3" ry="5" fill="#7ec8ff" />
            <ellipse cx="86" cy="74" rx="3" ry="5" fill="#7ec8ff" />
            <path d="M66,82 Q75,76 84,82" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round" />
          </g>
        </svg>
```

- [ ] **Step 3: Run the smoke check**

Reload. Toggle stage-2 in console — tween renders. Mood swap works.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add stage 2 tween SVG"
```

---

## Task 13: Inline SVG stage 3 (Teen) with end-state overlays

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — append SVG inside `#hero-stage`, append CSS for ending overlays

- [ ] **Step 1: Define the smoke check**

After this task, a fourth SVG (`#stage-3`) exists — a teen wearing a hoodie, sneakers, with headphones around the neck. By default mood is happy. The teen SVG also contains four mutually-exclusive ending overlay groups (trophy, flowers, backpack, none). All overlays are hidden by default. Toggle in console:

```js
document.getElementById("stage-3").classList.add("ending-athlete");
```

Verify the trophy appears next to the teen. Remove the class to hide it. Repeat for `ending-joyful` (flowers) and `ending-explorer` (backpack). Reload to reset.

- [ ] **Step 2: Append the teen SVG**

Inside `#hero-stage`, after the closing `</svg>` of stage-2, insert:

```html
        <svg id="stage-3" class="stage-svg mood-happy" viewBox="0 0 160 250" aria-label="teen" hidden>
          <!-- legs (jeans + sneakers) -->
          <rect x="60" y="160" width="14" height="45" fill="#2a4380" />
          <rect x="80" y="160" width="14" height="45" fill="#2a4380" />
          <rect x="56" y="203" width="24" height="9" rx="3" fill="#fff" stroke="#222" stroke-width="1" />
          <rect x="76" y="203" width="24" height="9" rx="3" fill="#fff" stroke="#222" stroke-width="1" />
          <!-- hoodie body -->
          <rect x="48" y="98" width="56" height="65" rx="10" fill="#5a5a7a" />
          <!-- hoodie pocket -->
          <rect x="60" y="130" width="32" height="18" rx="4" fill="#4a4a6a" />
          <!-- hood -->
          <path d="M50,98 Q50,80 76,76 Q102,80 102,98 Z" fill="#5a5a7a" />
          <!-- arms -->
          <rect x="30" y="102" width="20" height="15" rx="6" fill="#5a5a7a" />
          <rect x="102" y="102" width="20" height="15" rx="6" fill="#5a5a7a" />
          <rect x="30" y="115" width="14" height="10" rx="4" fill="#f6c89f" />
          <rect x="116" y="115" width="14" height="10" rx="4" fill="#f6c89f" />
          <!-- neck -->
          <rect x="69" y="85" width="14" height="13" fill="#f6c89f" />
          <!-- head -->
          <ellipse cx="76" cy="60" rx="26" ry="30" fill="#f6c89f" />
          <!-- hair -->
          <path d="M50,52 Q50,22 76,22 Q102,22 102,52 Q102,40 76,38 Q50,40 50,52 Z" fill="#3a2818" />
          <!-- headphones -->
          <path d="M48,58 Q48,30 76,28 Q104,30 104,58" stroke="#222" stroke-width="3" fill="none" />
          <rect x="44" y="55" width="10" height="18" rx="3" fill="#222" />
          <rect x="98" y="55" width="10" height="18" rx="3" fill="#222" />
          <!-- happy face -->
          <g class="face-happy">
            <circle cx="68" cy="60" r="2.5" fill="#222" />
            <circle cx="84" cy="60" r="2.5" fill="#222" />
            <path d="M68,76 Q76,82 84,76" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round" />
          </g>
          <g class="face-tired">
            <path d="M64,60 Q68,64 72,60" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round" />
            <path d="M80,60 Q84,64 88,60" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round" />
            <line x1="68" y1="76" x2="84" y2="76" stroke="#222" stroke-width="2" stroke-linecap="round" />
          </g>
          <g class="face-cry">
            <path d="M64,58 L72,62 M64,62 L72,58" stroke="#222" stroke-width="2" stroke-linecap="round" />
            <path d="M80,58 L88,62 M80,62 L88,58" stroke="#222" stroke-width="2" stroke-linecap="round" />
            <ellipse cx="66" cy="74" rx="3" ry="5" fill="#7ec8ff" />
            <ellipse cx="86" cy="74" rx="3" ry="5" fill="#7ec8ff" />
            <path d="M68,82 Q76,76 84,82" stroke="#222" stroke-width="2" fill="none" stroke-linecap="round" />
          </g>

          <!-- ending overlays (hidden unless ending-* class set on the svg) -->
          <g class="ending-athlete">
            <rect x="115" y="120" width="14" height="20" fill="#d4af37" />
            <rect x="110" y="138" width="24" height="6" fill="#a8862c" />
            <path d="M115,125 Q110,130 115,135 M129,125 Q134,130 129,135" stroke="#d4af37" stroke-width="3" fill="none" />
            <text x="118" y="135" font-size="10" font-weight="700" fill="#222">1</text>
          </g>
          <g class="ending-joyful">
            <circle cx="20" cy="120" r="6" fill="#ff7aa2" />
            <circle cx="14" cy="115" r="3.5" fill="#ffd6e0" />
            <circle cx="26" cy="115" r="3.5" fill="#ffd6e0" />
            <circle cx="14" cy="125" r="3.5" fill="#ffd6e0" />
            <circle cx="26" cy="125" r="3.5" fill="#ffd6e0" />
            <line x1="20" y1="126" x2="20" y2="160" stroke="#3a8a3a" stroke-width="2" />
          </g>
          <g class="ending-explorer">
            <rect x="42" y="100" width="20" height="32" rx="6" fill="#7a4a2a" />
            <rect x="46" y="106" width="12" height="6" rx="2" fill="#5a3a20" />
            <path d="M44,100 Q44,90 52,90 Q60,90 60,100" stroke="#7a4a2a" stroke-width="3" fill="none" />
          </g>
        </svg>
```

- [ ] **Step 3: Append CSS for the ending overlays**

Inside `<style>`, before `</style>`:

```css
.stage-svg .ending-athlete,
.stage-svg .ending-joyful,
.stage-svg .ending-explorer { display: none; }
.stage-svg.ending-athlete  .ending-athlete  { display: inline; }
.stage-svg.ending-joyful   .ending-joyful   { display: inline; }
.stage-svg.ending-explorer .ending-explorer { display: inline; }
```

- [ ] **Step 4: Run the smoke check**

Reload. Toggle the teen SVG via:

```js
document.getElementById("stage-0").hidden = true;
document.getElementById("stage-3").hidden = false;
```

Teen renders with hoodie + headphones. Add `ending-athlete` class — trophy appears. Swap to `ending-joyful` — flower appears in the other position. Swap to `ending-explorer` — backpack appears. Mood toggles work.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add stage 3 teen SVG with athlete/joyful/explorer overlays"
```

---

## Task 14: Stage swap and mood overlay logic in `render()`

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — extend `render()` to show only the active stage and apply mood class

- [ ] **Step 1: Define the smoke check**

After this task, the visible SVG matches `state.stage`:
- Reload — toddler visible (age 3).
- Force `__game.state.age = 7; __game.state.stage = 1; __game.render();` — kid visible, toddler hidden.
- Force age 12, stage 2 — tween visible.
- Force age 17, stage 3 — teen visible.

Mood swap is automatic:
- Default mood is happy.
- Force `__game.state.stats.stamina = 10; __game.render();` — current stage shows tired face.
- Force `__game.state.crying = true; __game.render();` — current stage shows crying face. (Other buttons are also locked from Task 9, expected.)

- [ ] **Step 2: Add `applyStageAndMood()` and call it from `render()`**

Inside the IIFE, near the other render helpers, add:

```js
      function applyStageAndMood() {
        for (const s of STAGES) {
          const svg = document.getElementById(s.svgId);
          svg.hidden = s.index !== state.stage;
        }
        const activeSvg = document.getElementById(STAGES[state.stage].svgId);
        const mood = state.crying ? "mood-cry"
                   : state.stats.stamina < TIRED_THRESHOLD ? "mood-tired"
                   : "mood-happy";
        activeSvg.classList.remove("mood-happy", "mood-tired", "mood-cry");
        activeSvg.classList.add(mood);
      }
```

Update `render()`:

```js
      function render() {
        ensureBars();
        renderBars();
        renderFoods();
        renderActivities();
        applyStageAndMood();
        $ageStage.textContent = `Age ${state.age} · Stage: ${STAGES[state.stage].name}`;
        $sleepBtn.classList.toggle("pulse", state.crying);
        $sleepBtn.disabled = state.phase !== "playing";
        $statusText.textContent = state.crying ? "Baby is crying. Help them rest." : "";
      }
```

- [ ] **Step 3: Run the smoke check**

Reload. Toddler visible. Step through ages and confirm stage swaps. Force tired/cry stats and confirm mood swaps on whichever stage is showing.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: stage swap and mood overlay driven from state"
```

---

## Task 15: Age-up animation and floating "+1"

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — append CSS keyframes (already present from Task 10), trigger `age-up` class from `applyAction`, add floating text element

- [ ] **Step 1: Define the smoke check**

After this task, when the player ages up:
- The active SVG briefly scales up and settles back (600ms bump).
- A small green "+1" text floats up above the head and fades out (~700ms).

Reload, then click healthy foods 6 times. On the 6th click, age advances from 3 → 4. Verify the bump animation runs and the +1 floater appears.

- [ ] **Step 2: Append CSS for the floater**

Inside `<style>`, before `</style>`:

```css
#hero-stage { position: relative; }
#age-up-floater {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-weight: 800;
  color: #2e8b57;
  font-size: 22px;
  pointer-events: none;
  opacity: 0;
}
@keyframes age-up-floater-anim {
  0%   { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -32px); }
}
#age-up-floater.run { animation: age-up-floater-anim 700ms ease-out forwards; }
```

- [ ] **Step 3: Inject the floater element**

Find:

```html
      <div id="hero-stage">
```

Replace with:

```html
      <div id="hero-stage">
        <div id="age-up-floater">+1</div>
```

(The `+1` lives at the top of the hero-stage; it's positioned absolutely.)

- [ ] **Step 4: Trigger the animation in `applyAction`**

Find the age-up block in `applyAction`:

```js
        // 5. Age-up
        if (state.xp >= XP_PER_AGE && state.age < MAX_AGE) {
          state.age++;
          state.xp = 0;
          state.stage = computeStage(state.age);
        }
```

Replace with:

```js
        // 5. Age-up
        if (state.xp >= XP_PER_AGE && state.age < MAX_AGE) {
          state.age++;
          state.xp = 0;
          state.stage = computeStage(state.age);
          // Schedule the bump and floater after render so the active SVG is visible.
          queueAgeUpAnimation();
        }
```

Add the helper near `applyStageAndMood`:

```js
      function queueAgeUpAnimation() {
        // Defer until after this frame's render so we know which SVG is active.
        requestAnimationFrame(() => {
          const svg = document.getElementById(STAGES[state.stage].svgId);
          svg.classList.remove("age-up");
          // force reflow so re-adding the class restarts the animation
          void svg.offsetWidth;
          svg.classList.add("age-up");

          const floater = document.getElementById("age-up-floater");
          floater.classList.remove("run");
          void floater.offsetWidth;
          floater.classList.add("run");
        });
      }
```

- [ ] **Step 5: Run the smoke check**

Reload. Click 🍎 Apple six times. On the sixth click, age becomes 4, the toddler bumps, and a green "+1" floats up above. Continue to age up through stage transitions; the bump should also play when the new (different) stage SVG appears.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: age-up bump animation and +1 floater"
```

---

## Task 16: End screen with variant illustration and Play Again

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — fill in `#end-screen`, add `endScreenVariant`, hide game UI on `phase === 'ended'`, wire Play Again

- [ ] **Step 1: Define the smoke check**

After this task, when the child reaches age 18 the game UI hides and an end screen shows with:
- A title matching the variant (e.g. "🏃 The Athlete")
- The teen SVG with the matching ending overlay (trophy, flowers, or backpack — or just teen for "They Made It")
- Subtitle "You raised them from 3 to 18!"
- Stats summary: stamina / strength / happiness, and lifetime totals (meals/healthy/junk/activities/sleeps/cry-episodes)
- A Play Again button that resets to age 3 with the toddler SVG and clears the end screen

Force the path quickly via console:

```js
__game.state.age = 17; __game.state.xp = 5; __game.render();
// Then click any healthy food. On the +1 XP, age becomes 18 → end screen.
```

- [ ] **Step 2: Append CSS for end screen**

Inside `<style>`, before `</style>`:

```css
#end-screen {
  background: rgba(255,255,255,0.85);
  border-radius: 16px;
  padding: 16px;
  text-align: center;
}
#end-screen h2 { margin: 4px 0 12px; font-size: 22px; }
#end-screen .end-illustration { margin: 8px 0 16px; display: flex; justify-content: center; }
#end-screen .end-illustration svg { width: 200px; height: auto; }
#end-screen ul { list-style: none; padding: 0; margin: 12px 0; font-size: 14px; }
#end-screen li { margin: 4px 0; }
#play-again {
  margin-top: 12px;
  padding: 10px 18px;
  background: #ffd56b;
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
  border: 1px solid #c9a440;
  flex-direction: row;
}
.game-hidden { display: none !important; }
```

- [ ] **Step 3: Add `endScreenVariant` and `renderEndScreen`**

Inside the IIFE near `applyStageAndMood`, add:

```js
      function endScreenVariant() {
        const { stamina, strength, happiness } = state.stats;
        const max = Math.max(stamina, strength, happiness);
        if (max < 50) return { kind: "made-it", title: "🌱 They Made It", overlay: null };
        // Tie-breaker: happiness > strength > stamina
        if (happiness === max) return { kind: "joyful",   title: "😄 The Joyful Adult", overlay: "ending-joyful" };
        if (strength  === max) return { kind: "athlete",  title: "🏃 The Athlete",     overlay: "ending-athlete" };
        return { kind: "explorer", title: "🌍 The Explorer", overlay: "ending-explorer" };
      }

      function renderEndScreen() {
        // Wipe and rebuild
        $endScreen.replaceChildren();
        const v = endScreenVariant();

        const h2 = document.createElement("h2");
        h2.textContent = v.title;
        $endScreen.appendChild(h2);

        // Clone the teen SVG so we can decorate it with the ending overlay class
        // without affecting the in-game SVG used during play.
        const teen = document.getElementById("stage-3");
        const clone = teen.cloneNode(true);
        clone.removeAttribute("id");
        clone.removeAttribute("hidden");
        clone.classList.remove("mood-tired", "mood-cry");
        clone.classList.add("mood-happy");
        clone.classList.remove("ending-athlete", "ending-joyful", "ending-explorer");
        if (v.overlay) clone.classList.add(v.overlay);
        const wrap = document.createElement("div");
        wrap.className = "end-illustration";
        wrap.appendChild(clone);
        $endScreen.appendChild(wrap);

        const subtitle = document.createElement("p");
        subtitle.textContent = "You raised them from 3 to 18!";
        $endScreen.appendChild(subtitle);

        const ul = document.createElement("ul");
        const lines = [
          `Final stamina: ${state.stats.stamina}`,
          `Final strength: ${state.stats.strength}`,
          `Final happiness: ${state.stats.happiness}`,
          `Meals: ${state.history.meals} (healthy ${state.history.healthyMeals} · junk ${state.history.junkMeals})`,
          `Activities: ${state.history.activities}`,
          `Sleeps: ${state.history.sleeps}`,
          `Cry episodes: ${state.history.cryEpisodes}`,
        ];
        for (const line of lines) {
          const li = document.createElement("li");
          li.textContent = line;
          ul.appendChild(li);
        }
        $endScreen.appendChild(ul);

        const btn = document.createElement("button");
        btn.id = "play-again";
        btn.textContent = "Play Again";
        btn.addEventListener("click", playAgain);
        $endScreen.appendChild(btn);
      }

      function playAgain() {
        reset();
        render();
      }
```

- [ ] **Step 4: Update `render()` to show/hide end screen**

Replace the body of `render()`:

```js
      function render() {
        ensureBars();
        renderBars();
        renderFoods();
        renderActivities();
        applyStageAndMood();
        $ageStage.textContent = `Age ${state.age} · Stage: ${STAGES[state.stage].name}`;
        $sleepBtn.classList.toggle("pulse", state.crying);
        $sleepBtn.disabled = state.phase !== "playing";
        $statusText.textContent = state.crying ? "Baby is crying. Help them rest." : "";

        const ended = state.phase === "ended";
        for (const id of ["age-stage", "hero", "bars", "foods", "activities", "sleep-btn"]) {
          document.getElementById(id).classList.toggle("game-hidden", ended);
        }
        $endScreen.hidden = !ended;
        if (ended) renderEndScreen();
        else $endScreen.replaceChildren();
      }
```

- [ ] **Step 5: Run the smoke check**

Reload. In console:

```js
__game.state.age = 17; __game.state.xp = 5; __game.render();
```

Click 🍎 Apple. Age advances to 18 → end screen replaces the game UI. Title reflects the dominant stat. Click Play Again — game restarts, age 3, toddler visible, all bars at initial values.

Try the other variants by manipulating stats before the final click:

```js
__game.state.age = 17; __game.state.xp = 5;
__game.state.stats = { stamina: 80, strength: 30, happiness: 30 };
__game.render();
// Click apple → "🌍 The Explorer" with backpack.
```

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat: end screen with variant illustration and play-again"
```

---

## Task 17: Full-playthrough smoke + mobile layout polish

**Files:**
- Modify: `/Users/dio/works/chun-ga/.worktrees/child-feeder/index.html` — add minor responsive polish only if the smoke shows issues

- [ ] **Step 1: Define the smoke check**

After this task, the implementer has performed three full playthroughs (no console hacks):

1. **Healthy run:** Reach age 18 by alternating healthy foods + activities + occasional sleep. Confirm reaching the end screen with a non-"They Made It" ending. No errors in console. Stats above 50.

2. **Mostly-junk run:** Mostly junk foods, with just enough healthy food to push XP forward. Verify the child enters crying state when happiness hits 0, food/activity buttons disable, sleep button pulses, sleep recovers. Continue until reaching 18; expect "🌱 They Made It" because all stats end below 50. (Pure junk would never age up since junk gives −1 XP — the player must mix in some healthy items.)

3. **Stamina exhaustion:** At age 6 (after a bit of healthy feeding), repeatedly click 🚲 Bike. Confirm stamina drops, the button greys when stamina < 20, and feeding restores it.

In addition, the implementer has tested at 360px viewport (mobile size in DevTools):
- Buttons wrap cleanly into multiple rows
- All buttons are tappable (≥ 44px)
- Stage SVG fits within the hero
- End screen is readable and the Play Again button is tappable

- [ ] **Step 2: Run the three playthroughs**

Open the file. Run each playthrough described above. Note any issues in a list.

- [ ] **Step 3: Apply mobile polish only if issues were found**

If the foods grid looks too cramped on 360px, append inside `<style>` before `</style>`:

```css
@media (max-width: 380px) {
  button .label { font-size: 10px; }
  button { padding: 6px 8px; }
}
```

If stage SVGs overflow on mobile, append:

```css
@media (max-width: 380px) {
  #hero-stage svg { max-width: 70vw; }
}
```

If no issues were observed, skip Step 3.

- [ ] **Step 4: Final smoke check**

Open the file at desktop size and at 360px in DevTools. Run one short healthy playthrough at each viewport. No layout breaks; no overlapping content; no console errors.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "polish: complete child-feeder game with full playthrough validation"
```

---

## Self-review

- All 12 foods and 6 activities from the spec are present in Task 2's data tables.
- The 4 stages (Toddler/Kid/Tween/Teen) each have a dedicated task (10/11/12/13) with happy/tired/cry mood faces.
- Sleep skips per-turn decay (Task 8) per the spec's special-path requirement.
- XP is clamped to `[0, XP_PER_AGE]` (Task 6, step 3) per the spec.
- End screen variant rule (no stat ≥ 50 → "They Made It"; otherwise highest stat with happiness > strength > stamina tiebreak) is implemented in `endScreenVariant()` (Task 16).
- Crying is hard-locked: food/activity buttons disable, sleep pulses, status text shown (Task 9).
- Mobile: minimum 44px touch target on all buttons (Task 1 base CSS) plus optional 380px media query (Task 17).
- DOM hygiene: no `innerHTML` calls anywhere; all inserts use `createElement` / `textContent` / `appendChild` / `replaceChildren`.
