# Chun-Ga 🎮

A small playground of browser games built **to learn coding and have fun — using AI coding agents** (Claude Code + the Superpowers plugin) as collaborators.

Every game is static HTML with a shared local high-score helper: zero build step, no dependencies to install. Open in any modern browser and play.

The home page ([`index.html`](./index.html)) is a catalog with thumbnails linking to each game:

![Game catalog home page](docs/screenshots/catalog.png)

## Games

| Game | Preview | File | Style |
| --- | --- | --- | --- |
| [Type2Build](#type2build) | <img src="docs/screenshots/type2build.png" width="240" alt="Type2Build preview" /> | [`games/type2build.html`](./games/type2build.html) | 2D · SVG |
| [Zoomy Cars](#zoomy-cars) | <img src="docs/screenshots/zoomy-car.png" width="240" alt="Zoomy Cars preview" /> | [`games/zoomy-car.html`](./games/zoomy-car.html) | 3D · Three.js |
| [Child Feeder](#child-feeder) | <img src="docs/screenshots/child-feeder.png" width="240" alt="Child Feeder preview" /> | [`games/child-feeder.html`](./games/child-feeder.html) | 2D · SVG |
| [Dragon Eating Cheese](#dragon-eating-cheese) | <img src="docs/screenshots/dragon.png" width="240" alt="Dragon Eating Cheese preview" /> | [`games/dragon.html`](./games/dragon.html) | 2D · Canvas |
| [Car Memory](#car-memory) | <img src="docs/screenshots/car-memory.png" width="240" alt="Car Memory preview" /> | [`games/car-memory.html`](./games/car-memory.html) | 2D · CSS |
| [Memory Match Cards](#memory-match-cards) | Catalog card | [`games/memory-match.html`](./games/memory-match.html) | 2D · CSS |
| [Guess Who Detective](#guess-who-detective) | Catalog card | [`games/guess-who.html`](./games/guess-who.html) | 2D · CSS |
| [Tangram Puzzles](#tangram-puzzles) | Catalog card | [`games/tangram-puzzles.html`](./games/tangram-puzzles.html) | 2D · SVG |

---

### Type2Build

![Type2Build screenshot](docs/screenshots/type2build.png)

Type car-themed words to color in a grey city skyline. Each word you finish lights up a random section in a random color. Race the 90-second clock to fill all 13 sections of the city — but watch out: every typo costs 2 seconds and rolls your input back to the last correct letter.

**Controls:** keyboard (mobile: tap the input to focus, then use the virtual keyboard).

**Highlights**
- 13 city sections, randomized fill order, saturated color palette
- 90-second global timer + per-word timer
- Mistype penalty: red flash, rollback, −2s on the global clock
- End screen with stats — time used, words completed, typos, accuracy
- "Play Again" resets the round

▶ [Open `games/type2build.html`](./games/type2build.html)

---

### Zoomy Cars

![Zoomy Cars splash screen](docs/screenshots/zoomy-car.png)

A cartoon 3D racing game. Drive a googly-eyed car around a looped track, grab spinning coins, hit boost pads for speed bursts, and try not to crash into cones, AI racers, or trees. Built with Three.js loaded from a CDN.

**Controls**
- Desktop: arrow keys or **WASD** to drive, **R** to repair
- Mobile/tablet: on-screen buttons (gas, brake, left, right) + REPAIR

**Highlights**
- 3 laps, 3 AI rivals, finish-line confetti + fanfare
- Spinning ⭐ coins, worth **2×** while a boost is active
- Orange boost pads → **+3 ⭐** instantly, speed surge, flame trail
- Collisions: knock traffic cones flying, bump AI cars, hard crash into trees (with bounce + spin-out)
- 5-heart HP system — AI bumps cost 1 ❤️, tree crashes cost 2 ❤️
- **Repair shop**: 1 ⭐ = 1 ❤️ (press R or tap REPAIR)
- At 0 HP the car limps along at half speed until you repair it

▶ [Open `games/zoomy-car.html`](./games/zoomy-car.html)

---

### Child Feeder

![Child Feeder — randomized character at the Baby stage](docs/screenshots/child-feeder.png)

Raise a cartoon child from age 1 to 18. Pick foods (healthy or junk), pick activities (age-gated), and put the child to sleep when they cry. Healthy choices grow them up faster; junk wears them down over time.

**Controls:** mouse / touch — tap food, activity, or Sleep buttons.

**Highlights**
- 12 foods and 6 activities, with stat-specific effects
- 4 hand-drawn SVG stages: **Baby** (1–3), **Kid** (4–8), **Boy/Girl** (9–12), **Teen** (13–18)
- Per-game randomization: gender (boy/girl), outfit color (5 themes), hair color (4 shades) — character stays consistent across all 4 stages
- Each new age adds a visual detail: pacifier, booties, cap, backpack, glasses, scarf, watch, necklace, phone, sunglasses, chain, and a 🎓 graduation cap at 18
- XP-bar progression: 6 healthy actions → +1 year
- Crying state: only Sleep is available until happiness recovers
- 4 ending variants based on the child's dominant final stat

▶ [Open `games/child-feeder.html`](./games/child-feeder.html)

---

### Dragon Eating Cheese

Steer a hungry dragon snake around the arena to gobble cheese wedges, collect bonus stars, level up, and avoid crashing into walls or yourself.

**Controls:** arrow keys / WASD on desktop, on-screen controls on touch devices.

**Highlights**
- Speed and cheese-size settings
- Score and level progression
- Bonus star food and glow effects
- Game-over animation and local high scores

▶ [Open `games/dragon.html`](./games/dragon.html)

---

### Car Memory

![Car Memory — 16 face-down cards in a 4×4 grid](docs/screenshots/car-memory.png)

A classic memory match game with 8 unique car-brand pairs (16 cards). Tap a card to flip it; flip a second card and if the brands match, both lock with a green ✓ in the top-right corner. If not, they flip back. Find all 8 pairs to win.

**Controls:** mouse / touch — tap any face-down card to reveal.

**Highlights**
- 8 themed pairs: Ferrari, Tesla, Porsche, Lamborghini, BMW, Mercedes, Toyota, Ford
- Each card shows brand, logo, and 3 features on a brand-colored face
- 3D card-flip animation, shake on a wrong pair
- Tracks moves and time; end screen with stats + "Play Again"

▶ [Open `games/car-memory.html`](./games/car-memory.html)

---

### Memory Match Cards

A playful 4x4 memory game with 8 creative idea pairs. Flip two cards, remember where each one hides, and match dragons, rockets, robots, castles, music, puzzles, paint, and stars.

**Controls:** mouse / touch — tap any face-down card to reveal.

**Highlights**
- 8 idea pairs focused on imagination and memory
- Moves, pair count, and live timer
- Matched pairs reveal a tiny creative story prompt
- 3D card-flip animation, shake on wrong pairs, end screen with stats

▶ [Open `games/memory-match.html`](./games/memory-match.html)

---

### Guess Who Detective

A single-player deduction game inspired by yes/no mystery guessing. The game secretly picks one friend; ask questions about hats, glasses, pets, hair, shirts, and badges to eliminate suspects before making a final guess.

**Controls:** mouse / touch — tap question buttons, then tap a remaining suspect to guess.

**Highlights**
- 12 cartoon suspects with visible traits
- Yes/no question buttons automatically cross out impossible suspects
- Tracks questions, guesses, and remaining possibilities
- Encourages logic, observation, and careful elimination

▶ [Open `games/guess-who.html`](./games/guess-who.html)

---

### Tangram Puzzles

Drag, rotate, and snap seven geometric pieces onto dotted outlines to complete kid-friendly tangram puzzles.

**Controls:** mouse / touch — drag pieces; tap a piece and use **Rotate Selected 45°** to turn it.

**Highlights**
- 3 puzzles: Little House, Space Rocket, Clever Cat
- 7 colorful SVG tangram pieces
- Snap-to-place behavior when both position and rotation match
- Builds spatial reasoning, patience, and problem solving

▶ [Open `games/tangram-puzzles.html`](./games/tangram-puzzles.html)

---

## Local High Scores

All games save their top local scores with `localStorage` through [`games/high-scores.js`](./games/high-scores.js). When a run qualifies for the top 5, the browser asks for the player name and stores the score on that browser/device only. The catalog page shows the best saved score for every game.

---

## Built With Agents

This repo is written collaboratively with AI coding agents — designs, specs, and implementation plans live under [`docs/superpowers/`](./docs/superpowers/). The goal is twofold: make playable little things, and learn how far agents can take an idea from "make me a typing game" to a finished, testable feature.

## Run Locally

No build step — just open the HTML files:

```sh
open index.html                # game catalog (start here)
open games/type2build.html     # typing game
open games/zoomy-car.html      # racing game
open games/child-feeder.html   # child-feeder game
open games/dragon.html         # dragon snake game
open games/car-memory.html     # memory game
open games/memory-match.html   # creative memory game
open games/guess-who.html      # deduction game
open games/tangram-puzzles.html # tangram puzzle game
```

Or serve the directory with any static file server, e.g.:

```sh
python3 -m http.server
```
