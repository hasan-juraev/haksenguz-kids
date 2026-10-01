/*
 * Mumtoz adabiyot, Navoiy dostonlari va zamonaviy ertaklar.
 * Navoiy dostonlari (1484, 1499) va Qodiriyning «O'tkan kunlar»i bolalar uchun
 * qayta hikoya qilingan; zamonaviy ertaklar shu ilova uchun yozilgan.
 * «Sariq devni minib» Xudoyberdi To'xtaboyevning asari: uning qisqa matni
 * o'zgartirilmagan (ROADMAP, 8-band).
 */
window.storiesDatabase = window.storiesDatabase || {};

(function () {
    const YELLOW_DEV = { color: '#f7c948', dark: '#c99a1a', bellyColor: '#fff1b0', wings: true };
    // Sevara and Jasur on the flying carpet
    const flyingKids = { riders: [['kid2', -30], ['kid1', 30]] };

    Object.assign(window.storiesDatabase, {
        sariq_dev: {
            title: "Sariq devni minib",
            category: "classic",
            age: [7, 10],
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
            age: [9, 12],
            tag: "Alisher Navoiy • Doston",
            hue: "#1e3a8a",
            moral: "Sabr, sadoqat va mehnatsevarlik — dostonning abadiy sabog'i.",
            cover: { bg: 'mountains', time: 'morning', items: [['horse', 200, 300, { rider: 'farhod', saddle: '#1d4ed8' }]] },
            quiz: {
                q: "Farhod bizga nimani o'rgatadi?",
                a: ["Ilm, mehnat va sadoqatni", "Yolg'on gapirishni", "Mehnatdan qochishni"],
                ok: 0
            },
            pages: [
                {
                    title: "Ilmga chanqoq shahzoda",
                    text: "Qadim zamonda Chin mamlakatining xoqoni uzoq yillar farzand orzu qildi. Nihoyat, unga Farhod ismli o'g'il ato etildi. Farhod juda zehnli bo'lib o'sdi: boshqalar bir yilda o'rganadigan ilmni u bir oyda egallardi.",
                    word: ["xoqon", "Qadimda Chin va turkiy xalqlar podshohining unvoni"],
                    scene: { bg: 'garden', time: 'day', season: 'spring', items: [['palace', 320, 252, { s: 0.5 }], ['tree', 56, 260, { kind: 'apricot' }], ['shoh', 140, 302, { pose: 'heart', mood: 'joy' }], ['farhod', 222, 302, { pose: 'hold', hold: 'book', s: 0.9 }]] }
                },
                {
                    title: "Ustalarning shogirdi",
                    text: "Farhod faqat kitob bilan cheklanmadi. U Boniydan me'morlikni, Moniydan naqqoshlikni, mohir usta Qorandan esa tosh yo'nishni o'rgandi. Tez orada qattiq toshni ham xamirdek yo'na oladigan bo'ldi.",
                    word: ["naqqosh", "Devor va buyumlarga naqsh soladigan usta"],
                    question: { q: "Farhod ustalardan nimalarni o'rgandi?", a: ["Me'morlik, naqqoshlik va tosh yo'nishni", "Faqat qilich chopishni", "Hech narsa o'rganmadi"], ok: 0 },
                    scene: { bg: 'yard', time: 'day', items: [['rock', 252, 304, { big: true }], ['bobo', 344, 302, { pose: 'point', f: 1 }], ['farhod', 150, 302, { pose: 'wave', hold: 'pickaxe', mood: 'joy' }], ['dust', 224, 300]] }
                },
                {
                    title: "To'rt fasl saroylari",
                    text: "Xoqon o'g'liga yilning to'rt fasli uchun to'rtta ajoyib saroy qurdirdi. Ammo Farhodning ko'ngli negadir g'amgin edi. U dunyoning eng katta sirini — o'z taqdirini bilishni istardi.",
                    scene: { bg: 'palace', items: [['farhod', 170, 302, { pose: 'think', mood: 'sad' }], ['shoh', 290, 302, { mood: 'sad', f: 1 }]] }
                },
                {
                    title: "Uzoq safar",
                    text: "Farhod Iskandarning sehrli ko'zgusi haqida eshitdi: unga qaragan odam o'z kelajagini ko'rar ekan. Ko'zguni topish uchun u Yunon yurtiga yo'l oldi. Yo'lda dahshatli ajdaho va yovuz devni yengib, donishmand Suqrotdan maslahat oldi.",
                    word: ["ajdaho", "Ertaklardagi ulkan, olov purkaydigan maxluq"],
                    question: { q: "Iskandar ko'zgusi qanday ko'zgu edi?", a: ["Unga qaragan odam kelajagini ko'rardi", "Oddiy kichkina oyna edi", "Faqat qorong'ida yorishardi"], ok: 0 },
                    scene: { bg: 'mountains', time: 'dusk', items: [['dev', 290, 306, { s: 0.75, mood: 'angry', color: '#4d7c0f', dark: '#365314', bellyColor: '#bef264' }], ['farhod', 130, 302, { pose: 'push', mood: 'angry' }], ['burst', 214, 226, {}]] }
                },
                {
                    title: "Ko'zgudagi sir",
                    text: "Nihoyat, Farhod sehrli ko'zguga qaradi. Unda uzoq Arman yurti ko'rindi: odamlar qattiq toshli tog'dan ariq qazishga urinishardi. Ularning orasida esa Farhod o'zini va go'zal bir qizni ko'rdi.",
                    word: ["ko'zgu", "Oyna: unga qarab o'zingni ko'rasan"],
                    scene: { bg: 'cave', items: [['mirror', 220, 300, { show: 'arman' }], ['farhod', 104, 302, { mood: 'surprised' }], ['bobo', 334, 302, { mood: 'happy', f: 1 }]] }
                },
                {
                    title: "Tog'dagi ariq",
                    text: "Arman yurtining malikasi Mehinbonu el uchun tog'dan suv chiqarmoqchi edi. Ammo ishchilar qattiq tosh tog'ni yora olmay qiynalishardi. Farhod teshasini qo'liga olib, ishga kirishdi: u bir kunda boshqalar bir oyda qiladigan ishni qilardi.",
                    word: ["tesha", "Tosh va yog'och yo'nadigan o'tkir asbob"],
                    question: { q: "Farhod Arman yurtida qanday ish qildi?", a: ["Tog'ni yorib, el uchun ariq qazdi", "Saroyni qo'riqladi", "Ov qildi"], ok: 0 },
                    scene: { bg: 'mountains', time: 'day', items: [['rock', 280, 304, { big: true }], ['gush', 330, 296, { s: 0.8 }], ['dehqon2', 56, 302, { mood: 'surprised', hold: null }], ['farhod', 170, 302, { pose: 'wave', hold: 'pickaxe', mood: 'angry' }], ['dust', 244, 300]] }
                },
                {
                    title: "Shirin",
                    text: "Ariqdan suv shildirab oqib kelganda, Mehinbonuning jiyani Shirin ham uni ko'rgani keldi. Farhod uni darhol tanidi: ko'zguda ko'rgan qiz aynan Shirin edi. Ikki yosh bir-birini ko'rib, ko'ngillari yorishdi.",
                    scene: { bg: 'river', time: 'day', season: 'spring', items: [['ariq', 200, 270, { w: 320 }], ['farhod', 130, 302, { pose: 'heart', mood: 'joy' }], ['shirin', 270, 302, { pose: 'heart', mood: 'joy', f: 1 }], ['hearts', 200, 160, { n: 2 }]] }
                },
                {
                    title: "Ayyor Xusrav",
                    text: "Ammo Eron shohi Xusrav ham Shirinni o'ziga olmoqchi edi. U katta qo'shin bilan keldi, Farhod esa el-yurtni himoya qilib, mardlarcha jang qildi. Xusrav Farhodni halol kurashda yenga olmagach, makr ishlatdi: unga yolg'on xabar yubordi.",
                    question: { q: "Xusrav Farhodni qanday yengmoqchi bo'ldi?", a: ["Makr va yolg'on bilan", "Halol kurashda", "U bilan do'stlashib"], ok: 0 },
                    scene: { bg: 'steppe', time: 'sunset', items: [['xusrav', 280, 302, { pose: 'point', f: 1 }], ['farhod', 130, 302, { pose: 'hips', mood: 'angry' }]] }
                },
                {
                    title: "Mangu qolgan nom",
                    text: "Doston qayg'uli tugaydi: yolg'on xabarga ishongan Farhod ham, Shirin ham hayotdan ko'z yumadi. Ammo Farhod qazigan ariq asrlar osha el dalalariga suv berdi. Alisher Navoiy bu dostonni 1484-yilda yozgan, xalq esa mehnatkash va sadoqatli insonni haligacha Farhodga qiyoslaydi.",
                    word: ["sadoqat", "Do'stga va so'zga oxirigacha vafodor bo'lish"],
                    scene: { bg: 'field', time: 'sunset', items: [['ariq', 200, 300, { w: 300 }], ['wheat', 70, 304, { n: 9 }], ['wheat', 330, 304, { n: 9 }], ['sparkles', 200, 200, { w: 200, h: 60 }]] }
                }
            ]
        },

        navoiy_lison: {
            title: "Lison ut-tayr (Qushlar tili)",
            category: "navoiy",
            age: [7, 12],
            tag: "Alisher Navoiy • Falsafiy doston",
            hue: "#0369a1",
            moral: "Haqiqiy go'zallik va hikmat — birga intilish va o'zini anglashda.",
            cover: { bg: 'sky', time: 'sunset', items: [['simurg', 200, 250, { s: 0.95 }]] },
            quiz: {
                q: "Qushlar Simurg'ni qayerdan topishdi?",
                a: ["O'zlaridan — birga bosib o'tgan yo'lda", "Oltin qafasdan", "Bozordan"],
                ok: 0
            },
            pages: [
                {
                    title: "Qushlar kengashi",
                    text: "Bir kuni dunyoning barcha qushlari katta kengashga yig'ildi. «Har bir elning podshohi bor, bizning esa yo'q», — deyishdi ular. Shunda ular qushlar shohi Simurg'ni izlab topishga qaror qilishdi.",
                    word: ["kengash", "Muhim ishni birga maslahatlashib hal qilish uchun yig'ilish"],
                    scene: { bg: 'meadow', time: 'day', items: [['tree', 200, 262, { kind: 'big' }], ['bird', 200, 304, { kind: 'hoopoe', s: 1.8 }], ['bird', 66, 302, { kind: 'peacock', s: 1.5 }], ['bird', 128, 306, { kind: 'parrot', s: 1.3 }], ['bird', 272, 306, { kind: 'nightingale', s: 1.3, f: 1 }], ['bird', 336, 304, { kind: 'duck', s: 1.4, f: 1 }], ['bird', 150, 176, { kind: 'dove', fly: true, s: 1.2 }], ['bird', 256, 166, { kind: 'swallow', fly: true, s: 1.2, f: 1 }]] }
                },
                {
                    title: "Hudhud — yo'lboshchi",
                    text: "Donishmand Hudhud oldinga chiqdi: «Men Simurg'ning qayerdaligini bilaman. Ammo yo'l uzoq va mashaqqatli: yetti vodiydan o'tishimiz kerak». Qushlar Hudhudni o'zlariga yo'lboshchi qilib saylashdi.",
                    word: ["Hudhud", "Boshida tojdek patlari bor dono qush (popishak)"],
                    question: { q: "Qushlar kimni yo'lboshchi qilib sayladi?", a: ["Donishmand Hudhudni", "Qarg'ani", "Hech kimni"], ok: 0 },
                    scene: { bg: 'mountains', time: 'morning', items: [['rock', 200, 306, { big: true, s: 0.9 }], ['bird', 204, 262, { kind: 'hoopoe', s: 2.2 }], ['bird', 76, 304, { kind: 'dove', s: 1.4 }], ['bird', 136, 306, { kind: 'parrot', s: 1.3 }], ['bird', 280, 306, { kind: 'nightingale', s: 1.3, f: 1 }], ['bird', 340, 304, { kind: 'bluebird', s: 1.4, f: 1 }]] }
                },
                {
                    title: "Bahonalar",
                    text: "Ammo ba'zi qushlar bahona topa boshladi. Bulbul: «Men gulimsiz yashay olmayman», — dedi. To'ti oltin qafasini, Tovus esa o'z chiroyini tashlab ketgisi kelmadi. O'rdak esa: «Men suvdan uzoqlasha olmayman», — deb turib oldi.",
                    word: ["bahona", "Biror ishni qilmaslik uchun o'ylab topilgan sabab"],
                    scene: { bg: 'garden', time: 'day', season: 'spring', items: [['bush', 78, 300, {}], ['flowers', 120, 302, {}], ['bird', 80, 262, { kind: 'nightingale', s: 1.5 }], ['bird', 166, 302, { kind: 'parrot', s: 1.5 }], ['bird', 258, 302, { kind: 'peacock', s: 1.6 }], ['bird', 346, 304, { kind: 'duck', s: 1.5, f: 1 }]] }
                },
                {
                    title: "Hudhudning javobi",
                    text: "Hudhud ularning har biriga ibratli hikoya aytib berdi. «Gul bir haftada so'ladi, qafas esa — qamoqxona, — dedi u. — Haqiqiy go'zallik sening ichingda, uni topish uchun esa yo'lga chiqish kerak». Qushlar uyalib, safarga otlanishdi.",
                    word: ["ibrat", "Boshqalarga saboq bo'ladigan voqea"],
                    question: { q: "Hudhud qushlarga nima dedi?", a: ["Haqiqiy go'zallik ichimizda, uni topish uchun yo'lga chiqish kerak", "Uyda qolinglar", "Gullar hech qachon so'limaydi"], ok: 0 },
                    scene: { bg: 'meadow', time: 'day', items: [['bird', 200, 290, { kind: 'hoopoe', s: 2 }], ['bubble', 200, 150, { text: "Yo'lga chiqaylik!" }], ['bird', 86, 304, { kind: 'nightingale', s: 1.3 }], ['bird', 136, 306, { kind: 'parrot', s: 1.3 }], ['bird', 272, 304, { kind: 'peacock', s: 1.3, f: 1 }], ['bird', 334, 306, { kind: 'duck', s: 1.3, f: 1 }]] }
                },
                {
                    title: "Yetti vodiy",
                    text: "Qushlar birin-ketin yetti vodiydan o'tishdi: Talab, Ishq, Ma'rifat, Istig'no, Tavhid, Hayrat hamda Faqr va Fano vodiylaridan. Bir vodiyda ularni chanqoq, boshqasida qorong'ilik, uchinchisida esa qattiq shamol sinadi.",
                    word: ["vodiy", "Ikki tog' orasidagi keng, pastqam yer"],
                    scene: { bg: 'mountains', time: 'sunset', items: [['bird', 90, 130, { kind: 'hoopoe', fly: true, s: 1.4 }], ['bird', 150, 100, { kind: 'dove', fly: true, s: 1.2 }], ['bird', 210, 130, { kind: 'bluebird', fly: true, s: 1.2 }], ['bird', 270, 96, { kind: 'swallow', fly: true, s: 1.2 }], ['bird', 320, 140, { kind: 'parrot', fly: true, s: 1.2 }], ['bird', 120, 170, { kind: 'nightingale', fly: true, s: 1.1 }]] }
                },
                {
                    title: "Qanotma-qanot",
                    text: "Yo'l shunchalik og'ir ediki, ko'p qushlar yarim yo'ldan qaytib ketdi. Ammo qolganlar bir-biriga yordam berib, qanotma-qanot uchaverishdi. Hudhud ularga dalda berardi: «Birga bo'lsak, albatta yetib boramiz!»",
                    word: ["dalda", "Ruhlantiruvchi, ko'ngil ko'taruvchi so'z"],
                    question: { q: "Qushlar qiyin yo'ldan qanday o'tishdi?", a: ["Bir-biriga yordam berib", "Bir-birini tashlab", "Uxlab"], ok: 0 },
                    scene: { bg: 'desert', time: 'sunset', items: [['bird', 300, 110, { kind: 'hoopoe', fly: true, s: 1.5 }], ['bird', 250, 140, { kind: 'dove', fly: true, s: 1.2 }], ['bird', 200, 160, { kind: 'parrot', fly: true, s: 1.2 }], ['bird', 150, 180, { kind: 'nightingale', fly: true, s: 1.1 }], ['bird', 248, 182, { kind: 'bluebird', fly: true, s: 1.1 }], ['bubble', 300, 60, { text: 'Birga!' }]] }
                },
                {
                    title: "O'ttiz qush",
                    text: "Nihoyat, ming-minglab qushlardan faqat o'ttiztasi Simurg' saroyiga yetib keldi. Ularning patlari to'kilgan, qanotlari charchagan edi. «Simurg' qani?» — deb so'rashdi ular hayajon bilan.",
                    word: ["Simurg'", "Afsonaviy qushlar shohi; forschada «si murg'» — «o'ttiz qush» degani"],
                    scene: { bg: 'palace', items: [['bird', 100, 302, { kind: 'hoopoe', s: 1.6 }], ['bird', 160, 304, { kind: 'parrot', s: 1.3 }], ['bird', 220, 304, { kind: 'dove', s: 1.3 }], ['bird', 280, 304, { kind: 'nightingale', s: 1.3, f: 1 }], ['bird', 330, 302, { kind: 'peacock', s: 1.3, f: 1 }], ['mark', 200, 180, { ch: '?' }]] }
                },
                {
                    title: "Ko'zgudek ko'l",
                    text: "Ularning ro'parasida ko'zgudek tiniq ko'l yarqirab turardi. Qushlar suvga qarashdi va... o'zlarini ko'rishdi! Shunda tushunishdi: Simurg' — mashaqqatli yo'lni sabr bilan birga bosib o'tgan o'zlari ekan.",
                    question: { q: "Qushlar oxirida nimani tushunishdi?", a: ["Simurg' — yo'lni birga bosib o'tgan o'zlari ekan", "Simurg' umuman yo'q ekan", "Ko'lda baliq ko'p ekan"], ok: 0 },
                    scene: { bg: 'lake', time: 'dusk', items: [['simurg', 200, 296, { s: 0.55, op: 0.35 }], ['bird', 104, 292, { kind: 'hoopoe', s: 1.6 }], ['bird', 156, 296, { kind: 'parrot', s: 1.3 }], ['bird', 252, 296, { kind: 'peacock', s: 1.3, f: 1 }], ['bird', 304, 292, { kind: 'dove', s: 1.5, f: 1 }], ['sparkles', 200, 268, { w: 220, h: 20 }]] }
                },
                {
                    title: "Navoiyning hikmati",
                    text: "Alisher Navoiy bu dostonni 1499-yilda, hayotining oxirlarida yozgan. Doston bizga shuni o'rgatadi: buyuk maqsadga yetish uchun sabr, do'stlik va o'z ustingda ishlash kerak.",
                    word: ["maqsad", "Erishmoqchi bo'lgan orzu yoki niyat"],
                    scene: { bg: 'sky', time: 'day', items: [['rays', 200, 180, { r: 150 }], ['simurg', 200, 250, { s: 0.95 }], ['bird', 70, 100, { kind: 'dove', fly: true, s: 1.2 }], ['bird', 340, 90, { kind: 'hoopoe', fly: true, s: 1.2, f: 1 }]] }
                }
            ]
        },

        qodiriy_o_tkan: {
            title: "O'tkan kunlar (Bolalar talqini)",
            category: "classic",
            age: [10, 12],
            tag: "Abdulla Qodiriy • Klassik roman",
            hue: "#9f1239",
            moral: "Ilm, sadoqat va vatanga muhabbat — ajdodlardan qolgan eng qimmat meros.",
            cover: { bg: 'city', time: 'sunset', items: [['horse', 200, 300, { color: '#6b4226', rider: 'otabek', saddle: '#c1121f' }]] },
            quiz: {
                q: "Otabek qanday inson edi?",
                a: ["So'zida turadigan, vatani va oilasini sevadigan", "Yolg'onchi va hasadgo'y", "Dangasa va qo'rqoq"],
                ok: 0
            },
            pages: [
                {
                    title: "Eski Toshkent",
                    text: "Bundan qariyb ikki yuz yil oldin Toshkent loy devorli ko'chalari, gavjum bozorlari va karvonsaroylari bilan mashhur edi. Shu shaharda hurmatli Yusufbek hojining o'g'li Otabek yashardi. U savdogar bo'lib, uzoq shaharlarga mol olib borardi.",
                    word: ["karvonsaroy", "Savdogarlar tunab qoladigan katta mehmonxona"],
                    scene: { bg: 'bazaar', time: 'day', items: [['stall', 70, 300, {}], ['stall', 330, 300, { color: '#2a9d8f' }], ['ota', 166, 302, { mood: 'happy' }], ['otabek', 240, 302, { mood: 'joy', f: 1 }]] }
                },
                {
                    title: "Marg'ilonda",
                    text: "Bir kuni Otabek savdo ishlari bilan Marg'ilonga bordi va karvonsaroyga tushdi. Shaharda u Kumush ismli oqila va go'zal qizni ko'rib qoldi. Kumush Marg'ilonning hurmatli kishisi Mirzakarim qutidorning qizi edi.",
                    word: ["oqila", "Aqlli, dono (qiz yoki ayol haqida)"],
                    question: { q: "Otabek Marg'ilonda kimni uchratdi?", a: ["Kumushni", "Afandini", "Hech kimni"], ok: 0 },
                    scene: { bg: 'city', time: 'day', items: [['otabek', 130, 302, { mood: 'surprised', pose: 'heart' }], ['kumush', 270, 302, { mood: 'happy', f: 1 }], ['hearts', 200, 150, { n: 2 }]] }
                },
                {
                    title: "To'y",
                    text: "Otabek Kumushga uylanmoqchi ekanini aytdi. Ikki oila kelishib, katta to'y bo'ldi. Karnay-surnaylar yangradi, osh tortildi, butun mahalla shodlikka to'ldi.",
                    word: ["karnay", "To'ylarda chalinadigan uzun mis cholg'u"],
                    scene: { bg: 'yard', time: 'day', fx: ['confetti'], items: [['dasturxon', 200, 300, { w: 150 }], ['otabek', 116, 302, { pose: 'cheer', mood: 'joy' }], ['kumush', 286, 302, { pose: 'cheer', mood: 'joy', f: 1 }], ['kid1', 56, 304, { pose: 'cheer', mood: 'joy' }], ['kid4', 348, 304, { pose: 'cheer', mood: 'joy' }]] }
                },
                {
                    title: "Hasadgo'y Homid",
                    text: "Ammo bu baxtni ko'rolmaydigan odam ham bor edi. Hasadgo'y Homid Kumushga o'zi uylanmoqchi bo'lgan edi. U Otabek bilan Kumushni ajratish uchun yovuz reja tuzdi.",
                    word: ["hasad", "Birovning baxtini ko'ra olmaslik"],
                    question: { q: "Homid nega yovuz reja tuzdi?", a: ["Hasad qilgani uchun", "Otabekka yordam bermoqchi bo'lgani uchun", "Zerikkani uchun"], ok: 0 },
                    scene: { bg: 'city', time: 'dusk', items: [['homid', 160, 302, { pose: 'think' }], ['dost', 252, 302, { mood: 'sly', f: 1 }], ['think', 156, 120, { text: '?!' }]] }
                },
                {
                    title: "Soxta xat",
                    text: "Homid Otabekning nomidan soxta xat yozdirib, uni Kumushning oilasiga yubordi. Xatda go'yo Otabek Kumushdan voz kechgandek yozilgan edi. Bu yolg'on xat ikki yosh yurakni bir-biridan uzoqlashtirdi.",
                    word: ["soxta", "Haqiqiy emas, yolg'ondan yasalgan"],
                    scene: { bg: 'room', time: 'day', items: [['kumush', 200, 302, { pose: 'hold', hold: 'scroll', mood: 'cry' }], ['ona', 290, 302, { pose: 'heart', mood: 'sad', f: 1 }]] }
                },
                {
                    title: "Haqiqat yuzaga chiqdi",
                    text: "Otabek bu xatdan bexabar edi va Kumushni sog'inib yurardi. Vaqt o'tib, Homidning yolg'oni fosh bo'ldi. Otabek otini choptirib, yana Marg'ilonga oshiqdi va ikki yosh qayta topishdi.",
                    question: { q: "Yolg'onning oxiri nima bo'ldi?", a: ["Fosh bo'ldi — haqiqat yuzaga chiqdi", "Hech kim bilmay qoldi", "Hamma unga ishonib qoldi"], ok: 0 },
                    scene: { bg: 'city', time: 'morning', items: [['horse', 200, 300, { color: '#6b4226', rider: 'otabek', saddle: '#c1121f', walk: true }], ['motion', 110, 270, { len: 24 }]] }
                },
                {
                    title: "Romanning davomi",
                    text: "Romanda bundan keyin ham ko'p voqealar bo'ladi — ba'zilari quvonchli, ba'zilari juda qayg'uli. Ularni katta bo'lganingizda o'zingiz o'qiysiz. Ammo bir narsa aniq: Otabek doim so'zining ustidan chiqdi, vatanini va oilasini sevdi.",
                    word: ["roman", "Ko'p voqeali, katta badiiy asar"],
                    scene: { bg: 'yard', time: 'sunset', items: [['ota', 86, 302, { mood: 'happy' }], ['otabek', 168, 302, { mood: 'joy' }], ['kumush', 238, 302, { mood: 'joy' }], ['ona', 312, 302, { mood: 'happy', f: 1 }], ['hearts', 204, 160, {}]] }
                },
                {
                    title: "Birinchi o'zbek romani",
                    text: "«O'tkan kunlar»ni Abdulla Qodiriy bundan yuz yildan ko'proq oldin yozgan. Bu — o'zbek adabiyotidagi birinchi roman. Uni bugun ham har bir o'zbek xonadonida sevib o'qishadi.",
                    question: { q: "«O'tkan kunlar» qanday asar?", a: ["O'zbek adabiyotidagi birinchi roman", "Bolalar qo'shig'i", "Topishmoqlar kitobi"], ok: 0 },
                    scene: { bg: 'room', time: 'night', items: [['bigbook', 200, 290, {}], ['kid1', 86, 304, { mood: 'joy' }], ['kid4', 314, 304, { mood: 'joy', f: 1 }]] }
                }
            ]
        },

        sehrli_olma: {
            title: "Sehrli Olma",
            category: "modern",
            age: [4, 6],
            tag: "Zamonaviy ertak • Mehr-oqibat",
            hue: "#047857",
            moral: "Saxovatli bo'lish har doim baxt keltiradi.",
            cover: { bg: 'garden', season: 'spring', items: [['tree', 200, 266, { kind: 'gold', s: 1.3, n: 1 }], ['sparkles', 200, 150, { w: 140, h: 80 }]] },
            quiz: {
                q: "Daraxt Sardorga qanday sirni aytdi?",
                a: ["Sehr bo'lishgan qo'lda", "Sehr olmaning ichida", "Sehr degan narsa yo'q"],
                ok: 0
            },
            pages: [
                {
                    title: "Oltin olma daraxti",
                    text: "Qishloq chetidagi bog'da bir sehrli olma daraxti bor edi. Unda faqat bitta, quyoshdek tovlanadigan oltin olma pishardi. Bu olma faqat mehribon bolaning qo'liga tushadi, deyishardi.",
                    scene: { bg: 'garden', time: 'morning', season: 'spring', items: [['tree', 220, 268, { kind: 'gold', s: 1.3, n: 1 }], ['sparkles', 220, 150, { w: 140, h: 80 }], ['bird', 90, 280, { kind: 'sparrow', s: 1.3 }]] }
                },
                {
                    title: "Sardor",
                    text: "Bir kuni bog'ga Sardor degan bola keldi. U daraxtga qo'l cho'zgan edi, oltin olma o'zi uning kaftiga tushdi! «Voy, endi bu olma meniki!» — deb quvondi Sardor.",
                    word: ["kaft", "Qo'lning ichki tomoni"],
                    scene: { bg: 'garden', time: 'day', season: 'spring', items: [['tree', 262, 268, { kind: 'gold', s: 1.2, n: 0 }], ['kid3', 140, 304, { pose: 'hold', hold: 'goldapple', mood: 'joy', s: 1.1 }], ['sparkles', 150, 220, { w: 50, h: 30, n: 3 }]] }
                },
                {
                    title: "Yig'layotgan qizcha",
                    text: "Uyga qaytayotganda Sardor yo'l chetida yig'lab o'tirgan qizchani ko'rdi. «Nega yig'layapsan?» — deb so'radi u. «Buvim kasal, unga shirin meva olib bormoqchi edim», — dedi qizcha.",
                    question: { q: "Qizcha nega yig'layotgan edi?", a: ["Buvisi kasal bo'lgani uchun", "Qo'g'irchog'i yo'qolgani uchun", "Qorni och bo'lgani uchun"], ok: 0 },
                    scene: { bg: 'village', time: 'day', items: [['kid4', 252, 304, { noLegs: true, mood: 'cry' }], ['kid3', 140, 304, { pose: 'hold', hold: 'goldapple', mood: 'surprised' }]] }
                },
                {
                    title: "Bo'lishish",
                    text: "Sardor bir oz o'ylab turdi-da, olmani ikkiga bo'ldi. Yarmini qizchaga uzatdi: «Ma, buvingga olib bor». Shu payt olmaning ikkala yarmi ham yana butun oltin olmaga aylandi!",
                    question: { q: "Sardor olmani nima qildi?", a: ["Qizcha bilan bo'lishdi", "Yolg'iz o'zi yedi", "Tashlab yubordi"], ok: 0 },
                    scene: { bg: 'village', time: 'day', items: [['rays', 200, 230, { r: 90 }], ['kid3', 150, 304, { pose: 'give', hold: 'goldapple', mood: 'joy' }], ['kid4', 250, 304, { pose: 'reach', mood: 'joy', f: 1 }], ['sparkles', 200, 230, { w: 70, h: 40, n: 5 }]] }
                },
                {
                    title: "Sehrning siri",
                    text: "Sardor hayron qoldi. U olmani yana bo'lishdi — do'stlari Anvar va Laylo bilan. Har safar bo'lishganda, olma ko'payaverdi!",
                    word: ["sehr", "Ertaklardagi g'aroyib kuch"],
                    scene: { bg: 'garden', time: 'day', season: 'spring', items: [['kid1', 110, 304, { pose: 'hold', hold: 'goldapple', mood: 'joy' }], ['kid3', 200, 304, { pose: 'hold', hold: 'goldapple', mood: 'joy' }], ['kid2', 290, 304, { pose: 'hold', hold: 'goldapple', mood: 'joy' }], ['sparkles', 200, 200, { w: 200, h: 50 }]] }
                },
                {
                    title: "Buvining tabassumi",
                    text: "Qizchaning buvisi oltin olmani yeb, darrov tuzala boshladi. U o'rnidan turib, bolalarga issiq non va asal bilan choy qo'ydi. Hamma birga dasturxon atrofida o'tirdi.",
                    scene: { bg: 'room', time: 'day', items: [['dasturxon', 200, 300, { w: 140 }], ['momo', 300, 302, { noLegs: true, mood: 'joy' }], ['kid4', 100, 304, { noLegs: true, mood: 'joy' }], ['kid3', 160, 304, { noLegs: true, mood: 'joy' }]] }
                },
                {
                    title: "Butun qishloq",
                    text: "Ertasiga olmalar butun qishloqqa yetdi: har bir uyga bittadan. Odamlar quvonib, bir-birlariga mehmon bo'lishdi. Qishloqda hech kim yolg'iz qolmadi.",
                    question: { q: "Olmalar nega ko'payaverdi?", a: ["Bolalar ularni bo'lishgani uchun", "Bog'bon ko'p ekkani uchun", "Do'kondan sotib olishgani uchun"], ok: 0 },
                    scene: { bg: 'village', time: 'sunset', fx: ['sparkle'], items: [['rays', 200, 180, { r: 130 }], ['kid1', 120, 304, { pose: 'cheer', mood: 'joy' }], ['kid3', 200, 304, { pose: 'cheer', mood: 'joy' }], ['kid2', 280, 304, { pose: 'cheer', mood: 'joy' }]] }
                },
                {
                    title: "Daraxtning shivirlashi",
                    text: "Kechqurun Sardor bog'ga qaytib, daraxtga rahmat aytdi. Daraxt shitirlab, uning qulog'iga shivirladi: «Sehr menda emas, bo'lishgan qo'lda». Sardor bu so'zlarni bir umr unutmadi.",
                    word: ["shivirlamoq", "Juda sekin, past ovozda gapirmoq"],
                    scene: { bg: 'garden', time: 'dusk', season: 'spring', items: [['tree', 244, 268, { kind: 'gold', s: 1.2, n: 1 }], ['kid3', 120, 304, { pose: 'heart', mood: 'joy' }], ['hearts', 180, 170, {}]] }
                }
            ]
        },

        oy_qiz: {
            title: "Oyqiz Sirlari",
            category: "modern",
            age: [4, 6],
            tag: "Fantastika • Yulduzlar",
            hue: "#4338ca",
            moral: "Orzular sari intilish har doim go'zal.",
            cover: { bg: 'meadow', time: 'night', items: [['beam', 200, 300, { h: 300, w: 80 }], ['oyqiz', 200, 250, { pose: 'wave', s: 1.2 }]] },
            quiz: {
                q: "Oyqiz bolalarga nimani o'rgatdi?",
                a: ["Yulduzlarni: Yetti qaroqchi va Temirqoziqni", "Uxlashni", "Hech narsa"],
                ok: 0
            },
            pages: [
                {
                    title: "Oydan tushgan nur",
                    text: "Yoz kechasi Nodir va Gulnora hovlida yulduzlarni sanab o'tirishardi. Birdan osmondan kumushrang nur tushib, unda kichkina bir qizcha paydo bo'ldi. «Salom! Men — Oyqizman», — dedi u jilmayib.",
                    word: ["kumushrang", "Kumushdek oqish-yaltiroq rang"],
                    scene: { bg: 'village', time: 'night', items: [['beam', 200, 300, { h: 300, w: 80 }], ['oyqiz', 200, 226, { pose: 'wave', s: 1.1 }], ['kid1', 86, 304, { mood: 'surprised' }], ['kid2', 314, 304, { mood: 'surprised', f: 1 }]] }
                },
                {
                    title: "Yerdagi ajoyibotlar",
                    text: "Oyqiz Yerni birinchi marta ko'rayotgan edi. U gullarni hidlab, shirin o'rik tatib, chigirtkalarning chirillashini tinglab hayratlandi. «Oyda bunaqa narsalar yo'q!» — dedi u.",
                    question: { q: "Oyqizni Yerda nimalar hayratlantirdi?", a: ["Gullar, mevalar va chigirtkalar ovozi", "Faqat tosh va chang", "Hech narsa"], ok: 0 },
                    scene: { bg: 'garden', time: 'night', fx: ['fireflies'], items: [['flowers', 130, 300, {}], ['oyqiz', 200, 300, { pose: 'reach', mood: 'joy' }], ['kid2', 300, 304, { mood: 'joy', f: 1 }]] }
                },
                {
                    title: "Yulduzlar xaritasi",
                    text: "Oyqiz ham bolalarga osmonni ko'rsatdi: «Ana, cho'mich shaklidagi yettita yulduz — Yetti qaroqchi. Uning ikki chetki yulduzi esa Temirqoziqni ko'rsatib turadi. Temirqoziq doim shimolda turadi va adashganlarga yo'l ko'rsatadi».",
                    word: ["Temirqoziq", "Qutb yulduzi: doim shimolda turadigan yulduz"],
                    question: { q: "Temirqoziq yulduzi qaysi tomonda turadi?", a: ["Doim shimolda", "Doim janubda", "Dengiz tubida"], ok: 0 },
                    scene: { bg: 'meadow', time: 'night', moonAt: [60, 60], items: [['star', 150, 74, { r: 7 }], ['star', 184, 70, { r: 7 }], ['star', 214, 82, { r: 7 }], ['star', 250, 90, { r: 8 }], ['star', 300, 100, { r: 8 }], ['star', 305, 60, { r: 8 }], ['star', 258, 52, { r: 8 }], ['star', 322, 30, { r: 12, color: '#fff3b0' }], ['oyqiz', 110, 300, { pose: 'point', mood: 'joy' }], ['kid1', 220, 304, { mood: 'surprised' }], ['kid2', 290, 304, { mood: 'joy' }]] }
                },
                {
                    title: "Xira tortgan nur",
                    text: "Tong yaqinlashgani sari Oyqizning nuri xiralasha boshladi. «Quyosh chiqmasdan uyga qaytishim kerak, — dedi u xavotirlanib. — Ammo oy nuri juda uzoqda».",
                    scene: { bg: 'meadow', time: 'dusk', items: [['oyqiz', 200, 300, { mood: 'sad', op: 0.7 }], ['kid1', 110, 304, { mood: 'sad' }], ['kid2', 290, 304, { mood: 'sad', f: 1 }]] }
                },
                {
                    title: "Ko'zgular",
                    text: "Gulnora o'yladi-da: «Keling, ko'zgular bilan oy nurini bu yerga qaytaramiz!» — dedi. Bolalar uydagi barcha ko'zgularni olib chiqishdi. Ko'zgular oy nurini tutib, Oyqizga yo'naltirdi.",
                    word: ["ko'zgu", "Oyna: yorug'likni qaytaradi"],
                    question: { q: "Bolalar Oyqizga qanday yordam berishdi?", a: ["Ko'zgular bilan oy nurini yo'naltirishdi", "Uni yashirib qo'yishdi", "Uxlab qolishdi"], ok: 0 },
                    scene: { bg: 'yard', time: 'night', items: [['mirror', 130, 300, { show: 'moon', s: 0.7 }], ['mirror', 280, 300, { show: 'moon', s: 0.7 }], ['oyqiz', 205, 300, { mood: 'surprised', op: 0.8 }], ['kid1', 64, 304, { pose: 'reach', mood: 'joy' }], ['kid2', 346, 304, { pose: 'reach', mood: 'joy', f: 1 }]] }
                },
                {
                    title: "Nur ko'prigi",
                    text: "Ko'zgulardan qaytgan nur yorug' ko'prik bo'lib, osmonga cho'zildi. Oyqiz ko'prik ustida sakrab-sakrab yuqoriga ko'tarildi. «Rahmat, do'stlarim!» — deb qo'l silkitdi u.",
                    scene: { bg: 'meadow', time: 'night', items: [['beam', 262, 300, { h: 300, w: 60 }], ['oyqiz', 262, 150, { pose: 'wave', mood: 'joy' }], ['kid1', 96, 304, { pose: 'wave', mood: 'joy' }], ['kid2', 160, 304, { pose: 'wave', mood: 'joy' }]] }
                },
                {
                    title: "Oyqizning sovg'asi",
                    text: "Ertasi kechasi bolalar osmonga qarashsa, oy ularga jilmayib turardi. Hovlida esa ikkita kichkina yaltiroq tosh paydo bo'lgandi. Ular qorong'ida xuddi yulduzdek nur sochardi.",
                    word: ["nur sochmoq", "Atrofga yorug'lik tarqatmoq"],
                    scene: { bg: 'meadow', time: 'night', items: [['star', 172, 290, { r: 8 }], ['star', 230, 292, { r: 8, color: '#bde0fe' }], ['kid1', 100, 304, { mood: 'surprised' }], ['kid2', 300, 304, { mood: 'joy', pose: 'heart', f: 1 }], ['sparkles', 200, 278, { w: 90, h: 20 }]] }
                },
                {
                    title: "Orzular sari",
                    text: "O'sha kuni Nodir katta bo'lsa, osmonni o'rganuvchi olim bo'lishga ahd qildi. Gulnora esa har kecha Oyqizga «xayrli tun» tilaydi. Kim biladi, balki bir kun ular Oyda uchrashishar!",
                    word: ["ahd qilmoq", "Qat'iy va'da bermoq"],
                    question: { q: "Nodir kim bo'lishga ahd qildi?", a: ["Osmonni o'rganuvchi olim", "Oshpaz", "Haydovchi"], ok: 0 },
                    scene: { bg: 'peak', time: 'night', items: [['telescope', 240, 272, {}], ['kid1', 170, 282, { mood: 'joy', pose: 'point' }], ['rocket', 330, 90, { s: 0.4, rot: 30 }]] }
                }
            ]
        },

        yulduz_bola: {
            title: "Yulduz Bola",
            category: "modern",
            age: [4, 6],
            tag: "Zamonaviy ertak • Mehribonlik",
            hue: "#ca8a04",
            moral: "Qalbdagi mehribonlik yulduzdek porlab turadi.",
            cover: { bg: 'meadow', time: 'night', items: [['starkid', 200, 220, { s: 1.4 }]] },
            quiz: {
                q: "Yulduzcha bizga qanday sirni o'rgatdi?",
                a: ["Mehribonlik — eng yorug' nur", "Yulduzlar yerda yashaydi", "Nur faqat chiroqda bo'ladi"],
                ok: 0
            },
            pages: [
                {
                    title: "Tushib qolgan yulduzcha",
                    text: "Bir kechasi osmondan kichkina yulduzcha uchib tushdi va Laylo bilan Anvarning hovlisidagi o'rik tagiga yumalab kirdi. Yulduzcha qo'rqib, titrab turardi. Uning nuri juda xira edi.",
                    scene: { bg: 'yard', time: 'night', items: [['tree', 90, 262, { kind: 'apricot' }], ['starkid', 156, 294, { s: 0.6, op: 0.7 }], ['kid2', 252, 304, { mood: 'surprised', f: 1 }], ['kid1', 322, 304, { mood: 'surprised', f: 1 }]] }
                },
                {
                    title: "Mehr bilan",
                    text: "Laylo yulduzchani avaylab qo'liga oldi va ro'molchasiga o'radi. Anvar unga iliq sut olib keldi. Yulduzcha bir oz isindi-yu, nuri sal yorishdi.",
                    question: { q: "Bolalar yulduzchaga qanday yordam berishdi?", a: ["Uni isitib, mehr ko'rsatishdi", "Uni quvib yuborishdi", "Uni yashirib qo'yishdi"], ok: 0 },
                    scene: { bg: 'room', time: 'night', items: [['starkid', 200, 262, { s: 0.6, op: 0.85 }], ['kid2', 136, 304, { pose: 'hold', mood: 'happy' }], ['kid1', 264, 304, { pose: 'give', hold: 'jug', mood: 'happy', f: 1 }]] }
                },
                {
                    title: "Yorug'lik siri",
                    text: "Bolalar sezib qolishdi: kimdir mehribonlik qilsa, yulduzchaning nuri kuchayar ekan! Anvar singlisiga o'yinchog'ini berganda, yulduzcha charaqlab ketdi. Laylo buvisiga choy damlab berganda esa, butun xona yorishdi.",
                    word: ["charaqlamoq", "Juda yorqin porlamoq"],
                    question: { q: "Yulduzchaning nuri qachon kuchayardi?", a: ["Kimdir mehribonlik qilganda", "Kimdir baqirganda", "Yomg'ir yog'ganda"], ok: 0 },
                    scene: { bg: 'room', time: 'night', items: [['rays', 200, 200, { r: 120 }], ['starkid', 200, 222, { s: 0.7 }], ['kid1', 104, 304, { pose: 'give', mood: 'joy' }], ['kid4', 160, 304, { mood: 'joy', f: 1, s: 0.85 }], ['kid2', 270, 304, { pose: 'give', hold: 'bowl', mood: 'joy' }], ['momo', 346, 302, { noLegs: true, mood: 'joy', f: 1 }]] }
                },
                {
                    title: "Butun mahalla",
                    text: "Bu xabar butun mahallaga tarqaldi. Bolalar bir-biriga yordam bera boshlashdi: kimdir qo'shnisining sumkasini ko'tardi, kimdir mushukchaga ovqat berdi. Yulduzcha kundan-kunga yorqinroq porladi.",
                    word: ["mahalla", "Bir-birini yaxshi biladigan qo'shnilar yashaydigan joy"],
                    scene: { bg: 'village', time: 'day', items: [['starkid', 300, 120, { s: 0.6 }], ['kid3', 96, 304, { pose: 'hold', hold: 'bread', mood: 'joy' }], ['momo', 166, 302, { mood: 'joy' }], ['kid4', 250, 304, { pose: 'give', mood: 'joy' }], ['cat', 320, 302, { mood: 'happy', f: 1 }]] }
                },
                {
                    title: "Osmonni sog'inish",
                    text: "Bir kechasi yulduzcha osmonga qarab xo'rsindi. «Opalarim va akalarim meni kutishyapti», — dedi u. Bolalar uni qanday qilib osmonga qaytarishni o'ylay boshlashdi.",
                    scene: { bg: 'yard', time: 'night', items: [['starkid', 200, 236, { s: 0.7 }], ['kid2', 116, 304, { mood: 'sad' }], ['kid1', 292, 304, { mood: 'think', pose: 'think', f: 1 }], ['star', 100, 60, { r: 9 }], ['star', 300, 50, { r: 7 }]] }
                },
                {
                    title: "Mehr bayrami",
                    text: "Shunda butun mahalla bir joyga yig'ildi. Hamma bir-biriga yaxshi so'zlar aytdi, quchoqlashdi va kuldi. Shuncha mehrdan yulduzcha shunday porladiki, xuddi kichkina quyoshga o'xshab qoldi!",
                    question: { q: "Yulduzcha nima uchun quyoshdek porlab ketdi?", a: ["Hamma bir-biriga mehr ko'rsatgani uchun", "Unga chiroq yoqishgani uchun", "U uxlagani uchun"], ok: 0 },
                    scene: { bg: 'village', time: 'night', fx: ['sparkle'], items: [['rays', 200, 160, { r: 150 }], ['starkid', 200, 176, { s: 0.9 }], ['kid1', 76, 304, { pose: 'cheer', mood: 'joy' }], ['kid2', 136, 304, { pose: 'cheer', mood: 'joy' }], ['momo', 270, 302, { mood: 'joy' }], ['kid4', 334, 304, { pose: 'cheer', mood: 'joy' }]] }
                },
                {
                    title: "Xayrlashuv",
                    text: "Yulduzcha ohista ko'tarilib, osmonga qaytdi. «Rahmat! Men har kecha sizlarga eng yorqin nurimni yuboraman», — dedi u. Bolalar unga uzoq qo'l silkitib qolishdi.",
                    scene: { bg: 'meadow', time: 'night', items: [['starkid', 270, 110, { s: 0.7 }], ['kid1', 140, 304, { pose: 'wave', mood: 'happy' }], ['kid2', 200, 304, { pose: 'wave', mood: 'happy' }]] }
                },
                {
                    title: "Har kecha",
                    text: "Endi har kecha Laylo derazadan qarasa, bitta yulduz unga ko'z qisib turadi. Laylo bilan Anvar esa bilishadi: mehribonlik — dunyodagi eng yorug' nur.",
                    word: ["ko'z qismoq", "Bir ko'zni yumib ochib, imo qilmoq"],
                    scene: { bg: 'meadow', time: 'night', fx: ['sparkle'], items: [['star', 300, 90, { r: 14 }], ['kid2', 170, 304, { glow: true, pose: 'heart', mood: 'joy', s: 1.15 }], ['kid1', 240, 304, { pose: 'wave', mood: 'joy' }], ['hearts', 200, 160, {}]] }
                }
            ]
        },

        sirli_sandiq: {
            title: "Buvijonning Sandig'i",
            category: "classic",
            age: [6, 9],
            tag: "Milliy qadriyatlar • Hunarmandlik",
            hue: "#be123c",
            moral: "Milliy qadriyatlarimiz — ajdodlarimizdan qolgan bebaho meros.",
            cover: { bg: 'room', items: [['chest', 200, 300, { state: 'clothes', w: 90, h: 56 }], ['sparkles', 200, 220, { w: 100, h: 50 }]] },
            quiz: {
                q: "Buvijonning sandig'ida nimalar bor edi?",
                a: ["Atlas, do'ppi, so'zana va sopol kosa", "O'yinchoq mashinalar", "Faqat eski gazetalar"],
                ok: 0
            },
            pages: [
                {
                    title: "Samarqandda",
                    text: "Yozgi ta'tilda Malika Seuldan Samarqandga, buvijonining uyiga keldi. Buvijonning xonasida chiroyli, o'ymakor sandiq turardi. «Buvijon, unda nima bor?» — deb so'radi Malika qiziqib.",
                    word: ["sandiq", "Kiyim va qimmatli buyumlar saqlanadigan katta quti"],
                    scene: { bg: 'room', time: 'day', items: [['chest', 170, 302, { w: 86, h: 52 }], ['buvi', 282, 302, { pose: 'point', f: 1, mood: 'joy' }], ['malika', 76, 304, { mood: 'surprised' }]] }
                },
                {
                    title: "Kamalakdek atlas",
                    text: "Buvijon sandiqni ochib, kamalakdek tovlanadigan atlasni chiqardi. «Bu — Marg'ilon atlasi, — dedi u. — Uni ipak qurti tolasidan to'qishadi. Men uni o'z to'yimda kiyganman».",
                    word: ["atlas", "Ipakdan to'qilgan, rang-barang naqshli mato"],
                    question: { q: "Atlas nimadan to'qiladi?", a: ["Ipak qurti tolasidan", "Plastmassadan", "Qog'ozdan"], ok: 0 },
                    scene: { bg: 'room', time: 'day', items: [['chest', 196, 302, { state: 'clothes', w: 86, h: 52 }], ['buvi', 292, 302, { pose: 'hold', hold: 'atlas', mood: 'joy', f: 1 }], ['malika', 96, 304, { pose: 'heart', mood: 'joy' }], ['sparkles', 282, 220, { w: 60, h: 40 }]] }
                },
                {
                    title: "Chust do'ppisi",
                    text: "Keyin qora do'ppi chiqdi — unda oppoq qalampir naqshlari bor edi. «Bu — Chust do'ppisi, bobongniki edi, — dedi buvijon. — Qalampir naqshi yomon ko'zdan asraydi, deyishadi».",
                    word: ["do'ppi", "O'zbeklarning to'rt qirrali milliy bosh kiyimi"],
                    scene: { bg: 'room', time: 'day', items: [['chest', 200, 302, { state: 'clothes', w: 86, h: 52 }], ['malika', 104, 304, { head: 'doppi', hat: '#1f1d2b', pose: 'cheer', mood: 'joy' }], ['buvi', 292, 302, { mood: 'laugh', f: 1 }]] }
                },
                {
                    title: "Gulli so'zana",
                    text: "Sandiq tubida katta, gulli so'zana yotardi. «Buni men yoshligimda o'z qo'lim bilan tikkanman, — dedi buvijon. — Har bir gul — bitta orzu». Malika gullarni sanab chiqdi: naq o'ttiz ikkita!",
                    word: ["so'zana", "Qo'lda gul tikilgan katta devoriy mato"],
                    question: { q: "Buvijon so'zanadagi har bir gulni nima dedi?", a: ["Bitta orzu", "Bitta xato", "Bitta tosh"], ok: 0 },
                    scene: { bg: 'room', time: 'day', items: [['suzani', 214, 212, {}], ['buvi', 316, 302, { pose: 'point', f: 1, mood: 'joy' }], ['malika', 110, 304, { pose: 'point', mood: 'joy' }]] }
                },
                {
                    title: "Rishton kosasi",
                    text: "Eng tagida esa ko'k naqshli sopol kosa bor edi. «Bu — Rishton ustalarining ishi, — dedi buvijon. — Rishtonning ko'k sopol idishlari butun dunyoga mashhur».",
                    word: ["sopol", "Loydan yasab, olovda pishirilgan idish"],
                    scene: { bg: 'room', time: 'day', items: [['table', 200, 302, { w: 110 }], ['kosa', 200, 260, {}], ['malika', 96, 304, { pose: 'reach', mood: 'surprised' }], ['buvi', 304, 302, { noLegs: true, mood: 'happy', f: 1 }]] }
                },
                {
                    title: "Ildiz",
                    text: "Malika o'yga toldi: «Buvijon, Seulda men bularning birortasini ham ko'rmaganman». Buvijon kulimsirab dedi: «Qayerda yashama, bular — sening ildizlaring. Daraxt ildizi bilan mustahkam turadi».",
                    word: ["ildiz", "O'simlikning yer ostidagi qismi; u daraxtni mahkam ushlab turadi"],
                    question: { q: "Buvijon milliy buyumlarni nimaga o'xshatdi?", a: ["Daraxtning ildizlariga", "Bulutga", "Toshga"], ok: 0 },
                    scene: { bg: 'yard', time: 'sunset', items: [['tree', 300, 264, { kind: 'apricot' }], ['buvi', 136, 302, { pose: 'heart', mood: 'happy' }], ['malika', 210, 304, { pose: 'think', mood: 'think' }]] }
                },
                {
                    title: "Buvijonning sovg'asi",
                    text: "Ketish kuni buvijon Malikaga kichkina do'ppi va bir parcha atlas sovg'a qildi. «Bularni Seuldagi do'stlaringga ko'rsat», — dedi u. Malika sovg'alarni bag'riga bosib: «Albatta, buvijon!» — dedi.",
                    scene: { bg: 'yard', time: 'morning', items: [['buvi', 260, 302, { pose: 'give', mood: 'joy', f: 1 }], ['malika', 150, 304, { head: 'girlcap', hat: '#d62839', pose: 'heart', mood: 'joy' }], ['hearts', 206, 170, { n: 2 }]] }
                },
                {
                    title: "Seuldagi ko'rgazma",
                    text: "Seulga qaytgach, Malika sinfda «Mening merosim» darsida do'ppi va atlasni ko'rsatdi. Koreyalik do'stlari ham o'z hanboklarini olib kelishdi. Sinf xuddi kichkina ko'rgazmaga aylandi!",
                    word: ["meros", "Ota-bobolardan qolgan narsa va an'analar"],
                    question: { q: "Malika Seulda nima qildi?", a: ["Sinfdoshlariga do'ppi va atlasni ko'rsatdi", "Sovg'alarni yashirib qo'ydi", "Hech narsa qilmadi"], ok: 0 },
                    scene: { bg: 'classroom', board: ['Mening merosim'], items: [['malika', 120, 304, { head: 'girlcap', hat: '#d62839', pose: 'cheer', mood: 'joy' }], ['seoyeon', 194, 304, { outfit: 'chima', color: '#ef476f', jacket: '#ffd166', saekdong: true, trim: '#3a86ff', goreum: '#3a86ff', mood: 'joy' }], ['minjun', 262, 304, { outfit: 'hanbok', color: '#e9f5db', trim: '#2a9d8f', goreum: '#2a9d8f', pants: '#e6dfcd', pose: 'cheer', mood: 'joy' }], ['kimteacher', 338, 302, { mood: 'joy', f: 1 }]] }
                }
            ]
        },

        shox_va_dehqon: {
            title: "Shoh va Dehqon",
            category: "classic",
            age: [6, 10],
            tag: "Sharq hikmati • Mehnat va saxovat",
            hue: "#7c2d12",
            moral: "Bizdan oldingilar ekdi — biz yedik; biz ekamiz — bizdan keyingilar yeydi.",
            cover: { bg: 'field', time: 'sunset', items: [['tree', 326, 264, { kind: 'big', s: 0.8 }], ['shoh', 150, 302, { mood: 'happy' }], ['chol', 236, 302, { pose: 'hold', hold: 'sapling', mood: 'joy', f: 1, cane: false }]] },
            quiz: {
                q: "Bu hikoyadan qanday saboq olamiz?",
                a: ["Kelajak uchun yaxshilik qilish kerak", "Faqat o'zing uchun ishlash kerak", "Daraxt ekish befoyda"],
                ok: 0
            },
            pages: [
                {
                    title: "Odil shoh",
                    text: "Qadim zamonda Nushirvon degan odil shoh bo'lgan ekan. U xalqi qanday yashayotganini o'z ko'zi bilan ko'rish uchun vaziri bilan yurt kezar ekan.",
                    word: ["odil", "Adolatli, hammaga to'g'ri munosabatda bo'ladigan"],
                    scene: { bg: 'village', time: 'morning', items: [['horse', 160, 300, { rider: 'shoh', saddle: '#9d0208', walk: true }], ['vazir', 284, 302, { mood: 'happy' }]] }
                },
                {
                    title: "Ko'chat ekayotgan chol",
                    text: "Bir kuni shoh yo'lda sochi oppoq, juda keksa bir cholni ko'rib qolibdi. Chol egilib, yerga yong'oq ko'chatini ekayotgan ekan. Uning qo'llari qaltirasa ham, ishini mehr bilan qilarkan.",
                    word: ["ko'chat", "Yangi o'tqazilgan yosh daraxt"],
                    scene: { bg: 'field', time: 'day', items: [['tree', 236, 302, { kind: 'round', s: 0.24 }], ['chol', 180, 302, { pose: 'sweep', hold: 'ketmon', mood: 'happy', cane: false }], ['shoh', 330, 302, { f: 1, mood: 'surprised' }]] }
                },
                {
                    title: "Shohning savoli",
                    text: "Shoh hayron bo'lib so'rabdi: «Ota, yong'oq yigirma yildan keyin hosil beradi. Uning mevasini yeyishga ulgurarmikansiz?» Vazir ham kulib qo'yibdi: chol behuda ovora bo'lyapti, deb o'ylabdi.",
                    question: { q: "Shoh nega hayron bo'ldi?", a: ["Chol mevasini ko'rmaydigan daraxt ekayotgani uchun", "Chol juda yosh bo'lgani uchun", "Yong'oq ekish taqiqlangani uchun"], ok: 0 },
                    scene: { bg: 'field', time: 'day', items: [['tree', 176, 302, { kind: 'round', s: 0.24 }], ['chol', 120, 302, { pose: 'sweep', hold: 'ketmon', mood: 'happy', cane: false }], ['shoh', 244, 302, { f: 1, pose: 'shrug', mood: 'surprised' }], ['vazir', 328, 302, { f: 1, mood: 'laugh' }], ['mark', 244, 160, { ch: '?' }]] }
                },
                {
                    title: "Dono javob",
                    text: "Chol jilmayib javob beribdi: «Bizdan oldingilar ekdilar — biz yedik. Biz ekamiz — bizdan keyingilar yeydi». Bu javob shohga juda yoqib qolibdi.",
                    question: { q: "Chol daraxtni kim uchun ekardi?", a: ["Bizdan keyingilar — kelajak avlod uchun", "Faqat o'zi uchun", "Shoh uchun"], ok: 0 },
                    scene: { bg: 'field', time: 'day', items: [['tree', 196, 302, { kind: 'round', s: 0.24 }], ['chol', 140, 302, { pose: 'point', mood: 'joy' }], ['shoh', 262, 302, { f: 1, pose: 'heart', mood: 'joy' }], ['bubble', 140, 120, { text: 'Biz ekamiz!' }]] }
                },
                {
                    title: "Birinchi hosil",
                    text: "Shoh mamnun bo'lib, cholga bir hamyon oltin hadya qilibdi. Chol quvonib: «Qarang, ko'chatim darrov hosil berdi!» — debdi. Shoh kulib yuboribdi va unga yana bir hamyon oltin beribdi.",
                    word: ["hamyon", "Pul soladigan kichkina xalta"],
                    scene: { bg: 'field', time: 'day', items: [['chol', 150, 302, { pose: 'hold', hold: 'moneybag', mood: 'joy', cane: false }], ['shoh', 262, 302, { f: 1, pose: 'give', mood: 'laugh' }], ['coins', 200, 302, {}], ['sparkles', 150, 210, { w: 60, h: 30 }]] }
                },
                {
                    title: "Ikki marta hosil",
                    text: "Chol yana debdi: «Boshqalarning daraxti yilda bir marta hosil beradi, mening ko'chatim esa bir kunda ikki marta hosil berdi!» Shoh qah-qah otib kulibdi va uchinchi hamyonni ham beribdi.",
                    question: { q: "Chol nega «ko'chatim ikki marta hosil berdi» dedi?", a: ["Shoh unga ikki marta oltin bergani uchun", "Ko'chatda olma pishgani uchun", "U adashib qolgani uchun"], ok: 0 },
                    scene: { bg: 'field', time: 'day', items: [['chol', 150, 302, { pose: 'cheer', mood: 'laugh', cane: false }], ['shoh', 262, 302, { f: 1, pose: 'hips', mood: 'laugh' }], ['coins', 140, 302, {}], ['coins', 184, 304, {}]] }
                },
                {
                    title: "Ketaylik!",
                    text: "Shoh vaziriga qarab: «Ketaylik! Yana gaplashsak, bu dono chol xazinamni bo'shatib qo'yadi», — debdi kulib. Bu voqea butun yurtga tarqalib, odamlar mehnat va saxovatni yanada qadrlay boshlabdi.",
                    word: ["saxovat", "Bor narsasini boshqalar bilan quvonib bo'lishish"],
                    scene: { bg: 'village', time: 'sunset', items: [['horse', 250, 300, { rider: 'shoh', saddle: '#9d0208', walk: true }], ['vazir', 344, 302, { mood: 'laugh' }], ['chol', 90, 302, { pose: 'wave', mood: 'joy' }]] }
                },
                {
                    title: "Yong'oq soyasida",
                    text: "Yillar o'tib, cholning ko'chati baland yong'oq daraxtiga aylanibdi. Uning soyasida bolalar o'ynab, mevasidan butun qishloq bahramand bo'libdi. Chunki yaxshi niyat bilan ekilgan daraxt hammaga xizmat qiladi.",
                    word: ["bahramand", "Biror narsadan foyda va zavq olgan"],
                    question: { q: "Yong'oq daraxti kimlarga xizmat qildi?", a: ["Butun qishloqqa", "Faqat cholga", "Hech kimga"], ok: 0 },
                    scene: { bg: 'village', time: 'day', season: 'summer', items: [['tree', 220, 268, { kind: 'big', s: 1.2 }], ['kid1', 104, 304, { pose: 'cheer', mood: 'joy' }], ['kid2', 164, 304, { mood: 'joy' }], ['kid4', 300, 304, { pose: 'cheer', mood: 'joy', f: 1 }]] }
                }
            ]
        },

        sehrli_gilam: {
            title: "Sehrli Gilam Sayohati",
            category: "modern",
            age: [5, 8],
            tag: "Fantastik sarguzasht • O'zbekiston bo'ylab",
            hue: "#0f766e",
            moral: "Tariximizni o'rganish va sayohat qilish maroqli.",
            cover: { bg: 'city', time: 'day', items: [['carpet', 200, 150, flyingKids]] },
            quiz: {
                q: "Sehrli gilam bolalarni qayerlarga olib bordi?",
                a: ["O'zbekistonning qadimiy shaharlariga", "Oyga", "Dengiz tubiga"],
                ok: 0
            },
            pages: [
                {
                    title: "Bobomning gilami",
                    text: "Yozgi ta'tilda Sevara va Jasur bobosinikiga mehmon bo'lishdi. Omborxonada ular chang bosgan eski gilamni topishdi. Uni qoqishgan edi, gilam birdan havoga ko'tarildi!",
                    word: ["gilam", "Polga yoki devorga solinadigan qalin, naqshli to'qima"],
                    scene: { bg: 'yard', time: 'day', items: [['carpet', 200, 196, Object.assign({ s: 0.9 }, flyingKids)], ['dust', 170, 290], ['dust', 240, 294]] }
                },
                {
                    title: "Samarqand",
                    text: "Gilam ularni ko'k gumbazli Samarqandga olib uchdi. Pastda Registon maydoni yarqirab turardi: uchta ulkan madrasa bir-biriga qarab turibdi. «Eng qadimgisi — Ulug'bek madrasasi — olti yuz yil oldin qurilgan!» — dedi Jasur.",
                    word: ["madrasa", "Qadimgi o'quv yurti, katta maktab"],
                    question: { q: "Registon maydoni qaysi shaharda?", a: ["Samarqandda", "Seulda", "Xivada"], ok: 0 },
                    scene: { bg: 'city', time: 'morning', items: [['palace', 70, 300, { s: 0.55 }], ['palace', 330, 300, { s: 0.55 }], ['palace', 200, 300, { s: 0.7 }], ['carpet', 320, 70, Object.assign({ s: 0.45 }, flyingKids)]] }
                },
                {
                    title: "Yulduzlar bobosi",
                    text: "Keyin ular Ulug'bek rasadxonasi ustidan uchishdi. «Mirzo Ulug'bek shu yerda yulduzlarni kuzatib, mingdan ortiq yulduzning jadvalini tuzgan», — dedi Sevara kitobidan o'qib.",
                    word: ["rasadxona", "Osmon va yulduzlarni kuzatadigan joy (observatoriya)"],
                    question: { q: "Mirzo Ulug'bek rasadxonada nima qilgan?", a: ["Yulduzlarni kuzatgan", "Non yopgan", "Gilam to'qigan"], ok: 0 },
                    scene: { bg: 'city', time: 'day', items: [['rasadxona', 190, 300, {}], ['carpet', 320, 80, Object.assign({ s: 0.45 }, flyingKids)]] }
                },
                {
                    title: "Buxoro",
                    text: "Gilam Buxoroga burildi. U yerda osmonga bo'y cho'zgan Minorai Kalon turardi. Qadimda karvonlar uzoqdan shu minorani ko'rib, yo'l topishgan ekan.",
                    word: ["minora", "Juda baland, ingichka bino"],
                    scene: { bg: 'city', time: 'day', items: [['minaret', 220, 300, { h: 200 }], ['carpet', 90, 100, Object.assign({ s: 0.45 }, flyingKids)]] }
                },
                {
                    title: "Xiva",
                    text: "Keyin ular Xivaga yetib kelishdi. Ichan qal'a devorlari ichida ko'k-yashil Kalta minor yaltirab turardi. «Nega u kalta?» — so'radi Sevara. «Uni qurib bitkazishga ulgurishmagan», — dedi Jasur.",
                    question: { q: "Kalta minor nega kalta?", a: ["Uni qurib bitkazishga ulgurishmagan", "U yerga kirib ketgan", "U qordan yasalgan"], ok: 0 },
                    scene: { bg: 'city', time: 'sunset', items: [['wall', 70, 304, { w: 150, h: 46 }], ['wall', 336, 304, { w: 150, h: 46 }], ['kaltaminor', 200, 300, {}], ['carpet', 318, 84, Object.assign({ s: 0.45 }, flyingKids)]] }
                },
                {
                    title: "Laylaklar bilan",
                    text: "Qaytishda gilam bulutlar orasidan uchdi. Laylaklar ular bilan yonma-yon uchib, go'yo salom berishdi. Bolalar pastdagi paxta dalalari va yashil bog'larga zavq bilan qarashdi.",
                    scene: { bg: 'sky', time: 'day', items: [['carpet', 200, 190, flyingKids], ['stork', 80, 110, { fly: true }], ['stork', 330, 120, { fly: true, f: 1 }]] }
                },
                {
                    title: "Bobo ham uchgan ekan",
                    text: "Kechqurun gilam ohista bobosining hovlisiga qo'ndi. Bobo jilmayib so'radi: «Xo'sh, sayohat yoqdimi?» Ma'lum bo'lishicha, bobo ham bolaligida shu gilamda uchgan ekan!",
                    scene: { bg: 'yard', time: 'dusk', items: [['carpet', 180, 296, Object.assign({ s: 0.9 }, flyingKids)], ['bobo', 320, 302, { pose: 'heart', mood: 'laugh', f: 1 }]] }
                },
                {
                    title: "Yangi orzu",
                    text: "O'sha kecha Sevara va Jasur katta bo'lsa, butun O'zbekistonni kezib chiqishga ahd qilishdi. Gilam esa yana omborxonada chang bosib, keyingi bolalarni kutib qoldi.",
                    question: { q: "Bolalar qaysi shaharlarni ko'rishdi?", a: ["Samarqand, Buxoro va Xivani", "Seul va Pusanni", "Hech qaysini"], ok: 0 },
                    scene: { bg: 'room', time: 'night', items: [['bigbook', 200, 290, {}], ['kid1', 86, 304, { mood: 'joy' }], ['kid2', 314, 304, { mood: 'joy', f: 1 }]] }
                }
            ]
        }
    });
})();
