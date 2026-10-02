/*
 * Every book is complete and well formed: pages with a title, text and a
 * picture, questions whose right answer exists, an age range that puts it on
 * the library's shelves (js/levels.js) and a place in the culture passport.
 * Run with: node tests/stories.test.js
 */
'use strict';

global.window = { matchMedia: () => ({ matches: false }) };
require('../js/book.js');
require('../js/stories-folk.js');
require('../js/stories-classic.js');
require('../js/stories-twins.js');
require('../js/stories-korea.js');
require('../js/stories-holiday.js');
require('../js/stories-short.js');
require('../js/stories-alifbo.js');
require('../js/levels.js');
require('../js/holidays.js');
require('../js/passport.js');
const db = window.storiesDatabase;
const { SHELVES, AGES, shelfFor, fits, label, ageLabel } = window.Levels;
const { sentences } = window.BookEngine;

let failed = 0;
let total = 0;
const check = (cond, msg) => {
    total++;
    if (!cond) {
        failed++;
        console.log(`✗ ${msg}`);
    }
};
const text = (s) => typeof s === 'string' && s.trim().length > 0;
const goodQuestion = (q, where) => {
    check(text(q.q) && Array.isArray(q.a) && q.a.length >= 2 && q.a.every(text), `${where}: a question needs its text and at least two answers`);
    check(Number.isInteger(q.ok) && q.ok < q.a.length, `${where}: the right answer (ok: ${q.ok}) is not one of the answers`);
};

const CATEGORIES = ['alifbo', 'folk', 'classic', 'navoiy', 'modern', 'twins', 'korea', 'holiday', 'kichik'];
const SCARY = ['dev', 'dokkebi', 'dokkebi2', 'snake', 'wolf', 'club'];

Object.entries(db).forEach(([key, st]) => {
    check(/^[a-z0-9_]+$/.test(key), `${key}: book keys are used in links (#${key}), so only a-z, 0-9 and _`);
    check(text(st.title) && text(st.tag) && text(st.moral || 'none'), `${key}: title and tag`);
    check(CATEGORIES.includes(st.category), `${key}: unknown category "${st.category}"`);
    check(Array.isArray(st.age) && st.age.length === 2 && st.age.every(Number.isInteger) && st.age[0] >= 3 && st.age[0] <= st.age[1] && st.age[1] <= 14,
        `${key}: age must be [youngest, oldest] between 3 and 14, got ${JSON.stringify(st.age)}`);
    check(SHELVES.some((s) => fits(st, s.id)), `${key}: stands on no shelf`);
    check(Array.isArray(st.pages) && st.pages.length >= 3, `${key}: at least 3 pages`);
    (st.pages || []).forEach((p, i) => {
        const where = `${key} p${i + 1}`;
        check(text(p.title) && text(p.text), `${where}: title and text`);
        check(sentences(p.text).length >= 1, `${where}: text splits into sentences`);
        check(p.scene && Array.isArray(p.scene.items), `${where}: needs a picture (scene with items)`);
        if (p.question) goodQuestion(p.question, where);
        if (p.word) check(Array.isArray(p.word) && p.word.length === 2 && p.word.every(text), `${where}: word card is [word, meaning]`);
    });
    if (st.quiz) goodQuestion(st.quiz, `${key} quiz`);
    // A holiday book names its holidays, and only a holiday book does.
    const days = st.holidays || [];
    check((st.category === 'holiday') === days.length > 0, `${key}: the holiday shelf's books, and only they, have holidays`);
    days.forEach((id) => check(!!window.Holidays.DAYS[id], `${key}: unknown holiday "${id}" (see js/holidays.js)`));
    // Every story takes the child to a place of the culture passport (js/passport.js); the Alifbo and the short pieces don't.
    if (st.category === 'alifbo' || st.category === 'kichik') check(!st.region, `${key}: the Alifbo and the short pieces have no place in the passport`);
    else check(!!window.Passport.region(st.region), `${key}: region "${st.region}" is not a place in js/passport.js`);
    // A bedtime book (js/bedtime.js) is gentle: nothing frightening in its pictures.
    check(st.bedtime === undefined || st.bedtime === true, `${key}: bedtime is true or left out`);
    if (st.bedtime) {
        const scary = st.pages.flatMap((p) => [p.scene, p.reveal && p.reveal.scene]).filter(Boolean).flatMap((sc) => sc.items).map((it) => it[0]).filter((part) => SCARY.includes(part));
        check(scary.length === 0, `${key}: a bedtime book shows ${[...new Set(scary)].join(', ')}`);
        check(!st.twin, `${key}: a twin tale opens only after its Uzbek tale, so it can't be a bedtime book`);
    }
    // The short pieces (js/stories-short.js): riddles uncover their answer, proverbs
    // have their Korean twin, tongue twisters name the sounds they practise.
    check(st.order === undefined || st.order === false, `${key}: order is false or left out`);
    check(st.verse === undefined || st.verse === true, `${key}: verse is true or left out`);
    st.pages.forEach((p, i) => {
        const where = `${key} p${i + 1}`;
        if (p.reveal) {
            check(p.question && text(p.reveal.answer) && p.reveal.scene && Array.isArray(p.reveal.scene.items), `${where}: a riddle needs its question, answer and uncovered picture`);
            if (p.question) check(p.question.a[p.question.ok].startsWith(p.reveal.answer), `${where}: the answer "${p.reveal.answer}" is the right choice`);
            check(!p.word, `${where}: a riddle's word card would give it away`);
        }
        if (p.proverbKo) check(p.proverbKo.length === 2 && /[\uac00-\ud7a3]/.test(p.proverbKo[0]) && text(p.proverbKo[1]) && !/[\uac00-\ud7a3]/.test(p.proverbKo[1]), `${where}: proverbKo is [Korean, its meaning in Uzbek]`);
        if (p.sounds) check(p.sounds.length >= 1 && p.sounds.every((x) => p.text.toLowerCase().includes(x)), `${where}: the twister uses its sounds ${p.sounds.join(' ')}`);
    });
    // A Korean twin tale opens after its Uzbek tale, and ends with sorting cards.
    if (st.twin) {
        check(!!db[st.twin] && !db[st.twin].twin, `${key}: twin "${st.twin}" must be an existing Uzbek tale`);
        const cards = (st.compare && st.compare.cards) || [];
        check(cards.length >= 6 && cards.every((c) => Array.isArray(c) && c.length === 3 && text(c[0]) && text(c[1]) && ['uz', 'ko', 'both'].includes(c[2])),
            `${key}: compare.cards must be at least 6 [emoji, text, 'uz'|'ko'|'both']`);
        check(['uz', 'ko', 'both'].every((w) => cards.some((c) => c[2] === w)), `${key}: the cards need things only in each tale and things in both`);
    }
});

