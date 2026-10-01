/*
 * The app's menus and buttons in Korean (the 한 option in the header), for
 * Korean parents, teachers, and children who read Korean best. Stories stay
 * Uzbek: js/translit.js never applies this inside [data-content].
 *
 * EXACT maps a whole Uzbek UI text to Korean; PATTERNS handle texts with
 * numbers or names in them. Both are checked against the Uzbek source text
 * (before any Cyrillic), with surrounding spaces kept. A bilingual reviewer
 * checks them in the table made by tools/korean-review.js.
 */
(function (root) {
    'use strict';

    const EXACT = {
        // header and library
        'Ertaklar Olami - Interaktiv Kitob va Sahifalar': 'Ertaklar Olami — 우즈베크 동화 그림책',
        'Interaktiv 3D Kitoblar Platformasi': '우즈베크 동화 3D 그림책',
        'Til va yozuv': '언어와 글자',
        "Kim o'qiyapti?": '누가 읽고 있나요?',
        '📚 Haqiqiy kitobdek varaqlanadi': '📚 진짜 책처럼 넘겨요',
        "O'zbek xalq ertaklari, Navoiy dostonlari va sehrli sarguzashtlar": '우즈베크 전래동화, 나보이의 서사시, 그리고 신기한 모험 이야기',
        'Kitobni oching, sahifani chetidan tortib varaqlang, rasmlarga bosib qahramonlarni jonlantiring va savollarga javob bering!':
            '책을 펼치고, 페이지 끝을 잡아당겨 넘겨 보세요. 그림을 누르면 주인공들이 움직이고, 질문에 답할 수도 있어요!',
        'Kitobni Ochish': '책 펼치기',
        'Davom ettirish': '이어 읽기',
        "Telefonga o'rnatish": '휴대폰에 설치하기',
        'Ulashish': '공유하기',
        'Barchasi': '전체',
        'Xalq Ertaklari': '전래동화',
        'Klassik Asarlar': '고전',
        'Alisher Navoiy': '알리셰르 나보이',
        'Zamonaviy Sirlar': '현대 동화',
        '🇰🇷 Ikki xalq — bir ertak': '🇰🇷 두 나라, 한 이야기',
        '🏙️ Koreyadagi hayotim': '🏙️ 한국에서의 내 생활',
        '🎉 Bayramlar': '🎉 명절과 기념일',
        '🔤 Alifbo': '🔤 우즈베크 알파벳',
        'Interaktiv Kitoblar Kutubxonasi': '인터랙티브 책 도서관',
        'Yangi': '새 책',
        // genre on the library cards (the part of a story's tag before "•")
        'Koreya xalq ertagi': '한국 전래동화',
        'Koreyadagi hayotim': '한국에서의 내 생활',
        'Bayramlar': '명절과 기념일',
        'Alifbo': '우즈베크 알파벳',
        "O'zbek xalq ertagi": '우즈베크 전래동화',
        "O'zbek xalq latifalari": '우즈베크 웃음 이야기',
        'Xalq ertagi': '전래동화',
        'Bayram ertagi': '명절 동화',
        "Xudoyberdi To'xtaboyev": '후도이베르디 투흐타보예프',
        'Abdulla Qodiriy': '압둘라 코디리',
        'Zamonaviy ertak': '현대 동화',
        'Fantastika': '판타지',
        'Fantastik sarguzasht': '판타지 모험',
        'Milliy qadriyatlar': '우즈베크 전통',
        'Sharq hikmati': '동양의 지혜',
        "O'qildi": '다 읽었어요',

        // reading
        'Kutubxona': '도서관',
        'Ovoz yozish': '녹음하기',
        'Ovoz yozish (kattalar uchun)': '녹음하기 (어른용)',
        'Varaqlash Ovozi': '넘기는 소리',
        'Varaqlash Ovozi: Yoqilgan': '넘기는 소리: 켜짐',
        "Varaqlash Ovozi: O'chiq": '넘기는 소리: 꺼짐',
        'Muqova': '표지',
        'Sarlavha': '제목',
        'Tamom': '끝',
        'Sahifani chetidan torting, burchagiga bosing yoki ← → tugmalarini ishlating': '페이지 끝을 잡아당기거나, 모서리를 누르거나, ← → 키를 쓰세요',
        'Oldingi': '이전',
        'Keyingi': '다음',
        'Kitobni ochish': '책 펼치기',
        'Bilimdon Testi': '퀴즈',
        'Tinglash': '듣기',
        "To'xtatish": '멈추기',
        'Ertakni tinglash': '동화 듣기',
        "O'qishni to'xtatish": '읽기 멈추기',
        'Chap sahifa': '왼쪽 페이지',
        "O'ng sahifa": '오른쪽 페이지',
        'Keyingi sahifa': '다음 페이지',
        'Oldingi sahifa': '이전 페이지',
        'Rasmga bosing': '그림을 눌러 보세요',
        '👆 Rasmga bosing — qahramonlar jonlanadi!': '👆 그림을 누르면 주인공들이 움직여요!',
        "📖 Yangi so'z": '📖 새 낱말',
        'Varaqlang': '넘기세요',
        'Yakun': '마지막',
        '💡 Bolajonlar uchun savol': '💡 어린이 질문',
        "🤔 Yana bir o'ylab ko'ring!": '🤔 다시 한번 생각해 볼까요?',
        'Koreyscha tarjima': '한국어 번역',
        'Ushbu kitob': '이 책은',
        'Ertaklar Olami kutubxonasidan': 'Ertaklar Olami 도서관의 책이에요',
        'Sahifa chetidan torting yoki ➜ tugmasini bosing': '페이지 끝을 잡아당기거나 ➜ 버튼을 누르세요',
        '👆 Kitobni ochish uchun bosing': '👆 눌러서 책을 펼치세요',
        '✨ Ertak shu yerda tugadi ✨': '✨ 이야기가 여기서 끝났어요 ✨',
        'Tamom!': '끝!',
        'Ertak tugadi!': '이야기 끝!',
        "Ajoyib o'qidingiz!": '정말 잘 읽었어요!',
        'Ertakdan saboq:': '이야기의 교훈:',
        '🏆 Bilimdon testi': '🏆 퀴즈',
        "↺ Boshidan o'qish": '↺ 처음부터 읽기',
        '📤 Ulashish': '📤 공유하기',
        '💡 Endi savolga javob bering!': '💡 이제 질문에 답해 보세요!',
        "🎙️ Bu sahifa hali o'qib berilmagan": '🎙️ 이 페이지는 아직 녹음되지 않았어요',
        'Bu qurilmada koreyscha ovoz topilmadi': '이 기기에는 한국어 음성이 없어요',
        'Koreyschasini eshitish': '한국어로 듣기',

        // quiz and messages
        "To'g'ri javobni tanlab 50 ball qo'lga kiriting!": '정답을 골라 50점을 받아 보세요!',
        '← Kitobga qaytish': '← 책으로 돌아가기',
        'Tabriklaymiz! 🎉': '축하해요! 🎉',
        "Siz to'g'ri xulosa topdingiz! Bu kitob uchun ballni avvalroq olgansiz.": '교훈을 바르게 찾았어요! 이 책의 점수는 이미 받았어요.',
        "Boshqatdan urinib ko'ring! 💪": '다시 해 볼까요? 💪',
        "Bu xulosa asar g'oyasiga mos kelmaydi.": '이 답은 이야기의 교훈과 맞지 않아요.',
        'Tushunarli': '알겠어요',
        'Xabar': '알림',
        'Tafsilotlar...': '자세한 내용…',
        "🔗 Havola nusxalandi — Telegram yoki KakaoTalk'ga joylang": '🔗 링크를 복사했어요 — 텔레그램이나 카카오톡에 붙여 넣으세요',
        "📲 Telefonga o'rnatish": '📲 휴대폰에 설치하기',
        "Safari'da pastdagi «Ulashish» (공유) tugmasini bosing, so'ng «Bosh ekranga qo'shish» (홈 화면에 추가) ni tanlang. Ertaklar belgisi telefoningiz ekranida paydo bo'ladi.":
            'Safari 아래쪽의 공유 버튼을 누른 다음 ‘홈 화면에 추가’를 고르세요. 휴대폰 화면에 Ertaklar 아이콘이 생겨요.',
        '🔗 Havola': '🔗 링크',
        "Ertaklar Olami — o'zbek xalq ertaklari bolalar uchun": 'Ertaklar Olami — 어린이를 위한 우즈베크 전래동화',

        // built-in narration saved for offline use (js/voices.js saveBook)
        'Internetsiz tinglash uchun saqlash': '인터넷 없이 듣도록 저장하기',
        "Internetsiz ham tinglasa bo'ladi": '인터넷 없이도 들을 수 있어요',
        "Bu kitobning saqlangan ovozlari o'chirilsinmi? Internet bo'lsa, baribir tinglasa bo'ladi.": '이 책에 저장한 목소리를 지울까요? 인터넷이 있으면 계속 들을 수 있어요.',
        "✓ Endi bu kitobni internetsiz ham tinglasa bo'ladi": '✓ 이제 이 책은 인터넷 없이도 들을 수 있어요',
        "📶 Saqlab bo'lmadi. Internetni tekshirib, qaytadan urinib ko'ring.": '📶 저장하지 못했어요. 인터넷을 확인하고 다시 해 보세요.',
        "📶 Internet yo'q. Bu kitobni internetsiz tinglash uchun avval ⬇️ bilan saqlang.": '📶 인터넷이 없어요. 인터넷 없이 들으려면 먼저 ⬇️ 버튼으로 저장하세요.',

        // reading levels (js/levels.js): age shelves and a child's age
        "Yosh bo'yicha": '나이별',
        '🎈 Yoshi:': '🎈 나이:',
        'Barcha yoshlar': '모든 나이',
        "📚 Bu yoshga mos kitob hali yo'q.": '📚 이 나이에 맞는 책이 아직 없어요.',
        "Barcha kitoblarni ko'rsatish": '모든 책 보기',
        'Yoshi': '나이',
        "Kutubxona shu yoshga mos kitoblarni ko'rsatadi.": '도서관에서 이 나이에 맞는 책을 보여 줘요.',

        // twin tales (js/stories-twins.js) and their "find the differences" game
        '🔒 Hali yopiq': '🔒 아직 잠겨 있어요',
        '🇰🇷 Egizak ertak ochildi!': '🇰🇷 쌍둥이 이야기가 열렸어요!',
        '🔍 Farqlarni toping': '🔍 다른 점 찾기',
        'Bu qaysi ertakda bor?': '어느 이야기에 나올까요?',
        'Ikkalasida ham': '두 이야기 모두',
        "🎉 Barakalla! Ikki ertakning o'xshash va farqli tomonlarini topdingiz!": '🎉 Barakalla! 두 이야기의 같은 점과 다른 점을 찾았어요!',

        // play corner (js/games.js): colouring page and story-order game
        "Rasmni bo'yash": '그림 색칠하기',
        "O'yin": '놀이',
        "🎨 Bo'yash": '🎨 색칠하기',
        'Rangni tanlang va rasmning istalgan joyiga bosing.': '색을 고른 다음, 그림에서 칠하고 싶은 곳을 누르세요.',
        'Ranglar': '색깔',
        "O'chirg'ich": '지우개',
        '↶ Orqaga': '↶ 되돌리기',
        '🧹 Tozalash': '🧹 모두 지우기',
        '💾 Rasmni saqlash': '💾 그림 저장하기',
        '🖨 Chop etish': '🖨 인쇄하기',
        '🧩 Voqealar tartibi': '🧩 이야기 순서 맞히기',
        "Rasmlarni ertakda bo'lgan tartibda bosing. Avval nima bo'ldi?": '이야기에서 일어난 순서대로 그림을 눌러 보세요. 무엇이 먼저 일어났을까요?',
        "🎉 Barakalla! Hammasi to'g'ri tartibda!": '🎉 Barakalla! 순서가 모두 맞아요!',
        "🤔 Yana o'ylab ko'ring!": '🤔 다시 생각해 볼까요?',

        // profiles
        'Yopish': '닫기',
        'Ism': '이름',
        'Masalan: Asal': '예: Asal',
        'Rasm tanlang': '그림을 고르세요',
        'Saqlash': '저장',
        'Bekor qilish': '취소',
        "Kitobxonni o'chirish": '이 독자 삭제',
        "Bola qo'shish": '아이 추가',
        'Tahrirlash': '수정하기',
        'Yangi kitobxon': '새 독자',

        // recording studio
        '🎙️ Ovoz yozish': '🎙️ 녹음하기',
        'Kitobga qaytish': '책으로 돌아가기',
        'Kimning ovozi?': '누구의 목소리인가요?',
        "Sarlavhadan boshlab o'qing. Har gapdan keyin biroz to'xtang — bolalar o'qiyotgan gapni ko'rib boradi.":
            '제목부터 읽어 주세요. 문장이 끝날 때마다 잠깐 쉬어 주세요 — 아이들이 지금 읽는 문장을 보며 따라가요.',
        'Yozishni boshlash': '녹음 시작',
        "Yozishni to'xtatish": '녹음 멈추기',
        'Avval ovozni tanlang': '먼저 목소리를 고르세요',
        '✓ Bu sahifa yozilgan': '✓ 이 페이지는 녹음했어요',
        "Qizil tugmani bosing va sahifani o'qing": '빨간 버튼을 누르고 페이지를 읽어 주세요',
        'Saqlanmoqda...': '저장하는 중…',
        'Juda qisqa chiqdi. Qaytadan yozing.': '너무 짧아요. 다시 녹음해 주세요.',
        "✓ Saqlandi. Tinglab ko'ring yoki keyingi sahifaga o'ting.": '✓ 저장했어요. 들어 보거나 다음 페이지로 넘어가세요.',
        '✓ Saqlandi. Kitob tugadi — endi uni yuboring!': '✓ 저장했어요. 책을 다 녹음했어요 — 이제 보내 주세요!',
        "Yozib bo'lmadi. Qaytadan urinib ko'ring.": '녹음하지 못했어요. 다시 해 보세요.',
        'Mikrofonga ruxsat bering va qaytadan bosing.': '마이크 사용을 허용한 뒤 다시 눌러 주세요.',
        "Bu brauzerda ovoz yozib bo'lmaydi. Telefoningizdagi Chrome yoki Safari'da oching.": '이 브라우저에서는 녹음할 수 없어요. 휴대폰의 Chrome이나 Safari에서 열어 주세요.',
        "Tinglab ko'rish": '들어 보기',
        "O'chirish": '삭제',
        "Tayyor bo'lgach, bitta fayl qilib Telegram orqali yuboring.": '다 녹음하면 파일 하나로 만들어 텔레그램으로 보내 주세요.',
        'Yuborish': '보내기',
        'Ovoz tanlang': '목소리를 고르세요',
        'Bu sahifa yozilgan. Qaytadan yozasizmi?': '이 페이지는 이미 녹음했어요. 다시 녹음할까요?',
        "Fayldan qo'shish": '파일에서 추가하기',
        "Buvijon yoki bobojon Telegram orqali yuborgan ovoz faylini (.json) telefoningizga saqlang, keyin shu tugma bilan tanlang.":
            '할머니나 할아버지가 텔레그램으로 보낸 목소리 파일(.json)을 휴대폰에 저장한 다음, 이 버튼으로 골라 주세요.',
        'Yangi ovoz': '새 목소리',
        'Ovozni tahrirlash': '목소리 수정',
        "Kim o'qiydi?": '누가 읽나요?',
        'Masalan: Buvijon': '예: 할머니',
        'Barcha yozuvlarni yuborish': '모든 녹음 보내기',
        "Ovozni o'chirish": '목소리 삭제',
        "Bu fayl ertak ovozi emas. Telegram'dagi .json faylni tanlang.": '동화 목소리 파일이 아니에요. 텔레그램으로 받은 .json 파일을 골라 주세요.',
        'Kattalar uchun': '어른용',
        "Ovoz yozish bo'limiga kirish uchun hisoblang:": '녹음하는 곳에 들어가려면 계산해 주세요:',
        'Kirish': '들어가기',
        "Yana bir urinib ko'ring": '다시 해 보세요',
    };
    // Mening lug'atim: the child's dictionary and its games (js/dictionary.js, js/games.js)
    Object.assign(EXACT, {
        "Mening lug'atim": '나의 낱말장',
        "📖 Mening lug'atim": '📖 나의 낱말장',
        'Eshit va top': '듣고 찾기',
        "So'zni eshitib, rasmini toping": '낱말을 듣고 그림을 찾아요',
        'Juftini top': '짝 찾기',
        "O'zbekcha va koreyscha juftlar": '우즈베크어와 한국어 짝 맞추기',
        "So'zni yig'ing": '낱말 만들기',
        "Harflardan so'z tuzing": '글자로 낱말을 만들어요',
        "📚 Hali so'z yo'q. Kitob o'qing — yangi so'zlar shu yerga yig'iladi!": '📚 아직 낱말이 없어요. 책을 읽으면 새 낱말이 여기에 모여요!',
        'Eshitish': '듣기',
        '📖 Kitobda': '📖 책에서 보기',
        'Bu qurilmada ovoz topilmadi': '이 기기에서 목소리를 찾지 못했어요',
        '🔊 Eshit va top': '🔊 듣고 찾기',
        "So'zni tinglang va uning rasmini toping.": '낱말을 듣고 알맞은 그림을 찾아요.',
        "So'zni o'qing va uning rasmini toping.": '낱말을 읽고 알맞은 그림을 찾아요.',
        '🔊 Yana eshitish': '🔊 다시 듣기',
        'Rasm': '그림',
        '🤔 Yana bir bor tinglang!': '🤔 한 번 더 들어 봐요!',
        '🎉 Barakalla! Hammasini topdingiz!': '🎉 잘했어요! 모두 찾았어요!',
        '🇰🇷 Juftini top': '🇰🇷 짝 찾기',
        "O'zbekcha so'zni bosing, keyin uning koreyscha ma'nosini toping.": '우즈베크어 낱말을 누르고, 그 뜻의 한국어를 찾아요.',
        "🤔 Bu juft emas. Yana urinib ko'ring!": '🤔 짝이 아니에요. 다시 해 봐요!',
        '🎉 Barakalla! Hamma juftlar topildi!': '🎉 잘했어요! 짝을 모두 찾았어요!',
        "🔤 So'zni yig'ing": '🔤 낱말 만들기',
        "Rasmga qarang va harflarni to'g'ri tartibda bosing.": '그림을 보고 글자를 차례대로 눌러요.',
        '🤔 Bu harf emas. Qaysi harf keladi?': '🤔 그 글자가 아니에요. 어떤 글자가 올까요?',
        "🎉 Barakalla! So'zlarni yig'dingiz!": '🎉 잘했어요! 낱말을 다 만들었어요!',
    });
    // Alifbo: tracing letters (js/games.js) and 가, the Korean-letter readings (js/hangul.js)
    Object.assign(EXACT, {
        "✍️ Yozib ko'r": '✍️ 따라 쓰기',
        '✍️ Harfni yozing': '✍️ 글자 따라 쓰기',
        "Barmog'ingiz bilan harf ustidan yurgizing.": '손가락으로 글자 위를 따라 그려 보세요.',
        'Harf yozish maydoni': '글자 쓰는 곳',
        '🔄 Qaytadan': '🔄 다시',
        '⭐ Barakalla! Endi kichik harf.': '⭐ 잘했어요! 이제 소문자예요.',
        "🎉 Barakalla! Harfni o'rgandingiz!": '🎉 잘했어요! 글자를 배웠어요!',
        "🤔 Harfdan chetga chiqib ketdi. Qaytadan urinib ko'ring!": '🤔 글자 밖으로 많이 나갔어요. 다시 해 볼까요?',
        "👍 Davom eting, harf ustidan yurgizing!": '👍 계속해요, 글자 위를 따라 그려요!',
        "Koreys harflarida o'qilishi": '한글로 읽기',
    });
    // The holiday shelf (js/holidays.js): holiday names and the banner's words
    // before them ("오늘은 / 내일은 / 9일 뒤는 / 지금은" + the holiday).
    Object.assign(EXACT, {
        "Navro'z": '나브루즈(우즈베크 봄맞이 새해)',
        'Seollal': '설날',
        'Chusok': '추석',
        'Hangul kuni': '한글날',
        "O'zbek tili bayrami": '우즈베크어의 날',
        'Koreyada bolalar kuni': '어린이날',
        'Bolalar kuni': '국제 어린이날',
        'Mustaqillik kuni': '우즈베키스탄 독립기념일',
        'Ramazon hayiti': '이드 알피트르(라마단 명절)',
        'Qurbon hayiti': '이드 알아드하(희생제)',
        '🎉 Bayram kunlari:': '🎉 지금은',
        '🎉 Bugun bayram:': '🎉 오늘은',
        '🎉 Ertaga bayram:': '🎉 내일은',
    });
    const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];

    // [pattern, Korean, an example of the Uzbek (for the reviewer and the tests)]
    const PATTERNS = [
        [/^(\d+) ta interaktiv kitob$/, '인터랙티브 책 $1권', '23 ta interaktiv kitob'],
        [/^(\d+) ta so'z$/, '낱말 $1개', "12 ta so'z"],
        [/^🎮 O'yinlar uchun kamida (\d+) ta so'z kerak\. Yana (\d+) ta so'z yig'ing!$/, '🎮 게임을 하려면 낱말이 $1개 이상 필요해요. $2개 더 모아요!', "🎮 O'yinlar uchun kamida 4 ta so'z kerak. Yana 3 ta so'z yig'ing!"],
        [/^🎉 (\d+) kundan keyin bayram:$/, '🎉 $1일 뒤는', '🎉 8 kundan keyin bayram:'],
        [new RegExp(`^🎉 (\\d+)-(${MONTHS.join('|')})$`), (all, d, m) => `🎉 ${MONTHS.indexOf(m) + 1}월 ${d}일`, '🎉 9-oktabr'],
        [/^📄 (\d+) sahifali rasmli kitob$/, '📄 $1쪽 그림책', '📄 12 sahifali rasmli kitob'],
        [/^(\d+) yulduz$/, '별 $1개', '3 yulduz'],
        [/^⭐ (\d+) ball$/, '⭐ $1점', '⭐ 150 ball'],
        [/^(\d+) ball$/, '$1점', '150 ball'],
        [/^Sahifa (\d+) \/ (\d+)$/, '$1 / $2쪽', 'Sahifa 3 / 12'],
        [/^(\d+) \/ (\d+) sahifa$/, '$1 / $2쪽', '3 / 12 sahifa'],
        [/^(\d+) \/ (\d+) sahifa yozildi$/, '$2쪽 중 $1쪽 녹음했어요', '4 / 12 sahifa yozildi'],
        [/^(\d+)-sahifa \(yozilgan\)$/, '$1쪽 (녹음함)', '3-sahifa (yozilgan)'],
        [/^(\d+)-sahifa$/, '$1쪽', '3-sahifa'],
        [/^▶ Davom ettirish · (\d+)-sahifa$/, '▶ 이어 읽기 · $1쪽', '▶ Davom ettirish · 3-sahifa'],
        [/^📄 (\d+) sahifa · ⏱ ~(\d+) daqiqa$/, '📄 $1쪽 · ⏱ 약 $2분', '📄 12 sahifa · ⏱ ~6 daqiqa'],
        [/^Savollarga javoblar: (\d+) \/ (\d+)$/, '맞힌 질문: $1 / $2', 'Savollarga javoblar: 4 / 5'],
        [/^(.+) \+(\d+) ball$/, '$1 +$2점', '⭐ Barakalla! +10 ball'],
        [/^Siz to'g'ri xulosa topdingiz va (\d+) ball qo'shildi!$/, '교훈을 바르게 찾았어요! $1점을 받았어요!', "Siz to'g'ri xulosa topdingiz va 50 ball qo'shildi!"],
        [/^(.+) bu ertakni o'qib bergan — 🎧 bosing!$/, '$1 님이 이 동화를 읽어 줬어요 — 🎧 눌러 보세요!', "👵 Buvijon bu ertakni o'qib bergan — 🎧 bosing!"],
        [/^(.+) o'qib beradi\. Boshqa ovozni tanlash$/, '$1 님이 읽어 줘요. 다른 목소리 고르기', "Buvijon o'qib beradi. Boshqa ovozni tanlash"],
        [/^(.+) o'qib beradi$/, '$1 님이 읽어 줘요', "👵 Buvijon o'qib beradi"],
        [/^«(.+)» — o'zbek ertagi: rasmli, varaqlanadigan kitob$/, '«$1» — 우즈베크 동화: 넘겨 보는 그림책', "«Oltin Tarvuz» — o'zbek ertagi: rasmli, varaqlanadigan kitob"],
        [/^(.+): tahrirlash$/, '$1: 수정하기', 'Asal: tahrirlash'],
        [/^(.+) o'chirilsinmi\? Uning ballari va o'qigan kitoblari ham o'chib ketadi\.$/, '‘$1’ 독자를 삭제할까요? 점수와 읽은 책 기록도 함께 지워져요.', "Asal o'chirilsinmi? Uning ballari va o'qigan kitoblari ham o'chib ketadi."],
        [/^(\d+)-sahifadagi yozuv o'chirilsinmi\?$/, '$1쪽 녹음을 지울까요?', "3-sahifadagi yozuv o'chirilsinmi?"],
        [/^(.+) ovozi va uning barcha yozuvlari o'chirilsinmi\?$/, '‘$1’ 목소리와 모든 녹음을 지울까요?', "Buvijon ovozi va uning barcha yozuvlari o'chirilsinmi?"],
        [/^🔴 (\d+:\d\d) — o'qing\.\.\.$/, '🔴 $1 — 읽어 주세요…', "🔴 0:07 — o'qing..."],
        [/^Rang (\d+)$/, '$1번 색', 'Rang 4'],
        [/^🔒 «(.+)»ni o'qib tugating$/, '🔒 «$1» 다 읽으면 열려요', "🔒 «Oltin Tarvuz»ni o'qib tugating"],
        [/^Avval «(.+)» ertagini oxirigacha o'qing\. Shunda uning Koreyadagi egizagi ochiladi!$/, '먼저 «$1» 이야기를 끝까지 읽어 보세요. 그러면 한국의 쌍둥이 이야기가 열려요!', "Avval «Oltin Tarvuz» ertagini oxirigacha o'qing. Shunda uning Koreyadagi egizagi ochiladi!"],
        [/^🔓 Yangi ertak ochildi: «(.+)»!$/, '🔓 새 이야기가 열렸어요: «$1»!', '🔓 Yangi ertak ochildi: «Hungbu va Nolbu»!'],
        [/^(\d+)–(\d+) yosh$/, '$1~$2세', '5–8 yosh'],
        [/^(\d+)\+ yosh$/, '$1세 이상', '9+ yosh'],
        [/^(\d+) yosh$/, '$1세', '6 yosh'],
        [/^✓ (.+): (\d+) ta sahifa qo'shildi\.( Diqqat: bu telefon bu yozuvlarni o'qiy olmasligi mumkin\.)?$/,
            (all, who, n, warn) => `✓ ${who}: ${n}쪽을 추가했어요.${warn ? ' 주의: 이 휴대폰에서는 이 녹음이 재생되지 않을 수도 있어요.' : ''}`,
            "✓ 👵 Buvijon: 12 ta sahifa qo'shildi. Diqqat: bu telefon bu yozuvlarni o'qiy olmasligi mumkin."],
    ];

    function translate(text, lang) {
        if (lang !== 'ko') return text;
        const m = /^(\s*)([\s\S]*?)(\s*)$/.exec(text);
        const core = m[2];
        if (!core) return text;
        let out = Object.prototype.hasOwnProperty.call(EXACT, core) ? EXACT[core] : undefined;
        if (out === undefined) {
            const hit = PATTERNS.find(([re]) => re.test(core));
            if (hit) out = core.replace(hit[0], hit[1]);
        }
        return out === undefined ? text : m[1] + out + m[3];
    }

    root.I18n = { translate, EXACT, PATTERNS };
})(window);
