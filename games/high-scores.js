(function () {
  "use strict";

  const STORAGE_PREFIX = "chun-ga.high-scores.";
  const PLAYER_KEY = "chun-ga.last-player-name";
  const DEFAULT_LIMIT = 5;

  function storage() {
    try {
      const testKey = STORAGE_PREFIX + "test";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    } catch (err) {
      return null;
    }
  }

  function cleanName(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 24);
  }

  function keyFor(gameId) {
    return STORAGE_PREFIX + gameId;
  }

  function load(gameId) {
    const store = storage();
    if (!store) return [];
    try {
      const parsed = JSON.parse(store.getItem(keyFor(gameId)) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(entry => entry && Number.isFinite(Number(entry.score)))
        .map(entry => ({
          id: String(entry.id || Date.now()),
          name: cleanName(entry.name) || "Player",
          score: Math.round(Number(entry.score)),
          detail: String(entry.detail || ""),
          date: String(entry.date || ""),
        }));
    } catch (err) {
      return [];
    }
  }

  function sortScores(scores, sort) {
    return scores.slice().sort((a, b) => {
      if (sort === "asc") return a.score - b.score;
      return b.score - a.score;
    });
  }

  function isBetter(score, otherScore, sort) {
    if (sort === "asc") return score < otherScore;
    return score > otherScore;
  }

  function save(gameId, scores) {
    const store = storage();
    if (!store) return;
    store.setItem(keyFor(gameId), JSON.stringify(scores));
  }

  function getLastName() {
    const store = storage();
    if (!store) return "Player";
    return cleanName(store.getItem(PLAYER_KEY)) || "Player";
  }

  function setLastName(name) {
    const store = storage();
    if (!store) return;
    store.setItem(PLAYER_KEY, name);
  }

  function record(options) {
    const gameId = options.gameId;
    const gameName = options.gameName || gameId;
    const score = Math.round(Number(options.score));
    const sort = options.sort === "asc" ? "asc" : "desc";
    const limit = options.limit || DEFAULT_LIMIT;
    const minScore = options.minScore == null ? 1 : Number(options.minScore);
    const detail = String(options.detail || "");

    const scores = sortScores(load(gameId), sort).slice(0, limit);
    if (!Number.isFinite(score) || score < minScore) {
      return { saved: false, scores, entry: null, rank: null };
    }

    const qualifies = scores.length < limit || isBetter(score, scores[scores.length - 1].score, sort);
    if (!qualifies) {
      return { saved: false, scores, entry: null, rank: null };
    }

    const currentBest = scores[0];
    const bestNow = !currentBest || isBetter(score, currentBest.score, sort);
    let rawName = getLastName();
    try {
      rawName = window.prompt(
        (bestNow ? "New high score" : "Save your score") + " for " + gameName + "! Enter player name:",
        rawName
      );
    } catch (err) {
      rawName = getLastName();
    }

    if (rawName === null) {
      return { saved: false, scores, entry: null, rank: null };
    }

    const name = cleanName(rawName) || "Player";
    setLastName(name);

    const entry = {
      id: String(Date.now()) + "-" + String(Math.random()).slice(2),
      name,
      score,
      detail,
      date: new Date().toISOString(),
    };

    const nextScores = sortScores(scores.concat(entry), sort).slice(0, limit);
    save(gameId, nextScores);
    return {
      saved: true,
      scores: nextScores,
      entry,
      rank: nextScores.findIndex(item => item.id === entry.id) + 1,
    };
  }

  function formatScore(entry, scoreLabel) {
    const label = scoreLabel ? " " + scoreLabel : "";
    return Number(entry.score).toLocaleString() + label;
  }

  function installStyles() {
    if (document.getElementById("chun-high-score-styles")) return;
    const style = document.createElement("style");
    style.id = "chun-high-score-styles";
    style.textContent = [
      ".high-score-box{width:min(420px,100%);margin:12px auto 0;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.82);color:#1f2937;box-shadow:0 6px 18px rgba(15,23,42,.16);text-align:left}",
      ".high-score-box h3{margin:0 0 8px;font-size:16px;color:#1d4ed8;text-align:center}",
      ".high-score-box ol{margin:0;padding-left:24px;font-size:14px;line-height:1.4}",
      ".high-score-box li{padding:3px 0}",
      ".high-score-box strong{color:#be123c}",
      ".high-score-detail{color:#64748b;font-size:12px;margin-left:4px}",
      ".high-score-empty{margin:0;text-align:center;color:#64748b;font-size:14px}",
    ].join("");
    document.head.appendChild(style);
  }

  function render(container, gameId, options, beforeNode) {
    if (!container) return null;
    const opts = options || {};
    installStyles();

    const oldBoxes = container.querySelectorAll('.high-score-box[data-game-id="' + gameId + '"]');
    oldBoxes.forEach(box => box.remove());

    const box = document.createElement("section");
    box.className = "high-score-box";
    box.dataset.gameId = gameId;

    const heading = document.createElement("h3");
    heading.textContent = opts.title || "High Scores";
    box.appendChild(heading);

    const scores = sortScores(load(gameId), opts.sort === "asc" ? "asc" : "desc").slice(0, opts.limit || DEFAULT_LIMIT);
    if (scores.length === 0) {
      const empty = document.createElement("p");
      empty.className = "high-score-empty";
      empty.textContent = "No scores saved yet.";
      box.appendChild(empty);
    } else {
      const list = document.createElement("ol");
      for (const entry of scores) {
        const item = document.createElement("li");
        const name = document.createElement("strong");
        name.textContent = entry.name;
        item.appendChild(name);
        item.appendChild(document.createTextNode(": " + formatScore(entry, opts.scoreLabel)));
        if (entry.detail) {
          const detail = document.createElement("span");
          detail.className = "high-score-detail";
          detail.textContent = "(" + entry.detail + ")";
          item.appendChild(document.createTextNode(" "));
          item.appendChild(detail);
        }
        list.appendChild(item);
      }
      box.appendChild(list);
    }

    if (beforeNode && beforeNode.parentNode === container) {
      container.insertBefore(box, beforeNode);
    } else {
      container.appendChild(box);
    }
    return box;
  }

  function best(gameId, options) {
    const opts = options || {};
    return sortScores(load(gameId), opts.sort === "asc" ? "asc" : "desc")[0] || null;
  }

  window.ChunHighScores = {
    load,
    record,
    render,
    best,
    formatScore,
  };
})();
