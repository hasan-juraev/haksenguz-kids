/*
 * O'qish daraxti (js/tree.js): a leaf for each library book finished, in
 * the order read, a flower for each story written, a tree that grows and
 * stays inside its picture, leaves that don't pile up, and the menus in
 * Korean.
 * Run with: node tests/tree.test.js
 */
'use strict';

global.window = { matchMedia: () => ({ matches: false }) };
require('../js/book.js');
['folk', 'classic', 'twins', 'korea', 'holiday', 'short', 'alifbo'].forEach((f) => require(`../js/stories-${f}.js`));
require('../js/i18n.js');
require('../js/tree.js');
const { ReadingTree: T, I18n } = window;
const db = window.storiesDatabase;

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
const keys = Object.keys(db);

// ---------- which books ----------

const profile = {
    books: {
        [keys[3]]: { finished: true, finishedAt: 300 },
        [keys[1]]: { finished: true, finishedAt: 100 },
        [keys[2]]: { finished: false, page: 4 },
        [keys[5]]: { finished: true }, // read before the time was kept
        gone: { finished: true, finishedAt: 50 }, // a book no longer in the library
    },
    myBooks: {
        b2: { id: 'b2', title: 'Ikkinchi', created: 20, pages: [{}] },
        b1: { id: 'b1', title: 'Birinchi', created: 10, pages: [{}] },
        b0: { id: 'b0', title: 'Bo\'sh', created: 5, pages: [] },
        b3: { id: 'b3', title: '', created: 30, pages: [{}] },
    },
};
const read = T.leaves(db, profile);
check(read.map((b) => b.key).join() === [keys[5], keys[1], keys[3]].join(), `the books finished, the first read first (${read.map((b) => b.key).join()})`);
check(read.every((b) => b.title === db[b.key].title && b.category === db[b.key].category), 'each leaf knows its book and shelf');
check(T.leaves(Object.assign({}, db, { mine1: { title: 'x', mine: true, pages: [] } }), { books: { mine1: { finished: true } } }).length === 0, 'a made book is a flower, not a leaf');
check(T.leaves(db, null).length === 0 && T.flowers(null).length === 0, 'a new child: nothing yet');
const wrote = T.flowers(profile);
check(wrote.map((b) => b.id).join() === 'b1,b2,b3', `the stories written, the first first, empty ones left out (${wrote.map((b) => b.id).join()})`);
check(wrote[2].title === 'Mening ertagim', 'a story with no title has the maker\'s name for it');

// ---------- the tree grows, inside its picture ----------

let last = null;
for (let n = 1; n <= 60; n++) {
    const s = T.shape(n);
    check(s.cy - s.r * 0.82 * 1.4 >= 0 && s.cx - s.r * 1.2 >= 0 && s.cx + s.r * 1.2 <= 320 && s.cy + s.r < 268, `${n}: the crown stays in the picture`);
    if (last) check(s.r >= last.r && s.trunk >= last.trunk, `${n}: the tree only grows`);
    last = s;
    const at = T.spots(n);
    check(at.length === n && at.every(([x, y]) => Math.hypot((x - s.cx) / s.r, (y - s.cy) / (s.r * 0.82)) <= 0.9), `${n}: every leaf grows inside the crown`);
    let near = Infinity;
    at.forEach(([x, y], i) => at.slice(i + 1).forEach(([u, v]) => { near = Math.min(near, Math.hypot(x - u, y - v)); }));
    if (n > 1) check(near >= 9, `${n}: no two leaves on top of each other (${near.toFixed(1)})`);
}
const all = keys.map((k) => ({ key: k, title: db[k].title, category: db[k].category }));
check(new Set(all.map((b) => b.category)).size > 1 && all.every((b) => T.COLORS[b.category]), 'every shelf has its colour');

// ---------- the picture ----------

const svg = T.svg(read, wrote);
check((svg.match(/class="tree-leaf"/g) || []).length === 3 && (svg.match(/class="tree-leaf tree-flower"/g) || []).length === 3, 'three leaves and three flowers');
read.forEach((b) => check(svg.includes(`data-key="${b.key}"`), `a leaf for ${b.key}`));
check(svg.includes('data-mine="b1"') && svg.includes('data-mine="b2"'), 'a flower for each story written');
check((svg.match(/role="button" tabindex="0" aria-label="/g) || []).length === 6, 'each one can be reached and is named for its book');
const korea = keys.filter((k) => db[k].category === 'korea');
const blossom = T.svg(korea.map((k) => ({ key: k, title: db[k].title, category: 'korea' })), []);
check(korea.length > 0 && !blossom.includes('M0 -10 C7') && blossom.includes(T.COLORS.korea), 'a Korean book blooms like a cherry tree');
const sprout = T.svg([], []);
check(!sprout.includes('tree-leaf') && sprout.includes('aria-hidden="true"'), 'nothing read yet: a sprout');
check(!/NaN|undefined/.test(T.svg(all, wrote)), 'the whole library on one tree draws cleanly');

// ---------- the menus in Korean ----------

[
    'Daraxtim', '🌳 Mening daraxtim', "🌱 Birinchi kitobni o'qing — daraxtingiz unib chiqadi!", "Bargga bosing — qaysi kitob ekanini ko'rasiz.", '📖 Ochish',
    "🍃 3 ta kitob o'qildi — har biri bir barg.", "🍃 34 ta kitob o'qildi — har biri bir barg.", '🌼 1 ta ertak yozdingiz — har biri bir gul.',
].forEach((uz) => {
    const ko = I18n.translate(uz, 'ko');
    check(ko !== uz && hangul(ko) && !/[a-z]{2}/i.test(ko), `Korean menus: "${uz}" → "${ko}"`);
});
const read2 = (f) => require('fs').readFileSync(require('path').join(__dirname, '..', f), 'utf8');
const src = read2('js/app.js') + read2('index.html');
['Daraxtim', '🌳 Mening daraxtim', "🌱 Birinchi kitobni o'qing — daraxtingiz unib chiqadi!", "Bargga bosing — qaysi kitob ekanini ko'rasiz.", '📖 Ochish', "ta kitob o'qildi — har biri bir barg.", 'ta ertak yozdingiz — har biri bir gul.']
    .forEach((t) => check(src.includes(t), `"${t}" is what the app shows`));

console.log(failed ? `\n${failed} of ${total} checks FAILED` : `\nall ${total} checks passed`);
process.exit(failed ? 1 : 0);
