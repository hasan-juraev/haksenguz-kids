/*
 * Alifbo (ROADMAP Phase 3, item 9): the Uzbek Latin alphabet, one page per
 * letter in the official order, O' G' Sh Ch Ng and the tutuq belgisi
 * included. Each page has its letter (`letter: "A a"`, shown big with a
 * ✍️ button to trace it, js/games.js) and a word that starts with it, with
 * a picture. "Ng" never starts a word, so its page says so.
 * With the menus in Cyrillic the letters show in Cyrillic too.
 */
window.storiesDatabase = window.storiesDatabase || {};

Object.assign(window.storiesDatabase, {
    alifbo: {
        title: "Alifbo",
        category: "alifbo",
        age: [4, 7],
        tag: "Alifbo • Harflar va so'zlar",
        hue: "#f97316",
        moral: "Harflarni bilgan bola har qanday kitobni o'qiy oladi!",
        cover: { bg: 'meadow', time: 'day', items: [['shar', 300, 296, { n: 3 }], ['kid2', 300, 304, { pose: 'cheer', mood: 'joy' }], ['kid1', 110, 304, { pose: 'hold', hold: 'book', mood: 'joy' }], ['paper', 200, 230, { lines: ['A B D'], w: 110 }]] },
        quiz: {
            q: "O'zbek alifbosida qaysi harflar belgi bilan yoziladi?",
            a: ["O' va G'", "A va B", "X va Y"],
            ok: 0
        },
        pages: [
            {
                title: "A — Anor",
                letter: "A a",
                text: "A — anor. Anor qip-qizil, donalari marjondek.",
                word: ["anor", "Ichi qizil donalarga to'la meva"],
                scene: { bg: 'garden', time: 'day', season: 'autumn', items: [['tree', 200, 268, { kind: 'pomegranate', s: 1.25 }]] }
            },
            {
                title: "B — Baliq",
                letter: "B b",
                text: "B — baliq. Baliq suvda suzadi.",
                word: ["baliq", "Suvda yashaydigan, suzgichli jonivor"],
                scene: { bg: 'lake', time: 'day', items: [['fish', 160, 290, { s: 1.4 }], ['fish', 260, 300, { s: 1.1, gold: false, f: 1 }], ['drops', 200, 250, {}]] }
            },
            {
                title: "D — Daraxt",
                letter: "D d",
                text: "D — daraxt. Daraxt soyasida dam olamiz.",
                word: ["daraxt", "Tanasi va shoxlari bor katta o'simlik"],
                scene: { bg: 'meadow', time: 'day', items: [['tree', 210, 268, { kind: 'big', s: 1.2 }], ['kid4', 110, 304, { noLegs: true, mood: 'joy' }]] }
            },
            {
                title: "E — Eshak",
                letter: "E e",
                text: "E — eshak. Eshak og'ir yuk tashiydi.",
                word: ["eshak", "Uzun quloqli, chidamli uy hayvoni"],
                scene: { bg: 'village', time: 'day', items: [['donkey', 200, 300, { s: 1.1 }]] }
            },
            {
                title: "F — Fil",
                letter: "F f",
                text: "F — fil. Fil — quruqlikdagi eng katta hayvon.",
                word: ["fil", "Uzun xartumli, juda katta hayvon"],
                question: { q: "Qaysi so'z «F» harfi bilan boshlanadi?", a: ["Fil", "Olma", "Uy"], ok: 0 },
                scene: { bg: 'steppe', time: 'day', items: [['fil', 190, 300, { s: 1.3 }]] }
            },
            {
                title: "G — Gul",
                letter: "G g",
                text: "G — gul. Gul xushbo'y hid taratadi.",
                word: ["gul", "Chiroyli, xushbo'y o'simlik"],
                scene: { bg: 'garden', time: 'day', season: 'spring', items: [['flowers', 130, 300, {}], ['flowers', 270, 302, {}], ['bee', 210, 200, {}]] }
            },
            {
                title: "H — Hovli",
                letter: "H h",
                text: "H — hovli. Bizning hovlimizda tok bor.",
                word: ["hovli", "Uy oldidagi ochiq, o'ralgan joy"],
                scene: { bg: 'yard', time: 'day', items: [['kid1', 150, 304, { pose: 'wave', mood: 'joy' }], ['cat', 260, 302, {}]] }
            },
            {
                title: "I — It",
                letter: "I i",
                text: "I — it. It uyni qo'riqlaydi.",
                word: ["it", "Uyni qo'riqlaydigan sodiq hayvon"],
                scene: { bg: 'village', time: 'day', items: [['dog', 200, 300, { s: 1.2, mood: 'happy' }]] }
            },
            {
                title: "J — Jo'ja",
                letter: "J j",
                text: "J — jo'ja. Jo'jalar onasining ortidan chopadi.",
                word: ["jo'ja", "Tovuqning kichkina bolasi"],
                scene: { bg: 'yard', time: 'day', items: [['hen', 140, 302, { s: 1.1 }], ['bird', 210, 304, { kind: 'chick', s: 1.3 }], ['bird', 256, 306, { kind: 'chick', s: 1.2 }], ['bird', 300, 304, { kind: 'chick', s: 1.3 }]] }
            },
            {
                title: "K — Kitob",
                letter: "K k",
                text: "K — kitob. Kitob — eng yaxshi do'st.",
                word: ["kitob", "O'qish uchun varaqlari bor narsa"],
                question: { q: "Kitob nima uchun kerak?", a: ["O'qish va bilim olish uchun", "Yeyish uchun", "Ustiga o'tirish uchun"], ok: 0 },
                scene: { bg: 'room', time: 'day', items: [['bigbook', 200, 290, {}], ['kid2', 86, 304, { mood: 'joy' }]] }
            },
            {
                title: "L — Lola",
                letter: "L l",
                text: "L — lola. Bahorda dalalarda lolalar ochiladi.",
                word: ["lola", "Bahorda ochiladigan qizil gul"],
                scene: { bg: 'meadow', time: 'day', season: 'spring', items: [['tulips', 120, 302, { n: 5 }], ['tulips', 270, 304, { n: 6 }]] }
            },
            {
                title: "M — Mushuk",
                letter: "M m",
                text: "M — mushuk. Mushuk «miyov» deydi.",
                word: ["mushuk", "Uyda yashaydigan, «miyov» deydigan hayvon"],
                scene: { bg: 'room', time: 'day', items: [['cat', 200, 300, { s: 1.4, mood: 'happy' }]] }
            },
            {
                title: "N — Non",
                letter: "N n",
                text: "N — non. Tandirdan issiq non uzildi.",
                word: ["non", "Tandirda yopiladigan dumaloq taom"],
                scene: { bg: 'yard', time: 'morning', items: [['tandir', 140, 300, {}], ['ona', 252, 302, { pose: 'hold', hold: 'bread', mood: 'joy' }]] }
            },
            {
                title: "O — Olma",
                letter: "O o",
                text: "O — olma. Olma qizarib pishdi.",
                word: ["olma", "Dumaloq, shirin meva"],
                scene: { bg: 'garden', time: 'day', items: [['tree', 200, 268, { kind: 'apple', s: 1.25 }]] }
            },
            {
                title: "P — Palov",
                letter: "P p",
                text: "P — palov. Palovni katta qozonda damlashadi.",
                word: ["palov", "Guruch, sabzi va go'shtdan qilinadigan osh"],
                question: { q: "Palov qayerda pishiriladi?", a: ["Katta qozonda", "Muzlatgichda", "Choynakda"], ok: 0 },
                scene: { bg: 'yard', time: 'day', items: [['qozon', 150, 296, { content: 'osh' }], ['lagan', 266, 292, { r: 30 }]] }
            },
            {
                title: "Q — Quyon",
                letter: "Q q",
                text: "Q — quyon. Quyonning quloqlari uzun.",
                word: ["quyon", "Uzun quloqli, sakrab yuradigan hayvon"],
                scene: { bg: 'meadow', time: 'day', items: [['rabbit', 200, 302, { s: 1.4 }]] }
            },
            {
                title: "R — Raketa",
                letter: "R r",
                text: "R — raketa. Raketa koinotga uchadi.",
                word: ["raketa", "Koinotga uchadigan uchar kema"],
                scene: { bg: 'space', time: 'night', items: [['rocket', 200, 300, { s: 1.3 }]] }
            },
            {
                title: "S — Sabzi",
                letter: "S s",
                text: "S — sabzi. Sabzi palovga ham, sho'rvaga ham solinadi.",
                word: ["sabzi", "Sariq yoki to'q sariq ildizmeva"],
                scene: { bg: 'field', time: 'day', items: [['sabzi', 200, 298, { n: 3, s: 1.6 }]] }
            },
            {
                title: "T — Tovuq",
                letter: "T t",
                text: "T — tovuq. Tovuq tuxum qo'yadi.",
                word: ["tovuq", "Tuxum qo'yadigan parranda"],
                scene: { bg: 'yard', time: 'day', items: [['hen', 200, 302, { s: 1.4 }]] }
            },
            {
                title: "U — Uy",
                letter: "U u",
                text: "U — uy. Uyimiz issiq va yorug'.",
                word: ["uy", "Odamlar yashaydigan joy"],
                question: { q: "Qaysi so'z «U» harfi bilan boshlanadi?", a: ["Uy", "Gul", "Non"], ok: 0 },
                scene: { bg: 'village', time: 'day', items: [['house', 200, 270, { s: 1.1 }]] }
            },
            {
                title: "V — Varrak",
                letter: "V v",
                text: "V — varrak. Shamolda varrak baland uchadi.",
                word: ["varrak", "Shamolda uchiriladigan qog'oz o'yinchoq"],
                scene: { bg: 'meadow', time: 'day', items: [['kite', 250, 90, { to: [-90, 210] }], ['kid1', 160, 304, { pose: 'hold', mood: 'joy' }]] }
            },
            {
                title: "X — Xo'roz",
                letter: "X x",
                text: "X — xo'roz. Xo'roz tongda «qu-qu-qu» deb qichqiradi.",
                word: ["xo'roz", "Tongda qichqiradigan parranda"],
                scene: { bg: 'yard', time: 'morning', items: [['rooster', 200, 302, { s: 1.4, crow: true }]] }
            },
            {
                title: "Y — Yulduz",
                letter: "Y y",
                text: "Y — yulduz. Kechasi osmonda yulduzlar charaqlaydi.",
                word: ["yulduz", "Kechasi osmonda porlaydigan nur"],
                scene: { bg: 'meadow', time: 'night', items: [['star', 120, 80, { r: 14 }], ['star', 210, 50, { r: 18 }], ['star', 300, 90, { r: 12 }], ['star', 260, 140, { r: 9 }]] }
            },
            {
                title: "Z — Zamburug'",
                letter: "Z z",
                text: "Z — zamburug'. Yomg'irdan keyin o'rmonda zamburug'lar o'sadi.",
                word: ["zamburug'", "Yomg'irdan keyin o'sadigan qalpoqli o'simlik"],
                scene: { bg: 'forest', time: 'day', items: [['mushroom', 150, 300, { s: 2.2 }], ['mushroom', 230, 304, { s: 1.6, color: '#c1121f' }], ['mushroom', 290, 300, { s: 2 }]] }
            },
            {
                title: "O' — O'rdak",
                letter: "O' o'",
                text: "O' — o'rdak. O'rdak ko'lda suzadi.",
                word: ["o'rdak", "Suvda suzadigan, yassi tumshuqli qush"],
                question: { q: "O' harfi qanday yoziladi?", a: ["O va belgi bilan: O'", "Ikkita O bilan", "U bilan"], ok: 0 },
                scene: { bg: 'lake', time: 'day', items: [['bird', 170, 290, { kind: 'duck', s: 2 }], ['bird', 260, 294, { kind: 'duck', s: 1.5, f: 1 }]] }
            },
            {
                title: "G' — G'oz",
                letter: "G' g'",
                text: "G' — g'oz. G'ozlar qatorlashib yurishadi.",
                word: ["g'oz", "Uzun bo'yinli, oq parranda"],
                scene: { bg: 'meadow', time: 'day', items: [['bird', 120, 302, { kind: 'goose', s: 1.8 }], ['bird', 200, 302, { kind: 'goose', s: 1.6 }], ['bird', 270, 302, { kind: 'goose', s: 1.4 }]] }
            },
            {
                title: "Sh — Shar",
                letter: "Sh sh",
                text: "Sh — shar. Bayramda rang-barang sharlar uchiramiz.",
                word: ["shar", "Havo bilan to'ldirilgan rangli o'yinchoq"],
                scene: { bg: 'meadow', time: 'day', items: [['shar', 210, 290, { n: 5 }], ['kid2', 210, 304, { pose: 'cheer', mood: 'joy' }]] }
            },
            {
                title: "Ch — Choynak",
                letter: "Ch ch",
                text: "Ch — choynak. Choynakda issiq choy damlanadi.",
                word: ["choynak", "Choy damlanadigan idish"],
                scene: { bg: 'room', time: 'day', items: [['dasturxon', 200, 302, { w: 170 }], ['teapot', 200, 294, { s: 2.2 }]] }
            },
            {
                title: "Ng — Dengiz",
                letter: "Ng ng",
                text: "Ng — bu harf so'z boshida kelmaydi. U so'zning o'rtasida yoki oxirida bo'ladi: dengiz, tong, ming.",
                word: ["dengiz", "Juda katta, sho'r suvli havza"],
                question: { q: "Ng harfi so'zning qayerida keladi?", a: ["O'rtasida yoki oxirida", "Faqat boshida", "Hech qayerida"], ok: 0 },
                scene: { bg: 'lake', time: 'morning', items: [['boat', 220, 290, { s: 1.2 }], ['bird', 120, 120, { kind: 'dove', fly: true, s: 1.2 }]] }
            },
            {
                title: "Tutuq belgisi",
                letter: "ʼ",
                text: "Bu — tutuq belgisi. U harf emas, so'zni bir lahza to'xtatadi: she'r, ma'no, a'lo.",
                word: ["she'r", "Qofiyali, ohangdor so'zlar"],
                scene: { bg: 'room', time: 'day', items: [['kid2', 200, 304, { pose: 'heart', mood: 'joy' }], ['bubble', 200, 140, { text: "She'r!" }], ['notes', 260, 190, {}]] }
            }
        ]
    }
});
