/*
 * O'zbek xalq ertaklari — bolalar uchun qayta hikoya qilingan to'liq matnlar.
 *
 * Har bir sahifa: title, text, scene (js/art rasm tavsifi) va ixtiyoriy
 *   question: { q, a: [javoblar], ok: to'g'ri javob indeksi }
 *   word:     [so'z, ma'nosi]  — "Yangi so'z" kartochkasi
 * Kitob darajasida: moral (xulosa), quiz (yakuniy test), hue (muqova rangi).
 */
window.storiesDatabase = window.storiesDatabase || {};

Object.assign(window.storiesDatabase, {
    zumrad: {
        title: "Zumrad va Qimmat",
        category: "folk",
        tag: "O'zbek xalq ertagi • Odob va mehnat",
        hue: "#1f7a58",
        moral: "Mehnatsevarlik va shirin so'z insonni baxtga yetaklaydi, dangasalik va qo'pollik esa pushaymonlik keltiradi.",
        cover: { bg: 'hut', time: 'dusk', fx: ['fireflies'], items: [['hut', 290, 262, { lit: true, s: 1.1 }], ['tree', 60, 268, { s: 1.1 }], ['zumrad', 170, 300, { pose: 'hold', hold: 'chest', mood: 'joy', s: 1.15 }], ['sparkles', 170, 230, { w: 70, h: 40 }]] },
        quiz: {
            q: "Nima uchun Zumrad baxtli bo'ldi-yu, Qimmat pushaymon bo'ldi?",
            a: ["Zumrad mehnatkash, odobli va kamtar edi, Qimmat esa dangasa va qo'pol edi", "Zumradning omadi kelib qoldi", "Qimmat o'rmonda adashib qoldi"],
            ok: 0
        },
        pages: [
            {
                title: "Bir bor ekan, bir yo'q ekan...",
                text: "Qadim zamonda bir qishloqda keksa chol yashar ekan. Uning Zumrad ismli qizi bor ekan. Zumradning onasi vafot etgach, chol boshqa xotinga uylanibdi. O'gay onaning ham o'z qizi bor ekan, uning ismi Qimmat ekan.",
                scene: { bg: 'village', time: 'morning', season: 'spring', items: [['house', 92, 256, { s: 0.85, porch: 26 }], ['tree', 338, 258, { kind: 'apricot' }], ['flowers', 120, 304, { w: 70 }], ['chol', 190, 300, { mood: 'happy' }], ['zumrad', 258, 302, { pose: 'wave', mood: 'joy', s: 1.1 }], ['hen', 322, 300, { s: 0.8 }]] }
            },
            {
                title: "Mehnatkash Zumrad",
                text: "Zumrad tong saharda turib hovlini supurar, suv tashir, tandirda non yopar ekan. Qimmat esa kun bo'yi so'rida cho'zilib yotarkan. O'gay ona o'z qizini erkalab, Zumradni esa ko'rarga ko'zi yo'q ekan.",
                scene: { bg: 'yard', time: 'morning', gateX: false, items: [['soru', 105, 292, { w: 150 }], ['qimmat', 105, 262, { noLegs: true, mood: 'sleep', tilt: 14, s: 1.0 }], ['zumrad', 248, 302, { pose: 'sweep', hold: 'broom', s: 1.1 }], ['dust', 232, 304], ['tandir', 350, 294, { bread: false }], ['hen', 300, 304, { s: 0.7, f: 1 }]] },
                question: { q: "Zumradning qaysi fazilati sizga yoqdi?", a: ["Mehnatsevarligi", "Kun bo'yi uxlashi"], ok: 0 },
                word: ["tandir", "Loydan yasalgan, non yopiladigan o'choq"]
            },
            {
                title: "O'gay onaning buyrug'i",
                text: "Bir kuni o'gay ona cholga qattiq buyuribdi: «Zumradni olib borib, uzoq o'rmonga tashlab kel!» Chol qizini jonidan ortiq yaxshi ko'rsa ham, xotinidan qo'rqib, ko'z yoshini yashirgancha «xo'p» debdi.",
                scene: { bg: 'yard', time: 'sunset', items: [['ogayona', 105, 302, { pose: 'point', mood: 'angry' }], ['chol', 235, 302, { mood: 'sad' }], ['zumrad', 318, 304, { mood: 'sad', s: 1.1 }], ['mark', 140, 150, { ch: '!', color: '#9d4edd' }]] }
            },
            {
                title: "O'rmon chetida",
                text: "Chol qizini aravaga o'tqazib, o'rmon chetiga olib boribdi. «Qizim, shu yerda o'tin terib tur, men hozir qaytaman», debdi-yu, yig'lab ortga qaytibdi. Zumrad kutaveribdi, kutaveribdi — kun botib, qorong'i tushibdi.",
                scene: { bg: 'forest', time: 'sunset', season: 'autumn', fx: ['leaves'], items: [['arava', 236, 290, { rider: 'chol', riderOpts: { mood: 'cry' }, puller: 'donkey', s: 0.72 }], ['tree', 44, 262, { season: 'autumn', s: 1.1 }], ['zumrad', 118, 302, { pose: 'wave', mood: 'sad', s: 1.1 }], ['sticks', 70, 306, { s: 0.8 }]] }
            },
            {
                title: "Uzoqdagi chiroq",
                text: "Qo'rqib ketgan Zumrad yo'l izlab o'rmon ichiga kiribdi. Birdan daraxtlar orasida miltillagan chiroqni ko'ribdi. Yaqinroq borsa, kichkina kulba ekan. U eshikni sekingina taqillatibdi.",
                scene: { bg: 'forest', time: 'night', fx: ['fireflies'], items: [['tree', 50, 266, { s: 1.15 }], ['owl', 62, 176, { s: 0.9 }], ['hut', 292, 262, { lit: true }], ['zumrad', 158, 302, { mood: 'scared', pose: 'hold', hold: 'sticks', s: 1.1 }]] },
                question: { q: "Qorong'ida adashib qolsangiz, nima qilgan ma'qul?", a: ["Kattalardan yordam so'rash", "Yolg'iz qorong'i yo'lga yugurish"], ok: 0 }
            },
            {
                title: "Mehribon momo",
                text: "Eshikni oppoq sochli, nuroniy bir momo ochibdi. Zumrad qo'lini ko'ksiga qo'yib: «Assalomu alaykum, momojon!» — deb ta'zim qilibdi. Momo qizning odobidan suyunib: «Va alaykum assalom, bolam, kiraqol», — debdi.",
                scene: { bg: 'hut', time: 'night', items: [['hut', 280, 292, { lit: true, s: 1.45 }], ['momo', 262, 304, { pose: 'reach', hold: 'lamp' }], ['zumrad', 120, 304, { pose: 'heart', mood: 'happy', tilt: 8, s: 1.1 }], ['bubble', 132, 150, { text: "Assalomu alaykum!", size: 12, to: [-10, 36] }]] },
                question: { q: "Kattalar bilan qanday salomlashamiz?", a: ["Indamay o'tib ketamiz", "Odob bilan «Assalomu alaykum» deymiz"], ok: 1 },
                word: ["nuroniy", "Yuzidan nur yog'ilib turgan, mehribon keksa inson"]
            },
            {
                title: "Chin dildan xizmat",
                text: "Ertasi kuni Zumrad erta turib, kulbani supurib-sidiribdi, buloqdan suv tashib, mazali osh pishiribdi. Kechqurun momoning sochlarini tarab, unga qo'shiq aytib beribdi. U har ishni xursand bo'lib, chin dildan qilibdi.",
                scene: { bg: 'hutin', time: 'day', items: [['qozon', 150, 296, { content: 'osh' }], ['zumrad', 238, 304, { pose: 'hold', hold: 'bowl', mood: 'joy', s: 1.1 }], ['momo', 336, 304, { mood: 'joy', cane: true }], ['notes', 268, 176, {}]] }
            },
            {
                title: "Sandiq tanlash",
                text: "Uch kun o'tgach momo: «Barakalla, qizim! Endi uyingga qayt. Anavi sandiqlardan birini ol», — debdi. Xonada katta-kichik, chiroyli sandiqlar ko'p ekan. Zumrad eng kichkina, eng oddiy sandiqni tanlab: «Menga shunisi ham yetadi», — debdi.",
                scene: { bg: 'hutin', time: 'day', items: [['chest', 70, 304, { w: 92, h: 58, color: '#7b2cbf' }], ['chest', 160, 304, { w: 70, h: 46, color: '#1d4ed8' }], ['zumrad', 252, 304, { pose: 'hold', hold: 'chest', mood: 'happy', s: 1.1 }], ['momo', 340, 304, { pose: 'point', f: 1, cane: false }], ['sparkles', 252, 236, { w: 50, h: 30, n: 4 }]] },
                question: { q: "Nega Zumrad eng kichik sandiqni tanladi?", a: ["U kamtar va ochko'z emas edi", "Katta sandiqni ko'tarolmadi"], ok: 0 },
                word: ["sandiq", "Kiyim va qimmatbaho buyumlar saqlanadigan bezakli quti"]
            },
            {
                title: "Sandiq to'la oltin!",
                text: "Zumrad uyiga yaqinlashganda it hurib: «Vov-vov! Zumrad kelyapti, sandiq to'la oltin olib kelyapti!» — debdi. Sandiqni ochishsa — ichi to'la oltin, marjon va qimmatbaho toshlar! Chol quvonchdan yig'lab yuboribdi.",
                scene: { bg: 'yard', time: 'day', items: [['chest', 196, 304, { state: 'gold' }], ['chol', 92, 302, { pose: 'up', mood: 'joy' }], ['zumrad', 286, 304, { pose: 'cheer', mood: 'joy', s: 1.1 }], ['dog', 360, 304, { bark: true, f: 1, s: 0.85 }], ['bubble', 330, 176, { text: "Vov-vov!", to: [20, 40] }]] }
            },
            {
                title: "Qimmat momoning kulbasida",
                text: "Buni ko'rgan o'gay ona hasaddan yonib, Qimmatni ham o'rmonga jo'natibdi. Qimmat kulbaga salom ham bermay kirib: «Qani, tezroq ovqat ber, charchadim!» — deb baqiribdi. U hech qanday ish qilmay, uch kun uxlab yotibdi.",
                scene: { bg: 'hutin', time: 'day', items: [['qimmat', 140, 304, { pose: 'hips', mood: 'angry', s: 1.1 }], ['momo', 292, 304, { mood: 'surprised', cane: true }], ['bubble', 140, 150, { text: "Tezroq ovqat ber!", size: 12, to: [0, 34] }]] },
                question: { q: "Qimmat qanday xato qildi?", a: ["Salom bermadi va qo'pollik qildi", "Juda ko'p ishladi"], ok: 0 }
            },
            {
                title: "Ilonli sandiq",
                text: "Ketar chog'ida Qimmat eng katta, eng yaltiroq sandiqni ko'tarib olibdi. Uyga kelib sandiqni ochishsa — ichidan vishillab ilonlar chiqibdi! O'gay ona bilan Qimmat dod solib, hovlidan qochib qolishibdi.",
                scene: { bg: 'yard', time: 'dusk', items: [['chest', 170, 304, { state: 'snakes', w: 92, h: 56, color: '#7b2cbf' }], ['qimmat', 280, 304, { pose: 'scared', mood: 'scared', s: 1.1 }], ['ogayona', 356, 304, { pose: 'scared', mood: 'scared' }], ['mark', 232, 150, { ch: '!' }]] }
            },
            {
                title: "Baxtli yakun",
                text: "Shu voqeadan so'ng Qimmat ham, onasi ham o'z xatolarini anglab, mehnat qilishni o'rganishibdi. Zumrad esa otasi bilan baxtli yashabdi. Mehnat va odob — insonning eng qimmat boyligi ekan!",
                scene: { bg: 'village', time: 'sunset', season: 'spring', rainbow: true, fx: ['petals'], items: [['tree', 330, 258, { kind: 'blossom' }], ['flowers', 90, 304, { w: 80 }], ['chol', 150, 302, { mood: 'joy', pose: 'reach' }], ['zumrad', 226, 304, { pose: 'cheer', mood: 'joy', s: 1.1 }], ['hearts', 190, 170, {}]] }
            }
        ]
    },

    oltin_tarvuz: {
        title: "Oltin Tarvuz",
        category: "folk",
        tag: "O'zbek xalq ertagi • Yaxshilik",
        hue: "#2d6a4f",
        isNew: true,
        moral: "Beg'araz qilingan yaxshilik albatta qaytadi, ochko'zlik esa ziyon keltiradi.",
        cover: { bg: 'poliz', time: 'day', items: [['watermelon', 200, 304, { state: 'gold', r: 44 }], ['bird', 280, 120, { kind: 'swallow', fly: true, s: 1.6 }], ['sparkles', 200, 250, { w: 120, h: 60 }]] },
        quiz: {
            q: "Nima uchun dehqonga oltin tarvuz nasib etdi?",
            a: ["U juda boy bo'lgani uchun", "U qushchaga beg'araz yaxshilik qilgani uchun", "U tarvuzni bozordan sotib olgani uchun"],
            ok: 1
        },
        pages: [
            {
                title: "Ikki qo'shni",
                text: "Bir bor ekan, bir yo'q ekan, bir qishloqda kambag'al, ammo mehribon bir dehqon yashar ekan. Uning qo'shnisi esa ochko'z va baxil boy ekan. Boyning hovlisi katta-yu, ko'ngli tor ekan.",
                scene: { bg: 'village', time: 'morning', items: [['house', 90, 258, { s: 0.8, w: 90 }], ['house', 312, 262, { w: 150, h: 84, wall: '#f3dcae', door: '#7b2cbf', porch: 34, s: 0.9 }], ['dehqon', 152, 302, { pose: 'wave' }], ['boy', 250, 302, {}]] }
            },
            {
                title: "Qaldirg'ochlar keldi",
                text: "Bahor kelib, issiq o'lkalardan qaldirg'ochlar uchib keldi. Ular dehqonning ayvoni ostiga in qurishdi. Dehqon qushlarga don sepib: «Uyimga baraka olib keldingiz», — deb quvondi.",
                scene: { bg: 'village', time: 'morning', season: 'spring', items: [['house', 120, 268, { s: 1.15, swallowNest: true, porch: 30 }], ['bird', 262, 110, { kind: 'swallow', fly: true, s: 1.5 }], ['bird', 318, 80, { kind: 'swallow', fly: true, s: 1.2, f: 1 }], ['dehqon', 272, 302, { pose: 'hold', hold: 'seeds', mood: 'joy' }], ['grain', 240, 306], ['flowers', 340, 306, { w: 60 }]] },
                word: ["qaldirg'och", "Bahorda uchib keladigan, dumi ayri qora-ko'k qush"]
            },
            {
                title: "Yiqilgan polapon",
                text: "Bir kuni kichkina polapon uchishni o'rganayotib, inidan yiqilib tushdi va qanotini lat yedirdi. Dehqon uni avaylab kaftiga oldi, yarasini yumshoq latta bilan bog'lab qo'ydi.",
                scene: { bg: 'yard', time: 'day', season: 'spring', items: [['dehqon', 200, 302, { pose: 'hold', hold: 'swallow', mood: 'sad' }], ['bird', 300, 120, { kind: 'swallow', fly: true, s: 1.3, f: 1 }], ['hearts', 200, 170, { n: 2 }]] },
                question: { q: "Yordamga muhtoj qushchani ko'rsangiz nima qilasiz?", a: ["Uni avaylab, kattalarga ko'rsataman", "E'tibor bermay o'tib ketaman"], ok: 0 }
            },
            {
                title: "Xayr, qushcha!",
                text: "Dehqon qushchani har kuni boqdi, suv berdi. Qanoti tuzalgach, qaldirg'och shodon chirqillab osmonga ko'tarildi. Kuz kelganda qushlar issiq o'lkalarga uchib ketishdi.",
                scene: { bg: 'village', time: 'day', season: 'autumn', fx: ['leaves'], items: [['tree', 60, 262, { season: 'autumn' }], ['dehqon', 150, 302, { pose: 'wave', mood: 'joy' }], ['bird', 264, 100, { kind: 'swallow', fly: true, s: 1.7 }], ['bird', 330, 70, { kind: 'swallow', fly: true, s: 1.1 }]] }
            },
            {
                title: "Sehrli urug'",
                text: "Kelasi bahorda o'sha qaldirg'och yana qaytib keldi. Tumshug'ida bitta yaltiroq urug' bor edi. U urug'ni dehqonning kaftiga tashladi-da, «Buni ek!» degandek chirqilladi.",
                scene: { bg: 'village', time: 'morning', season: 'spring', items: [['tree', 330, 258, { kind: 'blossom' }], ['dehqon', 150, 302, { pose: 'reach', mood: 'surprised' }], ['bird', 232, 162, { kind: 'swallow', fly: true, hold: 'seed', s: 1.7, f: 1 }], ['sparkles', 214, 180, { w: 50, h: 40, n: 4 }]] },
                word: ["urug'", "Yerga ekilsa, undan o'simlik unib chiqadigan don"]
            },
            {
                title: "Ulkan tarvuz",
                text: "Dehqon urug'ni ekib, har kuni sug'ordi. Tez orada palak yoyilib, bitta ulkan tarvuz pishib yetildi. Tarvuz shunday katta ediki, dehqon uni uyiga zo'rg'a dumalatib keldi.",
                scene: { bg: 'poliz', time: 'day', items: [['watermelon', 232, 302, { r: 46, glow: true }], ['dehqon', 110, 302, { pose: 'push', mood: 'joy' }], ['sparkles', 232, 220, { w: 90, h: 40, n: 4 }]] },
                question: { q: "O'simlik o'sishi uchun nima kerak?", a: ["Suv, quyosh va mehnat", "Faqat kutib o'tirish"], ok: 0 },
                word: ["palak", "Tarvuz, qovun kabi o'simliklarning yerda yoyilib o'sadigan poyasi"]
            },
            {
                title: "Tarvuz ichida — oltin!",
                text: "Tarvuzni so'yishsa — ichidan yarqirab oltin tangalar sochilib ketdi! Dehqon oltinlarni kambag'allarga ulashdi, qishloqqa ariq qazdirib, ko'prik qurdirdi. Hamma uni duo qildi.",
                scene: { bg: 'yard', time: 'day', items: [['watermelon', 204, 306, { state: 'gold', r: 42 }], ['dehqon', 80, 302, { pose: 'cheer', mood: 'joy' }], ['kid1', 318, 304, { pose: 'cheer', mood: 'joy' }], ['kid2', 364, 304, { mood: 'joy', s: 0.9 }]] }
            },
            {
                title: "Ochko'z boyning hiylasi",
                text: "Buni eshitgan boy: «Men ham oltin tarvuz olaman!» deb o'yladi. U qaldirg'och inini tayoq bilan turtib, polaponni yerga tushirib yubordi. Keyin uni zo'rma-zo'raki bog'lab: «Qani, menga ham urug' olib kel!» — dedi.",
                scene: { bg: 'village', time: 'day', items: [['house', 250, 270, { w: 150, h: 84, wall: '#f3dcae', door: '#7b2cbf', swallowNest: true, s: 1.05 }], ['boy', 130, 302, { pose: 'point', hold: 'stick', mood: 'sly' }], ['bird', 300, 120, { kind: 'swallow', fly: true, s: 1.4, f: 1, mood: 'angry' }], ['mark', 250, 150, { ch: '!' }]] },
                question: { q: "Boyning qilgan ishi to'g'rimi?", a: ["Ha, oltin uchun hamma narsa mumkin", "Yo'q, qushchaga ozor berish yomon ish"], ok: 1 }
            },
            {
                title: "Arilar tarvuzi",
                text: "Bahorda qaldirg'och boyga ham urug' olib keldi. Undan ham ulkan tarvuz pishdi. Boy quvonib tarvuzni so'ydi — ichidan g'o'ng'illab arilar chiqib, uni ko'cha bo'ylab quvib ketdi!",
                scene: { bg: 'poliz', time: 'day', items: [['watermelon', 116, 306, { state: 'bees', r: 38 }], ['boy', 286, 302, { pose: 'scared', mood: 'scared', hold: null }], ['bee', 250, 170, { s: 1.3 }], ['bee', 330, 150, { s: 1.2, f: 1 }], ['bee', 300, 200, { s: 1.1 }], ['motion', 250, 250, { len: 30 }]] }
            },
            {
                title: "Yaxshilikka — yaxshilik",
                text: "Boy uyalib, qilgan ishidan pushaymon bo'ldi va dehqondan kechirim so'radi. Mehribon dehqon uni kechirdi. Shundan beri qishloqda: «Yaxshilik qilsang — yaxshilik qaytadi», degan naql qolgan ekan.",
                scene: { bg: 'village', time: 'sunset', rainbow: true, items: [['dehqon', 160, 302, { pose: 'reach', mood: 'joy' }], ['boy', 252, 302, { pose: 'heart', mood: 'sad', hold: null }], ['bird', 150, 100, { kind: 'swallow', fly: true, s: 1.2 }], ['bird', 250, 86, { kind: 'swallow', fly: true, s: 1.2, f: 1 }], ['hearts', 206, 170, {}]] }
            }
        ]
    },

    susambil: {
        title: "Susambil",
        category: "folk",
        tag: "O'zbek xalq ertagi • Do'stlik",
        hue: "#6a4c93",
        isNew: true,
        moral: "Birlashgan do'stlar har qanday qiyinchilikni yengadi. Birlik bor joyda baxt bor.",
        cover: { bg: 'meadow', time: 'morning', season: 'spring', items: [['signpost', 320, 300, { text: 'Susambil' }], ['donkey', 150, 300, { walk: true, mood: 'joy' }], ['rooster', 150, 246, { s: 0.7, crow: true }], ['dog', 250, 302, { pose: 'stand', s: 0.9 }]] },
        quiz: {
            q: "Do'stlar bo'rilarni qanday yengishdi?",
            a: ["Bo'rilar bilan urushib", "Birlashib, aql bilan", "Qochib ketib"],
            ok: 1
        },
        pages: [
            {
                title: "Qari eshak",
                text: "Bir bor ekan, bir yo'q ekan, bir qishloqda qari eshak yashar ekan. U yoshligida egasiga ko'p yillar sidqidildan xizmat qilgan ekan. Endi qarib qolgach, egasi uni boqmay, hovlidan haydab yuboribdi.",
                scene: { bg: 'village', time: 'day', items: [['house', 96, 262, { s: 0.9 }], ['qoshni', 112, 302, { pose: 'point', mood: 'angry', f: 1 }], ['donkey', 262, 300, { mood: 'sad' }], ['think', 300, 136, { text: '?' }]] }
            },
            {
                title: "Susambil orzusi",
                text: "Eshak yo'lda o'ylabdi: «Susambilga boraman! Aytishlaricha, u yerda o't-o'lan mo'l, suvlar zilol, hech kim hech kimni xafa qilmas emish». Shunday deb, eshak shodon hangrab yo'lga tushibdi.",
                scene: { bg: 'village', time: 'morning', rainbow: true, items: [['donkey', 170, 300, { walk: true, mood: 'joy', bray: true }], ['signpost', 318, 302, { text: 'Susambil' }], ['bubble', 214, 150, { text: "Hang-hang!", to: [-8, 36] }]] },
                word: ["Susambil", "Ertaklardagi to'kin-sochin, hamma baxtli yashaydigan orzu yurti"]
            },
            {
                title: "Qo'chqorvoy",
                text: "Yo'lda unga qo'chqor uchrabdi. «Qayoqqa ketyapsan, qo'chqorvoy?» — «Egam meni bozorga sotmoqchi, qochib ketyapman!» — «Unda men bilan Susambilga yur!» Ikkalasi birga yo'lga tushibdi.",
                scene: { bg: 'meadow', time: 'day', items: [['tree', 60, 258, {}], ['donkey', 140, 300, {}], ['ram', 282, 300, { f: 1, mood: 'sad' }], ['bubble', 200, 140, { text: "Birga ketamiz!", to: [-40, 40] }]] }
            },
            {
                title: "Xo'rozvoy",
                text: "Birozdan so'ng devor ustida qichqirayotgan xo'rozni ko'rishibdi. «Qu-qu-qu! Men har tong el-yurtni uyg'otardim, endi esa meni hech kim qadrlamaydi», — debdi xo'roz. «Yur, biz bilan Susambilga!» — deyishibdi do'stlar.",
                scene: { bg: 'village', time: 'morning', items: [['wall', 300, 300, { w: 130, h: 48 }], ['rooster', 300, 252, { crow: true }], ['donkey', 104, 300, {}], ['ram', 196, 302, { s: 0.9 }], ['bubble', 300, 150, { text: "Qu-qu-qu!", to: [10, 40] }]] }
            },
            {
                title: "To'rt do'st",
                text: "So'ng ularga qari it qo'shilibdi: «Vov! Men ko'p yil uy qo'riqladim, qarib qoldim deb meni quvishdi». To'rt do'st bir-biriga suyanib, yo'lda davom etibdi. Yo'l uzoq, ammo birga yurish maroqli ekan!",
                scene: { bg: 'steppe', time: 'sunset', items: [['donkey', 150, 300, { walk: true }], ['rooster', 150, 246, { s: 0.72 }], ['ram', 250, 302, { s: 0.9 }], ['dog', 336, 302, { pose: 'stand', s: 0.9 }]] },
                question: { q: "Do'stlar nega bir-biriga qo'shilishdi?", a: ["Birga bo'lish osonroq va quvnoqroq", "Ular urishmoqchi edi"], ok: 0 }
            },
            {
                title: "O'rmondagi gulxan",
                text: "Kech kirib, qorong'i tushibdi. Do'stlar o'rmonda gulxan yonida o'tirgan uchta och bo'rini ko'rishibdi. Bo'rilar: «Ertaga qishloqqa borib, qo'y o'g'irlaymiz!» — deb reja tuzayotgan ekan.",
                scene: { bg: 'forest', time: 'night', items: [['fire', 250, 294, {}], ['wolf', 196, 290, { mood: 'angry', s: 0.85 }], ['wolf', 306, 290, { mood: 'angry', f: 1, s: 0.85 }], ['wolf', 252, 256, { s: 0.7 }], ['donkey', 60, 300, { s: 0.8, mood: 'surprised' }], ['bush', 70, 308, { s: 1.4 }], ['bubble', 290, 150, { text: "Qo'y o'g'irlaymiz!", size: 12, to: [-20, 50] }]] }
            },
            {
                title: "Aqlli reja",
                text: "Eshak shivirlabdi: «Qo'rqmanglar, do'stlar! Birlashsak — hech kim bizni yengolmaydi». Ular reja tuzishibdi: eshak hangraydi, it huradi, xo'roz qichqiradi, qo'chqor esa shoxi bilan gursillatadi!",
                scene: { bg: 'forest', time: 'night', items: [['donkey', 120, 300, {}], ['rooster', 118, 246, { s: 0.7 }], ['ram', 232, 302, { f: 1, s: 0.9 }], ['dog', 318, 302, { f: 1, s: 0.9 }], ['think', 190, 120, { text: 'Reja!', size: 16 }]] },
                question: { q: "Kichkinalar kattalarni qanday yengishi mumkin?", a: ["Birlashib, aql bilan", "Hech qachon yengolmaydi"], ok: 0 }
            },
            {
                title: "Hang! Vov! Qu-qu-qu!",
                text: "Birdaniga o'rmonni dahshatli ovoz tutib ketibdi: «Hang-hang!», «Vov-vov!», «Qu-qu-qu!» Qo'chqor bo'rilarga qarab yugurib ketibdi. Bo'rilar «Voy, dev keldi!» deb, dumlarini qisib qochib qolishibdi.",
                scene: { bg: 'forest', time: 'night', items: [['donkey', 90, 300, { bray: true, mood: 'joy' }], ['rooster', 88, 246, { s: 0.7, crow: true }], ['dog', 176, 302, { bark: true, s: 0.9 }], ['ram', 232, 302, { s: 0.9 }], ['wolf', 318, 292, { pose: 'run', mood: 'scared', s: 0.75 }], ['wolf', 372, 270, { pose: 'run', mood: 'scared', s: 0.6 }], ['burst', 90, 150, { text: 'Hang!' }], ['burst', 196, 190, { text: 'Vov!', r: 20 }]] }
            },
            {
                title: "Mana, Susambil!",
                text: "Tong otgach, do'stlar atrofga qarashsa — yam-yashil o'tloq, tiniq ko'l va mevali daraxtlar! «Mana, Susambil shu yerda ekan!» — deb quvonishibdi ular. Chunki baxt — do'stlar bilan birga bo'lgan joyda ekan.",
                scene: { bg: 'lake', time: 'morning', season: 'spring', items: [['tree', 60, 262, { kind: 'apple' }], ['tree', 346, 258, { kind: 'apricot' }], ['donkey', 140, 304, { mood: 'joy' }], ['ram', 240, 306, { f: 1, s: 0.85 }], ['rooster', 300, 306, { s: 0.8 }], ['dog', 196, 306, { s: 0.8 }], ['sparkles', 200, 262, { w: 180, h: 30 }]] }
            },
            {
                title: "Ahil-inoq hayot",
                text: "To'rt do'st o'sha yerda ahil-inoq yashab qolishibdi. Qo'chqor o'tloqni qo'riqlabdi, it uyni poylabdi, xo'roz har tong hammani uyg'otibdi, eshak esa kechqurunlari ertak aytib beribdi.",
                scene: { bg: 'meadow', time: 'sunset', season: 'spring', items: [['hut', 262, 264, {}], ['rooster', 262, 172, { s: 0.7, crow: true }], ['donkey', 108, 302, { mood: 'joy' }], ['dog', 196, 304, { s: 0.85 }], ['ram', 338, 304, { f: 1, s: 0.85 }], ['flowers', 200, 312, { w: 120 }], ['hearts', 190, 170, {}]] }
            }
        ]
    },

    ur_toqmoq: {
        title: "Ur, To'qmoq!",
        category: "folk",
        tag: "O'zbek xalq ertagi • Halollik",
        hue: "#9a3412",
        isNew: true,
        moral: "Birovning haqiga xiyonat qilgan albatta jazosini oladi. Yaxshilik hech qachon yerda qolmaydi.",
        cover: { bg: 'inn', time: 'day', items: [['club', 210, 220, { fly: true, s: 1.4 }], ['burst', 280, 130, { text: 'Taq!' }], ['bobo', 110, 302, { pose: 'point', mood: 'joy' }]] },
        quiz: {
            q: "Ochko'z karvonsaroy egasi nima uchun jazolandi?",
            a: ["Ko'p uxlagani uchun", "Laylakni boqqani uchun", "Birovning narsasini o'g'irlagani uchun"],
            ok: 2
        },
        pages: [
            {
                title: "Kambag'al chol va kampir",
                text: "Qadim zamonda bir kambag'al chol bilan kampir yashar ekan. Ularning dasturxonida ko'pincha birgina non bo'lsa ham, ko'ngillari keng ekan. Borini bo'lishib, shukr qilib yasharkan.",
                scene: { bg: 'hutin', time: 'day', items: [['dasturxon', 200, 300, { empty: true, w: 130 }], ['bobo', 110, 298, { noLegs: true, mood: 'happy' }], ['kampir', 292, 298, { noLegs: true, mood: 'happy' }]] }
            },
            {
                title: "Yarador laylak",
                text: "Bir kuni chol dalada qanoti yaralangan laylakni ko'rib qolibdi. Uni uyiga olib kelib, yarasini bog'labdi va oxirgi nonini ham laylakka beribdi. «Tezroq tuzal, jonivor», — debdi chol.",
                scene: { bg: 'field', time: 'day', season: 'summer', items: [['bobo', 190, 302, { pose: 'hold', hold: 'stork', mood: 'sad' }], ['tree', 330, 256, { kind: 'poplar' }], ['hearts', 200, 160, { n: 2 }]] },
                word: ["laylak", "Oyoqlari va tumshug'i uzun, oq-qora qush. Buxoroda laylaklar minoralarga in quradi"]
            },
            {
                title: "Sehrli dasturxon",
                text: "Laylak tuzalgach, cholga rahmat aytibdi va unga sehrli dasturxon hadya qilibdi: «Bobojon, «Dasturxon, yozil!» desangiz, u o'z-o'zidan noz-ne'matlarga to'lib qoladi».",
                scene: { bg: 'field', time: 'morning', items: [['stork', 282, 300, {}], ['bobo', 160, 302, { pose: 'hold', hold: 'dasturxon', mood: 'surprised' }], ['sparkles', 160, 230, { w: 70, h: 40 }], ['bubble', 290, 150, { text: "Dasturxon, yozil!", size: 12, to: [0, 40] }]] }
            },
            {
                title: "Karvonsaroyda",
                text: "Uyga qaytayotib chol karvonsaroyda tunabdi va ochko'z saroybonga sirini aytib qo'yibdi. Chol uxlab qolganda, saroybon sehrli dasturxonni oddiy dasturxonga almashtirib qo'yibdi.",
                scene: { bg: 'inn', time: 'night', items: [['bobo', 110, 296, { noLegs: true, mood: 'sleep' }], ['saroybon', 262, 304, { pose: 'hold', hold: 'dasturxon', mood: 'sly' }], ['lamp', 350, 252, {}]] },
                question: { q: "Saroybon to'g'ri ish qildimi?", a: ["Yo'q, u o'g'rilik qildi", "Ha, u aqlli ekan"], ok: 0 },
                word: ["karvonsaroy", "Qadimda yo'lovchilar va savdogarlar tunab o'tadigan mehmonxona"]
            },
            {
                title: "Dasturxon nega yozilmadi?",
                text: "Chol uyiga kelib: «Dasturxon, yozil!» — desa, hech narsa bo'lmabdi. Kampir hayron, chol xafa bo'libdi. Ertasiga chol yana laylak oldiga boribdi.",
                scene: { bg: 'hutin', time: 'day', items: [['dasturxon', 210, 300, { empty: true }], ['bobo', 120, 304, { pose: 'shrug', mood: 'surprised' }], ['kampir', 300, 304, { mood: 'sad' }], ['think', 120, 110, { text: '?' }]] }
            },
            {
                title: "Oltin tovuq",
                text: "Laylak bu safar cholga sehrli tovuq hadya qilibdi: «Tovuqjon, tuxum qil!» desangiz, oltin tuxum qiladi». Chol xursand bo'lib yo'lga chiqibdi-yu, yana o'sha karvonsaroyda tunabdi.",
                scene: { bg: 'field', time: 'day', items: [['stork', 300, 300, {}], ['bobo', 150, 302, { pose: 'reach', mood: 'joy' }], ['hen', 228, 304, { gold: true }], ['goldegg', 262, 306, {}]] }
            },
            {
                title: "Yana hiyla",
                text: "Chol yana soddalik qilib, sirini aytib qo'yibdi. Kechasi ochko'z saroybon oltin tovuqni ham oddiy tovuqqa almashtirib olibdi. Uyga kelgan chol yana quruq qolibdi.",
                scene: { bg: 'inn', time: 'night', items: [['bobo', 100, 296, { noLegs: true, mood: 'sleep' }], ['saroybon', 250, 304, { pose: 'hold', hold: 'hen', mood: 'sly' }], ['hen', 340, 304, { s: 0.8 }], ['lamp', 190, 250, {}]] }
            },
            {
                title: "«Ur, to'qmoq!»",
                text: "Uchinchi marta laylak cholga yo'g'on to'qmoq beribdi. Chol karvonsaroyga kirib: «Ur, to'qmoq!» — deyishi bilan, to'qmoq o'zi uchib chiqib, saroybonning yelkasiga taq-taq ura boshlabdi!",
                scene: { bg: 'inn', time: 'day', items: [['bobo', 100, 304, { pose: 'point', mood: 'joy' }], ['saroybon', 290, 304, { pose: 'scared', mood: 'scared' }], ['club', 250, 196, { fly: true, s: 1.2 }], ['burst', 330, 150, { text: 'Taq!' }], ['bubble', 110, 150, { text: "Ur, to'qmoq!", to: [0, 40] }]] },
                word: ["to'qmoq", "Yog'ochdan yasalgan og'ir bolg'a"]
            },
            {
                title: "«To'xta, to'qmoq!»",
                text: "«Voy-voy! To'xtat, bobojon! Hammasini qaytaraman!» — deb yalinibdi saroybon va dasturxon bilan tovuqni olib chiqibdi. Chol: «To'xta, to'qmoq!» — deyishi bilan to'qmoq jim bo'libdi.",
                scene: { bg: 'inn', time: 'day', items: [['club', 170, 304, { lying: true }], ['bobo', 90, 304, { pose: 'hips', mood: 'happy' }], ['saroybon', 262, 304, { pose: 'hold', hold: 'dasturxon', mood: 'sad' }], ['hen', 336, 304, { gold: true }], ['bubble', 100, 150, { text: "To'xta, to'qmoq!", size: 12, to: [0, 40] }]] },
                question: { q: "Xato qilgan odam nima qilishi kerak?", a: ["Kechirim so'rab, xatosini tuzatishi", "Yashirib yurishi"], ok: 0 }
            },
            {
                title: "Butun qishloqqa ziyofat",
                text: "Chol bilan kampir sehrli dasturxonni yozib, butun qishloqni mehmonga chaqirishibdi. Hamma to'yib ovqatlanibdi. Laylak esa ularning tomida in qurib, baxtli yashabdi. Yaxshilik hech qachon yerda qolmas ekan!",
                scene: { bg: 'yard', time: 'day', season: 'spring', gateX: false, items: [['house', 84, 256, { s: 0.9, nest: true }], ['stork', 114, 180, { s: 0.5 }], ['bobo', 176, 282, { s: 0.85, pose: 'reach', mood: 'joy' }], ['kampir', 250, 282, { s: 0.85, mood: 'joy' }], ['kid1', 330, 286, { s: 0.9, pose: 'cheer', mood: 'joy' }], ['dasturxon', 210, 304, { w: 190 }], ['notes', 330, 176, {}]] }
            }
        ]
    },

    uch_ogayni: {
        title: "Uch Og'a-ini Botirlar",
        category: "folk",
        tag: "O'zbek xalq ertagi • Birlik va qahramonlik",
        hue: "#1d4e89",
        moral: "Birlikda kuch bor: ahil aka-ukalarni hech kim yengolmaydi.",
        cover: { bg: 'mountains', time: 'morning', items: [['polvon', 130, 300, { pose: 'cheer' }], ['kenja', 200, 302, { pose: 'wave', mood: 'joy', s: 1.1 }], ['mergan', 270, 300, { pose: 'point' }]] },
        quiz: {
            q: "Uch og'a-ini nega g'alaba qozonishdi?",
            a: ["Dev uxlab qolgani uchun", "Ahil bo'lib, birga harakat qilgani uchun", "Ular sehrgar bo'lgani uchun"],
            ok: 1
        },
        pages: [
            {
                title: "Uch aka-uka",
                text: "Qadim zamonda bir keksa otaning uch o'g'li bor ekan. Kattasi — kuchli polvon, o'rtanchasi — mohir mergan, kenjasi esa zukko va dono ekan. Ammo aka-ukalar tez-tez arazlashib, bir-birini tinglamas ekan.",
                scene: { bg: 'yard', time: 'day', items: [['polvon', 88, 302, { pose: 'hips', mood: 'angry' }], ['ota', 200, 302, { mood: 'sad' }], ['mergan', 312, 302, { pose: 'hips', mood: 'angry', f: 1, hold: null }], ['kenja', 256, 304, { mood: 'sad', s: 0.95 }], ['burst', 200, 130, { text: 'Hmm!', r: 20 }]] }
            },
            {
                title: "Bir bog' xivich",
                text: "Ota o'g'illarini chaqirib, qo'liga bir bog' xivich tutqazdi: «Qani, sindiring-chi!» Polvon ham, mergan ham kuchi yetgancha urinib ko'rdi — bog'lam sinmadi. Keyin ota xivichlarni bittalab berdi — ular osongina sindi.",
                scene: { bg: 'yard', time: 'day', items: [['polvon', 170, 302, { pose: 'hold', hold: 'sticks', mood: 'angry' }], ['ota', 70, 302, { pose: 'point', cane: false }], ['mergan', 270, 302, { mood: 'surprised', hold: null }], ['kenja', 340, 304, { mood: 'think', pose: 'think' }], ['sticks', 250, 312, { broken: true }]] },
                word: ["xivich", "Ingichka, uzun tayoqcha"]
            },
            {
                title: "Otaning o'giti",
                text: "«Ko'rdingizmi, bolalarim? Birga bo'lsangiz — sizni hech kim yengolmaydi. Yolg'iz bo'lsangiz — xivichdek osongina sinasiz», — dedi ota. Aka-ukalar bir-birini quchoqlab, ahil bo'lishga so'z berishdi.",
                scene: { bg: 'yard', time: 'sunset', items: [['polvon', 140, 302, { pose: 'reach', mood: 'joy' }], ['kenja', 204, 304, { pose: 'cheer', mood: 'joy' }], ['mergan', 266, 302, { pose: 'reach', mood: 'joy', hold: null }], ['ota', 346, 302, { mood: 'joy' }], ['hearts', 204, 160, {}]] },
                question: { q: "Otaning xivichlari nimani o'rgatdi?", a: ["Birlikda kuch borligini", "Xivich sindirish qiziqligini"], ok: 0 }
            },
            {
                title: "Qishloqqa kelgan balo",
                text: "O'sha yili qishloqqa katta balo keldi: tog'dagi zolim dev buloq ko'zini ulkan tosh bilan berkitib qo'ydi. Ariqlar qurib, bog'lar so'libdi, odamlar suvsiz qolibdi.",
                scene: { bg: 'village', time: 'day', season: 'dry', clouds: 1, items: [['tree', 70, 262, { kind: 'bare' }], ['ariq', 200, 286, { dry: true, w: 260 }], ['crack', 120, 304], ['crack', 290, 310], ['kid1', 160, 306, { mood: 'sad', s: 0.9 }], ['ona', 232, 304, { mood: 'sad', s: 0.9 }], ['dev', 332, 160, { s: 0.3, mood: 'angry' }], ['rock', 302, 162, { big: true, s: 0.45 }]] }
            },
            {
                title: "Yo'lga otlanish",
                text: "Uch og'a-ini: «Elni qutqaramiz!» deb tog' tomon yo'lga chiqishdi. Yo'l uzoq va xatarli edi. Kenja uka yerga qulog'ini qo'yib tinglabdi: «Dev tog' ortidagi g'orda uxlayapti», — dedi.",
                scene: { bg: 'mountains', time: 'morning', items: [['polvon', 88, 302, {}], ['kenja', 190, 304, { pose: 'ear', mood: 'think' }], ['sound', 216, 202, {}], ['mergan', 296, 302, { hold: 'bow', pose: 'down' }]] },
                question: { q: "Kenja ukaning qaysi xislati yordam berdi?", a: ["Zukkoligi va diqqat bilan tinglashi", "Ko'p uxlashi"], ok: 0 }
            },
            {
                title: "Qoyani surish",
                text: "Tog' dovonida ularga ulkan qoya yo'l bermadi. Polvon aka qoyani yelkasi bilan itarib, yo'lni ochib berdi. «Birga bo'lsak — tog'ni ham yengamiz!» — deb kulishdi aka-ukalar.",
                scene: { bg: 'mountains', time: 'day', items: [['rock', 272, 304, { big: true }], ['polvon', 190, 304, { pose: 'push', mood: 'angry' }], ['kenja', 70, 306, { pose: 'cheer', mood: 'joy' }], ['mergan', 116, 304, { pose: 'cheer', mood: 'joy', hold: null }], ['dust', 250, 310]] },
                word: ["dovon", "Tog'lar orasidagi baland o'tish joyi"]
            },
            {
                title: "Devning g'ori",
                text: "G'or oldida ulkan dev xurrak otib uxlab yotgan ekan. Aka-ukalarning sharpasini sezib, u uyg'onib ketdi va qo'lidagi gurzini ko'tarib: «Kim meni bezovta qilyapti?!» — deb o'kirdi.",
                scene: { bg: 'mountains', time: 'dusk', items: [['cave', 290, 300, { s: 0.9 }], ['dev', 290, 306, { club: true, mood: 'angry', s: 0.8 }], ['polvon', 70, 302, { mood: 'surprised' }], ['kenja', 124, 304, { mood: 'scared' }], ['rock', 110, 312, { big: true, s: 1.1 }], ['burst', 300, 110, { text: 'Kim u?!' }]] }
            },
            {
                title: "Mergan akaning o'qi",
                text: "Kenja uka qo'rqmay: «Ey dev, bahslashamiz! Agar akam uzoqdagi daraxt uchidagi olmani urib tushirsa, buloqni ochib berasan!» — dedi. Mergan kamondan o'q uzdi — olma ikkiga bo'linib tushdi. Dev lol qoldi.",
                scene: { bg: 'mountains', time: 'day', items: [['tree', 350, 262, { kind: 'apple', s: 0.75, n: 1 }], ['arrow', 300, 186, { s: 0.9 }], ['mergan', 120, 302, { pose: 'point', hold: 'bow' }], ['kenja', 44, 304, { pose: 'point', mood: 'joy' }], ['dev', 232, 306, { s: 0.62, mood: 'surprised' }]] },
                question: { q: "Kenja uka devni kuch bilanmi yoki aql bilan yengdi?", a: ["Kuch bilan", "Aql bilan"], ok: 1 }
            },
            {
                title: "Buloq ochildi!",
                text: "Dev bahsda yutqazdi, ammo so'zidan qaytmoqchi bo'ldi. Shunda uch og'a-ini birgalikda ulkan toshni surib, buloqni ochib yuborishdi. Dev qo'rqib, tog' ortiga qochdi va boshqa qaytmadi.",
                scene: { bg: 'mountains', time: 'day', items: [['gush', 312, 290, { s: 1.4 }], ['rock', 250, 304, { big: true }], ['kenja', 188, 306, { pose: 'push', mood: 'joy' }], ['polvon', 140, 304, { pose: 'push', mood: 'angry' }], ['mergan', 90, 304, { pose: 'push', mood: 'joy', hold: null }], ['dev', 370, 196, { s: 0.3, pose: 'scared', mood: 'scared' }]] }
            },
            {
                title: "El qahramonlari",
                text: "Suv qishloqqa qaytib, bog'lar yana gullab-yashnadi. El uch og'a-inini qahramon sifatida kutib oldi. Ota esa jilmayib: «Men aytgandim-ku — birlikda kuch bor!» — dedi.",
                scene: { bg: 'river', time: 'day', season: 'spring', fx: ['confetti'], items: [['tree', 60, 258, { kind: 'blossom' }], ['polvon', 140, 300, { pose: 'cheer', mood: 'joy' }], ['kenja', 204, 302, { pose: 'cheer', mood: 'joy' }], ['mergan', 266, 300, { pose: 'cheer', mood: 'joy', hold: null }], ['ota', 342, 300, { mood: 'joy', pose: 'reach' }]] }
            }
        ]
    },

    afandi_1: {
        title: "Nasriddin Afandi Latifalari",
        category: "folk",
        tag: "O'zbek xalq latifalari • Hazil va hikmat",
        hue: "#b45309",
        moral: "Afandi latifalari kuldiradi va o'ylantiradi: insonni kiyimiga qarab baholama, ochko'z bo'lma, har kimning gapiga qarab ish tutma.",
        cover: { bg: 'city', time: 'morning', items: [['minaret', 70, 262, { s: 0.8 }], ['donkey', 230, 300, { rider: 'afandi', riderOpts: { pose: 'wave' } }]] },
        quiz: {
            q: "«To'nim, ye!» latifasi bizga nimani o'rgatadi?",
            a: ["Palovni to'n bilan yeyishni", "Insonni kiyimiga qarab baholamaslikni", "To'yga bormaslikni"],
            ok: 1
        },
        pages: [
            {
                title: "Hozirjavob Afandi",
                text: "Bir zamonlar Buxoroda hozirjavob, quvnoq Nasriddin Afandi yashagan ekan. U eshagiga minib shahar kezar, kulgili, ammo hikmatli ishlari bilan butun elga tanilgan ekan. Keling, uning latifalarini birga o'qiymiz!",
                scene: { bg: 'city', time: 'morning', items: [['minaret', 62, 262, { s: 0.8, nest: true }], ['donkey', 200, 300, { rider: 'afandi', riderOpts: { pose: 'wave', mood: 'joy' } }], ['kid1', 318, 304, { pose: 'wave', mood: 'joy' }], ['kid2', 362, 304, { mood: 'joy', s: 0.9 }]] },
                word: ["latifa", "Qisqa, kulgili va hikmatli hikoya"]
            },
            {
                title: "Qozon tug'di",
                text: "Bir kuni Afandi qo'shnisidan katta qozon so'rab olibdi. Ertasi kuni qozonni qaytarayotib, ichiga kichkina qozoncha solib qo'yibdi: «Qozoningiz tug'di, mana bolasi!» Qo'shni kulib, ikkalasini ham olibdi.",
                scene: { bg: 'yard', time: 'day', items: [['afandi', 100, 302, { pose: 'point', mood: 'sly' }], ['qozon', 196, 304, { noFire: true, steam: false, content: 'soup', s: 0.8 }], ['qozon', 238, 306, { noFire: true, steam: false, content: 'soup', s: 0.36 }], ['qoshni', 314, 302, { mood: 'laugh', f: 1 }], ['bubble', 110, 150, { text: "Qozoningiz tug'di!", size: 12, to: [0, 40] }]] }
            },
            {
                title: "Qozon o'libdi",
                text: "Oradan bir hafta o'tib, Afandi yana qozonni so'rab olibdi-yu, qaytarmabdi. Qo'shni kelsa: «Afsus, qozoningiz o'libdi», — debdi. «Qozon ham o'ladimi?!» — «Tug'ishiga ishondingiz-ku, o'lishiga nega ishonmaysiz?»",
                scene: { bg: 'yard', time: 'day', items: [['qoshni', 110, 302, { pose: 'shrug', mood: 'surprised' }], ['afandi', 272, 302, { pose: 'shrug', mood: 'sly' }], ['think', 110, 110, { text: '?!' }], ['bubble', 272, 146, { text: "O'libdi...", to: [0, 40] }]] },
                question: { q: "Qo'shni nimaga aldandi?", a: ["Ochko'zlik qilib, qozonning «tug'ishiga» ishongani uchun", "Qozonni sotgani uchun"], ok: 0 }
            },
            {
                title: "Eski to'nda to'yga",
                text: "Bir kuni Afandi eski to'nda to'yga boribdi. Hech kim unga e'tibor bermabdi, joy ham ko'rsatmabdi. Afandi indamay uyiga qaytib, eng chiroyli zarbof to'nini kiyib, to'yga qaytib kelibdi.",
                scene: { bg: 'yard', time: 'day', gateX: 60, items: [['soru', 260, 294, { w: 140 }], ['mehmon', 226, 256, { noLegs: true, s: 0.8, f: 1 }], ['qoshni', 300, 256, { noLegs: true, s: 0.8, f: 1 }], ['dasturxon', 262, 262, { w: 96 }], ['afandi', 82, 304, { pattern: 'patch', color: '#8d99ae', color2: '#bc6c25', patches: true, mood: 'sad' }]] }
            },
            {
                title: "«Ye, to'nim, ye!»",
                text: "Endi uni darhol to'rga o'tqazib, oldiga palov qo'yishibdi. Afandi to'nining yengini palovga botirib: «Ye, to'nim, ye! Hurmat menga emas, senga ekan-ku!» — debdi. Mehmonlar uyalib qolishibdi.",
                scene: { bg: 'yard', time: 'day', gateX: 60, items: [['soru', 220, 294, { w: 170 }], ['mehmon', 150, 256, { noLegs: true, s: 0.8, mood: 'surprised' }], ['afandi', 222, 256, { noLegs: true, s: 0.85, pose: 'point', outfit: 'royal', color: '#b5172f', mood: 'sly' }], ['qoshni', 296, 256, { noLegs: true, s: 0.8, mood: 'surprised', f: 1 }], ['dasturxon', 222, 262, { w: 110 }], ['bubble', 222, 118, { text: "Ye, to'nim, ye!", to: [0, 40] }]] },
                question: { q: "Odamni nimasiga qarab hurmat qilish kerak?", a: ["Qimmat kiyimiga", "Fe'l-atvori va yaxshi ishlariga"], ok: 1 },
                word: ["to'r", "Uyning eng hurmatli, mehmonlar o'tqaziladigan joyi"]
            },
            {
                title: "Oy quduqqa tushibdi!",
                text: "Bir kechasi Afandi quduqdan suv olmoqchi bo'lib, ichiga qarasa — suvda oy aks etib turibdi. «Voy, oy quduqqa tushib ketibdi! Uni qutqarish kerak!» — debdi Afandi xavotirlanib.",
                scene: { bg: 'village', time: 'night', items: [['well', 170, 296, { moon: true, s: 1.1 }], ['afandi', 290, 304, { mood: 'surprised', pose: 'point', f: 1 }], ['bubble', 290, 140, { text: "Oy tushibdi!", to: [0, 40] }]] }
            },
            {
                title: "Oyni qutqarish",
                text: "Afandi arqonga ilmoq bog'lab, quduqqa tashlabdi. Ilmoq toshga ilinib qolibdi. Kuch bilan tortganda arqon uzilib, o'zi chalqanchasiga yiqilibdi. Osmonga qarasa — oy joyida! «Oh, oyni joyiga qaytardim!» — debdi Afandi mamnun.",
                scene: { bg: 'village', time: 'night', moonAt: [300, 70], items: [['well', 120, 296, { rope: 'broken' }], ['afandi', 250, 300, { seated: true, legLen: 8, pose: 'cheer', mood: 'joy' }], ['sparkles', 300, 70, { w: 60, h: 40, n: 4 }]] },
                question: { q: "Oy haqiqatan quduqqa tushganmidi?", a: ["Ha, tushgan edi", "Yo'q, suvda faqat uning aksi ko'rinardi"], ok: 1 }
            },
            {
                title: "Eshak, ota va o'g'il",
                text: "Afandi o'g'li bilan bozorga ketayotgan ekan. O'zi eshakka minib, o'g'li piyoda ketsa, odamlar: «Uyatsiz ota, bolasini piyoda yurgizibdi!» — deyishibdi. O'g'lini mindirsa: «Qarang, bola minib olgan, keksa otasi piyoda!» — deyishibdi.",
                scene: { bg: 'village', time: 'day', items: [['donkey', 196, 300, { walk: true, rider: 'afandibola' }], ['afandi', 300, 302, { walk: true }], ['qoshni', 68, 302, { pose: 'point', mood: 'angry' }], ['bubble', 84, 150, { text: "Uyat!", to: [0, 40] }]] }
            },
            {
                title: "El og'ziga elak tutib bo'lmas",
                text: "Ikkalasi minsa: «Bechora eshakka rahm qilishmaydi!», ikkalasi piyoda yursa: «Eshagi turib, piyoda yurgan soddalar!» — deyishibdi. Afandi kulib: «O'g'lim, el og'ziga elak tutib bo'lmaydi. O'zing to'g'ri deb bilganingni qil», — debdi.",
                scene: { bg: 'village', time: 'day', items: [['afandi', 96, 302, { pose: 'shrug', mood: 'joy' }], ['donkey', 210, 300, { mood: 'joy' }], ['afandibola', 316, 304, { mood: 'laugh' }], ['mehmon', 366, 302, { mood: 'laugh', s: 0.85 }]] },
                question: { q: "Afandi o'g'liga qanday maslahat berdi?", a: ["Har kimning gapiga qarab ish tut", "O'zing to'g'ri deb bilganingni qil"], ok: 1 }
            },
            {
                title: "Kulgi va hikmat",
                text: "Afandining latifalari bizni kuldiradi va o'ylantiradi: kiyimga emas, insonga hurmat qil; ochko'z bo'lma; har kimning gapiga qarab ish tutma. Kulgi bilan hikmat — Afandining eng qimmat sovg'asi!",
                scene: { bg: 'village', time: 'sunset', items: [['donkey', 250, 300, { rider: 'afandi', riderOpts: { pose: 'wave', mood: 'joy' } }], ['kid1', 90, 304, { mood: 'laugh', pose: 'cheer' }], ['kid4', 146, 304, { mood: 'laugh' }], ['hearts', 250, 150, { n: 2 }]] }
            }
        ]
    },

    hakim_qizi: {
        title: "Donishmand Qiz",
        category: "folk",
        tag: "O'zbek xalq ertagi • Aql-zakovat",
        hue: "#1e40af",
        moral: "Aql va bilim — hech qachon tugamaydigan xazina. Zukko odam eng qiyin savolga ham javob topadi.",
        cover: { bg: 'palace', items: [['throne', 280, 290, { rider: 'podshoh', riderOpts: { mood: 'surprised' } }], ['oydin', 130, 304, { pose: 'hips', mood: 'joy', s: 1.15 }]] },
        quiz: {
            q: "Oydin podshohning qiyin topshiriqlarini qanday uddaladi?",
            a: ["Sehrli tayoqcha bilan", "Yig'lab-siqtab", "Aql-zakovat va topqirlik bilan"],
            ok: 2
        },
        pages: [
            {
                title: "Podshohning niyati",
                text: "Qadim zamonda bir podshoh o'z yurtida eng dono odam kim ekanini bilmoqchi bo'libdi. U vaziriga: «Elga shunday topshiriqlar beraylik-ki, faqat haqiqiy donogina uddalasin», — debdi.",
                scene: { bg: 'palace', items: [['throne', 230, 290, { rider: 'podshoh', riderOpts: { pose: 'point' } }], ['vazir', 96, 304, { pose: 'pray', tilt: 8 }]] },
                word: ["vazir", "Podshohning bosh maslahatchisi"]
            },
            {
                title: "Qaynatilgan tuxumlar",
                text: "Podshoh bir kambag'al cholni saroyga chaqirib, unga o'ttizta qaynatilgan tuxum beribdi: «Ertagacha shu tuxumlardan jo'ja ochirib olib kelasan!» Chol boshini changallab uyiga qaytibdi.",
                scene: { bg: 'palace', items: [['throne', 290, 290, { rider: 'podshoh', riderOpts: { pose: 'point', f: 1 } }], ['oydinota', 120, 304, { pose: 'hold', hold: 'eggs', mood: 'sad' }], ['think', 120, 106, { text: '?' }]] }
            },
            {
                title: "Aqlli Oydin",
                text: "Cholning Oydin ismli aqlli qizi bor ekan. U otasini tinchlantirib: «Xafa bo'lmang, otajon», — debdi va bir hovuch qaynatilgan tariq berib, nima deyishni o'rgatibdi.",
                scene: { bg: 'room', time: 'night', items: [['oydinota', 130, 304, { mood: 'sad' }], ['oydin', 240, 304, { pose: 'hold', hold: 'seeds', mood: 'happy', s: 1.1 }], ['lamp', 330, 236, {}]] },
                word: ["tariq", "Mayda, sariq donli o'simlik; undan bo'tqa pishiriladi"]
            },
            {
                title: "Tariq javobi",
                text: "Chol saroyga borib debdi: «Podshohim, qizim aytdi: shu qaynatilgan tariqni bugun eksinlar, ertaga hosil olsinlar — jo'jalarga don bo'ladi». Podshoh kulib: «Qaynatilgan tariq unarmidi?» — «Qaynatilgan tuxumdan jo'ja chiqarmidi?»",
                scene: { bg: 'palace', items: [['throne', 250, 290, { rider: 'podshoh', riderOpts: { mood: 'laugh' } }], ['oydinota', 104, 304, { pose: 'hold', hold: 'seeds', mood: 'happy' }], ['vazir', 356, 304, { mood: 'surprised', f: 1 }]] },
                question: { q: "Oydinning javobi nimani ko'rsatdi?", a: ["Podshohning topshirig'i bajarib bo'lmaydigan ekanini", "Tariq tez unishini"], ok: 0 }
            },
            {
                title: "Ho'kiz suti",
                text: "Podshoh bu javobdan hayratlanib, ikkinchi topshiriqni beribdi: «Ertaga menga ho'kiz sutidan bir kosa olib kelasan!» Chol yana g'amgin holda uyiga qaytibdi.",
                scene: { bg: 'palace', items: [['throne', 280, 290, { rider: 'podshoh', riderOpts: { pose: 'point', f: 1 } }], ['oydinota', 120, 304, { mood: 'sad', pose: 'shrug' }], ['think', 130, 104, { text: "Ho'kiz suti?!", size: 14 }]] }
            },
            {
                title: "«Otam tug'ayapti»",
                text: "Ertasi kuni saroyga Oydinning o'zi kelibdi. «Otang qani?» — deb so'rabdi podshoh. «Otam tug'ayapti, kela olmadi». — «Nima deyapsan? Erkak kishi tug'adimi?!» — «Ho'kiz sut beradimi, podshohim?»",
                scene: { bg: 'palace', items: [['throne', 256, 290, { rider: 'podshoh', riderOpts: { mood: 'surprised' } }], ['oydin', 110, 304, { pose: 'hips', mood: 'sly', s: 1.1 }], ['vazir', 364, 304, { mood: 'laugh', f: 1, s: 0.95 }]] },
                question: { q: "Oydin podshohga qanday javob qaytardi?", a: ["Topqirlik bilan, uning o'z savoliga o'xshash javob berdi", "Qo'rqib, indamay qoldi"], ok: 0 }
            },
            {
                title: "Uchinchi sinov",
                text: "Podshoh qizning aqliga qoyil qolibdi, ammo yana bir sinov qilibdi: «Ertaga saroyga na piyoda, na otliq kel; na sovg'a bilan, na sovg'asiz kel!»",
                scene: { bg: 'palace', items: [['podshoh', 200, 304, { pose: 'hold', hold: 'scroll' }], ['vazir', 90, 304, { pose: 'think', mood: 'think' }], ['oydin', 318, 304, { pose: 'think', mood: 'think', s: 1.1 }], ['think', 318, 108, { text: '?' }]] }
            },
            {
                title: "Echkiga mingan qiz",
                text: "Ertasi Oydin echkiga minib kelibdi — oyoqlari yerga tegib turarkan: na piyoda, na otliq! Qo'lida bir chumchuq bor ekan. «Mana sovg'am!» — deb qo'lini ochgan ekan, chumchuq pir etib uchib ketibdi: na sovg'a bilan, na sovg'asiz!",
                scene: { bg: 'palace', items: [['goat', 150, 304, { rider: 'oydin', riderOpts: { pose: 'wave', mood: 'joy' } }], ['bird', 236, 150, { kind: 'sparrow', fly: true, s: 1.5 }], ['podshoh', 322, 304, { mood: 'surprised', pose: 'shrug' }]] }
            },
            {
                title: "Yurtning eng donosi",
                text: "Podshoh o'rnidan turib: «Butun yurtimda sendan dono odam yo'q ekan!» — debdi. U Oydinni saroyga maslahatchi qilib olibdi, cholga esa katta hovli va bog' hadya etibdi.",
                scene: { bg: 'palace', fx: ['confetti'], items: [['oydin', 130, 304, { pose: 'heart', mood: 'joy', s: 1.1 }], ['podshoh', 236, 304, { pose: 'reach', mood: 'joy' }], ['oydinota', 336, 304, { mood: 'joy' }]] }
            },
            {
                title: "Dono qiz maktabi",
                text: "Oydin elga adolat bilan maslahatlar beribdi, bolalar uchun maktab ochib, ularga kitob o'qishni o'rgatibdi. El uni «Dono qiz» deb ardoqlabdi. Aql va bilim — hech qachon tugamaydigan xazina ekan!",
                scene: { bg: 'garden', time: 'day', season: 'spring', items: [['tree', 300, 262, { kind: 'big' }], ['oydin', 200, 304, { pose: 'hold', hold: 'book', mood: 'happy', s: 1.1 }], ['kid1', 96, 306, { noLegs: true, mood: 'joy' }], ['kid4', 300, 306, { noLegs: true, mood: 'joy' }], ['kid3', 356, 306, { noLegs: true, mood: 'happy' }]] }
            }
        ]
    },

    qanotli_tulki: {
        title: "Topag'on Tulki",
        category: "folk",
        tag: "Xalq ertagi • Topqirlik",
        hue: "#c2410c",
        moral: "Aql va birdamlik har qanday qahraton qishdan kuchli.",
        cover: { bg: 'forest', season: 'autumn', fx: ['leaves'], items: [['fox', 200, 300, { s: 1.4 }], ['rabbit', 300, 302, { f: 1 }], ['hedgehog', 100, 304, { apple: true }]] },
        quiz: {
            q: "Hayvonlar qishni qanday o'tkazishdi?",
            a: ["Har kim yolg'iz o'zi", "Aql va birdamlik bilan, birga", "Bo'rining kuchi bilan"],
            ok: 1
        },
        pages: [
            {
                title: "Zukko tulki",
                text: "Bir bor ekan, bir yo'q ekan, katta o'rmonda qizil mo'ynali topag'on tulki yashar ekan. Boshqa tulkilar ayyorligi bilan tanilsa, u zukkoligi va mehribonligi bilan mashhur ekan.",
                scene: { bg: 'forest', season: 'autumn', fx: ['leaves'], items: [['tree', 70, 262, { season: 'autumn' }], ['tree', 340, 258, { season: 'autumn', s: 0.9 }], ['fox', 200, 300, { s: 1.35 }], ['mushroom', 280, 306]] }
            },
            {
                title: "Quyonvoyning tashvishi",
                text: "Kuz kelib, barglar sarg'aydi. Quyonvoy yig'lab kelibdi: «Qish yaqin, men esa hech narsa tayyorlamadim!» Tulki uni yupatibdi: «Xafa bo'lma, birgalikda bir yo'lini topamiz».",
                scene: { bg: 'forest', season: 'autumn', fx: ['leaves'], items: [['fox', 140, 300, { s: 1.2 }], ['rabbit', 270, 302, { mood: 'cry', f: 1, s: 1.2 }]] },
                question: { q: "Do'stingiz xafa bo'lsa, nima qilasiz?", a: ["Uni yupatib, yordam beraman", "Kulib o'tib ketaman"], ok: 0 }
            },
            {
                title: "Katta kengash",
                text: "Tulki barcha hayvonlarni katta chinor tagiga yig'ibdi: «Har kim bilgan ishini qilsin: quyon sabzi tersin, ayiq asal topsin, tipratikan olma tashisin, chumchuqlar urug' yig'sin!»",
                scene: { bg: 'forest', season: 'autumn', items: [['tree', 200, 262, { kind: 'big', season: 'autumn' }], ['fox', 200, 304, { s: 1.1 }], ['rabbit', 110, 304, {}], ['hedgehog', 60, 308, { apple: true }], ['bear', 310, 306, { s: 0.85, wave: true }], ['bird', 260, 150, { kind: 'sparrow', fly: true, s: 1.2 }], ['bird', 140, 140, { kind: 'sparrow', fly: true, s: 1.1, f: 1 }]] },
                word: ["chinor", "Juda katta, uzoq yashaydigan soyali daraxt"]
            },
            {
                title: "Och bo'ri",
                text: "Shu payt och bo'ri kelib o'kiribdi: «Men hech narsa yig'mayman, sizlarning zaxirangizni yeb qo'yaman!» Hayvonlar qo'rqib, tulkining orqasiga yashirinishibdi.",
                scene: { bg: 'forest', season: 'autumn', items: [['wolf', 300, 296, { pose: 'stand', mood: 'angry', f: 1 }], ['fox', 170, 300, { s: 1.1 }], ['rabbit', 100, 304, { mood: 'scared' }], ['hedgehog', 50, 308, { mood: 'scared' }], ['burst', 310, 150, { text: 'Grrr!' }]] }
            },
            {
                title: "Tulkining taklifi",
                text: "Tulki xotirjam javob beribdi: «Bo'rivoy, sen kuchlisan, ammo yolg'iz qishni o'tkaza olmaysan. Bizga o'rmonni qo'riqlashda yordam ber, biz esa zaxiramizni sen bilan bo'lishamiz». Bo'ri o'ylanib qolibdi.",
                scene: { bg: 'forest', season: 'autumn', items: [['fox', 140, 300, { s: 1.15 }], ['wolf', 282, 300, { f: 1, mood: 'happy' }], ['think', 290, 150, { text: '?' }]] },
                question: { q: "Tulki bo'rini qanday yengdi?", a: ["Urishib", "Aqlli taklif va do'stlik bilan"], ok: 1 }
            },
            {
                title: "Birgalikdagi mehnat",
                text: "Bo'ri rozi bo'libdi. U kechalari o'rmonni qo'riqlabdi, hayvonlar esa kun bo'yi mehnat qilibdi. Ular birgalikda katta g'orni qishlik zaxiraga to'ldirishibdi.",
                scene: { bg: 'forest', season: 'autumn', items: [['cave', 300, 300, { s: 0.8 }], ['basket', 300, 304, { carrot: true }], ['bear', 110, 306, { hold: 'honey', s: 0.85 }], ['hedgehog', 200, 308, { apple: true }], ['rabbit', 236, 306, { s: 0.9 }], ['wolf', 380, 296, { f: 1, s: 0.7 }]] }
            },
            {
                title: "Qahraton qish",
                text: "Qahraton qish keldi. Tashqarida qor bo'roni guvillasa ham, hayvonlar g'orda issiq va to'q yashashibdi. Kechqurunlari tulki gulxan yonida ularga ertak aytib beribdi.",
                scene: { bg: 'cave', items: [['fire', 200, 300, {}], ['fox', 200, 262, { s: 0.9 }], ['bear', 90, 306, { s: 0.9 }], ['rabbit', 300, 304, { f: 1 }], ['hedgehog', 350, 308, { f: 1 }], ['wolf', 140, 300, { s: 0.75 }], ['bubble', 210, 120, { text: "Bir bor ekan...", to: [0, 50] }]] },
                word: ["qahraton", "Juda qattiq, sovuq (qish haqida)"]
            },
            {
                title: "Bahor bayrami",
                text: "Bahor kelganda o'rmonda hech kim och qolmagani, hech kim urishmagani ma'lum bo'libdi. Hayvonlar tulkiga rahmat aytib: «Aql va birdamlik har qanday qishdan kuchli ekan!» — deyishibdi.",
                scene: { bg: 'meadow', season: 'spring', fx: ['petals'], items: [['tree', 60, 258, { kind: 'blossom' }], ['fox', 180, 302, { mood: 'joy' }], ['rabbit', 250, 304, { mood: 'joy' }], ['bear', 330, 306, { wave: true, s: 0.85 }], ['hedgehog', 110, 306, {}], ['wolf', 300, 262, { s: 0.6, mood: 'joy' }], ['hearts', 200, 170, {}]] }
            }
        ]
    },

    sehrli_nay: {
        title: "Sehrli Nay Navosi",
        category: "folk",
        tag: "Xalq ertagi • Musiqa va mehr",
        hue: "#5b21b6",
        moral: "Yaxshi niyat bilan chalingan kuy — eng kuchli sehr. San'at qalblarni isitadi va odamlarni birlashtiradi.",
        cover: { bg: 'peak', time: 'morning', season: 'spring', items: [['chopon', 190, 290, { pose: 'flute', hold: 'flute', s: 1.2 }], ['notes', 230, 170, {}], ['ram', 310, 296, { horns: false }]] },
        quiz: {
            q: "Cho'pon yigit naying sehrini nimaga ishlatdi?",
            a: ["Faqat o'zi boyib ketish uchun", "Elga yaxshilik va bahor olib kelish uchun", "Odamlarni qo'rqitish uchun"],
            ok: 1
        },
        pages: [
            {
                title: "Cho'pon yigit",
                text: "Tog' etagidagi qishloqda yetim cho'pon yigit yashar ekan. Uning molu dunyosi yo'q, faqat qamishdan o'zi yasagan nayi bor ekan. Qo'ylarini o'tlatarkan, nay chalib, tog'u toshlarni navoga to'ldirarkan.",
                scene: { bg: 'peak', time: 'morning', items: [['chopon', 170, 286, { pose: 'flute', hold: 'flute', s: 1.15 }], ['ram', 280, 290, { horns: false }], ['ram', 336, 280, { horns: false, s: 0.8 }], ['notes', 210, 170, {}]] },
                word: ["nay", "Qamish yoki yog'ochdan yasalgan, puflab chalinadigan cholg'u"]
            },
            {
                title: "Tabiat tinglaydi",
                text: "Bir kuni u nay chalganda qo'ylar o'tlashni to'xtatibdi, qushlar sayrashdan to'xtab, jimgina tinglab qolibdi. Hatto oqayotgan soy ham sekinlashgandek bo'libdi.",
                scene: { bg: 'river', time: 'day', items: [['chopon', 120, 300, { pose: 'flute', hold: 'flute' }], ['bird', 250, 244, { kind: 'sparrow' }], ['bird', 290, 240, { kind: 'bluebird', f: 1 }], ['ram', 330, 300, { horns: false, f: 1, s: 0.9 }], ['notes', 170, 180, { n: 4 }]] }
            },
            {
                title: "Tushdagi bobo",
                text: "Kechasi yigitning tushiga oq soqolli bir bobo kiribdi: «Sening navoing sof qalbingdan chiqadi. Endi naying sehrli bo'ladi: u qayg'uni quvonchga aylantiradi. Faqat uni yaxshilik uchun chal!»",
                scene: { bg: 'meadow', time: 'night', items: [['chopon', 120, 300, { seated: true, legLen: 8, mood: 'sleep' }], ['ota', 270, 250, { s: 0.8, glow: '#e0f2fe', op: 0.9, pose: 'reach' }], ['sparkles', 270, 180, { w: 120, h: 100, n: 8 }]] },
                question: { q: "Sehrli nayni nima uchun chalish kerak edi?", a: ["Faqat yaxshilik uchun", "Maqtanish uchun"], ok: 0 }
            },
            {
                title: "Cho'zilgan qish",
                text: "O'sha yili qish juda uzoq cho'zilibdi. Bahor kelmay, qishloq ahli g'amgin bo'libdi, bolalar ham o'ynamay qo'yishibdi. Hamma iliq quyoshni sog'inibdi.",
                scene: { bg: 'village', time: 'storm', season: 'winter', fx: ['snow'], items: [['tree', 60, 264, { kind: 'bare', season: 'winter' }], ['kid1', 150, 304, { mood: 'sad' }], ['ona', 230, 302, { mood: 'sad' }], ['buvi', 318, 302, { mood: 'sad', cane: true }]] }
            },
            {
                title: "Tog' cho'qqisida",
                text: "Cho'pon yigit tog' cho'qqisiga chiqib, bor mehrini bag'ishlab nay chalibdi. Navo shamolga qo'shilib, butun vodiyga taralibdi.",
                scene: { bg: 'peak', time: 'winter', season: 'winter', fx: ['snow'], items: [['rays', 200, 180, { r: 110 }], ['chopon', 200, 276, { pose: 'flute', hold: 'flute', s: 1.2 }], ['notes', 150, 170, { n: 4 }], ['notes', 270, 150, { n: 3 }]] }
            },
            {
                title: "Bahor keldi!",
                text: "Nay sadosidan qorlar eriy boshlabdi, soylar jildirab oqibdi, daraxtlar kurtak chiqaribdi. Qaldirg'ochlar uchib kelib, qirlarda lolalar ochilibdi — bahor kelibdi!",
                scene: { bg: 'meadow', time: 'morning', season: 'spring', fx: ['petals'], items: [['tree', 70, 258, { kind: 'blossom' }], ['tulips', 290, 300, { n: 7, w: 90 }], ['snowdrops', 130, 306, {}], ['chopon', 206, 302, { pose: 'flute', hold: 'flute' }], ['bird', 300, 110, { kind: 'swallow', fly: true, s: 1.3 }], ['notes', 250, 180, {}]] },
                word: ["lola", "Bahorda qirlarda ochiladigan qizil gul"]
            },
            {
                title: "Oqshomgi davra",
                text: "Qishloq ahli quvonib, cho'ponni boshlariga ko'tarishibdi. Endi har oqshom hamma bir joyga yig'ilib, uning navosini tinglaydigan bo'libdi. Yigit esa hech qachon kibrlanmabdi.",
                scene: { bg: 'village', time: 'dusk', season: 'spring', items: [['fire', 90, 306, {}], ['chopon', 206, 302, { pose: 'flute', hold: 'flute' }], ['kid2', 140, 308, { noLegs: true, mood: 'joy' }], ['kid1', 280, 308, { noLegs: true, mood: 'joy' }], ['buvi', 340, 304, { mood: 'joy' }], ['notes', 240, 180, {}]] }
            },
            {
                title: "Abadiy bahor vodiysi",
                text: "Shu kundan beri o'sha vodiyda bahor hamisha erta kelar ekan. San'at va musiqa qalblarni isitadi, odamlarni birlashtiradi. Yaxshi niyat bilan chalingan kuy — eng kuchli sehr ekan!",
                scene: { bg: 'meadow', time: 'day', season: 'spring', rainbow: true, fx: ['petals'], items: [['kid1', 110, 304, { pose: 'cheer', mood: 'joy' }], ['kid2', 170, 304, { pose: 'cheer', mood: 'joy' }], ['chopon', 250, 302, { pose: 'flute', hold: 'flute' }], ['kid4', 320, 304, { pose: 'wave', mood: 'joy' }], ['notes', 280, 180, {}]] }
            }
        ]
    },

    zumrad_buloq: {
        title: "Sehrli Buloq Sirlari",
        category: "folk",
        tag: "Xalq ertagi • Tabiatni asrash",
        hue: "#0e7490",
        moral: "Tabiat bizga mehr bersa, biz ham unga mehr berishimiz kerak. Toza buloq — hayot manbai.",
        cover: { bg: 'lake', time: 'day', season: 'spring', items: [['tree', 70, 258, { kind: 'willow' }], ['fish', 210, 262, { s: 0.9 }], ['nodira', 310, 302, { pose: 'hold', hold: 'sapling', mood: 'joy', s: 1.1 }], ['sparkles', 200, 262, { w: 180, h: 20 }]] },
        quiz: {
            q: "Buloqni kim va qanday qutqardi?",
            a: ["Sehrli pari o'zi tozalab qo'ydi", "Nodira va do'stlari tozalab, daraxt ekib qutqarishdi", "Buloq o'z-o'zidan tozalandi"],
            ok: 1
        },
        pages: [
            {
                title: "Vodiyning yuragi",
                text: "Tog'lar orasidagi ko'm-ko'k vodiyda sehrli buloq bor ekan. Uning suvi shunday tiniq ekanki, tubidagi toshlar oynadek yarqirab ko'rinarkan. Keksalar: «Bu buloq — vodiyning yuragi», deyisharkan.",
                scene: { bg: 'lake', time: 'morning', season: 'spring', items: [['tree', 60, 258, { kind: 'willow' }], ['tree', 350, 256, { kind: 'blossom', s: 0.9 }], ['fish', 180, 264, { s: 0.7 }], ['fish', 250, 272, { s: 0.6, gold: false, f: 1 }], ['flowers', 120, 300, { w: 80 }], ['sparkles', 200, 266, { w: 200, h: 20 }]] },
                word: ["buloq", "Yer ostidan otilib chiqadigan toza suv manbai"]
            },
            {
                title: "Hayot suvi",
                text: "Buloq suvidan ichgan qushlar sayroq, bog'lar hosildor, odamlar sog'lom bo'larkan. Hamma buloqni ardoqlab, atrofini toza saqlarkan.",
                scene: { bg: 'lake', time: 'day', season: 'summer', items: [['tree', 60, 258, { kind: 'apple' }], ['bird', 130, 284, { kind: 'bluebird' }], ['bird', 280, 282, { kind: 'sparrow', f: 1 }], ['ona', 340, 304, { pose: 'hold', hold: 'jug' }]] }
            },
            {
                title: "Unutilgan buloq",
                text: "Yillar o'tib, odamlar buloqni unutib qo'yishibdi. Uning atrofiga axlat tashlab, daraxtlarni kesib tashlashibdi. Buloq suvi loyqalanib, kun sayin kamayib boribdi.",
                scene: { bg: 'lake', time: 'storm', murky: true, season: 'dry', clouds: 4, items: [['stump', 70, 290, { s: 1.3 }], ['stump', 330, 292, { s: 1.1 }], ['trash', 150, 302, {}], ['trash', 260, 306, { f: 1 }], ['tree', 380, 262, { kind: 'dry', s: 0.8 }]] },
                question: { q: "Tabiatga axlat tashlash yaxshimi?", a: ["Yo'q, bu tabiatga zarar keltiradi", "Ha, hech narsa qilmaydi"], ok: 0 }
            },
            {
                title: "Nodiraning ko'z yoshlari",
                text: "Bir kuni Nodira ismli qizcha buvisi bilan buloq boshiga kelibdi. Buvisi xo'rsinib: «Bolaligimda bu yer jannatdek edi», — debdi. Nodiraning ko'zlari yoshga to'libdi.",
                scene: { bg: 'lake', time: 'day', murky: true, season: 'dry', items: [['stump', 330, 292, { s: 1.1 }], ['trash', 60, 302, {}], ['nodira', 160, 304, { mood: 'cry', s: 1.1 }], ['buvi', 250, 302, { mood: 'sad', cane: true }]] }
            },
            {
                title: "Buloq parisi",
                text: "Kechasi Nodiraning tushiga buloq parisi kiribdi: «Qizim, meni faqat sizlar qutqara olasiz. Suvimni tozalang, atrofimga ko'chat eking — men yana jonlanaman», — debdi.",
                scene: { bg: 'lake', time: 'night', murky: true, items: [['nodira', 90, 304, { seated: true, legLen: 8, mood: 'sleep' }], ['pari', 240, 230, { glow: true, s: 1.1 }], ['sparkles', 240, 170, { w: 140, h: 100, n: 9 }]] },
                word: ["ko'chat", "Yerga ekish uchun tayyorlangan yosh nihol"]
            },
            {
                title: "Hashar",
                text: "Ertasi kuni Nodira sinfdoshlarini yig'ibdi. Bolalar buloq atrofini tozalashibdi, qurigan ariqlarni ochib, yuzta ko'chat ekishibdi. Ularni ko'rib, kattalar ham hasharga qo'shilibdi.",
                scene: { bg: 'lake', time: 'morning', season: 'spring', items: [['nodira', 90, 304, { pose: 'hold', hold: 'sapling', mood: 'joy' }], ['kid1', 180, 304, { hold: 'shovel', mood: 'joy' }], ['kid3', 264, 304, { pose: 'hold', hold: 'sapling', mood: 'happy' }], ['dehqon2', 344, 302, { mood: 'joy' }]] },
                question: { q: "Tabiatni asrash uchun biz nima qila olamiz?", a: ["Daraxt ekib, atrofni toza saqlaymiz", "Hech narsa qilolmaymiz"], ok: 0 },
                word: ["hashar", "Hamma birgalikda, beg'araz bajaradigan xayrli ish"]
            },
            {
                title: "Buloq jonlandi!",
                text: "Bahorga kelib, buloqning ko'zi yana ochilibdi! Suv jildirab oqibdi, baliqchalar o'ynabdi, ekilgan ko'chatlar gullab, qushlar qaytib kelibdi.",
                scene: { bg: 'lake', time: 'day', season: 'spring', rainbow: true, items: [['tree', 60, 258, { kind: 'blossom' }], ['tree', 348, 258, { kind: 'blossom', s: 0.9 }], ['fish', 200, 262, { s: 0.8 }], ['gush', 200, 272, { s: 0.8 }], ['bird', 120, 110, { kind: 'swallow', fly: true, s: 1.2 }], ['sparkles', 200, 266, { w: 200, h: 20 }]] }
            },
            {
                title: "Buloq bayrami",
                text: "Shundan beri vodiy bolalari har yili buloq bayramini o'tkazib, yangi daraxtlar ekisharkan. Tabiat bizga mehr bersa, biz ham unga mehr berishimiz kerak ekan!",
                scene: { bg: 'lake', time: 'sunset', season: 'spring', fx: ['petals'], items: [['nodira', 110, 304, { pose: 'cheer', mood: 'joy' }], ['kid1', 176, 304, { pose: 'cheer', mood: 'joy' }], ['kid2', 244, 304, { pose: 'cheer', mood: 'joy' }], ['kid3', 310, 304, { pose: 'wave', mood: 'joy' }], ['hearts', 210, 170, {}]] }
            }
        ]
    },

    oltin_baliq: {
        title: "Saxiy Baliq",
        category: "folk",
        tag: "Xalq ertagi • Saxiylik",
        hue: "#b45309",
        moral: "Saxiy odamning yaxshiligi qaytib, butun elga baraka keltiradi.",
        cover: { bg: 'river', time: 'morning', items: [['fish', 230, 272, { s: 1.4 }], ['baliqchi', 110, 304, { pose: 'reach', mood: 'joy' }], ['sparkles', 230, 262, { w: 80, h: 40 }]] },
        quiz: {
            q: "Chol oltin baliqdan nima so'radi?",
            a: ["O'ziga saroy va oltin", "Qishloqqa suv va baraka", "Hech narsa so'ramadi va qaytib kelmadi"],
            ok: 1
        },
        pages: [
            {
                title: "Baliqchi chol",
                text: "Daryo bo'yidagi kichkina kulbada kambag'al baliqchi chol bilan kampir yashar ekan. Chol har kuni tong saharda daryoga to'r tashlar, kampir esa ip yigirar ekan.",
                scene: { bg: 'river', time: 'morning', items: [['hut', 310, 250, { s: 0.85 }], ['baliqchi', 140, 302, { hold: 'net' }], ['kampir', 380, 290, { s: 0.75 }], ['boat', 240, 284, { s: 0.8 }]] }
            },
            {
                title: "To'rdagi mo'jiza",
                text: "Bir kuni chol to'r tashlasa, to'rga yarqiragan oltin baliq ilinibdi. Baliq inson tilida gapiribdi: «Bobojon, meni qo'yib yuboring, men ham sizga yaxshilik qilaman!»",
                scene: { bg: 'river', time: 'day', items: [['baliqchi', 170, 302, { pose: 'hold', hold: 'fish', mood: 'surprised' }], ['glow', 170, 250, { r: 50 }], ['bubble', 280, 150, { text: "Qo'yib yuboring!", size: 12, to: [-80, 70] }]] }
            },
            {
                title: "Erkin suz!",
                text: "Mehribon chol: «Menga hech narsa kerak emas, bolam. Suvingda erkin suzib yur», — deb baliqni daryoga qo'yib yuboribdi. Baliq sho'ng'ib ketibdi-yu, suv yuzida oltin halqalar qolibdi.",
                scene: { bg: 'river', time: 'day', items: [['baliqchi', 130, 302, { pose: 'reach', mood: 'joy' }], ['fish', 260, 276, { s: 1.1 }], ['sparkles', 260, 270, { w: 80, h: 30 }]] },
                question: { q: "Chol nega baliqdan hech narsa so'ramadi?", a: ["U ochko'z emas, mehribon edi", "U baliqni tushunmadi"], ok: 0 }
            },
            {
                title: "Qurg'oqchilik",
                text: "Oradan yillar o'tib, qurg'oqchilik boshlanibdi. Daryo sayozlanib, baliqlar kamayib, qishloq ahli qiynalib qolibdi. Chol esa bor nonini qo'shnilari bilan bo'lishibdi.",
                scene: { bg: 'river', time: 'day', season: 'dry', dry: true, items: [['crack', 90, 306], ['baliqchi', 150, 302, { pose: 'hold', hold: 'bread' }], ['kid4', 250, 304, { mood: 'sad' }], ['ona', 320, 302, { mood: 'sad' }]] },
                word: ["qurg'oqchilik", "Uzoq vaqt yomg'ir yog'may, suv kamayib ketishi"]
            },
            {
                title: "Baliq qaytib keldi",
                text: "Bir tongda chol daryo bo'yiga borsa, oltin baliq suv yuzasiga chiqibdi: «Bobojon, bir paytlar siz meni ozod qilgan edingiz. Endi men sizga yordam beraman. Nima tilaysiz?»",
                scene: { bg: 'river', time: 'morning', season: 'dry', dry: true, items: [['fish', 232, 276, { s: 1.3 }], ['baliqchi', 110, 302, { mood: 'surprised' }], ['bubble', 290, 170, { text: "Nima tilaysiz?", to: [-40, 70] }]] }
            },
            {
                title: "Saxiy tilak",
                text: "Chol o'zi uchun hech narsa so'ramabdi: «Qishlog'imizga suv kerak, bolam. Daryomiz yana to'lib oqsin, hamma to'q bo'lsin». Baliq dumini uch marta silkitibdi.",
                scene: { bg: 'river', time: 'morning', season: 'dry', dry: true, items: [['baliqchi', 120, 302, { pose: 'reach', mood: 'happy' }], ['rays', 260, 262, { r: 90 }], ['fish', 260, 272, { s: 1.3 }], ['sparkles', 260, 240, { w: 90, h: 60 }]] },
                question: { q: "Cholning tilagi qanday tilak edi?", a: ["Faqat o'zi uchun", "Butun el uchun"], ok: 1 }
            },
            {
                title: "Daryo to'ldi!",
                text: "Shu zahoti tog'lardan jilg'alar oqib kelib, daryo to'lib-toshibdi. Baliqlar ko'payibdi, dalalar yashnab, qishloqqa baraka qaytibdi.",
                scene: { bg: 'river', time: 'day', season: 'spring', rainbow: true, items: [['fish', 180, 268, { s: 0.9 }], ['fish', 300, 274, { gold: false, s: 0.8, f: 1 }], ['kid1', 90, 302, { pose: 'cheer', mood: 'joy' }], ['baliqchi', 360, 300, { mood: 'joy', s: 0.9 }]] }
            },
            {
                title: "Baxtli qarilik",
                text: "Qishloq ahli cholning saxiyligini hech qachon unutmabdi. Chol va kampir esa umrining oxirigacha tinch-totuv, baxtli yashabdi. Yaxshilikka yaxshilik har doim qaytar ekan!",
                scene: { bg: 'river', time: 'sunset', items: [['soru', 190, 300, { w: 150 }], ['baliqchi', 160, 272, { noLegs: true, s: 0.85, mood: 'joy' }], ['kampir', 222, 272, { noLegs: true, s: 0.85, mood: 'joy' }], ['fish', 330, 280, { s: 0.7 }], ['hearts', 190, 150, {}]] }
            }
        ]
    },

    quvnoq_chumchuq: {
        title: "Chumchuqning Topqirligi",
        category: "folk",
        tag: "Xalq ertagi • Topqirlik",
        hue: "#a16207",
        moral: "Kichkina bo'lsang ham aqlli bo'l: birlik va topqirlik bor joyda kichiklar ham katta ishlar qiladi.",
        cover: { bg: 'village', time: 'day', items: [['tree', 200, 262, { kind: 'mulberry', s: 1.3 }], ['bird', 200, 150, { kind: 'sparrow', s: 1.8 }]] },
        quiz: {
            q: "Chumchuq qushlarni qanday qutqardi?",
            a: ["Mushuk bilan urishib", "O'z vaqtida ogohlantirib, aql bilan yordam topib", "Uchib ketib, yashirinib"],
            ok: 1
        },
        pages: [
            {
                title: "Chiq-chiq",
                text: "Bir bor ekan, bir yo'q ekan, katta tut daraxtida Chiq-chiq ismli kichkina chumchuq yashar ekan. U qushlarning eng kichigi bo'lsa ham, eng ziyraki ekan.",
                scene: { bg: 'village', time: 'morning', season: 'spring', items: [['tree', 200, 266, { kind: 'mulberry', s: 1.35 }], ['bird', 150, 176, { kind: 'bluebird' }], ['bird', 250, 166, { kind: 'robin', f: 1 }], ['bird', 204, 132, { kind: 'sparrow', s: 1.4 }]] },
                word: ["ziyrak", "Hamma narsani tez payqaydigan, sezgir"]
            },
            {
                title: "Don izlab",
                text: "Kuz kelib, don kamayibdi. Chiq-chiq do'stlari uchun don izlab uzoq dalalarga uchibdi. U bug'doyzor chetida to'kilib qolgan donlarni topibdi.",
                scene: { bg: 'field', time: 'day', season: 'autumn', items: [['wheat', 80, 300, { n: 9 }], ['wheat', 320, 304, { n: 8 }], ['grain', 200, 308], ['bird', 200, 170, { kind: 'sparrow', fly: true, hold: 'seed', s: 1.7 }]] }
            },
            {
                title: "Pusib yotgan mushuk",
                text: "Qaytayotib, u butalar orasida pusib yotgan mushukni ko'rib qolibdi. Mushuk qushlar yig'iladigan joyga qarab, dumini likillatib turgan ekan.",
                scene: { bg: 'village', time: 'day', items: [['cat', 250, 300, { pose: 'pounce', mood: 'angry' }], ['bush', 330, 308, { s: 1.3 }], ['bird', 130, 130, { kind: 'sparrow', fly: true, s: 1.5 }], ['mark', 160, 100, { ch: '!' }]] }
            },
            {
                title: "«Chiq-chiq! Xavf!»",
                text: "Chiq-chiq tezda uchib borib, baland ovozda chirqillabdi: «Chiq-chiq! Xavf! Hamma daraxtga!» Qushlar pir etib uchib, baland shoxlarga qo'nishibdi. Mushuk quruq qolibdi.",
                scene: { bg: 'village', time: 'day', items: [['cat', 200, 300, { pose: 'pounce', mood: 'surprised' }], ['bird', 90, 110, { kind: 'bluebird', fly: true, s: 1.3, f: 1 }], ['bird', 160, 80, { kind: 'robin', fly: true, s: 1.2, f: 1 }], ['bird', 270, 96, { kind: 'dove', fly: true, s: 1.3 }], ['bird', 330, 130, { kind: 'sparrow', fly: true, s: 1.4 }], ['bubble', 330, 70, { text: "Xavf!", to: [0, 40] }]] },
                question: { q: "Xavfni ko'rsangiz, nima qilish kerak?", a: ["Darhol boshqalarni ogohlantirish", "Indamay turish"], ok: 0 }
            },
            {
                title: "Daraxtga tirmashgan mushuk",
                text: "Mushuk alamidan: «Baribir sizlarni tutaman!» — deb daraxtga tirmashibdi. Qushlar vahimaga tushibdi. Shunda kichkina Chiq-chiq bir fikr topibdi.",
                scene: { bg: 'village', time: 'day', items: [['tree', 210, 270, { s: 1.3 }], ['cat', 214, 226, { pose: 'pounce', rot: -72, s: 0.85 }], ['bird', 160, 150, { kind: 'bluebird', mood: 'scared' }], ['bird', 260, 140, { kind: 'robin', f: 1, mood: 'scared' }], ['bird', 330, 110, { kind: 'sparrow', fly: true, s: 1.4 }], ['think', 330, 60, { text: '!', size: 18 }]] }
            },
            {
                title: "Yordamga it bobo",
                text: "Chiq-chiq keksa itning oldiga uchib borib: «It bobo, mushuk bizga hujum qilyapti, yordam bering!» — debdi. It hurib kelishi bilan mushuk daraxtdan sakrab, qochib qolibdi.",
                scene: { bg: 'village', time: 'day', items: [['dog', 120, 300, { pose: 'run', bark: true }], ['cat', 300, 300, { pose: 'pounce', mood: 'scared' }], ['motion', 360, 280, {}], ['bird', 210, 120, { kind: 'sparrow', fly: true, s: 1.4 }], ['burst', 120, 170, { text: 'Vov!', r: 22 }]] },
                question: { q: "Qiyin paytda nima qilgan ma'qul?", a: ["Yordam so'rash", "Yolg'iz qolib yig'lash"], ok: 0 }
            },
            {
                title: "Adolatli ulush",
                text: "Qushlar chumchuq topgan donlarni adolat bilan bo'lishibdi. Kichkina chumchuqqa: «Sen kichkina bo'lsang ham, aqling katta ekan!» — deb rahmat aytishibdi.",
                scene: { bg: 'village', time: 'day', items: [['grain', 200, 300, { s: 2 }], ['bird', 150, 300, { kind: 'bluebird' }], ['bird', 250, 300, { kind: 'robin', f: 1 }], ['bird', 120, 280, { kind: 'dove' }], ['bird', 280, 280, { kind: 'sparrow', f: 1 }], ['bird', 200, 270, { kind: 'sparrow', s: 1.4 }], ['hearts', 200, 200, { n: 2 }]] }
            },
            {
                title: "Qushlar maskani",
                text: "Shundan beri qushlar bir-biriga qarashib, xavfni ko'rgan birinchi bo'lib boshqalarni ogohlantirar ekan. Birlik va topqirlik bor joyda kichkinalar ham katta ishlar qila olar ekan!",
                scene: { bg: 'village', time: 'sunset', items: [['tree', 200, 268, { kind: 'mulberry', s: 1.4 }], ['bird', 140, 170, { kind: 'bluebird' }], ['bird', 260, 164, { kind: 'robin', f: 1 }], ['bird', 180, 130, { kind: 'dove' }], ['bird', 222, 110, { kind: 'sparrow', s: 1.4 }], ['hearts', 300, 110, {}]] }
            }
        ]
    },

    bahor_elchisi: {
        title: "Navro'z Sadosi",
        category: "folk",
        tag: "Bayram ertagi • An'analar",
        hue: "#15803d",
        moral: "Navro'z — yangilanish, mehr va do'stlik bayrami. Tabiat uyg'ongani kabi qalblarimiz ham uyg'onadi.",
        cover: { bg: 'meadow', season: 'spring', fx: ['petals'], items: [['tree', 300, 256, { kind: 'blossom' }], ['kid2', 170, 302, { hold: 'snowdrop', pose: 'wave', mood: 'joy', s: 1.15 }], ['snowdrops', 90, 308, {}]] },
        quiz: {
            q: "Navro'z qanday bayram?",
            a: ["Yangilanish, mehr va do'stlik bayrami", "Faqat shirinlik yeyiladigan kun", "Qish bayrami"],
            ok: 0
        },
        pages: [
            {
                title: "Navro'z qachon keladi?",
                text: "Qishning so'nggi kunlarida mahalla bolalari sabrsizlanib: «Navro'z qachon keladi?» — deb so'rashardi. Buvijon kulib: «Kunduz bilan tun tenglashganda, Navro'z eshik qoqadi», — dedi.",
                scene: { bg: 'yard', time: 'day', season: 'winter', items: [['buvi', 252, 302, { pose: 'point', cane: false }], ['kid1', 120, 304, { pose: 'think', mood: 'think' }], ['kid2', 176, 304, { mood: 'happy' }], ['snowdrops', 340, 308, {}]] }
            },
            {
                title: "Boychechak",
                text: "Bolalar dalaga chiqib, qor ostidan mo'ralagan birinchi boychechaklarni topishdi. Ular boychechak ko'tarib, uyma-uy yurib, qo'shiq kuylashdi. Qo'ni-qo'shnilar ularga shirinlik ulashdi.",
                scene: { bg: 'meadow', time: 'morning', season: 'spring', items: [['snowdrops', 80, 306, {}], ['snowdrops', 330, 306, { n: 5 }], ['kid2', 160, 304, { hold: 'snowdrop', pose: 'wave', mood: 'joy' }], ['kid1', 236, 304, { hold: 'snowdrop', pose: 'wave', mood: 'joy' }], ['notes', 200, 170, {}]] },
                word: ["boychechak", "Erta bahorda qor ostidan chiqadigan oppoq gul"]
            },
            {
                title: "Mahalla hashari",
                text: "Mahallada hashar boshlandi: ko'chalar supurildi, ariqlar tozalandi, daraxtlarning tanasi oqlandi. Hamma yangi yilni pok va ozoda holda kutib olmoqchi edi.",
                scene: { bg: 'village', time: 'day', season: 'spring', items: [['tree', 70, 262, { kind: 'blossom', trunk: '#f5f1e8' }], ['tree', 340, 258, { kind: 'apricot', trunk: '#f5f1e8', s: 0.9 }], ['ona', 150, 302, { pose: 'sweep', hold: 'broom' }], ['kid3', 222, 304, { hold: 'shovel', mood: 'joy' }], ['dehqon2', 300, 302, { mood: 'happy' }]] },
                question: { q: "Bayramga qanday tayyorlanamiz?", a: ["Atrofni ozoda qilib, bir-birimizga yordam beramiz", "Hech narsa qilmaymiz"], ok: 0 }
            },
            {
                title: "Sumalak kechasi",
                text: "Ayollar bug'doyni undirib, uning maysasidan sumalak qaynata boshlashdi. Sumalak tun bo'yi qaynaydi. Uni navbatma-navbat kovlab, qo'shiqlar aytib, ezgu tilaklar tilashadi.",
                scene: { bg: 'yard', time: 'night', season: 'spring', items: [['qozon', 200, 300, { content: 'sumalak', s: 1.2 }], ['ona', 104, 304, { pose: 'hold', hold: 'stick', mood: 'happy' }], ['buvi', 300, 304, { mood: 'joy' }], ['kid4', 360, 306, { mood: 'joy', s: 0.9 }], ['notes', 150, 160, {}]] },
                word: ["sumalak", "Undirilgan bug'doy maysasidan tun bo'yi qaynatiladigan Navro'z taomi"]
            },
            {
                title: "Omadli toshcha",
                text: "Qozon tubiga niyat qilib toshchalar solinadi. Tongda sumalak tayyor bo'lganda, kimning kosasiga toshcha tushsa — uning niyati ijobat bo'lar emish! Kichkina Madina kosasidan toshcha topib, quvonchdan sakrab ketdi.",
                scene: { bg: 'yard', time: 'morning', season: 'spring', items: [['qozon', 320, 298, { content: 'sumalak', noFire: true }], ['kid4', 140, 304, { pose: 'hold', hold: 'bowl', mood: 'joy', s: 1.1 }], ['kid1', 224, 304, { pose: 'cheer', mood: 'joy' }], ['sparkles', 140, 230, { w: 50, h: 30 }]] }
            },
            {
                title: "Bayram sayli",
                text: "Navro'z kuni hamma bayramona kiyindi. Polvonlar kurash tushdi, bolalar arg'imchoq uchib, varrak uchirishdi. Hamma yoqda karnay-surnay sadolari yangradi.",
                scene: { bg: 'meadow', time: 'day', season: 'spring', fx: ['confetti'], items: [['swing', 310, 304, { rider: 'kid2', riderOpts: { mood: 'joy' } }], ['kite', 150, 90, { to: [-40, 206] }], ['kid1', 110, 304, { pose: 'wave', mood: 'joy' }], ['tulips', 210, 306, { n: 5 }]] },
                word: ["arg'imchoq", "Arqonga osilgan, uchib o'ynaladigan o'rindiq"]
            },
            {
                title: "Mehmondorchilik",
                text: "Qo'ni-qo'shnilar bir-birini ko'rgani borib, dasturxonga sumalak, ko'k somsa va halim tortishdi. Arazlashganlar yarashdi, keksalar esa duo qilishdi.",
                scene: { bg: 'yard', time: 'day', season: 'spring', items: [['soru', 200, 294, { w: 170 }], ['dasturxon', 200, 262, { w: 110 }], ['ona', 70, 304, { pose: 'reach', mood: 'joy' }], ['qoshni', 334, 304, { pose: 'reach', mood: 'joy', f: 1 }]] },
                question: { q: "Bayramda arazlashgan do'stlar nima qilishadi?", a: ["Yarashib, bir-birini kechirishadi", "Arazlashib yuraverishadi"], ok: 0 }
            },
            {
                title: "Qalblar uyg'onadi",
                text: "Kechqurun bolalar buvijondan so'rashdi: «Navro'z nega shuncha quvonchli?» Buvijon: «Chunki Navro'z — yangilanish, mehr va do'stlik bayrami. Tabiat uyg'ongani kabi qalblarimiz ham uyg'onadi», — dedi.",
                scene: { bg: 'meadow', time: 'sunset', season: 'spring', fx: ['petals'], items: [['tree', 320, 256, { kind: 'blossom' }], ['buvi', 196, 302, { pose: 'reach', mood: 'happy' }], ['kid1', 110, 304, { mood: 'joy' }], ['kid2', 270, 304, { mood: 'joy' }], ['hearts', 196, 160, {}]] }
            }
        ]
    }
});
