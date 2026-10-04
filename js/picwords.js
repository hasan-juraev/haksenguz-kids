/*
 * Rasmdagi so'zlar, the words in the pictures (ROADMAP Phase 4, item 15).
 * Everything the art engine draws says what it is (data-w on each item, see
 * Art.item): "fox", "bird:swallow", a cast name such as "zumrad", or
 * "person:child:f". Touching it in a book shows its Uzbek word with the
 * Korean, and the word joins the child's dictionary (profile.picWords, see
 * js/dictionary.js and js/app.js).
 */
(function (root) {
    'use strict';

    // A drawn thing's word: [Uzbek, Korean]. Effects (sparkles, hearts, the
    // riddle's cloth...) have none, so touching them shows nothing.
    const WORDS = {
        // animals
        fox: ['tulki', '여우'],
        wolf: ["bo'ri", '늑대'],
        dog: ['kuchuk', '강아지'],
        cat: ['mushuk', '고양이'],
        rabbit: ['quyon', '토끼'],
        bear: ['ayiq', '곰'],
        hedgehog: ['tipratikan', '고슴도치'],
        horse: ['ot', '말'],
        donkey: ['eshak', '당나귀'],
        goat: ['echki', '염소'],
        ram: ["qo'chqor", '숫양'],
        rooster: ["xo'roz", '수탉'],
        hen: ['tovuq', '암탉'],
        fil: ['fil', '코끼리'],
        tuya: ['tuya', '낙타'],
        qoplon: ['qor qoploni', '눈표범'],
        owl: ['boyqush', '부엉이'],
        stork: ['laylak', '황새'],
        fish: ['baliq', '물고기'],
        snake: ['ilon', '뱀'],
        bee: ['ari', '벌'],
        simurg: ["semurg'", '시무르그(전설의 새)'],
        bird: ['qush', '새'],
        'bird:sparrow': ['chumchuq', '참새'],
        'bird:swallow': ["qaldirg'och", '제비'],
        'bird:hoopoe': ['popishak', '후투티'],
        'bird:bluebird': ["ko'k qush", '파랑새'],
        'bird:dove': ['kaptar', '비둘기'],
        'bird:robin': ["qizilto'sh", '울새'],
        'bird:gold': ['oltin qush', '황금 새'],
        'bird:nightingale': ['bulbul', '나이팅게일'],
        'bird:parrot': ["to'tiqush", '앵무새'],
        'bird:peacock': ['tovus', '공작'],
        'bird:duck': ["o'rdak", '오리'],
        'bird:chick': ["jo'ja", '병아리'],
        'bird:goose': ["g'oz", '거위'],
        // people with a calling (everyone else is a girl, a boy, a woman... by age)
        podshoh: ['podshoh', '왕'],
        shoh: ['shoh', '왕'],
        vazir: ['vazir', '재상'],
        pari: ['pari', '요정'],
        dev: ['dev', '거인 괴물'],
        dokkebi: ['dokkebi', '도깨비'],
        dokkebi2: ['dokkebi', '도깨비'],
        starkid: ['yulduzcha', '아기 별'],
        dehqon: ['dehqon', '농부'],
        dehqon2: ['dehqon', '농부'],
        baliqchi: ['baliqchi', '어부'],
        chopon: ["cho'pon", '양치기'],
        mergan: ['mergan', '사냥꾼'],
        polvon: ['polvon', '장사'],
        kimteacher: ["o'qituvchi", '선생님'],
        saroybon: ['soqchi', '경비병'],
        mehmon: ['mehmon', '손님'],
        qoshni: ["qo'shni", '이웃'],
        // plants
        tree: ['daraxt', '나무'],
        'tree:apple': ['olma daraxti', '사과나무'],
        'tree:apricot': ["o'rik daraxti", '살구나무'],
        'tree:blossom': ['gullagan daraxt', '꽃나무'],
        'tree:mulberry': ['tut daraxti', '뽕나무'],
        'tree:pomegranate': ['anor daraxti', '석류나무'],
        'tree:poplar': ['terak', '포플러'],
        'tree:willow': ['tol', '버드나무'],
        'tree:gold': ['oltin daraxt', '황금 나무'],
        'tree:pine': ["qarag'ay", '소나무'],
        bush: ['buta', '덤불'],
        flowers: ['gullar', '꽃'],
        tulips: ['lolalar', '튤립'],
        snowdrops: ['boychechaklar', '설강화'],
        grass: ["o't", '풀'],
        reeds: ['qamish', '갈대'],
        mushroom: ["qo'ziqorin", '버섯'],
        wheat: ["bug'doy", '밀'],
        grain: ['don', '곡식'],
        maysa: ['maysa', '새싹'],
        xazon: ['xazon', '낙엽'],
        paxta: ['paxta', '목화'],
        archa: ['archa', '향나무'],
        // fruit and food
        watermelon: ['tarvuz', '수박'],
        qovun: ['qovun', '멜론'],
        gourd: ['qovoq', '박'],
        piyoz: ['piyoz', '양파'],
        sabzi: ['sabzi', '당근'],
        non: ['non', '난(빵)'],
        somsa: ['somsa', '삼사(구운 만두)'],
        honey: ['asal', '꿀'],
        sumalak: ['sumalak', '수말락'],
        tteok: ['tteok', '떡'],
        tteokguk: ['tteokguk', '떡국'],
        kimbap: ['kimbap', '김밥'],
        kimchi: ['kimchi', '김치'],
        goldegg: ['oltin tuxum', '황금알'],
        // home and things
        house: ['uy', '집'],
        hut: ['kulba', '오두막'],
        yurt: ["o'tov", '유르트(천막집)'],
        chogajip: ['somon tomli uy', '초가집'],
        giwajip: ['koshinli uy', '기와집'],
        palace: ['saroy', '궁전'],
        oqsaroy: ['saroy', '궁전'],
        minaret: ['minora', '탑'],
        kaltaminor: ['minora', '탑'],
        zurmala: ['minora', '탑'],
        teleminora: ['teleminora', '텔레비전 탑'],
        rasadxona: ['rasadxona', '천문대'],
        school: ['maktab', '학교'],
        wall: ['devor', '담'],
        door: ['eshik', '문'],
        well: ['quduq', '우물'],
        bridge: ["ko'prik", '다리'],
        ariq: ['ariq', '도랑'],
        cave: ["g'or", '동굴'],
        rock: ['tosh', '바위'],
        stump: ["to'nka", '그루터기'],
        signpost: ["yo'l ko'rsatkich", '이정표'],
        soru: ["so'ri", '평상'],
        table: ['xontaxta', '좌식 탁자'],
        desk: ['parta', '책상'],
        dasturxon: ['dasturxon', '상차림'],
        lagan: ['lagan', '큰 접시'],
        kosa: ['kosa', '그릇'],
        teapot: ['choynak', '찻주전자'],
        qozon: ['qozon', '가마솥'],
        tandir: ['tandir', '화덕'],
        onggi: ['xum', '옹기'],
        fire: ['gulxan', '모닥불'],
        lamp: ['chiroq', '등잔'],
        chest: ['sandiq', '궤짝'],
        coins: ['tangalar', '동전'],
        basket: ['savat', '바구니'],
        mirror: ['oyna', '거울'],
        beshik: ['beshik', '요람'],
        igna: ['igna', '바늘'],
        carpet: ['gilam', '양탄자'],
        suzani: ["so'zana", '수놓은 천'],
        atlas: ['atlas', '아틀라스 비단'],
        doppi: ["do'ppi", '도피 모자'],
        bigbook: ['kitob', '책'],
        kitob: ['kitob', '책'],
        paper: ["qog'oz", '종이'],
        drawing: ['rasm', '그림'],
        tablet: ['planshet', '태블릿'],
        throne: ['taxt', '왕좌'],
        club: ["to'qmoq", '방망이'],
        sticks: ['tayoqlar', '막대기'],
        arrow: ["o'q", '화살'],
        nest: ['uya', '둥지'],
        stall: ['rasta', '가판대'],
        trash: ['axlat', '쓰레기'],
        yut: ['yut', '윷'],
        chiganoq: ["chig'anoq", '조개껍데기'],
        sejong: ['haykal', '동상'],
        sarmishsoy: ['qoyatosh suratlari', '암각화'],
        // going places, playing
        arava: ['arava', '수레'],
        mashina: ['mashina', '자동차'],
        metro: ['metro', '지하철'],
        boat: ['qayiq', '배'],
        rocket: ['raketa', '로켓'],
        telescope: ['teleskop', '망원경'],
        swing: ["arg'imchoq", '그네'],
        slide: ['sirpanchiq', '미끄럼틀'],
        kite: ['varrak', '연'],
        shar: ['sharlar', '풍선'],
        // the sky
        sun: ['quyosh', '해'],
        moon: ['oy', '달'],
        star: ['yulduz', '별'],
        cloud: ['bulut', '구름'],
        rainbow: ['kamalak', '무지개'],
        soya: ['soya', '그림자'],
        chimyon: ["tog'lar", '산'],
    };

    // Everyone else, by age and sex.
    const PEOPLE = {
        'child:f': ['qiz bola', '여자아이'],
        'child:m': ["o'g'il bola", '남자아이'],
        'adult:f': ['ayol', '아주머니'],
        'adult:m': ['erkak', '아저씨'],
        'old:f': ['buvi', '할머니'],
        'old:m': ['bobo', '할아버지'],
    };

    // Things drawn whole: touching any part of them names them, not what is inside.
    const WHOLE = ['soya'];

    const person = (age, sex) => PEOPLE[`${age === 'child' || age === 'old' ? age : 'adult'}:${sex === 'f' ? 'f' : 'm'}`];

    // The word for a data-w value: { term, ko, w } or null.
    function of(w) {
        if (!w) return null;
        let hit = WORDS[w];
        if (!hit) {
            const [base, a, b] = String(w).split(':');
            if (base === 'person') hit = person(a, b);
            else if (WORDS[base]) hit = WORDS[base];
            else {
                const cast = root.Art && root.Art.cast[base];
                if (cast && !cast.part) hit = person(cast.age, cast.sex);
                else if (cast && WORDS[cast.part]) hit = WORDS[cast.part];
            }
        }
        return hit ? { term: hit[0], ko: hit[1], w } : null;
    }

    // The word for what was touched: the innermost named thing around the touch
    // (a rider rather than the carpet), unless it is part of something drawn whole.
    function at(target) {
        let el = target && target.closest ? target.closest('[data-w]') : null;
        let found = null;
        let foundEl = null;
        while (el) {
            const w = el.getAttribute('data-w');
            const word = of(w);
            if (WHOLE.includes(w.split(':')[0])) {
                found = word;
                foundEl = el;
            } else if (word && !found) {
                found = word;
                foundEl = el;
            }
            el = el.parentElement ? el.parentElement.closest('[data-w]') : null;
        }
        return found ? Object.assign({ el: foundEl }, found) : null;
    }

    // How to draw a word on its own: [part, options] for Art.sticker.
    function art(w) {
        const [base, a, b] = String(w).split(':');
        if (base === 'person') return ['person', { age: a, sex: b, mood: 'happy' }];
        const o = { mood: 'happy' };
        if (a) o.kind = a;
        if (base === 'fish' || base === 'stork') o.still = true;
        return [base, o];
    }

    // The word drawn as a sticker, framed once it is on screen (see fit).
    function sticker(w, label) {
        if (!root.Art) return '';
        const [part, o] = art(w);
        return root.Art.sticker([[part, 0, 0, o]], { box: [-160, -260, 320, 300], seed: `pic:${w}`, label, attrs: 'data-fit' });
    }

    // Fits each new sticker's frame around what is drawn in it.
    function fit(scope) {
        (scope || root.document).querySelectorAll('svg[data-fit]').forEach((svg) => {
            const g = svg.querySelector(':scope > g');
            let b = null;
            try {
                b = g && g.getBBox();
            } catch (e) {
                return;
            }
            if (!b || !b.width || !b.height) return;
            const pad = Math.max(b.width, b.height) * 0.1 + 6;
            svg.setAttribute('viewBox', `${(b.x - pad).toFixed(1)} ${(b.y - pad).toFixed(1)} ${(b.width + pad * 2).toFixed(1)} ${(b.height + pad * 2).toFixed(1)}`);
            svg.removeAttribute('data-fit');
        });
    }

    root.PicWords = { WORDS, PEOPLE, WHOLE, of, at, art, sticker, fit };
})(window);
