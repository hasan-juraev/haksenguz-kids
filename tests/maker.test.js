/*
 * Ertak yozamiz (js/maker.js): the catalogue draws, a hero's look becomes a
 * figure, a made book becomes a story the book can show, and a book sent in
 * a link comes back the same, with anything odd in it cleaned away.
 * Run with: node tests/maker.test.js
 */
'use strict';

const store = {};
global.window = {
    matchMedia: () => ({ matches: false }),
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } },
};
require('../js/art/core.js');
['people', 'animals', 'world', 'fx', 'landmarks'].forEach((f) => require(`../js/art/${f}.js`));
require('../js/book.js');
require('../js/i18n.js');
require('../js/store.js');
require('../js/maker.js');
const { Art, Maker: M, BookEngine, I18n, Store } = window;

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
const text = (t) => typeof t === 'string' && t.trim().length > 0;
// Art warns about parts it doesn't know; any warning is a failure.
const warnings = [];
console.warn = (...a) => warnings.push(a.join(' '));
const draws = (scene) => {
    warnings.length = 0;
    const svg = Art.render(scene, { still: true, seed: 'test' });
    return svg.startsWith('<svg') && warnings.length === 0 ? svg : '';
};

// ---------- the catalogue ----------

const lists = { SLOTS: M.SLOTS, PLACES: M.PLACES, TIMES: M.TIMES, MOODS: M.MOODS, GROUPS: M.GROUPS, ITEMS: M.ITEMS, WHO: M.WHO, WEARS: M.WEARS, PATTERNS: M.PATTERNS, COLORS: M.COLORS, HOLDS: M.HOLDS, HEADS: Object.values(M.HEADS) };
Object.entries(lists).forEach(([name, list]) => {
    const ids = list.map((x) => x.id).filter(Boolean);
    check(ids.length === new Set(ids).size, `${name}: ids are unique`);
    list.forEach((x) => check(text(x.label) && hangul(x.ko), `${name} ${x.id || x.label}: an Uzbek name and a Korean one`));
});
check(M.SLOTS.length === 4 && M.SLOTS.filter((s) => s.sky).length === 1 && M.SLOTS[3].sky, 'three places on the ground and the fourth in the sky');
check(M.ITEMS.length >= 60, `a big catalogue (${M.ITEMS.length})`);
M.GROUPS.forEach((g) => check(M.ITEMS.filter((it) => it.group === g.id).length >= 8, `${g.id}: at least 8 to choose from`));
M.ITEMS.forEach((it) => {
    check(M.GROUPS.some((g) => g.id === it.group), `${it.id}: in a known group`);
    const part = it.part || it.id;
    check(!!Art.parts[part] || !!Art.cast[part], `${it.id}: draws as "${part}"`);
});
check(M.PLACES.every((p) => text(p.at)), 'every place has its page title ("O\'rmonda")');
M.WHO.forEach((w) => {
    check(w.heads.length >= 3 && w.heads.every((h) => M.HEADS[h]), `${w.id}: its heads are known`);
});
M.COLORS.forEach((c) => check(c.c.length === 5 && c.c.every((x) => /^#[0-9a-f]{6}$/.test(x)), `colour ${c.id}: five colours`));
check(M.SKINS.length === 4 && M.HAIRS.length === 5 && [...M.SKINS, ...M.HAIRS].every((x) => /^#[0-9a-f]{6}$/.test(x)), 'skin and hair colours');
check(M.STARTERS.length >= 6 && M.STARTERS.every(text), 'sentence starters');

// The same Uzbek name always has the same Korean, and the Korean menus know them all.
const names = {};
Object.values(lists).forEach((list) => list.forEach((x) => {
    check(!(x.label in names) || names[x.label] === x.ko, `"${x.label}" has two Korean names: ${names[x.label]} / ${x.ko}`);
    names[x.label] = x.ko;
}));
Object.entries(names).forEach(([uz, ko]) => check(I18n.translate(uz, 'ko') === ko, `Korean menus: "${uz}" → ${ko}`));

// ---------- every piece draws, in every place ----------

M.ITEMS.forEach((it) => {
    const i = it.group === 'sky' ? 3 : 1;
    const cast = [null, null, null, null];
    cast[i] = { k: it.id, mood: 'happy', f: false };
    const sc = M.sceneOf({ place: 'meadow', time: 'day', cast }, []);
    check(sc.items.length === 1 && !!draws(sc), `${it.id} draws on its own`);
    if (it.feel) {
        cast[i] = { k: it.id, mood: 'sleep', f: true };
        check(!!draws(M.sceneOf({ place: 'meadow', time: 'day', cast }, [])), `${it.id} draws asleep and turned`);
    }
});
const full = [{ k: 'kid1', mood: 'wave' }, { k: 'fox', mood: 'joy' }, { k: 'kid2', mood: 'scared', f: true }, { k: 'kite', mood: 'happy' }];
M.PLACES.forEach((pl) => M.timesFor(pl).forEach((t) => {
    const sc = M.sceneOf({ place: pl.id, time: t.id, cast: full }, []);
    check(sc.bg === pl.bg && sc.items.length === 4 + (pl.decor || []).length && !!draws(sc), `${pl.id} at ${t.id} draws with four characters`);
}));
// indoors: only day and night, and no snow inside
const room = M.place('room');
check(M.timesFor(room).map((t) => t.id).join() === 'day,night', 'indoors there is only day and night');
const roomWinter = M.sceneOf({ place: 'room', time: 'winter', cast: full }, []);
check(roomWinter.time === 'day' && !roomWinter.fx, 'winter in a room: a plain day, no snow falling indoors');
check(M.sceneOf({ place: 'room', time: 'night', cast: full }, []).time === 'night', 'night in a room');
const space = M.sceneOf({ place: 'space', time: 'day', cast: full }, []);
check(space.time === 'night' && space.moon === false, 'space is always dark');
const winter = M.sceneOf({ place: 'meadow', time: 'winter', cast: [{ k: 'tree' }, null, null, null] }, []);
check(winter.season === 'winter' && winter.fx.includes('snow') && winter.items[0][3].season === 'winter', 'winter: snow, and the tree in winter too');
check(M.sceneOf({ place: 'meadow', time: 'rainbow', cast: full }, []).rainbow === true, 'a rainbow');
check(M.sceneOf({ place: 'village', time: 'night', cast: full }, []).lightsBehind === true, 'far windows stay behind the characters');
// the order: things in the sky first, then the sides, then the middle in front
const order = M.sceneOf({ place: 'meadow', time: 'day', cast: full }, []).items.map((x) => x[0]);
check(order.join() === 'kite,kid1,kid2,fox', `drawn back to front: ${order.join()}`);
// turned characters face the other way
check(M.sceneOf({ place: 'meadow', time: 'day', cast: full }, []).items[2][3].f === true, 'a turned character is drawn flipped');
// sizes from the catalogue, and moods move people's arms
const bigs = M.sceneOf({ place: 'meadow', time: 'day', cast: [{ k: 'fil', mood: 'happy' }, { k: 'kid1', mood: 'joy' }, { k: 'pari', mood: 'joy' }, null] }, []);
const byPart = Object.fromEntries(bigs.items.map((x) => [x[0], x[3]]));
check(byPart.fil.s === 0.6, 'the elephant is drawn smaller');
check(byPart.kid1.pose === 'cheer' && byPart.kid1.mood === 'joy', 'a happy child cheers');
check(!byPart.pari.pose && byPart.pari.mood === 'joy', 'the fairy keeps her own pose (her hands hold a wand)');

// ---------- heroes ----------

const look = M.cleanLook({});
check(look.who === 'boy' && look.head === 'doppi' && look.wear === 'milliy' && look.hold === 'none' && look.beard === false, 'a new hero: a boy in a do\'ppi');
const odd = M.cleanLook({ who: 'girl', head: 'salla', wear: 'spacesuit', color: '#123456', skin: 9, hair: -1, hold: 'sword', beard: true });
check(odd.who === 'girl' && odd.head === 'braids' && odd.wear === 'milliy' && odd.color === 'red' && odd.skin === 0 && odd.hair === 0 && odd.hold === 'none' && odd.beard === false, 'an odd look is set back to defaults');
check(M.cleanLook({ who: 'man', beard: true }).beard === true && M.cleanLook({ who: 'grandma' }).hair === 4, 'a man may have a beard; grandmothers have white hair');
M.WHO.forEach((w) => w.heads.forEach((h) => M.WEARS.forEach((wear) => {
    const hr = M.newHero('Aziz', { who: w.id, head: h, wear: wear.id, pattern: 'ikat', color: 'blue' });
    check(!!draws(M.sceneOf({ place: 'meadow', time: 'day', cast: [{ k: `h:${hr.id}`, mood: 'happy' }, null, null, null] }, [hr])), `hero ${w.id} / ${h} / ${wear.id} draws`);
})));
M.HOLDS.forEach((hd) => {
    const o = M.heroOpts({ who: 'girl', hold: hd.id }, 'joy');
    check(hd.id === 'none' ? !o.hold && o.pose === 'cheer' : o.hold === hd.id && o.pose === hd.pose, `holding ${hd.id}: ${o.pose}`);
});
const modern = M.heroOpts({ who: 'boy', wear: 'modern', pattern: 'plain', color: 'green' }, 'happy');
check(modern.outfit === 'shirt' && modern.color === '#2a9d8f' && !modern.pattern && modern.age === 'child', 'everyday clothes: a shirt in the chosen colour');
const chima = M.heroOpts({ who: 'girl', wear: 'hanbok', head: 'daenggi' }, 'happy');
check(chima.outfit === 'chima' && chima.saekdong === true && chima.sex === 'f', 'a girl\'s hanbok: a chima with rainbow sleeves');
check(M.heroOpts({ who: 'man', wear: 'hanbok' }, 'happy').outfit === 'hanbok' && !M.heroOpts({ who: 'man', wear: 'hanbok' }, 'happy').saekdong, 'a man\'s hanbok');
check(M.heroOpts({ who: 'woman', head: 'rumol', color: 'green' }, 'happy').hat === '#d8f3dc', 'a headscarf in a soft colour');
check(M.heroOpts({ who: 'grandpa' }, 'happy').beard === 'long' && M.heroOpts({ who: 'man', beard: true }, 'happy').beard === 'short', 'beards');
check(M.newHero('  <b>Aziz</b>\u0007  ', {}).name === 'bAziz/b', 'a hero\'s name: no tags, no control characters');
// stickers: a child in a smaller frame than a grown-up, a small thing in its own
const kidHero = M.newHero('Kenja', { who: 'girl' });
const mum = M.newHero('Ona', { who: 'woman' });
check(M.boxOf(`h:${kidHero.id}`, [kidHero])[3] < M.boxOf(`h:${mum.id}`, [mum])[3] && M.boxOf('kid1', [])[3] < M.boxOf('ona', [])[3], 'children get a smaller sticker frame');
check(M.boxOf('bee', [])[2] < M.boxOf('kite', [])[2] && M.boxOf('nobody', []).length === 4, 'small things get their own frame; anything else the usual one');
check(M.newHero('', {}).name === 'Qahramon' && M.newHero('Abdurahmonbek Valijonov', {}).name.length === M.LIMITS.name, 'an empty name gets "Qahramon"; a long one is cut');

// ---------- books ----------

const aziz = M.newHero('Aziz', { who: 'boy', head: 'doppi' });
const nilu = M.newHero('Nilufar', { who: 'girl', head: 'daenggi', wear: 'hanbok', hold: 'flower' });
const heroes = [aziz, nilu];
const book = M.newBook('Asal', heroes);
check(book.pages.length === 1 && book.pages[0].cast[0].k === `h:${aziz.id}` && book.pages[0].cast[0].mood === 'wave', 'a new book: page one with the first hero waving');
check(book.author === 'Asal' && /^b[a-z0-9]+$/.test(book.id), 'a new book has its author and an id');
check(M.newBook('', []).pages[0].cast.every((s) => s === null), 'with no heroes yet, page one is empty');
const p2 = M.newPage(book.pages[0]);
p2.cast[0].mood = 'sad';
check(p2.place === book.pages[0].place && book.pages[0].cast[0].mood === 'wave', 'a new page carries on the place and the characters (as copies)');

check(M.fits('kite', 3, []) && !M.fits('kite', 0, []) && !M.fits('fox', 3, []) && M.fits('fox', 2, []), 'things that fly go in the sky, the rest on the ground');
check(M.fits(`h:${aziz.id}`, 1, heroes) && !M.fits(`h:${aziz.id}`, 3, heroes) && !M.fits('h:nobody', 1, heroes), 'heroes go on the ground, and must exist');

book.title = 'Aziz va sehrli varrak';
book.moral = "Do'stlik eng katta boylik.";
book.pages[0] = Object.assign(book.pages[0], { title: '', text: "Bir bor ekan, bir yo'q ekan, Aziz ismli bola bor ekan. U varrak uchirishni yaxshi ko'rardi.", place: 'meadow', time: 'morning' });
book.pages[0].cast[3] = { k: 'kite', mood: 'happy', f: false };
book.pages.push(Object.assign(M.newPage(book.pages[0]), { title: 'Nilufar keldi', text: "Bir kuni Koreyadan Nilufar keldi! Ular do'st bo'lishdi.", place: 'seoul', time: 'day' }));
book.pages[1].cast[2] = { k: `h:${nilu.id}`, mood: 'joy', f: true };
book.pages.push(Object.assign(M.newPage(book.pages[1]), { text: '', place: 'forest', time: 'night' }));
const st = M.toStory(book, heroes);
check(st.title === 'Aziz va sehrli varrak' && st.tag === 'Mening ertagim • Muallif: Asal' && st.category === 'mine' && st.mine === true && st.order === false && st.made === book.id, 'toStory: title, tag, shelf, no story-order game');
check(st.pages.length === 3 && st.pages[0].title === "O'tloqda" && st.pages[1].title === 'Nilufar keldi' && st.pages[2].title === "O'rmonda", 'an empty page title is the place ("O\'tloqda")');
check(st.moral === "Do'stlik eng katta boylik." && M.toStory(Object.assign({}, book, { moral: '' }), heroes).moral === undefined, 'the moral, or the book\'s usual one');
check(M.toStory(Object.assign({}, book, { title: '', author: '' }), heroes).title === 'Mening ertagim' && M.toStory(Object.assign({}, book, { author: '' }), heroes).tag === 'Mening ertagim', 'no title, no author');
check(M.toStory(book, heroes, { guest: true }).tag === "Sovg'a ertak • Muallif: Asal" && M.toStory(book, heroes, { guest: true }).guest === true, 'someone else\'s book is a gift');
check(BookEngine.segments(st.pages[0]).length === 3 && BookEngine.segments(st.pages[2]).length === 1, 'pages split into sentences; an empty page has just its title');
check(st.pages[1].scene.items.some((x) => x[0] === 'person' && x[3].outfit === 'chima' && x[3].f === true), 'the hero in hanbok, turned, on page two');
check(st.pages.every((p) => !p.question && !p.word), 'no questions or words: nothing to earn points from');
check(M.names(book.pages[1], heroes).join() === 'Aziz,Nilufar,Varrak', `who is on a page: ${M.names(book.pages[1], heroes).join()}`);
check(M.key('b1') === 'my_b1' && M.idOf('my_b1') === 'b1' && M.idOf('zumrad') === null, 'book keys');

// cleaning what is kept
const messy = M.cleanBook({
    id: '../../etc',
    title: 'Juda juda juda juda juda uzun sarlavha bu yerda tugamaydi hech',
    author: 'Asal\u0000',
    moral: 42,
    pages: Array.from({ length: 12 }, (_, i) => ({ title: `<script>${i}`, text: 'a\r\nb\u0000c\n\n\n\nd', place: 'mars', time: 'noon', cast: [{ k: 'fox', mood: 'grumpy', f: 'yes' }, { k: 'kite' }, { k: 'h:ghost' }, { k: 'fox' }, { k: 'fox' }] })),
}, heroes);
check(messy.id !== '../../etc' && /^b[a-z0-9]+$/.test(messy.id), 'an odd id is replaced');
check(messy.title.length === M.LIMITS.title && messy.author === 'Asal' && messy.moral === '', 'titles cut to size, control characters gone, only text kept');
check(messy.pages.length === M.MAX_PAGES, `at most ${M.MAX_PAGES} pages`);
const mp = messy.pages[0];
check(mp.title === 'script0' && mp.text === 'a\nbc\n\nd' && mp.place === 'meadow' && mp.time === 'day', `a page cleaned: ${JSON.stringify(mp.text)}`);
check(mp.cast.length === 4 && mp.cast[0].k === 'fox' && mp.cast[0].mood === 'happy' && mp.cast[0].f === true && mp.cast[1] === null && mp.cast[2] === null && mp.cast[3] === null, 'slots cleaned: a kite on the ground, a ghost hero and a fox in the sky are dropped');
check(M.cleanBook(null, []).pages.length === 1, 'nothing at all becomes a one-page book');
check(M.cleanText('x'.repeat(500), M.LIMITS.text).length === M.LIMITS.text, 'story text is cut to size');

// ---------- links ----------

const packed = M.encode(book, heroes);
check(/^[A-Za-z0-9_-]+$/.test(packed), 'a link\'s data is safe in an address');
check(packed.length < 2500, `a short link (${packed.length} characters)`);
const back = M.decode(packed);
check(!!back && back.heroes.length === 2 && back.heroes[0].name === 'Aziz' && back.heroes[1].name === 'Nilufar', 'the heroes come back');
check(back.heroes.every((h, i) => h.id !== heroes[i].id) && JSON.stringify(back.heroes[1].look) === JSON.stringify(nilu.look), 'with new ids and the same looks');
const again = M.toStory(back.book, back.heroes);
check(JSON.stringify(again.pages.map((p) => [p.title, p.text, p.scene])) === JSON.stringify(st.pages.map((p) => [p.title, p.text, p.scene])), 'the book comes back the same, page for page and picture for picture');
check(back.book.title === book.title && back.book.author === 'Asal' && back.book.moral === book.moral, 'title, author and moral');
// unused heroes stay home
const one = M.decode(M.encode(Object.assign({}, book, { pages: [book.pages[0]] }), heroes));
check(one.heroes.length === 1 && one.heroes[0].name === 'Aziz', 'only the heroes in the book travel');
// letters of every kind
const words = Object.assign({}, book, { title: "G'aroyib o'g'il — 신기한 아이 🌙", pages: [Object.assign({}, book.pages[0], { text: 'Ўзбекча ҳам бўлади. 한국어도 돼요! 🎈' })] });
const w2 = M.decode(M.encode(words, heroes));
check(w2.book.title === words.title && w2.book.pages[0].text === words.pages[0].text, 'Uzbek, Cyrillic, Korean and emoji survive the trip');
// whatever comes in is checked
const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
check(M.decode('') === null && M.decode('%%%') === null && M.decode('bm90IGpzb24') === null, 'not a book: nothing');
check(M.decode(b64({ v: 2, p: [[]] })) === null && M.decode(b64({ v: 1, p: [] })) === null, 'an unknown version or no pages: nothing');
const evil = M.decode(b64({ v: 1, t: '<img src=x onerror=alert(1)>', a: { x: 1 }, h: [['<b>X</b>', ['dragon', 'x', 'y', 'z', 'q', 99, 'a', 'gun', 7]], 5, null], p: [['<i>t</i>', 'Salom <script>', 'void', 'never', [['h0', 'evil', 1], ['h7'], ['wolf'], ['fox'], ['kite']]]].concat(Array.from({ length: 20 }, () => ['a', 'b', 'meadow', 'day', []])) }));
check(!!evil && evil.book.title === 'img src=x onerror=alert(1)' && evil.book.author === '', 'tags in a title are taken apart; an author that isn\'t text is dropped');
check(evil.heroes.length === 3 && evil.heroes[0].name === 'bX/b' && evil.heroes[0].look.who === 'boy' && evil.heroes[1].name === 'Qahramon', 'odd heroes are cleaned');
const ep = evil.book.pages[0];
check(evil.book.pages.length === M.MAX_PAGES && ep.title === 'it/i' && ep.text === 'Salom script' && ep.place === 'meadow' && ep.time === 'day', 'odd pages are cleaned');
check(ep.cast[0] && ep.cast[0].k === `h:${evil.heroes[0].id}` && ep.cast[0].mood === 'happy' && ep.cast[0].f === true && ep.cast[1] === null && ep.cast[2].k === 'wolf' && ep.cast[3] === null, 'odd slots are cleaned');
check(!!draws(M.toStory(evil.book, evil.heroes).pages[0].scene), 'and the cleaned book draws');
check(M.fromHash('#ertak=abc') === 'abc' && M.fromHash('ertak=abc') === 'abc' && M.fromHash('#zumrad') === null && M.fromHash('') === null, 'the link\'s data from the address');

// ---------- the story relay (Ertak estafetasi) ----------

// The child writes page one and sends it.
const asal = M.newHero('Asal', { who: 'girl', head: 'ponytail', wear: 'modern', color: 'pink' });
const relayBook = M.newBook('Asal', [asal]);
check(relayBook.relay === relayBook.id, 'a new book is its own relay');
relayBook.title = 'Asal va laylak';
relayBook.pages[0].text = 'Asal bir laylakni ko\'rdi.';
const sent = M.decode(M.encode(relayBook, [asal]));
check(sent.book.relay === relayBook.id && sent.book.id !== relayBook.id, 'the relay id travels in the link; the book gets a new id on the other phone');
// Grandma keeps it and writes page two.
const atGranny = M.adopt(sent, []);
check(atGranny.heroes.length === 1 && atGranny.heroes[0].name === 'Asal' && atGranny.book.relay === relayBook.id, 'kept on grandma\'s phone: with Asal, and the same relay');
const page2 = Object.assign(M.newPage(atGranny.book.pages[0]), { text: 'Laylak uni Toshkentga olib bordi!', by: 'Buvijon' });
atGranny.book.pages.push(page2);
check(page2.by === 'Buvijon' && M.newPage().by === '', 'a page knows who wrote it');
// Back to the child: Asal is matched to her own hero, not added twice.
const returned = M.decode(M.encode(atGranny.book, atGranny.heroes));
check(returned.book.relay === relayBook.id && returned.book.pages.length === 2 && returned.book.pages[1].by === 'Buvijon', 'back home: the same relay, two pages, page two by Buvijon');
const home = M.adopt(returned, [asal]);
check(home.heroes.length === 0 && home.book.pages[0].cast[0].k === `h:${asal.id}`, 'the child\'s own hero is matched (same name and look), not added again');
const other = M.newHero('Asal', { who: 'girl', head: 'braids' });
check(M.adopt(returned, [other]).heroes.length === 1, 'a hero with the same name but another look is a new hero');
// Who wrote what is shown only when more than one person wrote.
const two = M.toStory(home.book, [asal]);
check(two.pages[0].by === 'Asal' && two.pages[1].by === 'Buvijon', 'pages say who wrote them: Asal, then Buvijon');
check(M.toStory(relayBook, [asal]).pages.every((p) => !p.by), 'a book by one writer doesn\'t say it on every page');
check(M.writers(home.book).join() === 'Asal,Buvijon' && M.many(home.book) && !M.many(relayBook), 'writers');
// Old links and odd values
const oldLink = M.decode(Buffer.from(JSON.stringify({ v: 1, t: 'Eski', p: [['a', 'b', 'meadow', 'day', []]] })).toString('base64').replace(/=+$/, ''));
check(oldLink && oldLink.book.relay === oldLink.book.id, 'a link from before the relay starts its own');
check(M.cleanBook({ relay: '../x', pages: [] }, []).relay !== '../x' && M.cleanPage({ by: '<b>' + 'x'.repeat(40) }, []).by.length === M.LIMITS.by, 'an odd relay or writer is cleaned');

// ---------- kept on the profile ----------

const s = new Store();
check(Array.isArray(s.heroes()) && s.heroes().length === 0 && typeof s.myBooks() === 'object', 'a child starts with no heroes and no books');
s.heroes().push(aziz);
s.myBooks()[book.id] = book;
s.save();
const s2 = new Store();
check(s2.heroes()[0].name === 'Aziz' && s2.myBooks()[book.id].title === book.title, 'heroes and books are kept');
const old = s2.profile();
delete old.heroes;
delete old.myBooks;
check(Array.isArray(s2.heroes()) && typeof s2.myBooks() === 'object', 'a profile from before the story maker gets them too');

console.log(`${total - failed}/${total} passed (${M.ITEMS.length} pieces, ${M.PLACES.length} places)`);
process.exit(failed ? 1 : 0);
