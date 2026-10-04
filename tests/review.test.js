/*
 * Kunlik 5 so'z (js/review.js): days are counted right, a word known comes
 * back after 1, 2, 4, 8, 16 and then every 32 days, a word missed comes back
 * the next day, a day never asks more than five, every word gets its turn,
 * and the menus have their Korean.
 * Run with: node tests/review.test.js
 */
'use strict';

global.window = {};
require('../js/review.js');
require('../js/i18n.js');
const { Review: R, I18n } = window;

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
const seeded = (seed) => () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
};
const words = (n) => Array.from({ length: n }, (_, i) => ({ term: `soz${String.fromCharCode(97 + (i % 26))}${Math.floor(i / 26)}`, meaning: '' }));

// ---------- days ----------

check(R.day(new Date(2026, 0, 5, 23, 59)) === '2026-01-05' && R.day(new Date(2026, 9, 4, 0, 1)) === '2026-10-04', 'a day in the phone\'s own time');
[['2026-10-04', 1, '2026-10-05'], ['2026-10-31', 1, '2026-11-01'], ['2026-12-30', 4, '2027-01-03'], ['2028-02-28', 1, '2028-02-29'], ['2027-02-28', 1, '2027-03-01'], ['2026-03-01', -1, '2026-02-28'], ['2026-10-04', 32, '2026-11-05']]
    .forEach(([d, n, want]) => check(R.addDays(d, n) === want, `${d} + ${n} = ${want} (${R.addDays(d, n)})`));
[['2026-10-04', '2026-10-04', 0], ['2026-10-04', '2026-11-03', 30], ['2026-12-31', '2027-01-01', 1], ['2028-02-01', '2028-03-01', 29]]
    .forEach(([a, b, want]) => check(R.between(a, b) === want, `${a} → ${b}: ${want} days (${R.between(a, b)})`));

// ---------- one word's schedule ----------

check(R.PER_DAY === 5 && R.DAYS.join() === '0,1,2,4,8,16,32' && R.TOP === 6, 'five a day; back after 1, 2, 4, 8, 16, 32 days');
let rec = null;
let on = '2026-10-04';
const gaps = [];
for (let i = 0; i < 8; i++) {
    rec = R.answer(rec, true, on);
    gaps.push(R.between(on, rec.due));
    on = rec.due;
}
check(gaps.join() === '1,2,4,8,16,32,32,32', `known every time: back after ${gaps.join(', ')} days`);
check(rec.box === R.TOP, 'and it stays in the top box');
const missed = R.answer({ box: 5, due: '2026-10-04' }, false, '2026-10-04');
check(missed.box === 1 && missed.due === '2026-10-05', 'missed: back to the first box, tomorrow');
check(R.answer(undefined, false, '2026-10-04').due === '2026-10-05', 'a new word missed: tomorrow');

// ---------- a day's words ----------

const list = words(12);
const key = R.key;
check(key({ term: 'Olma' }) === 'olma', 'a word is kept in lower case');
const first = R.due(list, {}, '2026-10-04', 5, seeded(1));
check(first.length === 5 && new Set(first.map(key)).size === 5, 'a new dictionary: five new words');
check(R.due(list, {}, '2026-10-04', 0).length === 0 && R.due(list, {}, '2026-10-04', -2).length === 0, 'none left today: none');
const state = {};
list.forEach((e, i) => { if (i < 7) state[key(e)] = { box: 1 + (i % 3), due: ['2026-10-01', '2026-10-04', '2026-10-09'][i % 3] }; });
const today = R.due(list, state, '2026-10-04', 5, seeded(2));
const dueKeys = list.filter((e) => state[key(e)] && state[key(e)].due <= '2026-10-04').map(key);
check(today.slice(0, dueKeys.length).every((e) => dueKeys.includes(key(e))), 'the words due come first');
check(key(today[0]) === key(list[0]) && state[key(today[0])].due === '2026-10-01', 'the longest waiting first');
check(today.slice(dueKeys.length).every((e) => !state[key(e)]), 'then new words');
check(today.every((e) => !state[key(e)] || state[key(e)].due <= '2026-10-04'), 'never a word not yet due');

// ---------- many days ----------

// A child who comes every day for 120 days, knows a word the second time
// it is asked, and finds two new words a week.
let pool = words(10);
const sched = {};
const asked = {};
let day = '2026-10-04';
let most = 0;
let late = 0;
const rand = seeded(7);
for (let d = 0; d < 120; d++) {
    if (d % 3 === 0 && pool.length < 50) pool = pool.concat(words(pool.length + 1).slice(pool.length));
    const todays = R.due(pool, sched, day, R.PER_DAY, rand);
    most = Math.max(most, todays.length);
    todays.forEach((e) => {
        const k = key(e);
        if (sched[k] && R.between(sched[k].due, day) > 7) late++;
        asked[k] = (asked[k] || 0) + 1;
        sched[k] = R.answer(sched[k], asked[k] > 1 || rand() > 0.3, day);
    });
    day = R.addDays(day, 1);
}
check(most === R.PER_DAY, `never more than ${R.PER_DAY} a day (${most})`);
check(pool.every((e) => asked[key(e)] >= 1), `every word has had its turn (${Object.keys(asked).length} of ${pool.length})`);
const g = R.garden(pool, sched);
check(g.seed + g.sprout + g.tree === pool.length && g.tree > 0, `the garden grows: 🌱 ${g.seed} 🌿 ${g.sprout} 🌳 ${g.tree}`);
check(late === 0, `no word waits more than a week past its day (${late})`);

