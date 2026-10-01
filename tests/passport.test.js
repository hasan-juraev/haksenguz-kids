/*
 * Madaniyat pasporti (js/passport.js, map in js/uzmap.js): the places and
 * their facts, stamps from finished books, stickers bought with points, the
 * map itself (each region's centre city lies inside it) and the Korean.
 * Run with: node tests/passport.test.js
 */
'use strict';

const store = {};
global.window = {
    matchMedia: () => ({ matches: false }),
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } },
};
require('../js/art/core.js');
['people', 'animals', 'world', 'fx', 'landmarks'].forEach((f) => require(`../js/art/${f}.js`));
require('../js/book.js');
['folk', 'classic', 'twins', 'korea', 'holiday', 'alifbo', 'ko'].forEach((f) => require(`../js/stories-${f}.js`));
require('../js/i18n.js');
require('../js/store.js');
require('../js/uzmap.js');
require('../js/passport.js');
const db = window.storiesDatabase;
const { Art, UzMap: M, Passport: P, I18n } = window;

let failed = 0;
let total = 0;
const check = (cond, msg) => {
    total++;
    if (!cond) {
        failed++;
        console.log(`✗ ${msg}`);
    }
};
const hangul = (t) => /[가-힣]/.test(t || '');
const text = (t) => typeof t === 'string' && t.trim().length > 0;

