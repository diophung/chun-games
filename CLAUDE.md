# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project shape

**WiGa ("William's Games")** — a static-only browser-game playground. There is **no build step, no package manager, no test suite, and no linter** — every game is a single self-contained HTML file with inline `<style>` and `<script>`. Edits ship by reloading the browser. Note the dual branding: user-facing chrome and i18n say "WiGa"/"William", but the high-score module and its localStorage keys keep the legacy `chun-ga.*` / `ChunHighScores` names — do not "fix" these or you orphan saved scores.

## Running locally

- `./run.sh [port]` — starts `python3 -m http.server` (default port 8000) from the repo root. Use this rather than `open file://...` so relative `<script src="high-scores.js">` paths resolve.
- Then visit `http://localhost:8000/index.html`.

## Pages & architecture

Chrome pages (`index.html`, `multiplayer.html`, `high-scores.html`, `donate.html`) share a header/nav/footer and load the shared assets in `assets/`:

- **`assets/i18n.js`** — translates the page after `DOMContentLoaded` by walking `data-i18n` / `data-i18n-aria-label` / `data-i18n-placeholder` attributes. Supports **en, vi, es, zh**; choice persists in `localStorage["wiga.lang"]`. All strings live in the `T` dictionary inside this file — **any new chrome/card text must be added there in all four languages**, and the element needs the matching `data-i18n` attribute. Exposes `window.WiGaI18n` (`t`, `setLang`, `currentLang`). The `{age}` placeholder auto-computes William's age from `WILLIAM_BIRTH_YEAR`.
- **`assets/site.js`** — marks the active nav link. **`assets/site.css`** — shared chrome styling. Loaded by chrome pages, *not* by games (games only borrow `site.css` for fonts/vars).
- Assets are cache-busted with `?v=N` query strings; bump `N` together when you change a shared asset.

### High scores (`games/high-scores.js`)

The only shared JS module used by games. Plain `<script>` (no ES modules), exposes `window.ChunHighScores`:

- `record({ gameId, gameName, score, scoreLabel, detail, sort, limit, minScore })` — prompts for a player name when the run makes the top 5, persists to `localStorage["chun-ga.high-scores.<gameId>"]`, remembers the name under `chun-ga.last-player-name`.
- `render(container, gameId, opts, beforeNode)` — injects a styled leaderboard (auto-installs its CSS once).
- `best(gameId, opts)` / `load(gameId)` — read access.

`sort` defaults to `"desc"` (higher wins); pass `"asc"` for time-style games. Call `record` exactly once per game-over (games guard with a `scoreRecorded` flag), then `render`. Include path: from a game in `games/` use `<script src="high-scores.js">`; from `high-scores.html` at root use `<script src="games/high-scores.js">`.

`high-scores.html` holds the authoritative **`GAMES` registry** (`{ id, name, scoreLabel }`) and renders one tile per game by reading saved scores. The `id` must match the string the game passes to `ChunHighScores` (= the localStorage key); renaming it orphans scores.

### Per-game files (`games/<id>.html`)

Fully self-contained: HTML + inline CSS + one big inline `<script>`. Exception: `zoomy-car.html` uses `<script type="module">` with Three.js via an `importmap` CDN — the only third-party runtime dep. **Mobile/touch support is part of the contract** (touch input + viewport-aware sizing); don't break it when refactoring. Most games load `i18n.js` and `high-scores.js`; `memory-match-duel` is a local 2-player game (no high score).

## Adding / renaming a game

1. Create `games/<id>.html` from an existing game; include `high-scores.js` and call `record(...)` + `render(...)` on game-over (single-player games).
2. Add an `<article class="card">` block (thumbnail SVG, title, description, tags, `Play →` link) to `index.html`.
3. Add a `{ id, name, scoreLabel }` row to the `GAMES` array in `high-scores.html`.
4. Add card-description strings to the `T` dict in `assets/i18n.js` (all 4 languages) and wire `data-i18n` on the card.
5. Update the `## Games` table / section in `README.md`; optionally add a 16:9 `docs/screenshots/<id>.png`.

## Deploy

Push to `main` → `.github/workflows/deploy.yml` SCPs the site to `ssh.williamphung.com:/var/www/williamphung.com/`. Only the listed paths (`index.html`, the other chrome HTML, `assets/**`, `games/**`, `docs/screenshots/**`, `README.md`) are deployed — new top-level files must be added to that `source:` list. **Do not commit, push, or deploy unless explicitly asked.**

## Design + plan docs

`docs/superpowers/specs/` (design) and `docs/superpowers/plans/` (implementation) are paired by date/feature (`YYYY-MM-DD-<feature>-design.md` + `-impl.md`), written before non-trivial features. Follow the existing structure when adding new ones.
