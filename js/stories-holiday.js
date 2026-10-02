/*
 * The holiday shelf, "Bayramlar" (ROADMAP Phase 2, item 7): an Uzbek and a
 * Korean holiday in one story, as an Uzbek child in Korea lives them. Each
 * book names its days in `holidays` (ids from js/holidays.js); the library
 * shows the next date and the banner offers the book as the day comes near.
 * Everyday stories, told in the plain past tense like js/stories-korea.js,
 * with the same children (Asal, Bobur and Kim buvi). Fields as in
 * js/stories-folk.js.
 */
window.storiesDatabase = window.storiesDatabase || {};

(function () {
    // Seollal clothes: Bobur's hanbok from Kim buvi, with rainbow sleeves, and hers
    const boburHanbok = { outfit: 'hanbok', color: '#fdfbf6', saekdong: true, trim: '#3a86ff', goreum: '#e63946', pants: '#e6dfcd', shoes: '#c9a86a' };
    const buviHanbok = { outfit: 'chima', color: '#6a4c93', jacket: '#ffd6e0', trim: '#6a4c93', goreum: '#e63946' };
    const bobur = (o) => Object.assign({}, boburHanbok, o);
    const buvi = (o) => Object.assign({}, buviHanbok, o);
    // the landing outside Bobur's flat (1203) and Kim buvi's (1204), as in "Osh va tteok"
    const doors = [['door', 92, 236, { no: '1203', color: '#e09f3e' }], ['door', 226, 236, { no: '1204' }]];

    Object.assign(window.storiesDatabase, {
        harflar_bayrami: {
            title: "Harflar bayrami",
            category: "holiday",
            age: [5, 8],
            region: "koreya",
            tag: "Bayramlar • Hangul kuni va O'zbek tili bayrami",
            hue: "#3a86ff",
            isNew: true,
            holidays: ['hangul', 'uztili'],
            moral: "Ona tilingni sev, boshqa tillarni hurmat qil: ikki til — ikki qanot.",
            cover: { bg: 'seoul', time: 'day', season: 'autumn', items: [['sejong', 262, 262, { s: 0.9 }], ['asal', 100, 302, { pose: 'cheer', mood: 'joy' }], ['seoyeon', 160, 302, { pose: 'wave', mood: 'joy' }]] },
            quiz: {
                q: "Asal bu ikki bayramdan nimani tushundi?",
                a: ["Ikki til — ikki qanot: ikkalasini bilish katta baxt", "Faqat bitta tilni bilish kifoya", "Harflar hech qachon o'zgarmaydi"],
                ok: 0
            },
            pages: [
                {
                    title: "Qirol Sejong",
                    text: "Hangul kuni arafasida o'qituvchi Kim bolalarga bir hikoya aytib berdi. Bundan qariyb olti yuz yil oldin Koreyada qirol Sejong yashagan. O'sha paytda odamlar xitoy harflarida yozishardi. Bu harflar juda ko'p va qiyin edi, shuning uchun oddiy odamlar o'qiy olmasdi.",
                    word: ["qirol", "Podshoh, mamlakatni boshqaradigan hukmdor"],
                    scene: { bg: 'classroom', board: ['세종대왕'], items: [['kimteacher', 330, 302, { pose: 'point', f: 1 }], ['asal', 100, 302, { mood: 'happy' }], ['minjun', 164, 302, { mood: 'surprised' }], ['seoyeon', 228, 302, { mood: 'happy' }]] }
                },
                {
                    title: "Hamma uchun harflar",
                    text: "Qirol Sejong olimlar bilan birga hamma oson o'rganadigan yangi harflar yaratdi. Bu harflarni hozir hangul deb atashadi. O'sha zamondagi kitobda shunday yozilgan: «Aqlli odam bu harflarni bir ertalabda, sekinroq odam ham o'n kunda o'rganib oladi».",
                    word: ["hangul", "Koreys alifbosi; qirol Sejong uni 1446-yilda e'lon qilgan"],
                    scene: { bg: 'classroom', board: ['ㄱ ㄴ ㄷ ㄹ', 'ㅏ ㅓ ㅗ ㅜ'], items: [['kimteacher', 330, 302, { pose: 'point', f: 1 }], ['asal', 120, 302, { pose: 'cheer', mood: 'joy' }], ['jiho', 190, 302, { mood: 'joy' }]] }
                },
                {
                    title: "Og'izga o'xshagan harf",
                    text: "O'qituvchi doskaga ikki harf chizdi. «ㅁ» og'izga, «ㅇ» esa tomoqqa o'xshar ekan! Bu harflar tovush chiqarayotgan og'iz va tilning shaklidan olingan. Bolalar og'izlarini ochib, bir-birlariga qarab kulishdi.",
                    question: { q: "Koreys harfi «ㅁ» nimaga o'xshaydi?", a: ["Og'izga", "Daraxtga", "Quyoshga"], ok: 0 },
                    scene: { bg: 'classroom', board: ["ㅁ = og'iz", 'ㅇ = tomoq'], items: [['kimteacher', 334, 302, { pose: 'point', f: 1 }], ['asal', 100, 302, { mood: 'surprised' }], ['minjun', 164, 302, { mood: 'laugh' }], ['seoyeon', 228, 302, { mood: 'laugh' }]] }
                },
                {
                    title: "Oltin haykal",
                    text: "9-oktabr — Hangul kuni, Koreyada dam olish kuni. Asal oilasi bilan Seul markazidagi katta maydonga bordi. U yerda qirol Sejongning ulkan oltin rangli haykali bor. Qirol qo'lida kitob ushlab, odamlarga mehr bilan qarab o'tiradi.",
                    word: ["haykal", "Tosh yoki metalldan yasalgan katta tasvir"],
                    question: { q: "Hangul kuni qachon nishonlanadi?", a: ["9-oktabrda", "1-yanvarda", "21-martda"], ok: 0 },
                    scene: { bg: 'seoul', time: 'day', season: 'autumn', items: [['sejong', 262, 262, { s: 0.9 }], ['dada', 46, 302, { mood: 'joy' }], ['ona', 94, 302, { mood: 'joy' }], ['asal', 146, 302, { pose: 'point', mood: 'joy' }]] }
                },
                {
                    title: "Bizda ham bormi?",
                    text: "Asal dadasidan so'radi: «Dada, biz o'zbeklarning ham til bayramimiz bormi?» Dadasi jilmaydi: «Albatta! 21-oktabr — O'zbek tili bayrami. 1989-yilning shu kunida o'zbek tili davlat tili bo'lgan».",
                    word: ["davlat tili", "Mamlakatda hamma joyda ishlatiladigan asosiy til"],
                    question: { q: "O'zbek tili bayrami qachon?", a: ["21-oktabrda", "9-mayda", "1-iyunda"], ok: 0 },
                    scene: { bg: 'seoul', time: 'sunset', season: 'autumn', items: [['sejong', 316, 262, { s: 0.7 }], ['dada', 110, 302, { pose: 'wave', mood: 'joy' }], ['asal', 184, 302, { pose: 'think', mood: 'think' }], ['bubble', 100, 130, { text: '21-oktabr!' }]] }
                },
                {
                    title: "Uch xil yozuv",
                    text: "Uyda dadasi tushuntirdi: «Bobolarimiz arab yozuvida yozishgan. Buving kirill harflarida o'qigan. Sen esa lotin harflarida yozasan». Asal qog'ozga o'z tilini ikki xil yozib ko'rdi. Harflar o'zgaradi, til esa yashayveradi!",
                    word: ["yozuv", "Harflar bilan yozish usuli: lotin, kirill yoki arab yozuvi"],
                    question: { q: "Asal hozir qaysi harflarda yozadi?", a: ["Lotin harflarida", "Faqat raqamlarda", "Hech qanday harfda"], ok: 0 },
                    scene: { bg: 'flat', time: 'dusk', items: [['table', 190, 302, { w: 150 }], ['paper', 176, 260, { lines: ['Ўзбек', "O'zbek"], keep: true }], ['dada', 320, 302, { pose: 'point', f: 1, mood: 'joy' }], ['asal', 76, 302, { pose: 'cheer', mood: 'joy' }]] }
                },
                {
                    title: "Harflar uychasi",
                    text: "Ertasi kuni Asal Seoyeonga o'zbek harflarini ko'rsatdi: «Mana, O' bilan G' — ularning kichkina shlyapasi bor!» Seoyeon esa koreyscha yozishni o'rgatdi: «ㅇ bilan ㅏ bitta uychaga kirsa, 아 bo'ladi». Asal kuldi: koreys harflari uychalarda yashar ekan!",
                    question: { q: "Koreys harflari qanday yoziladi?", a: ["Bo'g'in bo'lib, bitta «uycha»ga yig'ilib", "Faqat raqamlar bilan", "Rasm chizib"], ok: 0 },
                    scene: { bg: 'classroom', board: ["O' G'", 'ㅇ + ㅏ = 아'], items: [['asal', 236, 302, { pose: 'point', mood: 'joy', f: 1 }], ['seoyeon', 304, 302, { pose: 'cheer', mood: 'laugh' }]] }
                },
                {
                    title: "Ona tilim — asal tilim",
                    text: "21-oktabr kuni Seuldagi o'zbek oilalari bir joyga yig'ilishdi. Bolalar o'zbekcha she'rlar o'qishdi. Asal o'zi to'qigan she'rni aytdi: «Ona tilim — asal tilim, allalarda eshitganim». Hamma qarsak chaldi, Seoyeon esa o'zbekcha «Bayramingiz bilan!» deb tabrikladi.",
                    word: ["alla", "Onalar bolasini uxlatayotganda aytadigan qo'shiq"],
                    question: { q: "Asal she'rida ona tilini nimaga o'xshatdi?", a: ["Asalga", "Toshga", "Qorga"], ok: 0 },
                    scene: { bg: 'classroom', board: ['21-oktabr', "O'zbek tili bayrami"], items: [['bobur', 66, 302, { pose: 'cheer', mood: 'joy' }], ['malika', 124, 302, { pose: 'cheer', mood: 'joy' }], ['asal', 200, 302, { pose: 'heart', mood: 'joy' }], ['seoyeon', 276, 302, { pose: 'cheer', mood: 'joy' }], ['dada', 340, 302, { mood: 'joy' }], ['hearts', 200, 176, { n: 2 }]] }
                }
            ]
        },

        ikki_yangi_yil: {
            title: "Ikki Yangi yil",
            category: "holiday",
            age: [4, 8],
            region: "koreya",
            tag: "Bayramlar • Seollal va Navro'z",
            hue: "#e63946",
            isNew: true,
            holidays: ['seollal', 'navruz'],
            moral: "Quvonchni qo'shni bilan bo'lishsang, u ikki barobar ko'payadi.",
            cover: { bg: 'flat', time: 'day', items: [['table', 200, 302, { w: 150 }], ['tteokguk', 170, 260, {}], ['sumalak', 232, 260, {}], ['halmeoni', 80, 302, buvi({ pose: 'cheer', mood: 'joy' })], ['bobur', 320, 302, bobur({ pose: 'cheer', mood: 'joy' })]] },
            quiz: {
                q: "Bu hikoyada qaysi ikki Yangi yil bor?",
                a: ["Seollal va Navro'z", "Faqat 1-yanvar", "Tug'ilgan kun va to'y"],
                ok: 0
            },
            pages: [
                {
                    title: "Yana bir Yangi yil?",
                    text: "Qishning sovuq kunlaridan birida Kim buvi Boburga dedi: «Ertaga Seollal — Koreyaning Yangi yili. Oilang bilan mehmonga kelinglar!» Bobur hayron bo'ldi: «Yangi yil 1-yanvarda o'tdi-ku?» Buvi kulib tushuntirdi: «Seollal oy taqvimi bilan keladi, shuning uchun har yili boshqa kunga to'g'ri keladi».",
                    word: ["Seollal", "Koreyslarning oy taqvimi bo'yicha Yangi yili"],
                    scene: { bg: 'hall', items: [...doors, ['halmeoni', 196, 302, { pose: 'give', mood: 'joy' }], ['bobur', 278, 302, { mood: 'surprised' }], ['mark', 300, 158, { ch: '?' }]] }
                },
                {
                    title: "Hanbok kiygan Bobur",
                    text: "Ertalab Kim buvi Boburga chiroyli, rang-barang kiyim sovg'a qildi. Bu — hanbok, koreyslarning milliy kiyimi. Uning yenglari kamalakdek yo'l-yo'l edi. Bobur uni kiyib, ko'zguga qaradi: «Xuddi ertakdagi shahzodaga o'xshayman!»",
                    word: ["hanbok", "Koreyslarning milliy kiyimi"],
                    scene: { bg: 'flat', time: 'day', items: [['halmeoni', 110, 302, buvi({ pose: 'heart', mood: 'joy' })], ['bobur', 236, 302, bobur({ pose: 'cheer', mood: 'joy' })], ['sparkles', 236, 196, { w: 80, h: 40, n: 5 }]] }
                },
                {
                    title: "Katta ta'zim",
                    text: "Keyin Bobur Kim buviga sebe qildi: tiz cho'kib, yerga egilib ta'zim qildi. U yangi o'rgangan so'zlarini aytdi: «Saehae bok mani badeuseyo!» Bu «Yangi yilda baxtingiz ko'p bo'lsin!» degani edi. Buvi quvonib, unga konvertda Yangi yil sovg'asini berdi.",
                    word: ["sebe", "Seollalda kattalarga qilinadigan katta ta'zim"],
                    question: { q: "Bobur buviga nima tiladi?", a: ["Yangi yilda baxti ko'p bo'lishini", "Tezroq uxlashini", "Qor yog'ishini"], ok: 0 },
                    scene: { bg: 'flat', time: 'day', items: [['halmeoni', 270, 302, buvi({ noLegs: true, pose: 'heart', mood: 'joy' })], ['bobur', 170, 302, bobur({ noLegs: true, pose: 'pray', mood: 'happy', rot: 12, tilt: 14 })], ['hearts', 222, 236, { n: 2 }]] }
                },
                {
                    title: "Bir kosa — bir yosh",
                    text: "Keyin hamma birga tteokguk ichdi. Bu — tteok bo'lakchalari solingan oppoq sho'rva. Kim buvi kulib aytdi: «Koreyada Seollalda bir kosa tteokguk ichgan odam bir yoshga katta bo'ladi!» Bobur darrov ikkinchi kosani so'radi: «Unda men tezroq katta bo'laman!»",
                    word: ["tteokguk", "Tteok bo'lakchalari solingan koreyscha sho'rva"],
                    question: { q: "Tteokguk ichgan odam haqida nima deyishadi?", a: ["Bir yoshga katta bo'ladi", "Qushga aylanadi", "Kichrayib qoladi"], ok: 0 },
                    scene: { bg: 'flat', time: 'day', items: [['table', 200, 302, { w: 170 }], ['tteokguk', 162, 260, {}], ['tteokguk', 238, 260, {}], ['dada', 46, 302, { mood: 'laugh' }], ['halmeoni', 100, 302, buvi({ mood: 'laugh' })], ['bobur', 300, 302, bobur({ pose: 'cheer', mood: 'joy' })], ['ona', 354, 302, { mood: 'joy' }]] }
                },
                {
                    title: "Yutnori",
                    text: "Tushdan keyin ular yutnori o'ynashdi. To'rtta yog'och tayoqcha baland otiladi: ular qanday tushsa, o'yinchining toshi shuncha qadam yuradi. Bobur tayoqchalarni otdi — hammasi bir xil tushdi! Hamma qarsak chalib: «Yut!» deb qichqirdi.",
                    word: ["yutnori", "Tayoqcha otib o'ynaladigan koreyscha o'yin"],
                    scene: { bg: 'flat', time: 'day', items: [['yut', 200, 300, { air: true }], ['bobur', 90, 302, bobur({ pose: 'cheer', mood: 'joy' })], ['halmeoni', 316, 302, buvi({ noLegs: true, pose: 'cheer', mood: 'laugh' })]] }
                },
                {
                    title: "Endi bizning navbatimiz",
                    text: "Qish o'tib, bahor keldi. Endi Boburning onasi Kim buvini mehmonga chaqirdi: «21-mart — Navro'z, bizning Yangi kunimiz! Shu kuni kun bilan tun tenglashadi, tabiat uyg'onadi». Uning stolida yashil maysa ko'karib turardi.",
                    word: ["maysa", "Bug'doydan endigina unib chiqqan yashil o'simta"],
                    question: { q: "Navro'z qachon nishonlanadi?", a: ["21-martda", "1-sentabrda", "31-dekabrda"], ok: 0 },
                    scene: { bg: 'flat', time: 'day', items: [['table', 200, 302, { w: 120 }], ['maysa', 200, 260, { s: 1.3 }], ['ona', 110, 302, { pose: 'give', mood: 'joy' }], ['halmeoni', 290, 302, { pose: 'cheer', mood: 'joy' }], ['bobur', 350, 302, { mood: 'joy', s: 0.95 }]] }
                },
                {
                    title: "Tun bo'yi sumalak",
                    text: "Navro'z arafasida o'zbek ayollari katta qozonda sumalak pishirishdi. Sumalak tun bo'yi qaynaydi, uni navbatma-navbat kovlab, qo'shiq aytishadi. Kim buvi ham kapgirni olib, bir oz kovladi. Qozon tubiga esa yaxshi niyat bilan mayda toshchalar solingan edi.",
                    word: ["sumalak", "Bug'doy maysasidan tun bo'yi pishiriladigan shirin taom"],
                    question: { q: "Sumalak qanday pishiriladi?", a: ["Tun bo'yi, navbatma-navbat kovlab", "Bir daqiqada", "Muzlatgichda"], ok: 0 },
                    scene: { bg: 'seoul', time: 'night', season: 'spring', items: [['qozon', 200, 296, { content: 'sumalak' }], ['ona', 120, 302, { pose: 'hold', hold: 'stick', mood: 'joy' }], ['halmeoni', 284, 302, { pose: 'hold', hold: 'stick', mood: 'joy' }], ['notes', 200, 160, { color: '#ffe066' }]] }
                },
                {
                    title: "Omadli toshcha",
                    text: "Ertalab hamma sumalakdan tatib ko'rdi. Birdan Kim buvining kosasidan kichkina toshcha chiqdi! Bobur quvonib aytdi: «Buvi, bu — omad! Endi bir niyat qiling!» Buvi ko'zlarini yumib, niyat qildi: ikki oila doim birga bo'lsin.",
                    question: { q: "Sumalakdan toshcha chiqsa nima qilishadi?", a: ["Niyat qilishadi", "Uni yerga ko'mishadi", "Yig'lashadi"], ok: 0 },
                    scene: { bg: 'flat', time: 'day', items: [['table', 200, 302, { w: 170 }], ['sumalak', 166, 260, { stone: true }], ['sumalak', 236, 260, {}], ['halmeoni', 90, 302, { pose: 'pray', mood: 'joy' }], ['bobur', 310, 302, { pose: 'cheer', mood: 'joy' }], ['sparkles', 166, 214, { w: 50, h: 30, n: 4 }]] }
                }
            ]
        }
    });
})();