// ---------- places ----------
const ids = P.REGIONS.map((r) => r.id);
check(ids.length === 15 && new Set(ids).size === 15, `14 regions and Korea, each once: ${ids.join(' ')}`);
check(Object.keys(M.regions).sort().join() === ids.filter((id) => id !== 'koreya').sort().join(), 'the map has exactly the 14 regions');
P.REGIONS.forEach((r) => {
    check(text(r.name) && hangul(r.ko), `${r.id}: a name and a Korean name`);
    check(text(r.fact) && /[.!]$/.test(r.fact) && !hangul(r.fact), `${r.id}: a fact in Uzbek`);
    check(hangul(r.koFact) && r.koFact.split(/[.!?]\s/).length >= 2, `${r.id}: the fact in Korean`);
    check(r.city === null || (text(r.city) && hangul(r.koCity)), `${r.id}: its city in Korean`);
    check(/^#[0-9a-f]{6}$/.test(r.ink) && /^#[0-9a-f]{6}$/.test(r.fill), `${r.id}: ink and map colours`);
    check(r.stickers.length === 2, `${r.id}: two stickers`);
    check(P.books(db, r.id).length >= 1, `${r.id}: at least one book goes there`);
    check(P.byDative(P.dative(r.name)) === r && P.byName(r.name) === r, `${r.id}: found again by its name`);
});
check(P.dative('Xorazm') === 'Xorazmga' && P.dative('Toshkent viloyati') === 'Toshkent viloyatiga' && P.dative('Ipak') === 'Ipakka' && P.dative('Iroq') === 'Iroqqa', 'dative: -ga, -ka after k, -qa after q');

// Every book but the Alifbo goes somewhere; Korean-life and Korean tales go to Korea.
Object.entries(db).forEach(([key, st]) => {
    if (st.category === 'alifbo') return;
    check(P.regionOf(st), `${key}: has a place`);
    if (['korea', 'twins'].includes(st.category) && key !== 'buvijon_qongiroq') check(st.region === 'koreya', `${key}: a story set in Korea goes to Korea`);
});
check(P.regionOf(db.afandi_1).id === 'buxoro' && P.regionOf(db.navoiy_farhod).id === 'navoiy' && P.regionOf(db.oltin_tarvuz).id === 'xorazm', 'Afandi to Buxoro, Navoiy to Navoiy, the melon field to Xorazm');
check(P.regionOf(db.buvijon_qongiroq).id === 'samarqand' && P.regionOf(db.sirli_sandiq).id === 'samarqand', 'Buvijon lives in Samarqand');

// ---------- stickers ----------
const sids = P.STICKERS.map((x) => x.id);
check(sids.length === 30 && new Set(sids).size === 30, '30 stickers, each with its own id');
P.STICKERS.forEach((x) => {
    check(text(x.name) && hangul(x.ko), `${x.id}: a name and a Korean name`);
    check(x.art.every(([part]) => Art.parts[part] || Art.cast[part]), `${x.id}: drawn with known parts (${x.art.map((a) => a[0]).join(', ')})`);
    const svg = P.stickerSVG(x);
    check(/^<svg class="sticker-svg"/.test(svg) && svg.includes('feMorphology') && svg.length > 400, `${x.id}: a sticker picture with a white edge`);
});
check(P.PRICE === 50, 'a sticker costs 50 points');

// ---------- stamps ----------
const profile = (books, extra = {}) => Object.assign({ points: 0, stickers: {}, books }, extra);
check(Object.keys(P.stamps(db, profile({}))).length === 0, 'a new child has no stamps');
const s1 = P.stamps(db, profile({
    oltin_tarvuz: { finished: true, finishedAt: 300 },
    hakim_qizi: { finished: true, finishedAt: 100 },
    sehrli_gilam: { finished: true },
    afandi_1: { finished: false, page: 4 },
    alifbo: { finished: true, finishedAt: 50 },
    asal_ismi: { finished: true },
    nosuchbook: { finished: true },
}));
check(Object.keys(s1).sort().join() === 'koreya,xorazm', `finished books stamp their places, others don't: ${Object.keys(s1)}`);
check(s1.xorazm === 100, 'the stamp is dated by the first book finished there');
check(s1.koreya === 0, 'a book finished before the passport existed stamps without a date');
check(P.dateLabel(new Date(2026, 9, 1).getTime()) === '01.10.2026' && P.dateLabel(0) === '', 'stamp dates read 01.10.2026');

// what a child may do with a sticker
const asal = profile({ oltin_tarvuz: { finished: true } }, { points: 70, stickers: { kaltaminor: 1 } });
check(P.stickerState(db, asal, 'kaltaminor') === 'have', 'a sticker bought is theirs');
check(P.stickerState(db, asal, 'qovun') === 'ok', 'a sticker of a stamped place, with points enough, can be had');
check(P.stickerState(db, asal, 'registon') === 'stamp', 'a place not visited yet keeps its stickers');
check(P.stickerState(db, Object.assign({}, asal, { points: 49 }), 'qovun') === 'points', 'not enough points');
check(P.stickerState(db, asal, 'nothing') === 'none', 'an unknown sticker');

// the store spends points only if there are enough
const st = new window.Store();
st.profile().points = 60;
check(st.spendPoints(50) === true && st.profile().points === 10, 'spending 50 of 60 points leaves 10');
check(st.spendPoints(50) === false && st.profile().points === 10, 'spending more than there is: nothing happens');
check(st.spendPoints(-5) === false && st.spendPoints(0) === false, 'nothing to spend');
check(JSON.stringify(st.profile().stickers) === '{}', 'a new profile has no stickers');

// ---------- pictures ----------
const stamp = P.stampSVG(P.region('xorazm'), { date: new Date(2026, 9, 1).getTime() });
check(stamp.includes('XORAZM') && stamp.includes("O'ZBEKISTON") && stamp.includes('01.10.2026') && stamp.includes('textPath'), 'a round stamp: name, country, date');
const stamp2 = P.stampSVG(P.region('xorazm'));
const idOf = (svg) => /id="(pstamp\d+)-ink"/.exec(svg)[1];
check(idOf(stamp) !== idOf(stamp2), 'two stamps on a page do not share their filters');
const kor = P.stampSVG(P.region('koreya'));
check(kor.includes('KOREYA') && kor.includes('SEUL') && kor.includes('<rect'), "Korea's stamp is square, with Seoul");
check(P.emptySVG(P.region('buxoro')).includes('?'), 'an empty place for a stamp to come');

const map = P.mapSVG({ stamped: { xorazm: 1, koreya: 1 }, selected: 'samarqand' });
check((map.match(/class="map-region[^"]*" d="/g) || []).length === 15, 'the map draws 14 regions and South Korea');
check((map.match(/map-region is-stamped/g) || []).length === 2 && map.includes('class="map-outline"'), 'stamped places in colour, the open one outlined');
check(map.includes('Qoraqalpog') && map.includes('Kaspiy dengizi') && map.includes('4 900 km'), 'names, the Caspian and the way to Seoul');
const koMap = P.mapSVG({ lang: 'ko' });
check(koMap.includes('사마르칸트') && koMap.includes('카스피해') && !koMap.includes('>Samarqand<'), 'with Korean menus, the map has Korean names');

