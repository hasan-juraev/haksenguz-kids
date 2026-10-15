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

// book: sentences from the pages the child has read; twins stay locked
const reader = { age: 8, books: { zumrad: { page: 3 } }, words: {} };
const fromBook = R.texts(db, reader, 'book');
check(fromBook.length > 3 && fromBook.every((t) => t.book === 'zumrad' && t.text.length >= 30 && t.text.length <= 110), 'book: only the book opened');
const readSoFar = db.zumrad.pages.slice(0, 3).map((p) => R.clean(p.text)).join(' ');
check(fromBook.every((t) => readSoFar.includes(t.text)), 'book: only the pages read so far, no ending told');
const finishedAll = {};
Object.keys(db).forEach((k) => { finishedAll[k] = { finished: true }; });
const everything = R.texts(db, { age: 8, books: finishedAll, words: {} }, 'book');
check(everything.length > 200 && everything.every((t) => !/[.!?] - [A-Za-z']|[!?],|\.\.\./.test(t.text)), `book: no dialogue run-ons (${everything.length} texts)`);
const fresh = R.texts(db, { age: 8, books: {}, words: {} }, 'book', (k) => !!db[k].twin);
check(fresh.length > 10 && fresh.every((t) => !db[t.book].twin && !['alifbo', 'kichik'].includes(db[t.book].category)), 'book: a new reader gets their shelf, without locked twins');
check(R.texts(db, { age: 10, books: {}, words: {} }, 'book').every((t) => db[t.book].age[1] >= 9), 'book: a 10-year-old gets the 9+ shelf');

// pickText: not the same text twice in a row
const first = R.pickText(db, kid, 'short', { rand: () => 0 });
const second = R.pickText(db, kid, 'short', { rand: () => 0, not: first.text });
check(first && second && first.text !== second.text, 'pickText avoids the last text');
// book texts fit the child's pace: about a minute and a half, never under 40 letters allowed
const young = { age: 7, books: finishedAll, words: {} };
const picks = Array.from({ length: 30 }, (_, i) => R.pickText(db, young, 'book', { rand: () => i / 30 }));
check(picks.every((t) => t.text.length <= 40), `book: short sentences for a 7-year-old (${Math.max(...picks.map((t) => t.text.length))})`);
check(R.pickText(db, { age: 7, books: { zumrad: { page: 1 } }, words: {} }, 'book'), 'book: a short first page still gives a text');

// pace: by age at first, then the last races; the turtle is slower than the tulpor
check(R.pace({ age: 5 }, 'short') < R.pace({ age: 7 }, 'short') && R.pace({ age: 7 }, 'short') < R.pace({ age: 10 }, 'short'), 'pace grows with age');
check(R.pace({ age: 4 }, 'short') <= 2 && R.pace({ age: 10 }, 'short') <= 8, 'a first race starts slow enough for a child hunting keys');
const racers = R.rivals(10);
check(racers.map((r) => r.id).join() === 'turtle,camel,horse' && racers[0].wpm < 10 && racers[1].wpm < 10 && racers[2].wpm > 10, 'rivals around the pace');
const slow = R.rivals(R.pace({ race: { recent: { words: [1.5] } } }, 'words'));
check(slow[0].wpm < 1.5 && slow[0].wpm < slow[1].wpm && slow[1].wpm < slow[2].wpm, 'a slow child can still beat the turtle');
check(R.median([11, 12, 9, 9, 9]) === 9 && R.median([1, 3]) === 2, 'median');

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
check(p.race.recent.short.length === 5 && R.pace(p, 'short') === 9, 'pace: the median of the last five races');
check(p.race.races === 7 && Math.abs(R.pace(p, 'words') - 9 * 0.9) < 1e-9, 'a level never raced starts from the others');

// one grown-up's race neither sets the record nor drags the animals along
const kidRace = { age: 7 };
[5, 5.2, 4.8, 5.1].forEach((v) => R.finish(kidRace, 'words', v, 'Wed'));
const grownUp = R.finish(kidRace, 'words', 45, 'Wed');
check(grownUp.fluke && !grownUp.isRecord && kidRace.race.best.words === 5.2 && Math.abs(R.pace(kidRace, 'words') - 5.05) < 1e-9, 'a fluke race sets no record and leaves the pace');
// ...even when it is a new profile's very first race (a parent showing how)
const newKid = { age: 6 };
const demo = R.finish(newKid, 'short', 45, 'Thu');
check(demo.fluke && !newKid.race.best.short && R.pace(newKid, 'short') === 2.5 && R.pace(newKid, 'words') === 2.25, "a grown-up's first race sets no best and no pace");
check(R.finish(newKid, 'short', 3, 'Thu').points === 0 && newKid.race.best.short === 3 && R.pace(newKid, 'short') === 3, 'the child then races from their own pace');
// a young child getting faster is not a fluke
const little = { age: 5, race: { recent: { words: [1.5, 1.6, 1.4] }, best: { words: 1.6 } } };
const better = R.finish(little, 'words', 4, 'Fri');
check(!better.fluke && better.isRecord && little.race.best.words === 4, 'a young child going from 1.5 to 4 sets a record');
// a really fast child: set aside once, then counted
const fast = { age: 10 };
check(R.finish(fast, 'book', 30, 'Sat').fluke && !R.finish(fast, 'book', 29, 'Sat').fluke && fast.race.best.book === 29, 'a second fast race in a row is the child after all');
// a whole text typed in one go (a keyboard's clipboard or voice) never counts
const voice = { age: 9 };
check(R.finish(voice, 'short', 955, 'Sun').fluke && R.finish(voice, 'short', 955, 'Sun').fluke && !voice.race.best.short, 'impossible speeds never count');
check(R.finish(voice, 'short', 60, 'Sun').fluke && !voice.race.best.short, 'and they never vouch for the next fast race');
// a record is a bigger number on screen
const q = { age: 8 };
R.finish(q, 'words', 8.1, 'a');
check(!R.finish(q, 'words', 8.4, 'a').isRecord && R.finish(q, 'words', 8.6, 'a').isRecord, 'a record is a bigger number on screen');

// letters from a Korean or Cyrillic keyboard are spotted
check(R.FOREIGN.test('ㅐㅅㅁ') && R.FOREIGN.test('가') && R.FOREIGN.test('ота') && !R.FOREIGN.test("o'rdak olma"), 'foreign keyboards');

console.log(failed ? `\n${failed}/${total} failed` : `${total}/${total} passed`);
process.exit(failed ? 1 : 0);
