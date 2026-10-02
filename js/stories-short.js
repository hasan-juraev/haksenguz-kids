/*
 * "Qisqa va qiziq" (short and fun, ROADMAP Phase 3, item 12): four small
 * books of the short genres children grow up with.
 *
 *  - Topishmoqlar: riddles on the images of Uzbek folk riddles (an onion in
 *    seven coats, stars as scattered millet, letters as black seeds on a
 *    white field). The picture stays under a cloth until the riddle is
 *    guessed: a page's `reveal` is its answer and the uncovered picture.
 *  - Ikki xalq — bir maqol: real Uzbek proverbs, each with the Korean
 *    proverb (속담) that says the same (`proverbKo`: the Korean and, in
 *    Uzbek, what it says word for word).
 *  - Alla, bolam, alla: lullabies written in the way of Uzbek allas, for a
 *    grandmother to record in the studio; `verse` sets each line apart.
 *  - Tez ayting!: tongue twisters written for this book, each on a pair of
 *    sounds that Korean has no difference for (`sounds`): q/k, x/h, o/o',
 *    g/g', sh/ch, ng, l/r, v/b.
 * Picture order means nothing in these books, so `order: false` drops the
 * story-order game at their end. They have no place in the passport.
 */
window.storiesDatabase = window.storiesDatabase || {};

