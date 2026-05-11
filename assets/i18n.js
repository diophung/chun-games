/* WiGa multi-language support — English, Vietnamese, Spanish, Simplified Chinese.
   Loaded by every chrome page. Walks data-i18n* attributes after DOMContentLoaded
   and replaces text/aria/placeholder values. Selection persists in localStorage. */
(function () {
  "use strict";

  const STORAGE_KEY = "wiga.lang";
  const DEFAULT_LANG = "en";
  const SUPPORTED = ["en", "vi", "es", "zh"];

  const T = {
    // ----- Chrome (shared across every chrome'd page) -----
    "nav.aria":         { en: "Primary",        vi: "Chính",            es: "Principal",        zh: "主导航" },
    "nav.single":       { en: "Single Player",  vi: "Một người",        es: "Un jugador",       zh: "单人游戏" },
    "nav.multi":        { en: "Multi-Player",   vi: "Nhiều người",      es: "Multijugador",     zh: "多人游戏" },
    "nav.scores":       { en: "High Scores",    vi: "Điểm cao",         es: "Puntuaciones",     zh: "高分榜" },
    "nav.donate":       { en: "Donate",         vi: "Ủng hộ",           es: "Donar",            zh: "捐赠" },
    "logo.sub":         { en: "— William's Games", vi: "— Trò chơi của William", es: "— Juegos de William", zh: "— William 的游戏" },
    "footer.credit":    { en: "Made by William with ❤️ and 🤖",
                          vi: "Tạo bởi William với ❤️ và 🤖",
                          es: "Hecho por William con ❤️ y 🤖",
                          zh: "由 William 用 ❤️ 和 🤖 制作" },
    "footer.lang":      { en: "Language",       vi: "Ngôn ngữ",         es: "Idioma",           zh: "语言" },

    // ----- Home (index.html) -----
    "hero.eyebrow":     { en: "William's Games", vi: "Trò chơi của William", es: "Juegos de William", zh: "William 的游戏" },
    "hero.tagline":     { en: "Tiny browser games for kids and families.",
                          vi: "Trò chơi nhỏ trên trình duyệt cho trẻ em và gia đình.",
                          es: "Pequeños juegos del navegador para niños y familias.",
                          zh: "适合儿童和家庭的迷你浏览器游戏。" },
    "hero.cta_single":  { en: "Play Single-Player ▶", vi: "Chơi một người ▶", es: "Jugar un jugador ▶", zh: "单人游戏 ▶" },
    "hero.cta_multi":   { en: "Try Multi-Player 👬",  vi: "Thử nhiều người 👬", es: "Probar multijugador 👬", zh: "试试多人游戏 👬" },
    "section.all_games": { en: "All Games",     vi: "Tất cả trò chơi", es: "Todos los juegos", zh: "全部游戏" },

    // ----- Multi-Player catalog (multiplayer.html) -----
    "multi.title":      { en: "Multi-Player 👬", vi: "Nhiều người chơi 👬", es: "Multijugador 👬", zh: "多人游戏 👬" },
    "multi.subtitle":   { en: "Two players, one screen — no internet needed.",
                          vi: "Hai người chơi, một màn hình — không cần Internet.",
                          es: "Dos jugadores, una pantalla — sin Internet.",
                          zh: "两个玩家,一块屏幕 — 无需网络。" },
    "multi.placeholder": { en: "More multi-player games are on the way!",
                          vi: "Sắp có thêm trò chơi nhiều người!",
                          es: "¡Más juegos multijugador en camino!",
                          zh: "更多多人游戏即将上线!" },

    // ----- High Scores (high-scores.html) -----
    "scores.title":     { en: "High Scores 🏆", vi: "Điểm cao 🏆", es: "Mejores Puntuaciones 🏆", zh: "高分榜 🏆" },
    "scores.subtitle":  { en: "Top 5 runs saved on this device.",
                          vi: "5 lượt chơi cao nhất lưu trên thiết bị này.",
                          es: "Las 5 mejores rondas guardadas en este dispositivo.",
                          zh: "本设备上保存的前 5 名成绩。" },
    "scores.empty_prefix": { en: "No scores yet — ", vi: "Chưa có điểm — ", es: "Aún no hay puntuaciones — ", zh: "暂无成绩 — " },
    "scores.empty_link":   { en: "go play a round!", vi: "chơi một ván đi!", es: "¡juega una ronda!", zh: "快去玩一局吧!" },
    "scores.clear":     { en: "Clear all scores on this device",
                          vi: "Xóa tất cả điểm trên thiết bị này",
                          es: "Borrar todas las puntuaciones en este dispositivo",
                          zh: "清除本设备上的所有成绩" },
    "scores.confirm":   { en: "This will delete every saved high score on this device. Continue?",
                          vi: "Thao tác này sẽ xóa mọi điểm cao đã lưu trên thiết bị này. Tiếp tục?",
                          es: "Esto borrará todas las puntuaciones guardadas en este dispositivo. ¿Continuar?",
                          zh: "这将删除本设备上保存的所有高分。是否继续?" },

    // ----- Donate (donate.html) -----
    "donate.title":     { en: "Thanks for Playing! 🙏", vi: "Cảm ơn đã chơi! 🙏", es: "¡Gracias por jugar! 🙏", zh: "感谢游玩! 🙏" },
    "donate.body":      { en: "WiGa is free and open source. If our games made you smile, you can buy William a treat — it helps fund more games (and ice cream).",
                          vi: "WiGa miễn phí và mã nguồn mở. Nếu các trò chơi làm bạn vui, bạn có thể tặng William một món — giúp tạo thêm trò chơi (và mua kem).",
                          es: "WiGa es gratuito y de código abierto. Si nuestros juegos te hicieron sonreír, puedes invitarle a William un dulce — ayuda a hacer más juegos (y a comprar helado).",
                          zh: "WiGa 免费且开源。如果我们的游戏让你开心,可以请 William 吃点小零食 — 这能帮助制作更多游戏(还有买冰淇淋)。" },
    "donate.cta":       { en: "buy me a slice of pizza 🍕",
                          vi: "mời tôi một miếng pizza 🍕",
                          es: "invítame una porción de pizza 🍕",
                          zh: "请我吃一块披萨 🍕" },

    // ----- Card "Play →" link text -----
    "card.play":        { en: "Play →",         vi: "Chơi →",          es: "Jugar →",          zh: "开始 →" },

    // ----- Card descriptions (titles stay English as proper-noun brand names) -----
    "card.type2build.desc": {
      en: "Type car-themed words to color a grayscale supercar photo. Race the 90-second clock — but watch your typos!",
      vi: "Gõ từ về xe để tô màu cho ảnh siêu xe đen trắng. Đua với đồng hồ 90 giây — nhưng cẩn thận lỗi gõ!",
      es: "Escribe palabras del mundo del motor para colorear una foto en blanco y negro de un superdeportivo. Corre contra los 90 segundos — ¡cuidado con los errores!",
      zh: "输入汽车主题单词,为黑白超跑照片上色。在 90 秒内完成 — 小心打错字!"
    },
    "card.zoomy_car.desc": {
      en: "Cartoon 3D racing — drive 3 laps, grab spinning ⭐ coins, hit boost pads, dodge cones & trees.",
      vi: "Đua xe 3D phong cách hoạt hình — chạy 3 vòng, nhặt ⭐ xoay tròn, đạp bàn tăng tốc, né cọc và cây.",
      es: "Carreras 3D estilo dibujos animados — completa 3 vueltas, recoge ⭐ giratorias, usa rampas de boost, esquiva conos y árboles.",
      zh: "卡通 3D 赛车 — 跑完 3 圈,收集旋转的 ⭐ 金币,踩加速板,避开锥筒和树木。"
    },
    "card.child_feeder.desc": {
      en: "Raise a cartoon child from age 3 to 18 with food & activities. Healthy choices grow them up faster — junk wears them down.",
      vi: "Nuôi một đứa trẻ hoạt hình từ 3 đến 18 tuổi bằng đồ ăn và hoạt động. Đồ ăn lành mạnh giúp lớn nhanh hơn — đồ ăn vặt làm yếu đi.",
      es: "Cría a un niño dibujado desde los 3 hasta los 18 años con comida y actividades. Las opciones saludables lo hacen crecer más rápido — la comida basura lo desgasta.",
      zh: "用食物和活动养育一个卡通孩子,从 3 岁到 18 岁。健康选择让他长得更快 — 垃圾食品会让他变弱。"
    },
    "card.dragon.desc": {
      en: "Steer a hungry dragon snake to gobble cheese wedges. Pick game speed and cheese size — every bite levels you up.",
      vi: "Điều khiển con rồng-rắn đói đi đớp miếng phô mai. Chọn tốc độ và kích cỡ phô mai — mỗi miếng giúp lên cấp.",
      es: "Guía a un dragón-serpiente hambriento para que coma trozos de queso. Elige la velocidad y el tamaño del queso — cada bocado sube tu nivel.",
      zh: "操控一只饥饿的龙蛇去吃奶酪块。选择游戏速度和奶酪大小 — 每咬一口就升级。"
    },
    "card.car_memory.desc": {
      en: "Match 8 unique car-brand pairs. Flip two cards — if they match, they lock with a green ✓; if not, they flip back.",
      vi: "Ghép 8 cặp thương hiệu xe khác nhau. Lật hai thẻ — trùng thì khóa lại với dấu ✓ xanh; không thì lật ngược lại.",
      es: "Empareja 8 pares únicos de marcas de coches. Voltea dos cartas — si coinciden, se bloquean con un ✓ verde; si no, vuelven a su lugar.",
      zh: "配对 8 组独特的汽车品牌。翻开两张牌 — 匹配则用绿色 ✓ 锁定;不匹配则翻回去。"
    },
    "card.engine_memory.desc": {
      en: "Match a car to its engine sound — synthesized in your browser. Flip a 🚗 card to see the brand, flip a 🔊 card to hear it rev. Same brand on both? You've got a pair.",
      vi: "Ghép xe với âm thanh động cơ của nó — tạo trực tiếp trong trình duyệt. Lật thẻ 🚗 để xem thương hiệu, lật thẻ 🔊 để nghe tiếng nổ. Cùng thương hiệu? Bạn ghép được một cặp.",
      es: "Empareja un coche con su sonido de motor — sintetizado en tu navegador. Voltea una carta 🚗 para ver la marca, voltea una carta 🔊 para escuchar el motor. ¿La misma marca? ¡Pareja conseguida!",
      zh: "为汽车配对它的引擎声 — 在浏览器中实时合成。翻开 🚗 牌看品牌,翻开 🔊 牌听引擎声。同一品牌?配对成功!"
    },
    "card.pit_stop_crew.desc": {
      en: "The pit chief flashes a sequence of jobs (🔧 ⛽ 🚿 🏁) — repeat it back. Each round adds one more step. How long can you remember?",
      vi: "Đội trưởng pit nhấp nháy một chuỗi công việc (🔧 ⛽ 🚿 🏁) — lặp lại theo. Mỗi vòng thêm một bước. Bạn nhớ được bao nhiêu?",
      es: "El jefe de boxes muestra una secuencia de tareas (🔧 ⛽ 🚿 🏁) — repítela. Cada ronda añade un paso más. ¿Cuánto puedes recordar?",
      zh: "维修主管闪烁一串维修任务 (🔧 ⛽ 🚿 🏁) — 重复出来。每轮多一步。你能记住多少?"
    },
    "card.memory_match.desc": {
      en: "Flip colorful idea cards, remember their hiding spots, and match pairs with tiny creative story prompts.",
      vi: "Lật những thẻ ý tưởng đầy màu sắc, nhớ chỗ của chúng, và ghép cặp kèm theo gợi ý kể chuyện ngắn.",
      es: "Voltea coloridas cartas de ideas, recuerda dónde se esconden, y empareja con pequeños prompts creativos de historia.",
      zh: "翻开多彩的创意卡片,记住它们的位置,配对时还会有小小的故事提示。"
    },
    "card.guess_who.desc": {
      en: "Ask yes/no questions, eliminate suspects, and solve the mystery friend using careful deduction.",
      vi: "Hỏi câu có/không, loại trừ nghi phạm, và tìm ra người bạn bí ẩn bằng suy luận cẩn thận.",
      es: "Haz preguntas de sí/no, descarta sospechosos, y descubre al amigo misterioso con deducción cuidadosa.",
      zh: "提是非问题,排除嫌疑人,通过仔细推理找出神秘的朋友。"
    },
    "card.tangram_puzzles.desc": {
      en: "Drag, rotate, and snap seven geometric pieces into house, rocket, and cat puzzle outlines.",
      vi: "Kéo, xoay, và lắp bảy mảnh hình học vào hình nhà, tên lửa và con mèo.",
      es: "Arrastra, rota, y encaja siete piezas geométricas en siluetas de casa, cohete y gato.",
      zh: "拖动、旋转、拼合七块几何拼图,组成房子、火箭和小猫的图案。"
    },
    "card.memory_match_duel.desc": {
      en: "A 4×4 memory grid for two players, taking turns. Whoever finds more pairs wins.",
      vi: "Bảng nhớ 4×4 cho hai người chơi, luân phiên. Ai tìm được nhiều cặp hơn sẽ thắng.",
      es: "Una cuadrícula de memoria 4×4 para dos jugadores, por turnos. Quien encuentre más parejas gana.",
      zh: "4×4 记忆网格,两人轮流玩。找到更多配对的玩家获胜。"
    },
  };

  function currentLang() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.indexOf(stored) >= 0) return stored;
    } catch (e) { /* ignore */ }
    return DEFAULT_LANG;
  }

  function t(key, lang) {
    const dict = T[key];
    if (!dict) return key;
    return dict[lang] || dict[DEFAULT_LANG] || key;
  }

  function applyTranslations(lang) {
    document.documentElement.lang = lang;

    const textNodes = document.querySelectorAll("[data-i18n]");
    for (let i = 0; i < textNodes.length; i++) {
      const el = textNodes[i];
      const value = t(el.dataset.i18n, lang);
      // Only update if changed, to avoid re-flow churn.
      if (el.textContent !== value) el.textContent = value;
    }

    const ariaNodes = document.querySelectorAll("[data-i18n-aria-label]");
    for (let i = 0; i < ariaNodes.length; i++) {
      const el = ariaNodes[i];
      el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel, lang));
    }

    const placeholderNodes = document.querySelectorAll("[data-i18n-placeholder]");
    for (let i = 0; i < placeholderNodes.length; i++) {
      const el = placeholderNodes[i];
      el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder, lang));
    }

    // Mark the active pill in the language switcher.
    const pills = document.querySelectorAll(".lang-pill");
    for (let i = 0; i < pills.length; i++) {
      const pill = pills[i];
      const isActive = pill.dataset.lang === lang;
      pill.classList.toggle("is-active", isActive);
      pill.setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) < 0) return;
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    applyTranslations(lang);
    // Fire a custom event so other scripts on the page can react if they want.
    document.dispatchEvent(new CustomEvent("wiga:langchange", { detail: { lang: lang } }));
  }

  function init() {
    applyTranslations(currentLang());
    const pills = document.querySelectorAll(".lang-pill");
    for (let i = 0; i < pills.length; i++) {
      pills[i].addEventListener("click", function () {
        const lang = this.dataset.lang;
        if (lang) setLang(lang);
      });
    }
  }

  // Expose a tiny public API for game pages that want to translate at runtime.
  window.WiGaI18n = {
    t: t,
    setLang: setLang,
    currentLang: currentLang,
    SUPPORTED: SUPPORTED.slice(),
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
