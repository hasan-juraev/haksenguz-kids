/*
 * Mening lug'atim (js/dictionary.js): which words a child has collected,
 * Uzbek alphabet order, letters as tiles and Korean meanings.
 * Run with: node tests/dictionary.test.js
 */
'use strict';

global.window = { matchMedia: () => ({ matches: false }) };
require('../js/book.js');
['folk', 'classic', 'twins', 'korea', 'holiday', 'short', 'alifbo', 'ko'].forEach((f) => require(`../js/stories-${f}.js`));
require('../js/dictionary.js');
const db = window.storiesDatabase;
const { letters, compare, koMeaning, entries, spellable, pick } = window.Dictionary;

let failed = 0;
let total = 0;
const check = (cond, msg) => {
    total++;
    if (!cond) {
        failed++;
        console.log(`✗ ${msg}`);
    }
};

// letters: o', g', sh, ch and ng are one tile; ng' is n + g'
check(letters("o'rdak").join('|') === "o'|r|d|a|k", "o'rdak");
check(letters('choynak').join('|') === 'ch|o|y|n|a|k', 'choynak');
check(letters("qo'ng'iroq").join('|') === "q|o'|n|g'|i|r|o|q", "qo'ng'iroq");
check(letters('dengiz').join('|') === 'd|e|ng|i|z', 'dengiz');
check(letters("she'r").join('|') === "sh|e|'|r", "she'r keeps its tutuq");
check(letters('Sharq').join('|') === 'Sh|a|r|q', 'capitals stay');

// Uzbek alphabet order: ... x y z o' g' sh ch ng
const words = ['shar', "o'rdak", 'anor', 'zamburug\'', "g'oz", 'choynak', 'olma', 'xo\'roz', 'sabzi', 'baliq'];
const sorted = words.slice().sort(compare);
check(sorted.join(' ') === "anor baliq olma sabzi xo'roz zamburug' o'rdak g'oz shar choynak", `alphabet order: ${sorted.join(' ')}`);

// Korean meanings come from the book's glossary
check(koMeaning('zumrad', 'sandiq') && /상자/.test(koMeaning('zumrad', 'sandiq')), 'sandiq has its Korean meaning');
check(koMeaning('alifbo', 'fil') === '코끼리', 'fil -> 코끼리');
check(koMeaning('sariq_dev', 'anything') === null, 'a book without Korean has none');

// what a child has collected
const none = entries(db, { books: {}, words: {} });
check(none.length === 0, 'a new child has no words');
const some = entries(db, { books: {}, words: { 'alifbo:1': 1, 'alifbo:5': 1, 'zumrad:2': 1, 'zumrad:3': 1 } });
check(some.length === 3 && some.every((e) => e.term && e.meaning && e.scene && e.view), `three word pages opened (and one without a word), three cards: ${some.map((e) => e.term).join(', ')}`);
check(some[0].term === 'anor', 'in alphabet order');
const finished = entries(db, { books: { alifbo: { finished: true } }, words: {} });
check(finished.length === db.alifbo.pages.filter((p) => p.word).length, `a finished book gives all its words (${finished.length})`);
const twice = entries(db, { books: { sirli_sandiq: { finished: true }, zumrad: { finished: true } }, words: {} });
check(twice.filter((e) => e.term.toLowerCase() === 'sandiq').length === 1, 'a word met in two books is one card');
const everything = entries(db, { books: Object.fromEntries(Object.keys(db).map((k) => [k, { finished: true }])), words: {} });
check(everything.length > 100, `every book read: ${everything.length} words`);
check(everything.filter((e) => e.ko).length >= 40, `of them with Korean: ${everything.filter((e) => e.ko).length}`);
check(everything.filter(spellable).length >= 40, `of them to build from letters: ${everything.filter(spellable).length}`);
check(!spellable({ term: 'davlat tili' }) && spellable({ term: 'anor' }) && !spellable({ term: 'karvonsaroy' }), 'spellable: one word, 3–7 letters');

// pick: n different, all from the list
const p = pick([1, 2, 3, 4, 5, 6], 4);
check(p.length === 4 && new Set(p).size === 4 && p.every((x) => x >= 1 && x <= 6), 'pick');

console.log(`${total - failed}/${total} passed`);
process.exit(failed ? 1 : 0);