Object.assign(window.storiesDatabase, {
    topishmoqlar: {
        title: "Topishmoqlar",
        category: "kichik",
        age: [4, 8],
        tag: "O'zbek xalq topishmoqlari asosida • Aql charxi",
        hue: "#0ea5e9",
        verse: true,
        order: false,
        moral: "Topishmoq — aqlning charxi: o'ylagan bola albatta topadi!",
        cover: { bg: 'yard', items: [['sirli', 200, 284, { s: 1.05 }], ['kid1', 78, 292, { pose: 'think' }], ['kid4', 324, 292, { pose: 'point', mood: 'joy', f: 1 }], ['think', 104, 182, {}]] },
        quiz: { q: "Topishmoqning javobini qanday topamiz?", a: ["Diqqat bilan tinglab, o'ylab ko'ramiz 🤔", "O'ylamay, birinchi so'zni aytamiz 💤", "Topishmoqni hech kim topolmaydi 🙈"], ok: 0 },
        pages: [
            {
                title: "Birinchi topishmoq",
                text: "Yetti qavat to'n kiyibdi. Birorta ham tugmasi yo'q. Kim uni yechintirsa, o'zi yig'lab qoladi.",
                question: { q: "Bu nima?", a: ["Piyoz 🧅", "Karam 🥬", "Olma 🍎"], ok: 0 },
                scene: { bg: 'room', items: [['sirli', 190, 286, {}], ['kid2', 330, 292, { pose: 'think' }], ['think', 350, 186, {}]] },
                reveal: { answer: "Piyoz", scene: { bg: 'room', items: [['table', 190, 292, {}], ['piyoz', 190, 244, { s: 1.15 }], ['kid2', 330, 292, { mood: 'cry' }]] } }
            },
            {
                title: "Ikkinchi topishmoq",
                text: "Oppoq uyning eshigi ham yo'q, derazasi ham. Ichida sariq qizcha yashaydi.",
                question: { q: "Bu nima?", a: ["Yong'oq 🌰", "Tuxum 🥚", "Qor odam ⛄"], ok: 1 },
                scene: { bg: 'yard', items: [['sirli', 210, 286, {}], ['kid1', 80, 292, { pose: 'think' }], ['think', 100, 186, {}]] },
                reveal: { answer: "Tuxum", scene: { bg: 'yard', items: [['nest', 200, 284, { eggs: true, s: 2.2 }], ['hen', 300, 290, { s: 1.2 }], ['kid1', 80, 292, { pose: 'point', mood: 'joy' }]] } }
            },
            {
                title: "Uchinchi topishmoq",
                text: "Bir hovuch tariq sochildi. Kechasi ko'kda yaltiraydi. Ertalab birortasi ham qolmaydi.",
                question: { q: "Bu nima?", a: ["Qushlar 🐦", "Bulutlar ☁️", "Yulduzlar ⭐"], ok: 2 },
                scene: { bg: 'village', time: 'sunset', items: [['sirli', 190, 286, {}], ['kid4', 322, 292, { pose: 'think' }], ['think', 342, 186, {}]] },
                reveal: { answer: "Yulduzlar", scene: { bg: 'village', time: 'night', moon: false, items: [['kid4', 130, 292, { pose: 'point', mood: 'joy' }], ['kid3', 260, 292, { pose: 'up', mood: 'joy' }]] } }
            },
            {
                title: "To'rtinchi topishmoq",
                text: "Usti yap-yashil. Ichi qip-qizil. Urug'lari qop-qora.",
                question: { q: "Bu nima?", a: ["Tarvuz 🍉", "Bodring 🥒", "Pomidor 🍅"], ok: 0 },
                scene: { bg: 'poliz', items: [['sirli', 210, 286, {}], ['dehqon', 80, 292, { pose: 'think' }]] },
                reveal: { answer: "Tarvuz", scene: { bg: 'poliz', items: [['watermelon', 120, 290, { r: 26 }], ['watermelon', 245, 288, { state: 'cut', r: 24 }], ['kid3', 345, 292, { pose: 'cheer', mood: 'joy' }]] } }
            },
            {
                title: "Beshinchi topishmoq",
                text: "Kichkina sandiqcha bor. Ochsang — ichi to'la qizil marjon.",
                question: { q: "Bu nima?", a: ["Uzum 🍇", "Anor", "Olcha 🍒"], ok: 1 },
                scene: { bg: 'garden', items: [['sirli', 210, 286, {}], ['kid2', 80, 292, { pose: 'think' }], ['think', 100, 186, {}]] },
                reveal: { answer: "Anor", scene: { bg: 'garden', season: 'autumn', items: [['tree', 180, 268, { kind: 'pomegranate', s: 1.2 }], ['kid2', 330, 292, { pose: 'reach', mood: 'joy', f: 1 }]] } }
            },
            {
                title: "Oltinchi topishmoq",
                text: "Oq dalaga qora urug' sepdim. Ular unmaydi, ko'karmaydi. Lekin men bilan gaplashadi.",
                question: { q: "Bu nima?", a: ["Qordagi izlar 👣", "Qog'ozdagi harflar ✍️", "Daladagi qarg'alar"], ok: 1 },
                scene: { bg: 'room', items: [['sirli', 190, 286, {}], ['kid1', 330, 292, { pose: 'think' }], ['think', 350, 186, {}]] },
                reveal: { answer: "Qog'ozdagi harflar", scene: { bg: 'classroom', items: [['bigbook', 190, 262, { s: 0.85 }], ['kid1', 340, 292, { pose: 'point', mood: 'joy', f: 1 }]] } }
            },
            {
                title: "Yettinchi topishmoq",
                text: "Bitta ko'zi bor, lekin hech narsani ko'rmaydi. Qayerga borsa, uzun dumi ergashadi.",
                question: { q: "Bu nima?", a: ["Varrak 🪁", "Sichqon 🐭", "Igna va ip 🧵"], ok: 2 },
                scene: { bg: 'room', items: [['sirli', 210, 286, {}], ['buvi', 80, 292, {}], ['think', 100, 172, {}]] },
                reveal: { answer: "Igna va ip", scene: { bg: 'room', items: [['suzani', 210, 250, { s: 1.15 }], ['igna', 222, 238, { s: 1.2 }], ['buvi', 70, 292, { mood: 'joy' }], ['kid4', 350, 292, { mood: 'joy', f: 1 }]] } }
            },
            {
                title: "Sakkizinchi topishmoq",
                text: "Men yursam, u ham yuradi. Men to'xtasam, u ham to'xtaydi. Qorong'i tushsa, yo'q bo'lib qoladi.",
                question: { q: "Bu nima?", a: ["Soya 👤", "Mushuk 🐱", "Shamol 🌬️"], ok: 0 },
                scene: { bg: 'yard', items: [['sirli', 210, 286, {}], ['kid3', 80, 292, { pose: 'think' }], ['think', 100, 186, {}]] },
                reveal: { answer: "Soya", scene: { bg: 'yard', items: [['soya', 190, 290, { of: ['kid3', 0, 0, { pose: 'wave' }] }], ['kid3', 190, 290, { pose: 'wave', mood: 'joy' }]] } }
            },
            {
                title: "To'qqizinchi topishmoq",
                text: "Osmondan oq paxta yog'adi. Yerni oppoq qilib yopadi. Quyosh chiqsa, erib ketadi.",
                question: { q: "Bu nima?", a: ["Yomg'ir 🌧️", "Qor ❄️", "Do'l"], ok: 1 },
                scene: { bg: 'village', season: 'autumn', items: [['sirli', 190, 286, {}], ['kid2', 322, 292, { pose: 'think' }], ['think', 342, 186, {}]] },
                reveal: { answer: "Qor", scene: { bg: 'village', season: 'winter', fx: ['snow'], items: [['kid1', 130, 292, { pose: 'cheer', mood: 'joy' }], ['kid2', 260, 292, { pose: 'up', mood: 'joy' }]] } }
            },
            {
                title: "O'ninchi topishmoq",
                text: "Kechasi ko'kda suzib yuradi. Goh to'la lagan bo'ladi. Goh yarim non bo'ladi.",
                question: { q: "Bu nima?", a: ["Quyosh ☀️", "Chiroq 💡", "Oy 🌙"], ok: 2 },
                scene: { bg: 'yard', time: 'sunset', items: [['sirli', 210, 286, {}], ['kid4', 80, 292, { pose: 'think' }], ['think', 100, 186, {}]] },
                reveal: { answer: "Oy", scene: { bg: 'yard', time: 'night', moonAt: [200, 70], items: [['kid4', 120, 292, { pose: 'point', mood: 'joy' }], ['buvi', 290, 292, { mood: 'joy', f: 1 }]] } }
            }
        ]
    },

    maqollar: {
        title: "Ikki xalq — bir maqol",
        category: "kichik",
        age: [6, 10],
        tag: "O'zbek va koreys maqollari • Donolik",
        hue: "#8b5cf6",
        order: false,
        moral: "Maqol — xalqning ko'p yillik donoligi. Ikki xalq bir xil o'ylasa, demak, bu chin haqiqat!",
        cover: { bg: 'garden', items: [['kid1', 120, 292, { pose: 'wave', mood: 'joy' }], ['minjun', 280, 292, { pose: 'wave', mood: 'joy', f: 1 }], ['hearts', 200, 190, {}]] },
        quiz: { q: "Maqol nima?", a: ["Xalqning donoligi — qisqa va chiroyli so'zlarda 💡", "Uzun ertak 📚", "Faqat bitta odamning fikri 🙃"], ok: 0 },
        pages: [
            {
                title: "Tomchi-tomchi ko'l bo'lur",
                text: "Yomg'ir tomchilari bittalab yig'ilib, katta ko'lga aylanadi. Sen ham har kuni oz-ozdan o'rgansang, ko'p narsani bilib olasan.",
                proverbKo: ["티끌 모아 태산", "Changni yig'sang, tog' bo'ladi."],
                question: { q: "Bu maqol nimani o'rgatadi?", a: ["Har kuni oz-ozdan harakat qilishni 💧", "Faqat yomg'irni kutishni ☔", "Ko'lda suzishni 🏊"], ok: 0 },
                scene: { bg: 'lake', fx: ['rain'], items: [['kid1', 300, 292, { pose: 'up', mood: 'joy' }], ['drops', 170, 230, {}]] }
            },
            {
                title: "Yetti o'lchab, bir kes",
                text: "Buvijon matoni qaychi bilan kesishdan oldin uni yetti marta o'lchaydi. Har ishni shoshmay, avval o'ylab, keyin qil.",
                proverbKo: ["돌다리도 두들겨 보고 건너라", "Tosh ko'prikni ham taqillatib ko'r, keyin o't."],
                scene: { bg: 'room', items: [['atlas', 205, 282, { s: 1.1 }], ['buvi', 78, 292, { pose: 'point' }], ['kid4', 334, 292, { pose: 'think', f: 1 }]] }
            },
            {
                title: "Ko'z qo'rqoq, qo'l botir",
                text: "Hovlida tog'dek xazon bor — uni ko'rib, ko'z qo'rqadi. Lekin supurgini olib boshlasang, ish tez bitadi.",
                proverbKo: ["시작이 반이다", "Boshlash — ishning yarmi."],
                question: { q: "Katta ishni ko'rib qo'rqsak, nima qilamiz?", a: ["Qochib ketamiz 🏃", "Ishni boshlaymiz — u tez bitadi 💪", "Ko'zimizni yumib olamiz 🙈"], ok: 1 },
                scene: { bg: 'yard', season: 'autumn', fx: ['leaves'], items: [['xazon', 120, 292, { w: 80 }], ['kid1', 262, 292, { pose: 'sweep', hold: 'broom', mood: 'joy' }]] }
            },
            {
                title: "Ilm — aql chirog'i",
                text: "Chiroq qorong'i xonani yoritadi. Ilm esa aqlni yoritadi: o'qigan bola ko'p narsani tushunadi.",
                proverbKo: ["아는 것이 힘이다", "Bilim — kuch."],
                scene: { bg: 'room', time: 'night', items: [['table', 110, 292, {}], ['lamp', 110, 246, {}], ['kid2', 250, 292, { pose: 'hold', hold: 'book' }]] }
            },
            {
                title: "Birlashgan o'zar, birlashmagan to'zar",
                text: "Og'ir sandiqni bitta bola ko'tara olmaydi. Do'stlar birga ko'tarsa, sandiq patdek yengil bo'ladi.",
                proverbKo: ["백지장도 맞들면 낫다", "Bir varaq qog'ozni ham birga ko'tarsang, yengil bo'ladi."],
                question: { q: "Ishni qanday qilsak, oson bo'ladi?", a: ["Yolg'iz, hech kimga aytmay 🤐", "Urishib-janjallashib 😠", "Do'stlar bilan birga 🤝"], ok: 2 },
                scene: { bg: 'yard', items: [['chest', 200, 196, { s: 1.15 }], ['kid1', 140, 292, { pose: 'lift', mood: 'joy' }], ['kid3', 262, 292, { pose: 'lift', mood: 'joy', f: 1 }]] }
            },
            {
                title: "Yaxshi so'z — jon ozig'i",
                text: "Shirin so'z odamni xuddi mazali taomdek quvontiradi. Kimgadir yaxshi so'z aytsang, unga kuch berasan.",
                proverbKo: ["가는 말이 고와야 오는 말이 곱다", "Ketgan so'z chiroyli bo'lsa, qaytgan so'z ham chiroyli bo'ladi."],
                scene: { bg: 'yard', items: [['kid1', 140, 292, { pose: 'give', mood: 'happy' }], ['kid4', 262, 292, { mood: 'joy', f: 1 }], ['hearts', 200, 188, {}]] }
            },
            {
                title: "Mehnatning tagi — rohat",
                text: "Dehqon bahorda ekib, yozda sug'oradi. Kuzda esa mo'l hosilni ko'rib quvonadi.",
                proverbKo: ["고생 끝에 낙이 온다", "Mashaqqatning oxirida quvonch keladi."],
                scene: { bg: 'field', season: 'autumn', items: [['wheat', 80, 292, { n: 9 }], ['wheat', 330, 292, { n: 9 }], ['dehqon2', 200, 292, { mood: 'joy' }], ['basket', 268, 292, {}]] }
            },
            {
                title: "Nima eksang, shuni o'rasan",
                text: "Bug'doy eksang, bug'doy o'rasan. Yaxshilik qilsang, senga ham yaxshilik qaytadi.",
                proverbKo: ["콩 심은 데 콩 나고 팥 심은 데 팥 난다", "Loviya ekkan joyda loviya, qizil loviya ekkan joyda qizil loviya unadi."],
                question: { q: "Bug'doy eksang, nima o'rasan?", a: ["Bug'doy 🌾", "Olma 🍎", "Tarvuz 🍉"], ok: 0 },
                scene: { bg: 'garden', season: 'spring', items: [['kid3', 150, 292, { pose: 'hold', hold: 'seeds', mood: 'happy' }], ['wheat', 290, 292, { n: 6 }]] }
            },
            {
                title: "Ikki kemaning boshini tutgan g'arq bo'lar",
                text: "Ikki kemani birdan boshqarib bo'lmaydi, ikki quyonni birdan tutib ham bo'lmaydi. Bitta ishni boshlasang, avval uni oxiriga yetkaz.",
                proverbKo: ["두 마리 토끼를 잡으려다 둘 다 놓친다", "Ikki quyonni quvlagan ikkisidan ham ayriladi."],
                scene: { bg: 'meadow', items: [['rabbit', 70, 290, { f: 1 }], ['rabbit', 332, 290, {}], ['kid1', 200, 292, { pose: 'scared', mood: 'surprised' }], ['motion', 110, 268, { f: 1 }], ['motion', 292, 268, {}]] }
            },
            {
                title: "Do'st achitib gapirar, dushman — kuldirib",
                text: "Haqiqiy do'st xatoingni ochiq aytadi — bu biroz achchiq tuyuladi. Lekin u seni yaxshi ko'rgani uchun shunday qiladi.",
                proverbKo: ["좋은 약은 입에 쓰다", "Yaxshi dori achchiq bo'ladi."],
                scene: { bg: 'yard', items: [['kid2', 130, 292, { pose: 'point' }], ['kid3', 270, 292, { mood: 'sad', f: 1 }], ['mark', 150, 180, {}]] }
            }
        ]
    },

    allalar: {
        title: "Alla, bolam, alla",
        category: "kichik",
        age: [3, 7],
        tag: "Allalar • Xalq allalari ruhida",
        hue: "#6366f1",
        verse: true,
        order: false,
        moral: "Onaning allasi — eng shirin qo'shiq: u bolaga mehr va tinch uyqu beradi.",
        cover: { bg: 'room', time: 'night', items: [['beshik', 196, 286, { rock: true, s: 1.2 }], ['ona', 330, 292, { mood: 'happy', f: 1 }], ['zzz', 182, 172, {}]] },
        quiz: { q: "Alla qachon aytiladi?", a: ["Bola uxlashidan oldin 🌙", "Maktabga borayotganda 🎒", "Futbol o'ynayotganda ⚽"], ok: 0 },
        pages: [
            {
                title: "Alla, bolam",
                text: "Alla, bolam, alla. Oppoq qo'zim, alla. Beshigingni tebratay. Uxla, jonim, alla.",
                scene: { bg: 'room', time: 'night', items: [['beshik', 186, 286, { rock: true, s: 1.2 }], ['ona', 326, 292, { mood: 'happy', f: 1 }], ['zzz', 172, 172, {}]] }
            },
            {
                title: "Oy ham uxlar",
                text: "Oy chiqibdi osmonga. Yulduz to'la dasturxon. Oy ham sekin uxlaydi. Sen ham uxla, mehribon.",
                scene: { bg: 'village', time: 'night', moonAt: [306, 66], items: [['hut', 150, 268, { lit: true }], ['zzz', 330, 118, {}]] }
            },
            {
                title: "Qushchalar uyasida",
                text: "Qushchalar uyasida. Qanotini yopibdi. Qo'zichoqlar qo'tonda. Shirin uyqu topibdi.",
                scene: { bg: 'yard', time: 'night', items: [['tree', 110, 268, {}], ['nest', 124, 178, { chicks: 2 }], ['ram', 292, 290, { mood: 'sleep', s: 0.85 }], ['zzz', 300, 222, {}]] }
            },
            {
                title: "Katta bo'lgin",
                text: "Katta bo'lgin, bolajon. Dono bo'lgin, mehribon. Ota-onang yonida. Bo'lgin baxtli, shodumon.",
                scene: { bg: 'room', time: 'night', items: [['beshik', 160, 286, {}], ['buvi', 304, 292, { mood: 'happy', f: 1 }], ['think', 182, 150, { text: '📚' }]] }
            },
            {
                title: "Buvijon allasi",
                text: "Buvijonim alla der. Uzoq yurtdan sog'inib. Telefondan eshitib. Uxlar bolam ovunib.",
                scene: { bg: 'flat', time: 'night', items: [['table', 120, 292, {}], ['tablet', 120, 250, { show: 'buvi' }], ['beshik', 280, 286, {}], ['notes', 160, 150, {}]] }
            },
            {
                title: "Tong otguncha",
                text: "Ko'zing yumgin, qo'zichoq. Tong otguncha uxlagin. Ertalab quyosh bilan. Kulib-kulib uyg'ongin.",
                scene: { bg: 'yard', time: 'morning', items: [['rooster', 92, 290, {}], ['kid1', 230, 292, { pose: 'cheer', mood: 'joy' }]] }
            }
        ]
    },

    tez_aytish: {
        title: "Tez ayting!",
        category: "kichik",
        age: [5, 10],
        tag: "Tez aytishlar • Tilni charxlaymiz",
        hue: "#f59e0b",
        order: false,
        moral: "Tez aytish tilni charxlaydi: so'zlarni aniq va chiroyli aytishga o'rgatadi.",
        cover: { bg: 'meadow', items: [['kid1', 120, 292, { pose: 'cheer', mood: 'laugh' }], ['kid2', 280, 292, { pose: 'cheer', mood: 'laugh', f: 1 }], ['notes', 200, 170, {}]] },
        quiz: { q: "Tez aytishni qanday mashq qilamiz?", a: ["Avval sekin, keyin tezroq, aniq qilib 🗣️", "Faqat ichimizda, ovozsiz 🤐", "Bitta so'zini aytamiz, xolos 🙃"], ok: 0 },
        pages: [
            {
                title: "Q va K",
                text: "Kichkina kuchuk qirda qo'qqis qoqildi. Qoqilgan kuchukni qizcha quchoqladi.",
                sounds: ["q", "k"],
                scene: { bg: 'meadow', items: [['dog', 160, 290, { s: 0.75, mood: 'surprised' }], ['motion', 126, 270, {}], ['kid2', 286, 292, { pose: 'hold', mood: 'joy', f: 1 }]] }
            },
            {
                title: "X va H",
                text: "Hakka hovlida hakillar, xo'roz xonada xurrak otar. Hakka hayron: «Hoy, xo'roz, hali ham uxlaysanmi?»",
                sounds: ["x", "h"],
                scene: { bg: 'yard', items: [['tree', 96, 268, {}], ['bird', 116, 178, {}], ['rooster', 268, 290, { mood: 'sleep', s: 1.1 }], ['zzz', 280, 220, {}]] }
            },
            {
                title: "O va O'",
                text: "Oq o'rdak o'rdakchalarga o'ttizta olma olib keldi. O'rdakchalar olmalarni o'ynab-o'ynab yedi.",
                sounds: ["o", "o'"],
                scene: { bg: 'lake', items: [['bird', 130, 290, { kind: 'duck', s: 1.4 }], ['bird', 214, 292, { kind: 'chick', s: 0.9 }], ['bird', 262, 292, { kind: 'chick', s: 0.9 }], ['basket', 340, 292, {}]] }
            },
            {
                title: "G va G'",
                text: "Go'zal g'oz gilosni g'ajidi. G'oz g'ajigan gilos guldek go'zal edi.",
                sounds: ["g", "g'"],
                scene: { bg: 'garden', items: [['tree', 120, 268, { fruit: '#9d0208' }], ['bird', 270, 290, { kind: 'goose', s: 1.4 }]] }
            },
            {
                title: "Sh va Ch",
                text: "Shoshqaloq chumchuq shoxda chirqillaydi. Choynak ham shoshib-shoshib vishillaydi.",
                sounds: ["sh", "ch"],
                scene: { bg: 'yard', items: [['tree', 104, 268, {}], ['bird', 122, 176, {}], ['dasturxon', 272, 292, {}], ['teapot', 272, 272, { s: 1.4 }], ['smoke', 272, 232, {}]] }
            },
            {
                title: "Ng",
                text: "Tongda ko'l bo'yida mingta chig'anoq jaranglaydi. Bobur jaranglagan chig'anoqlarni ming marta tingladi.",
                sounds: ["ng"],
                scene: { bg: 'lake', time: 'morning', items: [['chiganoq', 166, 292, { n: 5, s: 1.4 }], ['bobur', 326, 292, { pose: 'ear', mood: 'joy', f: 1 }], ['notes', 190, 220, {}]] }
            },
            {
                title: "L va R",
                text: "Lolaxon lolalarni ro'molga o'radi. Ro'moldagi lolalar quyoshda lovullab yonardi.",
                sounds: ["l", "r"],
                scene: { bg: 'meadow', season: 'spring', items: [['tulips', 86, 292, { s: 1.3 }], ['tulips', 322, 292, { s: 1.3 }], ['kid4', 204, 292, { pose: 'hold', mood: 'joy' }]] }
            },
            {
                title: "V va B",
                text: "Vali va Bobur varrak uchirdi. Varrak bulutga borib, «vuv!» deb burildi.",
                sounds: ["v", "b"],
                scene: { bg: 'meadow', items: [['kite', 270, 118, {}], ['kid1', 140, 292, { pose: 'up', mood: 'joy' }], ['bobur', 244, 292, { pose: 'point', mood: 'joy' }]] }
            }
        ]
    }
});
