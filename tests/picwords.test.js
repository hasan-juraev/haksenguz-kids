/*
 * Rasmdagi so'zlar (js/picwords.js): everything the books draw says what it
 * is, every thing a child can touch has an Uzbek word and its Korean, and the
 * words found join the dictionary (js/dictionary.js) without doubling up.
 * Run with: node tests/picwords.test.js
 */
'use strict';

global.window = { matchMedia: () => ({ matches: false }) };
require('../js/art/core.js');
['people', 'animals', 'world', 'fx', 'landmarks'].forEach((f) => require(`../js/art/${f}.js`));
require('../js/book.js');
['folk', 'classic', 'twins', 'korea', 'holiday', 'short', 'alifbo', 'ko'].forEach((f) => require(`../js/stories-${f}.js`));
require('../js/i18n.js');
require('../js/maker.js');
require('../js/picwords.js');
require('../js/dictionary.js');
const { Art, PicWords: P, Dictionary: D, Maker: M } = window;
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

// What may be drawn without a word: effects, and the riddle's cloth (it must not give the answer away).
const NO_WORD = ['sparkles', 'hearts', 'bubble', 'think', 'notes', 'mark', 'burst', 'motion', 'rays', 'dust', 'zzz', 'glow', 'smoke', 'drops', 'crack', 'gush', 'sound', 'beam', 'sirli'];

// ---------- the words ----------