// ---------- Alifbo ----------

// Every letter of the Uzbek Latin alphabet, in its official order, and the tutuq belgisi.
const ALPHABET = ['A', 'B', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z', "O'", "G'", 'Sh', 'Ch', 'Ng', 'ʼ'];
const alifbo = db.alifbo;
check(alifbo && alifbo.category === 'alifbo', 'the Alifbo book');
if (alifbo) {
    const letters = alifbo.pages.map((p) => (p.letter || '').split(' ')[0]);
    check(letters.join() === ALPHABET.join(), `Alifbo letters in order: ${letters.join(' ')}`);
    alifbo.pages.forEach((p, i) => {
        const [big, small] = (p.letter || '').split(' ');
        if (big !== 'ʼ') check(small === big.toLowerCase(), `Alifbo p${i + 1}: "${p.letter}" is the capital and the small letter`);
        check(p.word && p.text.toLowerCase().includes(p.word[0].toLowerCase()), `Alifbo p${i + 1}: its word is in its text`);
        // the word starts with its letter (Ng never starts a word; the tutuq is inside she'r)
        if (big !== 'Ng' && big !== 'ʼ') check(p.word[0].toLowerCase().startsWith(big.toLowerCase()) && !(big.length === 1 && /^[og]'/.test(p.word[0]) && big !== p.word[0][0].toUpperCase() + "'") && !(big === 'S' && p.word[0].startsWith('sh')) && !(big === 'C' && p.word[0].startsWith('ch')), `Alifbo p${i + 1}: "${p.word[0]}" starts with ${big}`);
    });
}
check(Object.values(db).every((st) => st === alifbo || st.pages.every((p) => !p.letter)), 'only the Alifbo has letters');

// ---------- shelves ----------

check(shelfFor(null) === null && shelfFor(undefined) === null, 'no age, no shelf');
[[3, '4-6'], [4, '4-6'], [6, '4-6'], [7, '7-8'], [8, '7-8'], [9, '9+'], [11, '9+'], [15, '9+']].forEach(([age, shelf]) => {
    check(shelfFor(age) === shelf, `a ${age}-year-old belongs on ${shelf}, got ${shelfFor(age)}`);
});
AGES.forEach((age) => check(shelfFor(age), `age ${age} in the profile form has a shelf`));
const book = (lo, hi) => ({ age: [lo, hi] });
check(fits(book(5, 8), '4-6') && fits(book(5, 8), '7-8') && !fits(book(5, 8), '9+'), 'a 5–8 book stands on the 4–6 and 7–8 shelves');
check(!fits(book(9, 12), '4-6') && !fits(book(9, 12), '7-8') && fits(book(9, 12), '9+'), 'a 9–12 book stands only on 9+');
check(fits(book(9, 12), 'all') && fits({}, '4-6'), 'every book is on "all"; a book without ages is everywhere');
check(label(book(5, 8)) === '5–8 yosh' && ageLabel(6) === '6 yosh' && ageLabel(11) === '11+ yosh', 'labels');
// Each shelf has enough books to be worth opening.
SHELVES.forEach((s) => {
    const n = Object.values(db).filter((st) => fits(st, s.id)).length;
    check(n >= 5, `the ${s.label} shelf has only ${n} books`);
});

check(Object.values(db).filter((st) => st.bedtime).length >= 8, 'at least 8 calm books for bedtime');
console.log(`${total - failed}/${total} passed (${Object.keys(db).length} books)`);
process.exit(failed ? 1 : 0);
