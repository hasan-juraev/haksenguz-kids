/*
 * "Ikki xalq — bir ertak / 두 나라, 한 이야기" (ROADMAP Phase 2, item 5):
 * Korean folk tales that are twins of Uzbek ones, retold in Uzbek.
 *
 *   twin:     the Uzbek tale it pairs with. The twin opens in the library once
 *             the child has finished that tale, whose last page then offers it.
 *   compare:  the "find the differences" game at the end (Games.compare in
 *             js/games.js): an icon for each tale, then cards [emoji, text,
 *             where], where is 'uz' (only the Uzbek tale), 'ko' (only this
 *             one) or 'both'.
 *
 * Everything else is as in js/stories-folk.js.
 */
window.storiesDatabase = window.storiesDatabase || {};

Object.assign(window.storiesDatabase, {
    hungbu_nolbu: {
        title: "Hungbu va Nolbu",
        category: "twins",
        age: [5, 8],
        region: "koreya",
        tag: "Koreya xalq ertagi • Ikki xalq — bir ertak",
        hue: "#2a6f97",
        twin: "oltin_tarvuz",
        isNew: true,
        moral: "Mehribonlik va kechirimlilik baxt keltiradi, hasad va ochko'zlik esa bor-yo'g'idan ayiradi.",
        cover: { bg: 'kvillage', time: 'day', season: 'autumn', items: [['chogajip', 210, 262, { gourds: 3, glow: true, s: 1.15 }], ['bird', 306, 104, { kind: 'swallow', fly: true, s: 1.5 }], ['hungbu', 92, 302, { pose: 'cheer', mood: 'joy' }], ['sparkles', 210, 150, { w: 150, h: 50 }]] },
        quiz: {
            q: "Hungbu bilan «Oltin tarvuz»dagi dehqonning o'xshash tomoni nima?",
            a: ["Ikkalasi ham qushchaga beg'araz yordam berdi", "Ikkalasi ham juda boy edi", "Ikkalasi ham qushchani xafa qildi"],
            ok: 0
        },
        compare: {
            icons: ['🍉', '🎃'],
            cards: [
                ['🐦', "Qaldirg'och", 'both'],
                ['🩹', "Qushchani davolash", 'both'],
                ['🌱', "Sehrli urug'", 'both'],
                ['🍉', "Tarvuz", 'uz'],
                ['🎃', "Qovoq (bak)", 'ko'],
                ['🏘️', "Ikki qo'shni", 'uz'],
                ['👬', "Ikki aka-uka", 'ko'],
                ['💰', "Oltin tangalar", 'both'],
                ['🍚', "Guruch", 'ko'],
                ['🐝', "Arilar", 'uz'],
                ['👹', "Dokkebilar", 'ko'],
                ['🤝', "Kechirim", 'both'],
            ],
        },
        pages: [
            {
                title: "Ikki aka-uka",
                text: "Qadim zamonda Koreya degan tog'li yurtda ikki aka-uka yashar ekan. Akasi Nolbu boy, ammo ochko'z va baxil ekan. Ukasi Hungbu esa kambag'al, lekin mehribon va mehnatkash ekan. Ota-onasi olamdan o'tgach, Nolbu butun merosni o'ziga olib, ukasini uyidan haydab yuboribdi.",
                word: ["meros", "Ota-onadan bolalariga qolgan uy, yer va mol-mulk"],
                scene: { bg: 'kvillage', time: 'morning', items: [['giwajip', 292, 262, { s: 0.86 }], ['nolbu', 300, 302, { pose: 'point', mood: 'angry' }], ['hungbuxotin', 58, 302, { mood: 'sad' }], ['hungbu', 112, 302, { mood: 'sad', walk: true }], ['hkid1', 158, 304, { mood: 'sad' }], ['hkid2', 194, 304, { mood: 'cry', s: 0.9 }]] }
            },
            {
                title: "Somon tomli kulba",
                text: "Hungbu xotini va bolalari bilan tog' etagidagi kichkina choga — somon tomli kulbaga ko'chib o'tibdi. Uy shunday kichkina ekanki, Hungbu yotganda oyog'i eshikdan chiqib qolarkan. Ular kambag'al bo'lsalar ham, bir-birlarini yaxshi ko'rib, kulib yasharkan.",
                word: ["choga", "Tomi somon bilan yopilgan koreyscha kulba"],
                question: { q: "Hungbuning oilasi kambag'al bo'lsa ham qanday yashardi?", a: ["Bir-birini yaxshi ko'rib, kulib yashardi", "Har kuni urishib yashardi", "Hech kim bilan gaplashmasdi"], ok: 0 },
                scene: { bg: 'kyard', time: 'day', gateX: false, items: [['chogajip', 230, 262, { s: 1.15 }], ['hungbu', 80, 302, { pose: 'wave', mood: 'joy' }], ['hungbuxotin', 128, 302, { mood: 'happy' }], ['hkid1', 330, 304, { pose: 'cheer', mood: 'joy' }], ['hkid3', 366, 304, { mood: 'joy' }]] }
            },
            {
                title: "Akaning darvozasi",
                text: "Qish kelib, Hungbuning uyida bir siqim ham guruch qolmabdi. Och qolgan bolalarini ko'rib, u akasining oldiga boribdi. «Aka, bolalarimga ozgina guruch bering», — deb iltimos qilibdi. Ammo Nolbu: «Senga beradigan hech narsam yo'q!» — deb, uni darvozadan quvib solibdi.",
                scene: { bg: 'kyard', wall: 'tile', time: 'day', season: 'winter', fx: ['snow'], gateX: 330, items: [['onggi', 70, 300, { n: 3 }], ['nolbu', 270, 302, { pose: 'point', mood: 'angry' }], ['nolbuxotin', 320, 302, { pose: 'hips', mood: 'angry', s: 0.95 }], ['hungbu', 160, 302, { pose: 'hold', hold: 'bowl', mood: 'sad' }]] }
            },
            {
                title: "Qaldirg'ochlar keldi",
                text: "Bahor kelib, issiq o'lkalardan qaldirg'ochlar uchib kelibdi. Ular Hungbuning kulbasi bo'g'otiga in qurishibdi. Hungbu: «Uyimga xush kelibsizlar!» — deb quvonibdi. Tez orada inda kichkina polaponlar chiyillay boshlabdi.",
                word: ["bo'g'ot", "Tomning devordan chiqib turgan cheti"],
                scene: { bg: 'kyard', time: 'morning', season: 'spring', gateX: false, items: [['chogajip', 200, 262, { s: 1.2, nest: true }], ['bird', 290, 96, { kind: 'swallow', fly: true, s: 1.4 }], ['bird', 340, 70, { kind: 'swallow', fly: true, s: 1.1, f: 1 }], ['hungbu', 320, 302, { pose: 'wave', mood: 'joy' }], ['flowers', 70, 304, { w: 70 }]] }
            },
            {
                title: "Ilon kelganda",
                text: "Bir kuni inga katta ilon o'rmalab kelibdi. Qo'rqib ketgan polaponlardan biri pastga yiqilib, oyog'ini sindirib olibdi. Hungbu yugurib kelib, ilonni haydab yuboribdi va polaponni avaylab kaftiga olibdi.",
                question: { q: "Polapon yiqilganda Hungbu nima qildi?", a: ["Uni avaylab kaftiga oldi", "Indamay o'tib ketdi", "Uni mushukka berdi"], ok: 0 },
                scene: { bg: 'kyard', time: 'day', season: 'spring', gateX: false, items: [['chogajip', 150, 262, { s: 1.1, nest: true }], ['snake', 46, 300, { s: 0.9, f: 1 }], ['motion', 96, 282, { len: 26 }], ['hungbu', 290, 302, { pose: 'hold', hold: 'swallow', mood: 'sad' }], ['hearts', 290, 196, { n: 2 }]] }
            },
            {
                title: "Mehribon qo'llar",
                text: "Hungbu polaponning oyog'iga yupqa cho'p qo'yib, ip bilan bog'lab qo'yibdi. Bolalari unga har kuni don va suv berishibdi. Polapon tuzalib, kuz kelganda boshqa qaldirg'ochlar bilan janubga uchib ketibdi. Hungbuning oilasi: «Xayr, qushcha! Yana kel!» — deb qo'l silkitib qolibdi.",
                scene: { bg: 'kyard', time: 'day', season: 'autumn', fx: ['leaves'], gateX: false, items: [['chogajip', 110, 262, { s: 0.95 }], ['hungbu', 220, 302, { pose: 'wave', mood: 'joy' }], ['hkid1', 266, 304, { pose: 'wave', mood: 'joy' }], ['hkid2', 300, 304, { pose: 'cheer', mood: 'joy' }], ['bird', 290, 94, { kind: 'swallow', fly: true, s: 1.4 }], ['bird', 354, 64, { kind: 'swallow', fly: true, s: 1 }]] }
            },
            {
                title: "Bir dona urug'",
                text: "Kelasi bahorda o'sha qaldirg'och yana qaytib kelibdi. Tumshug'idagi bir dona urug'ni Hungbuning kaftiga tashlabdi. Bu bak — katta oq qovoq urug'i ekan. Hungbu uni kulbasi yoniga ekib, har kuni sug'oribdi.",
                word: ["bak", "Koreyada o'sadigan katta, oq qovoq"],
                scene: { bg: 'kyard', time: 'morning', season: 'spring', gateX: false, items: [['chogajip', 300, 262, { s: 0.95 }], ['hungbu', 130, 302, { pose: 'reach', mood: 'surprised' }], ['bird', 212, 160, { kind: 'swallow', fly: true, hold: 'seed', s: 1.6, f: 1 }], ['sparkles', 196, 176, { w: 50, h: 40, n: 4 }]] }
            },
            {
                title: "Tomdagi qovoqlar",
                text: "Urug'dan uzun palak o'sib, kulbaning tomini qoplab olibdi. Kuzga borib, tomda oydek oppoq, ulkan qovoqlar pishibdi. Hungbu xotini bilan qo'liga arra olib: «Qani, arralaymiz! Ichida nima bor ekan?» — deb kulishibdi.",
                question: { q: "Qaldirg'och olib kelgan urug'dan nima o'sdi?", a: ["Ulkan oq qovoqlar", "Olma daraxti", "Tarvuz"], ok: 0 },
                scene: { bg: 'kyard', time: 'sunset', season: 'autumn', gateX: false, items: [['chogajip', 200, 262, { s: 1.15, gourds: 3, glow: true }], ['hungbu', 70, 302, { pose: 'hold', hold: 'saw', mood: 'joy' }], ['hungbuxotin', 330, 302, { pose: 'cheer', mood: 'joy' }]] }
            },
            {
                title: "Qovoq ichida — boylik!",
                text: "Birinchi qovoqni arralashsa, ichidan oppoq guruch to'kilibdi. Ikkinchisidan oltin va kumush tangalar sochilibdi. Uchinchisidan esa duradgorlar chiqib, bir zumda ularga chiroyli katta uy qurib berishibdi! Hungbu boyligini qo'shnilari bilan ham baham ko'ribdi.",
                word: ["duradgor", "Yog'ochdan uy va buyumlar yasaydigan usta"],
                scene: { bg: 'kyard', time: 'day', season: 'autumn', gateX: false, items: [['gourd', 150, 300, { r: 30, open: 'gold' }], ['gourd', 258, 300, { r: 26, open: 'rice' }], ['hungbu', 60, 302, { pose: 'cheer', mood: 'joy' }], ['hungbuxotin', 346, 302, { pose: 'cheer', mood: 'joy' }], ['hkid2', 206, 306, { mood: 'joy', s: 0.8 }]] }
            },
            {
                title: "Nolbuning hasadi",
                text: "Ukasining boyib ketganini eshitgan Nolbu hasaddan yonib ketibdi. «Men ham boy bo'laman!» — deb, u qaldirg'och inini tayoq bilan turtib, polaponni yerga yiqitibdi. Keyin uni zo'rma-zo'raki bog'lab: «Qani, menga ham urug' olib kel!» — debdi.",
                question: { q: "Nolbu qushchani nega bog'lab qo'ydi?", a: ["Boylik olish uchun, hasaddan", "Qushchani yaxshi ko'rgani uchun", "Ukasi so'ragani uchun"], ok: 0 },
                scene: { bg: 'kyard', wall: 'tile', time: 'day', season: 'spring', gateX: false, items: [['giwajip', 240, 262, { s: 0.82, nest: true }], ['nolbu', 110, 302, { pose: 'point', hold: 'stick', mood: 'sly' }], ['bird', 300, 104, { kind: 'swallow', fly: true, s: 1.3, f: 1, mood: 'angry' }], ['mark', 230, 140, { ch: '!' }]] }
            },
            {
                title: "Dokkebilar qovog'i",
                text: "Bahorda qaldirg'och Nolbuga ham bir dona urug' olib kelibdi. Uning tomida ham ulkan qovoqlar pishibdi. Nolbu xursand bo'lib qovoqni arralabdi — ammo ichidan shovqin-suron bilan dokkebilar sakrab chiqibdi! Ular to'qmoqlarini o'ynatib, Nolbuning bor boyligini olib ketishibdi.",
                word: ["dokkebi", "Koreya ertaklaridagi shumtaka devcha, qo'lida sehrli to'qmog'i bor"],
                scene: { bg: 'kyard', wall: 'tile', time: 'dusk', season: 'autumn', gateX: false, items: [['onggi', 360, 300, { n: 2 }], ['gourd', 196, 300, { r: 30, open: 'smoke' }], ['dokkebi', 270, 302, { s: 0.52, pose: 'up' }], ['dokkebi2', 140, 302, { s: 0.42, f: 1 }], ['nolbu', 60, 304, { pose: 'scared', mood: 'scared' }]] }
            },
            {
                title: "Aka-uka yarashdi",
                text: "Hamma narsasidan ayrilgan Nolbu xotini bilan ukasining eshigini qoqibdi. Mehribon Hungbu akasini quchoq ochib kutib olibdi va o'z uyiga taklif qilibdi. Nolbu qilgan ishlaridan pushaymon bo'lib, ukasidan kechirim so'rabdi. Shundan beri aka-uka ahil-inoq yashab qolishibdi.",
                question: { q: "Hungbu akasini nega kechirdi?", a: ["Chunki u mehribon va kechirimli edi", "Chunki akasi unga oltin berdi", "Chunki dokkebilar buyurdi"], ok: 0 },
                scene: { bg: 'kvillage', time: 'sunset', rainbow: true, items: [['hungbu', 170, 302, { pose: 'reach', mood: 'joy' }], ['nolbu', 238, 302, { pose: 'heart', mood: 'sad' }], ['hungbuxotin', 110, 302, { mood: 'joy' }], ['nolbuxotin', 296, 302, { mood: 'happy' }], ['hearts', 204, 166, {}], ['bird', 150, 96, { kind: 'swallow', fly: true, s: 1.1 }], ['bird', 250, 82, { kind: 'swallow', fly: true, s: 1.1, f: 1 }]] }
            }
        ]
    }
});
