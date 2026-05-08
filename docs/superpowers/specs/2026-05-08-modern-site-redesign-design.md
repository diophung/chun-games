# WiGa Modern Site Redesign — Design

Transform the Chun-Ga repo into a modern, kid- and family-friendly HTML5 game site rebranded as **WiGa** ("William's Games"). Adds a top navigation bar with four sections — Single Player, Multi-Player, High Scores, Donate — a hero band on the home page, and a shared sticky header + footer across every chrome page. Introduces the first multi-player game, *Memory Match Duel*.

## Goals

- Give the catalog a coherent, kid-friendly visual identity (playful pastel palette, chunky shapes, rounded corners).
- Add a real navigation menu with four sections, all reachable from any chrome page.
- Preserve the project's existing constraints: zero build step, no package manager, no test suite, no third-party runtime deps beyond what individual games already use (Three.js for `zoomy-car`).
- Keep every existing game playable at its current URL — this is a chrome and catalog redesign, not a rewrite of the games.
- Ship the first multi-player game (*Memory Match Duel*) so the new "Multi-Player" tab has real content.

## Scope summary

**Changes:**

- `index.html` — heavy refactor: new header, hero, restyled card grid, new footer; floating high-scores sidebar removed.
- Three new chrome pages: `multiplayer.html`, `high-scores.html`, `donate.html`.
- One new game: `games/memory-match-duel.html` (forked from `games/memory-match.html`).
- One new shared stylesheet: `assets/site.css` (covers chrome only — header, nav, footer, hero, palette tokens).
- One new shared script: `assets/site.js` (~30 LOC — marks the active nav link based on `location.pathname`).
- New thumbnail SVGs for the multi-player card and the donate hero illustration (inline, no PNGs).
- `README.md` — updated to describe the new site structure and add a *Multi-Player Games* section.

**Unchanged:**

- All 10 existing single-player games (`games/<id>.html`) — fully self-contained, untouched.
- `games/high-scores.js` — used as-is by the new High Scores page.
- `run.sh`, `.gitignore`, `.github/`, the per-game-file contract.

## Architecture

### File layout

```
index.html              ← restyled — Single Player catalog (home)
multiplayer.html        ← NEW — Multi-Player catalog
high-scores.html        ← NEW — all leaderboards
donate.html             ← NEW — thank-you + placeholder donate button

assets/
  site.css              ← NEW — shared chrome styles (header, nav, footer, hero, tokens)
  site.js               ← NEW — small active-nav-link helper

games/
  memory-match-duel.html ← NEW — 2-player pass-and-play
  high-scores.js         ← unchanged
  <existing>.html        ← unchanged
```

### Shared chrome contract

Every chrome page (`index`, `multiplayer`, `high-scores`, `donate`) has the same `<header>` and `<footer>` blocks copy-pasted into the HTML, and pulls `assets/site.css` + `assets/site.js`. The script reads `location.pathname` and adds `aria-current="page"` + an `is-active` class to the matching nav link — so all four pages can ship identical header markup with no per-page edits.

Game pages (`games/<id>.html`) keep the existing per-game contract: fully self-contained, no shared CSS/JS imports, mobile-first. They do **not** include the site header or `site.css` — they preserve their own immersive full-screen game UI.

### Tech choices

