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
    "hero.about":       { en: "Hi! I'm William, an {age}-year-old. This site is my work using AI to learn programming and gaming.",
                          vi: "Xin chào! Mình là William, {age} tuổi. Trang này là dự án của mình dùng AI để học lập trình và làm game.",
                          es: "¡Hola! Soy William, tengo {age} años. Este sitio es mi proyecto usando IA para aprender programación y videojuegos.",
                          zh: "你好!我叫 William,今年 {age} 岁。这个网站是我用 AI 学习编程和游戏制作的作品。" },
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
    "card.star_racer.desc": {
      en: "Realistic 3D spaceship racing — fly 3 laps through the asteroid belt, thread glowing boost rings, beat the rival squadron. Tilt or touch on mobile!",
      vi: "Đua phi thuyền 3D chân thực — bay 3 vòng qua vành đai thiên thạch, xuyên qua các vòng tăng tốc phát sáng, đánh bại phi đội đối thủ. Nghiêng máy hoặc chạm trên điện thoại!",
      es: "Carreras realistas de naves espaciales en 3D — vuela 3 vueltas por el cinturón de asteroides, atraviesa anillos de impulso brillantes y vence al escuadrón rival. ¡Inclina o toca en el móvil!",
      zh: "逼真的 3D 飞船竞速 — 穿越小行星带飞行 3 圈,穿过发光的加速环,击败对手中队。手机上可倾斜或触屏操作!"
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
    "card.fruit_catch.desc": {
      en: "Slide a basket left and right to catch falling 🍎🍌🍇 — but dodge 💣 bombs! Golden sparkles are worth 5. How long can you last as it speeds up?",
      vi: "Trượt giỏ trái và phải để hứng trái cây rơi 🍎🍌🍇 — nhưng tránh bom 💣! Ngôi sao vàng được 5 điểm. Bạn trụ được bao lâu khi tốc độ tăng?",
      es: "Desliza una cesta a izquierda y derecha para atrapar frutas que caen 🍎🍌🍇 — ¡pero esquiva las bombas 💣! Las chispas doradas valen 5. ¿Cuánto durarás cuando se acelere?",
      zh: "左右滑动篮子接住掉落的水果 🍎🍌🍇 — 但要躲开炸弹 💣!金色闪光值 5 分。速度越来越快,你能坚持多久?"
    },

    // ----- WiGa cards added in a prior commit that were missing translations
    //       (without these, t() returns the raw key and the card shows "card.x.desc") -----
    "card.simon_says.desc": {
      en: "Watch the lights, listen to the tones, and repeat the growing color sequence. Each round adds one more step — how far can your memory go?",
      vi: "Xem ánh sáng, nghe âm thanh, và lặp lại chuỗi màu ngày càng dài. Mỗi vòng thêm một bước — trí nhớ của bạn đi được bao xa?",
      es: "Observa las luces, escucha los tonos y repite la secuencia de colores que crece. Cada ronda añade un paso — ¿hasta dónde llega tu memoria?",
      zh: "观察灯光,聆听音调,重复越来越长的颜色序列。每轮多一步 — 你的记忆能走多远?"
    },
    "card.color_match.desc": {
      en: "Match the colored circle as fast as you can. Each round shrinks the timer — ignore the trickster word and tap the right color!",
      vi: "Chọn đúng vòng tròn màu thật nhanh. Mỗi vòng đồng hồ ngắn lại — đừng để chữ đánh lừa, hãy chạm đúng màu!",
      es: "Acierta el círculo de color lo más rápido posible. Cada ronda acorta el tiempo — ignora la palabra tramposa y toca el color correcto.",
      zh: "尽快选出对应颜色的圆圈。每轮计时越来越短 — 别被捣乱的文字骗到,点对颜色!"
    },
    "card.whack_a_mole.desc": {
      en: "Tap moles as they pop out of a 3×3 grid of holes. Difficulty ramps up — golden moles are fast but worth +5.",
      vi: "Chạm vào chuột chũi khi chúng nhô lên từ lưới 3×3 lỗ. Độ khó tăng dần — chuột vàng nhanh nhưng được +5.",
      es: "Toca a los topos cuando salen de una cuadrícula de 3×3 agujeros. La dificultad sube — los topos dorados son rápidos pero valen +5.",
      zh: "在 3×3 的洞口网格中,地鼠冒头时点击它们。难度逐渐提升 — 金色地鼠很快,但值 +5。"
    },
    "card.bubble_pop.desc": {
      en: "Tap drifting bubbles before they escape the top. Pop 3+ same-color in a row for combos — and dodge the dark bombs!",
      vi: "Chạm vào bong bóng trôi nổi trước khi chúng thoát lên trên. Nổ 3 bong bóng cùng màu liên tiếp để được combo — và tránh bom đen!",
      es: "Toca las burbujas que flotan antes de que escapen por arriba. Revienta 3 o más del mismo color seguidas para combos — ¡y esquiva las bombas oscuras!",
      zh: "在气泡飘出顶部之前点破它们。连续消除 3 个以上同色气泡可得连击 — 还要躲开黑色炸弹!"
    },

    // ----- Brain Arcade (self-contained suite in brain-games/) -----
    "section.brain_arcade": { en: "🧠 Brain Arcade", vi: "🧠 Khu Trí Tuệ", es: "🧠 Arcade Mental", zh: "🧠 大脑游乐场" },
    "section.brain_arcade_sub": {
      en: "Brain-training games for ages 7–13 — three difficulty levels, fully offline.",
      vi: "Trò chơi rèn luyện trí não cho 7–13 tuổi — ba mức độ khó, chơi offline hoàn toàn.",
      es: "Juegos para entrenar el cerebro de 7 a 13 años — tres niveles de dificultad, totalmente sin conexión.",
      zh: "为 7–13 岁打造的脑力训练游戏 — 三种难度,完全离线。"
    },
    "section.brain_arcade_hub": {
      en: "Open the Brain Arcade hub →",
      vi: "Mở trang Khu Trí Tuệ →",
      es: "Abrir el hub de Arcade Mental →",
      zh: "打开大脑游乐场主页 →"
    },
    "card.br_reaction_rush.desc": {
      en: "Tap the smiley targets as fast as you can — but skip the bombs! 💣",
      vi: "Chạm vào mặt cười thật nhanh — nhưng đừng chạm vào bom nhé! 💣",
      es: "Toca las caritas sonrientes lo más rápido que puedas — ¡pero evita las bombas! 💣",
      zh: "尽快点击笑脸目标 — 但要避开炸弹!💣"
    },
    "card.br_memory_match.desc": {
      en: "Flip cards two at a time and remember where the matching emoji pairs hide.",
      vi: "Lật hai thẻ mỗi lượt và nhớ vị trí các cặp emoji giống nhau.",
      es: "Voltea las cartas de dos en dos y recuerda dónde se esconden las parejas de emojis.",
      zh: "每次翻开两张牌,记住相同表情配对藏在哪里。"
    },
    "card.br_simon_sequence.desc": {
      en: "Watch the lights and sounds, then repeat the growing pattern. How far can you go?",
      vi: "Xem ánh sáng và âm thanh, rồi lặp lại chuỗi ngày càng dài. Bạn nhớ được bao xa?",
      es: "Observa las luces y los sonidos, luego repite la secuencia que crece. ¿Hasta dónde llegas?",
      zh: "观察灯光和声音,然后重复越来越长的序列。你能记到多远?"
    },
    "card.br_pattern_quest.desc": {
      en: "Spot the rule and pick the tile that comes next. Shapes, colors, and numbers!",
      vi: "Tìm ra quy luật và chọn ô tiếp theo. Hình, màu và số!",
      es: "Descubre la regla y elige la ficha que sigue. ¡Formas, colores y números!",
      zh: "找出规律,选出下一个图块。有形状、颜色和数字!"
    },
    "card.br_maze_runner.desc": {
      en: "Guide the mouse 🐭 to the cheese 🧀 — grab every star before time runs out!",
      vi: "Dẫn chú chuột 🐭 tới miếng phô mai 🧀 — nhặt hết sao trước khi hết giờ!",
      es: "Guía al ratón 🐭 hasta el queso 🧀 — ¡recoge todas las estrellas antes de que se acabe el tiempo!",
      zh: "带领小老鼠 🐭 找到奶酪 🧀 — 在时间结束前收集所有星星!"
    },
    "card.br_block_puzzle.desc": {
      en: "Drag, spin, and flip the blocks to fill the frame completely. No gaps allowed!",
      vi: "Kéo, xoay và lật các khối để lấp đầy khung hoàn toàn. Không được chừa chỗ trống!",
      es: "Arrastra, gira y voltea los bloques para llenar el marco por completo. ¡Sin huecos!",
      zh: "拖动、旋转、翻转方块,把框完全填满。不能留空隙!"
    },
    "card.br_math_meteor.desc": {
      en: "Solve the falling math problems and blast each meteor before it lands! ☄️💥",
      vi: "Giải các phép tính rơi xuống và bắn nổ thiên thạch trước khi chạm đất! ☄️💥",
      es: "Resuelve las operaciones que caen y destruye cada meteorito antes de que aterrice. ☄️💥",
      zh: "解出下落的算式,在陨石落地前把它炸掉!☄️💥"
    },
    "card.br_word_scramble.desc": {
      en: "Unscramble the mixed-up letters to spell the hidden word. Need a hint?",
      vi: "Sắp xếp lại các chữ cái lộn xộn để tạo thành từ ẩn. Cần gợi ý không?",
      es: "Ordena las letras revueltas para formar la palabra oculta. ¿Necesitas una pista?",
      zh: "把打乱的字母重新排好,拼出隐藏的单词。需要提示吗?"
    },
    "card.br_odd_one_out.desc": {
      en: "Find the one item that doesn't belong — then learn the reason why.",
      vi: "Tìm món không cùng nhóm — rồi xem lý do vì sao.",
      es: "Encuentra el elemento que no encaja — y descubre por qué.",
      zh: "找出那个不属于同类的 — 再看看原因。"
    },
    "card.br_create_studio.desc": {
      en: "Draw, stamp, and mirror-paint your own art, then save it. Pure imagination! 🎨",
      vi: "Vẽ, đóng dấu và vẽ đối xứng tác phẩm của bạn, rồi lưu lại. Thỏa sức sáng tạo! 🎨",
      es: "Dibuja, pon stickers y pinta en espejo tu propio arte, y guárdalo. ¡Pura imaginación! 🎨",
      zh: "自由绘画、盖印章、镜像作画,完成后保存。尽情发挥想象!🎨"
    },
    "card.br_connect_four.desc": {
      en: "Drop your discs and line up four in a row. Play a friend or the computer 🤖.",
      vi: "Thả quân và xếp bốn quân thành hàng. Chơi với bạn bè hoặc máy tính 🤖.",
      es: "Suelta tus fichas y alinea cuatro en raya. Juega contra un amigo o la computadora 🤖.",
      zh: "放下你的棋子,连成四子一线。和朋友或电脑对战 🤖。"
    },
    "card.br_reaction_duel.desc": {
      en: "Two players, one screen — wait for green, then race to tap your side first!",
      vi: "Hai người chơi, một màn hình — chờ đèn xanh, rồi đua chạm vào phần của mình trước!",
      es: "Dos jugadores, una pantalla — espera el verde y corre a tocar tu lado primero.",
      zh: "两个玩家,一块屏幕 — 等绿灯亮起,抢先点你这一侧!"
    },
    "card.br_quiz_battle.desc": {
      en: "Take turns answering math, word, and logic questions. Highest score wins! 🏆",
      vi: "Lần lượt trả lời câu hỏi toán, từ vựng và logic. Ai điểm cao hơn thì thắng! 🏆",
      es: "Por turnos, responde preguntas de matemáticas, palabras y lógica. ¡Gana quien más puntúe! 🏆",
      zh: "轮流回答数学、词汇和逻辑题。得分最高者获胜!🏆"
    },
  };

  function currentLang() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED.indexOf(stored) >= 0) return stored;
    } catch (e) { /* ignore */ }
    return DEFAULT_LANG;
  }

  // William's age, derived from his birth year. Updates automatically each year.
  const WILLIAM_BIRTH_YEAR = 2018;
  function williamAge() {
    return new Date().getFullYear() - WILLIAM_BIRTH_YEAR;
  }

  function t(key, lang) {
    const dict = T[key];
    if (!dict) return key;
    let value = dict[lang] || dict[DEFAULT_LANG] || key;
    // Substitute {age} placeholder anywhere it appears in the string.
    if (value.indexOf("{age}") >= 0) {
      value = value.replace(/\{age\}/g, String(williamAge()));
    }
    return value;
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

    // Mark the active option in each custom language picker (visual only —
    // the toggle button always reads "Language: English" no matter what).
    const options = document.querySelectorAll(".lang-picker__option");
    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const isActive = opt.dataset.lang === lang;
      opt.classList.toggle("is-active", isActive);
      opt.setAttribute("aria-selected", isActive ? "true" : "false");
    }
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) < 0) return;
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    applyTranslations(lang);
    // Fire a custom event so other scripts on the page can react if they want.
    document.dispatchEvent(new CustomEvent("wiga:langchange", { detail: { lang: lang } }));
  }

  function closeAllPickers() {
    const menus = document.querySelectorAll(".lang-picker__menu");
    for (let i = 0; i < menus.length; i++) menus[i].hidden = true;
    const toggles = document.querySelectorAll(".lang-picker__toggle");
    for (let i = 0; i < toggles.length; i++) toggles[i].setAttribute("aria-expanded", "false");
  }

  function init() {
    applyTranslations(currentLang());
    const pickers = document.querySelectorAll(".lang-picker");
    for (let i = 0; i < pickers.length; i++) {
      const picker = pickers[i];
      const toggle = picker.querySelector(".lang-picker__toggle");
      const menu   = picker.querySelector(".lang-picker__menu");
      if (!toggle || !menu) continue;

      toggle.addEventListener("click", function (ev) {
        ev.stopPropagation();
        const wasOpen = toggle.getAttribute("aria-expanded") === "true";
        closeAllPickers();
        if (!wasOpen) {
          toggle.setAttribute("aria-expanded", "true");
          menu.hidden = false;
        }
      });

      const options = picker.querySelectorAll(".lang-picker__option");
      for (let j = 0; j < options.length; j++) {
        options[j].addEventListener("click", function (ev) {
          ev.stopPropagation();
          const lang = this.dataset.lang;
          if (lang) setLang(lang);
          closeAllPickers();
        });
      }
    }
    // Click anywhere outside a picker → close.
    document.addEventListener("click", closeAllPickers);
    // ESC also closes.
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") closeAllPickers();
    });
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
