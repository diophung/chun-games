# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project shape

A static-only browser-game playground. There is **no build step, no package manager, no test suite, and no linter** — every game is a single self-contained HTML file with inline `<style>` and `<script>`. Edits ship by reloading the browser.

## Running locally

- `./run.sh [port]` — starts `python3 -m http.server` on the given port (default 8000) from the repo root. Use this rather than `open file://...` so relative `<script src="high-scores.js">` paths resolve.
- Or `python3 -m http.server` from the repo root, then visit `http://localhost:8000/index.html`.

The home page is `index.html`; individual games live at `games/<id>.html`.

## Architecture

### Catalog ↔ game contract

`index.html` is a hand-maintained catalog. The page has two synchronized things that must stay in sync when adding/renaming/removing a game:

1. An `<article class="card">` block with the thumbnail SVG, title, description, tags, and `Play →` link.
2. An entry in the `games` array in the inline script near the bottom (`{ id, name }`) which drives the floating "High Scores" sidebar.

The `id` here is the same string passed to `ChunHighScores` from the game itself — it is the localStorage key, so renaming an `id` orphans existing scores. Current IDs: `type2build`, `zoomy-car`, `child-feeder`, `dragon`, `car-memory`, `memory-match`, `guess-who`, `tangram-puzzles`.

The `README.md` table is also hand-maintained and must be updated alongside the catalog.

### Shared high-score helper (`games/high-scores.js`)

The only shared module. It is loaded via a plain `<script>` tag (no module imports) and exposes `window.ChunHighScores` with:

- `record({ gameId, gameName, score, scoreLabel, detail, sort, limit, minScore })` — pops a `prompt()` for the player name when the run qualifies for the top 5, persists to `localStorage` under `chun-ga.high-scores.<gameId>`, and remembers the last-used name under `chun-ga.last-player-name`.
- `render(container, gameId, opts, beforeNode)` — injects a styled `<section class="high-score-box">` leaderboard; auto-installs its CSS once via a `#chun-high-score-styles` `<style>` tag.
- `best(gameId, opts)` / `load(gameId)` — read access. Used by `index.html` to build the catalog sidebar.

`sort` defaults to `"desc"` (higher score wins). Pass `"asc"` for time-style "lower is better" games — every existing game uses the default. Always call `record` exactly once per game-over (games guard with a `scoreRecorded` flag), then `render` to show the updated board.

In games inside `games/`, include it as `<script src="high-scores.js"></script>` (relative). From `index.html` at the root, it's `<script src="games/high-scores.js"></script>`.

### Per-game files

Each `games/<id>.html` is fully self-contained: HTML structure, inline CSS, and one big inline `<script>` (or `<script type="module">` for `zoomy-car.html`, which uses Three.js via an `importmap` CDN — currently the only third-party runtime dep). When adding a feature you'll usually be editing one large script block, not creating new files.

Mobile support is part of the contract: every game handles touch input and uses viewport-aware sizing. Don't break that when refactoring.

## Adding a new game

1. Create `games/<id>.html` from an existing game as a template; include `<script src="high-scores.js"></script>` and call `ChunHighScores.record(...)` + `render(...)` on game-over.
2. Add a card block + a `{ id, name }` entry to `index.html`.
3. Add a row to the `## Games` table and a section in `README.md`.
4. (Optional) Drop a 16:9 thumbnail in `docs/screenshots/<id>.png` if the README references one.

## Design + plan docs

`docs/superpowers/specs/` holds design specs and `docs/superpowers/plans/` holds implementation plans, paired by date and feature (`YYYY-MM-DD-<feature>-design.md` + `YYYY-MM-DD-<feature>-impl.md`). These are written before non-trivial features so the agent and human are aligned — follow the existing structure when adding new ones.
