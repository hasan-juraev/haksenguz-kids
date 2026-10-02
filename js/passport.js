/*
 * Madaniyat pasporti, the culture passport (ROADMAP Phase 3, item 11). Every
 * book takes the child somewhere: to one of Uzbekistan's 14 regions, or to
 * Korea, their second home (story.region in js/stories-*.js). Finishing a
 * book stamps that place in the child's passport, and points buy its
 * stickers. The map's shapes are in js/uzmap.js (built by
 * tools/build-map.js), the stickers' pictures in js/art/.
 */
(function (root) {
    'use strict';

    const PRICE = 50; // points per sticker

    // name: on the stamp and the cards; ko: in Korean; city: its centre, at
    // [lat, lon] (the tests check it is inside the region on the map); ink:
    // the stamp's colour; fill: the region on the map once it is stamped.
    // Each fact is true of the place and ties in with its books.
    const REGIONS = [
        {
            id: 'qoraqalpogiston', name: "Qoraqalpog'iston", ko: '카라칼파크스탄', city: 'Nukus', koCity: '누쿠스', at: [42.462, 59.611],
            ink: '#b45309', fill: '#f6d38c',
            fact: "Qoraqalpog'iston — O'zbekiston ichidagi respublika, poytaxti Nukus. Uning keng dashtlarida qadimda odamlar o'tovda yashab, tuya boqishgan.",
            koFact: '카라칼파크스탄은 우즈베키스탄 안에 있는 공화국이고, 수도는 누쿠스예요. 넓은 초원에서 옛날 사람들은 유르트에 살며 낙타를 길렀어요.',
            stickers: [
                { id: 'otov', name: "O'tov", ko: '유르트', art: [['yurt', 0, 0, { s: 0.8 }]] },
                { id: 'tuya', name: 'Tuya', ko: '낙타', art: [['tuya', -10, 0, { s: 0.85 }]] },
            ],
        },
        {
            id: 'xorazm', name: 'Xorazm', ko: '호라즘', city: 'Urganch', koCity: '우르겐치', at: [41.55, 60.633],
            ink: '#0f766e', fill: '#9fd8cb',
            fact: "Xorazmdagi Xiva shahri qadimiy devorlar bilan o'ralgan, ichida Kalta minor turibdi. Buyuk olim al-Xorazmiy ham shu yurtdan chiqqan.",
            koFact: '호라즘의 히바는 옛 성벽으로 둘러싸인 도시이고, 그 안에 칼타 미노르가 서 있어요. 위대한 학자 알콰리즈미도 이 땅에서 태어났어요.',
            stickers: [
                { id: 'kaltaminor', name: 'Kalta minor', ko: '칼타 미노르', art: [['kaltaminor', 0, 0, { s: 0.75 }]] },
                { id: 'qovun', name: 'Xorazm qovuni', ko: '호라즘 멜론', art: [['qovun', -8, -4, { s: 0.82 }]] },
            ],
        },
        {
            id: 'buxoro', name: 'Buxoro', ko: '부하라', city: 'Buxoro', koCity: '부하라', at: [39.775, 64.429],
            ink: '#c2410c', fill: '#f4a99a',
            fact: "Buxoro — Buyuk ipak yo'lidagi qadimiy shahar. Minorai Kalon qariyb 900 yildan beri qad ko'tarib turibdi, Labi hovuz yonida esa eshagiga mingan Nasriddin Afandining haykali bor.",
            koFact: '부하라는 실크로드의 오래된 도시예요. 칼란 미나레트는 900년 가까이 서 있고, 랴비하우즈 옆에는 당나귀를 탄 나스레딘 아판디의 동상이 있어요.',
            stickers: [
                { id: 'kalon', name: 'Minorai Kalon', ko: '칼란 미나레트', art: [['minaret', 0, 0, { s: 0.5 }]] },
                { id: 'afandi', name: 'Afandi va eshagi', ko: '아판디와 당나귀', art: [['donkey', 0, 0, { s: 0.75, rider: 'afandi' }]] },
            ],
        },
        {
            id: 'navoiy', name: 'Navoiy', ko: '나보이', city: 'Navoiy', koCity: '나보이', at: [40.084, 65.379],
            ink: '#6d28d9', fill: '#c3b4e8',
            fact: "Navoiy viloyati buyuk shoir Alisher Navoiy nomi bilan atalgan. Sarmishsoy darasidagi qoyalarda qadimgi odamlar chizgan minglab rasmlar bor.",
            koFact: '나보이주는 위대한 시인 알리셰르 나보이의 이름을 땄어요. 사르미시사이 골짜기의 바위에는 옛날 사람들이 그린 그림이 수천 개나 있어요.',
            stickers: [
                { id: 'navoiy', name: 'Alisher Navoiy', ko: '알리셰르 나보이', art: [['navoiy', 0, 0, { s: 0.8 }]] },
                { id: 'sarmishsoy', name: 'Sarmishsoy rasmlari', ko: '사르미시사이 바위그림', art: [['sarmishsoy', 0, -6, { s: 0.85 }]] },
            ],
        },
        {
            id: 'samarqand', name: 'Samarqand', ko: '사마르칸트', city: 'Samarqand', koCity: '사마르칸트', at: [39.654, 66.96],
            ink: '#1d4ed8', fill: '#8ec5ee',
            fact: "Samarqand — 2700 yildan ham qadimiy shahar. Registon maydoni olamga mashhur; Ulug'bek shu yerda yulduzlarni o'rgangan.",
            koFact: '사마르칸트는 2700년도 더 된 오래된 도시예요. 레기스탄 광장은 세계적으로 유명하고, 울루그베크는 이곳에서 별을 연구했어요.',
            stickers: [
                { id: 'registon', name: 'Registon', ko: '레기스탄', art: [['palace', 0, 0, { s: 0.45 }]] },
                { id: 'non', name: 'Samarqand noni', ko: '사마르칸트 빵', art: [['non', 0, -24, { s: 1.05 }]] },
            ],
        },
        {
            id: 'qashqadaryo', name: 'Qashqadaryo', ko: '카슈카다리야', city: 'Qarshi', koCity: '카르시', at: [38.861, 65.789],
            ink: '#be123c', fill: '#f7c59f',
            fact: "Amir Temur Qashqadaryodagi Shahrisabz yaqinida tug'ilgan; uning Oqsaroyidan ulkan peshtoq qolgan. Maydanak tog'idagi rasadxonadan yulduzlar juda tiniq ko'rinadi.",
            koFact: '아미르 티무르는 카슈카다리야의 샤흐리사브즈 근처에서 태어났어요. 그가 지은 악사라이 궁전은 커다란 정문만 남아 있어요. 마이다나크 산의 천문대에서는 별이 아주 또렷하게 보여요.',
            stickers: [
                { id: 'oqsaroy', name: 'Oqsaroy', ko: '악사라이 궁전', art: [['oqsaroy', 0, 0, { s: 0.95 }]] },
                { id: 'maydanak', name: 'Maydanak teleskopi', ko: '마이다나크 망원경', art: [['telescope', 0, 0, { s: 1.25 }]] },
            ],
        },
        {
            id: 'surxondaryo', name: 'Surxondaryo', ko: '수르한다리야', city: 'Termiz', koCity: '테르메즈', at: [37.224, 67.278],
            ink: '#15803d', fill: '#b5e2a0',
            fact: "Surxondaryo — O'zbekistonning eng janubiy va eng issiq viloyati. Termizdagi Zurmala minorasi 2000 yoshga yaqin, Boysun tog'larida esa qadimiy g'orlar bor.",
            koFact: '수르한다리야는 우즈베키스탄에서 가장 남쪽에 있고 가장 더운 주예요. 테르메즈의 주르말라 탑은 2000살 가까이 되었고, 보이순 산에는 오래된 동굴이 있어요.',
            stickers: [
                { id: 'zurmala', name: 'Zurmala minorasi', ko: '주르말라 탑', art: [['zurmala', 0, 0, { s: 1 }]] },
                { id: 'teshiktosh', name: "Teshiktosh g'ori", ko: '테시크타시 동굴', art: [['cave', 0, -8, { s: 0.5 }]] },
            ],
        },
        {
            id: 'jizzax', name: 'Jizzax', ko: '지자흐', city: 'Jizzax', koCity: '지자흐', at: [40.116, 67.842],
            ink: '#9d174d', fill: '#f2b5d4',
            fact: "Jizzaxdagi Zomin tog'larida qadimiy archazorlar bor. Tandirda pishgan Jizzax somsasi butun yurtga mashhur.",
            koFact: '지자흐의 자민 산에는 오래된 향나무 숲이 있어요. 탄디르에서 구운 지자흐 삼사는 온 나라에서 유명해요.',
            stickers: [
                { id: 'archa', name: 'Zomin archasi', ko: '자민 향나무', art: [['archa', 0, 0, { s: 0.95 }]] },
                { id: 'somsa', name: 'Jizzax somsasi', ko: '지자흐 삼사', art: [['somsa', 0, -14, { s: 1.6 }]] },
            ],
        },
        {
            id: 'sirdaryo', name: 'Sirdaryo', ko: '시르다리야', city: 'Guliston', koCity: '굴리스탄', at: [40.49, 68.784],
            ink: '#0369a1', fill: '#a8d8ea',
            fact: "Sirdaryo viloyati O'rta Osiyoning eng uzun daryosi — Sirdaryo nomi bilan atalgan. Bir paytlar qaqroq cho'l bo'lgan Mirzacho'lda endi paxta va bug'doy o'sadi.",
            koFact: '시르다리야주는 중앙아시아에서 가장 긴 강인 시르다리야강에서 이름을 땄어요. 옛날에 메마른 초원이었던 미르자출에서 이제는 목화와 밀이 자라요.',
            stickers: [
                { id: 'paxta', name: 'Paxta', ko: '목화', art: [['paxta', 0, 0, { s: 1 }]] },
                { id: 'bugdoy', name: "Bug'doy", ko: '밀', art: [['wheat', 0, 0, { s: 1.3 }]] },
            ],
        },
        {
            id: 'toshkent', name: 'Toshkent', ko: '타슈켄트', city: null, at: [41.2995, 69.2401],
            ink: '#b91c1c', fill: '#ff9f9f',
            fact: "Toshkent — O'zbekistonning poytaxti va eng katta shahri. Uning metrosi O'rta Osiyodagi birinchi metro; bekatlari saroydek bezatilgan.",
            koFact: '타슈켄트는 우즈베키스탄의 수도이자 가장 큰 도시예요. 타슈켄트 지하철은 중앙아시아 최초의 지하철이고, 역마다 궁전처럼 꾸며져 있어요.',
            stickers: [
                { id: 'teleminora', name: 'Teleminora', ko: '타슈켄트 TV 타워', art: [['teleminora', 0, 0, { s: 0.68 }]] },
                { id: 'metro', name: 'Toshkent metrosi', ko: '타슈켄트 지하철', art: [['metro', 0, 0, { s: 0.95 }]] },
            ],
        },
        {
            id: 'toshkentvil', name: 'Toshkent viloyati', ko: '타슈켄트주', label: 'Toshkent\nviloyati', city: 'Nurafshon', koCity: '누라프숀', at: [41.044, 69.358],
            ink: '#a16207', fill: '#ffe08a',
            fact: "Toshkent viloyatidagi Chimyon tog'larida qishda chang'i uchishadi. Bu tog'larda kamyob qor qoploni ham yashaydi.",
            koFact: '타슈켄트주의 침간 산에서는 겨울에 스키를 타요. 이 산에는 보기 드문 눈표범도 살아요.',
            stickers: [
                { id: 'chimyon', name: "Chimyon tog'lari", ko: '침간 산', art: [['chimyon', -2, 0, { s: 0.9 }]] },
                { id: 'qoplon', name: 'Qor qoploni', ko: '눈표범', art: [['qoplon', 4, -10, { s: 0.85 }]] },
            ],
        },
        {
            id: 'fargona', name: "Farg'ona", ko: '페르가나', city: "Farg'ona", koCity: '페르가나', at: [40.386, 71.786],
            ink: '#7c3aed', fill: '#c9b8f0',
            fact: "Farg'ona vodiysi atrofi tog'lar bilan o'ralgan. Marg'ilon atlasi va Rishtonning moviy sopol idishlari butun dunyoga mashhur.",
            koFact: '페르가나 분지는 산으로 둘러싸여 있어요. 마르길란의 아틀라스 비단과 리시톤의 파란 도자기는 세계적으로 유명해요.',
            stickers: [
                { id: 'atlas', name: "Marg'ilon atlasi", ko: '마르길란 아틀라스 비단', art: [['atlas', 0, -12, { s: 0.95 }]] },
                { id: 'kosa', name: 'Rishton kosasi', ko: '리시톤 도자기 그릇', art: [['kosa', 0, -14, { s: 2 }]] },
            ],
        },
        {
            id: 'andijon', name: 'Andijon', ko: '안디잔', city: 'Andijon', koCity: '안디잔', at: [40.782, 72.344],
            ink: '#ea580c', fill: '#f6b38e',
            fact: "Andijonda shoh va shoir Zahiriddin Muhammad Bobur tug'ilgan; u «Boburnoma» kitobini yozgan. Andijondagi Asaka shahrida esa mashinalar ishlab chiqariladi.",
            koFact: '안디잔에서는 왕이자 시인인 자히리딘 무함마드 바부르가 태어났어요. 그는 『바부르나마』라는 책을 썼어요. 안디잔주의 아사카에서는 자동차를 만들어요.',
            stickers: [
                { id: 'boburnoma', name: 'Boburnoma', ko: '바부르나마', art: [['kitob', 0, -4, { s: 1 }]] },
                { id: 'mashina', name: 'Asaka mashinasi', ko: '아사카 자동차', art: [['mashina', 0, -18, { s: 0.9 }]] },
            ],
        },
        {
            id: 'namangan', name: 'Namangan', ko: '나망간', city: 'Namangan', koCity: '나망간', at: [40.998, 71.673],
            ink: '#047857', fill: '#a7e3c5',
            fact: "Namangan — gullar shahri: har yili bu yerda katta gullar bayrami o'tadi. Mashhur Chust do'ppisi ham shu viloyatdan.",
            koFact: '나망간은 꽃의 도시예요. 해마다 이곳에서 큰 꽃 축제가 열려요. 유명한 추스트 도피 모자도 이 주에서 만들어요.',
            stickers: [
                { id: 'gullar', name: 'Namangan gullari', ko: '나망간의 꽃', art: [['tulips', 0, -6, { s: 1.5 }]] },
                { id: 'doppi', name: "Chust do'ppisi", ko: '추스트 도피 모자', art: [['doppi', 0, -22, { s: 1.1 }]] },
            ],
        },
        {
            // not on the map of Uzbekistan: the small map of Korea in its corner
            id: 'koreya', name: 'Koreya', ko: '한국', city: 'Seul', koCity: '서울', capital: true,
            ink: '#1e40af', fill: '#9cc3f5',
            fact: "Koreya — ko'p o'zbek oilalarining ikkinchi uyi. Toshkentdan Seulgacha taxminan 4900 km: samolyotda 6–7 soat uchiladi.",
            koFact: '한국은 많은 우즈베크 가족의 두 번째 집이에요. 타슈켄트에서 서울까지는 약 4,900km이고, 비행기로 6~7시간 걸려요.',
            stickers: [
                { id: 'hanok', name: 'Hanok', ko: '한옥', art: [['giwajip', 0, 0, { s: 0.45 }]] },
                { id: 'onggi', name: 'Onggi', ko: '옹기', art: [['onggi', 0, -10, { s: 1 }]] },
            ],
        },
    ];

    // The neighbours' names on the map, [Uzbek, Korean].
    const NAMES = {
        kz: ["Qozog'iston", '카자흐스탄'],
        tm: ['Turkmaniston', '투르크메니스탄'],
        tj: ['Tojikiston', '타지키스탄'],
        kg: ["Qirg'iziston", '키르기스스탄'],
        af: ["Afg'oniston", '아프가니스탄'],
        caspian: ['Kaspiy dengizi', '카스피해'],
    };

    const byId = {};
    REGIONS.forEach((r) => { byId[r.id] = r; });
    const STICKERS = [];
    REGIONS.forEach((r) => r.stickers.forEach((s) => STICKERS.push(Object.assign({ region: r.id }, s))));

    const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
    const region = (id) => byId[id] || null;
    const regionOf = (story) => (story && byId[story.region]) || null;
    const sticker = (id) => STICKERS.find((s) => s.id === id) || null;

    // "Xorazm" -> "Xorazmga" (to Xorazm); after k and q the suffix is -ka, -qa.
    const dative = (name) => name + (/k$/.test(name) ? 'ka' : /q$/.test(name) ? 'qa' : 'ga');
    // The place named in "... seni Xorazmga olib bordi" (for the Korean menus, js/i18n.js).
    const byDative = (to) => REGIONS.find((r) => dative(r.name) === to) || null;
    const byName = (name) => REGIONS.find((r) => r.name === name) || null;

    // The books that take the child to a place.
    const books = (db, id) => Object.keys(db).filter((k) => db[k].region === id);

    // This child's stamps: place -> when the first of its books was finished (0 if not known).
    function stamps(db, profile) {
        const out = {};
        Object.entries((profile && profile.books) || {}).forEach(([key, rec]) => {
            const r = rec && rec.finished && regionOf(db[key]);
            if (!r) return;
            const at = rec.finishedAt || 0;
            if (!(r.id in out) || (at && (!out[r.id] || at < out[r.id]))) out[r.id] = at;
        });
        return out;
    }

    // Can this child have the sticker? 'have' | 'stamp' (its place not visited yet) | 'points' | 'ok'
    function stickerState(db, profile, id) {
        const s = sticker(id);
        if (!s) return 'none';
        if (profile.stickers && profile.stickers[id]) return 'have';
        if (!(s.region in stamps(db, profile))) return 'stamp';
        return (profile.points || 0) < PRICE ? 'points' : 'ok';
    }

    // 1.10.2026 -> "01.10.2026"
    function dateLabel(ts) {
        if (!ts) return '';
        const d = new Date(ts);
        const two = (v) => String(v).padStart(2, '0');
        return `${two(d.getDate())}.${two(d.getMonth() + 1)}.${d.getFullYear()}`;
    }

    // ---------- pictures ----------

    function stickerSVG(s, label) {
        return root.Art ? root.Art.sticker(s.art, { box: s.box, seed: `sticker:${s.id}`, label }) : '';
    }

    function rgb(hex) {
        return [1, 3, 5].map((i) => (parseInt(hex.slice(i, i + 2), 16) / 255).toFixed(3));
    }

    // A rubber stamp in the place's ink: its name around the edge, its first
    // sticker's picture in the middle (inked: dark lines strong, light colours
    // faint) and, if known, the date.
    let seq = 0;
    function stampSVG(r, opts = {}) {
        const id = `pstamp${++seq}`;
        const hash = root.Art ? root.Art.hash(r.id) : 7;
        const rot = (hash % 23) - 11;
        const [R, G, B] = rgb(r.ink);
        const name = r.name.toUpperCase();
        const size = name.length > 13 ? 8.4 : name.length > 9 ? 9.6 : 11;
        const bottom = r.capital ? r.city.toUpperCase() : "O'ZBEKISTON";
        const em = r.stickers[0];
        // Korea's stamp is square: another country, another kind of stamp.
        const [ex, ey, es] = r.capital ? [-22, -25, 44] : [-27, -34, 54];
        const emblem = root.Art
            ? root.Art.sticker(em.art, { box: em.box, cut: false, seed: `stamp:${r.id}`, attrs: `x="${ex}" y="${ey}" width="${es}" height="${es}" filter="url(#${id}-ink)"` })
            : '';
        const date = opts.date ? `<text y="${r.capital ? 38 : 31}" font-size="8.6" letter-spacing=".4">${dateLabel(opts.date)}</text>` : '';
        const shape = r.capital
            ? `<rect x="-56" y="-48" width="112" height="96" rx="10" stroke-width="3.4"/><rect x="-49" y="-41" width="98" height="82" rx="6" stroke-width="1.3"/>`
            : `<circle r="56" stroke-width="3.4"/><circle r="43" stroke-width="1.3"/>`;
        const words = r.capital
            ? `<text y="-27" font-size="${size}">${esc(name)}</text><text y="${opts.date ? 29 : 33}" font-size="8.4">${esc(bottom)}</text>`
            : `<text font-size="${size}"><textPath href="#${id}-top" startOffset="50%">${esc(name)}</textPath></text>` +
              `<text font-size="8.4"><textPath href="#${id}-bot" startOffset="50%">${esc(bottom)}</textPath></text>` +
              `<text x="-49.5" y="3.4" font-size="9">★</text><text x="49.5" y="3.4" font-size="9">★</text>`;
        return `<svg class="stamp-svg" viewBox="-60 -60 120 120" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>` +
            `<filter id="${id}-ink" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 ${R} 0 0 0 0 ${G} 0 0 0 0 ${B} -0.26 -0.87 -0.09 1.25 0"/></filter>` +
            `<filter id="${id}-worn" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">` +
            `<feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="${hash % 97}" result="n"/>` +
            `<feColorMatrix in="n" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -3.2 2.75" result="m"/>` +
            `<feComposite in="SourceGraphic" in2="m" operator="in"/></filter>` +
            `<path id="${id}-top" d="M-46 0 A46 46 0 0 1 46 0"/><path id="${id}-bot" d="M-53 0 A53 53 0 0 0 53 0"/></defs>` +
            `<g transform="rotate(${rot})" filter="url(#${id}-worn)" opacity=".9">` +
            `<g fill="none" stroke="${r.ink}">${shape}</g>${emblem}` +
            `<g fill="${r.ink}" font-weight="800" letter-spacing="1" text-anchor="middle" data-content>${words}${date}</g>` +
            `</g></svg>`;
    }

    // An empty place for a stamp still to come.
    function emptySVG(r) {
        const shape = r.capital
            ? '<rect x="-54" y="-46" width="108" height="92" rx="10"/>'
            : '<circle r="54"/>';
        return `<svg class="stamp-svg is-empty" viewBox="-60 -60 120 120" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">` +
            `<g fill="none" stroke="#d9c7a3" stroke-width="2.6" stroke-dasharray="7 6">${shape}</g>` +
            `<text y="15" text-anchor="middle" font-size="44" font-weight="800" fill="#e2d3b4">?</text></svg>`;
    }

    // The map: regions in their colour once stamped, names (Korean with the
    // Korean menus), a star for Tashkent and, in its corner, Korea.
    function mapSVG(opts = {}) {
        const M = root.UzMap;
        if (!M) return '';
        const stamped = opts.stamped || {};
        const ko = opts.lang === 'ko';
        const sel = opts.selected || null;
        const name = (r) => (ko ? r.ko : r.label || r.name);
        const star = (x, y, k = 1) => `<path class="map-star" transform="translate(${x} ${y}) scale(${k})" d="M0 -10 L2.9 -3.1 L10 -3.1 L4.2 1.4 L6.2 8.5 L0 4.3 L-6.2 8.5 L-4.2 1.4 L-10 -3.1 L-2.9 -3.1Z"/>`;
        const text = (x, y, words, cls) => {
            const lines = String(words).split('\n');
            const dy = -((lines.length - 1) * 16) / 2;
            return `<text class="${cls}" x="${x}" y="${y + dy}" data-content>${lines.map((l, i) => `<tspan x="${x}" dy="${i ? 16 : 0}">${esc(l)}</tspan>`).join('')}</text>`;
        };
        let s = `<svg class="uzmap" viewBox="0 0 ${M.width} ${M.height}" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">`;
        s += `<rect class="map-sea" width="${M.width}" height="${M.height}"/>`;
        s += Object.values(M.neighbours).map((d) => `<path class="map-land" d="${d}"/>`).join('');
        s += Object.entries(M.names).map(([k, [x, y]]) => text(x, y, NAMES[k][ko ? 1 : 0], k === 'caspian' ? 'map-sea-name' : 'map-country')).join('');
        s += `<path class="map-shadow" d="${M.outline}" transform="translate(3 5)"/>`;
        REGIONS.forEach((r) => {
            const g = M.regions[r.id];
            if (!g) return;
            const cls = `map-region${r.id in stamped ? ' is-stamped' : ''}${r.id === sel ? ' is-selected' : ''}`;
            s += `<path class="${cls}" d="${g.d}" data-region="${r.id}" style="--fill:${r.fill}"/>`;
        });
        s += `<path class="map-border" d="${M.outline}"/>`;
        if (sel && M.regions[sel]) s += `<path class="map-outline" d="${M.regions[sel].d}"/>`;
        s += star(M.capital[0], M.capital[1], 1.1);
        REGIONS.forEach((r) => {
            const g = M.regions[r.id];
            if (!g) return;
            const [x, y] = g.label;
            const on = r.id in stamped;
            s += `<g class="map-label${on ? ' is-stamped' : ''}${r.id === sel ? ' is-selected' : ''}" data-region="${r.id}">` +
                (on ? `<circle class="map-mark" cx="${x}" cy="${y - 25}" r="11" style="--ink:${r.ink}"/><path class="map-tick" d="M${x - 5} ${y - 25} l3.6 3.8 l6.6 -7.4"/>` : '') +
                text(x, y + 5, name(r), 'map-name') + `</g>`;
        });
        // Korea, in its own box, and the way there from Tashkent
        const K = M.korea;
        const kr = byId.koreya;
        if (K && kr) {
            const [bx, by, bw, bh] = K.box;
            const [sx, sy] = K.seoul;
            const [tx, ty] = M.capital;
            const on = 'koreya' in stamped;
            s += `<g class="map-korea${on ? ' is-stamped' : ''}${sel === 'koreya' ? ' is-selected' : ''}" data-region="koreya">` +
                `<rect class="map-inset" x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="16"/>` +
                text(bx + bw / 2, by + 24, name(kr), 'map-name map-inset-title') +
                `<path class="map-land" d="${K.north}"/><path class="map-region${on ? ' is-stamped' : ''}" d="${K.south}" style="--fill:${kr.fill}"/>` +
                star(sx, sy, 0.8) + text(sx - 12, sy + 4, ko ? kr.koCity : kr.city, 'map-city') + `</g>`;
            s += `<path class="map-flight" d="M${tx + 4} ${ty - 12} Q${tx + 64} ${(ty + sy) / 2 + 20} ${sx + 9} ${sy + 9}"/>`;
            s += text((tx + sx) / 2 + 52, (ty + sy) / 2 + 4, `✈ ${String(M.seoulKm).replace(/\B(?=(\d{3})+$)/g, ' ')} km`, 'map-km');
        }
        return s + '</svg>';
    }

    root.Passport = {
        PRICE, REGIONS, STICKERS, NAMES,
        region, regionOf, sticker, dative, byDative, byName, books, stamps, stickerState, dateLabel,
        stickerSVG, stampSVG, emptySVG, mapSVG,
    };
})(window);
