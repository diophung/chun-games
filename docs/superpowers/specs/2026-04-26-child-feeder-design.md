# Chun-Ga Child Feeder — Design

A single-page HTML5 game where the player raises a cartoon child from age 3 to 18 by feeding them food and choosing activities. Healthy choices grow the child; junk food makes them unhappy and eventually cry. Sleep is the recovery action.

## Goals

- Fun, replayable ~5-8 minute playthroughs
- Works on desktop and mobile (touch targets, responsive layout)
- Zero build step, zero dependencies, hostable as a static file
- Single `index.html` matching the typing-game pattern
- Distinctive hand-drawn SVG art (not emoji) for the child across 4 visual stages

## Gameplay

### Core loop

1. Game loads → child starts at age 3, stats and XP at initial values
2. Player picks an action: feed a food, do an activity, or sleep
3. Action applies stat deltas + XP delta, plus per-turn decay
4. If `xp >= XP_PER_AGE`, age advances by 1; the child may move to the next visual stage
5. If `happiness <= 0`, child enters `crying` state — only the Sleep button is usable
6. Loop continues until age reaches 18 → end screen

### Aging

- **Action-driven, XP-bar based.** Healthy actions add XP; junk food removes XP.
- `XP_PER_AGE = 6`. Each healthy action is +1 XP; each junk meal is -1 XP. Reaching 6 → `age++`, `xp = 0`.
- 15 age-ups (3 → 18) ≈ 90 healthy actions per perfect run, ~5-8 minutes.

### Stats

