/*
 * Korean-letter sound hints (js/hangul.js): Uzbek read out in Hangul.
 * Run with: node tests/hangul.test.js
 */
'use strict';

global.window = { matchMedia: () => ({ matches: false }) };
require('../js/hangul.js');
require('../js/book.js');
['folk', 'classic', 'twins', 'korea', 'holiday', 'short', 'alifbo'].forEach((f) => {
    try {
        require(`../js/stories-${f}.js`);
    } catch (e) {
        if (e.code !== 'MODULE_NOT_FOUND') throw e;
    }
});
const { read } = window.Hangul;
const { segments } = window.BookEngine;

let failed = 0;
let total = 0;
const check = (cond, msg) => {
    total++;
    if (!cond) {
        failed++;
        console.log(`✗ ${msg}`);
    }
};
const is = (uz, ko) => {
    const got = read(uz);
    check(got === ko, `${uz} -> ${ko}, got ${got}`);
};

// the roadmap's example, greetings and place names
is('Assalomu alaykum', '앗살로무 알라이쿰');
is('Salom!', '살롬!');
is('Rahmat', '라흐마트');
is('Toshkent', '토시켄트');
is("O'zbekiston", '오즈베키스톤');
is('Samarqand', '사마르칸드');
is('Buxoro', '부호로');
// one consonant between vowels starts the next syllable; l is written twice
is('anor', '아노르');
is('lola', '롤라');
is('oila', '오일라');
is('Alla', '알라');
// sh, ch, y and the letters with an apostrophe
is('shar', '샤르');
is("she'r", '셰르');
is('choynak', '초이나크');
is('yulduz', '율두즈');
is("o'rdak", '오르다크');
is("G'oz", '고즈');
is("xo'roz", '호로즈');
is("ma'no", '마노');
// ng: ㅇ at the end, ㄴ + ㄱ before a vowel; n before g' is said ng too
is('ming', '밍');
is('dengiz', '덴기즈');
is("qo'ng'iroq", '콩기로크');
// consonants with no vowel get ㅡ (ㅣ after sh, ch, j)
is('kitob', '키토브');
is('baliq', '발리크');
is('maktab', '마크타브');
// letters on their own, as on the Alifbo pages
is('Ng', '응');
is('Sh sh', '시 시');
is('Ch', '치');
// everything that isn't a letter stays
is('21-oktabr', '21-오크타브르');
is('qip-qizil', '키프-키질');
is('Mening ismim — Asal', '메닝 이스밈 — 아살');
is('«Kkul» — asal', '«크쿨» — 아살');

// Every sentence of every book reads out in Hangul, with no Latin letter left over.
const db = window.storiesDatabase;
let n = 0;
Object.entries(db).forEach(([key, st]) => st.pages.forEach((p, i) => segments(p).forEach((t) => {
    n++;
    const k = read(t);
    check(!/[A-Za-z]/.test(k) && /[가-힣]/.test(k), `${key} p${i + 1}: "${t}" -> "${k}"`);
})));

console.log(`${total - failed}/${total} passed (${n} sentences read)`);
process.exit(failed ? 1 : 0);
