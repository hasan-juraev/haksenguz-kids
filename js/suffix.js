/*
 * Qo'shimcha ↔ 조사 (ROADMAP Phase 4, item 17). Uzbek and Korean are grammar
 * cousins: the verb comes last, and endings stack on the word. A child who
 * says 여우를 봤어요 already knows what tulkini ko'rdim does; the game shows
 * a Korean sentence with its particle, the same sentence in Uzbek with the
 * ending left out, and the child picks the ending. Here: the six endings
 * with their Korean twins, the sentences, and how an ending joins a word.
 * The game itself is Games.suffix (js/games.js), styled in css/play.css.
 */
(function (root) {
    'use strict';

    // The endings and the Korean particles that do their job, each with an
    // example for the table the game opens with: [Uzbek word, Korean word, particle].
    const ENDINGS = [
        { end: 'ni', ko: '을/를', ex: [['tulki', '여우', '를']] },
        { end: 'ga', ko: '에게/에', ex: [['tulki', '여우', '에게'], ['uy', '집', '에']] },
        { end: 'da', ko: '에서/에', ex: [['uy', '집', '에서']] },
        { end: 'dan', ko: '에서/부터', ex: [['uy', '집', '에서'], ['ertalab', '아침', '부터']] },
        { end: 'ning', ko: '의', ex: [['tulki', '여우', '의']] },
        { end: 'lar', ko: '들', ex: [['tulki', '여우', '들']] },
    ];

    // Who and what the sentences are about: [Uzbek, Korean, picture]. A
    // picture is a word's drawing (as in js/picwords.js) or a list of
    // [part, x, y, options] for Art.sticker.
    const PINES = [['tree', -78, -6, { kind: 'pine', s: 0.75 }], ['tree', 78, -6, { kind: 'pine', s: 0.8 }], ['tree', 0, 6, { kind: 'pine' }]];
    const NOUNS = {
        // living things one can see, greet, visit
        who: [
            ['tulki', '여우', 'fox'], ["bo'ri", '늑대', 'wolf'], ['quyon', '토끼', 'rabbit'], ['ayiq', '곰', 'bear'],
            ['ot', '말', 'horse'], ['eshak', '당나귀', 'donkey'], ['echki', '염소', 'goat'], ["xo'roz", '수탉', 'rooster'],
            ['tovuq', '닭', 'hen'], ['fil', '코끼리', 'fil'], ['tuya', '낙타', 'tuya'], ['boyqush', '부엉이', 'owl'],
            ['laylak', '황새', 'stork'], ['ari', '벌', 'bee'], ['mushuk', '고양이', 'cat'], ['kuchuk', '강아지', 'dog'],
            ['tipratikan', '고슴도치', 'hedgehog'], ['qush', '새', 'bird'], ['kaptar', '비둘기', 'bird:dove'], ["o'rdak", '오리', 'bird:duck'],
            ["jo'ja", '병아리', 'bird:chick'], ["g'oz", '거위', 'bird:goose'], ['dokkebi', '도깨비', 'dokkebi'], ['pari', '요정', 'pari'],
        ],
        // places one goes to, plays in, comes from
        place: [
            ['uy', '집', 'house'], ['maktab', '학교', 'school'], ['saroy', '궁전', 'palace'], ["g'or", '동굴', 'cave'],
            ['kulba', '오두막', 'hut'], ["o'rmon", '숲', PINES], ["tog'", '산', 'chimyon'], ['Toshkent', '타슈켄트', 'teleminora'],
            ['Seul', '서울', 'sejong'], ['Samarqand', '사마르칸트', 'rasadxona'], ['Xiva', '히바', 'kaltaminor'],
        ],
        // what one eats
        food: [
            ['tarvuz', '수박', 'watermelon'], ['qovun', '멜론', 'qovun'], ['non', '빵', 'non'], ['asal', '꿀', 'honey'],
            ['sabzi', '당근', 'sabzi'], ['kimbap', '김밥', 'kimbap'],
        ],
    };

    // Korean 을 after a final consonant (곰을), 를 after a vowel (여우를).
    function batchim(ko) {
        const c = String(ko).charCodeAt(String(ko).length - 1) - 0xac00;
        return c >= 0 && c < 11172 && c % 28 !== 0;
    }
    const obj = (ko) => (batchim(ko) ? '을' : '를');

    // The sentences, by ending and kind of word: Uzbek [before, after] the
    // word, Korean [before, particle, after] (a function of the word for 을/를).
    const FRAMES = [
        { end: 'ni', of: 'who', uz: ['', " ko'rdim."], ko: ['', obj, ' 봤어요.'] },
        { end: 'ni', of: 'food', uz: ['', ' yedim.'], ko: ['', obj, ' 먹었어요.'] },
        { end: 'ga', of: 'who', uz: ['', ' salom berdim.'], ko: ['', '에게', ' 인사했어요.'] },
        { end: 'ga', of: 'place', uz: ['', ' bordim.'], ko: ['', '에', ' 갔어요.'] },
        { end: 'da', of: 'place', uz: ['', " o'ynadim."], ko: ['', '에서', ' 놀았어요.'] },
        { end: 'dan', of: 'place', uz: ['', ' keldim.'], ko: ['', '에서', ' 왔어요.'] },
        { end: 'ning', of: 'who', uz: ['Bu ', ' uyi.'], ko: ['이건 ', '의', ' 집이에요.'] },
        { end: 'lar', of: 'who', uz: ['', ' keldi.'], ko: ['', '들', '이 왔어요.'] },
    ];

    // Sentences of their own: uz [before, word, after], ko [before, word, particle, after].
    const MORE = [
        { end: 'ni', uz: ['', 'kitob', " o'qidim."], ko: ['', '책', '을', ' 읽었어요.'], art: [['kitob', 0, 0, { s: 1.6 }]] },
        { end: 'ni', uz: ['', 'varrak', ' uchirdim.'], ko: ['', '연', '을', ' 날렸어요.'], art: [['kite', 0, 0, {}]] },
        { end: 'ni', uz: ['', 'rasm', ' chizdim.'], ko: ['', '그림', '을', ' 그렸어요.'], art: [['drawing', 0, 0, {}]] },
        { end: 'ga', uz: ['', 'quyon', ' sabzi berdim.'], ko: ['', '토끼', '에게', ' 당근을 줬어요.'], art: [['rabbit', -36, 0, { mood: 'happy', s: 1.4 }], ['sabzi', 50, 0, { n: 1, s: 1.2 }]] },
        { end: 'da', uz: ['Mushuk ', 'uy', '.'], ko: ['고양이가 ', '집', '에', ' 있어요.'], art: [['house', 0, 0, { s: 0.8 }], ['cat', 0, 30, { mood: 'happy', s: 0.8 }]] },
        { end: 'da', uz: ['Tulki ', "o'rmon", ' yashaydi.'], ko: ['여우는 ', '숲', '에', ' 살아요.'], art: PINES.concat([['fox', 20, 40, { mood: 'happy', s: 0.8 }]]) },
        { end: 'da', uz: ['Ayiq ', "g'or", ' uxladi.'], ko: ['곰이 ', '동굴', '에서', ' 잤어요.'], art: [['cave', 0, 0, {}], ['bear', 0, 0, { mood: 'sleep', s: 0.8 }]] },
        { end: 'dan', uz: ['', 'ertalab', " kechgacha o'ynadim."], ko: ['', '아침', '부터', ' 저녁까지 놀았어요.'], art: [['sun', -78, -104, { r: 24 }], ['kid1', -10, 0, { mood: 'happy', s: 1.2 }], ['kid4', 62, 6, { mood: 'happy', s: 1.2, f: true }]] },
        { end: 'dan', uz: ['Qush ', 'uya', ' uchib chiqdi.'], ko: ['새가 ', '둥지', '에서', ' 날아올랐어요.'], art: [['nest', 0, 0, { s: 2 }], ['bird', 44, -56, { mood: 'happy', s: 1.2 }]] },
        { end: 'ning', uz: ['Bu ', 'qush', ' uyasi.'], ko: ['이건 ', '새', '의', ' 둥지예요.'], art: [['nest', 0, 0, { s: 2, eggs: true }], ['bird', 0, -50, { mood: 'happy' }]] },
        { end: 'ning', uz: ['Bu ', 'tulki', ' dumi.'], ko: ['이건 ', '여우', '의', ' 꼬리예요.'], art: [['fox', 0, 0, { mood: 'happy' }]] },
        { end: 'ning', uz: ['Bu ', 'fil', ' xartumi.'], ko: ['이건 ', '코끼리', '의', ' 코예요.'], art: [['fil', 0, 0, { mood: 'happy' }]] },
        { end: 'lar', uz: ['', 'qush', ' uchib ketdi.'], ko: ['', '새', '들', '이 날아갔어요.'], art: [['bird', -70, -10, { kind: 'swallow', s: 1.5 }], ['bird', 0, -60, { kind: 'swallow', s: 1.5 }], ['bird', 70, -16, { kind: 'swallow', s: 1.5 }]] },
        { end: 'lar', uz: ['', 'yulduz', ' chiqdi.'], ko: ['', '별', '들', '이 떴어요.'], art: [['starkid', -70, 0, { s: 0.8 }], ['starkid', 0, -40, {}], ['starkid', 70, 0, { s: 0.8, f: true }]] },
        { end: 'lar', uz: ['', 'bola', " o'ynayapti."], ko: ['', '아이', '들', '이 놀고 있어요.'], art: [['kid2', -66, 0, { mood: 'happy' }], ['minjun', 0, 8, { mood: 'happy' }], ['asal', 66, 0, { mood: 'happy', f: true }]] },
    ];

    // How an ending joins a word. -ga is -ka after k and g, -qa after q and
    // g' (mushukka, tog'qa); the others never change.
    function join(word, end) {
        if (end === 'ga' && /(q|g')$/i.test(word)) return `${word}qa`;
        if (end === 'ga' && /[kg]$/i.test(word)) return `${word}ka`;
        return word + end;
    }

    // The game only asks for an ending that joins as it is written on its button.
    const fits = (word, end) => join(word, end) === word + end;

    // How far apart three of a thing stand ("-lar"): small things closer.
    const GAP = { bee: 40, bird: 54, owl: 48, hen: 62, cat: 68, rooster: 70, rabbit: 60, hedgehog: 70, pari: 70, stork: 72, dog: 74, goat: 76, fox: 78, wolf: 80, bear: 84, tuya: 112, donkey: 112, dokkebi: 112, horse: 116, fil: 128 };

    // A word's drawing on its own, as js/picwords.js draws it.
    function one(key, x, y, more) {
        const [part, kind] = key.split(':');
        return [part, x, y, Object.assign({ mood: 'happy' }, kind ? { kind } : {}, more)];
    }

    // Every sentence the game can ask about:
    // { id, end, uz: [before, word, after], ko: [before, word, particle, after], art }.
    function all() {
        const out = [];
        FRAMES.forEach((f) => NOUNS[f.of].forEach(([uz, ko, pic]) => {
            if (!fits(uz, f.end)) return;
            const many = f.end === 'lar' && typeof pic === 'string';
            const gap = GAP[String(pic).split(':')[0]] || 92;
            const art = Array.isArray(pic) ? pic : many ? [one(pic, -gap, 0, { s: 0.8 }), one(pic, 0, 14, { s: 0.85, f: true }), one(pic, gap, 0, { s: 0.8 })] : [one(pic, 0, 0)];
            out.push({ id: `${f.end}:${f.of}:${uz}`, end: f.end, uz: [f.uz[0], uz, f.uz[1]], ko: [f.ko[0], ko, typeof f.ko[1] === 'function' ? f.ko[1](ko) : f.ko[1], f.ko[2]], art });
        }));
        MORE.forEach((m, i) => out.push(Object.assign({ id: `${m.end}:more:${i}` }, m)));
        return out;
    }

    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    // The word as it stands in its sentence: capitalised at the start.
    const word = (r) => (r.uz[0] ? r.uz[1] : cap(r.uz[1]));
    // The whole sentences.
    const sentence = (r) => r.uz[0] + word(r) + r.end + r.uz[2];
    const korean = (r) => r.ko.join('');

    function shuffle(list, rand = Math.random) {
        const a = list.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // A game's sentences: every ending once, then more at random, in a mixed order.
    function pick(n = ENDINGS.length, rand = Math.random) {
        const pool = shuffle(all(), rand);
        const first = ENDINGS.map((e) => pool.find((r) => r.end === e.end));
        const rest = pool.filter((r) => !first.includes(r)).slice(0, Math.max(0, n - first.length));
        return shuffle(first.concat(rest), rand).slice(0, n);
    }

    // Why a pick was wrong, for the hint: 에서 does the job of both -da and
    // -dan, 에 of both -ga and -da; otherwise, look at the Korean again.
    // (A no-break space and \u2060, a word joiner, keep "→ -da" whole at a line's end.)
    const HINTS = {
        look: "🤔 Yana o'ylab ko'ring! Koreyscha gapga qarang.",
        eseo: '🤔 에서 ikki xil: qayerda? →\u00a0-\u2060da, qayerdan? →\u00a0-\u2060dan',
        e: '🤔 에 ikki xil: qayerga? →\u00a0-\u2060ga, qayerda? →\u00a0-\u2060da',
    };

    function hint(r, picked) {
        const p = r.ko[2];
        if (p === '에서' && picked !== r.end && ['da', 'dan'].includes(picked)) return 'eseo';
        if (p === '에' && picked !== r.end && ['ga', 'da'].includes(picked)) return 'e';
        return 'look';
    }

    // A sentence's picture, framed once it is on screen (PicWords.fit).
    function picture(r) {
        if (!root.Art) return '';
        return root.Art.sticker(r.art, { box: [-160, -260, 320, 300], seed: `sfx:${r.id}`, attrs: 'data-fit' });
    }

    root.Suffix = { ENDINGS, NOUNS, FRAMES, MORE, HINTS, join, fits, batchim, all, word, sentence, korean, pick, hint, picture };
})(window);
