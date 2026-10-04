/*
 * Qo'shimcha ↔ 조사 (js/suffix.js): the endings join words as Uzbek writes
 * them, every sentence pairs an Uzbek ending with a Korean particle that does
 * its job, every picture can be drawn, a game asks for every ending, and the
 * game's menus have their Korean.
 * Run with: node tests/suffix.test.js
 */
'use strict';

global.window = { matchMedia: () => ({ matches: false }) };
require('../js/art/core.js');
['people', 'animals', 'world', 'fx', 'landmarks'].forEach((f) => require(`../js/art/${f}.js`));
require('../js/translit.js');
require('../js/i18n.js');
require('../js/suffix.js');
const { Art, Suffix: S, Translit, I18n } = window;

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
// A seeded random, so a failure can be repeated.
const seeded = (seed) => () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
};

// ---------- the endings ----------

const ENDS = S.ENDINGS.map((e) => e.end);
check(ENDS.join() === 'ni,ga,da,dan,ning,lar', `the six endings, in order (${ENDS.join()})`);
const twins = (end) => S.ENDINGS.find((e) => e.end === end).ko.split('/');
S.ENDINGS.forEach((e) => {
    check(e.ko.split('/').every(hangul), `-${e.end}: its Korean twins "${e.ko}"`);
    check(e.ex.length > 0, `-${e.end}: an example for the table`);
    e.ex.forEach(([uz, ko, p]) => {
        check(S.fits(uz, e.end), `-${e.end}: "${uz}" takes it as written`);
        check(twins(e.end).includes(p), `-${e.end}: "${ko}${p}" uses one of its twins`);
        if (e.end === 'ni') check(p === (S.batchim(ko) ? '을' : '를'), `-ni: "${ko}${p}"`);
    });
});

// ---------- joining ----------

[
    ['tulki', 'ni', 'tulkini'], ['uy', 'da', 'uyda'], ['uy', 'dan', 'uydan'], ['Toshkent', 'ga', 'Toshkentga'], ['kitob', 'ni', 'kitobni'],
    ['mushuk', 'ga', 'mushukka'], ['barg', 'ga', 'bargka'], ['ayiq', 'ga', 'ayiqqa'], ["tog'", 'ga', "tog'qa"], ['qishloq', 'ga', 'qishloqqa'],
    ['mushuk', 'da', 'mushukda'], ["tog'", 'dan', "tog'dan"], ['ayiq', 'ning', 'ayiqning'], ['kuchuk', 'lar', 'kuchuklar'],
].forEach(([w, end, want]) => check(S.join(w, end) === want, `${w} + -${end} = ${want} (${S.join(w, end)})`));
check(!S.fits('mushuk', 'ga') && !S.fits("tog'", 'ga') && S.fits('mushuk', 'ni') && S.fits('tulki', 'ga'), 'fits: only words that take the ending as written');

[['여우', false], ['곰', true], ['말', true], ['빵', true], ['책', true], ['도깨비', false], ['수박', true], ['abc', false], ['', false]]
    .forEach(([ko, want]) => check(S.batchim(ko) === want, `batchim("${ko}") = ${want}`));

// ---------- the words ----------