// ---------- the map's geometry ----------
const rings = (d) => {
    const out = [];
    let cur = null;
    let x = 0;
    let y = 0;
    for (const m of d.matchAll(/([Mlz])([^Mlz]*)/g)) {
        const n = (m[2].match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
        if (m[1] === 'M') {
            [x, y] = n;
            cur = [[x, y]];
            out.push(cur);
        } else if (m[1] === 'l') {
            for (let i = 0; i < n.length; i += 2) {
                x += n[i];
                y += n[i + 1];
                cur.push([x, y]);
            }
        }
    }
    return out;
};
const inside = (rs, [px, py]) => {
    let odd = false;
    rs.forEach((r) => {
        for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
            const [xi, yi] = r[i];
            const [xj, yj] = r[j];
            if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) odd = !odd;
        }
    });
    return odd;
};
check(M.width === 1000 && M.height > 600 && M.height < 720, `the map is ${M.width} x ${M.height}`);
P.REGIONS.filter((r) => r.at).forEach((r) => {
    const at = M.project(...r.at);
    const hits = Object.keys(M.regions).filter((k) => inside(rings(M.regions[k].d), at));
    check(hits.length === 1 && hits[0] === r.id, `${r.id}: ${r.city || 'Toshkent'} lies in it on the map (found in: ${hits.join(', ') || 'none'})`);
    if (r.id !== 'toshkent') check(inside(rings(M.regions[r.id].d), M.regions[r.id].label), `${r.id}: its name is inside it`);
});
check(M.project(41.2995, 69.2401).map(Math.round).join() === M.capital.join(), 'the star is on Tashkent');
check(inside(rings(M.korea.south), M.korea.seoul), "Seoul's star is in South Korea");
check(M.seoulKm === 4900, `Tashkent to Seoul: ${M.seoulKm} km`);
check(/4900 km/.test(P.region('koreya').fact) && /4,900km/.test(P.region('koreya').koFact), "Korea's fact says so too");

// ---------- Korean menus ----------
const ko = (t) => I18n.translate(t, 'ko');
check(ko('📍 Bu ertak seni Xorazmga olib bordi!') === '📍 이 이야기를 따라 호라즘에 다녀왔어요!', 'the end of a book, in Korean');
check(ko('📍 Bu ertak seni Toshkent viloyatiga olib bordi!').includes('타슈켄트주에'), '... with a two-word place');
check(ko('🗺️ Yangi muhr: Qashqadaryo!') === '🗺️ 새 도장: 카슈카다리야!', 'a new stamp, in Korean');
check(ko('🎁 Yangi stiker: Kalta minor!') === '🎁 새 스티커: 칼타 미노르!', 'a new sticker, in Korean');
check(ko('3 / 15 muhr') === '도장 3 / 15개' && ko('Yana 20 ball kerak') === '20점 더 필요해요', 'counts, in Korean');

console.log(`${total - failed}/${total} passed`);
if (failed) process.exit(1);
