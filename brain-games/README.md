# 🧠 Brain Arcade

A suite of **13 self-contained HTML5 brain games for kids aged 7–13**, plus a colorful hub that ties them together. Every game runs by simply opening the file in a browser — **no build step, no install, fully offline, no downloaded assets**. All graphics are CSS/Canvas/emoji and all sound is generated with the Web Audio API.

## Play it

- Open **`index.html`** (the hub) in any modern browser, or
- From the repo root run `./run.sh` and visit `http://localhost:8000/brain-games/index.html`.

The hub lets a child filter by **skill**, by **1-player / 2-player**, or hit **🎲 Surprise me** to jump into a random game. Each game is 2–5 minutes, so a 30–45 minute session of hopping between them flies by.

## What every game includes

- A **Start screen** with a one-line "how to play", **3 difficulty levels** (Easy / Medium / Hard), and age + skill badges.
- **Pause** and **Restart** during play.
- A **Game Over / Win** screen with score, **session best (🏆)**, **Play Again**, and a **← Hub** link.
- **Mouse + touch** support, large tap targets, responsive layout (phone / tablet / desktop).
- Encouraging, kid-friendly language; **colorblind-safe** (color is always paired with shape/symbol/label); honors reduced-motion.
- Session-only scores kept **in memory** (no localStorage).

## The games

| # | Game | Skill trained | Age band | Players | How to play |
|---|------|---------------|----------|---------|-------------|
| 1 | 🎯 Reaction Rush | Reaction & processing speed | Junior (7–9) | 1 | Tap the smiley fast — skip the bombs 💣 |
| 2 | 🃏 Memory Match | Working memory | Core (9–11) | 1 | Flip two cards and find matching pairs |
| 3 | 🎶 Simon Sequence | Working memory + reaction | Core (9–11) | 1 | Watch the lights, then tap them back in order |
| 4 | 🔷 Pattern Quest | Pattern recognition | Advanced (11–13) | 1 | Spot the pattern, tap the tile that comes next |
| 5 | 🐭 Maze Runner | Spatial reasoning + planning | Core (9–11) | 1 | Guide 🐭 to the 🧀 — grab every ⭐ before time's up |
| 6 | 🧩 Block Puzzle | Spatial reasoning | Advanced (11–13) | 1 | Drag blocks to fill the frame; tap to spin, double-tap to flip |
| 7 | ☄️ Math Meteor | Numeracy + speed | Core (9–11) | 1 | Type a meteor's answer and blast it before it lands |
| 8 | 🔤 Word Scramble | Language / vocabulary | Core (9–11) | 1 | Tap the mixed letters to spell the hidden word |
| 9 | 🔍 Odd One Out | Logic & problem-solving | Core (9–11) | 1 | Tap the item that doesn't belong, then read why |
| 10 | 🎨 Create Studio | Creativity & divergent thinking | Junior (7–9) | 1 | Draw, stamp, mirror-paint, then 💾 save your art |
| 11 | 🔴 Connect Four | Logic & strategy | Core (9–11) | 2 or vs 🤖 | Drop discs into columns — line up 4 to win |
| 12 | ⚡ Reaction Duel | Reaction & inhibition | Junior (7–9) | 2 | Wait for GREEN, then tap your side — first to 3 wins |
| 13 | 🏆 Quiz Battle | Numeracy, vocabulary & logic | Advanced (11–13) | 2 | Take turns; tap the right answer to score |

**Multiplayer is same-device only.** Reaction Duel splits the screen (P1 = `A` / left half, P2 = `L` / right half). Connect Four and Quiz Battle are turn-based hot-seat (Connect Four also offers a 🤖 computer opponent with 3 strengths).

## Cognitive skill coverage (all 8 ✅)

1. **Reaction & processing speed** — Reaction Rush, Simon Sequence, Reaction Duel
2. **Working memory** — Memory Match, Simon Sequence
3. **Logic & problem-solving** — Odd One Out, Maze Runner, Connect Four, Quiz Battle
4. **Spatial reasoning** — Maze Runner, Block Puzzle
5. **Pattern recognition** — Pattern Quest, Simon Sequence
6. **Creativity & divergent thinking** — Create Studio
7. **Numeracy / math** — Math Meteor, Quiz Battle
8. **Language / vocabulary** — Word Scramble, Quiz Battle

> These games strengthen the *specific* skills that IQ-style tests measure (pattern recognition, working memory, reasoning, spatial sense, processing speed) by training them directly.

## Mix

- **10 single-player** games (≥ 8 required ✅)
- **3 multiplayer** games (≥ 3 required ✅)

## Notes

This suite lives in its own `brain-games/` folder and is independent of the rest of the repository.