// ---------- next, garden, choices, clue ----------

check(R.next(list, {}, '2026-10-04') === null, 'nothing scheduled: no next day');
const nx = R.next(list, { [key(list[0])]: { box: 2, due: '2026-10-06' }, [key(list[1])]: { box: 2, due: '2026-10-06' }, [key(list[2])]: { box: 3, due: '2026-10-08' }, [key(list[3])]: { box: 1, due: '2026-10-04' } }, '2026-10-04');
check(nx && nx.on === '2026-10-06' && nx.n === 2, `the next day with words: ${JSON.stringify(nx)}`);
const gg = R.garden(list.slice(0, 6), { [key(list[0])]: { box: 1 }, [key(list[1])]: { box: 2 }, [key(list[2])]: { box: 3 }, [key(list[3])]: { box: 4 }, [key(list[4])]: { box: 6 } });
check(gg.seed === 2 && gg.sprout === 2 && gg.tree === 2, `garden: 🌱 new and box 1, 🌿 2–3, 🌳 4–6 (${JSON.stringify(gg)})`);
for (let s = 1; s <= 30; s++) {
    const e = list[s % list.length];
    const c = R.choices(e, list, 3, seeded(s));
    check(c.length === 3 && c.includes(e) && new Set(c.map(key)).size === 3, `seed ${s}: three different words, the right one among them`);
}
check(R.choices(list[0], list.slice(0, 2), 3).length === 2, 'a small dictionary: as many as there are');
[
    ['laylak', "Oyoqlari va tumshug'i uzun, oq-qora qush. Buxoroda laylaklar minoralarga in quradi", "Oyoqlari va tumshug'i uzun, oq-qora qush. Buxoroda … minoralarga in quradi"],
    ['asal', "Asalarilar gullardan yig'adigan shirin bol", "… gullardan yig'adigan shirin bol"],
    ['yozuv', 'Harflar bilan yozish usuli: lotin, kirill yoki arab yozuvi', 'Harflar bilan yozish usuli: lotin, kirill yoki arab …'],
    ['tandir', "Loydan yasalgan, non yopiladigan o'choq", "Loydan yasalgan, non yopiladigan o'choq"],
    ['ot', 'Otlar chopadi, botir ot minadi', '… chopadi, botir … minadi'],
].forEach(([term, meaning, want]) => check(R.clue({ term, meaning }) === want, `clue for ${term}: "${R.clue({ term, meaning })}"`));
check(R.clue({ term: 'tulki' }) === '', 'a word found in a picture has no meaning to show');

// ---------- the menus in Korean ----------

[
    "📅 Kunlik 5 so'z", "✅ Bugungi so'zlar tugadi!", "🌳 Bugun takrorlanadigan so'z yo'q.", 'Ertaga yana keling.', "Yangi so'z", "O'syapti", 'Bilaman', '▶ Boshlash',
    "Rasmga qarang: bu qaysi so'z?", "🤔 To'g'risi yashil rangda. Bu so'z yana keladi.", "🎉 Barakalla! Bugungi so'zlar tugadi!",
    "Bugun 5 ta so'z sizni kutyapti!", "Bugun 1 ta so'z sizni kutyapti!", "Keyingi so'zlar 3 kundan keyin.", "Keyingi so'zlar 16 kundan keyin.",
].forEach((uz) => {
    const ko = I18n.translate(uz, 'ko');
    check(ko !== uz && hangul(ko) && !/[a-z]{3}/i.test(ko), `Korean menus: "${uz}" → "${ko}"`);
});
check(I18n.translate("Bugun 3 ta so'z sizni kutyapti!", 'ko').includes('3개') && I18n.translate("Keyingi so'zlar 4 kundan keyin.", 'ko').includes('4일'), 'the numbers carry over');
const read = (f) => require('fs').readFileSync(require('path').join(__dirname, '..', f), 'utf8');
const app = read('js/app.js') + read('js/games.js') + read('index.html');
["📅 Kunlik 5 so'z", "✅ Bugungi so'zlar tugadi!", "🌳 Bugun takrorlanadigan so'z yo'q.", 'Ertaga yana keling.', "Yangi so'z", "O'syapti", 'Bilaman', '▶ Boshlash', "Rasmga qarang: bu qaysi so'z?", "🤔 To'g'risi yashil rangda. Bu so'z yana keladi.", "🎉 Barakalla! Bugungi so'zlar tugadi!", "ta so'z sizni kutyapti!", 'kundan keyin.']
    .forEach((t) => check(app.includes(t), `"${t}" is what the app shows`));

console.log(failed ? `\n${failed} of ${total} checks FAILED` : `\nall ${total} checks passed`);
process.exit(failed ? 1 : 0);
