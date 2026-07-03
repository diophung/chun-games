# Star Racer — Design

A single-page HTML5 3D spaceship racing game inspired by sci-fi RTS starfighters (all art is original, built from Three.js primitives). The player pilots a Terran-style fighter for 3 laps around a closed track that winds through an asteroid belt in deep space, racing 3 AI rivals.

## Goals

- A "realistic" 3D feel: metallic ships, engine glow + trails, starfield, nebulae, a ringed planet, banking flight physics, chase camera with FOV kick
- Full input matrix per the site contract:
  - **Desktop:** keyboard (arrows / WASD steer, SPACE or SHIFT to boost)
  - **Mobile:** touch (virtual joystick + BOOST button) **and** opt-in gyroscope tilt steering
- ~2-minute sessions, kid-friendly (no death — mistakes cost speed and shield, never the run)
- Zero build step, one self-contained file, Three.js from CDN via importmap (same version and pattern as `zoomy-car.html`)
- High-score integration via the shared `ChunHighScores` module

## Gameplay

### Core loop

1. Start screen → LAUNCH → 3-2-1-GO countdown
2. The ship flies forward automatically along a closed 3D track; the player steers left/right **and** up/down inside a circular corridor (radius 12.5) around the track's center line
3. Thread **cyan rings** (+25 boost energy) and **orange rings** (2.2s afterburner); dodge spinning asteroid obstacles
4. Hitting an asteroid: −1 🛡️ shield (of 5), speed drops to 35%, 2s of blinking invulnerability, red flash + camera shake
5. Boost (SPACE / button) drains an energy gauge that slowly regenerates
6. After 3 laps: finish placement vs. the 3 rivals, score recorded to the leaderboard

### The track

- Closed `CatmullRomCurve3` (14 control points, radius ~380 with sine perturbation and vertical variation, length ≈ 2500 units)
- Pre-sampled into 2048 frames with a **twist-free, world-up-projected basis** (right/up per frame) — offsets `(ox, oy)` in that basis position ships, rings, and obstacles
- 11 gates at 1/12 spacing (slot 0 is the start/finish arch); every 4th is an orange afterburner ring
- 58 obstacle asteroids inside the corridor (kept clear of rings and the start grid); ~170 larger instanced scenery asteroids outside it
- A translucent guide tube + dotted marker line make the racing line readable

### Rivals & difficulty

- 3 AI ships (red / green / purple) with base speeds 58 / 63 / 67 vs. player cruise 62, boost 118, afterburner 134
- **Rubber-banding:** rival speed scales ±(0.85–1.22) with the gap to the player, so races stay close for kids
- Rivals weave sinusoidally in the corridor but hug the center line near rings; they don't collide with anything

### Scoring

`score = 60000 − time×180 + ringsThreaded×250 + shieldLeft×800 + placeBonus`
(place bonus 6000/4000/2500/1000), floor 1, recorded once per race under `gameId: "star-racer"`, label `pts`, higher-is-better (default sort).

## Input details

- **Gyroscope:** opt-in via a 🧭 TILT toggle (shown only on touch devices with `DeviceOrientationEvent`). Enabling calls `DeviceOrientationEvent.requestPermission()` on iOS 13+, then calibrates the current tilt as neutral. Beta/gamma are remapped by `screen.orientation.angle` so all four orientations steer correctly.
- **Touch joystick:** first touch outside the buttons anchors a joystick; drag ±60px = full deflection; visual base + knob follow the finger.
- Priority when several inputs are active: touch joystick > gyroscope > keyboard.

## Audio

Web Audio, no assets: sawtooth engine hum through a lowpass (pitch/gain follow speed), sine chimes for rings and countdown, filtered-noise thud + square thump for collisions, 3-note fanfare at the finish.

## Non-goals

- No multiplayer, no persistent upgrades, no collision between ships
- No i18n inside the game canvas (matches `zoomy-car.html`; only the catalog card is translated)
