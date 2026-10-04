/*
 * Yashirin yulduz (js/hiddenstar.js): every page of a library book hides
 * its star in the same place each time, inside the part of the picture no
 * screen crops, and clear of what is drawn there. The star leaves the rest
 * of the picture as it was, a made book has none, the count ignores what
 * isn't a page, and the menus have their Korean.
 * Run with: node tests/hiddenstar.test.js
 */
'use strict';

global.window = { matchMedia: () => ({ matches: false }) };
require('../js/art/core.js');
['people', 'animals', 'world', 'fx', 'landmarks'].forEach((f) => require(`../js/art/${f}.js`));
require('../js/book.js');
['folk', 'classic', 'twins', 'korea', 'holiday', 'short', 'alifbo'].forEach((f) => require(`../js/stories-${f}.js`));
require('../js/i18n.js');
require('../js/hiddenstar.js');
const { Art, HiddenStar: H, I18n } = window;
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

// ---------- where the stars hide ----------

const { BOX } = H;
check(BOX.x0 >= 40 && BOX.x1 <= 360 && BOX.y0 >= 160 && BOX.y1 <= 300, 'the stars stay where every screen shows the picture');
let pages = 0;
let crowded = 0;
Object.entries(db).forEach(([key, st]) => {
    let last = null;
    st.pages.forEach((p, i) => {
        const view = i + 1;
        pages++;
        const at = H.place(key, view, p.scene);
        check(Array.isArray(at) && at.every(Number.isInteger), `${key} ${view}: a place (${at})`);
        const [x, y] = at;
        check(x >= BOX.x0 && x <= BOX.x1 && y >= BOX.y0 && y <= BOX.y1, `${key} ${view}: (${x}, ${y}) is inside the safe part`);
        check(H.place(key, view, p.scene).join() === at.join(), `${key} ${view}: the same place every time`);
        check(!last || last.join() !== at.join(), `${key} ${view}: not where the page before hid it`);
        last = at;
        // clear of everything drawn, as far as the picture allows
        const clear = !(p.scene.items || []).some(([, ix = 200, iy = 256, o = {}]) => {
            const s = (o && o.s) || 1;
            return x > ix - 40 * s && x < ix + 40 * s && y > iy - 112 * s && y < iy + 10 * s;
        });
        if (!clear) crowded++;
    });
});
check(pages > 300, `every page of every book (${pages})`);
check(crowded / pages < 0.08, `almost every star is clear of the people and things drawn (${crowded} of ${pages} pages too full)`);
const spots = new Set(Object.entries(db).flatMap(([key, st]) => st.pages.map((p, i) => H.place(key, i + 1, p.scene).join())));
check(spots.size > pages * 0.9, `the places differ from page to page (${spots.size} for ${pages} pages)`);

// ---------- which books, and the count ----------

const zumrad = db.zumrad;
check(H.hides(zumrad) && !H.hides(Object.assign({}, zumrad, { mine: true })) && !H.hides(null), 'library books hide stars; a book a child made does not');
check(JSON.stringify(H.count(zumrad, null)) === JSON.stringify({ found: 0, total: zumrad.pages.length }), 'nothing found yet');
check(H.count(zumrad, { stars: { 1: 1, 3: 1, 0: 1, 99: 1, 4: 0 } }).found === 2, 'only real pages count');
check(H.count(Object.assign({}, zumrad, { mine: true }), { stars: { 1: 1 } }).total === 0, 'a made book: none to find');

// ---------- the star itself ----------

check(typeof Art.parts.hiddenstar === 'function', 'the star is a part the art engine draws');
const scene = zumrad.pages[0].scene;
const [sx, sy] = H.place('zumrad', 1, scene);
const seed = `zumrad:1:${JSON.stringify(scene)}`;
// (ids count renders, and animations are phased by the clock: neither is the picture)
const norm = (svg) => svg.replace(/art\d+-/g, 'art-').replace(/animation-delay:-?[\d.]+s/g, 'animation-delay:0s');
const plain = norm(Art.render(scene, { tall: true, seed }));
const withStar = (found) => norm(Art.render(scene, { tall: true, seed, top: [['hiddenstar', sx, sy, { found }]] }));
const starred = withStar(false);
const group = starred.match(/<g transform="[^"]*" data-w="hiddenstar"><g><circle r="26"[\s\S]*?<\/g><\/g><\/g><\/g>/);
check(!!group && group[0].includes('class="hs"') && group[0].includes('hs-glint') && group[0].includes('<polygon'), 'drawn with its name, a glint and a touch area');
check(group && starred.replace(group[0], '') === plain, 'the rest of the picture stays exactly as it was');
check(group && starred.endsWith(group[0] + '</svg>'), 'drawn last, above light and weather, so nothing covers it');
const found = withStar(true);
check(found.includes('class="hs is-found"') && found.replace(/ is-found/, '') === starred, 'a found star is the same star, marked found');

// ---------- the menus in Korean ----------

[
    'Yashirin yulduzlar', '🌟 Har sahifada bitta yulduz yashiringan. Topa olasizmi?', '🌟 Rasmlarda yulduzlar yashiringan. Qaytadan qarab chiqing!',
    '🌟 Yashirin yulduz topildi! +2 ball', '🌟 Hamma yulduzlar topildi! +2 ball', '🌟 Yashirin yulduzlar: 3/8', '🌟 Hamma yulduzlar topildi: 12/12',
].forEach((uz) => {
    const ko = I18n.translate(uz, 'ko');
    check(ko !== uz && hangul(ko) && !/[a-z]{2}/i.test(ko), `Korean menus: "${uz}" → "${ko}"`);
});
const read = (f) => require('fs').readFileSync(require('path').join(__dirname, '..', f), 'utf8');
const src = read('js/book.js') + read('js/app.js') + read('index.html');
['Yashirin yulduzlar', '🌟 Har sahifada bitta yulduz yashiringan. Topa olasizmi?', '🌟 Rasmlarda yulduzlar yashiringan. Qaytadan qarab chiqing!', '🌟 Yashirin yulduz topildi!', '🌟 Hamma yulduzlar topildi', '🌟 Yashirin yulduzlar: ']
    .forEach((t) => check(src.includes(t), `"${t}" is what the app shows`));

console.log(failed ? `\n${failed} of ${total} checks FAILED` : `\nall ${total} checks passed`);
process.exit(failed ? 1 : 0);