Three stats, each clamped to `[0, 100]`. XP is also clamped to `[0, XP_PER_AGE]` (junk food can't drive XP below 0; once an age-up triggers, XP resets to 0).

- **Stamina** — energy to do activities; restored fully by sleep
- **Strength** — durable physical stat; doesn't decay
- **Happiness** — drops with junk food and exhaustion; reaching 0 triggers crying

**Initial values:** `{ stamina: 60, strength: 50, happiness: 70 }`

**Per-turn decay** (every action, including sleep): `stamina -1`, `happiness -1`. `strength` does not decay.

### Crying (hard lock)

- Triggered when `happiness <= 0` after any action
- While crying:
  - Food and activity buttons are disabled (`disabled` attribute set, greyed visually)
  - Sleep button is the only enabled action and visually pulses
  - Status text under the child reads "Baby is crying. Help them rest."
  - Mood overlay swaps to crying face on the SVG
- Sleep clears `crying` and brings happiness back above zero (see Sleep below)

### End condition

When `age >= 18` after any action, the game enters `phase = 'ended'` and shows the end screen. There is no lose state — the player always reaches 18 eventually.

## Content

### Foods (12 items)

| # | Emoji | Name | Stamina | Strength | Happiness | XP |
|---|---|---|---|---|---|---|
| 1 | 🍎 | Apple | +5 | +2 | +3 | +1 |
| 2 | 🥦 | Broccoli | +3 | +6 | -2 | +1 |
| 3 | 🥛 | Milk | +4 | +5 | +2 | +1 |
| 4 | 🥚 | Egg | +5 | +5 | +1 | +1 |
| 5 | 🍞 | Bread | +6 | +1 | +1 | +1 |
| 6 | 🐟 | Fish | +3 | +6 | +2 | +1 |
| 7 | 🥕 | Carrot | +3 | +3 | +1 | +1 |
| 8 | 🍪 | Cookie | +1 | -2 | +6 | -1 |
| 9 | 🍟 | Fries | -2 | -3 | +5 | -1 |
| 10 | 🍔 | Burger | +1 | -3 | +4 | -1 |
| 11 | 🥤 | Soda | -3 | -4 | +6 | -1 |
| 12 | 🍰 | Cake | -1 | -4 | +7 | -1 |

Foods 1-7 are healthy (positive XP). Foods 8-12 are junk (negative XP). Veggies (broccoli, carrot) deliberately have low or negative happiness — they're good for stats but not loved.

### Activities (6 items, age-gated)

| # | Emoji | Name | Unlock age | Stamina cost | Strength | Happiness | XP |
|---|---|---|---|---|---|---|---|
| 1 | 🧸 | Play with toys | 3 | -10 | 0 | +8 | +1 |
| 2 | 🎨 | Draw | 5 | -5 | 0 | +6 | +1 |
| 3 | 🚲 | Ride bike | 6 | -20 | +5 | +6 | +1 |
| 4 | 📚 | Read book | 8 | -5 | +1 | +4 | +1 |
| 5 | ⚽ | Sports | 11 | -25 | +10 | +7 | +1 |
| 6 | 🏋️ | Workout | 14 | -30 | +14 | +3 | +1 |

Activities are always rendered. Locked ones (`age < unlock`) are greyed and show a lock indicator with the unlock age (e.g., "🔒11"). Unlocked activities require `stamina >= |stamina cost|`; otherwise the button is disabled with a hint ("Too tired").

### Sleep

Always present. Even available during crying (in fact, that's its main purpose).

Sleep is implemented as a special action — it does not go through the standard delta + decay path. Order of operations:

1. `happiness += 30`
2. `stamina = 100` (set, not added — overrides any decay)
3. Clamp stats to `[0, 100]`
4. `crying = false`
5. `xp` unchanged (no XP gained or lost from sleep)
6. `history.sleeps++`
7. End-condition check (`age >= 18`)

Per-turn decay is intentionally skipped for sleep — sleep is a recovery action, not a tax.

## Visual stages

Four hand-coded inline SVGs (~150x200 viewBox each), one per stage. Only the active stage's SVG is visible (`hidden` attribute on the others).

| Stage | Index | Ages | Look |
|---|---|---|---|
| Toddler | 0 | 3-5 | Tiny body, big round head, sparse hair, diaper, holding a teddy bear |
| Kid | 1 | 6-9 | Slightly taller, t-shirt + shorts, full hair, shoes, big grin |
| Tween | 2 | 10-13 | Lankier proportions, jeans + t-shirt, longer hair, neutral expression |
| Teen | 3 | 14-18 | Tallest, hoodie + sneakers, defined face, headphones around neck |

### Mood overlay

Each SVG contains three mutually-exclusive face groups: `<g class="face-happy">`, `<g class="face-tired">`, `<g class="face-cry">`. The active mood is set via a CSS class on the SVG root (`.mood-happy`, `.mood-tired`, `.mood-cry`); CSS shows the matching `<g>` and hides the others.

Mood resolution after each action:
- `state.crying` → `mood-cry`
- else `state.stats.stamina < 25` → `mood-tired`
- else → `mood-happy`

### Age-up animation

When `age` increments, run a 600ms CSS keyframe on the visible SVG: scale up to 1.15, settle back to 1.0, with a small floating "+1" text element above the head.

## UI layout

Single column, centered, max-width ~520px. Stacks naturally on mobile.

```
+---------------------------------------+
| Age 7 · Stage: Kid                    |
+---------------------------------------+
|                                       |
|             [BABY SVG]                |
|        (status text under it)         |
|                                       |
+---------------------------------------+
| XP        ████████░░░░░░░░ 4 / 6      |
| Stamina   ██████████░░░░░ 65          |
| Strength  █████████░░░░░░ 50          |
| Happiness ████████████░░░ 75          |
+---------------------------------------+
| Foods                                 |
| 🍎 🥦 🥛 🥚 🍞 🐟 🥕                  |
| 🍪 🍟 🍔 🥤 🍰                        |
+---------------------------------------+
| Activities                            |
| 🧸 🎨 🚲 📚 ⚽🔒11 🏋️🔒14             |
+---------------------------------------+
|             [😴 Sleep]                 |
+---------------------------------------+
```

- Stat bar fill color shifts: `>=70` green, `30-69` yellow, `<30` red
- XP bar uses a distinct accent color (e.g., gold)
- Buttons: min 44px tall, emoji + name, label below for clarity
- When crying: food and activity buttons greyed (disabled), sleep button has a pulsing CSS animation

## End screen

Determine ending variant by the highest final stat. Tie-breaker order: `happiness > strength > stamina`.

| Dominant stat | Variant title | Illustration tweak |
|---|---|---|
| Strength (highest, ≥ 50) | 🏃 The Athlete | Teen SVG with a trophy |
| Happiness (highest, ≥ 50) | 😄 The Joyful Adult | Teen SVG with a wide smile + flowers |
| Stamina (highest, ≥ 50) | 🌍 The Explorer | Teen SVG with a backpack |
| No stat ≥ 50 | 🌱 They Made It | Teen SVG, default look |

Logic: pick the highest stat. If that highest stat is `< 50`, the player struggled — show "They Made It". Otherwise show the variant for the highest stat. Tie-breaker among stats `≥ 50`: `happiness > strength > stamina`.

The illustration tweak is a small `<g>` overlay added on top of the teen SVG, toggled by an end-state class.

The end screen also shows:

- "You raised them from 3 to 18!"
- Final stats (stamina / strength / happiness)
- Lifetime totals from `state.history`: meals (healthy / junk), activities done, sleeps, cry episodes
- Play Again button → calls `reset()` which restores initial state and re-renders

## Architecture

### Files

- `index.html` — single file with inline `<style>`, DOM, and `<script>`. No build step.

### Tech choices

- **Vanilla JS** — no framework, no dependencies
- **Inline SVG** — four stage SVGs hand-coded directly in HTML
- **CSS** — flex layout, `clamp()` for responsive sizing, keyframe animations for age-up and crying
- **No persistence** — game state is in-memory only; refresh resets

### State shape

```js
let state = {
  phase: 'playing',                 // 'playing' | 'ended'
  age: 3,
  stage: 0,                          // 0..3 (computed from age)
  stats: { stamina: 60, strength: 50, happiness: 70 },
  xp: 0,
  crying: false,
  history: {
    meals: 0,
    healthyMeals: 0,
    junkMeals: 0,
    activities: 0,
    sleeps: 0,
    cryEpisodes: 0,
  },
};
```

### Constants

```js
const XP_PER_AGE = 6;
const MAX_STAT = 100;
const TIRED_THRESHOLD = 25;
const FOODS = [ /* 12 entries from table above */ ];
const ACTIVITIES = [ /* 6 entries from table above */ ];
const STAGES = [
  { index: 0, min: 3, max: 5, name: 'Toddler', svgId: 'stage-0' },
  { index: 1, min: 6, max: 9, name: 'Kid', svgId: 'stage-1' },
  { index: 2, min: 10, max: 13, name: 'Tween', svgId: 'stage-2' },
  { index: 3, min: 14, max: 18, name: 'Teen', svgId: 'stage-3' },
];
```

### Module structure (within the single `<script>`)

- `init()` — render food/activity buttons once, attach event listeners, run first `render()`
- `feed(foodId)` — apply that food's deltas via `applyAction()`
- `doActivity(activityId)` — apply that activity's deltas via `applyAction()`
- `sleep()` — special path that does NOT call `applyAction()` (skips per-turn decay). Sets `happiness += 30`, `stamina = 100`, clamps, sets `crying = false`, increments `history.sleeps`, then runs the end-condition check and calls `render()`
- `applyAction({ stamina, strength, happiness, xp, isMeal, isHealthy, isActivity, isSleep })` — single mutation entry point:
  1. Apply deltas to stats and xp
  2. Apply per-turn decay (`stamina -1`, `happiness -1`)
  3. Clamp stats to `[0, 100]`
  4. Update history counters
  5. If `xp >= XP_PER_AGE` → `age++`, `xp = 0`, recompute stage, trigger age-up animation if stage changed
  6. If `happiness <= 0` and not already crying → `crying = true`, `history.cryEpisodes++`
  7. If `age >= 18` → `phase = 'ended'`
  8. Call `render()`
- `computeStage(age)` → returns the stage index for an age
- `render()` — full re-render:
  - Header: age + stage name
  - Show only the active stage's SVG, hide others
  - Set mood class on the active SVG
  - Update XP and stat bars (width % and color tier)
  - Update food buttons: disabled if `crying`
  - Update activity buttons: disabled if `crying` or locked (age < unlock) or insufficient stamina
  - Update sleep button: pulse class if crying
  - If `phase === 'ended'`: hide game UI, show end screen with the variant
- `endScreenVariant()` → returns `'athlete' | 'joyful' | 'explorer' | 'made-it'` based on stat dominance and tie-breakers
- `reset()` — restore initial state, hide end screen, re-render

### DOM shell

```html
<main id="app">
  <header id="age-stage">Age 3 · Stage: Toddler</header>
  <div id="hero">
    <svg id="stage-0">...</svg>
    <svg id="stage-1" hidden>...</svg>
    <svg id="stage-2" hidden>...</svg>
    <svg id="stage-3" hidden>...</svg>
    <p id="status-text"></p>
  </div>
  <section id="bars">
    <div class="bar" id="xp-bar"><span class="bar-label">XP</span><div class="bar-fill"></div><span class="bar-value"></span></div>
    <div class="bar" id="stamina-bar">...</div>
    <div class="bar" id="strength-bar">...</div>
    <div class="bar" id="happiness-bar">...</div>
  </section>
  <section id="foods"></section>
  <section id="activities"></section>
  <button id="sleep-btn">😴 Sleep</button>
  <section id="end-screen" hidden>
    <h2 id="end-title"></h2>
    <div id="end-illustration"></div>
    <ul id="end-stats"></ul>
    <button id="play-again">Play Again</button>
  </section>
</main>
```

Food and activity buttons are rendered programmatically from the `FOODS` and `ACTIVITIES` arrays so the data tables stay the source of truth.

## Error handling

- All state mutation flows through `applyAction()`. Stats clamp at `[0, 100]` after every action; there's no path to negative or > 100.
- Buttons that should be disabled get the `disabled` attribute in `render()`, so a click can't bypass UI rules.
- Reaching `age = 18` mid-action: the action fully applies (last meal counts toward history), then the end screen renders.
- Sleep during crying: the special-case in `sleep()` clears `crying` before render, so the player can always recover.

## Testing

Manual smoke playthrough — performed by the implementer before reporting complete:

1. **Healthy run:** feed only foods 1-7 alternated with activities and occasional sleep. Verify reaching age 18 with high stats and a non-"They Made It" ending.
2. **Junk run:** feed only foods 8-12 repeatedly. Verify happiness drops, child enters crying state, food/activity buttons disable, sleep recovers, eventually reaches 18 with low stats and the "They Made It" ending.
3. **Activity gating:** at age 3 verify only "Play with toys" is unlocked; verify other activities unlock at their declared ages.
4. **Stamina gate:** at low stamina, verify high-cost activities show as disabled.
5. **Mobile layout:** at 360px viewport, verify buttons wrap and remain tappable (≥44px).

No automated tests for this scope, matching the typing-game project pattern.

## Out of scope

- Sound or music
- Persistence / save state across reloads
- Difficulty modes
- Multiple children / family
- Animation libraries
- Localization
