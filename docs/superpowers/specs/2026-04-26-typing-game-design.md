# Chun-Ga Typing Game — Design

A single-page HTML5 typing game. Player sees a grey city skyline. Each typed word colors one section of the city. Race to fill the city before the global timer expires.

## Goals

- Fun, replayable, ~2-3 minute play sessions
- Works on desktop and mobile (tap to focus, virtual keyboard input)
- Zero build step, zero dependencies, hostable as a static file
- Clean separation between game logic and rendering inside one file

## Gameplay

### Core loop

1. Game loads → start screen (or auto-start) → 13 sections of city are grey → first word appears
2. Player types the word into a visible input field
3. Each keystroke is compared to the current word
4. On full correct word → a randomly chosen grey section turns a random color from a palette → next word loads
5. Global timer ticks down throughout
6. Game ends when global timer hits 0 OR all 13 sections are completed
7. End screen shows stats; "Play Again" resets

### Rules

- **Word source:** car-themed words, 5-8 characters, ~50 curated
- **Per-word timer:** `word.length × 1.2` seconds (e.g. 6-char word = 7.2s)
- **Global timer:** 90 seconds total
- **Mistype:** the wrong letter flashes red, the input is rolled back to the last correct prefix (so player retries the same letter), and the global timer loses 2 seconds. Each rollback counts as 1 typo.
- **Word time-out:** that section stays grey, next word loads — no game-over from a single word
- **Section selection:** the order in which sections fill is randomized at game start
- **Section color:** each completed section gets a random color picked from a palette of ~6-8 saturated colors
- **Paste disabled** in the input field (no cheating)
- **Backspace allowed** so the player can manually correct before continuing

### End conditions

- **Win:** all 13 sections colored before global timer hits 0
- **Lose (timeout):** global timer reaches 0 with sections still grey

Both lead to the same end screen template, with the headline ("City complete!" / "Time's up!") differing.

### End screen

- Time used (or remaining)
- Words completed: N / 13
- Typos: N
- Accuracy: `(correctChars / (correctChars + typos)) × 100%`
- "Play Again" button → resets state and starts a new round

## Architecture

### Files

- `index.html` — single file containing inline `<style>`, DOM shell, and inline `<script>`. No build step. Open the file or serve as static asset.

### Tech choices

- **Vanilla JS** — no framework
- **SVG** for the city — each section is an addressable `<rect>` / `<polygon>` / `<path>` with `data-section-id="N"`. Coloring = setting `fill`
- **`requestAnimationFrame`** for the timer tick, with `dt` based on wall-clock so background-tab throttling doesn't gift extra time
- **CSS flex + `clamp()`** for responsive layout (works 360px → desktop)

### State shape

```js
let state = {
  phase: 'idle' | 'playing' | 'ended',
  endReason: null | 'win' | 'timeout',
  wordQueue: string[],          // remaining words, shuffled
  sectionQueue: number[],       // remaining section IDs, shuffled
  currentWord: string | null,
  currentInput: string,         // tracked separately, not pulled from DOM
  wordTimer: number,            // seconds remaining for current word
  globalTimer: number,          // seconds remaining for whole game
  typos: number,
  correctChars: number,
  sectionsCompleted: number,
  lastFrameMs: number,
};
```

### Module structure (within the single `<script>`)

- `WORDS` — const array of car-themed 5-8 char words
- `PALETTE` — const array of section colors
- `init()` — DOM lookups, attach event listeners
- `startGame()` — reset state, sample 13 words, shuffle section queue, kick off RAF loop
- `tick(now)` — RAF callback: update timers, check end conditions, schedule next frame
- `onInput(e)` — handle each keystroke: compare prefix, mark green/red, apply typo penalty, complete word
- `loadNextWord()` — pop next word, reset word timer
- `completeSection()` — pop next section ID, set its `fill` to random palette color
- `endGame(reason)` — stop loop, render end screen
- `render*()` — small render helpers: `renderWordDisplay`, `renderTimers`, `renderEndScreen`

### DOM shell

