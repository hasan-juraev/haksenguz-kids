/*
 * "Koreyadagi hayotim" (ROADMAP Phase 2, item 6): Uzbek children growing up
 * in Korea, at school, with neighbours, and video-calling buvi at home.
 * Everyday stories, so they are told in the plain past tense (-di), not the
 * fairy-tale -ibdi. Korean words in them (annyonghaseyo, kkul, mashita,
 * tteok, kimchi) get word cards. Fields as in js/stories-folk.js.
 */
window.storiesDatabase = window.storiesDatabase || {};

Object.assign(window.storiesDatabase, {
    asal_ismi: {
        title: "Mening ismim — Asal",
        category: "korea",
        age: [5, 8],
        tag: "Koreyadagi hayotim • Do'stlik",
        hue: "#ef476f",
        isNew: true,
        moral: "Har bir ismda bir sir bor. Bir-birimizning ismimiz va tilimizni hurmat qilsak, do'st bo'lamiz.",
        cover: { bg: 'seoul', time: 'morning', items: [['school', 220, 262, { s: 0.85 }], ['asal', 112, 302, { pose: 'wave', mood: 'joy' }], ['minjun', 300, 302, { pose: 'wave', mood: 'joy' }], ['hearts', 206, 150, {}]] },
        quiz: {
            q: "Asal bilan sinfdoshlari qanday qilib do'st bo'lishdi?",
            a: ["Bir-birining tilini va ismini o'rganib", "Umuman gaplashmay", "Faqat o'yinchoq almashib"],
            ok: 0
        },
        pages: [
            {
                title: "Yangi maktab",
                text: "Asal oilasi bilan Toshkentdan Seulga ko'chib kelganiga hali bir oy ham bo'lmagan edi. Bugun u birinchi marta koreys maktabiga boradi. Asal ryukzagini mahkam quchoqlab, onasining qo'lidan ushlab borardi. Uning yuragi dukillab urardi.",
                word: ["ryukzak", "Yelkaga osib yuriladigan sumka"],
                scene: { bg: 'seoul', time: 'morning', items: [['school', 236, 262, { s: 0.88 }], ['ona', 70, 302, { pose: 'wave' }], ['asal', 118, 302, { pose: 'hold', mood: 'scared' }]] }
            },
            {
                title: "Salom, sinf!",
                text: "O'qituvchi Kim Asalni sinfga olib kirdi: «Bolalar, bu — Asal. U O'zbekistondan keldi». Hamma bolalar unga qiziqib qarashdi. Asal sekingina: «Annyonghaseyo», — dedi. Bu koreyscha «salom» degani edi.",
                word: ["annyonghaseyo", "Koreyscha «salom», «assalomu alaykum»"],
                scene: { bg: 'classroom', board: ['안녕하세요'], items: [['kimteacher', 336, 302, { pose: 'point', f: 1 }], ['asal', 236, 302, { pose: 'wave', mood: 'happy' }], ['desk', 84, 302, { book: true }], ['minjun', 64, 300, { mood: 'surprised', s: 0.95 }], ['seoyeon', 160, 302, { mood: 'happy', s: 0.95 }]] }
            },
            {
                title: "Qiyin ism",
                text: "Tanaffusda Minjun so'radi: «Isming nima edi? A... Asa... Asar?» Bolalar ismni har xil qilib aytib, kulishdi. Asal o'zini tushuntira olmay qoldi. U xafa bo'lib, deraza oldiga borib turdi.",
                question: { q: "Asal nega xafa bo'ldi?", a: ["Bolalar uning ismini to'g'ri aytolmadi", "U nonushta qilmagan edi", "Uning qalami sinib qoldi"], ok: 0 },
                scene: { bg: 'classroom', items: [['asal', 350, 302, { mood: 'sad' }], ['minjun', 120, 302, { pose: 'shrug', mood: 'laugh' }], ['jiho', 190, 302, { mood: 'joy' }], ['bubble', 126, 132, { text: 'Asar?' }]] }
            },
            {
                title: "Ismning sirri",
                text: "Kechqurun Asal onasiga hammasini aytib berdi. Onasi uni quchoqlab, javondan bir banka asal olib keldi: «Sening isming — mana shu shirin asal degani. Sen tug'ilganingda hayotimiz shunday shirin bo'lgan». Asal jilmaydi: uning ismida ham sir bor ekan!",
                word: ["asal", "Asalarilar gullardan yig'adigan shirin bol"],
                scene: { bg: 'flat', time: 'dusk', items: [['ona', 170, 302, { pose: 'hold', hold: 'honey', mood: 'joy' }], ['asal', 240, 302, { pose: 'heart', mood: 'joy' }], ['hearts', 206, 150, { n: 2 }]] }
            },
            {
                title: "«Kkul» — asal",
                text: "Ertasi kuni Asal sinfdoshlariga aytdi: «Mening ismim Asal. Koreyscha bu — «kkul», ya'ni bol degani!» Bolalar hayron qolishdi: «Voy, qanday shirin ism!» Minjun esa: «Endi hech qachon adashtirmayman!» — dedi.",
                word: ["kkul", "Koreyscha «asal», «bol»"],
                question: { q: "Asal ismining ma'nosi nima?", a: ["Bol, ya'ni shirin asal", "Gul", "Yulduz"], ok: 0 },
                scene: { bg: 'classroom', board: ['꿀 = Asal'], items: [['asal', 290, 302, { pose: 'point', mood: 'joy', f: 1 }], ['minjun', 110, 302, { pose: 'cheer', mood: 'joy' }], ['seoyeon', 176, 302, { mood: 'surprised' }]] }
            },
            {
                title: "Ikki xil yozuv",
                text: "O'qituvchi Kim doskaga koreys harflari bilan «아살» deb yozdi. Asal esa yoniga lotin harflari bilan «Asal» deb yozdi. Bolalar ikki yozuvni solishtirib ko'rishdi: harflar boshqa-boshqa, ism esa bitta!",
                scene: { bg: 'classroom', board: ['아살', 'Asal'], items: [['kimteacher', 340, 302, { pose: 'point', f: 1 }], ['asal', 246, 302, { pose: 'cheer', mood: 'joy' }], ['minjun', 80, 302, { mood: 'joy' }], ['jiho', 140, 302, { mood: 'surprised' }]] }
            },
            {
                title: "O'zbekcha dars",
                text: "Endi bolalar Asaldan o'zbekcha so'zlarni so'ray boshlashdi. «Salom», «rahmat», «do'stim» — Minjun ularni darrov yodlab oldi. Asal esa ulardan koreyscha sanashni o'rgandi: «Hana, dul, set!»",
                scene: { bg: 'seoul', time: 'day', items: [['slide', 340, 302, { s: 0.8 }], ['asal', 150, 302, { pose: 'wave', mood: 'joy' }], ['minjun', 236, 302, { pose: 'cheer', mood: 'joy' }], ['bubble', 120, 120, { text: 'Salom!' }], ['bubble', 270, 104, { text: 'Hana, dul, set!', to: [-20, 40] }]] }
            },
            {
                title: "Kimbap va somsa",
                text: "Tushlik paytida Seoyeon Asalga o'z kimbapidan uzatdi. Asal esa onasi pishirgan somsadan bo'lishdi. Ikkalasi bir-birining taomini tatib ko'rib, maqtashdi: «Mashita!» — «Mazali!»",
                word: ["kimbap", "Dengiz o'ti bilan o'ralgan guruch — koreyscha taom"],
                question: { q: "Asal va Seoyeon nimani bo'lishishdi?", a: ["Taomlarini: kimbap va somsani", "Qalamlarini", "Hech narsa"], ok: 0 },
                scene: { bg: 'classroom', items: [['desk', 200, 302, {}], ['kimbap', 176, 252, { s: 0.7 }], ['somsa', 222, 252, { s: 0.7 }], ['seoyeon', 110, 302, { pose: 'give', mood: 'joy' }], ['asal', 300, 302, { pose: 'give', mood: 'joy', f: 1 }]] }
            },
            {
                title: "Shirin ism",
                text: "Endi butun sinf Asalning ismini to'g'ri aytardi: «A-sal!» Minjun ba'zan hazillashib uni «Kkul Asal» deb chaqirardi. Asal bundan xafa bo'lmas, aksincha, kulardi.",
                scene: { bg: 'seoul', time: 'day', items: [['asal', 130, 302, { pose: 'cheer', mood: 'laugh' }], ['minjun', 196, 302, { pose: 'wave', mood: 'joy' }], ['seoyeon', 256, 302, { pose: 'cheer', mood: 'joy' }], ['jiho', 316, 302, { mood: 'joy' }], ['hearts', 200, 140, {}]] }
            },
            {
                title: "Ikki tilda «do'st»",
                text: "Kunning oxirida bolalar doskaga ikki tilda bitta so'z yozishdi: «do'st» va «친구». Asal tushundi: tillar har xil bo'lsa ham, do'stlik hamma uchun bir xil ekan. Endi u maktabga quvonib borardi.",
                question: { q: "Asal oxirida nimani tushundi?", a: ["Tillar har xil bo'lsa ham, do'stlik bir xil", "Koreys tili juda qiyin", "Maktabga borish shart emas"], ok: 0 },
                scene: { bg: 'classroom', board: ["do'st", '친구'], items: [['kimteacher', 350, 302, { mood: 'joy' }], ['asal', 150, 302, { pose: 'cheer', mood: 'joy' }], ['minjun', 210, 302, { pose: 'cheer', mood: 'joy' }], ['seoyeon', 270, 302, { pose: 'cheer', mood: 'joy' }], ['jiho', 90, 302, { pose: 'wave', mood: 'joy' }]] }
            }
        ]
    },

    osh_tteok: {
        title: "Osh va tteok",
        category: "korea",
        age: [4, 7],
        tag: "Koreyadagi hayotim • Qo'shnichilik",
        hue: "#f77f00",
        isNew: true,
        moral: "Qo'shniga qilingan yaxshilik qaytib keladi: taom ulashgan uyda do'stlik ko'payadi.",
        cover: { bg: 'seoul', time: 'day', items: [['halmeoni', 130, 302, { pose: 'hold', hold: 'tteok', mood: 'joy' }], ['bobur', 260, 302, { pose: 'hold', hold: 'osh', mood: 'joy' }], ['hearts', 196, 150, {}]] },
        quiz: {
            q: "Kim buvi nima uchun laganni tteok bilan qaytardi?",
            a: ["Yaxshilikka yaxshilik qilish uchun", "Oshni yoqtirmagani uchun", "Laganni o'zi yasagani uchun"],
            ok: 0
        },
        pages: [
            {
                title: "Qo'shni buvi",
                text: "Bobur oilasi bilan Seuldagi baland uyning o'n ikkinchi qavatida yashaydi. Qo'shni xonadonda esa yolg'iz Kim buvi yashaydi. U Boburni ko'rganda doim jilmayib: «Yaxshi bola!» — deb boshini silaydi.",
                word: ["qavat", "Baland uyning bir-birining ustidagi qismlari: birinchi, ikkinchi qavat"],
                scene: { bg: 'hall', items: [['door', 92, 236, { no: '1203', color: '#e09f3e' }], ['door', 226, 236, { no: '1204' }], ['halmeoni', 200, 302, { pose: 'wave', mood: 'joy' }], ['bobur', 276, 302, { mood: 'joy' }], ['bubble', 150, 98, { text: 'Yaxshi bola!', to: [44, 66] }]] }
            },
            {
                title: "Dadamning oshi",
                text: "Shanba kuni dadasi katta qozonda o'zbekcha osh damladi. Uy guruch, sabzi va ziravorlarning mazali hidiga to'ldi. Bobur: «Dada, Kim buviga ham olib boraylik!» — dedi.",
                word: ["qozon", "Osh pishiriladigan katta temir idish"],
                scene: { bg: 'flat', time: 'day', items: [['qozon', 190, 300, { content: 'osh' }], ['dada', 100, 302, { pose: 'hold', hold: 'stick', mood: 'joy' }], ['bobur', 290, 302, { pose: 'cheer', mood: 'joy' }]] }
            },
            {
                title: "Qo'shni haqqi",
                text: "Dadasi kulib, o'g'lining boshini siladi: «Barakalla! Bizda «Qo'shni haqqi — Tangri haqqi» degan naql bor». Bobur katta laganga issiq osh suzib, uni avaylab qo'shnining eshigiga olib bordi.",
                word: ["lagan", "Osh suziladigan katta, yassi idish"],
                question: { q: "Bobur oshni kimga olib bordi?", a: ["Qo'shnisi Kim buviga", "Maktabdagi o'qituvchisiga", "Do'kondagi sotuvchiga"], ok: 0 },
                scene: { bg: 'hall', items: [['door', 92, 236, { no: '1203', color: '#e09f3e', open: true }], ['door', 226, 236, { no: '1204' }], ['bobur', 160, 302, { pose: 'hold', hold: 'osh', mood: 'joy', walk: true }], ['motion', 116, 270, { len: 20 }]] }
            },
            {
                title: "Eshik ochildi",
                text: "Kim buvi eshikni ochib, laganni ko'rib hayron qoldi: «Bu nima?» Bobur tushuntirdi: «Bu — o'zbek oshi. Bizda eng aziz mehmonga osh tortiladi». Buvi quvonib, Boburga rahmat aytdi.",
                scene: { bg: 'hall', items: [['door', 92, 236, { no: '1203', color: '#e09f3e' }], ['door', 226, 236, { no: '1204', open: true }], ['halmeoni', 226, 302, { pose: 'shrug', mood: 'surprised' }], ['bobur', 136, 302, { pose: 'hold', hold: 'osh', mood: 'joy' }], ['mark', 262, 160, { ch: '?' }]] }
            },
            {
                title: "Mashita!",
                text: "Buvi oshdan bir qoshiq tatib ko'rdi va ko'zlari quvonchdan porladi: «Mashita! Juda mazali!» Bobur ham koreyscha «mashita» — «mazali» degani ekanini o'rganib oldi.",
                word: ["mashita", "Koreyscha «mazali»"],
                question: { q: "Koreyscha «mashita» nima degani?", a: ["Mazali", "Xayr", "Rahmat"], ok: 0 },
                scene: { bg: 'flat', time: 'day', windowX: 110, clock: false, items: [['lagan', 200, 290, { r: 30 }], ['halmeoni', 280, 302, { pose: 'cheer', mood: 'joy' }], ['bobur', 120, 302, { mood: 'joy' }], ['bubble', 284, 110, { text: 'Mashita!' }]] }
            },
            {
                title: "Bo'sh qaytmagan lagan",
                text: "Ertasi kuni eshik qo'ng'irog'i jiringladi. Kim buvi laganni qaytarib olib kelgan ekan — ammo lagan bo'sh emasdi! Unda rang-barang tteok — koreyscha guruch pishiriqlari bor edi.",
                word: ["tteok", "Guruch unidan qilinadigan koreyscha shirinlik"],
                question: { q: "Kim buvi laganni qanday qaytardi?", a: ["Tteok bilan to'ldirib", "Bo'sh holda", "Umuman qaytarmadi"], ok: 0 },
                scene: { bg: 'hall', items: [['door', 92, 236, { no: '1203', color: '#e09f3e', open: true }], ['door', 226, 236, { no: '1204' }], ['bobur', 96, 302, { pose: 'cheer', mood: 'surprised' }], ['halmeoni', 196, 302, { pose: 'hold', hold: 'tteok', mood: 'joy', f: 1 }], ['sparkles', 176, 214, { w: 60, h: 30, n: 4 }]] }
            },
            {
                title: "Ikki xalq — bir odat",
                text: "Onasi tushuntirdi: «O'zbeklar ham idishni hech qachon bo'sh qaytarmaydi. Ko'rdingmi, koreyslarda ham xuddi shunday odat bor ekan!» Bobur ikki xalqning bir xil odati borligidan hayron qoldi.",
                scene: { bg: 'flat', time: 'day', items: [['tteok', 200, 296, {}], ['ona', 110, 302, { pose: 'give', mood: 'happy' }], ['bobur', 290, 302, { pose: 'think', mood: 'think' }]] }
            },
            {
                title: "Do'st qo'shnilar",
                text: "Shundan beri Bobur oilasi va Kim buvi bayramlarda bir-biriga taom ulashib turishadi. Navro'zda sumalak, Chusokda songpyon... Endi ular qo'shnidan ham yaqin — qarindoshdek bo'lib qolishdi.",
                word: ["Chusok", "Koreyslarning kuzgi hosil bayrami"],
                question: { q: "Bu hikoyada qaysi odat ikki xalqda ham bor ekan?", a: ["Idishni bo'sh qaytarmaslik", "Faqat o'zi uchun ovqat pishirish", "Qo'shni bilan gaplashmaslik"], ok: 0 },
                scene: { bg: 'flat', time: 'sunset', items: [['lagan', 168, 292, { r: 26, steam: false }], ['tteok', 232, 294, { s: 0.85 }], ['dada', 60, 302, { mood: 'joy' }], ['ona', 110, 302, { mood: 'joy' }], ['halmeoni', 300, 302, { pose: 'heart', mood: 'joy' }], ['bobur', 354, 302, { pose: 'cheer', mood: 'joy' }], ['hearts', 200, 150, {}]] }
            }
        ]
    },

    buvijon_qongiroq: {
        title: "Buvijon bilan videoqo'ng'iroq",
        category: "korea",
        age: [4, 7],
        tag: "Koreyadagi hayotim • Oila",
        hue: "#7b2cbf",
        isNew: true,
        moral: "Uzoqda bo'lsa ham, mehr bilan bog'langan qalblar doim yaqin.",
        cover: { bg: 'flat', time: 'day', items: [['table', 240, 302, {}], ['tablet', 240, 260, { show: 'buvi' }], ['malika', 130, 302, { pose: 'wave', mood: 'joy' }], ['hearts', 200, 120, {}]] },
        quiz: {
            q: "Malika va buvijon bir-biridan nimalarni o'rganishdi?",
            a: ["Bir-birining tili va odatlarini", "Hech narsa o'rganishmadi", "Faqat ob-havo haqida"],
            ok: 0
        },
        pages: [
            {
                title: "Ekranda buvijon",
                text: "Har yakshanba Malika Samarqanddagi buvijoniga videoqo'ng'iroq qiladi. Bugun ham planshetni yoqishi bilan ekranda buvijonning nurli yuzi paydo bo'ldi: «Assalomu alaykum, qo'zichog'im!»",
                word: ["planshet", "Ekrani bor kichkina kompyuter"],
                scene: { bg: 'flat', time: 'day', items: [['table', 236, 302, {}], ['tablet', 236, 260, { show: 'buvi' }], ['malika', 120, 302, { pose: 'wave', mood: 'joy' }], ['bubble', 290, 90, { text: 'Assalomu alaykum!', size: 11 }]] }
            },
            {
                title: "To'rt soat farq",
                text: "Seulda tush payti, Samarqandda esa hali ertalab edi. Buvijon endigina choy damlab o'tirgan ekan. «Sizlarda kun bizdan to'rt soat oldin boshlanadi», — deb kuldi buvijon.",
                question: { q: "Seul bilan Samarqand orasida necha soat farq bor?", a: ["To'rt soat", "Bir soat", "Hech qanday farq yo'q"], ok: 0 },
                scene: { bg: 'flat', time: 'day', items: [['table', 250, 302, {}], ['tablet', 250, 260, { show: 'buvi', mood: 'laugh' }], ['malika', 130, 302, { pose: 'think', mood: 'think' }], ['think', 120, 124, { text: '4' }]] }
            },
            {
                title: "O'rik gullabdi",
                text: "Buvijon planshetni hovliga olib chiqdi. O'rik daraxti oppoq gullab turgan ekan! «Yozda kelsangiz, o'riklar pishib turadi», — dedi buvijon. Malika o'rikning shirin ta'mini eslab, jilmayib qo'ydi.",
                word: ["o'rik", "Sariq, shirin meva; bahorda oq-pushti bo'lib gullaydi"],
                scene: { bg: 'flat', time: 'day', items: [['table', 240, 302, {}], ['tablet', 240, 260, { show: 'apricot' }], ['malika', 120, 302, { pose: 'heart', mood: 'joy' }], ['sparkles', 240, 150, { w: 80, h: 30, n: 4 }]] }
            },
            {
                title: "Kimchi nima?",
                text: "Malika ham buvijoniga muzlatgichdan kimchini olib ko'rsatdi: «Buvijon, bu — kimchi! Achchiq karam. Koreyslar uni deyarli har kuni yeydi». Buvijon kulib: «Bizning karam tuzlamamizga o'xshar ekan-ku!» — dedi.",
                word: ["kimchi", "Achchiq qilib tuzlangan koreyscha karam"],
                scene: { bg: 'flat', time: 'day', items: [['table', 260, 302, {}], ['tablet', 260, 260, { show: 'buvi', mood: 'laugh' }], ['kimchi', 170, 252, { s: 1.2 }], ['malika', 110, 302, { pose: 'point', mood: 'joy' }]] }
            },
            {
                title: "Hana, dul, set",
                text: "Buvijon so'radi: «Maktabda nimalar o'rgandingiz?» Malika koreyscha sanab ko'rsatdi: «Hana, dul, set!» Buvijon ham takrorlashga urindi: «Hana... dul...» Ikkalasi qotib-qotib kulishdi.",
                question: { q: "Malika buvijoniga nimani o'rgatdi?", a: ["Koreyscha sanashni", "Suzishni", "Rasm chizishni"], ok: 0 },
                scene: { bg: 'flat', time: 'day', items: [['table', 250, 302, {}], ['tablet', 250, 260, { show: 'buvi', mood: 'laugh' }], ['malika', 130, 302, { pose: 'cheer', mood: 'laugh' }], ['bubble', 130, 110, { text: 'Hana, dul, set!' }]] }
            },
            {
                title: "Buvijonning topishmog'i",
                text: "Endi navbat buvijonga keldi: «Qani, bitta topishmoq top-chi: Kichkina qozoncha, ichi to'la marjoncha». Malika o'ylab-o'ylab topdi: «Anor!» Buvijon: «Barakalla, qizim!» — deb maqtadi.",
                word: ["topishmoq", "Javobini o'ylab topish kerak bo'lgan qiziq savol"],
                question: { q: "«Kichkina qozoncha, ichi to'la marjoncha» — bu nima?", a: ["Anor", "Olma", "Tarvuz"], ok: 0 },
                scene: { bg: 'flat', time: 'day', items: [['table', 250, 302, {}], ['tablet', 250, 260, { show: 'buvi' }], ['malika', 120, 302, { pose: 'think', mood: 'think' }], ['think', 116, 122, { text: '?' }]] }
            },
            {
                title: "Sog'inch",
                text: "Qo'ng'iroq oxirida Malika ekranga yuzini yaqinlashtirdi: «Buvijon, sizni juda sog'indim!» Buvijon ko'zlaridagi yoshni artib: «Men ham, qo'zichog'im. Yozda albatta ko'rishamiz», — dedi.",
                scene: { bg: 'flat', time: 'dusk', items: [['table', 236, 302, {}], ['tablet', 236, 260, { show: 'buvi', mood: 'cry' }], ['malika', 140, 302, { pose: 'heart', mood: 'sad' }], ['hearts', 196, 130, { n: 3 }]] }
            },
            {
                title: "Ikki shahar, bir yurak",
                text: "Ekran o'chgach, Malika rasm chizishga o'tirdi: bir tomonda Seul, bir tomonda Samarqand, o'rtada esa yurakcha. «Uzoqda bo'lsak ham, qalbimiz yaqin», — deb pichirladi u.",
                question: { q: "Malika rasmning o'rtasiga nima chizdi?", a: ["Yurakcha", "Mashina", "Mushukcha"], ok: 0 },
                scene: { bg: 'flat', time: 'dusk', items: [['table', 230, 302, { w: 150 }], ['drawing', 230, 262, { s: 1.1 }], ['malika', 110, 302, { pose: 'heart', mood: 'joy' }], ['sparkles', 230, 170, { w: 120, h: 40, n: 5 }]] }
            }
        ]
    }
});
