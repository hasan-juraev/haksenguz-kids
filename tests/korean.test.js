/*
 * The Korean helper's text (js/stories-ko.js) lines up with the Uzbek it
 * translates, piece by piece, and every glossary word appears in its book.
 * The Korean menus (js/i18n.js) are Korean, and the bundled Korean font has
 * every letter the app shows.
 * Run with: node tests/korean.test.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

global.window = { matchMedia: () => ({ matches: false }) };
require('../js/book.js');
require('../js/stories-folk.js');
require('../js/stories-classic.js');
require('../js/stories-twins.js');
require('../js/stories-korea.js');
require('../js/stories-holiday.js');
require('../js/stories-ko.js');
require('../js/i18n.js');
const { hangulUsed } = require('../tools/build-assets.js');
const { segments, glossForms } = window.BookEngine;
const { translate, EXACT, PATTERNS } = window.I18n;
const db = window.storiesDatabase;
const ko = window.storiesKorean;
const ROOT = path.join(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

let failed = 0;
let total = 0;
const check = (cond, msg) => {
    total++;
    if (!cond) {
        failed++;
        console.log(`✗ ${msg}`);
    }
};
const hangul = (s) => typeof s === 'string' && /[가-힣]/.test(s);

Object.entries(ko).forEach(([key, book]) => {
    const st = db[key];
    check(!!st, `${key}: no such book`);
    if (!st) return;
    check(hangul(book.title) && hangul(book.moral), `${key}: Korean title and moral`);
    check(book.pages.length === st.pages.length, `${key}: ${book.pages.length} Korean pages for ${st.pages.length} pages`);
    st.pages.forEach((p, i) => {
        const k = book.pages[i] || {};
        const want = segments(p).length;
        check(Array.isArray(k.s) && k.s.length === want && k.s.every(hangul), `${key} p${i + 1}: ${k.s ? k.s.length : 0} Korean pieces for ${want} (title + sentences)`);
        if (p.question) check(Array.isArray(k.q) && k.q.length === 1 + p.question.a.length && k.q.every(hangul), `${key} p${i + 1}: question and its ${p.question.a.length} answers`);
        else check(!k.q, `${key} p${i + 1}: a Korean question for a page without one`);
    });
    if (st.quiz) check(Array.isArray(book.quiz) && book.quiz.length === 1 + st.quiz.a.length && book.quiz.every(hangul), `${key}: final quiz and its answers`);
    // Every glossary word is found somewhere in the book's text.
    const words = st.pages.flatMap((p) => segments(p).join(' ').match(/[A-Za-z'ʻʼ‘’]+/g) || []);
    (book.words || []).forEach(([term, meaning, forms]) => {
        check(hangul(meaning) && Array.isArray(forms) && forms.length, `${key}: word "${term}" needs a Korean meaning and forms`);
        const hits = words.filter((w) => glossForms(forms)(w));
        check(hits.length > 0, `${key}: word "${term}" (${forms.join(', ')}) never appears in the book`);
    });
});

// ---------- menus ----------

Object.entries(EXACT).forEach(([uz, k]) => check(hangul(k) || /^[^A-Za-z]*$/.test(k.replace(/Ertaklar( Olami)?|Asal|Safari/g, '')), `menu "${uz}" -> "${k}" is not Korean`));
PATTERNS.forEach(([re, , example]) => {
    check(re.source.startsWith('^') && re.source.endsWith('$'), `pattern ${re} must match whole strings`);
    check(typeof example === 'string' && re.test(example), `pattern ${re} needs an example it matches`);
    // The example gets this pattern's Korean, not an earlier pattern's.
    check(PATTERNS.find(([r]) => r.test(example))[0] === re && hangul(translate(example, 'ko')), `example "${example}" is caught by another pattern or has no Korean`);
});
const spaced = translate('  Kutubxona\n', 'ko');
check(spaced === '  도서관\n', `translate keeps the spaces around a menu: ${JSON.stringify(spaced)}`);
check(translate('Kutubxona', 'uz') === 'Kutubxona', 'Uzbek menus are left alone');
check(translate('Sahifa 3 / 12', 'ko') === '3 / 12쪽' && translate('⭐ Ofarin! +10 ball', 'ko') === '⭐ Ofarin! +10점', 'numbers and praise go through patterns');
// The genre on each library card (a story's tag before "•").
[...new Set(Object.values(db).map((st) => st.tag.split('•')[0].trim()))].forEach((genre) => check(hangul(translate(genre, 'ko')), `genre "${genre}" has no Korean`));

// ---------- font ----------

const fontsCss = read('css/fonts.css');
check(/font-family: 'Gowun Dodum';[^}]*url\(\.\.\/fonts\/gowun-dodum-ko\.woff2\)/.test(fontsCss), 'css/fonts.css has the Korean font');
check(fs.existsSync(path.join(ROOT, 'fonts/gowun-dodum-ko.woff2')) && fs.existsSync(path.join(ROOT, 'fonts/LICENSE-gowun-dodum.txt')), 'Korean font file and its licence');
const inFont = new Set(read('fonts/gowun-dodum-ko.txt').trim());
const missing = [...hangulUsed()].filter((c) => !inFont.has(c));
check(missing.length === 0, `Korean letters missing from the font, run npm run build: ${missing.join('')}`);
check(/body\s*\{[^}]*font-family:[^;]*'Gowun Dodum'/.test(read('css/book.css')), 'the text font stack falls back to Gowun Dodum');

// ---------- the reviewer's table ----------

const table = require('child_process').execFileSync(process.execPath, [path.join(ROOT, 'tools/korean-review.js')], { encoding: 'utf8' });
const rows = table.replace(/^\ufeff/, '').trim().split('\r\n');
check(table.startsWith('\ufeff') && rows.length > Object.keys(EXACT).length + 100, `tools/korean-review.js makes a table (${rows.length} rows)`);
// Each row ends "…,Korean,," (two empty columns for the reviewer); ",,," means no Korean.
const blank = rows.slice(1).filter((r) => r.endsWith(',,,')).map((r) => r.split(',')[0]);
check(blank.length === 0, `rows without Korean in the review table: ${blank.join('; ')}`);

console.log(`${total - failed}/${total} passed (${Object.keys(ko).length} books in Korean)`);
process.exit(failed ? 1 : 0);