const drawable = (part) => !!(Art.parts[part] || Art.cast[part]);
Object.entries(S.NOUNS).forEach(([kind, list]) => {
    const seen = new Set();
    list.forEach(([uz, ko, pic]) => {
        check(/^[A-Za-z']+$/.test(uz) && (kind === 'place' || uz === uz.toLowerCase()), `${kind} "${uz}": one Uzbek word in Latin`);
        check(hangul(ko) && !/[ ()]/.test(ko), `${kind} "${uz}": "${ko}" is one Korean word`);
        check(!seen.has(uz), `${kind} "${uz}": listed once`);
        seen.add(uz);
        const parts = Array.isArray(pic) ? pic.map((it) => it[0]) : [pic.split(':')[0]];
        check(parts.every(drawable), `${kind} "${uz}": its picture (${parts.join(', ')}) can be drawn`);
    });
});

// ---------- the sentences ----------

const all = S.all();
const ids = new Set(all.map((r) => r.id));
check(ids.size === all.length, 'every sentence has its own id');
const uzSeen = new Map();
const koSeen = new Map();
const warn = console.warn;
const warned = [];
console.warn = (...a) => warned.push(a.join(' '));
all.forEach((r) => {
    const uz = S.sentence(r);
    const ko = S.korean(r);
    check(ENDS.includes(r.end), `${r.id}: a known ending`);
    check(S.fits(r.uz[1], r.end), `${r.id}: "${r.uz[1]}" takes -${r.end} as written on its button`);
    check(/^[A-Z]/.test(uz) && /\.$/.test(uz) && /^[A-Za-z' .]+$/.test(uz), `${r.id}: "${uz}" is a sentence in Latin`);
    check(/^[가-힣 .]+$/.test(ko), `${r.id}: "${ko}" is a sentence in Korean`);
    check(ko.includes(r.ko[1] + r.ko[2]) && uz.toLowerCase().includes((r.uz[1] + r.end).toLowerCase()), `${r.id}: the word and its ending are in the sentences`);
    check(twins(r.end).includes(r.ko[2]), `${r.id}: "${r.ko[2]}" is a twin of -${r.end} (${S.ENDINGS.find((e) => e.end === r.end).ko})`);
    if (r.end === 'ni') check(r.ko[2] === (S.batchim(r.ko[1]) ? '을' : '를'), `${r.id}: ${r.ko[1]}${r.ko[2]}`);
    if (r.end === 'lar') check(r.ko[3].startsWith('이 '), `${r.id}: 들 then 이 (${ko})`);
    check(!uzSeen.has(uz), `${r.id}: "${uz}" is asked once (also ${uzSeen.get(uz)})`);
    check(!koSeen.has(ko), `${r.id}: "${ko}" is asked once (also ${koSeen.get(ko)})`);
    uzSeen.set(uz, r.id);
    koSeen.set(ko, r.id);
    // its picture: every part drawn
    check(Array.isArray(r.art) && r.art.length > 0 && r.art.every((it) => drawable(it[0])), `${r.id}: its picture's parts can be drawn`);
    const svg = S.picture(r);
    check((svg.match(/data-w="/g) || []).length >= r.art.length && svg.includes('data-fit'), `${r.id}: its picture is drawn, to be framed`);
    // the Uzbek on screen is in pieces (word, ending, the rest): in Cyrillic, the pieces read as the whole
    const cyr = Translit.toCyrillic;
    const pieces = cyr(r.uz[0] + S.word(r)) + cyr(r.end) + cyr(r.uz[2]);
    check(pieces === cyr(uz), `${r.id}: in Cyrillic, "${pieces}" = "${cyr(uz)}"`);
});
console.warn = warn;
check(warned.length === 0, `no unknown parts: ${warned.slice(0, 3).join(' | ')}`);

ENDS.forEach((end) => {
    const n = all.filter((r) => r.end === end).length;
    check(n >= 10, `-${end}: ${n} sentences to ask`);
});
// every word is asked about somewhere, and no sentence asks for -ga where Uzbek writes -ka or -qa
Object.entries(S.NOUNS).forEach(([kind, list]) => list.forEach(([uz]) => check(all.some((r) => r.uz[1] === uz), `${kind} "${uz}" is in a sentence`)));
check(all.filter((r) => r.end === 'ga').every((r) => !/(k|g|q|g')$/.test(r.uz[1])), 'no -ga sentence needs -ka or -qa');

// a few, word for word
const find = (id) => all.find((r) => r.id === id);
[
    ['ni:who:tulki', "Tulkini ko'rdim.", '여우를 봤어요.'],
    ['ni:food:non', 'Nonni yedim.', '빵을 먹었어요.'],
    ['ga:who:quyon', 'Quyonga salom berdim.', '토끼에게 인사했어요.'],
    ['ga:place:Seul', 'Seulga bordim.', '서울에 갔어요.'],
    ["da:place:o'rmon", "O'rmonda o'ynadim.", '숲에서 놀았어요.'],
    ['dan:place:Toshkent', 'Toshkentdan keldim.', '타슈켄트에서 왔어요.'],
    ['ning:who:tulki', 'Bu tulkining uyi.', '이건 여우의 집이에요.'],
    ['lar:who:ayiq', 'Ayiqlar keldi.', '곰들이 왔어요.'],
].forEach(([id, uz, ko]) => {
    const r = find(id);
    check(r && S.sentence(r) === uz && S.korean(r) === ko, `${id}: "${uz}" = "${ko}" (${r ? `${S.sentence(r)} = ${S.korean(r)}` : 'missing'})`);
});
const home = all.find((r) => S.sentence(r) === 'Mushuk uyda.');
check(home && S.korean(home) === '고양이가 집에 있어요.' && S.word(home) === 'uy', '"Mushuk uyda." = "고양이가 집에 있어요." (the word stays small mid-sentence)');
const morning = all.find((r) => r.uz[1] === 'ertalab');
check(morning && morning.end === 'dan' && morning.ko[2] === '부터', '"Ertalabdan" = "아침부터": -dan is 부터 too');

// ---------- a game ----------

for (let seed = 1; seed <= 40; seed++) {
    const six = S.pick(6, seeded(seed));
    check(six.length === 6 && ENDS.every((end) => six.filter((r) => r.end === end).length === 1), `seed ${seed}: six sentences, every ending once (${six.map((r) => r.end).join()})`);
    const nine = S.pick(9, seeded(seed));
    check(nine.length === 9 && new Set(nine).size === 9 && ENDS.every((end) => nine.some((r) => r.end === end)), `seed ${seed}: nine different sentences with every ending`);
    const three = S.pick(3, seeded(seed));
    check(three.length === 3 && new Set(three.map((r) => r.end)).size === 3, `seed ${seed}: three sentences, three endings`);
}
const firsts = new Set(Array.from({ length: 40 }, (_, i) => S.pick(6, seeded(i + 1))[0].id));
check(firsts.size > 10, `games differ (${firsts.size} first sentences in 40 games)`);

// ---------- hints ----------

const by = (pred) => all.find(pred);
const playDa = by((r) => r.end === 'da' && r.ko[2] === '에서');
const fromDan = by((r) => r.end === 'dan' && r.ko[2] === '에서');
const toGa = by((r) => r.end === 'ga' && r.ko[2] === '에');
const atDa = by((r) => r.end === 'da' && r.ko[2] === '에');
const greetGa = by((r) => r.end === 'ga' && r.ko[2] === '에게');
check(S.hint(playDa, 'dan') === 'eseo' && S.hint(fromDan, 'da') === 'eseo', '에서: -da or -dan, "qayerda? qayerdan?"');
check(S.hint(toGa, 'da') === 'e' && S.hint(atDa, 'ga') === 'e', '에: -ga or -da, "qayerga? qayerda?"');
check(S.hint(greetGa, 'da') === 'look' && S.hint(playDa, 'ni') === 'look' && S.hint(fromDan, 'ga') === 'look', 'otherwise: look at the Korean again');

// ---------- the game's menus in Korean ----------

check(Object.keys(S.HINTS).sort().join() === 'e,eseo,look', 'a hint for every reason');
Object.entries(S.HINTS).forEach(([why, uz]) => {
    const ko = I18n.translate(uz, 'ko');
    check(ko !== uz && hangul(ko), `Korean menus: the "${why}" hint → "${ko}"`);
    // the endings it names stay whole at a line's end, in both languages
    [uz, ko].forEach((t) => check(!/-[a-z]/.test(t), `"${t}": every ending's hyphen is joined to it`));
});

const read = (f) => require('fs').readFileSync(require('path').join(__dirname, '..', f), 'utf8');
const games = read('js/games.js');
const html = read('index.html');

[
    "Qo'shimcha ↔ 조사", "을/를, 에, 에서… o'zbekchada qanday?", "🧩 Qo'shimcha ↔ 조사",
    "O'zbek va koreys tillari qarindosh: ikkalasida ham so'z oxiriga qo'shimcha qo'shiladi, fe'l esa gap oxirida keladi.",
    '▶ Boshladik!', "Koreyscha gapni o'qing. O'zbekchada qaysi qo'shimcha keladi?",
    "🎉 Barakalla! Hamma qo'shimchalarni topdingiz!",
].forEach((uz) => {
    const ko = I18n.translate(uz, 'ko');
    check(ko !== uz && hangul(ko), `Korean menus: "${uz}" → "${ko}"`);
    // and the game shows it as written here
    check(games.includes(uz) || html.includes(uz), `"${uz}" is what the game shows`);
});

console.log(failed ? `\n${failed} of ${total} checks FAILED` : `\nall ${total} checks passed`);
process.exit(failed ? 1 : 0);