Object.entries(P.WORDS).forEach(([w, [uz, ko]]) => {
    check(/^[a-z' ]+$/.test(uz) && uz === uz.trim(), `${w}: "${uz}" is a lower-case Uzbek word in Latin`);
    check(hangul(ko), `${w}: "${ko}" is Korean`);
    const base = w.split(':')[0];
    check(!!Art.parts[base] || !!Art.cast[base], `${w}: the art engine draws "${base}"`);
});
Object.entries(P.PEOPLE).forEach(([k, [uz, ko]]) => check(/^[a-z' ]+$/.test(uz) && hangul(ko), `people ${k}: ${uz} / ${ko}`));
NO_WORD.forEach((w) => check(!P.of(w), `${w} has no word`));
// the same Uzbek word always has the same Korean
const seen = {};
Object.values(P.WORDS).concat(Object.values(P.PEOPLE)).forEach(([uz, ko]) => {
    check(!(uz in seen) || seen[uz] === ko, `"${uz}" has two Korean words: ${seen[uz]} / ${ko}`);
    seen[uz] = ko;
});

// ---------- every thing the books draw ----------

const used = new Set();
const visit = (items) => (items || []).forEach((it) => {
    if (!Array.isArray(it)) return;
    const o = it[3] || {};
    used.add(typeof o.kind === 'string' ? `${it[0]}:${o.kind}` : it[0]);
    (o.riders || []).forEach((r) => used.add(r[0]));
    if (o.of) visit([o.of]);
});
Object.values(db).forEach((st) => {
    if (st.cover) visit(st.cover.items);
    st.pages.forEach((p) => {
        visit(p.scene.items);
        if (p.reveal) visit(p.reveal.scene.items);
    });
});
// and everything a child can put in their own book
M.ITEMS.forEach((it) => {
    const [part, o] = M.pieceOf({ k: it.id, mood: 'happy' }, []);
    used.add(typeof o.kind === 'string' ? `${it.part || it.id}:${o.kind}` : it.part || it.id);
});
const missing = [...used].filter((w) => !P.of(w) && !NO_WORD.includes(w));
check(missing.length === 0, `things drawn with no word: ${missing.join(', ')}`);
check(used.size > 150, `${used.size} kinds of things drawn`);
// cast members by who they are
check(P.of('kid2').term === 'qiz bola' && P.of('kid1').term === "o'g'il bola" && P.of('buvi').term === 'buvi' && P.of('chol').term === 'bobo', 'the cast by age and sex');
check(P.of('ona').term === 'ayol' && P.of('ona').ko === '아주머니', 'a mother is a woman (ayol)');
check(P.of('podshoh').term === 'podshoh' && P.of('dokkebi').ko === '도깨비' && P.of('dokkebi2').term === 'dokkebi', 'people with a calling');
check(P.of('person:child:f').term === 'qiz bola' && P.of('person:old:m').term === 'bobo' && P.of('person:adult:m').term === 'erkak', 'a hero by age and sex');
check(P.of('bird:swallow').term === "qaldirg'och" && P.of('bird:robin').ko === '울새' && P.of('bird:unknown').term === 'qush', 'birds by kind, and any other bird');
check(P.of('tree:apricot').term === "o'rik daraxti" && P.of('tree:bare').term === 'daraxt', 'trees by kind');
check(P.of('nothing') === null && P.of('') === null && P.of(null) === null, 'nothing is nothing');
// every cast preset has a word
Object.keys(Art.cast).forEach((k) => check(!!P.of(k), `cast ${k} has a word`));

// ---------- the art engine says what it draws ----------

const svg = Art.render({ bg: 'meadow', items: [['fox', 100, 290, {}], ['bird', 200, 120, { kind: 'swallow' }], ['person', 300, 290, { age: 'child', sex: 'f' }], ['zumrad', 50, 290, {}], ['carpet', 200, 150, { riders: [['kid1', 0]] }]] }, { still: true });
['fox', 'bird:swallow', 'person:child:f', 'zumrad', 'carpet', 'kid1'].forEach((w) => check(svg.includes(`data-w="${w}"`), `Art.item marks "${w}"`));
check(P.art('bird:swallow')[0] === 'bird' && P.art('bird:swallow')[1].kind === 'swallow' && P.art('person:old:f')[1].age === 'old', 'a word is drawn again on its own');
check(/^<svg class="sticker-svg"[^>]* data-fit/.test(P.sticker('fox')), 'as a sticker, framed once on screen');

// ---------- the dictionary ----------

const profile = { books: {}, words: { 'zumrad:2': 1 }, picWords: {
    tulki: { w: 'fox', book: 'zumrad', view: 3 },
    "qaldirg'och": { w: 'bird:swallow', book: 'nowhere', view: 2 },
    tandir: { w: 'tandir', book: 'oltin_tarvuz', view: 1 }, // also a book's word card
    sehr: { w: 'nothing', book: 'zumrad', view: 1 }, // unknown: ignored
    yolg: { w: 'fox', book: 'zumrad', view: 1 }, // not fox's word: ignored
} };
const zumradWord = db.zumrad.pages[1].word;
const tandirBook = Object.entries(db).find(([, st]) => st.pages.some((p) => p.word && p.word[0] === 'tandir'));
if (tandirBook) profile.words[`${tandirBook[0]}:${tandirBook[1].pages.findIndex((p) => p.word && p.word[0] === 'tandir') + 1}`] = 1;
const list = D.entries(db, profile);
const fox = list.find((e) => e.term === 'tulki');
check(fox && fox.key === 'pic:tulki' && fox.ko === '여우' && fox.book === 'zumrad' && fox.view === 3 && fox.w === 'fox' && fox.meaning === '', 'a word found in a picture is in the dictionary, with where it was found');
check(list.find((e) => e.term === "qaldirg'och").book === null, 'a book that is gone: the word stays, without the way back');
check(!list.some((e) => e.term === 'sehr' || e.term === 'yolg'), 'odd picture words are left out');
const tandirs = list.filter((e) => e.term.toLowerCase() === 'tandir');
check(tandirs.length === 1 && (!tandirBook || !tandirs[0].w), 'a word in a book and in a picture is there once, as the book\'s card');
if (zumradWord) check(list.some((e) => e.term === zumradWord[0] && !e.w), 'book words are there as before');
check(list.map((e) => e.term).join() === list.slice().sort((a, b) => D.compare(a.term, b.term)).map((e) => e.term).join(), 'still in alphabet order');
check(D.picture(fox).includes('pic-sticker') && D.picture(fox).includes('data-fit'), 'a picture word is drawn as itself');
check(zumradWord ? D.picture(list.find((e) => e.term === zumradWord[0])).startsWith('<svg class="story-art-svg"') : true, 'a book word as its page');
check(D.entries(db, { books: {}, words: {} }).every((e) => !e.w), 'no picture words yet: none');

// ---------- menus ----------

const { translate } = window.I18n;
check(hangul(translate("🖼️ Rasmdan topilgan so'z", 'ko')), 'Korean: "found in a picture"');
check(translate("✨ Lug'atimga qo'shildi! +2 ball", 'ko') === '✨ 내 사전에 넣었어요! +2점', 'Korean: "added to my dictionary, +2 points"');

console.log(`${total - failed}/${total} passed (${Object.keys(P.WORDS).length} words, ${used.size} things drawn)`);
process.exit(failed ? 1 : 0);
