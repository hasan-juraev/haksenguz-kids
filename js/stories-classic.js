/*
 * Mumtoz adabiyot, Navoiy dostonlari va zamonaviy ertaklar.
 * Matnlar avvalgidek; har bir sahifaga alohida rasm (scene) qo'shilgan.
 */
window.storiesDatabase = window.storiesDatabase || {};

(function () {
    const YELLOW_DEV = { color: '#f7c948', dark: '#c99a1a', bellyColor: '#fff1b0', wings: true };
    const flyingKids = { riders: [['kid1', -46], ['kid2', 0], ['kid3', 46]] };

    Object.assign(window.storiesDatabase, {
        sariq_dev: {
            title: "Sariq devni minib",
            category: "classic",
            tag: "Xudoyberdi To'xtaboyev • Fantastik qissa",
            hue: "#a16207",
            moral: "Haqiqiy do'stlik va bilim — eng ulkan boylik.",
            cover: { bg: 'sky', time: 'dusk', items: [['dev', 200, 290, Object.assign({ s: 0.7, pose: 'up' }, YELLOW_DEV)], ['sparkles', 200, 120, { w: 200, h: 80, n: 8 }]] },
            pages: [
                {
                    title: "1. Sehrli Sandiq Topilmasi",
                    text: "Hoshimjon har kuni maktabdan kelib, bobosining eski sandig'ini ochishni yoqtirar edi. Bir kuni u yerda g'aroyib yaltiroq qog'ozga o'ralgan sirli buyum topib oldi.",
                    scene: { bg: 'room', time: 'night', items: [['chest', 140, 300, { glowing: true, dust: true }], ['hoshimjon', 250, 304, { pose: 'reach', mood: 'surprised', s: 1.15 }], ['lamp', 340, 246, {}], ['sparkles', 140, 230, { w: 70, h: 40 }]] },
                    question: { q: "Hoshimjon sandiqni ochishdan oldin nima qilishi kerak edi?", a: ["Bobosidan ruxsat so'rashi", "Hech kimga aytmasligi"], ok: 0 }
                },
                {
                    title: "2. Qanotli Sariq Devning Paydo Bo'lishi",
                    text: "Hoshimjon buyumga teginishi bilan xona ichida tillarang yorug'lik porlab, kulgili va do'stona sariq dev paydo bo'ldi! Dev o'zini tanishtirib, yordam berishga tayyorligini aytdi.",
                    scene: { bg: 'room', time: 'night', items: [['rays', 270, 170, { r: 130 }], ['dev', 270, 306, Object.assign({ s: 0.72, mood: 'joy' }, YELLOW_DEV)], ['hoshimjon', 110, 304, { pose: 'up', mood: 'surprised', s: 1.1 }]] }
                },
                {
                    title: "3. Bulutlar Uzra Ajoyib Parvoz",
                    text: "Sariq dev Hoshimjonni yelkasiga mindirib, osmonfalak bo'ylab bulutlar uzra uchib ketdi. Ular yulduzlar bilan salomlashib, oy shariga yaqinlashdilar.",
                    scene: { bg: 'sky', time: 'night', moonAt: [330, 64], items: [['dev', 196, 300, Object.assign({ s: 0.66, pose: 'up', mood: 'joy', rot: -6 }, YELLOW_DEV)], ['hoshimjon', 246, 226, { seated: true, legLen: 14, s: 0.7, pose: 'cheer', mood: 'joy' }], ['starkid', 80, 110, { s: 0.6 }]] },
                    question: { q: "Siz sehrli dev bilan qayerga uchgan bo'lardingiz?", a: ["Yulduzlar sari", "Samarqand va Buxoro osmoniga"], ok: -1 }
                },
                {
                    title: "4. Haqiqiy Do'stlik Imtihoni",
                    text: "Sarguzashtlar davomida Hoshimjon har qanday qiyinchilikda ham haqiqiy do'stlik va ahillik eng ulkan boylik ekanligini chuqur anglab etdi.",
                    scene: { bg: 'meadow', time: 'sunset', rainbow: true, items: [['dev', 270, 306, Object.assign({ s: 0.72, mood: 'joy' }, YELLOW_DEV)], ['hoshimjon', 140, 304, { pose: 'wave', mood: 'joy', s: 1.1 }], ['hearts', 206, 150, {}]] }
                },
                {
                    title: "5. Uyga Qaytish va Xulosa",
                    text: "Tong otgach, Hoshimjon yana o'z xonasiga qaytdi. Biroq bu sarguzasht uning qalbida o'chmas xotira va bilimdonlik qoldirdi.",
                    scene: { bg: 'room', time: 'morning', items: [['hoshimjon', 190, 304, { pose: 'cheer', mood: 'joy', s: 1.15 }], ['chest', 320, 300, {}], ['sparkles', 320, 240, { w: 50, h: 30, n: 3 }]] }
                }
            ]
        },

        navoiy_farhod: {
            title: "Farhod va Shirin",
            category: "navoiy",
            tag: "Alisher Navoiy • Doston",
            hue: "#1e3a8a",
            moral: "Sabr, sadoqat va mehnatsevarlik — dostonning abadiy sabog'i.",
            cover: { bg: 'mountains', time: 'morning', items: [['horse', 200, 300, { rider: 'farhod', saddle: '#1d4ed8' }]] },
            pages: [
                {
                    title: "1. Farhodning Ilmga Intilishi",
                    text: "Yosh shahzoda Farhod dunyo sirlarini, ilm-fan va hunarlarni egallashga o'ta qiziqardi. Uning qo'lidan kelmaydigan hunar yo'q edi.",
                    scene: { bg: 'garden', time: 'day', season: 'spring', items: [['tree', 70, 260, { kind: 'apricot' }], ['palace', 320, 252, { s: 0.5 }], ['farhod', 190, 302, { pose: 'hold', hold: 'book' }]] },
                    question: { q: "Farhod nimaga intilardi?", a: ["Ilm va hunar o'rganishga", "Faqat o'yinga"], ok: 0 }
                },
                {
                    title: "2. Behistun Tog'iga Safar",
                    text: "Elga suv chiqarish va odamlarga yordam berish maqsadida Farhod ulkan Behistun tog'i tomon safarga otlandi va ishga kirishdi.",
                    scene: { bg: 'mountains', time: 'morning', items: [['horse', 200, 300, { rider: 'farhod', saddle: '#1d4ed8', walk: true }]] }
                },
                {
                    title: "3. Matonat va Mehnat",
                    text: "Farhod o'zining temir irodasi va sabr-toqati bilan tog'ni yorib, xalq uchun ariq qazishga muvaffaq bo'ldi.",
                    scene: { bg: 'mountains', time: 'day', items: [['rock', 280, 304, { big: true }], ['gush', 330, 296, { s: 0.8 }], ['farhod', 170, 302, { pose: 'wave', hold: 'pickaxe', mood: 'angry' }], ['dust', 244, 300]] },
                    question: { q: "Katta ishni oxiriga yetkazish uchun nima kerak?", a: ["Sabr va mehnat", "Faqat omad"], ok: 0 }
                },
                {
                    title: "4. Ezgulik Tantonasi",
                    text: "Uning mehnati va olijanobligi butun o'lka bo'ylab dong tarqatdi, barcha unga hurmat ko'rsatdi.",
                    scene: { bg: 'river', time: 'day', season: 'spring', fx: ['confetti'], items: [['farhod', 200, 300, { pose: 'cheer', mood: 'joy' }], ['kid1', 100, 304, { pose: 'cheer', mood: 'joy' }], ['ona', 300, 302, { mood: 'joy' }]] }
                },
                {
                    title: "5. Hikmatli Yakun",
                    text: "Farhod va Shirin dostoni avlodlarga sabr, sadoqat va mehnatsevarlik sabog'ini o'rgatdi.",
                    scene: { bg: 'mountains', time: 'sunset', items: [['bigbook', 200, 296, { s: 1.1 }], ['sparkles', 200, 200, { w: 180, h: 60 }]] }
                }
            ]
        },

        navoiy_lison: {
            title: "Lison ut-tayr (Qushlar tili)",
            category: "navoiy",
            tag: "Alisher Navoiy • Falsafiy doston",
            hue: "#0369a1",
            moral: "Haqiqiy go'zallik va hikmat — birga intilish va o'zini anglashda.",
            cover: { bg: 'sky', time: 'sunset', items: [['simurg', 200, 250, { s: 0.95 }]] },
            pages: [
                {
                    title: "1. Qushlarning Kengashi",
                    text: "Dunyo qushlari o'zlariga adolatli podshoh — Simurg'ni topish uchun yig'ilib, muhim kengash o'tkazdilar.",
                    scene: { bg: 'meadow', time: 'day', items: [['tree', 200, 262, { kind: 'big' }], ['bird', 200, 304, { kind: 'hoopoe', s: 1.8 }], ['bird', 110, 300, { kind: 'dove', s: 1.4 }], ['bird', 150, 310, { kind: 'bluebird', s: 1.3 }], ['bird', 260, 310, { kind: 'robin', s: 1.3, f: 1 }], ['bird', 300, 298, { kind: 'swallow', s: 1.4, f: 1 }], ['bird', 340, 306, { kind: 'gold', s: 1.3, f: 1 }]] }
                },
                {
                    title: "2. Hudxudning Yo'l-yo'riqi",
                    text: "Donishmand Hudxud qushlarga uzoq va mashaqqatli safar haqida so'zlab, ularga yo'lboshchilik qilishga rozi bo'ldi.",
                    scene: { bg: 'mountains', time: 'morning', items: [['rock', 200, 306, { big: true, s: 0.9 }], ['bird', 204, 262, { kind: 'hoopoe', s: 2.2 }], ['bird', 80, 304, { kind: 'dove', s: 1.4 }], ['bird', 320, 304, { kind: 'bluebird', s: 1.4, f: 1 }], ['bird', 360, 300, { kind: 'robin', s: 1.3, f: 1 }]] },
                    question: { q: "Yaxshi yo'lboshchi qanday bo'ladi?", a: ["Dono va g'amxo'r", "Faqat baland ovozli"], ok: 0 }
                },
                {
                    title: "3. Yetti Vodiydan O'tish",
                    text: "Safar davomida qushlar ishq, ma'rifat va sabr kabi yetti qiyin vodiydan o'zaro hamjihatlikda o'tdilar.",
                    scene: { bg: 'mountains', time: 'sunset', items: [['bird', 90, 130, { kind: 'hoopoe', fly: true, s: 1.4 }], ['bird', 150, 100, { kind: 'dove', fly: true, s: 1.2 }], ['bird', 210, 130, { kind: 'bluebird', fly: true, s: 1.2 }], ['bird', 270, 96, { kind: 'swallow', fly: true, s: 1.2 }], ['bird', 330, 126, { kind: 'gold', fly: true, s: 1.2 }]] }
                },
                {
                    title: "4. O'zini Anglash",
                    text: "Qushlar maqsad sari intilib, o'z qalblaridagi kamchiliklarni bartaraf etdilar va ma'nan ulg'aydilar.",
                    scene: { bg: 'lake', time: 'dusk', items: [['bird', 130, 290, { kind: 'hoopoe', s: 1.6 }], ['bird', 270, 290, { kind: 'dove', s: 1.5, f: 1 }], ['sparkles', 200, 268, { w: 200, h: 20 }]] }
                },
                {
                    title: "5. Ulug' Maqsad",
                    text: "Ular haqiqiy go'zallik va do'stlikning qadriga yetib, buyuk hikmatga muyassar bo'ldilar.",
                    scene: { bg: 'sky', time: 'day', items: [['rays', 200, 180, { r: 150 }], ['simurg', 200, 250, { s: 0.95 }], ['bird', 70, 100, { kind: 'dove', fly: true, s: 1.2 }], ['bird', 340, 90, { kind: 'bluebird', fly: true, s: 1.2, f: 1 }]] }
                }
            ]
        },

        qodiriy_o_tkan: {
            title: "O'tkan kunlar (Bolalar talqini)",
            category: "classic",
            tag: "Abdulla Qodiriy • Klassik roman",
            hue: "#9f1239",
            moral: "Ilm, sadoqat va vatanga muhabbat — ajdodlardan qolgan eng qimmat meros.",
            cover: { bg: 'city', time: 'sunset', items: [['horse', 200, 300, { color: '#6b4226', rider: 'otabek', saddle: '#c1121f' }]] },
            pages: [
                {
                    title: "1. Qadimgi Toshkent",
                    text: "O'tmishdagi ko'hna va go'zal Toshkent ko'chalarida gavjum bozorlar va xalqona muhit hukmron edi.",
                    scene: { bg: 'bazaar', time: 'day', items: [['stall', 80, 300, {}], ['stall', 320, 300, { color: '#2a9d8f' }], ['dost', 190, 302, {}], ['kid4', 250, 304, { mood: 'joy' }]] }
                },
                {
                    title: "2. Otabekning Ezgu ishlari",
                    text: "Mard va olijanob yigit Otabek el-yurt tinchligi va adolati yo'lida doimo oldingi safda edi.",
                    scene: { bg: 'city', time: 'morning', items: [['horse', 200, 300, { color: '#6b4226', rider: 'otabek', saddle: '#c1121f' }]] }
                },
                {
                    title: "3. Do'stlik va Sadoqat",
                    text: "Otabekning yaqin do'stlari bilan qat'iy ahdlashuvi barchaga sadoqat namunasi bo'lib xizmat qildi.",
                    scene: { bg: 'city', time: 'day', items: [['otabek', 160, 302, { pose: 'reach', mood: 'joy' }], ['dost', 250, 302, { pose: 'reach', mood: 'joy', f: 1 }], ['hearts', 205, 150, {}]] },
                    question: { q: "Sadoqatli do'st qanday bo'ladi?", a: ["So'zining ustidan chiqadi", "Qiyin paytda tashlab ketadi"], ok: 0 }
                },
                {
                    title: "4. Ilm va Ma'rifat",
                    text: "Asarda yoshlarga ilm olish, ota-onasini hurmat qilish va vatanni sevish g'oyalari targ'ib etiladi.",
                    scene: { bg: 'room', time: 'day', items: [['otabek', 200, 302, { pose: 'hold', hold: 'book' }], ['lamp', 320, 250, {}]] }
                },
                {
                    title: "5. Xotira",
                    text: "Qodiriy qoldirgan meros xalqimiz qalbidan mangu joy oldi.",
                    scene: { bg: 'city', time: 'sunset', items: [['palace', 200, 256, { s: 0.7 }], ['sparkles', 200, 90, { w: 200, h: 60 }]] }
                }
            ]
        },

        sehrli_olma: {
            title: "Sehrli Olma",
            category: "modern",
            tag: "Zamonaviy ertak • Mehr-oqibat",
            hue: "#047857",
            moral: "Saxovatli bo'lish har doim baxt keltiradi.",
            cover: { bg: 'garden', season: 'spring', items: [['tree', 200, 266, { kind: 'gold', s: 1.3 }], ['sparkles', 200, 150, { w: 140, h: 80 }]] },
            pages: [
                {
                    title: "1. Oltin Olma",
                    text: "Sehrli bog'da faqat ezgu niyatli bolalarga ochiladigan oltin olma daraxti bor edi.",
                    scene: { bg: 'garden', time: 'morning', season: 'spring', items: [['tree', 220, 268, { kind: 'gold', s: 1.3 }], ['kid3', 110, 304, { mood: 'surprised', s: 1.1 }], ['sparkles', 220, 150, { w: 140, h: 80 }]] }
                },
                {
                    title: "2. Do'stlar Bilan Bo'lishish",
                    text: "Beshikdagi bolakay olmani yolg'iz o'zi emas, balki barcha do'stlari bilan bo'lishishga qaror qildi.",
                    scene: { bg: 'garden', time: 'day', season: 'spring', items: [['kid3', 200, 304, { pose: 'hold', hold: 'goldapple', mood: 'joy', s: 1.1 }], ['kid1', 110, 304, { pose: 'reach', mood: 'joy' }], ['kid2', 290, 304, { pose: 'reach', mood: 'joy' }]] },
                    question: { q: "Mazali narsani nima qilgan yaxshi?", a: ["Do'stlar bilan bo'lishgan", "Yolg'iz yegan"], ok: 0 }
                },
                {
                    title: "3. Sehrli Quvvat",
                    text: "Olmaning bo'lishilgan har bir bo'lagi qishloqqa quvonch va farovonlik olib keldi.",
                    scene: { bg: 'village', time: 'sunset', fx: ['sparkle'], items: [['rays', 200, 180, { r: 130 }], ['kid1', 140, 304, { pose: 'cheer', mood: 'joy' }], ['kid3', 210, 304, { pose: 'cheer', mood: 'joy' }], ['kid2', 280, 304, { pose: 'cheer', mood: 'joy' }]] }
                },
                {
                    title: "4. Ahillik",
                    text: "Bolalar birdamlik qanchalik buyuk kuch ekanini tushunib etdilar.",
                    scene: { bg: 'meadow', time: 'day', season: 'spring', items: [['kid1', 110, 304, { pose: 'reach', mood: 'joy' }], ['kid2', 170, 304, { pose: 'reach', mood: 'joy' }], ['kid3', 230, 304, { pose: 'reach', mood: 'joy' }], ['kid4', 290, 304, { pose: 'reach', mood: 'joy' }], ['hearts', 200, 160, {}]] }
                },
                {
                    title: "5. Yakun",
                    text: "Saxovatli bo'lish har doim baxt keltiradi.",
                    scene: { bg: 'garden', time: 'day', season: 'spring', sun: false, items: [['sun', 90, 80, { r: 28 }], ['tree', 290, 268, { kind: 'gold', s: 1.1 }], ['kid2', 170, 304, { pose: 'wave', mood: 'joy' }]] }
                }
            ]
        },

        oy_qiz: {
            title: "Oyqiz Sirlari",
            category: "modern",
            tag: "Fantastika • Sehr",
            hue: "#4338ca",
            moral: "Orzular sari intilish har doim go'zal.",
            cover: { bg: 'meadow', time: 'night', items: [['beam', 200, 300, { h: 300, w: 80 }], ['oyqiz', 200, 250, { pose: 'wave', s: 1.2 }]] },
            pages: [
                {
                    title: "1. Oydan Mehmon",
                    text: "Kechasi osmondan Yerga yorug' nur taratib sirli Oyqiz tushib keldi.",
                    scene: { bg: 'village', time: 'night', items: [['beam', 200, 300, { h: 300, w: 80 }], ['oyqiz', 200, 226, { pose: 'wave', s: 1.1 }], ['sparkles', 200, 150, { w: 120, h: 100, n: 8 }]] }
                },
                {
                    title: "2. Yulduzlar Sayri",
                    text: "Oyqiz bolalarga yulduzlar olami haqida qiziqarli ertaklar aytib berdi.",
                    scene: { bg: 'meadow', time: 'night', fx: ['fireflies'], items: [['oyqiz', 200, 296, { pose: 'reach' }], ['kid1', 100, 306, { noLegs: true, mood: 'joy' }], ['kid2', 300, 306, { noLegs: true, mood: 'joy' }]] },
                    question: { q: "Siz yulduzlar haqida nimani bilasiz?", a: ["Ular juda uzoqda porlaydi", "Ular daraxtda o'sadi"], ok: 0 }
                },
                {
                    title: "3. Yordam",
                    text: "Bolalar Oyqizga o'z sayyorasiga qaytishda ko'maklashdilar.",
                    scene: { bg: 'meadow', time: 'night', items: [['rocket', 280, 300, { s: 1.2 }], ['oyqiz', 170, 300, { pose: 'wave' }], ['kid3', 90, 304, { pose: 'cheer', mood: 'joy' }]] }
                },
                {
                    title: "4. Xotira",
                    text: "Osmon yulduzlari har doim bolalarga bu sarguzashtni eslatib turdi.",
                    scene: { bg: 'meadow', time: 'night', items: [['kid1', 150, 304, { pose: 'point', mood: 'joy' }], ['kid2', 220, 304, { mood: 'joy' }], ['star', 120, 70, { r: 12 }], ['star', 200, 50, { r: 9 }], ['star', 270, 80, { r: 11 }], ['starkid', 330, 110, { s: 0.5 }]] }
                },
                {
                    title: "5. Yakun",
                    text: "Orzular sari intilish har doim go'zal.",
                    scene: { bg: 'peak', time: 'night', items: [['telescope', 240, 272, {}], ['kid3', 170, 282, { mood: 'joy', pose: 'point' }], ['rocket', 330, 90, { s: 0.4, rot: 30 }]] }
                }
            ]
        },

        yulduz_bola: {
            title: "Yulduz Bola",
            category: "modern",
            tag: "Zamonaviy ertak • Mehribonlik",
            hue: "#ca8a04",
            moral: "Qalbdagi mehribonlik yulduzdek porlab turadi.",
            cover: { bg: 'meadow', time: 'night', items: [['starkid', 200, 220, { s: 1.4 }]] },
            pages: [
                {
                    title: "1. Kichik Yulduz",
                    text: "Osmonchadan tushgan kichik yulduzcha bolajonlar davrasiga qo'shildi.",
                    scene: { bg: 'village', time: 'night', items: [['starkid', 200, 190, { s: 1.1 }], ['kid1', 110, 304, { mood: 'surprised' }], ['kid4', 300, 304, { pose: 'point', mood: 'joy' }]] }
                },
                {
                    title: "2. Nur Ulashish",
                    text: "Yulduzcha o'zining mehribon nuri bilan barchaning qalbini iliqlatdi.",
                    scene: { bg: 'village', time: 'night', items: [['rays', 200, 190, { r: 140 }], ['starkid', 200, 210, { s: 1 }], ['house', 70, 262, { night: true, s: 0.8 }], ['kid2', 300, 304, { mood: 'joy', pose: 'heart' }]] }
                },
                {
                    title: "3. Do'stlik",
                    text: "Qishloq bolalari yulduzcha bilan birga o'ynab, quvnoq kun o'tkazdilar.",
                    scene: { bg: 'meadow', time: 'day', season: 'spring', items: [['starkid', 220, 230, { s: 0.8 }], ['kite', 110, 90, { to: [-10, 200] }], ['kid1', 110, 304, { pose: 'wave', mood: 'joy' }], ['kid3', 310, 304, { pose: 'cheer', mood: 'joy' }]] },
                    question: { q: "Yangi do'stni qanday kutib olamiz?", a: ["Uni o'yinga qo'shib, mehr ko'rsatamiz", "Unga e'tibor bermaymiz"], ok: 0 }
                },
                {
                    title: "4. Qaytish",
                    text: "Tongotar payti yulduzcha osmonga qaytib, bolalarga qo'l siltadi.",
                    scene: { bg: 'meadow', time: 'morning', items: [['starkid', 270, 110, { s: 0.7 }], ['kid1', 140, 304, { pose: 'wave', mood: 'happy' }], ['kid2', 200, 304, { pose: 'wave', mood: 'happy' }]] }
                },
                {
                    title: "5. Saboq",
                    text: "Qalbdagi mehribonlik yulduzdek porlab turadi.",
                    scene: { bg: 'meadow', time: 'night', fx: ['sparkle'], items: [['kid2', 200, 304, { glow: true, pose: 'heart', mood: 'joy', s: 1.2 }], ['hearts', 200, 160, {}]] }
                }
            ]
        },

        sirli_sandiq: {
            title: "Buvijonning Sandig'i",
            category: "classic",
            tag: "Milliy qadriyatlar",
            hue: "#be123c",
            moral: "Milliy qadriyatlarimiz — ajdodlarimizdan qolgan bebaho meros.",
            cover: { bg: 'room', items: [['chest', 200, 300, { state: 'clothes', w: 90, h: 56 }], ['sparkles', 200, 220, { w: 100, h: 50 }]] },
            pages: [
                {
                    title: "1. Qadimiy Sandiq",
                    text: "Buvijonning sandig'idan milliy do'ppi, zardo'p to'nlar va qadimiy buyumlar chiqdi.",
                    scene: { bg: 'room', time: 'day', items: [['chest', 170, 302, { state: 'clothes', w: 86, h: 52 }], ['buvi', 282, 302, { pose: 'point', f: 1 }], ['kid1', 76, 304, { mood: 'surprised' }]] }
                },
                {
                    title: "2. Tarix",
                    text: "Buvijon bolalarga o'tmishdagi milliy qadriyatlarimiz haqida hikoya qilib berdi.",
                    scene: { bg: 'room', time: 'day', items: [['buvi', 200, 298, { noLegs: true, pose: 'reach' }], ['kid1', 90, 306, { noLegs: true, mood: 'joy' }], ['kid2', 310, 306, { noLegs: true, mood: 'joy' }], ['bubble', 200, 120, { text: "Qadim zamonda...", to: [0, 40] }]] }
                },
                {
                    title: "3. Hurmat",
                    text: "Bolalar o'z tariximizga hurmat ko'rsatib, milliy an'analarni o'rgandilar.",
                    scene: { bg: 'room', time: 'day', items: [['kid1', 150, 304, { pose: 'cheer', mood: 'joy', s: 1.1 }], ['kid4', 250, 304, { pose: 'wave', mood: 'joy', s: 1.1 }], ['sparkles', 200, 170, { w: 160, h: 60 }]] },
                    question: { q: "Milliy an'analarni nega asrash kerak?", a: ["Ular bizning tariximiz va faxrimiz", "Keraksiz narsalar"], ok: 0 }
                },
                {
                    title: "4. Meros",
                    text: "Ajdodlar merosi bizning faxrimizdir.",
                    scene: { bg: 'city', time: 'day', items: [['palace', 230, 262, { s: 0.8 }], ['kid1', 70, 304, { pose: 'point', mood: 'joy' }]] }
                },
                {
                    title: "5. Yakun",
                    text: "Milliy qadriyatlarimiz mangu yashaydi.",
                    scene: { bg: 'yard', time: 'sunset', items: [['buvi', 150, 302, { mood: 'joy' }], ['ona', 230, 302, { mood: 'joy' }], ['kid2', 300, 304, { pose: 'cheer', mood: 'joy' }], ['hearts', 200, 150, {}]] }
                }
            ]
        },

        shox_va_dehqon: {
            title: "Shoh va Dehqon",
            category: "navoiy",
            tag: "Sharq hikmati • Adolat",
            hue: "#7c2d12",
            moral: "Adolat va mehnat — davlat ustuni.",
            cover: { bg: 'field', time: 'sunset', items: [['wheat', 80, 304, { n: 9 }], ['shoh', 170, 302, {}], ['dehqon2', 250, 302, { pose: 'reach' }]] },
            pages: [
                {
                    title: "1. Adolat Izlab",
                    text: "Donishmand dehqon shoh huzuriga kelib, mehnatning qadri haqida gapirdi.",
                    scene: { bg: 'palace', items: [['throne', 256, 290, { rider: 'shoh' }], ['dehqon2', 110, 304, { pose: 'heart', hold: null }]] }
                },
                {
                    title: "2. Maslahat",
                    text: "Shoh dehqonning oqilona so'zlariga quloq solib, adolatli qonunlar tuzdi.",
                    scene: { bg: 'palace', items: [['shoh', 250, 304, { pose: 'hold', hold: 'scroll' }], ['dehqon2', 120, 304, { pose: 'point', hold: null }]] },
                    question: { q: "Yaxshi rahbar nima qiladi?", a: ["Xalqning so'zini tinglaydi", "Hech kimni tinglamaydi"], ok: 0 }
                },
                {
                    title: "3. Farovonlik",
                    text: "El-yurtda tinchlik va farovonlik hukm sura boshladi.",
                    scene: { bg: 'field', time: 'day', season: 'summer', items: [['wheat', 80, 304, { n: 9 }], ['wheat', 320, 304, { n: 9 }], ['dehqon2', 200, 302, { mood: 'joy' }]] }
                },
                {
                    title: "4. Hurmat",
                    text: "Mehnatkash insonlar har doim ulug'landi.",
                    scene: { bg: 'village', time: 'day', fx: ['confetti'], items: [['dehqon2', 200, 302, { mood: 'joy' }], ['kid1', 110, 304, { pose: 'cheer', mood: 'joy' }], ['kid4', 290, 304, { pose: 'cheer', mood: 'joy' }]] }
                },
                {
                    title: "5. Saboq",
                    text: "Adolat va mehnat — davlat ustuni.",
                    scene: { bg: 'field', time: 'sunset', items: [['wheat', 70, 304, { n: 9 }], ['shoh', 170, 302, {}], ['dehqon2', 250, 302, { pose: 'reach', hold: null }]] }
                }
            ]
        },

        sehrli_gilam: {
            title: "Sehrli Gilam Sayohati",
            category: "modern",
            tag: "Fantastik sarguzasht",
            hue: "#0f766e",
            moral: "Tariximizni o'rganish va sayohat qilish maroqli.",
            cover: { bg: 'city', time: 'day', items: [['carpet', 200, 150, flyingKids]] },
            pages: [
                {
                    title: "1. Uchuvchi Gilam",
                    text: "Bolalar sehrli gilamga o'tirib Samarqand va Buxoro osmoni uzra parvoz qilishdi.",
                    scene: { bg: 'city', time: 'day', items: [['carpet', 200, 150, flyingKids]] }
                },
                {
                    title: "2. Tarixiy Obidalar",
                    text: "Registon maydoni va ko'hna minoralar osmondan juda go'zal ko'rinar edi.",
                    scene: { bg: 'city', time: 'morning', items: [['palace', 200, 300, { s: 1.05 }], ['carpet', 320, 80, Object.assign({ s: 0.55 }, flyingKids)]] },
                    question: { q: "Registon qaysi shaharda joylashgan?", a: ["Samarqandda", "Toshkentda"], ok: 0 }
                },
                {
                    title: "3. Sarguzasht",
                    text: "Samoviy sayohat bolalarga unutilmas taassurotlar bag'ishladi.",
                    scene: { bg: 'sky', time: 'day', items: [['carpet', 200, 190, flyingKids], ['bird', 80, 90, { kind: 'dove', fly: true, s: 1.3 }], ['bird', 330, 110, { kind: 'swallow', fly: true, s: 1.2, f: 1 }]] }
                },
                {
                    title: "4. Qaytish",
                    text: "Kechki payt gilam sekin pastlab, bolalarni o'z uyiga olib keldi.",
                    scene: { bg: 'village', time: 'dusk', items: [['house', 300, 262, { night: true }], ['carpet', 160, 268, flyingKids]] }
                },
                {
                    title: "5. Saboq",
                    text: "Tariximizni o'rganish va sayohat qilish maroqli.",
                    scene: { bg: 'room', time: 'day', items: [['bigbook', 200, 290, {}], ['kid1', 90, 304, { mood: 'joy' }], ['kid2', 310, 304, { mood: 'joy' }]] }
                }
            ]
        }
    });
})();
