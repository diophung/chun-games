# Star Racer Implementation Plan

**Goal:** Build `games/star-racer.html`, a self-contained 3D spaceship racing game (Three.js via CDN importmap), and wire it into the site chrome.

**Architecture:** One HTML file with inline `<style>` + one `<script type="module">`. Track math (sampled curve frames) drives ships, rings, obstacles, and the chase camera. Same include pattern as `zoomy-car.html` (`high-scores.js` + importmap for `three@0.160.0`).

**Tech Stack:** HTML5, CSS3, ES modules, Three.js r160, Web Audio, DeviceOrientation API.

---

## Reference

- Spec: `docs/superpowers/specs/2026-07-03-star-racer-design.md`
- Pattern source: `games/zoomy-car.html` (importmap, HUD/start/results overlays, high-score calls, WiGa chrome)

## Verification model

No test harness in this repo — manual smoke checks via `./run.sh` + browser (or headless Chromium):

```bash
./run.sh 8000   # then open http://localhost:8000/games/star-racer.html
```

## Tasks

- [x] **Scaffold page** — start overlay, HUD (lap / place / time / speed / shield / boost bar), touch controls (joystick divs, BOOST, 🧭 TILT), results panel, WiGa back-link + mini footer, space-theme CSS
- [x] **Scene + backdrop** — renderer, lights, starfield `Points`, additive nebula sprites (canvas radial gradients), ringed planet, sun sprite
- [x] **Track** — closed CatmullRom curve; 2048 pre-sampled twist-free frames (`frameAt`); guide tube + dotted line; start/finish arch + pylons; 11 torus gates (cyan energy / orange afterburner)
- [x] **Asteroids** — jittered icosahedron variants; 58 corridor obstacles (rings/grid kept clear) with per-frame spin; 170 instanced scenery rocks
- [x] **Ships** — `buildShip()` from primitives (hull, nose, canopy, wings, nacelles, glow sprites, stretched additive trail ribbons); 1 player + 3 rivals in team colors
- [x] **Player physics** — auto-forward with boost/afterburner targets, lateral velocity steering with corridor clamp, banking, lap/gate/collision detection, camera chase + shake + FOV kick
- [x] **Rival AI** — rubber-banded speeds, sinusoidal weave that hugs ring centers, lap tracking + finish-order recording
- [x] **Race flow** — countdown, lap/final-lap messages, finish placement, score formula, `ChunHighScores.record` + `render` (once, guarded), Race Again reload
- [x] **Inputs** — keyboard, touch joystick + BOOST, gyroscope toggle with iOS permission + orientation remap + neutral calibration
- [x] **Audio** — engine hum (sawtooth + lowpass), ring chimes, collision thud, countdown beeps, finish fanfare
- [x] **Chrome wiring** — `index.html` card (SVG thumb), `high-scores.html` GAMES row, `assets/i18n.js` `card.star_racer.desc` (en/vi/es/zh) + `?v=6` cache-bust bump, README table row + section, screenshot
