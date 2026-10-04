/*
 * Birga o'qiymiz (js/together.js): a page link names its book and page and
 * reads back the same, old book links still work, nothing odd opens a page,
 * and the menus have their Korean.
 * Run with: node tests/together.test.js
 */
'use strict';

global.window = { matchMedia: () => ({ matches: false }) };
require('../js/book.js');
['folk', 'classic', 'twins', 'korea', 'holiday', 'short', 'alifbo'].forEach((f) => require(`../js/stories-${f}.js`));
require('../js/i18n.js');
require('../js/together.js');
const { Together: T, I18n } = window;
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
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------- links ----------

const base = 'https://ertaklar.example/app/index.html';
check(T.link(base, 'zumrad', 3) === `${base}#zumrad/3`, 'a page link: #zumrad/3');
check(T.link(base, 'zumrad', 0) === `${base}#zumrad`, 'the title page: the book\'s own link');
check(T.link(`${base}#zumrad/7`, 'zumrad', 2) === `${base}#zumrad/2`, 'made from the address as it is now');
Object.entries(db).forEach(([key, st]) => {
    [1, st.pages.length].forEach((page) => {
        const back = T.parse(T.link(base, key, page).split(base)[1]);
        check(back.key === key && back.page === page, `${key} ${page}: the link reads back (${JSON.stringify(back)})`);
    });
});
check(same(T.parse('#zumrad'), { key: 'zumrad', page: 0 }), 'an old book link: the book');
check(same(T.parse('zumrad/12'), { key: 'zumrad', page: 12 }), 'with or without the #');
check(same(T.parse(''), { key: '', page: 0 }) && same(T.parse(undefined), { key: '', page: 0 }), 'no link: nothing');
check(same(T.parse('#%E0%A4%A'), { key: '', page: 0 }), 'a broken link: nothing');
check(T.parse('#zumrad/abc').page === 0 && T.parse('#zumrad/-2').page === 0 && T.parse('#zumrad/12345').page === 0, 'only a page number is a page');
check(T.parse('#ertak=eyJ2IjoxfQ').page === 0, 'a made book\'s link is not a page link');

// ---------- the menus in Korean ----------

[
    "Birga o'qiymiz", "📞 Birga o'qiymiz", "Videoqo'ng'iroqda bir xil sahifani oching.", 'Sahifa:', '🔗 Shu sahifa havolasi', "Birga o'qishni tugatish",
    "«Zumrad va Qimmat», 3-sahifa — birga o'qiymiz!", "«Zumrad va Qimmat» — birga o'qiymiz!", '12-sahifa', 'Sarlavha', 'Tamom',
].forEach((uz) => {
    const ko = I18n.translate(uz, 'ko');
    const rest = ko.replace(/«[^»]*»/g, '');
    check(ko !== uz && hangul(ko) && !/[a-z]{2}/i.test(rest), `Korean menus: "${uz}" → "${ko}"`);
});
const read = (f) => require('fs').readFileSync(require('path').join(__dirname, '..', f), 'utf8');
const src = read('js/app.js') + read('index.html');
["Birga o'qiymiz", "📞 Birga o'qiymiz", "Videoqo'ng'iroqda bir xil sahifani oching.", 'Sahifa:', '🔗 Shu sahifa havolasi', "Birga o'qishni tugatish", "-sahifa — birga o'qiymiz!", "» — birga o'qiymiz!"]
    .forEach((t) => check(src.includes(t), `"${t}" is what the app shows`));

console.log(failed ? `\n${failed} of ${total} checks FAILED` : `\nall ${total} checks passed`);
process.exit(failed ? 1 : 0);