- **Vanilla HTML/CSS/JS.** No framework, no build, no package manager.
- **CSS custom properties** for the palette tokens, defined on `:root` in `site.css` so any chrome page (and the duel game's setup screen) can reuse them.
- **Inline SVGs** for hero illustrations and the new thumbnail. No external image files for new artwork. Existing PNG screenshots in `docs/screenshots/` are unchanged and continue to drive the README + card thumbnails.
- **No JS routing.** Each nav click is a real page navigation. Pages refresh-friendly, deep-linkable.

## Visual system

### Palette tokens (defined in `assets/site.css`)

| Token            | Color     | Use                                    |
|------------------|-----------|----------------------------------------|
| `--bg`           | `#fff8f0` | Page background (top of gradient)      |
| `--bg-end`       | `#d6f0ff` | Page background (bottom of gradient)   |
| `--mint`         | `#b8e8d4` | Primary accent / active nav / Player 1 |
| `--peach`        | `#ffd6b3` | Secondary accent / Player 2            |
| `--sky`          | `#a4d8f5` | Tertiary accent                        |
| `--butter`       | `#fff2a6` | Highlight                              |
| `--coral`        | `#ffb3c1` | Call-to-action / hover                 |
| `--ink`          | `#2a2a3a` | Body text                              |
| `--ink-soft`     | `#5b6072` | Secondary text                         |
| `--card`         | `#ffffff` | Card surface                           |

All darker outline variants are derived in CSS by mixing each token with `--ink` at low alpha — no second hand-tuned palette to keep in sync.

### Shape / type system

- Border radius: **24px** on cards & hero, **16px** on buttons, **999px** on nav pills.
- Outlines: **2–3px solid** in a darker shade of each block's accent color — gives the chunky cartoon feel.
- Shadows: layered — `0 6px 18px rgba(15, 23, 42, 0.10)` plus a subtle `inset 0 1px 0 rgba(255, 255, 255, 0.7)`.
- Typography: system rounded stack — `"SF Pro Rounded", "Avenir Next", "Quicksand", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`. Headings 700, body 500, tags 600 uppercase.

### Header & nav

- Sticky top, ~64px tall, cream background (`--bg`), 1px coral underline.
- Left: logo block — `🎮 WiGa` (compact). On screens ≥768px, append `— William's Games` in `--ink-soft` smaller text.
- Right (desktop) / wrap below (mobile): four pill-shaped nav links — *Single Player · Multi-Player · High Scores · Donate*. The active link is filled with `--mint` + 2px outline. Hover/focus on inactive links: peach background.
- On screens <640px: nav wraps onto additional rows below the logo (no hamburger). The exact number of rows depends on label width at the current viewport — the contract is that all four pills remain visible without horizontal scrolling.

### Footer

- Single line, centered, muted text: *"Made by William with ❤️ and AI coding agents."*
- Two small text links to the right: **GitHub** (the repo) and **README**.
- 1px coral divider above the row.

### Hero (only on `index.html`)

- Full-width band directly under the sticky header.
- Two-column on desktop, stacked on mobile:
  - **Left column:** small "William's Games" eyebrow → big "WiGa 🎮" headline → tagline *"Tiny browser games for kids and families."* → two CTA buttons:
    - **"Play Single-Player ▶"** — anchor to `#games` further down the page.
    - **"Try Multi-Player 👬"** — link to `multiplayer.html`.
  - **Right column:** inline SVG illustration — a friendly pastel scene with cartoon kids, a cat, a tiny car, and a tiny dragon (visual roll-call of the game catalog). ~480px wide on desktop, fluid below.

## Pages

### `index.html` — Single Player

- Sticky header + nav (active: **Single Player**).
- Hero band (only on this page; described above).
- Section with `id="games"`: `<h2>` "All Games" + the existing 10-card grid restyled with the new pastel system. The `id` is the anchor target for the hero's "Play Single-Player ▶" CTA. Card content is unchanged — same thumbnails, titles, descriptions, tags, "Play →" links. The existing inline `<style>` for cards is replaced by selectors that match the chrome stylesheet.
- The existing **floating high-scores sidebar is removed** — its function is now served by the dedicated High Scores page.
- Footer.

### `multiplayer.html` — Multi-Player

- Sticky header + nav (active: **Multi-Player**).
- Page title block: `<h1>` "Multi-Player 👬" + subtitle *"Two players, one screen — no internet needed."*
- Card grid (same card style as the home grid):
  - **1 real card** — *Memory Match Duel*. New inline SVG thumbnail (16:9) showing two cards facing off, mint vs peach. Description: *"A 4×4 memory grid for two players, taking turns. Whoever finds more pairs wins."* Tags: `2 PLAYERS · PASS-AND-PLAY · CARDS`. "Play →" links to `games/memory-match-duel.html`.
  - **1 "Coming soon" placeholder card** — dashed outline, muted colors, copy *"More multi-player games are on the way!"* No link.
- Footer.

### `high-scores.html` — High Scores

- Sticky header + nav (active: **High Scores**).
- Page title block: `<h1>` "High Scores 🏆" + subtitle *"Top 5 runs saved on this device."*
- Grid of 10 score boards, one per single-player game, in the same display order as the home catalog. Each board:
  - Game name + thumbnail (small, 80×45px).
  - Top-5 leaderboard rendered via `ChunHighScores.render(container, gameId, opts)`.
  - Empty state per board (when `ChunHighScores.load(gameId)` returns `[]`): centered muted text *"No scores yet — go play a round!"* + a "Play →" link to that game.
- *Memory Match Duel* is **not** listed here (pass-and-play, no personal best).
- Bottom of page: small text link *"Clear all scores on this device"* (in `--ink-soft`). Click triggers a `confirm()` dialog: *"This will delete every saved high score on this device. Continue?"* — on OK, iterates over `localStorage` keys matching `chun-ga.high-scores.*` and removes them, then re-renders the page (or reloads).
- Footer.

### `donate.html` — Donate

- Sticky header + nav (active: **Donate**).
- Centered card, max-width ~640px:
  - Inline SVG illustration above the title — a chunky cloud-bubble containing a heart, with sparkle accents.
  - `<h1>` **"Thanks for Playing! 🙏"**
  - Body copy: *"WiGa is free and open source. If our games made you smile, you can buy William a treat — it helps fund more games (and ice cream)."*
  - Single chunky CTA button **"Buy us a coffee ☕"** in coral, full-width on mobile, auto on desktop. The `href` is a placeholder; an HTML comment immediately above the link reads:
    `<!-- TODO: replace with your real donation URL (e.g. https://buymeacoffee.com/<your-handle>) -->`
- Footer.

## Multi-Player Game: Memory Match Duel

### File

`games/memory-match-duel.html` — fully self-contained per the existing per-game contract (one HTML file, inline `<style>`, one inline `<script>`). Forked from `games/memory-match.html` so the existing card art, peek countdown, 3D flip, and shake animations are reused unchanged.

### Goal

Find more matching pairs than your opponent in the 4×4 memory grid.

### Setup screen (shown first on load)

- Centered card titled **"Memory Match Duel 👬"** with a small SVG illustration (two cards facing off).
- Two text inputs side-by-side, default values pre-filled and editable:
  - **Player 1 name** — default `"Player 1"`, label color: **mint** chip.
  - **Player 2 name** — default `"Player 2"`, label color: **peach** chip.
- Single chunky button **"Start Duel ▶"** in coral. Submitting an empty input falls back to that player's default name and proceeds — the field is never strictly required.

### Play screen

- Score bar at the top of the game container (sticky inside the playfield, not the page):
  ```
  ┌──────────────────────────────────────────────────┐
  │ [mint pill] Alice — 0  vs  Bob — 0 [peach pill]   │
  │              ↑ "Your turn"                        │
  └──────────────────────────────────────────────────┘
  ```
  The current player's pill has a chunky glowing outline + a tiny `"Your turn"` caption underneath.
- 3-second peek at round start (same as solo Memory Match) — all 16 cards face up. Tap anywhere to skip.
- 4×4 grid with the existing 8 idea pairs: dragons, rockets, robots, castles, music, puzzles, paint, stars.

### Turn flow

1. Current player taps two cards.
2. Both flip face-up (existing animation).
3. **Match:** ✓ icon appears; both cards lock face-up with a translucent overlay in the current player's color (mint or peach); pair count for that player ticks `+1`; **same player goes again**.
4. **No match:** shake animation; ~900ms pause; cards flip back; **turn switches** to the other player.
5. Input is disabled during all animations (preserves existing memory-match.html lockout behavior).
6. Loop until all 8 pairs are locked.

### End screen

- Final score line: `"Alice 5 — 3 Bob"` with each name in their pill color.
- Headline:
  - `"<winner> wins! 🎉"` plus a CSS-only confetti burst.
  - `"It's a tie! 🤝"` if 4–4. No confetti for ties.
- Two buttons:
  - **"Play Again"** — resets the grid + score, keeps the same names.
  - **"New Players"** — back to the Setup screen.
- **No `localStorage` recording.** Pass-and-play results aren't a personal best, so the duel game does not call `ChunHighScores.record(...)`.

### Mobile

Same contract as the solo Memory Match — touch-friendly, viewport-aware sizing, cards tap-sized for kid fingers. Score bar stacks above the grid on small viewports.

### Catalog wiring

- A card for the duel appears on `multiplayer.html` only — **not** in the `index.html` grid (that page stays single-player only).
- Thumbnail: inline SVG, 16:9, two cards facing off in mint and peach.
- README updated with a new **Multi-Player Games** section that lists this game.

## Verification plan

There is no automated test suite (per `CLAUDE.md`). Verification is manual in a browser, served via `./run.sh`. Walkthrough before claiming done:

### Chrome (run on every chrome page: `index`, `multiplayer`, `high-scores`, `donate`)

1. Header sticks to top while scrolling.
2. Active nav link has the mint pill + outline; other links don't.
3. Clicking each nav link reaches the right page; the new active link is highlighted there.
4. Footer copy + GitHub/README links present, links work.
5. On a 375px-wide viewport (Chrome DevTools iPhone preset): all four nav pills are visible (wrapping to multiple rows is fine), no horizontal scrollbar, header doesn't overflow.
6. Page background gradient renders without banding.

### `index.html`

1. Hero CTAs: "Play Single-Player ▶" scrolls to the grid; "Try Multi-Player 👬" goes to `multiplayer.html`.
2. All 10 game cards render with thumbnails; "Play →" links open each game.
3. Hero SVG renders crisply at desktop, scales down on mobile.

### `multiplayer.html`

1. Memory Match Duel card renders with new thumbnail; "Play →" opens `games/memory-match-duel.html`.
2. "Coming soon" placeholder card present, non-interactive.

### `high-scores.html`

1. 10 score boards render, in the home-page order.
2. With no plays yet: every board shows the "No scores yet" empty state with a working "Play →" link.
3. After playing one game and recording a score: that board shows the top 5; others remain empty.
4. "Clear all scores" prompts confirm; on OK, all boards revert to empty state.

### `donate.html`

1. Hero illustration + heading + body copy + button render centered.
2. Button `href` is the placeholder; HTML comment above it is preserved.
3. Hovering the button shows the coral hover state.

### `games/memory-match-duel.html`

1. Setup screen accepts two names + Start.
2. Empty name → default re-fills and proceeds.
3. Peek runs for 3s, skippable on tap.
4. P1 turn: match → +1 to P1 score, P1 keeps turn, locked cards tinted mint.
5. P1 turn: mismatch → cards flip back after ~900ms, turn switches to P2 (peach pill glows).
6. Mid-animation taps are ignored.
7. End screen shows correct winner + score; confetti on a win, no confetti on a tie.
8. "Play Again" preserves names; "New Players" returns to Setup.
9. On 375px viewport: score bar readable, grid fits, cards tap-sized.

## Out of scope

- Online multiplayer (no backend, no networking — duel is pass-and-play only).
- Real donation provider integration (placeholder URL only — user supplies the real link).
- Account / login / per-user high scores (unchanged from today: `localStorage` per device).
- Internationalization (English only).
- Dark mode.
- Adding more multi-player games beyond *Memory Match Duel* in this spec — the placeholder card on the multiplayer page anticipates that as future work.
- Service worker / offline shell (each game already works offline once the file is loaded; not adding a new layer here).

## Risks & mitigations

- **Header/footer drift across the four chrome pages.** Mitigated by extracting all chrome styling to `assets/site.css` and the active-link logic to `assets/site.js`. Markup duplication remains — a structural change to the header still requires touching all four files. Acceptable for a 4-file site; revisit if the site grows.
- **Floating high-scores sidebar removal could surprise users who relied on it.** Mitigated by adding a clearly-named *High Scores* link in the top nav, present on every chrome page.
- **`memory-match-duel.html` divergence from `memory-match.html` over time.** They share card art and animations today but will not share code (per the per-game contract — no shared modules beyond `high-scores.js`). Future bug fixes to one will need to be considered for the other. Documented in README.