```html
<header>
  <div id="global-timer"></div>
  <div id="stats-mini"></div>
</header>
<main id="city">
  <svg id="city-svg" viewBox="0 0 1000 400">
    <!-- ground, ~13 building sections, crane, sky -->
  </svg>
</main>
<section id="word-area">
  <div id="word-display"></div>
  <div id="word-timer-bar"><div id="word-timer-fill"></div></div>
  <input id="word-input" autofocus inputmode="latin" autocapitalize="off"
         autocorrect="off" spellcheck="false" autocomplete="off"/>
</section>
<section id="end-screen" hidden>
  <h2 id="end-headline"></h2>
  <ul id="end-stats"></ul>
  <button id="play-again">Play Again</button>
</section>
```

### City SVG

A single inline `<svg viewBox="0 0 1000 400">` with:

- A sky background (gradient or flat)
- A ground strip at the bottom
- ~13 building rectangles of varied heights and widths, edge-to-edge along the ground
- Each building is `data-section-id="N"` with `fill="#aaa"`
- A few decorative non-section elements (cranes, windows) — these are not greyed/colored, they stay the same

The exact city layout is hand-authored once. The coloring is dynamic.

### Input handling

- Input is read on every `input` event
- Compare `input.value` to `state.currentWord.slice(0, input.value.length)`
- If full match prefix → render letters green up to that point, white for remaining
- If mismatch at the last typed character → red flash on that letter (CSS class for ~150ms), `state.typos++`, `state.globalTimer -= 2`, then truncate `input.value` back to the last correct prefix and re-render
- If `input.value === state.currentWord` → call `completeSection()` then `loadNextWord()`

### Mobile considerations

- The visible `<input>` ensures the OS keyboard appears on tap
- Layout: city SVG flex-shrinks; word-area is sticky to the bottom (above keyboard)
- Tap anywhere on the page (outside the input) re-focuses the input
- `inputmode="latin"`, `autocapitalize="off"`, `autocorrect="off"`, `spellcheck="false"` prevent mobile autocorrect interference
- Touch target for "Play Again" button minimum 44px

### Word list

48 entries, all strictly 5-8 chars, lowercase, deduped, ASCII only.

```
sedan, coupe, wagon, truck, tires, turbo, motor, drift, rally, viper,
hybrid, engine, piston, brakes, clutch, wheels, bumper, fender, mirror,
carbon, diesel, petrol, garage, tunnel, airbag, camaro, beetle, jaguar,
gasket, gearbox, chassis, exhaust, highway, traffic, license, mileage,
battery, sunroof, ferrari, mustang, porsche, shifter, muffler, antenna,
ignition, radiator, seatbelt, steering
```

### Color palette

```
#e74c3c (red)
#3498db (blue)
#f1c40f (yellow)
#27ae60 (green)
#9b59b6 (purple)
#e67e22 (orange)
#1abc9c (teal)
#e84393 (pink)
```

When a section completes, pick one at random.

## Error handling

- No network, no persistence → no I/O failure modes
- Background tab throttling: tick uses wall-clock `dt`, so player can't pause by switching tabs
- Lost input focus on mobile: any tap or keypress on the page refocuses
- Empty word list edge case: not possible (constant ≥ 13 entries enforced)

## Testing

Manual smoke test via the browser. No automated test harness for v1 — game logic is small and the value of full test coverage doesn't justify dragging in a test runner. If logic grows, extract `game.js` as an ES module and add Vitest later.

Smoke test checklist:

1. Open `index.html` directly (or via static server)
2. Type the first word correctly within timer → a grey section colors in
3. Mistype a letter → red flash on that letter, global timer drops by 2s, input rolls back
4. Stop typing → word timer expires → section stays grey, new word loads
5. Let global timer hit 0 → end screen shows "Time's up!" with stats
6. Run a fresh game and complete all 13 sections → end screen shows "City complete!"
7. Click "Play Again" → fresh game, all sections grey again, timer reset to 90s
8. Open on a phone in portrait — input box visible, virtual keyboard appears on tap, layout fits 360px width

## Out of scope (v1)

- Sound effects / music
- Difficulty levels (only one mode)
- Leaderboard / high-score persistence
- Multiplayer
- Word categories beyond cars
- Animations beyond simple color fill (could add a "section pop" later)
