/*
 * Ertak yozamiz, "let's write a tale" (ROADMAP Phase 3, item 14): a child
 * makes their own heroes and their own picture book.
 *
 * A made book has up to 8 pages. Each page has a title, a few sentences, a
 * place, a time of day and up to four characters: on the left, in the
 * middle and on the right of the ground, and one up in the sky. Characters
 * come from the catalogue below (people, animals, things, things that fly)
 * or are the child's own heroes, dressed in the hero maker.
 *
 * What is kept, on the child's profile (js/store.js):
 *   heroes   [{ id, name, look }]; look picks who, clothes, colours, hair...
 *   myBooks  { id: { id, title, author, moral, pages, created, updated } };
 *            a page is { title, text, place, time, cast: [4 slots] }, a
 *            slot null or { k, mood, f }: k a catalogue id or "h:<hero id>",
 *            f turns it to face the other way.
 * toStory() makes a book the BookEngine can show (js/book.js). A book can
 * travel in a link (encode/decode): the whole book is in the address after
 * "#ertak=", so it needs no server; whatever comes in is checked against
 * the catalogue before it is drawn.
 * The editor and the hero maker are in js/maker-ui.js.
 */
(function (root) {
    'use strict';

    const MAX_PAGES = 8;
    const MAX_BOOKS = 30;
    const MAX_HEROES = 12;
    const LIMITS = { title: 40, author: 24, moral: 140, pageTitle: 40, text: 320, name: 16 };
    const LINK = 'ertak='; // a shared book's address: …/#ertak=<data>

    // Where characters go: three places on the ground, and one in the sky.
    const SLOTS = [
        { id: 'left', label: 'Chapda', ko: '왼쪽', x: 92 },
        { id: 'mid', label: "O'rtada", ko: '가운데', x: 200 },
        { id: 'right', label: "O'ngda", ko: '오른쪽', x: 308 },
        { id: 'sky', label: 'Osmonda', ko: '하늘에', x: 128, y: 100, sky: true },
    ];

    // at: the place as a page's title, when the child leaves the title empty.
    // y: the ground there. inner: indoors (no sky: only day and night);
    // times: the only times it has; decor: drawn behind the characters;
    // skyAt: where things fly, if not the usual place.
    const PLACES = [
        { id: 'meadow', label: "O'tloq", ko: '풀밭', at: "O'tloqda", bg: 'meadow' },
        { id: 'village', label: 'Qishloq', ko: '마을', at: 'Qishloqda', bg: 'village' },
        { id: 'yard', label: 'Hovli', ko: '마당', at: 'Hovlida', bg: 'yard' },
        { id: 'garden', label: "Bog'", ko: '과수원', at: "Bog'da", bg: 'garden' },
        { id: 'poliz', label: 'Poliz', ko: '수박밭', at: 'Polizda', bg: 'poliz' },
        { id: 'forest', label: "O'rmon", ko: '숲', at: "O'rmonda", bg: 'forest' },
        { id: 'mountains', label: "Tog'lar", ko: '산', at: "Tog'da", bg: 'mountains' },
        { id: 'lake', label: "Ko'l", ko: '호수', at: "Ko'l bo'yida", bg: 'lake', y: 306 },
        { id: 'river', label: 'Daryo', ko: '강', at: "Daryo bo'yida", bg: 'river', y: 308 },
        { id: 'desert', label: "Cho'l", ko: '사막', at: "Cho'lda", bg: 'desert' },
        { id: 'city', label: 'Shahar', ko: '도시', at: 'Shaharda', bg: 'city' },
        { id: 'bazaar', label: 'Bozor', ko: '시장', at: 'Bozorda', bg: 'bazaar', decor: [['stall', 40, 252, { s: 0.62 }], ['stall', 362, 250, { s: 0.6, color: '#2a9d8f' }]] },
        { id: 'room', label: 'Uy ichi', ko: '방 안', at: 'Uyda', bg: 'room', inner: true },
        { id: 'palace', label: 'Saroy', ko: '궁전', at: 'Saroyda', bg: 'palace', inner: true },
        { id: 'classroom', label: 'Sinf', ko: '교실', at: 'Maktabda', bg: 'classroom', inner: true },
        { id: 'cave', label: "G'or", ko: '동굴', at: "G'orda", bg: 'cave', inner: true },
        { id: 'seoul', label: 'Seul', ko: '서울', at: 'Seulda', bg: 'seoul' },
        { id: 'kvillage', label: "Koreys qishlog'i", ko: '한국 시골 마을', at: "Koreys qishlog'ida", bg: 'kvillage' },
        { id: 'sky', label: 'Osmon', ko: '하늘', at: 'Osmonda', bg: 'sky' },
        { id: 'space', label: 'Koinot', ko: '우주', at: 'Koinotda', bg: 'space', times: ['night'], scene: { moon: false }, skyAt: [250, 112] },
    ];

    // inner: also offered indoors.
    const TIMES = [
        { id: 'day', icon: '☀️', label: 'Kunduzi', ko: '낮', inner: true, scene: { time: 'day' } },
        { id: 'morning', icon: '🌄', label: 'Ertalab', ko: '아침', scene: { time: 'morning' } },
        { id: 'sunset', icon: '🌇', label: 'Kechqurun', ko: '저녁', scene: { time: 'sunset' } },
        { id: 'night', icon: '🌙', label: 'Tunda', ko: '밤', inner: true, scene: { time: 'night' } },
        { id: 'winter', icon: '❄️', label: 'Qishda', ko: '겨울', scene: { time: 'winter', season: 'winter', fx: ['snow'] } },
        { id: 'rainbow', icon: '🌈', label: 'Kamalak', ko: '무지개', scene: { time: 'day', rainbow: true } },
    ];

    // How a character feels; for people it also moves their arms (unless
    // their hands are full).
    const MOODS = [
        { id: 'happy', icon: '😊', label: 'Xursand', ko: '기뻐요', pose: 'down' },
        { id: 'wave', icon: '👋', label: 'Salom beryapti', ko: '인사해요', mood: 'happy', pose: 'wave' },
        { id: 'joy', icon: '😄', label: 'Juda xursand', ko: '아주 기뻐요', pose: 'cheer' },
        { id: 'sad', icon: '😢', label: 'Xafa', ko: '슬퍼요', pose: 'down' },
        { id: 'surprised', icon: '😮', label: 'Hayron', ko: '놀랐어요', pose: 'shrug' },
        { id: 'scared', icon: '😨', label: "Qo'rqdi", ko: '무서워요', pose: 'scared' },
        { id: 'angry', icon: '😠', label: 'Jahli chiqdi', ko: '화났어요', pose: 'hips' },
        { id: 'think', icon: '🤔', label: "O'ylayapti", ko: '생각해요', pose: 'think' },
        { id: 'sleep', icon: '😴', label: 'Uxlayapti', ko: '자요', pose: 'down' },
    ];

    // The catalogue. part: an Art part or an Art.cast preset; o: its options;
    // s: its size; turn: it faces one way (so it looks inwards from the
    // right); feel: it shows a mood; dy: up or down from where it stands;
    // box: its frame as a sticker in the chooser (else its group's).
    const GROUPS = [
        { id: 'people', icon: '🧒', label: 'Odamlar', ko: '사람', box: [-58, -150, 116, 156] },
        { id: 'animals', icon: '🦊', label: 'Hayvonlar', ko: '동물', box: [-82, -134, 164, 140] },
        { id: 'things', icon: '🏠', label: 'Narsalar', ko: '물건', box: [-88, -176, 176, 182] },
        { id: 'sky', icon: '☁️', label: 'Osmonda', ko: '하늘에', sky: true, box: [-80, -80, 160, 160] },
    ];
    const ITEMS = [
        // people
        { id: 'kid1', group: 'people', label: "O'g'il bola", ko: '남자아이', feel: true },
        { id: 'kid2', group: 'people', label: 'Qiz bola', ko: '여자아이', feel: true },
        { id: 'dada', group: 'people', label: 'Dada', ko: '아빠', feel: true },
        { id: 'ona', group: 'people', label: 'Ona', ko: '엄마', feel: true },
        { id: 'bobo', group: 'people', label: 'Bobo', ko: '할아버지', feel: true },
        { id: 'buvi', group: 'people', label: 'Buvi', ko: '할머니', feel: true },
        { id: 'minjun', group: 'people', label: 'Minjun', ko: '민준', feel: true },
        { id: 'seoyeon', group: 'people', label: 'Seoyeon', ko: '서연', feel: true },
        { id: 'kimteacher', group: 'people', label: "O'qituvchi", ko: '선생님', feel: true },
        { id: 'halmeoni', group: 'people', label: 'Halmeoni', ko: '한국 할머니', feel: true },
        { id: 'afandi', group: 'people', label: 'Afandi', ko: '아판디', feel: true },
        { id: 'podshoh', group: 'people', label: 'Podshoh', ko: '왕', feel: true },
        { id: 'pari', group: 'people', label: 'Pari', ko: '요정', feel: true },
        { id: 'oyqiz', group: 'people', label: 'Oyqiz', ko: '달 소녀', feel: true },
        { id: 'dehqon', group: 'people', label: 'Dehqon', ko: '농부', feel: true },
        { id: 'polvon', group: 'people', label: 'Polvon', ko: '장사', feel: true },
        { id: 'chopon', group: 'people', label: "Cho'pon bola", ko: '양치기 소년', feel: true },
        { id: 'dev', group: 'people', label: 'Dev', ko: '데브(거인 괴물)', part: 'dev', s: 0.62, feel: true },
        { id: 'dokkebi', group: 'people', label: 'Dokkebi', ko: '도깨비', s: 0.62, feel: true },
        // animals
        { id: 'fox', group: 'animals', label: 'Tulki', ko: '여우', turn: true, feel: true, box: [-70, -112, 140, 116] },
        { id: 'wolf', group: 'animals', label: "Bo'ri", ko: '늑대', turn: true, feel: true, box: [-70, -112, 140, 116] },
        { id: 'dog', group: 'animals', label: 'Kuchukcha', ko: '강아지', turn: true, feel: true, box: [-62, -104, 124, 108] },
        { id: 'cat', group: 'animals', label: 'Mushuk', ko: '고양이', turn: true, feel: true, box: [-56, -98, 112, 102] },
        { id: 'rabbit', group: 'animals', label: 'Quyon', ko: '토끼', turn: true, feel: true, box: [-56, -92, 112, 96] },
        { id: 'bear', group: 'animals', label: 'Ayiq', ko: '곰', turn: true, feel: true },
        { id: 'hedgehog', group: 'animals', label: 'Tipratikan', ko: '고슴도치', s: 1.3, turn: true, feel: true, box: [-60, -66, 120, 70] },
        { id: 'horse', group: 'animals', label: 'Ot', ko: '말', s: 0.8, turn: true, feel: true },
        { id: 'donkey', group: 'animals', label: 'Eshak', ko: '당나귀', s: 0.8, turn: true, feel: true },
        { id: 'goat', group: 'animals', label: 'Echki', ko: '염소', turn: true, feel: true },
        { id: 'ram', group: 'animals', label: "Qo'chqor", ko: '숫양', turn: true, feel: true },
        { id: 'rooster', group: 'animals', label: "Xo'roz", ko: '수탉', turn: true, feel: true, box: [-60, -96, 120, 100] },
        { id: 'hen', group: 'animals', label: 'Tovuq', ko: '암탉', s: 1.2, turn: true, feel: true, box: [-60, -90, 120, 94] },
        { id: 'fil', group: 'animals', label: 'Fil', ko: '코끼리', s: 0.6, turn: true, feel: true },
        { id: 'tuya', group: 'animals', label: 'Tuya', ko: '낙타', s: 0.8, turn: true, feel: true },
        { id: 'qoplon', group: 'animals', label: 'Qor qoploni', ko: '눈표범', s: 0.8, turn: true, feel: true },
        { id: 'owl', group: 'animals', label: 'Boyqush', ko: '부엉이', s: 1.8, feel: true, box: [-50, -92, 100, 96] },
        { id: 'stork', group: 'animals', label: 'Laylak', ko: '황새', turn: true, feel: true },
        { id: 'simurg', group: 'animals', label: "Semurg'", ko: '시무르그(신비한 새)', s: 0.5, dy: -24, turn: true, feel: true },
        // things
        { id: 'tree', group: 'things', label: 'Daraxt', ko: '나무', s: 0.9 },
        { id: 'blossom', group: 'things', label: 'Gullagan daraxt', ko: '꽃나무', part: 'tree', o: { kind: 'blossom' }, s: 0.9 },
        { id: 'house', group: 'things', label: 'Uy', ko: '집', s: 0.75, box: [-72, -112, 144, 116] },
        { id: 'yurt', group: 'things', label: "O'tov", ko: '유르트', s: 0.8, box: [-64, -84, 128, 88] },
        { id: 'chogajip', group: 'things', label: 'Koreys uyi', ko: '초가집', s: 0.75, box: [-82, -92, 164, 96] },
        { id: 'school', group: 'things', label: 'Maktab', ko: '학교', s: 0.6, box: [-92, -124, 184, 128] },
        { id: 'chest', group: 'things', label: 'Sandiq', ko: '보물 상자', s: 0.85, box: [-52, -68, 104, 72] },
        { id: 'tandir', group: 'things', label: 'Tandir', ko: '탄디르 화덕', box: [-48, -68, 96, 72] },
        { id: 'watermelon', group: 'things', label: 'Tarvuz', ko: '수박', box: [-48, -52, 96, 56] },
        { id: 'flowers', group: 'things', label: 'Gullar', ko: '꽃', o: { w: 80, n: 9 }, s: 1.3, box: [-60, -52, 120, 56] },
        { id: 'mushroom', group: 'things', label: "Qo'ziqorin", ko: '버섯', s: 2, box: [-40, -66, 80, 70] },
        { id: 'well', group: 'things', label: 'Quduq', ko: '우물', s: 0.8, box: [-52, -92, 104, 96] },
        { id: 'fire', group: 'things', label: 'Gulxan', ko: '모닥불', box: [-42, -72, 84, 76] },
        { id: 'dasturxon', group: 'things', label: 'Dasturxon', ko: '상차림', s: 0.8, box: [-62, -46, 124, 56] },
        { id: 'mashina', group: 'things', label: 'Mashina', ko: '자동차', s: 0.8, turn: true, box: [-62, -62, 124, 66] },
        { id: 'arava', group: 'things', label: 'Arava', ko: '수레', s: 0.8, turn: true, box: [-84, -92, 204, 98] },
        { id: 'swing', group: 'things', label: "Arg'imchoq", ko: '그네', s: 0.8, box: [-58, -112, 116, 116] },
        { id: 'boat', group: 'things', label: 'Qayiq', ko: '배', s: 0.8, turn: true, box: [-46, -28, 92, 34] },
        { id: 'onggi', group: 'things', label: 'Onggi', ko: '옹기', s: 0.9, box: [-52, -64, 104, 68] },
        { id: 'kitob', group: 'things', label: 'Kitob', ko: '책' },
        // in the sky
        { id: 'flystork', group: 'sky', label: 'Laylak', ko: '황새', part: 'stork', o: { fly: true }, turn: true },
        { id: 'flybird', group: 'sky', label: 'Qushcha', ko: '새', part: 'bird', o: { fly: true, kind: 'bluebird' }, s: 1.4, turn: true, box: [-52, -58, 104, 78] },
        { id: 'carpet', group: 'sky', label: 'Uchar gilam', ko: '하늘을 나는 양탄자', s: 0.9, box: [-90, -52, 180, 72] },
        { id: 'kite', group: 'sky', label: 'Varrak', ko: '연' },
        { id: 'shar', group: 'sky', label: 'Havo sharlari', ko: '풍선', o: { n: 3 }, s: 0.8, dy: 70, box: [-72, -150, 144, 160] },
        { id: 'rocket', group: 'sky', label: 'Raketa', ko: '로켓', s: 1.1 },
        { id: 'cloud', group: 'sky', label: 'Bulut', ko: '구름', o: { k: 1.3 } },
        { id: 'bee', group: 'sky', label: 'Ari', ko: '벌', s: 1.8, turn: true, box: [-42, -42, 84, 84] },
        { id: 'starkid', group: 'sky', label: 'Yulduzcha', ko: '별 아이', s: 1.2, dy: 30, feel: true },
        { id: 'flysimurg', group: 'sky', label: "Semurg'", ko: '시무르그(신비한 새)', part: 'simurg', s: 0.5, dy: 50, turn: true },
    ];
    const ITEM = Object.fromEntries(ITEMS.map((it) => [it.id, it]));

    // ---------- the hero maker ----------

    const WHO = [
        { id: 'boy', label: "O'g'il bola", ko: '남자아이', o: { age: 'child' }, heads: ['doppi', 'boy', 'cap', 'telpak'] },
        { id: 'girl', label: 'Qiz bola', ko: '여자아이', o: { sex: 'f', age: 'child' }, heads: ['braids', 'girlcap', 'ponytail', 'bob', 'wreath', 'daenggi'] },
        { id: 'man', label: 'Erkak', ko: '남자 어른', o: {}, heads: ['doppi', 'boy', 'salla', 'telpak', 'cap', 'gat', 'crown'], beard: true },
        { id: 'woman', label: 'Ayol', ko: '여자 어른', o: { sex: 'f' }, heads: ['rumol', 'jjok', 'bob', 'braids', 'ponytail', 'perm'] },
        { id: 'grandpa', label: 'Bobo', ko: '할아버지', o: { age: 'old', beard: 'long' }, heads: ['salla', 'doppi', 'telpak', 'gat'] },
        { id: 'grandma', label: 'Buvi', ko: '할머니', o: { sex: 'f', age: 'old' }, heads: ['rumol', 'perm', 'jjok'] },
    ];
    const HEADS = {
        doppi: { label: "Do'ppi", ko: '도피(우즈베크 모자)' },
        boy: { label: 'Kalta soch', ko: '짧은 머리' },
        cap: { label: 'Kepka', ko: '야구 모자' },
        telpak: { label: 'Telpak', ko: '털모자' },
        salla: { label: 'Salla', ko: '터번' },
        gat: { label: 'Gat', ko: '갓' },
        crown: { label: 'Toj', ko: '왕관' },
        braids: { label: "O'rim soch", ko: '땋은 머리' },
        girlcap: { label: "Qizlar do'ppisi", ko: '여자아이 도피' },
        ponytail: { label: 'Dumcha soch', ko: '묶은 머리' },
        bob: { label: 'Qisqa soch', ko: '단발머리' },
        wreath: { label: 'Gulchambar', ko: '화관' },
        daenggi: { label: 'Daenggi', ko: '댕기머리' },
        rumol: { label: "Ro'mol", ko: '스카프' },
        jjok: { label: 'Jjok', ko: '쪽머리' },
        perm: { label: 'Jingalak soch', ko: '파마머리' },
    };
    // Clothes: Uzbek (a chapan or an atlas dress), everyday, or a hanbok.
    const WEARS = [
        { id: 'milliy', label: 'Milliy kiyim', ko: '우즈베크 옷' },
        { id: 'modern', label: 'Har kungi kiyim', ko: '평상복' },
        { id: 'hanbok', label: 'Hanbok', ko: '한복' },
    ];
    const PATTERNS = [
        { id: 'plain', label: 'Oddiy', ko: '무늬 없음' },
        { id: 'ikat', label: 'Atlas', ko: '아틀라스 무늬' },
        { id: 'stripes', label: "Yo'l-yo'l", ko: '줄무늬' },
        { id: 'dots', label: 'Nuqtali', ko: '물방울무늬' },
    ];
    // [main, second, third, trousers, headscarf]
    const COLORS = [
        { id: 'red', label: 'Qizil', ko: '빨강', c: ['#e63946', '#ffd166', '#1d3557', '#1d3557', '#ffe5ec'] },
        { id: 'orange', label: "To'q sariq", ko: '주황', c: ['#f77f00', '#fcbf49', '#7f5539', '#7f5539', '#fff1d6'] },
        { id: 'yellow', label: 'Sariq', ko: '노랑', c: ['#ffd166', '#ef476f', '#118ab2', '#118ab2', '#fefae0'] },
        { id: 'green', label: 'Yashil', ko: '초록', c: ['#2a9d8f', '#e9c46a', '#e76f51', '#264653', '#d8f3dc'] },
        { id: 'blue', label: "Ko'k", ko: '파랑', c: ['#3a86ff', '#ffbe0b', '#ff006e', '#1d3557', '#dbeafe'] },
        { id: 'purple', label: 'Binafsha', ko: '보라', c: ['#8338ec', '#ffbe0b', '#ff006e', '#3c096c', '#ede4ff'] },
        { id: 'pink', label: 'Pushti', ko: '분홍', c: ['#ff8fab', '#fff0f3', '#c9184a', '#c9184a', '#fff0f3'] },
        { id: 'brown', label: 'Jigarrang', ko: '갈색', c: ['#8d6e63', '#e9c46a', '#5d4037', '#3e2723', '#f5ebe0'] },
    ];
    const SKINS = ['#f6cda5', '#ebb48a', '#d39a6a', '#a8714a'];
    const HAIRS = ['#3a2418', '#141414', '#7a4a24', '#c58b3a', '#e9e5dc'];
    // two: held in both hands (the pose "hold"); flute: played (the pose "flute")
    const HOLDS = [
        { id: 'none', label: "Hech narsa", ko: '없음' },
        { id: 'book', label: 'Kitob', ko: '책', pose: 'hold' },
        { id: 'apple', label: 'Olma', ko: '사과', pose: 'give' },
        { id: 'flower', label: 'Gul', ko: '꽃', pose: 'give' },
        { id: 'bird', label: 'Qushcha', ko: '새', pose: 'hold' },
        { id: 'bread', label: 'Non', ko: '난(빵)', pose: 'hold' },
        { id: 'flute', label: 'Nay', ko: '나이(피리)', pose: 'flute' },
        { id: 'lamp', label: 'Chiroq', ko: '등불', pose: 'give' },
    ];

    const byId = (list, id) => list.find((x) => x.id === id);
    const pick = (list, id, fallback) => (byId(list, id) ? id : fallback);

    // A hero's look, with anything unknown set back to a default.
    function cleanLook(look) {
        const l = look && typeof look === 'object' ? look : {};
        const who = byId(WHO, l.who) || WHO[0];
        return {
            who: who.id,
            head: who.heads.includes(l.head) ? l.head : who.heads[0],
            wear: pick(WEARS, l.wear, 'milliy'),
            pattern: pick(PATTERNS, l.pattern, 'ikat'),
            color: pick(COLORS, l.color, 'red'),
            skin: Number.isInteger(l.skin) && SKINS[l.skin] ? l.skin : 0,
            hair: Number.isInteger(l.hair) && HAIRS[l.hair] ? l.hair : (who.o.age === 'old' ? 4 : 0),
            hold: pick(HOLDS, l.hold, 'none'),
            beard: !!who.beard && !!l.beard,
        };
    }

    // The person part's options for a look, feeling a mood.
    function heroOpts(look, moodId) {
        const l = cleanLook(look);
        const who = byId(WHO, l.who);
        const [a, b, d, pants, scarf] = byId(COLORS, l.color).c;
        const fem = who.o.sex === 'f';
        const child = who.o.age === 'child';
        const o = Object.assign({}, who.o, {
            head: l.head,
            color: a,
            color2: b,
            color3: d,
            belt: d,
            skin: SKINS[l.skin],
            hair: HAIRS[l.hair],
        });
        if (l.pattern !== 'plain') o.pattern = l.pattern;
        if (l.wear === 'modern') Object.assign(o, { outfit: 'shirt', pants, shoes: '#3d2b1f' });
        else if (l.wear === 'hanbok') Object.assign(o, { outfit: fem ? 'chima' : 'hanbok', saekdong: child, trim: d, goreum: d, pants: fem ? undefined : '#f4efe4' });
        else if (fem) o.pants = pants;
        if (l.head === 'rumol') o.hat = scarf;
        if (l.beard) o.beard = 'short';
        const mood = byId(MOODS, moodId) || MOODS[0];
        o.mood = mood.mood || mood.id;
        const hold = byId(HOLDS, l.hold);
        if (hold.id !== 'none') {
            o.hold = hold.id;
            o.pose = hold.pose;
        } else {
            o.pose = mood.pose;
        }
        Object.keys(o).forEach((k) => o[k] === undefined && delete o[k]);
        return o;
    }

    // ---------- books ----------

    const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    // Text a child typed: no control characters, no longer than its limit.
    function clean(s, max) {
        return (typeof s === 'string' ? s : '').replace(/[\u0000-\u0008\u000b-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
    }
    // Story text may keep its line breaks (a poem, a song).
    function cleanText(s, max) {
        return (typeof s === 'string' ? s : '').replace(/[\u0000-\u0009\u000b-\u001f\u007f<>]/g, '').replace(/[  ]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim().slice(0, max);
    }

    function newHero(name, look) {
        return { id: uid('h'), name: clean(name, LIMITS.name) || 'Qahramon', look: cleanLook(look) };
    }

    function newPage(prev) {
        return {
            title: '',
            text: '',
            place: prev ? prev.place : 'meadow',
            time: prev ? prev.time : 'day',
            cast: prev ? prev.cast.map((s) => (s ? Object.assign({}, s) : null)) : [null, null, null, null],
        };
    }

    // A new book; its first page has the child's first hero on it, if they have one.
    function newBook(author, heroes) {
        const page = newPage();
        if (heroes && heroes[0]) page.cast[0] = { k: `h:${heroes[0].id}`, mood: 'wave', f: false };
        const now = Date.now();
        return { id: uid('b'), title: '', author: clean(author, LIMITS.author), moral: '', pages: [page], created: now, updated: now };
    }

    // Whether a slot can hold this character: things that fly go in the sky,
    // everything else (heroes too) on the ground.
    function fits(k, slotIndex, heroes) {
        const sky = !!SLOTS[slotIndex] && !!SLOTS[slotIndex].sky;
        if (typeof k !== 'string') return false;
        if (k.startsWith('h:')) return !sky && (heroes || []).some((h) => `h:${h.id}` === k);
        const it = ITEM[k];
        return !!it && (it.group === 'sky') === sky;
    }

    function cleanSlot(s, i, heroes) {
        if (!s || typeof s !== 'object' || !fits(s.k, i, heroes)) return null;
        return { k: s.k, mood: pick(MOODS, s.mood, 'happy'), f: !!s.f };
    }

    function cleanPage(p, heroes) {
        const q = p && typeof p === 'object' ? p : {};
        const cast = Array.isArray(q.cast) ? q.cast : [];
        return {
            title: clean(q.title, LIMITS.pageTitle),
            text: cleanText(q.text, LIMITS.text),
            place: pick(PLACES, q.place, 'meadow'),
            time: pick(TIMES, q.time, 'day'),
            cast: SLOTS.map((_, i) => cleanSlot(cast[i], i, heroes)),
        };
    }

    // A book as kept or shared, with everything checked.
    function cleanBook(b, heroes) {
        const q = b && typeof b === 'object' ? b : {};
        const pages = (Array.isArray(q.pages) ? q.pages : []).slice(0, MAX_PAGES).map((p) => cleanPage(p, heroes));
        const now = Date.now();
        return {
            id: typeof q.id === 'string' && /^[a-z0-9]{1,24}$/.test(q.id) ? q.id : uid('b'),
            title: clean(q.title, LIMITS.title),
            author: clean(q.author, LIMITS.author),
            moral: clean(q.moral, LIMITS.moral),
            pages: pages.length ? pages : [newPage()],
            created: Number.isFinite(q.created) ? q.created : now,
            updated: Number.isFinite(q.updated) ? q.updated : now,
        };
    }

    const place = (id) => byId(PLACES, id) || PLACES[0];
    const time = (id) => byId(TIMES, id) || TIMES[0];
    const hero = (k, heroes) => (typeof k === 'string' && k.startsWith('h:') ? (heroes || []).find((h) => `h:${h.id}` === k) || null : null);

    // A character's name: the hero's own, or the catalogue's ("Tulki").
    function nameOf(k, heroes) {
        const h = hero(k, heroes);
        if (h) return h.name;
        return ITEM[k] ? ITEM[k].label : '';
    }

    // The times a place has: indoors there is only day and night.
    const timesFor = (pl) => TIMES.filter((t) => (pl.times ? pl.times.includes(t.id) : !pl.inner || t.inner));

    // What a slot holds, as [part, options], before it is put in its place.
    function pieceOf(slot, heroes) {
        if (!slot) return null;
        const mood = byId(MOODS, slot.mood) || MOODS[0];
        const h = hero(slot.k, heroes);
        if (h) {
            const o = heroOpts(h.look, mood.id);
            if (slot.f) o.f = true;
            return ['person', o];
        }
        const it = ITEM[slot.k];
        if (!it) return null;
        const o = Object.assign({}, it.o || {});
        if (it.s) o.s = it.s;
        if (slot.f) o.f = true;
        if (it.feel) {
            o.mood = mood.mood || mood.id;
            // people move their arms with their mood, unless their hands are busy
            const preset = root.Art && root.Art.cast[it.id];
            if (it.group === 'people' && preset && !preset.hold && !preset.part) o.pose = mood.pose;
        }
        return [it.part || it.id, o];
    }

    // What the art engine draws for one slot, where it stands.
    function slotItem(slot, i, heroes, pl, season) {
        const piece = pieceOf(slot, heroes);
        if (!piece) return null;
        const [part, o] = piece;
        const it = ITEM[slot.k];
        const dy = (it && it.dy) || 0;
        if (it && it.id === 'tree' && season) o.season = season;
        const at = SLOTS[i];
        if (!at.sky) return [part, at.x, (pl.y || 292) + dy, o];
        const [x, y] = pl.skyAt || [at.x, at.y];
        return [part, x, y + dy, o];
    }

    // The frame [x, y, w, h] that a slot's character fits as a sticker
    // (children are smaller, so their frame is too).
    const CHILD_BOX = [-46, -118, 92, 122];
    function boxOf(k, heroes) {
        const h = hero(k, heroes);
        if (h) return byId(WHO, cleanLook(h.look).who).o.age === 'child' ? CHILD_BOX : GROUPS[0].box;
        const it = ITEM[k];
        if (!it) return GROUPS[0].box;
        const preset = it.group === 'people' && root.Art && root.Art.cast[it.id];
        if (preset && preset.age === 'child' && !preset.part) return CHILD_BOX;
        return it.box || byId(GROUPS, it.group).box;
    }

    // The picture of a page.
    function sceneOf(page, heroes) {
        const pl = place(page.place);
        const times = timesFor(pl);
        const t = time(page.time);
        const tm = times.includes(t) ? t : times[0];
        const scene = Object.assign({ bg: pl.bg, lightsBehind: true }, JSON.parse(JSON.stringify(tm.scene)), pl.scene || {});
        if (pl.inner) delete scene.fx;
        // what the place has, then the sky, then the ground from the sides in
        const order = [3, 0, 2, 1];
        scene.items = (pl.decor || []).map((d) => JSON.parse(JSON.stringify(d)))
            .concat(order.map((i) => slotItem(page.cast[i], i, heroes, pl, scene.season)).filter(Boolean));
        return scene;
    }

    // A page's title as shown: the child's, else where it happens ("O'rmonda").
    const pageTitle = (page) => page.title || place(page.place).at;

    const key = (id) => `my_${id}`;
    const idOf = (k) => (typeof k === 'string' && k.startsWith('my_') ? k.slice(3) : null);

    // A made book as a story for the BookEngine. guest: someone else's book, opened from a link.
    function toStory(book, heroes, opts = {}) {
        const by = book.author ? `Muallif: ${book.author}` : '';
        return {
            title: book.title || 'Mening ertagim',
            tag: opts.guest ? `Sovg'a ertak${by ? ` • ${by}` : ''}` : `Mening ertagim${by ? ` • ${by}` : ''}`,
            category: 'mine',
            mine: true, // made in the app: no quiz or story-order game to earn points from
            guest: !!opts.guest,
            made: book.id,
            author: book.author,
            hue: '#8b5cf6',
            order: false,
            moral: book.moral || undefined,
            pages: book.pages.map((p) => ({ title: pageTitle(p), text: p.text, scene: sceneOf(p, heroes) })),
        };
    }

    // Names of the characters on a page, for the "who" buttons under the text.
    function names(page, heroes) {
        const seen = [];
        [0, 1, 2, 3].forEach((i) => {
            const s = page.cast[i];
            const n = s && nameOf(s.k, heroes);
            if (n && !seen.includes(n)) seen.push(n);
        });
        return seen;
    }

    // Ways to begin a sentence, for children still learning to write.
    const STARTERS = ["Bir bor ekan, bir yo'q ekan,", 'Bir kuni', 'Shunda', 'Birdan', 'Lekin', 'Keyin', "Oxirida", "Ular baxtli yashashdi."];

    // ---------- links ----------

    function b64url(str) {
        const bytes = new TextEncoder().encode(str);
        let bin = '';
        for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
        return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    function unb64url(s) {
        const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    }

    const LOOK_KEYS = ['who', 'head', 'wear', 'pattern', 'color', 'skin', 'hair', 'hold', 'beard'];

    // The book and the heroes in it, packed small for a link.
    function encode(book, heroes) {
        const used = [];
        book.pages.forEach((p) => p.cast.forEach((s) => {
            const h = s && hero(s.k, heroes);
            if (h && !used.includes(h)) used.push(h);
        }));
        const ref = (k) => (k.startsWith('h:') ? `h${used.indexOf(hero(k, heroes))}` : k);
        const data = {
            v: 1,
            t: book.title,
            a: book.author,
            m: book.moral,
            h: used.map((h) => [h.name, LOOK_KEYS.map((k) => (k === 'beard' ? (h.look.beard ? 1 : 0) : h.look[k]))]),
            p: book.pages.map((p) => [p.title, p.text, p.place, p.time, p.cast.map((s) => (s ? [ref(s.k), s.mood, s.f ? 1 : 0] : 0))]),
        };
        return b64url(JSON.stringify(data));
    }

    // { book, heroes } from a link's data, or null if it isn't a book.
    // Heroes get new ids; the book is someone else's until it is saved.
    function decode(str) {
        let data;
        try {
            data = JSON.parse(unb64url(String(str || '')));
        } catch (e) {
            return null;
        }
        if (!data || data.v !== 1 || !Array.isArray(data.p) || !data.p.length) return null;
        const heroes = (Array.isArray(data.h) ? data.h : []).slice(0, MAX_HEROES).map((h) => {
            const [name, arr] = Array.isArray(h) ? h : [];
            const look = {};
            LOOK_KEYS.forEach((k, i) => { look[k] = Array.isArray(arr) ? arr[i] : undefined; });
            look.beard = look.beard === 1;
            return newHero(name, look);
        });
        const deref = (k) => {
            const m = /^h(\d+)$/.exec(k);
            if (!m) return k;
            const h = heroes[+m[1]];
            return h ? `h:${h.id}` : null;
        };
        const pages = data.p.slice(0, MAX_PAGES).map((p) => {
            const [title, text, pl, tm, cast] = Array.isArray(p) ? p : [];
            return {
                title,
                text,
                place: pl,
                time: tm,
                cast: (Array.isArray(cast) ? cast : []).map((s) => (Array.isArray(s) && typeof s[0] === 'string' ? { k: deref(s[0]), mood: s[1], f: s[2] === 1 } : null)),
            };
        });
        const book = cleanBook({ title: data.t, author: data.a, moral: data.m, pages }, heroes);
        return { book, heroes };
    }

    // The link's data, if the address is a shared book's ("#ertak=…").
    const fromHash = (hash) => (String(hash || '').replace(/^#/, '').startsWith(LINK) ? String(hash).replace(/^#/, '').slice(LINK.length) : null);

    // Every name above in Korean, for the Korean menus (js/i18n.js); the
    // places' "at" names are a page's title, so they stay Uzbek.
    function koreanNames() {
        const out = {};
        [SLOTS, PLACES, TIMES, MOODS, GROUPS, ITEMS, WHO, Object.values(HEADS), WEARS, PATTERNS, COLORS, HOLDS].forEach((list) => list.forEach((x) => {
            out[x.label] = x.ko;
        }));
        return out;
    }
    if (root.I18n) Object.assign(root.I18n.EXACT, koreanNames());

    root.Maker = {
        MAX_PAGES, MAX_BOOKS, MAX_HEROES, LIMITS, LINK,
        SLOTS, PLACES, TIMES, MOODS, GROUPS, ITEMS, ITEM,
        WHO, HEADS, WEARS, PATTERNS, COLORS, SKINS, HAIRS, HOLDS, STARTERS,
        cleanLook, heroOpts, newHero, newPage, newBook, fits, cleanBook, cleanPage, clean, cleanText,
        place, time, timesFor, hero, nameOf, pieceOf, boxOf, sceneOf, pageTitle, key, idOf, toStory, names,
        encode, decode, fromHash, koreanNames,
    };
})(window);
