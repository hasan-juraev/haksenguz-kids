/*
 * Yozuv poygasi (js/race.js): the texts can be typed on any phone, typing
 * is matched the forgiving way, and the animals keep to the child's pace.
 * Run with: node tests/race.test.js
 */
'use strict';

global.window = { matchMedia: () => ({ matches: false }) };
require('../js/book.js');
['folk', 'classic', 'twins', 'korea', 'holiday', 'short', 'alifbo', 'ko'].forEach((f) => require(`../js/stories-${f}.js`));
require('../js/levels.js');
require('../js/dictionary.js');
require('../js/race.js');
const db = window.storiesDatabase;
const R = window.Race;

let failed = 0;
let total = 0;
const check = (cond, msg) => {
    total++;
    if (!cond) {
        failed++;
        console.log(`✗ ${msg}`);
    }
};

// clean: one apostrophe, no quotes, plain dashes, no space before punctuation
check(R.clean("Chol: «Ur, to‘qmoq!» — dedi.") === "Chol: Ur, to'qmoq! - dedi.", `clean: ${R.clean("Chol: «Ur, to‘qmoq!» — dedi.")}`);
check(R.clean('  Bir   bor ekan ,  bir yo‘q ekan…') === "Bir bor ekan, bir yo'q ekan...", 'clean: spaces and the ellipsis');
check(R.typable("Tomchi-tomchi ko'l bo'lur") && !R.typable('5 ta olma') && !R.typable('Salom 🌙') && !R.typable("'olma"), 'typable: letters and plain punctuation only');

// typing: case and apostrophe styles don't matter
check(R.same('O', 'o') && R.same("'", 'ʻ') && R.same("'", '’') && R.same('-', '—') && !R.same('o', 'u'), 'same');
check(R.matched("o'rdak ", 'O‘rd') === 4, 'matched: a phone apostrophe counts');
check(R.matched('olma ', 'olx') === 2 && R.matched('olma ', 'olma ') === 5 && R.matched('olma', 'olmaa') === 4, 'matched stops at the first wrong letter');
check(R.words('Yetti o\'lchab, bir kes').join('|') === "Yetti |o'lchab, |bir |kes", 'words keep their spaces');
check(Math.round(R.wpm(50, 60000)) === 10 && R.wpm(10, 0) === 0, 'wpm: 5 letters a word');

// every level has texts, and they can all be typed
const kid = { age: 7, books: {}, words: {} };
R.LEVELS.forEach((level) => {
    const list = R.texts(db, kid, level);
    check(list.length >= 3, `${level}: has texts (${list.length})`);
    list.forEach(({ text, book }) => {
        check(R.typable(text), `${level}: "${text}" can be typed`);
        check(!book || db[book], `${level}: "${text}" names a real book`);
    });
});
const short = R.texts(db, kid, 'short').map((t) => t.text);
check(short.includes("Tomchi-tomchi ko'l bo'lur") && short.includes('Kichkina kuchuk qirda qo\'qqis qoqildi.'), 'short: proverbs and tongue twisters');
const words = R.texts(db, kid, 'words');
check(words.every(({ text }) => text.split(' ').length === 4 && text === text.toLowerCase()), 'words: four small words');
check(R.texts(db, { age: 5, books: {}, words: {} }, 'words').every(({ text }) => text.split(' ').length === 3), 'words: three for the youngest');

// book: sentences from the books the child has opened; twins stay locked
const reader = { age: 8, books: { zumrad: { page: 3 } }, words: {} };
const fromBook = R.texts(db, reader, 'book');
check(fromBook.length > 3 && fromBook.every((t) => t.book === 'zumrad' && t.text.length >= 30 && t.text.length <= 110), 'book: only the book opened');
const fresh = R.texts(db, { age: 8, books: {}, words: {} }, 'book', (k) => !!db[k].twin);
check(fresh.length > 10 && fresh.every((t) => !db[t.book].twin && !['alifbo', 'kichik'].includes(db[t.book].category)), 'book: a new reader gets their shelf, without locked twins');
check(R.texts(db, { age: 10, books: {}, words: {} }, 'book').every((t) => db[t.book].age[1] >= 9), 'book: a 10-year-old gets the 9+ shelf');

// pickText: not the same text twice in a row
const first = R.pickText(db, kid, 'short', { rand: () => 0 });
const second = R.pickText(db, kid, 'short', { rand: () => 0, not: first.text });
check(first && second && first.text !== second.text, 'pickText avoids the last text');

// pace: by age at first, then the last races; the turtle is slower than the tulpor
check(R.pace({ age: 5 }, 'short') < R.pace({ age: 7 }, 'short') && R.pace({ age: 7 }, 'short') < R.pace({ age: 10 }, 'short'), 'pace grows with age');
const racers = R.rivals(10);
check(racers.map((r) => r.id).join() === 'turtle,camel,horse' && racers[0].wpm < 10 && racers[1].wpm < 10 && racers[2].wpm > 10, 'rivals around the pace');
check(R.rivals(1).every((r) => r.wpm >= 2), 'rivals never crawl');

// finish: points for the first race of the day and for a record
const p = { age: 8 };
let got = R.finish(p, 'short', 8, 'Mon');
check(got.firstToday && !got.isRecord && got.points === R.DAY_POINTS && p.race.best.short === 8, 'first race: day points, no record yet');
got = R.finish(p, 'short', 6, 'Mon');
check(!got.firstToday && !got.isRecord && got.points === 0 && p.race.best.short === 8, 'a slower race the same day: nothing');
got = R.finish(p, 'short', 11, 'Mon');
check(got.isRecord && got.points === R.RECORD_POINTS && p.race.best.short === 11, 'a record');
got = R.finish(p, 'short', 12, 'Tue');
check(got.isRecord && got.firstToday && got.points === R.DAY_POINTS + R.RECORD_POINTS, 'a new day and a record');
[1, 2, 3].forEach(() => R.finish(p, 'short', 9, 'Tue'));
check(p.race.recent.short.length === 5 && R.pace(p, 'short') === (11 + 12 + 9 + 9 + 9) / 5, 'pace: the last five races');
check(p.race.races === 7 && R.pace(p, 'words') === R.pace({ age: 8 }, 'words'), 'each level keeps its own pace');

console.log(failed ? `\n${failed}/${total} failed` : `${total}/${total} passed`);
process.exit(failed ? 1 : 0);
