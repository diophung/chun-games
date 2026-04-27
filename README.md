# Chun-Ga 🎮

A small playground of browser games built **to learn coding and have fun — using AI coding agents** (Claude Code + the Superpowers plugin) as collaborators.

Every game is a single self-contained HTML file: zero build step, no dependencies to install. Open in any modern browser and play.

## Games

| Game | File | Style |
| --- | --- | --- |
| [Chun-Ga Typing Game](#chun-ga-typing-game) | [`index.html`](./index.html) | 2D · SVG |
| [Zoomy Cars](#zoomy-cars) | [`zoomy-car.html`](./zoomy-car.html) | 3D · Three.js |
| [Child Feeder](#child-feeder) | [`child-feeder.html`](./child-feeder.html) | 2D · SVG |

---

### Chun-Ga Typing Game

Type car-themed words to color in a grey city skyline. Each word you finish lights up a random section in a random color. Race the 90-second clock to fill all 13 sections of the city — but watch out: every typo costs 2 seconds and rolls your input back to the last correct letter.

**Controls:** keyboard (mobile: tap the input to focus, then use the virtual keyboard).

**Highlights**
- 13 city sections, randomized fill order, saturated color palette
- 90-second global timer + per-word timer
- Mistype penalty: red flash, rollback, −2s on the global clock
- End screen with stats — time used, words completed, typos, accuracy
- "Play Again" resets the round

▶ [Open `index.html`](./index.html)

---

### Zoomy Cars

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

▶ [Open `zoomy-car.html`](./zoomy-car.html)

---

### Child Feeder

Raise a cartoon child from age 3 to 18. Pick foods (healthy or junk), pick activities (age-gated), and put the child to sleep when they cry. Healthy choices grow them up faster; junk wears them down over time.

**Controls:** mouse / touch — tap food, activity, or Sleep buttons.

**Highlights**
- 12 foods and 6 activities, with stat-specific effects
- 4 hand-drawn SVG visual stages: Toddler, Kid, Tween, Teen
- XP-bar progression: 6 healthy actions → +1 year
- Crying state: only Sleep is available until happiness recovers
- 4 ending variants based on the child's dominant final stat

▶ [Open `child-feeder.html`](./child-feeder.html)

---

## Built With Agents

This repo is written collaboratively with AI coding agents — designs, specs, and implementation plans live under [`docs/superpowers/`](./docs/superpowers/). The goal is twofold: make playable little things, and learn how far agents can take an idea from "make me a typing game" to a finished, testable feature.

## Run Locally

No build step — just open the HTML files:

```sh
open index.html         # typing game
open zoomy-car.html     # racing game
open child-feeder.html  # child-feeder game
```

Or serve the directory with any static file server, e.g.:

```sh
python3 -m http.server
```
